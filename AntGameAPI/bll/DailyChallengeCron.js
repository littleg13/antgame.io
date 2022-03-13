const { updateConfigByID } = require("../dao/AdminDao");
const { ChallengeGenerator } = require("./ChallengeGenerator");
const Logger = require("../Logger");
const DailyChallengeHandler = require("../handler/DailyChallengeHandler");
const FlagHandler = require("../handler/FlagHandler");
const { getDailyChallengesInReverseOrder } = require("../dao/ChallengeDao");
const { ChampionshipOrchestrator } = require("./ChampionshipOrchestrator");
const { GenerateSolutionImage } = require("./RecordImageGenerator");

const handleDailyChallengeChange = async () => {
  try {
    if ((await FlagHandler.getFlagValue("run-daily-challenge-cron")) === false) {
      Logger.logCronMessage("skipping daily challenge cron swap");
      return;
    }
    Logger.logCronMessage("starting daily challenge swap");
    const currentDailyChallenge = (await getDailyChallengesInReverseOrder({ limit: 1 }))[0];
    Logger.logCronMessage(`current challenge is ${currentDailyChallenge._id}`);

    const newDailyChallengeID = await new ChallengeGenerator().generateDailyChallenge();
    Logger.logCronMessage(`new challenge generated : challengeID: ${newDailyChallengeID}`);

    if (currentDailyChallenge) {
      const challengeID = currentDailyChallenge._id;
      await updateConfigByID(challengeID, { active: false, order: 0 });
      Logger.logCronMessage("set old map inactive");

      if (currentDailyChallenge.championshipID) {
        const championshipID = currentDailyChallenge.championshipID;
        try {
          await ChampionshipOrchestrator.awardPointsForChallenge({ championshipID, challengeID });
          Logger.logCronMessage("awarded points for yesterdays challenge");
        } catch (e) {
          Logger.logCronMessage(`Could not award points for challenge : ${e}`);
        }
      }

      try {
        const solutionImagePath = await GenerateSolutionImage({ challengeID });
        await updateConfigByID(challengeID, { solutionImage: solutionImagePath });
        Logger.logCronMessage(`Generated and set solution image`);
      } catch (e) {
        Logger.logCronMessage(`Could not generate solution image : ${e}`);
      }
    } else {
      Logger.logCronMessage("skipping setting old map inactive");
    }

    if (newDailyChallengeID) {
      if (await FlagHandler.getFlagValue("should-bind-daily-to-championship")) {
        let currentChampionship = await ChampionshipOrchestrator.getCurrentDailyChampionship();
        if (currentChampionship === null) {
          currentChampionship = await ChampionshipOrchestrator.generateDailyChampionship();
          const lastChampionship = await ChampionshipOrchestrator.getLastMonthsChampionshipID();
          await ChampionshipOrchestrator.awardBadgesForChampionship({
            championshipID: lastChampionship,
          });
        }
        await ChampionshipOrchestrator.addConfigToChampionship(
          currentChampionship,
          newDailyChallengeID
        );
        Logger.logCronMessage("bound new config to the current championship");
      }

      await updateConfigByID(newDailyChallengeID, { active: true });
      DailyChallengeHandler.clearCache();
      Logger.logCronMessage("set new map active");
    } else {
      Logger.logCronMessage("could not set new map active due to no ID");
    }
  } catch (err) {
    Logger.logError("DailyChallengeCron", err);
  }
};
module.exports = { handleDailyChallengeChange };
