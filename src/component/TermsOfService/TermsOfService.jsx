import { useNavigate } from "react-router-dom";
import styles from "../Legal.module.css";

const SECTIONS = [
  {
    num: "01",
    id: "acceptance",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing or using the Deusizi Sparkle platform — including our
          website at <strong>deusizisparkle.com</strong>, mobile application, or
          any related services — you agree to be bound by these Terms of
          Service.
        </p>
        <p>
          If you do not agree with any part of these terms, you must not use our
          platform. Continued use of our services constitutes your acceptance of
          these terms as updated from time to time.
        </p>
        <div className={styles.highlight}>
          These Terms of Service constitute a legally binding agreement between
          you and Deusizi Sparkle. Please read them carefully before using our
          platform.
        </div>
      </>
    ),
  },
  {
    num: "02",
    id: "services",
    title: "Description of Services",
    content: (
      <>
        <p>
          Deusizi Sparkle is an online marketplace that connects customers
          seeking home cleaning services with independent professional cleaning
          providers ("Maids") across Abuja and Lagos, Nigeria.
        </p>
        <p>Our platform provides:</p>
        <ul>
          <li>
            A booking system for customers to discover, select, and schedule
            cleaning professionals
          </li>
          <li>
            A profile and availability management system for registered maids
          </li>
          <li>Secure payment processing via Paystack</li>
          <li>A review and rating system for quality assurance</li>
          <li>Customer support and dispute resolution services</li>
        </ul>
        <p>
          Deusizi Sparkle acts as an intermediary between customers and maids.
          We are not the employer of the cleaning professionals listed on our
          platform.
        </p>
      </>
    ),
  },
  {
    num: "03",
    id: "accounts",
    title: "User Accounts",
    content: (
      <>
        <p>
          To access most features of our platform, you must create an account.
          You may register using your Google account. By creating an account,
          you agree to:
        </p>
        <ul>
          <li>
            Provide accurate, current, and complete information during
            registration
          </li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your login credentials secure and confidential</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
          <li>
            Accept responsibility for all activities that occur under your
            account
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these terms, provide false information, or engage in conduct we deem
          harmful to our platform or community.
        </p>
      </>
    ),
  },
  {
    num: "04",
    id: "bookings",
    title: "Bookings & Payments",
    content: (
      <>
        <p>
          When you make a booking through Deusizi Sparkle, the following
          applies:
        </p>
        <ul>
          <li>
            All payments are processed securely via Paystack in Nigerian Naira
            (₦)
          </li>
          <li>
            Your booking is only confirmed after successful payment and admin
            approval
          </li>
          <li>
            Bookings may be cancelled by the customer at least 24 hours before
            the scheduled service for a full refund
          </li>
          <li>
            Cancellations within 24 hours may be subject to a cancellation fee
            of up to 25% of the booking value
          </li>
          <li>
            If a maid cancels a confirmed booking, you will receive a full
            refund and we will assist in rebooking
          </li>
        </ul>
        <div className={styles.warning}>
          <strong>Important:</strong> Deusizi Sparkle does not guarantee the
          availability of any specific maid. Bookings are subject to maid
          availability and admin approval. Payment is held securely until the
          booking is confirmed.
        </div>
      </>
    ),
  },
  {
    num: "05",
    id: "conduct",
    title: "User Conduct",
    content: (
      <>
        <p>
          All users of the Deusizi Sparkle platform — both customers and maids —
          agree not to:
        </p>
        <ul>
          <li>
            Use the platform for any unlawful, fraudulent, or abusive purpose
          </li>
          <li>Harass, threaten, or intimidate other users or staff</li>
          <li>
            Circumvent the platform by arranging private payments with maids
            outside our system
          </li>
          <li>Post false, misleading, or defamatory reviews or content</li>
          <li>
            Attempt to gain unauthorized access to other accounts or our systems
          </li>
          <li>
            Use our platform to solicit maids for services outside of Deusizi
            Sparkle
          </li>
        </ul>
        <p>
          Violation of these conduct standards may result in immediate account
          suspension, forfeiture of payments, and legal action where
          appropriate.
        </p>
      </>
    ),
  },
  {
    num: "06",
    id: "liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          Deusizi Sparkle acts as a marketplace and intermediary. To the maximum
          extent permitted by Nigerian law:
        </p>
        <ul>
          <li>
            We are not liable for the quality, safety, or legality of services
            provided by maids on our platform
          </li>
          <li>
            We are not liable for any property damage, loss, or personal injury
            arising from cleaning services
          </li>
          <li>
            Our total liability to you for any claim shall not exceed the value
            of your most recent booking
          </li>
          <li>
            We are not liable for indirect, incidental, or consequential damages
            of any kind
          </li>
        </ul>
        <div className={styles.highlight}>
          All cleaning professionals on our platform are vetted and verified.
          However, by using our service, you acknowledge that Deusizi Sparkle
          cannot guarantee the outcome of any specific cleaning service.
        </div>
      </>
    ),
  },
  {
    num: "07",
    id: "intellectual",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All content on the Deusizi Sparkle platform — including but not
          limited to logos, text, graphics, software, and service descriptions —
          is owned by or licensed to Deusizi Sparkle and is protected under
          Nigerian and international intellectual property law.
        </p>
        <p>
          You may not reproduce, distribute, modify, or create derivative works
          of our content without express written permission.
        </p>
        <p>
          By submitting reviews, photos, or other content to our platform, you
          grant Deusizi Sparkle a non-exclusive, royalty-free license to use,
          display, and distribute that content in connection with our services.
        </p>
      </>
    ),
  },
  {
    num: "08",
    id: "termination",
    title: "Termination",
    content: (
      <>
        <p>
          Either party may terminate the relationship under these terms at any
          time:
        </p>
        <ul>
          <li>You may close your account by contacting our support team</li>
          <li>
            We may suspend or terminate your account immediately if you breach
            these terms
          </li>
          <li>
            Outstanding obligations — including payments due — survive
            termination
          </li>
          <li>
            Upon termination, your right to use the platform ceases immediately
          </li>
        </ul>
        <p>
          We reserve the right to discontinue or modify the platform at any time
          without prior notice. We will make reasonable efforts to notify users
          of significant changes.
        </p>
      </>
    ),
  },
  {
    num: "09",
    id: "governing",
    title: "Governing Law",
    content: (
      <>
        <p>
          These Terms of Service are governed by and construed in accordance
          with the laws of the Federal Republic of Nigeria. Any disputes arising
          from these terms or your use of the platform shall be subject to the
          exclusive jurisdiction of the courts of the Federal Capital Territory,
          Abuja.
        </p>
        <p>
          We encourage users to contact us directly to resolve any disputes
          informally before pursuing legal action. We are committed to fair and
          transparent resolution of all complaints.
        </p>
      </>
    ),
  },
  {
    num: "10",
    id: "changes",
    title: "Changes to Terms",
    content: (
      <>
        <p>
          We reserve the right to update these Terms of Service at any time.
          When we make material changes, we will notify registered users via
          email or an in-app notification, and update the "Last updated" date at
          the top of this page.
        </p>
        <p>
          Your continued use of the platform after changes take effect
          constitutes your acceptance of the revised terms. If you do not agree
          with the updated terms, you must stop using the platform and close
          your account.
        </p>
      </>
    ),
  },
];

export default function TermsOfService() {
  const navigate = useNavigate();

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Legal</p>
        <h1 className={styles.heroTitle}>Terms of Service</h1>
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
            <h3 className={styles.contactTitle}>Questions about our Terms?</h3>
            <p className={styles.contactText}>
              If you have any questions about these Terms of Service, please
              contact us directly.
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
