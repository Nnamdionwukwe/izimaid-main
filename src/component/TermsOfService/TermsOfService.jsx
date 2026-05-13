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
          website at <strong>deusizisparkle.com</strong>, mobile applications
          (iOS and Android), or any related services — you agree to be bound by
          these Terms of Service and our Privacy Policy.
        </p>
        <p>
          If you do not agree with any part of these terms, you must not use our
          platform. Continued use of our services constitutes your acceptance of
          these terms as updated from time to time.
        </p>
        <div className={styles.highlight}>
          These Terms of Service constitute a legally binding agreement between
          you and Deusizi Sparkle. They apply to all users globally, including
          customers, cleaning professionals, and administrators. Please read
          them carefully before using our platform.
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
          Deusizi Sparkle is a <strong>global</strong> online marketplace that
          connects customers seeking home and commercial cleaning services with
          independent professional cleaning providers ("Cleaning Professionals"
          or "Maids") worldwide.
        </p>
        <p>Our platform provides:</p>
        <ul>
          <li>A booking and scheduling system for cleaning services</li>
          <li>
            Secure payment processing in all major global currencies via
            Paystack and Stripe
          </li>
          <li>
            Escrow-based payment holding until the customer confirms job
            completion
          </li>
          <li>Real-time GPS tracking during active jobs</li>
          <li>
            In-app messaging and video calling between customers and cleaning
            professionals
          </li>
          <li>An SOS emergency alert system for active bookings</li>
          <li>A review and rating system for quality assurance</li>
          <li>Multi-currency wallets for cleaning professionals</li>
          <li>Customer support and dispute resolution services</li>
        </ul>
        <p>
          Deusizi Sparkle acts as an intermediary marketplace between customers
          and cleaning professionals. We are not the employer, agent, joint
          venturer, or partner of any cleaning professional listed on our
          platform.
        </p>
      </>
    ),
  },
  {
    num: "03",
    id: "contractors",
    title: "Independent Contractor Status",
    content: (
      <>
        <p>
          All cleaning professionals on Deusizi Sparkle are{" "}
          <strong>independent contractors</strong>, not employees, agents, joint
          venturers, or partners of Deusizi Sparkle.
        </p>
        <p>Deusizi Sparkle does not:</p>
        <ul>
          <li>Direct, control, or supervise the cleaning services provided</li>
          <li>Set the working hours or methods of cleaning professionals</li>
          <li>
            Guarantee the quality, safety, or outcome of any cleaning service
          </li>
          <li>
            Provide tools, equipment, or supplies to cleaning professionals
          </li>
          <li>
            Pay employment taxes, insurance, or benefits on behalf of cleaning
            professionals
          </li>
        </ul>
        <p>
          Cleaning professionals are solely responsible for the services they
          provide, their conduct, their tax obligations, and compliance with
          applicable laws in their jurisdiction.
        </p>
      </>
    ),
  },
  {
    num: "04",
    id: "accounts",
    title: "User Accounts",
    content: (
      <>
        <p>
          To access most features of our platform, you must create an account.
          You may register using your email address or Google account. By
          creating an account, you agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Keep your login credentials secure and confidential</li>
          <li>
            Notify us immediately of any unauthorized use of your account at{" "}
            <strong>hello@deusizisparkle.com</strong>
          </li>
          <li>
            Accept full responsibility for all activities conducted under your
            account
          </li>
          <li>Not create multiple accounts or impersonate another person</li>
        </ul>
        <p>
          We reserve the right to suspend or permanently terminate accounts that
          violate these terms, engage in fraudulent activity, or pose a risk to
          other users or the platform.
        </p>
      </>
    ),
  },
  {
    num: "05",
    id: "bookings",
    title: "Bookings & Payments",
    content: (
      <>
        <p>When you make a booking through Deusizi Sparkle:</p>
        <ul>
          <li>
            All payments are processed securely via <strong>Paystack</strong>{" "}
            (African currencies including NGN, GHS, KES, ZAR, and more) or{" "}
            <strong>Stripe</strong> (USD, GBP, EUR, CAD, AUD, and all other
            international currencies)
          </li>
          <li>
            <strong>
              Payments are not processed through Apple In-App Purchase or Google
              Play Billing systems
            </strong>
          </li>
          <li>
            Your booking is confirmed only after successful payment
            authorisation
          </li>
          <li>
            Funds are held in escrow until the customer confirms job completion
            by releasing payment
          </li>
          <li>
            The cleaning professional receives 100% of their quoted rate;
            platform fees are applied separately on top of the maid's rate
          </li>
        </ul>
        <div className={styles.warning}>
          <strong>Cancellation Policy:</strong>
          <br />• Cancellations more than 24 hours before the service: full
          refund within 5–7 business days
          <br />• Cancellations within 24 hours: 75% refund
          <br />• No-shows (customer not present at service time): no refund
          <br />• If a cleaning professional cancels a confirmed booking: full
          refund to the customer within 5–7 business days
        </div>
        <p>
          Deusizi Sparkle does not guarantee the availability of any specific
          cleaning professional. Refunds are processed in the original payment
          currency.
        </p>
      </>
    ),
  },
  {
    num: "06",
    id: "currencies",
    title: "Multi-Currency & Global Payments",
    content: (
      <>
        <p>
          Deusizi Sparkle is a <strong>global platform</strong> and supports
          payments in all major currencies worldwide, including but not limited
          to:
        </p>
        <ul>
          <li>
            <strong>African currencies</strong> — NGN (Nigerian Naira), GHS
            (Ghanaian Cedi), KES (Kenyan Shilling), ZAR (South African Rand),
            and more via Paystack
          </li>
          <li>
            <strong>International currencies</strong> — USD (US Dollar), GBP
            (British Pound), EUR (Euro), CAD (Canadian Dollar), AUD (Australian
            Dollar), INR (Indian Rupee), and all other Stripe-supported
            currencies
          </li>
        </ul>
        <p>
          Exchange rates are determined by our payment processors at the time of
          transaction. Displayed prices may differ slightly from the final
          charged amount due to currency conversion. Deusizi Sparkle is not
          responsible for exchange rate fluctuations or bank conversion fees
          charged by your financial institution.
        </p>
        <p>
          Withdrawal of earnings by cleaning professionals is subject to the
          availability of withdrawal methods in their country and currency.
        </p>
      </>
    ),
  },
  {
    num: "07",
    id: "conduct",
    title: "User Conduct",
    content: (
      <>
        <p>
          All users of the Deusizi Sparkle platform — both customers and
          cleaning professionals — agree not to:
        </p>
        <ul>
          <li>
            Use the platform for any unlawful, fraudulent, or harmful purpose
          </li>
          <li>
            Harass, threaten, intimidate, or abuse other users, cleaning
            professionals, or staff
          </li>
          <li>
            Arrange payments with cleaning professionals outside of the Deusizi
            Sparkle system
          </li>
          <li>
            Post false, misleading, defamatory, or malicious reviews or content
          </li>
          <li>
            Attempt to gain unauthorised access to other accounts or our systems
          </li>
          <li>Upload malicious code, viruses, or harmful content</li>
          <li>
            Violate any applicable local, national, or international law or
            regulation
          </li>
          <li>
            Discriminate against cleaning professionals or customers on the
            basis of race, gender, religion, nationality, disability, or any
            other protected characteristic
          </li>
        </ul>
        <p>
          Violation may result in immediate account suspension, forfeiture of
          payments, permanent ban, and legal action where appropriate.
        </p>
      </>
    ),
  },
  {
    num: "08",
    id: "sos",
    title: "SOS Emergency Feature",
    content: (
      <>
        <p>
          Deusizi Sparkle provides an in-app SOS emergency alert feature
          available during active bookings. When triggered:
        </p>
        <ul>
          <li>Administrators are immediately notified</li>
          <li>
            Emergency contacts registered by both parties are notified with
            location details
          </li>
          <li>
            The GPS location of the triggered alert is recorded and shared with
            administrators
          </li>
        </ul>
        <div className={styles.warning}>
          <strong>Important:</strong> The SOS feature is not a substitute for
          official emergency services. In any life-threatening emergency, always
          contact your local emergency services first — <strong>112</strong> in
          Nigeria, <strong>999</strong> in the UK, <strong>911</strong> in the
          USA, or your local equivalent. Deusizi Sparkle does not guarantee
          response times and is not liable for outcomes arising from use or
          non-use of the SOS feature.
        </div>
      </>
    ),
  },
  {
    num: "09",
    id: "intellectual",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          The Deusizi Sparkle name, logo, platform design, software, content,
          and all related intellectual property are owned by Deusizi Sparkle and
          are protected by copyright, trademark, and other applicable laws
          worldwide.
        </p>
        <p>
          You may not copy, reproduce, distribute, modify, or create derivative
          works from our platform or content without our prior written consent.
        </p>
        <p>
          By uploading content to our platform (including profile photos,
          reviews, and messages), you retain ownership but grant Deusizi Sparkle
          a worldwide, royalty-free, non-exclusive licence to use, display, and
          distribute that content solely for the purpose of operating and
          improving our services.
        </p>
      </>
    ),
  },
  {
    num: "10",
    id: "liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          Deusizi Sparkle acts as a marketplace intermediary. To the maximum
          extent permitted by applicable law:
        </p>
        <ul>
          <li>
            We are not liable for the quality, safety, legality, or outcome of
            services provided by cleaning professionals
          </li>
          <li>
            We are not liable for any property damage, personal injury, theft,
            or loss arising from cleaning services
          </li>
          <li>
            We are not liable for service disruptions, technical failures, or
            platform downtime
          </li>
          <li>
            Our total liability to you shall not exceed the value of your most
            recent booking or the equivalent of USD 100, whichever is greater
          </li>
          <li>
            We are not liable for indirect, incidental, special, punitive, or
            consequential damages
          </li>
        </ul>
        <div className={styles.highlight}>
          Nothing in these terms limits our liability for death or personal
          injury caused by our negligence, or for fraud or fraudulent
          misrepresentation.
        </div>
      </>
    ),
  },
  {
    num: "11",
    id: "disputes",
    title: "Dispute Resolution",
    content: (
      <>
        <p>If you experience an issue with a booking or service quality:</p>
        <ul>
          <li>Contact the other party directly through in-app messaging</li>
          <li>
            If unresolved, raise a support ticket through the platform within 7
            days of the service date
          </li>
          <li>
            Our support team will review evidence from both parties and respond
            within 5 business days
          </li>
          <li>
            Deusizi Sparkle's decision on disputes involving escrow release is
            final
          </li>
        </ul>
        <p>
          For payment disputes, contact our support team before initiating a
          chargeback with your bank, as chargebacks may result in account
          suspension. We encourage all parties to resolve disputes informally
          before pursuing legal action.
        </p>
      </>
    ),
  },
  {
    num: "12",
    id: "jurisdictions",
    title: "Prohibited Jurisdictions",
    content: (
      <>
        <p>
          Our payment processing partners (Paystack and Stripe) are subject to
          international sanctions regulations. Users in jurisdictions subject to
          OFAC, UN, EU, or UK sanctions may not use Deusizi Sparkle's payment
          features.
        </p>
        <p>
          Deusizi Sparkle reserves the right to restrict access from any
          jurisdiction where operating would violate applicable laws or payment
          processor requirements.
        </p>
      </>
    ),
  },
  {
    num: "13",
    id: "termination",
    title: "Termination",
    content: (
      <>
        <p>
          Either party may terminate the relationship under these terms at any
          time:
        </p>
        <ul>
          <li>
            You may close your account through the app Settings or by contacting
            our support team
          </li>
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
          with reasonable notice to users.
        </p>
      </>
    ),
  },
  {
    num: "14",
    id: "governing",
    title: "Governing Law",
    content: (
      <>
        <p>
          These Terms of Service are governed by and construed in accordance
          with the laws of the Federal Republic of Nigeria. Any disputes shall
          be subject to the exclusive jurisdiction of the courts of the Federal
          Capital Territory, Abuja, Nigeria, except where applicable consumer
          protection laws in your country of residence require otherwise.
        </p>
        <p>
          Users in the United Kingdom and European Union retain the right to
          bring claims before the courts of their country of residence under
          applicable consumer protection legislation.
        </p>
        <p>
          We encourage users to contact us directly to resolve any disputes
          informally before pursuing legal action.
        </p>
      </>
    ),
  },
  {
    num: "15",
    id: "changes",
    title: "Changes to Terms",
    content: (
      <>
        <p>
          We reserve the right to update these Terms of Service at any time.
          When we make material changes, we will:
        </p>
        <ul>
          <li>Update the "Last updated" date at the top of this page</li>
          <li>Notify registered users via email</li>
          <li>Display a prominent notice within the platform</li>
        </ul>
        <p>
          Your continued use of the platform after changes take effect
          constitutes your acceptance of the revised terms. If you do not agree
          with the updated terms, you must stop using the platform and may
          delete your account.
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
          Last updated: May 2026{" "}
          <span className={styles.updatedBadge}>Current</span>
        </p>
        <p className={styles.heroCompliance}>
          Global Platform · Nigeria NDPA 2023 · GDPR Compliant
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
            <h3 className={styles.contactTitle}>Questions about our Terms?</h3>
            <p className={styles.contactText}>
              Contact our legal team for any questions about these terms, to
              report a violation, or to exercise your rights as a user.
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
