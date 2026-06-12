import { useState } from "react";
import styles from "./Reviews.module.css";
import { Link } from "react-router-dom";

// Balanced, realistic client reviews across different Deusizi platform sectors
const clientReviews = [
  {
    id: 1,
    name: "Michael Solace",
    role: "Estate Homeowner",
    service: "Facility Management & Deep Cleaning",
    text: "The office was incredibly attentive to our large estate maintenance request. They tackled a highly complex, post-renovation cleanup flawlessly. I highly recommend their platform for structured property management.",
  },
  {
    id: 2,
    name: "Johnson King",
    role: "Working Professional",
    service: "Nannies & Babysitting Marketplace",
    text: "As dual-income professionals studying at the same time, finding verified childcare was a constant stress. The background-checked nanny we hired through Deusizi has been phenomenal. Exceptional platform security.",
  },
  {
    id: 3,
    name: "Philip Evans",
    role: "Short-Let Rental Host",
    service: "Hospitality Pros & AC Repair",
    text: "First time trying an on-demand marketplace for my apartments. The certified AC technicians and rapid-turnaround hospitality cleaners arrived exactly on schedule. My guests left a perfect rating.",
  },
  {
    id: 4,
    name: "Nnamdi Gideon",
    role: "Corporate Office Manager",
    service: "Commercial Cleaning & Electricians",
    text: "Impressive corporate facility support. From the digital onboarding to the execution of full office wiring checks and deep sanitation, the supervisors kept communication transparent throughout.",
  },
  {
    id: 5,
    name: "Muhamed Ismail",
    role: "Residential Client",
    service: "Handymen & Regular Housekeeping",
    text: "I have used Deusizi for minor plumbing fixes and routine cleaning over the last few months. The attention to detail is excellent and having escrow payment security gives me total peace of mind.",
  },
];

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === clientReviews.length - 1 ? prev : prev + 1,
    );
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? prev : prev - 1));
  };

  const currentReview = clientReviews[activeIndex];

  return (
    <div className={styles.wrapper}>
      {/* Section Header */}
      <header className={styles.sectionHeader}>
        <h1 className={styles.sectionTitle}>Hear From Our Clients</h1>
        <div className={styles.titleUnderline} />
      </header>

      {/* Main Review Card Slider Container */}
      <div className={styles.carouselFrame}>
        <div className={styles.quoteGraphicWrapper}>
          <i className="fa fa-quote-left" aria-hidden="true" />
        </div>

        <blockquote className={styles.testimonialContent}>
          <p className={styles.reviewBody}>"{currentReview.text}"</p>

          <div className={styles.tagGroup}>
            <span className={styles.serviceBadge}>{currentReview.service}</span>
          </div>
        </blockquote>

        <footer className={styles.cardFooterLayout}>
          <div className={styles.metaBlock}>
            <strong className={styles.clientName}>{currentReview.name}</strong>
            <span className={styles.clientRole}>{currentReview.role}</span>
          </div>

          <div className={styles.ratingsBlock}>
            <span className={styles.ratingNumeric}>5.0</span>
            <div className={styles.starsWrapper}>
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fa fa-star" aria-hidden="true" />
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* Modern Slider Interactive Navigation Controls */}
      <div className={styles.controlsBar}>
        <button
          type="button"
          onClick={handlePrevious}
          disabled={activeIndex === 0}
          className={styles.arrowButton}
          aria-label="Previous testimonial"
        >
          <i className="fa fa-chevron-left" aria-hidden="true" />
        </button>

        <div className={styles.paginationDotsRow}>
          {clientReviews.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={activeIndex === clientReviews.length - 1}
          className={styles.arrowButton}
          aria-label="Next testimonial"
        >
          <i className="fa fa-chevron-right" aria-hidden="true" />
        </button>
      </div>

      {/* Trust Stamp & Conversion Call to Action */}
      <div className={styles.trustBanner}>
        <div className={styles.trustInnerLayout}>
          <div className={styles.brandingBlock}>
            <a href="https://deusizisparkle.com" className={styles.logoAnchor}>
              <img
                className={styles.brandLogoImage}
                alt="IziMaid Logo"
                src="deusizi.jpg"
              />
            </a>
            <p className={styles.brandPromiseText}>
              The <strong>Deusizi Done Right Promise</strong> is proudly backed
              by the Deusizi Group of Companies.
            </p>
          </div>

          <Link to="/request-a-free-estimate" className={styles.ctaLinkButton}>
            <i className="fa fa-calendar-check-o" aria-hidden="true" />
            <span>Request a Free Estimate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
