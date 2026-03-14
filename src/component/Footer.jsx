import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <div>
      <div className={styles.footerDiv}>
        <div className={styles.footerDiv2}>
          <a href="https://izimaid-sage.vercel.app">
            <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
          </a>

          <a href="tel: +2348030588774" className={styles.call}>
            <i class="fa-solid fa-phone"></i>

            <h2>0803 058 8774</h2>
          </a>
          <div className={styles.icons}>
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-instagram"></i>
            <i class="fa-brands fa-x-twitter"></i>
            <i class="fa-brands fa-youtube"></i>
            <i class="fa-brands fa-linkedin"></i>
          </div>
        </div>

        <div className={styles.footerDiv3}>
          <div className={styles.footerDivSub}>
            <h3>SERVICES</h3>

            <p className={styles.para}></p>

            <p className={styles.para2}>Residential</p>

            <p className={styles.para2}>Light Commercial</p>
          </div>

          <div className={styles.footerDivSub}>
            <h3>COMPANY</h3>

            <p className={styles.para}></p>

            <p className={styles.para2}>Why Hire Us</p>

            <p className={styles.para2}>About Us</p>

            <p className={styles.para2}>Contact Us</p>

            <p className={styles.para2}>Apply Locally</p>

            <p className={styles.para2}>Aplicar Localmente</p>

            <p className={styles.para2}>Own a Franchise</p>
          </div>

          <div className={styles.footerDivSub}>
            <h3>RESOURCES</h3>

            <p className={styles.para4}></p>

            <p className={styles.para2}>Practically Spotless Blog</p>

            <p className={styles.para2}>CLeaning TIps</p>

            <p className={styles.para2}>Our Locations</p>

            <p className={styles.para2}>Site Map</p>

            <p className={styles.para2}>Corporate Home</p>

            <p className={styles.para2}>Gift Certificate</p>
          </div>
        </div>
      </div>

      <div className={styles.footerDiv4}>
        <p className={styles.border}></p>
        <p className={styles.border2}>
          This information is not intended as an offer to sell, or the
          solicitation of an offer to buy, a franchise. It is for information
          purposes only. Currently, the following states regulate the offer and
          sale of franchises: Lagos, Abuja. If you are a resident of or want to
          locate a franchise in one of these states, we will not offer you a
          franchise unless and until we have complied with applicable pre-sale
          registration and disclosure requirements in your state.
        </p>

        <p className={styles.border3}>A clean you can count on.®</p>
      </div>

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
