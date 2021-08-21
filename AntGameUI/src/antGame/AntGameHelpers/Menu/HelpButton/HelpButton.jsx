import { useEffect, useState } from "react";
import GenericModal from "../../../Helpers/GenericModal";
import { InfoIcon } from "../../Icons";
import styles from "./HelpButton.module.css";

const HelpButton = props => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    props.blockDrawHandler(showModal);
  }, [props, showModal]);

  return (
    <span>
      <div className={styles.container}>
        <div className={styles.button} onClick={() => setShowModal(true)}>
          <InfoIcon />
        </div>
      </div>
      {showModal ? (
        <GenericModal
          title={<span className={styles.bold}>Instructions</span>}
          onHide={() => setShowModal(false)}
          body={
            <div>
              <div>
                <h5 className={styles.bold}>The Essentials</h5>
                <p>
                  &#8226;&nbsp;
                  <span className={styles.bold}>
                    Place home tiles (by clicking on the map) and click play!
                  </span>
                  <br />
                  &#8226;&nbsp;Number of home tiles is limited to the number shown in the menu bar
                  (top right).
                  <br />
                  &#8226;&nbsp;Score is based on how much food the ants get home.
                </p>
              </div>
              <div>
                <h6 className={styles.bold}>Extra Details</h6>
                <p>
                  &#8226;&nbsp;Home tiles can be removed with 'Clear' or the eraser brush ('E' in
                  the top right).
                  <br />
                  &#8226;&nbsp;Click on your leaderboard rank (next to PR in the top left) to see
                  the challenge leaderboard.
                  <br />
                  &#8226;&nbsp;Click on the timer to go back to the challenge list (only when the
                  ants are paused).
                </p>
              </div>
            </div>
          }
        />
      ) : null}
    </span>
  );
};
export default HelpButton;
