import React, { useEffect, useState } from "react";
import styles from "./ChallengeModal.module.css";
import ChallengeHandler from "../../Challenge/ChallengeHandler";
import AuthHandler from "../../Auth/AuthHandler";
import GenericModal from "../../Helpers/GenericModal";

const ChallengeModal = props => {
  const [isWrRun, setIsWrRun] = useState(false);
  const [records, setRecords] = useState();

  useEffect(() => {
    const wrID = ChallengeHandler.addWrListener(isWrRun => setIsWrRun(isWrRun));
    const recordID = ChallengeHandler.addRecordListener(records => setRecords(records));
    return () => {
      ChallengeHandler.removeWrListener(wrID);
      ChallengeHandler.removeRecordListener(recordID);
    };
  }, []);

  const scoreIsNice = props.challengeHandler?.score.toString().includes("69");
  return (
    <div>
      {props.show ? (
        <GenericModal
          alwaysShow
          closeMessage={scoreIsNice ? "Nice" : "Close"}
          title={`Results: ${props.challengeHandler?.config.name}`}
          onHide={() => props.closeModal()}
          body={
            <div className={styles.body}>
              <div className={styles.runInfo}>
                {AuthHandler.isAnon ? (
                  <h6>
                    <br />
                    <strong>Score not saved</strong>
                    <br />
                    Login to get on the leaderboard and <br />
                    track personal records.
                  </h6>
                ) : null}
                {isWrRun ? <h4 className={styles.newWR}>New World Record!</h4> : null}
                {props.challengeHandler?.isPB ? (
                  <div>
                    <h5 className={styles.newPB}>New Personal Record</h5>
                    <h6 className={styles.leaderboardRank}>
                      Leaderboard Rank: <strong>{records?.rank}</strong>
                      <span className={styles.playerCount}>
                        {records.playerCount ? `/${records.playerCount}` : null}
                      </span>
                    </h6>
                  </div>
                ) : null}
              </div>
              <h5 className={styles.score}>Score</h5>
              <h5>{props.challengeHandler?.score}</h5>
            </div>
          }
        />
      ) : null}
    </div>
  );
};

export default ChallengeModal;
