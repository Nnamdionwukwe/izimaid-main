import styles from "./ResidentialSideBar.module.css";

export default function CleaningTipsSideBar() {
  return (
    <>
      <div className={styles.residentialMain}>
        <div className={styles.residentialDI}>
          <div className={styles.hoverMainDiv1}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>General Household</p>
          </div>

          <div className={styles.hoverMainDiv2}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Kitchens</p>
          </div>

          <div className={styles.hoverMainDiv3}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Move-In Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv4}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Office </p>
          </div>

          <div className={styles.hoverMainDiv5}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para5}>Living Rooms</p>
          </div>

          <div className={styles.hoverMainDiv6}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Bathrooms</p>
          </div>

          <div className={styles.hoverMainDiv7}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Kid's Rooms</p>
          </div>

          <div className={styles.hoverMainDiv8}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Bedrooms</p>
          </div>

          <div className={styles.hoverMainDiv9}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Schedules, Charts and Checklists</p>
          </div>

          <div className={styles.hoverMainDiv9}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Spring Cleaning</p>
          </div>

          <div className={styles.hoverMainDiv9}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>How to Save Time</p>
          </div>

          <div className={styles.hoverMainDiv9}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Laundry Rooms</p>
          </div>
        </div>
      </div>
    </>
  );
}
