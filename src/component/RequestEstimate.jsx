import FirstHeader from "./FirstHeader";
import FreeEstimateHeader from "./FreeEstimateHeader";
import Main from "./Main";
import MainFull from "./MainFull";
import styles from "./RequestEstimate.module.css";

export default function RequestEstimate() {
  return (
    <>
      <div>
        {/* <FirstHeader /> */}
        <div className={styles.homeMain}>
          <div className={styles.header2}>
            <a className={styles.headerLink} href="http://deusiziinterior.com">
              Deuseizi Group
            </a>
          </div>

          <div className={styles.fixedHeader}>
            <FreeEstimateHeader />
          </div>
        </div>

        <div className={styles.mainDivMain}>
          <Main />
        </div>

        <div className={styles.mainDivMainFull}>
          <MainFull />
        </div>

        {/* <OtherFooter /> */}
      </div>
    </>
  );
}
