import { useNavigate } from "react-router-dom";
import styles from "./ResidentialSideBar.module.css";

export default function CleaningTipsSideBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.residentialMain}>
        <div className={styles.residentialDI}>
          <div
            onClick={() => navigate("/general-household")}
            className={styles.hoverMainDiv1}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>General Household</p>
          </div>

          <div
            onClick={() => navigate("/kitchens")}
            className={styles.hoverMainDiv2}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Kitchens</p>
          </div>

          <div
            onClick={() => navigate("/move-cleaning-tips")}
            className={styles.hoverMainDiv3}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Move-In Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/office-cleaning-tips")}
            className={styles.hoverMainDiv4}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Office </p>
          </div>

          <div
            onClick={() => navigate("/living-rooms")}
            className={styles.hoverMainDiv5}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para5}>Living Rooms</p>
          </div>

          <div
            onClick={() => navigate("/bathrooms")}
            className={styles.hoverMainDiv6}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Bathrooms</p>
          </div>

          <div
            onClick={() => navigate("/kids-rooms")}
            className={styles.hoverMainDiv7}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Kid's Rooms</p>
          </div>

          <div
            onClick={() => navigate("/bedrooms")}
            className={styles.hoverMainDiv8}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Bedrooms</p>
          </div>

          <div
            onClick={() => navigate("/schedules-charts-checklists")}
            className={styles.hoverMainDiv9}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Schedules, Charts and Checklists</p>
          </div>

          <div
            onClick={() => navigate("/spring-cleaning")}
            className={styles.hoverMainDiv9}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Spring Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/how-to-save-time")}
            className={styles.hoverMainDiv9}
          >
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
