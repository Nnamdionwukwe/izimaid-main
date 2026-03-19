import { useNavigate } from "react-router-dom";
import styles from "./OurResults.module.css";
import FixedHeader from "../FixedHeader";

const BIG_NUMBERS = [
  { num: "100+", label: "Homes cleaned", sub: "Abuja & Lagos" },
  { num: "50+", label: "Verified maids", sub: "And growing" },
  { num: "98%", label: "Satisfaction rate", sub: "Customer-rated" },
  { num: "4.9", label: "Average rating", sub: "Out of 5.0" },
  { num: "₦0", label: "Hidden fees", sub: "What you see is what you pay" },
  { num: "24h", label: "Re-clean guarantee", sub: "If anything's missed" },
];

const IMPACTS = [
  {
    icon: "🏠",
    stat: "100+",
    title: "Homes transformed",
    text: "From studio apartments in Lekki to 4-bedroom family homes in Maitama — we've helped over a hundred households across Abuja and Lagos live in a cleaner, healthier space.",
  },
  {
    icon: "👩‍💼",
    stat: "50+",
    title: "Maids earning better",
    text: "Every maid on our platform earns a fair, transparent rate. No arbitrary deductions. No surprise cuts. We believe the people doing the cleaning deserve to be paid properly for skilled work.",
  },
  {
    icon: "⭐",
    stat: "98%",
    title: "Customers satisfied",
    text: "98% of completed bookings receive a positive rating from customers. For every negative review, we follow up, address the issue, and use it to make our service better.",
  },
  {
    icon: "🔄",
    stat: "72%",
    title: "Customers who rebook",
    text: "72% of first-time customers return for a second booking. That number tells us more than any marketing metric — it means we're delivering on our promise the first time, every time.",
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "I've used 3 cleaning services in Lagos and none came close. Deusizi Sparkle is the only one where the maid actually did what was promised — and more. My bathroom tiles look brand new.",
    name: "Kemi A.",
    location: "Victoria Island, Lagos",
    service: "Deep Clean",
  },
  {
    stars: 5,
    text: "Booked for a move-out clean and got my full deposit back. My landlord was genuinely shocked. This service pays for itself. Will use every time I move.",
    name: "Emeka O.",
    location: "Wuse II, Abuja",
    service: "Move-Out Clean",
  },
  {
    stars: 5,
    text: "The maid arrived 10 minutes early, worked for 4 hours without stopping, and my home looked like a hotel when she was done. I've set up a monthly recurring booking.",
    name: "Adaeze N.",
    location: "Lekki Phase 1, Lagos",
    service: "Monthly Clean",
  },
  {
    stars: 5,
    text: "I was skeptical about booking online but the process was so smooth. Payment was simple, the admin team confirmed quickly, and the maid was professional. 10/10 experience.",
    name: "Bello M.",
    location: "Garki, Abuja",
    service: "Standard Clean",
  },
];

const MILESTONES = [
  {
    icon: "🚀",
    date: "Early 2025",
    title: "Platform launched",
    text: "Deusizi Sparkle goes live with its first 10 maids across Abuja. First 5 bookings completed in week one.",
  },
  {
    icon: "🏙️",
    date: "Mid 2025",
    title: "Lagos expansion",
    text: "We expand to Lagos, onboarding maids across Lekki, Victoria Island, and Ikoyi. Demand exceeds early projections.",
  },
  {
    icon: "💳",
    date: "Late 2025",
    title: "Paystack integration",
    text: "Secure online payments go live. Booking-to-payment flow streamlined to under 2 minutes for customers.",
  },
  {
    icon: "⭐",
    date: "Early 2026",
    title: "98% satisfaction milestone",
    text: "After hundreds of completed bookings, our platform-wide satisfaction rate holds firm at 98%. Our highest-rated maids achieve perfect 5.0 scores.",
  },
  {
    icon: "🌿",
    date: "2026",
    title: "Eco-first commitment",
    text: "We commit to plant-based, non-toxic products on all bookings by default. Every maid is trained on eco-friendly cleaning techniques.",
  },
];

const QUALITY = [
  { label: "Punctuality", score: "96%", pct: 96 },
  { label: "Cleanliness", score: "98%", pct: 98 },
  { label: "Communication", score: "95%", pct: 95 },
  { label: "Value for money", score: "97%", pct: 97 },
];

export default function OurResults() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Track record</p>
        <h1 className={styles.heroTitle}>
          Numbers don't
          <br />
          <em>lie.</em>
        </h1>
        <p className={styles.heroDesc}>
          We measure our success the same way our customers do — by how clean
          the home is when we leave. Here's what the data says.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* Big numbers */}
      <div className={styles.bigNumbers}>
        <div className={styles.bigNumGrid}>
          {BIG_NUMBERS.map((n) => (
            <div key={n.label} className={styles.bigNumItem}>
              <p className={styles.bigNum}>{n.num}</p>
              <p className={styles.bigNumLabel}>{n.label}</p>
              <p className={styles.bigNumSub}>{n.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Our impact</p>
        <h2 className={styles.sectionTitle}>What the numbers actually mean</h2>
        <div className={styles.impactCards}>
          {IMPACTS.map((c) => (
            <div key={c.title} className={styles.impactCard}>
              <div className={styles.impactIcon}>{c.icon}</div>
              <div>
                <p className={styles.impactStat}>{c.stat}</p>
                <p className={styles.impactTitle}>{c.title}</p>
                <p className={styles.impactText}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality breakdown */}
      <div className={styles.quality}>
        <p className={styles.sectionEyebrow} style={{ textAlign: "center" }}>
          Customer ratings breakdown
        </p>
        <h2 className={styles.sectionTitle} style={{ textAlign: "center" }}>
          How customers rate us
        </h2>
        <div className={styles.qualityGrid}>
          {QUALITY.map((q) => (
            <div key={q.label} className={styles.qualityItem}>
              <p className={styles.qualityLabel}>{q.label}</p>
              <div className={styles.qualityBar}>
                <div
                  className={styles.qualityFill}
                  style={{ width: `${q.pct}%` }}
                />
              </div>
              <p className={styles.qualityScore}>{q.score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className={styles.testimonials}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          In their words
        </p>
        <h2 className={styles.testimonialsTitle}>What our customers say</h2>
        <p className={styles.testimonialsSub}>
          Unedited reviews from verified Deusizi Sparkle customers.
        </p>
        <div className={styles.testimonialList}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <p className={styles.testimonialStars}>{"★".repeat(t.stars)}</p>
              <p className={styles.testimonialText}>"{t.text}"</p>
              <div className={styles.testimonialBottom}>
                <div className={styles.testimonialAvatar}>
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialLocation}>{t.location}</p>
                </div>
                <span className={styles.testimonialService}>{t.service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className={styles.milestones}>
        <p className={styles.sectionEyebrow}>Our journey</p>
        <h2 className={styles.sectionTitle}>How we got here</h2>
        <div className={styles.milestoneList}>
          {MILESTONES.map((m) => (
            <div key={m.title} className={styles.milestone}>
              <div className={styles.milestoneDot}>{m.icon}</div>
              <div className={styles.milestoneBody}>
                <p className={styles.milestoneDate}>{m.date}</p>
                <p className={styles.milestoneTitle}>{m.title}</p>
                <p className={styles.milestoneText}>{m.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promise */}
      <div className={styles.promise}>
        <div className={styles.promiseInner}>
          <div className={styles.promiseIcon}>🛡️</div>
          <h3 className={styles.promiseTitle}>
            We back our results with a guarantee
          </h3>
          <p className={styles.promiseText}>
            Not satisfied with any aspect of your clean? Contact us within 24
            hours and we'll return to fix it — free of charge. No arguments, no
            fine print. That's how confident we are in our results.
          </p>
          <button
            className={styles.promiseBtn}
            onClick={() => navigate("/why-hire-us")}
          >
            See all our guarantees
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to be part of our results?</h2>
        <p className={styles.ctaText}>
          Join hundreds of satisfied customers across Abuja and Lagos. Book your
          first clean today.
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
