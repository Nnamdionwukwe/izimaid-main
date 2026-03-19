import { useNavigate } from "react-router-dom";
import styles from "./ResidentialSideBar.module.css";

export default function ResidentialSideBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.residentialMain}>
        <div className={styles.residentialDI}>
          <div
            onClick={() => navigate("/recurring-cleaning")}
            className={styles.hoverMainDiv1}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Recurring Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/one-time-cleaning")}
            className={styles.hoverMainDiv2}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>One Time Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/move-in-cleaning")}
            className={styles.hoverMainDiv3}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Move-In Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/eco-friendly-cleaning")}
            className={styles.hoverMainDiv4}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Eco Friendly Cleaning </p>
          </div>

          <div
            onClick={() => navigate("/apartment-cleaning")}
            className={styles.hoverMainDiv5}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para5}> Apartment and Condo Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/occasional-cleaning")}
            className={styles.hoverMainDiv6}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Occasional Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/move-out-cleaning")}
            className={styles.hoverMainDiv7}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Move-out Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/home-cleaning")}
            className={styles.hoverMainDiv8}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Home Cleaning</p>
          </div>

          <div
            onClick={() => navigate("/special-event-cleaning")}
            className={styles.hoverMainDiv9}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Special Event Cleaning</p>
          </div>
        </div>
      </div>
    </>
  );
}
