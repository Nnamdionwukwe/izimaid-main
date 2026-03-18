import { useState } from "react";
import styles from "./FixedHeader.module.css";
import SideBar from "./SideBar";

export default function FixedHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.SubHeader1}>
        <a href="https://deusizisparkle.com">
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
    </>
  );
}
