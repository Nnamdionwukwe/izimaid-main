import { useNavigate } from "react-router-dom";
import styles from "./ResidentialSideBar.module.css";

export default function WhyHireUsSideBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.de}>
        <div className={styles.residentialDI}>
          <div
            onClick={() => navigate("/our-approach")}
            className={styles.hoverMainDiv10}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Our Approach</p>
          </div>

          <div
            onClick={() => navigate("/our-results")}
            className={styles.hoverMainDiv11}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Our Results</p>
          </div>

          <div
            onClick={() => navigate("/our-commitment")}
            className={styles.hoverMainDiv12}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para6}>Our Commitment</p>
          </div>
        </div>
      </div>
    </>
  );
}
