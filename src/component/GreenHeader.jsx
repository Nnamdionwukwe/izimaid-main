import { useState } from "react";
import styles from "./ThirdHeader.module.css";

export default function GreenHeader() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className={styles.thirdHeader}>
        <div className={styles.thirdHeader1}>
          <i class="fa fa-map-marker" aria-hidden="true"></i>

          <p>Find My Local IziBest Maid</p>
        </div>
      </div>

      {isOpen && (
        <>
          <div className={styles.ThirdHeader2}>
            <div className={styles.ThirdHeaderDiv}>
              <div className={styles.ThirdHeaderDiv}>
                <div className={styles.i}>
                  <i class="fa fa-calendar" aria-hidden="true"></i>
                </div>

                <div className={styles.spark}>
                  <p>
                    Sparking homes start with us - let us handle the cleaning!
                  </p>
                </div>

                <div className={styles.more}>Learn More</div>
              </div>
            </div>

            <div
              className={styles.times}
              onClick={() => setIsOpen((is) => !is)}
            >
              <p> &times;</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
