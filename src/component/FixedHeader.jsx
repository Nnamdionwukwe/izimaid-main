import { useState } from "react";
import styles from "./FixedHeader.module.css";
import SideBar from "./SideBar";

export default function FixedHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.SubHeader1}>
        <a href="https://izimaid-sage.vercel.app">
          <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
        </a>

        <div className={styles.hamburger}>
          <i
            onClick={() => setIsOpen((is) => !is)}
            class="fa fa-bars"
            aria-hidden="true"
          ></i>

          <div className={styles.sideBarMain}>
            {isOpen && <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />}
          </div>
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
