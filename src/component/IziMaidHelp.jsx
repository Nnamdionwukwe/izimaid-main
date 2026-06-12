import styles from "./IziMaidHelp.module.css";

export default function IziMaidHelp() {
  return (
    <section className={styles.sectionContainer}>
      {/* Hero & Introduction */}
      <div className={styles.textBlockWrapper}>
        <h1 className={styles.primaryHeading}>
          Flexible Marketplace Solutions Built Around You
        </h1>
        <p className={styles.leadBodyText}>
          Our on-demand home and facility management marketplace is explicitly
          designed to adapt to your specific schedule. We operate with absolute
          flexibility—meaning no rigid contracts—to deliver a completely
          worry-free, seamless booking experience every single time.
        </p>
        <p className={styles.secondaryBodyText}>
          Through our unified platform, you can instantly connect with and hire
          verified professionals across dozens of specialties. Whether you need
          to book handymen for quick repairs, certified AC technicians for
          seasonal servicing, or background-checked nannies for reliable
          childcare, our platform bridges the gap between top-tier talent and
          your immediate needs. We even feature a specialized network to hire
          hospitality professionals capable of managing luxury estates,
          short-let rentals, and corporate facilities.
        </p>
        <p className={styles.secondaryBodyText}>
          From deep sanitization of kitchen countertops to complex electrical
          diagnostics, our marketplace professionals don't miss a spot. We are
          always happy to help you scale your service packages to perfectly fit
          your property, lifestyle, or business needs.
        </p>
      </div>

      {/* How It Works Section */}
      <div className={styles.processContainer}>
        <div className={styles.processHeader}>
          <h2 className={styles.sectionHeading}>
            How It Works: Simple, Secure, &amp; Seamless
          </h2>
          <p className={styles.sectionSubheading}>
            We have streamlined our marketplace into a completely transparent
            three-step process to give you absolute peace of mind:
          </p>
        </div>

        {/* Step Grid Cards */}
        <div className={styles.stepCardGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>01</div>
            <h4 className={styles.stepTitle}>Browse</h4>
            <p className={styles.stepDescription}>
              Filter by service category, read verified customer reviews, and
              compare profiles of highly rated professionals near you.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>02</div>
            <h4 className={styles.stepTitle}>Book</h4>
            <p className={styles.stepDescription}>
              Schedule the exact date and time that fits your lifestyle with
              just a few clicks—no lengthy negotiations required.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepBadge}>03</div>
            <h4 className={styles.stepTitle}>Pay Safely via Escrow</h4>
            <p className={styles.stepDescription}>
              Secure your transaction instantly through our trusted gateway.
              Your funds are held safely in a secure escrow payment system and
              are only released once the job is completed to your satisfaction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
