import FirstHeader from "./FirstHeader";
import FreeEstimateHeader from "./FreeEstimateHeader";
import Main from "./Main";
import MainFull from "./MainFull";
import OtherFooter from "./OtherFooter";
import styles from "./RequestEstimate.module.css";

export default function RequestEstimate() {
  return (
    <div>
      <FirstHeader />

      <div className={styles.fixedHeader}>
        <FreeEstimateHeader />
      </div>

      <div className={styles.mainDivMain}>
        <Main />
      </div>

      <div className={styles.mainDivMainFull}>
        <MainFull />
      </div>

      <OtherFooter />
    </div>
  );
}
