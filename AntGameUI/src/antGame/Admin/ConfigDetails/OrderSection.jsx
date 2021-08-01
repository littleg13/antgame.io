import { useState } from "react";
import styles from "./ConfigDetails.module.css";

const OrderSection = props => {
  const [editable, setEditable] = useState(false);
  const [orderInputValue, setOrderInputValue] = useState(props.currentOrder);

  const saveEdit = () => {
    props.handleSave(parseInt(orderInputValue));
    setEditable(false);
  };

  return (
    <div className={styles.orderSection}>
      <div className={styles.orderEdit}>
        <span>Order:</span>{" "}
        {editable ? (
          <input
            type="number"
            className={styles.orderInput}
            onChange={e => setOrderInputValue(e.target.value)}
            value={orderInputValue}
          />
        ) : (
          <span>{props.currentOrder}</span>
        )}
      </div>
      <div className={styles.rightAlign}>
        {editable ? (
          <div>
            <div
              className={styles.orderEditButton}
              onClick={() => {
                setEditable(false);
                setOrderInputValue(props.currentOrder);
              }}
            >
              Cancel
            </div>
            <div className={styles.orderEditButton} onClick={() => saveEdit()}>
              Save
            </div>
          </div>
        ) : (
          <div className={styles.orderEditButton} onClick={() => setEditable(true)}>
            Edit
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderSection;
