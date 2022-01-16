const { updateConfigByID } = require("../dao/AdminDao");
const { getMostRecentDailyChallenge } = require("../dao/ChallengeDao");
const { ChallengeGenerator } = require("./ChallengeGenerator");
const Logger = require("../Logger");
const { RecurrenceRule, scheduleJob } = require("node-schedule");

const handleDailyChallengeChange = async () => {
  LogMessage("starting daily challenge swap");
  const currentDailyChallenge = await getMostRecentDailyChallenge();
  LogMessage(`current challenge is ${currentDailyChallenge._id}`);

  const newDailyChallengeID = await new ChallengeGenerator().generateDailyChallenge();
  LogMessage(`new challenge generated : challengeID: ${newDailyChallengeID}`);

  if (currentDailyChallenge) {
    await updateConfigByID(currentDailyChallenge._id, { active: false, order: 0 });
    LogMessage("set old map inactive");
  } else {
    LogMessage("skipping setting old map inactive");
  }
  if (newDailyChallengeID) {
    await updateConfigByID(newDailyChallengeID, { active: true });
    LogMessage("set new map active");
  } else {
    LogMessage("could not set new map active due to no ID");
  }
};

const initializeScheduledTask = () => {
  if (process.env.environment) {
    const job = scheduleJob({ hour: 12, minute: 0 }, handleDailyChallengeChange);
    LogMessage(`cron initialized, next run at ${job.nextInvocation()}`);
  } else {
    console.log("Skipping initializing crons");
  }
};
module.exports = { handleDailyChallengeChange, initializeScheduledTask };

const LogMessage = message => {
  Logger.log({
    message: "Daily challenge cron",
    cronMessage: message,
  });
};
