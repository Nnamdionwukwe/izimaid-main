import { useNavigate } from "react-router-dom";
import styles from "./RequestEstimate.module.css";

export default function FreeEstimateHeader() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.SubHeader1}>
        <div onClick={() => navigate("/")}>
          <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
        </div>

        <div className={styles.hamburger}>
          <div className={styles.number}>
            <h1>0803 058 8774</h1>
          </div>

          <a href="tel: +2348030588774" className={styles.sub2}>
            <i class="fa fa-phone" aria-hidden="true"></i>
            <p>Call Us</p>
          </a>
        </div>
      </div>
    </>
  );
}
