import { useNavigate } from "react-router-dom";
import styles from "./WeProvide.module.css";

export default function WeProvide() {
  const navigate = useNavigate();

  return (
    <section className={styles.sectionWrapper}>
      <div className={styles.containerBox}>
        {/* Primary Layout Headings */}
        <header className={styles.textHeader}>
          <h1 className={styles.mainTitle}>
            Complete Home Solutions, One Platform
          </h1>
          <h3 className={styles.subTitle}>
            Our Approach: On-Demand Verified Excellence
          </h3>
        </header>

        {/* Informational Body Layout Grid */}
        <div className={styles.contentBodyLayout}>
          <p className={styles.leadParagraph}>
            Looking for the highest-rated domestic and facility support networks
            near you? Deusizi bridges the gap with comprehensive residential
            services tailored to your busy lifestyle. From background-checked
            childcare and dedicated elderly caregivers to verified cleaning
            professionals and custom space management, we cover the full breadth
            of your personal household administration needs.
          </p>

          <p className={styles.secondaryParagraph}>
            Beyond specialized domestic care, our unified marketplace connects
            you directly with certified technicians across structural
            maintenance disciplines. Safely secure on-demand handymen, emergency
            plumbers, commercial cleaners, or certified AC technicians with
            complete financial protection using our integrated escrow payment
            gateways. Whether you need a simple appliance installation or
            structured hospitality support for high-end properties, we adapt to
            your lifestyle with absolute flexibility.
          </p>
        </div>

        {/* Refactored Interactive Conversion Buttons Layout */}
        <div className={styles.actionControlsRow}>
          <button
            type="button"
            onClick={() => navigate("/maids")}
            className={styles.primaryNavigateButton}
          >
            Explore Platform Services
          </button>

          <button
            type="button"
            onClick={() => navigate("/home-cleaning")}
            className={styles.secondaryTextButton}
          >
            Learn About Housekeeping
          </button>
        </div>
      </div>
    </section>
  );
}
