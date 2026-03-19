import { useNavigate } from "react-router-dom";
import styles from "./ResidentialSideBar.module.css";

export default function LightCommercialSideBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.residentialDI}>
        <div
          onClick={() => navigate("/recurring-cleaning")}
          className={styles.hoverMainDiv1}
        >
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>Recurring Cleaning</p>
        </div>

        <div
          onClick={() => navigate("/One-time-cleaning")}
          className={styles.hoverMainDiv2}
        >
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>One Time Cleaning</p>
        </div>

        <div
          onClick={() => navigate("occasional-cleaning")}
          className={styles.hoverMainDiv6}
        >
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>Occasional Cleaning</p>
        </div>
      </div>
    </>
  );
}
