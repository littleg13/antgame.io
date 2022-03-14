import { useEffect, useState } from "react";
import { getRecentRuns } from "../AdminService";
import styles from "./RunsList.module.css";
import adminStyles from "../AdminStyles.module.css";
import { Link } from "react-router-dom";
import AutoRefreshButton from "./AutoRefreshButton";

const RunsList = props => {
  const [runsList, setRunsList] = useState(false);

  useEffect(() => {
    document.title = "Runs List";
    getRuns();
  }, []);

  const getRuns = () => {
    getRecentRuns(15).then(runs => {
      let list = [];
      for (let i = 0; i < runs.length; i++) {
        const run = runs[i];
        list.push(
          <RunsListElement
            theme={i % 2 === 0 ? adminStyles.even : adminStyles.odd}
            run={run}
            key={run._id}
          />
        );
      }
      setRunsList(list);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleBar}>
        <h3>Runs</h3>
        <AutoRefreshButton onRefresh={getRuns} />
      </div>
      {runsList ? runsList : null}
    </div>
  );
};
export default RunsList;

const RunsListElement = props => {
  const submissionDateTime = new Date(props.run.submissionTime);
  const [bodyTagStyles, setBodyTagStyles] = useState("");
  const [scoreTagStyles, setScoreTagStyles] = useState("");

  useEffect(() => {
    const tags = props.run.tags;
    if (tags.find(tag => tag.type === "wr"))
      setScoreTagStyles(`${adminStyles.purpleText} ${adminStyles.bold}`);
    else if (tags.find(tag => tag.type === "pr"))
      setScoreTagStyles(`${adminStyles.greenText} ${adminStyles.bold}`);

    if (tags.find(tag => tag.type === "failed verification" || tag.type === "falsely claimed pb"))
      setBodyTagStyles(adminStyles.redBackground);
    else if (tags.find(tag => tag.type === "random snapshot save"))
      setBodyTagStyles(adminStyles.yellowBackground);
    else if (tags.find(tag => tag.type === "run verified")) setBodyTagStyles(adminStyles.verified);
  }, [props.run.tags]);

  return (
    <div className={`${styles.runRow} ${props.theme} ${bodyTagStyles}`}>
      <span className={styles.time}>
        {submissionDateTime.toLocaleDateString()} {submissionDateTime.toLocaleTimeString()}
      </span>
      <span className={adminStyles.leftAlign}>
        {props.run.userID ? (
          <Link to={`/admin/user/${props.run.userID}`}>{props.run.username}</Link>
        ) : (
          "N/A"
        )}
      </span>
      <span>{props.run.tags ? props.run.tags.length : 0}</span>
      <span className={adminStyles.rightAlign}>
        <Link className={scoreTagStyles} to={`/admin/run/${props.run._id}`}>
          {props.run.score}
        </Link>
      </span>
      <span className={adminStyles.rightAlign}>
        <Link to={`/admin/config/${props.run.challengeID}`}>{props.run.name}</Link>
      </span>
    </div>
  );
};
