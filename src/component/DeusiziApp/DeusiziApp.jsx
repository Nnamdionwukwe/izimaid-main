import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DeusiziApp.module.css";

const FEATURES = [
  {
    icon: "⚡",
    title: "Book in under 2 minutes",
    text: "Find a maid, pick your date and time, pay securely — all from your phone in less than 2 minutes. No calls, no negotiating, no uncertainty.",
  },
  {
    icon: "📍",
    title: "GPS-powered maid search",
    text: "The app uses your location to show available maids near you right now. See who's close, their rating, and their rate — instantly.",
  },
  {
    icon: "💬",
    title: "In-app chat with your maid",
    text: "Message your maid directly through the app before and after your clean. No exchanging personal numbers — everything stays in one place.",
  },
  {
    icon: "🔔",
    title: "Real-time notifications",
    text: "Get notified the moment your maid accepts, when they're on their way, and when the job is complete. Always know what's happening.",
  },
  {
    icon: "⭐",
    title: "One-tap reviews",
    text: "Rate your maid after every clean with one tap. Your feedback helps maintain quality and rewards the professionals doing great work.",
  },
  {
    icon: "📅",
    title: "Manage recurring bookings",
    text: "Set up, pause, or cancel your weekly or fortnightly cleaning plan from the app. Your schedule, your control — anytime.",
  },
];

const HOW_STEPS = [
  {
    num: "1",
    icon: "📲",
    title: "Download the app",
    text: "Available on iOS and Android. Coming soon to the App Store and Google Play.",
  },
  {
    num: "2",
    icon: "🔐",
    title: "Sign in with Google",
    text: "One tap. No passwords. Your account is ready in seconds.",
  },
  {
    num: "3",
    icon: "🔍",
    title: "Browse nearby maids",
    text: "See available professionals near you with their ratings and rates.",
  },
  {
    num: "4",
    icon: "✅",
    title: "Book & enjoy",
    text: "Confirm your booking, pay securely, and come home to a clean house.",
  },
];

const MAID_BENEFITS = [
  "Receive booking requests directly to your phone — accept or decline with one tap",
  "View your full schedule, earnings, and upcoming cleans in one dashboard",
  "Get paid on time, every time — track your earnings in real-time",
  "Chat with customers before and after bookings to align on expectations",
  "Update your availability, rates, and services anytime from the app",
  "Build your reputation with verified reviews that grow your profile",
];

export default function DeusiziApp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleNotify(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  // Minimal phone UI mockup
  const PhoneMockup = ({ size = "normal" }) => (
    <div
      className={`${styles.phone} ${size === "large" ? styles.phoneLarge : ""}`}
    >
      <div className={styles.phoneScreen}>
        <div className={styles.phoneStatusBar} />
        <div className={styles.phoneHeader}>
          <p className={styles.phoneHeaderText}>Deusizi Sparkle</p>
          <p className={styles.phoneHeaderSub}>Home cleaning, simplified</p>
        </div>
        <div className={styles.phoneBody}>
          <div className={styles.phoneSearch}>
            <span className={styles.phoneSearchIcon}>🔍</span>
            <span className={styles.phoneSearchText}>Search your area...</span>
          </div>
          <p className={styles.phoneSectionLabel}>Maids near you</p>
          {[
            { name: "Amaka C.", rate: "₦3,500/hr", stars: "★★★★★" },
            { name: "Ngozi A.", rate: "₦3,000/hr", stars: "★★★★★" },
            { name: "Funmi B.", rate: "₦4,000/hr", stars: "★★★★☆" },
          ].map((m) => (
            <div key={m.name} className={styles.phoneMaidCard}>
              <div className={styles.phoneMaidAvatar} />
              <div className={styles.phoneMaidInfo}>
                <p className={styles.phoneMaidName}>{m.name}</p>
                <p className={styles.phoneMaidRate}>{m.rate}</p>
                <p className={styles.phoneMaidStars}>{m.stars}</p>
              </div>
              <div className={styles.phoneBookBtn}>Book</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>The Deusizi Sparkle App</p>
        <h1 className={styles.heroTitle}>
          Your clean home,
          <br />
          <em>in your pocket.</em>
        </h1>
        <p className={styles.heroDesc}>
          Book, manage, and track professional home cleaning from your phone.
          The Deusizi Sparkle app makes getting a great clean faster and easier
          than ever.
        </p>

        {/* Phone mockups */}
        <div className={styles.appMockup}>
          <PhoneMockup />
          <PhoneMockup size="large" />
          <PhoneMockup />
        </div>

        {/* Download buttons */}
        <div className={styles.downloadButtons}>
          <button className={`${styles.dlBtn} ${styles.dlBtnDark}`}>
            <span className={styles.dlBtnIcon}>🍎</span>
            <div className={styles.dlBtnText}>
              <span className={styles.dlBtnSub}>Download on the</span>
              <span className={styles.dlBtnMain}>App Store</span>
            </div>
          </button>
          <button className={`${styles.dlBtn} ${styles.dlBtnDark}`}>
            <span className={styles.dlBtnIcon}>▶️</span>
            <div className={styles.dlBtnText}>
              <span className={styles.dlBtnSub}>Get it on</span>
              <span className={styles.dlBtnMain}>Google Play</span>
            </div>
          </button>
        </div>
        <span className={styles.comingSoonPill}>
          📱 App coming soon — use our website in the meantime
        </span>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <p className={styles.sectionEyebrow}>App features</p>
        <h2 className={styles.sectionTitle}>
          Everything you need, right on your phone
        </h2>
        <div className={styles.featureCards}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div>
                <p className={styles.featureTitle}>{f.title}</p>
                <p className={styles.featureText}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.howItWorks}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Getting started
        </p>
        <h2 className={styles.howTitle}>Clean home in 4 taps</h2>
        <p className={styles.howSub}>
          From download to booked — under 3 minutes.
        </p>
        <div className={styles.howSteps}>
          {HOW_STEPS.map((s) => (
            <div key={s.title} className={styles.howStep}>
              <div className={styles.howStepNum}>{s.num}</div>
              <div className={styles.howStepIcon}>{s.icon}</div>
              <div>
                <p className={styles.howStepTitle}>{s.title}</p>
                <p className={styles.howStepText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For maids */}
      <div className={styles.forMaids}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          For cleaning professionals
        </p>
        <h2 className={styles.forMaidsTitle}>The app works for maids too</h2>
        <p className={styles.forMaidsSub}>
          Deusizi Sparkle maids use the same app to manage their entire workflow
          — bookings, earnings, schedule, and customer communication — all in
          one place.
        </p>
        <div className={styles.maidBenefits}>
          {MAID_BENEFITS.map((b, i) => (
            <div key={i} className={styles.maidBenefit}>
              <div className={styles.maidBenefitDot}>✓</div>
              <p className={styles.maidBenefitText}>{b}</p>
            </div>
          ))}
        </div>
        <button
          className={styles.maidApplyBtn}
          onClick={() => navigate("/login")}
        >
          Join as a Maid →
        </button>
      </div>

      {/* Notify form */}
      <div className={styles.notify}>
        <div className={styles.notifyInner}>
          <div className={styles.notifyIcon}>🔔</div>
          <h3 className={styles.notifyTitle}>Be first when the app launches</h3>
          <p className={styles.notifyText}>
            The Deusizi Sparkle app is in development. Leave your email and
            we'll notify you the moment it's available for download — with an
            exclusive early-access offer.
          </p>
          {submitted ? (
            <p className={styles.notifySuccess}>
              ✓ You're on the list! We'll email you when the app launches.
            </p>
          ) : (
            <form className={styles.notifyForm} onSubmit={handleNotify}>
              <input
                className={styles.notifyInput}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.notifyBtn}>
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Web fallback */}
      <div className={styles.webFallback}>
        <div className={styles.webFallbackInner}>
          <div className={styles.webFallbackIcon}>🌐</div>
          <div>
            <p className={styles.webFallbackTitle}>
              Can't wait? Book on our website
            </p>
            <p className={styles.webFallbackText}>
              The app is coming soon — but everything works perfectly on our
              website right now. Browse maids, book, and pay in under 2 minutes
              from your browser.
            </p>
            <button
              className={styles.webFallbackBtn}
              onClick={() => navigate("/maids")}
            >
              Browse Maids Now
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Clean home, coming right up</h2>
        <p className={styles.ctaText}>
          App or website — we make getting a professional clean simple, safe,
          and satisfying.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/maids")}
          >
            Book Online Now
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/why-hire-us")}
          >
            Why Choose Us
          </button>
        </div>
      </div>
    </div>
  );
}
