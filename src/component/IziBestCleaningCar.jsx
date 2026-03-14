import styles from "./IziBestCleaningCar.module.css";

export default function IziBestCleaningCar() {
  return (
    <div className={styles.main}>
      <div className={styles.Submain}>
        <div className={styles.SubmainDiv}>
          <div className={styles.imgDiv}>
            <img
              alt="iziBest Cleaning Car"
              src="https://png.pngtree.com/png-clipart/20240616/original/pngtree-trends-in-car-wash-technology-png-image_15341820.png"
            />
          </div>

          <div className={styles.Submain}>
            <div className={styles.SubDiv}>
              <h1>Find an IziMaid Near Me</h1>
              <p>Let us know how we can help you today.</p>

              <div className={styles.SubmainFlex}>
                <div className={styles.Submain2}>
                  <i class="fa fa-map-marker" aria-hidden="true"></i>

                  <input type="text" placeholder="Enter Zip/Postal Code" />
                </div>

                <h4 className={styles.find}>Find My IziMaid</h4>
              </div>

              <div className={styles.Submain}>
                <div className={styles.Submain3}>
                  <h2>Call us at +2348030588774</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
