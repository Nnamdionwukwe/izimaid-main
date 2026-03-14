import styles from "./Residential.module.css";

export default function WhyHireUs() {
  return (
    <>
      <div className={styles.residentialMain3}>
        <div className={styles.residentialDIv3}>
          <div className={styles.hoverMainDiv1}>
            <p className={styles.approch}>Our Approach</p>
          </div>

          <div className={styles.hoverMainDiv2}>
            <p className={styles.approch}>Our Results</p>
          </div>

          <div className={styles.hoverMainDiv3}>
            <p className={styles.approch}>Our Commitment</p>
          </div>

          <div className={styles.hoverMainDiv10}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Affordable Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv11}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Reviews</p>
          </div>

          <div className={styles.hoverMainDiv12}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para6}>Neighborly Done Right Promise</p>
          </div>
        </div>
      </div>
    </>
  );
}
