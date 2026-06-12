import styles from "./ReviewsFull.module.css";
import { Link } from "react-router-dom";

// Comprehensive marketplace review data layout object matching the entire platform ecosystem
const marketplaceReviews = [
  {
    name: "Michael Solace",
    role: "Estate Homeowner",
    service: "Facility Management & Deep Cleaning",
    text: "The office was incredibly attentive to our large estate maintenance request. They tackled a highly complex, post-renovation cleanup flawlessly. I highly recommend their platform for structured property management.",
  },
  {
    name: "Johnson King",
    role: "Working Professional",
    service: "Nannies & Childcare Marketplace",
    text: "As dual-income professionals studying at the same time, finding verified childcare was a constant stress. The background-checked nanny we hired through Deusizi has been phenomenal. Exceptional platform security.",
  },
  {
    name: "Philip Evans",
    role: "Short-Let Rental Host",
    service: "Hospitality Pros & AC Repair",
    text: "First time trying an on-demand marketplace for my apartments. The certified AC technicians and rapid-turnaround hospitality cleaners arrived exactly on schedule. My guests left a perfect rating.",
  },
  {
    name: "Nnamdi Gideon",
    role: "Corporate Office Manager",
    service: "Commercial Cleaning & Electricians",
    text: "Its impressive corporate facility support. From digital onboarding to the execution of full office wiring checks and deep sanitation, the supervisors kept communication transparent throughout.",
  },
  {
    name: "Muhamed Ismail",
    role: "Residential Client",
    service: "Handymen & Regular Housekeeping",
    text: "I have used Deusizi for minor plumbing fixes and routine cleaning over the last few months. The attention to detail is excellent and having escrow payment security gives me total peace of mind.",
  },
];

export default function ReviewsFull() {
  return (
    <div className={styles.wrapperContainer}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <h1 className={styles.mainTitle}>Hear From Our Clients</h1>
        <div className={styles.titleIndicatorBar} />
      </div>

      {/* Grid Main Viewport Display Wrapper Layout */}
      <main className={styles.gridContainerPane}>
        <ul className={styles.reviewsFlexGrid}>
          {marketplaceReviews.map((review, index) => (
            <li key={index} className={styles.reviewCard}>
              <div className={styles.quoteDecorativeIcon}>
                <i className="fa fa-quote-left" aria-hidden="true"></i>
              </div>

              <blockquote className={styles.quoteBlockContent}>
                <p className={styles.reviewParagraphText}>"{review.text}"</p>
                <span className={styles.serviceMetaBadge}>
                  {review.service}
                </span>
              </blockquote>

              <div className={styles.cardFooterLayout}>
                <div className={styles.clientMetaDetails}>
                  <h4 className={styles.clientName}>{review.name}</h4>
                  <span className={styles.clientSubtitle}>{review.role}</span>
                </div>

                <div className={styles.starsScoringBlock}>
                  <span className={styles.scoreNumber}>5.0</span>
                  <div className={styles.starIconsRow}>
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fa fa-star" aria-hidden="true" />
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Corporate Promise Banner Container */}
      <footer className={styles.trustBannerFooter}>
        <div className={styles.trustInnerLayout}>
          <div className={styles.brandingBlock}>
            <a
              href="https://izimaid-sage.vercel.app"
              className={styles.logoAnchorLink}
            >
              <img
                className={styles.companyBrandLogo}
                alt="IziMaid Logo"
                src="izimaid.jpg"
              />
            </a>
            <p className={styles.promiseStatement}>
              The <strong>Deusizi Done Right Promise</strong> is proudly
              delivered by Deusizi, a member of the Deusizi Group of Companies.
            </p>
          </div>

          <Link
            to="/request-a-free-estimate"
            className={styles.conversionCtaBtn}
          >
            <i className="fa fa-calendar-check-o" aria-hidden="true" />
            <span>Request a Free Estimate</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
