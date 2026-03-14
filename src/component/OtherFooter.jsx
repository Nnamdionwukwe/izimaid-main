import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function OtherFooter() {
  return (
    <div>
      <div className={styles.h4Div}>
        <h4 className={styles.h4}>Terms of Use</h4>

        <h4 className={styles.h4}>Privacy Policy</h4>

        <h4 className={styles.h4}>Accessibilty</h4>

        <h4 className={styles.h4}>Do Not Sell My Info</h4>

        <h4 className={styles.h4}>Your Privacy Rights</h4>
      </div>

      <p className={styles.border4}>
        © 2025 IziBest Company and its affiliates. All rights reserved. IziBest
        is a registered trademark of IziBest Assetco LLC. IziMaid is a
        registered trademark of IziMaid SPV LLC. This site and all of its
        content is protected under applicable law, including laws of the U.S.
        and other countries. Each location is independently owned and operated.
        Services may vary by location. Please contact the franchise location for
        additional information.
      </p>
    </div>
  );
}
