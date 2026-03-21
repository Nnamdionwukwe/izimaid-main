import { Link, useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

export default function OtherFooter() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <div className={styles.h4Div}>
        <h4 onClick={() => navigate("/terms-of-service")} className={styles.h4}>
          Terms of Use
        </h4>

        <h4 onClick={() => navigate("/privacy-policy")} className={styles.h4}>
          Privacy Policy
        </h4>
        {/* 
        <h4 className={styles.h4}>Accessibilty</h4>

        <h4 className={styles.h4}>Do Not Sell My Info</h4>

        <h4 className={styles.h4}>Your Privacy Rights</h4> */}
      </div>

      <p className={styles.border4}>
        © {currentYear} Deusizi Sparkle Company and its affiliates. All rights
        reserved. Deusizi Sparkle is a registered trademark of Deusizi Sparkle
        SPV LLC. This site and all of its content is protected under applicable
        law, including laws of the U.S. and other countries. Each location is
        independently owned and operated. Services may vary by location. Please
        contact the franchise location for additional information.
      </p>

      <div className={styles.wrap}>
        <div className={styles.gridBg}></div>
        <div className={styles.card}>
          <div className={`${styles.corner} ${styles.tl}`}></div>
          <div className={`${styles.corner} ${styles.tr}`}></div>
          <div className={`${styles.corner} ${styles.bl}`}></div>
          <div className={`${styles.corner} ${styles.br}`}></div>
          <div className={styles.labelTop}>System</div>
          <div className={styles.brand}>
            Powered by <span>GES</span>tech
          </div>
          <div className={styles.divider}></div>
          <div className={styles.labelBot}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
