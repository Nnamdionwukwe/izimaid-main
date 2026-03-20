import { useNavigate } from "react-router-dom";
import styles from "./ResidentialSideBar.module.css";

export default function PracticalSideBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.de}>
        <div className={styles.residentialDI}>
          <div
            onClick={() => navigate("/blog")}
            className={styles.hoverMainDiv10}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Guilds and Graphics</p>
          </div>

          <div
            onClick={() => navigate("/blog/seasonal")}
            className={styles.hoverMainDiv11}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Seasonal</p>
          </div>
          <div
            onClick={() => navigate("/blog/tips-and-tricks")}
            className={styles.hoverMainDiv12}
          >
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para6}>Tips and Tricks</p>
          </div>
        </div>
      </div>
    </>
  );
}
