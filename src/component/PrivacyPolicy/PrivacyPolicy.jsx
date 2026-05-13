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
          Deusizi Sparkle ("we", "our", or "us") is a <strong>global</strong>{" "}
          home and commercial cleaning marketplace operated from Abuja, Federal
          Capital Territory, Nigeria. We are committed to protecting your
          personal information wherever you are in the world.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, store, share, and
          protect your data when you use our platform at{" "}
          <strong>deusizisparkle.com</strong>, our mobile applications (iOS and
          Android), and all related services.
        </p>
        <div className={styles.highlight}>
          We will never sell your personal data to third parties. Your
          information is used solely to provide and improve our services, and to
          connect you with cleaning professionals.
        </div>
        <p>
          We comply with the{" "}
          <strong>Nigeria Data Protection Act 2023 (NDPA)</strong>, the{" "}
          <strong>General Data Protection Regulation (GDPR)</strong> for users
          in the United Kingdom and European Union, and applicable data
          protection laws in all countries where we operate.
        </p>
        <p>
          By using our platform, you consent to the data practices described in
          this policy.
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
          <strong>Account Information</strong> — when you register, we collect
          your name, email address, phone number, and country. If you use Google
          Sign-In, we receive your name, email, and profile photo from your
          Google account.
        </p>
        <p>
          <strong>Booking Information</strong> — when you make a booking, we
          collect your service address, booking dates, duration, special
          instructions, and payment records.
        </p>
        <p>
          <strong>Profile Information</strong> — for cleaning professionals, we
          collect bio, rates, services offered, location, availability, and
          identity documents submitted for verification.
        </p>
        <p>
          <strong>Location Data</strong> — with your explicit permission, we
          collect precise GPS coordinates during active bookings. This includes
          check-in location, checkout location, and periodic location pings
          during the job for live tracking purposes. Location data is shared
          between the customer and assigned cleaning professional during an
          active booking and retained for dispute resolution purposes. Location
          is never collected in the background outside of active bookings.
        </p>
        <p>
          <strong>Camera and Photos</strong> — with your permission, we access
          your device camera or photo library solely to allow you to upload a
          profile avatar or identity verification documents.
        </p>
        <p>
          <strong>Payment Information</strong> — payment transactions are
          processed by Paystack (African currencies) and Stripe (international
          currencies). We store payment references and amounts but do not store
          full card numbers, CVV codes, or bank credentials.
        </p>
        <p>
          <strong>Push Notification Tokens</strong> — with your permission, we
          collect device tokens to send booking alerts, payment notifications,
          SOS alerts, and service updates via Expo push notification
          infrastructure.
        </p>
        <p>
          <strong>Communications</strong> — messages sent through our in-app
          chat, support tickets, and video calls may be stored for safety,
          moderation, and dispute resolution purposes.
        </p>
        <p>
          <strong>Usage Data</strong> — we automatically collect device type,
          browser, operating system, app version, IP address, and general usage
          analytics.
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
          <li>
            Process bookings and facilitate payments in all supported currencies
            globally
          </li>
          <li>Connect customers with cleaning professionals worldwide</li>
          <li>Provide live GPS tracking during active bookings</li>
          <li>
            Send booking confirmations, reminders, and service updates via email
            and push notification
          </li>
          <li>Handle customer support requests and resolve disputes</li>
          <li>Verify identity of cleaning professionals</li>
          <li>Detect and prevent fraud, abuse, and platform misuse</li>
          <li>Improve our platform, features, and user experience</li>
          <li>
            Send promotional communications (only with your explicit consent)
          </li>
          <li>
            Comply with our legal obligations in all operating jurisdictions
          </li>
        </ul>
        <p>
          We process your data on the legal basis of contractual necessity (to
          provide the service), legitimate interest (to improve and protect our
          platform), and consent (for marketing communications and location
          access).
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
          <strong>With Cleaning Professionals</strong> — when you make a
          booking, your name, service address, and booking details are shared
          with the assigned professional to deliver the service.
        </p>
        <p>
          <strong>With Payment Processors</strong> — Paystack handles African
          currency payments (NGN, GHS, KES, ZAR, and more) and Stripe handles
          international currency payments (USD, GBP, EUR, CAD, AUD, and all
          other global currencies), each under their own Privacy Policies. We do
          not store your full card details.
        </p>
        <p>
          <strong>With Media Services</strong> — Cloudinary stores profile
          avatars and identity documents securely.
        </p>
        <p>
          <strong>With Video Infrastructure</strong> — Agora provides our
          real-time video call feature. Call metadata may be processed by Agora
          per their Privacy Policy.
        </p>
        <p>
          <strong>With Push Notification Services</strong> — Expo's push
          infrastructure delivers notifications to your device.
        </p>
        <p>
          <strong>With Service Providers</strong> — trusted third-party
          providers process data on our behalf under strict data processing
          agreements.
        </p>
        <p>
          <strong>With Law Enforcement</strong> — we may disclose data when
          required by law, court order, or to protect the safety of our users.
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
    id: "location",
    title: "Location Data",
    content: (
      <>
        <p>
          Location access is used exclusively during active bookings for the
          following purposes:
        </p>
        <ul>
          <li>
            <strong>Check-in location</strong> — recorded when a cleaning
            professional marks arrival at the job address
          </li>
          <li>
            <strong>Checkout location</strong> — recorded when a cleaning
            professional marks job completion
          </li>
          <li>
            <strong>Live tracking</strong> — periodic GPS pings sent during the
            job so customers can monitor the cleaning professional's presence
          </li>
          <li>
            <strong>SOS alerts</strong> — your location at the time of an
            emergency alert is shared with administrators and registered
            emergency contacts
          </li>
        </ul>
        <p>
          Location data is never collected in the background when you are not in
          an active booking session. You may deny location permission at any
          time through your device settings; check-in and checkout features will
          continue to function without GPS coordinates.
        </p>
        <p>
          Location data is retained for up to 90 days after booking completion
          and then permanently deleted.
        </p>
      </>
    ),
  },
  {
    num: "06",
    id: "storage",
    title: "Data Storage & Security",
    content: (
      <>
        <p>
          Your data is stored on secure servers and protected using
          industry-standard security measures including:
        </p>
        <ul>
          <li>Encryption in transit (HTTPS/TLS 1.2+) and at rest (AES-256)</li>
          <li>JWT-based authentication with secure token expiry</li>
          <li>Regular security reviews and access controls</li>
          <li>
            Role-based access controls — staff access to personal data is
            limited to those who need it
          </li>
          <li>
            Secure credential management — API keys and secrets are never stored
            in client applications
          </li>
        </ul>
        <p>
          We will notify you promptly in the event of a data breach that affects
          your personal information, in accordance with applicable notification
          requirements.
        </p>
      </>
    ),
  },
  {
    num: "07",
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
            active and permanently deleted within 90 days of account closure
          </li>
          <li>
            <strong>Booking and financial records</strong> — retained for up to
            7 years for financial and legal compliance
          </li>
          <li>
            <strong>Location data</strong> — deleted 90 days after booking
            completion
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
          You may request deletion of your personal data at any time (see
          Section 10). Certain data may be retained where required by law.
        </p>
      </>
    ),
  },
  {
    num: "08",
    id: "international",
    title: "International Data Transfers",
    content: (
      <>
        <p>
          Deusizi Sparkle is a global platform serving users across Africa,
          Europe, the Americas, Asia, and beyond. Your data may be transferred
          to and processed in countries other than your country of residence.
        </p>
        <p>
          Where we transfer personal data from the UK or European Economic Area
          to countries without an adequacy decision, we rely on Standard
          Contractual Clauses approved by the relevant data protection
          authorities to ensure an equivalent level of protection.
        </p>
        <p>
          All international transfers are conducted with appropriate safeguards
          in place to protect your personal information in accordance with the
          GDPR and applicable national laws.
        </p>
      </>
    ),
  },
  {
    num: "09",
    id: "cookies",
    title: "Cookies & Local Storage",
    content: (
      <>
        <p>
          Our website uses cookies and local storage to provide our services:
        </p>
        <ul>
          <li>
            <strong>Authentication tokens</strong> — stored in localStorage to
            keep you securely logged in
          </li>
          <li>
            <strong>Session preferences</strong> — stored in sessionStorage for
            temporary session data
          </li>
          <li>
            <strong>Language preference</strong> — stored via Google Translate
            cookie to remember your selected language
          </li>
          <li>
            <strong>Analytics</strong> — we may use anonymous analytics to
            understand how our platform is used. No personally identifiable data
            is shared with analytics providers.
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
    num: "10",
    id: "rights",
    title: "Your Rights",
    content: (
      <>
        <p>
          Under the Nigeria Data Protection Act 2023 (NDPA) and the GDPR (for
          UK/EU users), you have the right to:
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
            <strong>Deletion</strong> — request permanent deletion of your
            personal data ("right to be forgotten")
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
            <strong>Restriction</strong> — ask us to limit how we process your
            data in certain circumstances
          </li>
          <li>
            <strong>Withdrawal of consent</strong> — withdraw consent for
            marketing at any time without affecting prior processing
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <strong>hello@deusizisparkle.com</strong>. We will respond within 30
          days. You also have the right to lodge a complaint with your national
          data protection authority — in Nigeria, this is the Nigeria Data
          Protection Commission (NDPC).
        </p>
      </>
    ),
  },
  {
    num: "11",
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
          without parental or guardian consent, please contact us immediately at{" "}
          <strong>hello@deusizisparkle.com</strong> and we will promptly remove
          that information from our systems.
        </p>
      </>
    ),
  },
  {
    num: "12",
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our practices, technology, legal requirements, or business operations.
          When we make material changes, we will:
        </p>
        <ul>
          <li>Update the "Last updated" date at the top of this page</li>
          <li>Send a notification to registered users via email</li>
          <li>Display a prominent notice on our platform</li>
        </ul>
        <p>
          Your continued use of our platform after changes take effect
          constitutes your acceptance of the updated policy.
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
          Last updated: May 2026{" "}
          <span className={styles.updatedBadge}>Current</span>
        </p>
        <p className={styles.heroCompliance}>
          Nigeria NDPA 2023 · GDPR · Global Data Protection Laws
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

          <div className={styles.contactCard}>
            <h3 className={styles.contactTitle}>
              Privacy questions or requests?
            </h3>
            <p className={styles.contactText}>
              Contact our Data Protection team to exercise your rights, request
              data deletion, or ask any privacy-related questions. We respond
              within 30 days.
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
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🌐</span>{" "}
                deusizisparkle.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
