import styles from "./PoweredByGestech.module.css";

export default function PoweredByGestech() {
  return (
    <div className={styles.wrap}>
      <span className={styles.brand}>
        Powered by <span className={styles.ges}>GES</span>tech
      </span>
    </div>
  );
}
