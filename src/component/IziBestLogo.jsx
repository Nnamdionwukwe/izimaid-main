import { useNavigate } from "react-router-dom";
import styles from "./IziBestLogo.module.css";

export default function IziBestLogo() {
  const navigate = useNavigate();

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContainer}>
        {/* Brand Logo Grid Header */}
        <div className={styles.logoBrandingRow}>
          <a href="https://deusizisparkle.com" className={styles.logoLink}>
            <img
              className={styles.brandLogo}
              alt="Deusizi Sparkle Logo"
              src="deusizi.jpg"
            />
          </a>
          <div className={styles.brandVerticalDivider} />
          <a href="http://deusiziinterior.com" className={styles.logoLink}>
            <img
              className={styles.subsidiaryLogo}
              alt="Deusizi Interior Logo"
              src="izibest.jpg"
            />
          </a>
        </div>

        {/* Corporate Mission Text */}
        <div className={styles.corporateContentBlock}>
          <h2 className={styles.groupHeading}>
            Deusizi is a premier multi-vertical home service marketplace and a
            proud member of the Deusizi Group of Companies.
          </h2>
          <p className={styles.groupDescription}>
            Searching through dozens of fragmented home service providers is a
            thing of the past. Rely on Deusizi’s unified digital marketplace
            platform to instantly hire trusted, local, and background-checked
            professionals near you—covering specialized domestic care, skilled
            trades, handymen, AC technicians, and estate facility management.
          </p>
        </div>

        {/* Premium Functional Download Action Grid Layout */}
        <div className={styles.actionDashboardGrid}>
          {/* Ecosystem Discovery Card */}
          <div className={styles.dashboardCard}>
            <h3 className={styles.cardHeading}>
              Deusizi Group is all you need to remember
            </h3>
            <button
              type="button"
              onClick={() => navigate("/deusizi-group")}
              className={styles.corporateCtaButton}
            >
              <span className={styles.ctaLabelText}>
                Discover Deusizi Group
              </span>
              <span className={styles.ctaArrowSymbol}>&rarr;</span>
            </button>
          </div>

          {/* App Store Download Card */}
          <div className={styles.dashboardCard}>
            <h3 className={styles.cardHeading}>Download the On-Demand App</h3>
            <div className={styles.appStoresFlexRow}>
              <button
                type="button"
                onClick={() => navigate("/app")}
                className={styles.appStoreButton}
              >
                <i className="fa-brands fa-apple" aria-hidden="true" />
                <span className={styles.storeButtonText}>App Store</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/app")}
                className={styles.appStoreButton}
              >
                <i className="fa-brands fa-google-play" aria-hidden="true" />
                <span className={styles.storeButtonText}>Google Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
