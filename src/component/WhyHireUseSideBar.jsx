import styles from "./ResidentialSideBar.module.css";

export default function WhyHireUsSideBar() {
  return (
    <>
      <div className={styles.de}>
        <div className={styles.residentialDI}>
          <div className={styles.hoverMainDiv10}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Our Approach</p>
          </div>

          <div className={styles.hoverMainDiv11}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Our Results</p>
          </div>

          <div className={styles.hoverMainDiv12}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para6}>Our Commitment</p>
          </div>
        </div>
      </div>
    </>
  );
}
