import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecurringCleaning.module.css";

const FREQUENCIES = [
  {
    icon: "📅",
    name: "Weekly",
    badge: "Most Popular",
    desc: "A thorough clean every week. Perfect for busy households, families with kids, or anyone who wants a permanently spotless home.",
    perks: [
      "Priority scheduling",
      "Same maid every visit",
      "10% loyalty discount",
    ],
  },
  {
    icon: "🗓️",
    name: "Every 2 Weeks",
    badge: "Best Value",
    desc: "A deep clean every fortnight. Ideal for couples and small households who keep things relatively tidy between sessions.",
    perks: ["Flexible rescheduling", "5% loyalty discount", "Free touch-ups"],
  },
  {
    icon: "📆",
    name: "Monthly",
    badge: "Deep Clean",
    desc: "A comprehensive monthly reset. Great for minimalists or anyone who needs professional help once a month for the big jobs.",
    perks: [
      "Extended session time",
      "Full deep-clean checklist",
      "Easy cancellation",
    ],
  },
];

const INCLUDED = [
  "Dust all surfaces & furniture",
  "Vacuum & mop all floors",
  "Clean kitchen counters & sink",
  "Scrub bathrooms & toilets",
  "Wipe mirrors & glass",
  "Change bed linens (on request)",
  "Empty bins & replace bags",
  "Wipe appliance exteriors",
  "Clean skirting boards",
  "Tidy living areas",
  "Spot-clean walls",
  "Sanitize door handles",
];

const BENEFITS = [
  {
    icon: "💸",
    title: "Save money over time",
    text: "Recurring customers get loyalty discounts that grow over time. The longer you stay, the more you save — up to 15% off for long-term plans.",
  },
  {
    icon: "🧠",
    title: "Never think about it again",
    text: "Set your schedule once and we handle everything. No reminders, no rescheduling stress. Your clean home runs on autopilot.",
  },
  {
    icon: "🤝",
    title: "Same maid, every time",
    text: "Build a relationship with a trusted professional who knows your home, your preferences, and exactly how you like things done.",
  },
  {
    icon: "🔄",
    title: "Flexible & no contracts",
    text: "Pause, reschedule, or cancel anytime. No lock-in, no penalty fees. We earn your loyalty — we don't demand it.",
  },
];

const FAQS = [
  {
    q: "Can I change my cleaning frequency later?",
    a: "Absolutely. You can switch between weekly, fortnightly, or monthly plans at any time from your bookings page. Changes take effect from your next booking.",
  },
  {
    q: "Will I always get the same maid?",
    a: "We do our best to assign you the same professional every visit. If your regular maid is unavailable, we'll notify you in advance and send an equally vetted replacement.",
  },
  {
    q: "What if I need to skip a week?",
    a: "Just cancel or reschedule through the app at least 24 hours before your booking with no charge. Your recurring plan continues from your next scheduled visit.",
  },
  {
    q: "Do I need to provide cleaning supplies?",
    a: "Our maids bring all necessary equipment and eco-friendly cleaning products. If you prefer specific products, just let us know and we'll accommodate.",
  },
  {
    q: "Is there a minimum commitment period?",
    a: "No minimum commitment. You can cancel anytime. We believe in earning your repeat business through great service, not contracts.",
  },
];

export default function RecurringCleaning() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [hours, setHours] = useState(3);
  const [rate, setRate] = useState(3000);
  const [freq, setFreq] = useState("weekly");

  const visitsPerMonth = freq === "weekly" ? 4 : freq === "biweekly" ? 2 : 1;
  const monthlyTotal = hours * rate * visitsPerMonth;
  const discount = freq === "weekly" ? 0.1 : freq === "biweekly" ? 0.05 : 0;
  const discounted = Math.round(monthlyTotal * (1 - discount));
  const savings = monthlyTotal - discounted;

  return (
    <div className={styles.page}>
      {/* ── Hero ────────────────────────────── */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Recurring cleaning plans</p>
        <h1 className={styles.heroTitle}>
          A clean home,
          <br />
          <em>every single week.</em>
        </h1>
        <p className={styles.heroDesc}>
          Set your schedule once. We handle the rest. Trusted maids, consistent
          results, zero effort from you.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* ── Frequency options ────────────────── */}
      <div className={styles.freqSection}>
        <p className={styles.sectionEyebrow}>Choose your plan</p>
        <h2 className={styles.sectionTitle}>How often would you like us?</h2>
        <div className={styles.freqCards}>
          {FREQUENCIES.map((f) => (
            <div key={f.name} className={styles.freqCard}>
              <div className={styles.freqTop}>
                <div className={styles.freqLabel}>
                  <div className={styles.freqIcon}>{f.icon}</div>
                  <p className={styles.freqName}>{f.name}</p>
                </div>
                <span className={styles.freqBadge}>{f.badge}</span>
              </div>
              <p className={styles.freqDesc}>{f.desc}</p>
              <div className={styles.freqPerks}>
                {f.perks.map((p) => (
                  <span key={p} className={styles.freqPerk}>
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── What's included ──────────────────── */}
      <div className={styles.included}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Every visit
        </p>
        <h2 className={styles.includedTitle}>What's included in every clean</h2>
        <p className={styles.includedSub}>
          No extra charges. No hidden fees. Everything below, every time.
        </p>
        <div className={styles.includedGrid}>
          {INCLUDED.map((item) => (
            <div key={item} className={styles.includedItem}>
              <div className={styles.includedCheck}>✓</div>
              <p className={styles.includedText}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Benefits ─────────────────────────── */}
      <div className={styles.benefits}>
        <p className={styles.sectionEyebrow}>Why go recurring</p>
        <h2 className={styles.sectionTitle}>More than just a clean home</h2>
        <div className={styles.benefitsList}>
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className={styles.benefitCard}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={styles.benefitIcon}>{b.icon}</div>
              <div>
                <p className={styles.benefitTitle}>{b.title}</p>
                <p className={styles.benefitText}>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Savings calculator ───────────────── */}
      <div className={styles.calculator}>
        <div className={styles.calcHeader}>
          <div className={styles.calcIcon}>🧮</div>
          <h3 className={styles.calcTitle}>Estimate your monthly cost</h3>
        </div>
        <div className={styles.calcRow}>
          <div className={styles.calcField}>
            <label className={styles.calcLabel}>Frequency</label>
            <select
              className={styles.calcSelect}
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
            >
              <option value="weekly">Weekly (4x/month)</option>
              <option value="biweekly">Every 2 weeks (2x/month)</option>
              <option value="monthly">Monthly (1x/month)</option>
            </select>
          </div>
          <div className={styles.calcField}>
            <label className={styles.calcLabel}>Hours per visit</label>
            <input
              className={styles.calcInput}
              type="number"
              min="1"
              max="12"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </div>
        </div>
        <div className={styles.calcRow}>
          <div className={styles.calcField}>
            <label className={styles.calcLabel}>Hourly rate (₦)</label>
            <input
              className={styles.calcInput}
              type="number"
              min="1000"
              step="500"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>
        </div>
        <div className={styles.calcResult}>
          <div>
            <p className={styles.calcResultLabel}>
              Monthly total ({visitsPerMonth} visit
              {visitsPerMonth > 1 ? "s" : ""})
            </p>
            {discount > 0 && (
              <p className={styles.calcSavings}>
                You save ₦{savings.toLocaleString()} with{" "}
                {freq === "weekly" ? "10%" : "5%"} loyalty discount
              </p>
            )}
          </div>
          <p className={styles.calcResultAmount}>
            ₦{discounted.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────── */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Got questions?</p>
        <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
        <div className={styles.faqList}>
          {FAQS.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {f.q}
                <span
                  className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ""}`}
                >
                  ▾
                </span>
              </button>
              {openFaq === i && <p className={styles.faqAnswer}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────── */}
      <div className={styles.cta}>
        <div className={styles.ctaIcon}>🏠</div>
        <h2 className={styles.ctaTitle}>Start your recurring plan today</h2>
        <p className={styles.ctaText}>
          Pick your maid, set your schedule, and enjoy a permanently clean home.
          Cancel anytime — no contracts.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/maids")}
          >
            Browse Maids
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/request-a-free-estimate")}
          >
            Get a Free Estimate
          </button>
        </div>
      </div>
    </div>
  );
}
