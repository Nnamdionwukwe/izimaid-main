import styles from "./Residential.module.css";

export default function LightCommercial() {
  return (
    <>
      <div className={styles.residentialDIv2}>
        <div className={styles.hoverMainDiv1}>
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>Recurring Cleaning</p>
        </div>

        <div className={styles.hoverMainDiv2}>
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>One Time Cleaning</p>
        </div>

        <div className={styles.hoverMainDiv6}>
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>Occasional Cleaning</p>
        </div>
      </div>
    </>
  );
}
