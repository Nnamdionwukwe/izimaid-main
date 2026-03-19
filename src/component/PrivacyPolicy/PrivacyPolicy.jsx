import { useNavigate } from "react-router-dom";
import styles from "../Legal.module.css";

const SECTIONS = [
  {
    num: "01",
    id: "intro",
    title: "Introduction",
    content: (
      <>
        <p>
          Deusizi Sparkle ("we", "our", or "us") is committed to protecting your
          personal information. This Privacy Policy explains how we collect,
          use, store, share, and protect your data when you use our platform at{" "}
          <strong>deusizisparkle.com</strong>.
        </p>
        <div className={styles.highlight}>
          We will never sell your personal data to third parties. Your
          information is used solely to provide and improve our services, and to
          connect you with cleaning professionals in your area.
        </div>
        <p>
          By using our platform, you consent to the data practices described in
          this policy. If you do not agree, please discontinue use of our
          services.
        </p>
      </>
    ),
  },
  {
    num: "02",
    id: "collect",
    title: "Information We Collect",
    content: (
      <>
        <p>We collect the following categories of information:</p>
        <p>
          <strong>Account Information</strong> — when you sign in via Google, we
          receive your name, email address, and profile photo from your Google
          account.
        </p>
        <p>
          <strong>Booking Information</strong> — when you make a booking, we
          collect your service address, booking dates, duration, special
          instructions, and payment records.
        </p>
        <p>
          <strong>Profile Information</strong> — for maids, we collect
          additional details including bio, hourly rate, services offered,
          location, and availability.
        </p>
        <p>
          <strong>Usage Data</strong> — we automatically collect information
          about how you use our platform, including pages visited, actions
          taken, device type, browser, and IP address.
        </p>
        <p>
          <strong>Communications</strong> — if you contact our support team, we
          retain records of those communications to resolve disputes and improve
          our service.
        </p>
      </>
    ),
  },
  {
    num: "03",
    id: "use",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Create and manage your account on our platform</li>
          <li>Process bookings and facilitate payments through Paystack</li>
          <li>Connect customers with suitable cleaning professionals</li>
          <li>Send booking confirmations, reminders, and service updates</li>
          <li>Handle customer support requests and resolve disputes</li>
          <li>Improve our platform, detect fraud, and maintain security</li>
          <li>Send promotional communications (only with your consent)</li>
          <li>Comply with our legal obligations under Nigerian law</li>
        </ul>
        <p>
          We process your data on the legal basis of contractual necessity (to
          provide the service), legitimate interest (to improve and protect our
          platform), and consent (for marketing communications).
        </p>
      </>
    ),
  },
  {
    num: "04",
    id: "sharing",
    title: "How We Share Your Information",
    content: (
      <>
        <p>
          We share your information only in the following limited circumstances:
        </p>
        <p>
          <strong>With Maids</strong> — when you make a booking, your name,
          address, and booking details are shared with the assigned cleaning
          professional. This is necessary to deliver the service.
        </p>
        <p>
          <strong>With Payment Processors</strong> — your payment information is
          handled by Paystack in accordance with their Privacy Policy. We do not
          store your full card details.
        </p>
        <p>
          <strong>With Service Providers</strong> — we may share data with
          trusted third-party providers (e.g., cloud hosting, analytics) who
          process data on our behalf under strict data protection agreements.
        </p>
        <p>
          <strong>Legal Requirements</strong> — we may disclose information if
          required by Nigerian law, court order, or to protect the rights,
          property, or safety of our users.
        </p>
        <div className={styles.warning}>
          <strong>We never sell your personal data.</strong> We do not share
          your information with advertisers or data brokers under any
          circumstances.
        </div>
      </>
    ),
  },
  {
    num: "05",
    id: "storage",
    title: "Data Storage & Security",
    content: (
      <>
        <p>
          Your data is stored on secure servers hosted by Railway
          (infrastructure) and protected using industry-standard security
          measures including:
        </p>
        <ul>
          <li>Encryption in transit (HTTPS/TLS) and at rest</li>
          <li>JWT-based authentication with secure token expiry</li>
          <li>Redis caching with no persistent storage of sensitive data</li>
          <li>Regular security reviews and access controls</li>
          <li>Staff access to personal data limited to those who need it</li>
        </ul>
        <p>
          While we take significant steps to protect your data, no internet
          transmission is 100% secure. We encourage you to use a strong password
          and to notify us immediately if you suspect unauthorized access to
          your account.
        </p>
      </>
    ),
  },
  {
    num: "06",
    id: "retention",
    title: "Data Retention",
    content: (
      <>
        <p>
          We retain your personal data for as long as necessary to provide our
          services and comply with our legal obligations:
        </p>
        <ul>
          <li>
            <strong>Account data</strong> — retained while your account is
            active and for 2 years after closure
          </li>
          <li>
            <strong>Booking records</strong> — retained for 5 years for
            financial and legal compliance
          </li>
          <li>
            <strong>Payment data</strong> — handled and retained by Paystack per
            their policy
          </li>
          <li>
            <strong>Support communications</strong> — retained for 2 years
          </li>
          <li>
            <strong>Usage data</strong> — anonymized and retained for up to 12
            months
          </li>
        </ul>
        <p>
          You may request deletion of your personal data at any time, subject to
          our legal retention obligations. See Section 8 for your rights.
        </p>
      </>
    ),
  },
  {
    num: "07",
    id: "cookies",
    title: "Cookies & Tracking",
    content: (
      <>
        <p>We use minimal cookies and local storage to provide our services:</p>
        <ul>
          <li>
            <strong>Authentication tokens</strong> — stored in your browser's
            localStorage to keep you logged in securely
          </li>
          <li>
            <strong>Session preferences</strong> — stored in sessionStorage for
            temporary data like your selected booking role
          </li>
          <li>
            <strong>Analytics</strong> — we may use anonymous analytics tools to
            understand how our platform is used
          </li>
        </ul>
        <p>
          We do not use third-party advertising cookies or tracking pixels. You
          can clear your browser's localStorage at any time, which will log you
          out of the platform.
        </p>
      </>
    ),
  },
  {
    num: "08",
    id: "rights",
    title: "Your Rights",
    content: (
      <>
        <p>
          Under applicable Nigerian data protection law (NDPR) and general
          privacy principles, you have the right to:
        </p>
        <ul>
          <li>
            <strong>Access</strong> — request a copy of the personal data we
            hold about you
          </li>
          <li>
            <strong>Correction</strong> — ask us to correct inaccurate or
            incomplete data
          </li>
          <li>
            <strong>Deletion</strong> — request deletion of your personal data
            ("right to be forgotten")
          </li>
          <li>
            <strong>Portability</strong> — receive your data in a structured,
            machine-readable format
          </li>
          <li>
            <strong>Objection</strong> — object to certain types of processing,
            including direct marketing
          </li>
          <li>
            <strong>Withdrawal of consent</strong> — withdraw consent for
            marketing communications at any time
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <strong>hello@deusizisparkle.com</strong>. We will respond within 30
          days. We may need to verify your identity before processing requests.
        </p>
      </>
    ),
  },
  {
    num: "09",
    id: "children",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          Deusizi Sparkle is not directed at children under the age of 18. We do
          not knowingly collect personal information from minors.
        </p>
        <p>
          If you believe a child has provided us with personal information
          without parental consent, please contact us immediately at{" "}
          <strong>hello@deusizisparkle.com</strong> and we will take steps to
          remove that information from our systems.
        </p>
      </>
    ),
  },
  {
    num: "10",
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our practices, technology, or legal requirements. When we make
          material changes, we will:
        </p>
        <ul>
          <li>Update the "Last updated" date at the top of this page</li>
          <li>Send a notification to registered users via email</li>
          <li>Display a prominent notice on our platform</li>
        </ul>
        <p>
          We encourage you to review this policy regularly. Your continued use
          of our platform after changes take effect constitutes your acceptance
          of the updated policy.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Legal</p>
        <h1 className={styles.heroTitle}>Privacy Policy</h1>
        <p className={styles.heroMeta}>
          Last updated: March 2026{" "}
          <span className={styles.updatedBadge}>Current</span>
        </p>
        <div className={styles.heroDivider} />
      </div>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className={styles.divider} />

      <div className={styles.layout}>
        {/* Table of Contents */}
        <div className={styles.toc}>
          <p className={styles.tocTitle}>Contents</p>
          <ul className={styles.tocList}>
            {SECTIONS.map((s) => (
              <li
                key={s.id}
                className={styles.tocItem}
                onClick={() => scrollTo(s.id)}
              >
                <span className={styles.tocNum}>{s.num}</span>
                {s.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className={styles.section}>
              <p className={styles.sectionNum}>{s.num}</p>
              <h2 className={styles.sectionTitle}>{s.title}</h2>
              <div className={styles.sectionBody}>{s.content}</div>
            </div>
          ))}

          {/* Contact */}
          <div className={styles.contactCard}>
            <h3 className={styles.contactTitle}>
              Privacy questions or requests?
            </h3>
            <p className={styles.contactText}>
              Contact our team to exercise your rights, request data deletion,
              or ask any privacy-related questions.
            </p>
            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>{" "}
                hello@deusizisparkle.com
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span> +234 803 058 8774
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span> Abuja, FCT,
                Nigeria
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
