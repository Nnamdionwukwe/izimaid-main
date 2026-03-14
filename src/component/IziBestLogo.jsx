import { Link } from "react-router-dom";
import styles from "./IziBestLogo.module.css";

export default function IziBestLogo() {
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.containerDiv}>
          <a href="https://izimaid-sage.vercel.app">
            <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
          </a>

          <p className={styles.text}></p>
          <a className={styles.headerP} href="http://izibest.com">
            <img className={styles.logo} alt="Logo" src="izibest.jpg" />
          </a>
        </div>

        <h2 className={styles.containerh2}>
          IziMaid is part of the IziBest group of companies, family of home
          service providers.
        </h2>

        <p className={styles.containerp}>
          Searching through dozens of home service providers is a thing of the
          past. Rely on IziBest's Group of Companies, national network of
          trusted, local home service professionals for all your home service
          needs.
        </p>

        <div className={styles.googleDivMain}>
          <div className={styles.googleDiv}>
            <div className={styles.download1}>
              <h4>IziMaid is all you need to remember</h4>

              <div className={styles.iziMaid}>
                <h4>Discover IziMaid</h4>

                <h2>&rarr;</h2>
              </div>
            </div>
          </div>

          <p className={styles.app1}></p>

          <div className={styles.download}>
            <div>
              <h4>Download the App</h4>

              <div className={styles.google}>
                <div className={styles.store3}>
                  <i class="fa-brands fa-apple"></i>
                  <h4>App Store</h4>
                </div>

                <p className={styles.app2}></p>

                <div className={styles.store}>
                  <i class="fa-brands fa-google-play"></i>
                  <h4>Google Play Store</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
