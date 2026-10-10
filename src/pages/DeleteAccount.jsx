import { useNavigate } from "react-router-dom";
import styles from "../component/Legal.module.css";
import {
  FaEnvelope,
  FaTrash,
  FaUserSlash,
  FaClock,
  FaShieldAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaArrowLeft,
} from "react-icons/fa";

const SECTIONS = [
  {
    num: "01",
    id: "intro",
    title: "Account Deletion",
    content: (
      <>
        <p>
          You can request the deletion of your <strong>Deusizi Sparkle</strong>{" "}
          account and all associated personal data at any time. This page
          explains how to submit a deletion request, what data will be removed,
          what data we retain for legal compliance, and how long the process
          takes.
        </p>
        <div className={styles.highlight}>
          We process all deletion requests within <strong>30 days</strong> of
          receiving them. You will receive a confirmation email once your
          account and data have been permanently removed.
        </div>
      </>
    ),
  },
  {
    num: "02",
    id: "how",
    title: "How to Request Deletion",
    content: (
      <>
        <p>You have two ways to request deletion of your account:</p>
        <p>
          <strong>Option 1 — In the app (fastest)</strong>
        </p>
        <ul>
          <li>Open Deusizi Sparkle on your device</li>
          <li>
            Go to the <strong>Profile</strong> tab
          </li>
          <li>
            Tap <strong>Settings</strong>, then <strong>Delete Account</strong>
          </li>
          <li>Confirm the deletion when prompted</li>
          <li>Your account is scheduled for deletion immediately</li>
        </ul>
        <p>
          <strong>Option 2 — By email</strong>
        </p>
        <ul>
          <li>
            Send an email from the address registered to your account to{" "}
            <strong>hello@deusizisparkle.com</strong>
          </li>
          <li>
            Use the subject line: <strong>Account Deletion Request</strong>
          </li>
          <li>
            Include your registered email address and (if you can) your account
            ID
          </li>
          <li>
            We will verify your identity and process the request within 30 days
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "03",
    id: "deleted",
    title: "What Data Is Deleted",
    content: (
      <>
        <p>
          When your account deletion is processed, the following data is
          permanently removed from our systems:
        </p>
        <ul>
          <li>Your profile information (name, email, phone, avatar)</li>
          <li>Your login credentials and authentication tokens</li>
          <li>Your booking history and booking details</li>
          <li>Your in-app chat messages</li>
          <li>Your location history and live tracking logs</li>
          <li>Your uploaded photos and documents</li>
          <li>Your device push notification tokens</li>
          <li>Your app preferences and saved settings</li>
        </ul>
      </>
    ),
  },
  {
    num: "04",
    id: "retained",
    title: "What Data Is Retained",
    content: (
      <>
        <p>
          A small amount of data must be retained to comply with legal, tax, and
          anti-fraud obligations:
        </p>
        <ul>
          <li>
            <strong>Transaction records</strong> — payment amounts, dates,
            references, and invoice data are retained for{" "}
            <strong>7 years</strong> as required by financial regulations in
            Nigeria (FIRS) and other operating jurisdictions
          </li>
          <li>
            <strong>Fraud and abuse records</strong> — anonymized records of
            confirmed fraud or abuse cases may be retained indefinitely to
            protect the platform
          </li>
          <li>
            <strong>Legal hold data</strong> — data subject to an active legal
            investigation, court order, or dispute may be retained until the
            matter is resolved
          </li>
        </ul>
        <div className={styles.warning}>
          <strong>Note:</strong> Retained transaction records are anonymized and
          disconnected from your profile. They cannot be used to re-identify
          you.
        </div>
      </>
    ),
  },
  {
    num: "05",
    id: "timeline",
    title: "Deletion Timeline",
    content: (
      <>
        <p>The deletion process follows this timeline:</p>
        <ul>
          <li>
            <strong>Day 0</strong> — You submit the deletion request (in-app or
            by email)
          </li>
          <li>
            <strong>Day 1–3</strong> — We verify your identity and confirm the
            request
          </li>
          <li>
            <strong>Day 3–7</strong> — Your account is deactivated and no longer
            accessible
          </li>
          <li>
            <strong>Day 7–30</strong> — All personal data (except retained
            records) is permanently deleted from our primary databases, backups,
            and third-party processors
          </li>
          <li>
            <strong>Day 30</strong> — You receive a final confirmation email
          </li>
        </ul>
        <p>
          If your account has any active bookings, the deletion will be
          scheduled after those bookings are completed or cancelled.
        </p>
      </>
    ),
  },
  {
    num: "06",
    id: "third-parties",
    title: "Third-Party Services",
    content: (
      <>
        <p>
          Your deletion request is propagated to all third-party services we use
          to operate the platform:
        </p>
        <ul>
          <li>
            <strong>Flutterwave</strong> — payment records retention governed by
            their policy and financial regulations
          </li>
          <li>
            <strong>Cloudinary</strong> — uploaded photos and documents removed
            from CDN within 7 days
          </li>
          <li>
            <strong>Expo Push Notifications</strong> — your device token deleted
            immediately
          </li>
          <li>
            <strong>Agora</strong> — video call metadata anonymized and removed
            within 30 days
          </li>
        </ul>
      </>
    ),
  },
  {
    num: "07",
    id: "partial",
    title: "Partial Data Deletion",
    content: (
      <>
        <p>
          At this time we do not offer partial deletion of individual data
          categories while keeping your account active. You can:
        </p>
        <ul>
          <li>
            <strong>Edit your profile</strong> — change your name, phone, and
            avatar in the app at any time
          </li>
          <li>
            <strong>Remove specific photos or documents</strong> — delete
            verification uploads from the Profile &rarr; Documents screen
          </li>
          <li>
            <strong>Opt out of marketing</strong> — turn off promotional emails
            from the Notification settings
          </li>
        </ul>
        <p>
          If you need a specific data type removed but want to keep your
          account, contact us at <strong>hello@deusizisparkle.com</strong> and
          we will consider your request on a case-by-case basis.
        </p>
      </>
    ),
  },
  {
    num: "08",
    id: "rights",
    title: "Your Legal Rights",
    content: (
      <>
        <p>
          Under the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> and
          the <strong>GDPR</strong> (for UK and EU users), you have the right to
          request deletion of your personal data. We honor these rights for
          users in all jurisdictions where we operate.
        </p>
        <p>
          If you believe your deletion request has not been handled correctly,
          you have the right to lodge a complaint with your national data
          protection authority — in Nigeria, this is the{" "}
          <strong>Nigeria Data Protection Commission (NDPC)</strong>.
        </p>
      </>
    ),
  },
];

export default function DeleteAccount() {
  const navigate = useNavigate();

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Legal</p>
        <h1 className={styles.heroTitle}>Delete Your Account</h1>
        <p className={styles.heroMeta}>
          Last updated: October 2026{" "}
          <span className={styles.updatedBadge}>Current</span>
        </p>
        <p className={styles.heroCompliance}>
          NDPA 2023 · GDPR · Right to Erasure
        </p>
        <div className={styles.heroDivider} />
      </div>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
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

          {/* Quick action buttons */}
          <div className={styles.contactCard}>
            <h3 className={styles.contactTitle}>
              Ready to delete your account?
            </h3>
            <p className={styles.contactText}>
              The fastest way is through the app. Open Deusizi Sparkle →{" "}
              <strong>Profile</strong> → <strong>Settings</strong> →{" "}
              <strong>Delete Account</strong>. Or email us directly — we respond
              within 30 days.
            </p>
            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />{" "}
                hello@deusizisparkle.com
              </div>
              <div className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} /> +234 803 058 8774
              </div>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} /> Abuja, FCT,
                Nigeria
              </div>
              <div className={styles.contactItem}>
                <FaGlobe className={styles.contactIcon} /> deusizisparkle.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
