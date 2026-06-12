import { useNavigate } from "react-router-dom";
import styles from "./Questions.module.css";

export default function Questions() {
  const navigate = useNavigate();

  return (
    <section className={styles.faqSectionWrapper}>
      <div className={styles.faqContainerCard}>
        {/* Semantic Layout Heading elements */}
        <h2 className={styles.faqMainTitle}>
          Reliable Answers to Your Most Common Questions
        </h2>
        <div className={styles.decorativeAccentLine} />

        <p className={styles.faqDescriptionText}>
          Have additional questions regarding booking platform professionals,
          escrow security payments, or scheduling specialized domestic care,
          skilled trades, and facility maintenance?
        </p>

        {/* Premium UX Action Control Button */}
        <button
          type="button"
          onClick={() => navigate("/faq")}
          className={styles.faqCtaButton}
        >
          <span>Explore Our Full Knowledge Base</span>
          <i className="fa fa-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
