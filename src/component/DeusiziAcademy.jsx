import { useNavigate } from "react-router-dom";
import styles from "./ResidentialSideBar.module.css";

export default function DeusiziAcademy() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.de}>
        <div className={styles.residentialDI}>
          <div
            onClick={() => navigate("/deusizi-academy/cleaner-training")}
            className={styles.hoverMainDiv10}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Cleaner Training</p>
          </div>

          <div
            onClick={() => navigate("/deusizi-academy/housekeeper-training")}
            className={styles.hoverMainDiv11}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Housekeeper Training</p>
          </div>
          <div
            onClick={() => navigate("/deusizi-academy/caregiver-training")}
            className={styles.hoverMainDiv12}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para6}>Caregiver Training</p>
          </div>
          <div
            onClick={() => navigate("/blog/tips-and-tricks")}
            className={styles.hoverMainDiv12}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para6}>Domestic Staff Certification</p>
          </div>
        </div>
      </div>
    </>
  );
}
