import styles from "./RequestEstimate.module.css";

export default function FreeEstimateHeader() {
  return (
    <>
      <div className={styles.SubHeader1}>
        <a href="https://izimaid-sage.vercel.app">
          <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
        </a>

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

      {/* <div className={styles.SubMain}>
        <div className={styles.SubHeader2}>
          <div className={styles.sub1}>
            <i class="fa fa-calendar" aria-hidden="true"></i>

            <p className={styles.subP}>Request a Free Estimate</p>
          </div>

          <div className={styles.sub2}>
            <i class="fa fa-phone" aria-hidden="true"></i>
            <p>Call Us</p>
          </div>
          <div className={styles.minsDiv}>
            <p className={styles.mins}>In under 2 mins</p>
          </div>
        </div>
      </div> */}
    </>
  );
}
