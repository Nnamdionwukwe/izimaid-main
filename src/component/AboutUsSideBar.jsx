import { useNavigate } from "react-router-dom";
import styles from "./ResidentialSideBar.module.css";

export default function AboutUsSideBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.residentialMain4}>
        <div className={styles.c}>
          <div className={styles.residentialDI}>
            <div
              onClick={() => navigate("/deusizi-group")}
              className={styles.hoverMainDiv1}
            >
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>A Deusizi Group of Companies</p>
            </div>

            <div
              onClick={() => navigate("/locations")}
              className={styles.hoverMainDiv2}
            >
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Locations</p>
            </div>

            <div
              onClick={() => navigate("/app")}
              className={styles.hoverMainDiv1}
            >
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>The Deusizi Sparkle App</p>
            </div>

            <div
              onClick={() => navigate("/gift-certificates")}
              className={styles.hoverMainDiv3}
            >
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Gift Certificates</p>
            </div>

            <div
              onClick={() => navigate("/franchise")}
              className={styles.hoverMainDiv1}
            >
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Own a Franchise</p>
            </div>

            <div
              onClick={() => navigate("/contact")}
              className={styles.hoverMainDiv2}
            >
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Contact Us</p>
            </div>

            <div
              onClick={() => navigate("/aplicar-localmente")}
              className={styles.residentialSub2}
            >
              <div className={styles.hoverMainDiv1}>
                <i class="fa fa-th-large" aria-hidden="true"></i>
                <p>Aplicar Localmente</p>
              </div>
            </div>

            <div
              onClick={() => navigate("/apply-locally")}
              className={styles.residentialSub2}
            >
              <div className={styles.hoverMainDiv1}>
                <i class="fa fa-th-large" aria-hidden="true"></i>
                <p>Apply Locally</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
