import styles from "./Residential.module.css";

export default function Residential() {
  return (
    <>
      <div className={styles.residentialMain}>
        <div className={styles.residentialDIv}>
          <div className={styles.hoverMainDiv1}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Recurring Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv2}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>One Time Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv3}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Movin_in Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv4}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Eco Friendly Cleaning </p>
          </div>

          <div className={styles.hoverMainDiv5}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para5}> Apartment and Condo Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv6}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Occasional Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv7}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Move-out Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv8}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Home Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv9}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Special Event Cleaning</p>
          </div>
        </div>
      </div>
    </>
  );
}
