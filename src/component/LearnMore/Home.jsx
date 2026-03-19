import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const REASONS = [
  {
    icon: "🔍",
    title: "Thoroughly Vetted Professionals",
    text: "Every maid on our platform goes through background checks, reference verification, and a personal interview before being listed. You only meet the best.",
  },
  {
    icon: "🛡️",
    title: "Fully Insured & Bonded",
    text: "All cleaning professionals are insured. If anything unexpected happens during your service, you're fully protected — no stress, no liability.",
  },
  {
    icon: "⭐",
    title: "Rated & Reviewed",
    text: "Real reviews from real customers after every booking. See ratings, read comments, and choose with confidence based on honest feedback.",
  },
  {
    icon: "📅",
    title: "Flexible Scheduling",
    text: "Book a one-time deep clean, a move-in/move-out service, or set up recurring weekly visits — on your schedule, not ours.",
  },
  {
    icon: "💳",
    title: "Secure Payments",
    text: "Pay securely via Paystack. Every transaction is encrypted and processed safely. No cash, no awkward handoffs — just clean homes.",
  },
  {
    icon: "🤝",
    title: "Satisfaction Guaranteed",
    text: "Not happy with your clean? Let us know within 24 hours and we'll make it right — free re-clean or a full refund. No questions asked.",
  },
  {
    icon: "📍",
    title: "Serving Abuja & Lagos",
    text: "We bring professional home cleaning directly to your neighborhood. Residential, light commercial, move-in/out — we cover it all.",
  },
];

const STEPS = [
  {
    title: "Browse & Choose",
    text: "Search available maids in your area, view their profiles, ratings, and hourly rates.",
  },
  {
    title: "Book in Minutes",
    text: "Select your date, duration, and address. The whole booking takes under 2 minutes.",
  },
  {
    title: "Pay Securely",
    text: "Complete payment via Paystack. Your booking is confirmed once our team approves it.",
  },
  {
    title: "Enjoy a Spotless Home",
    text: "Your maid arrives on time, does an exceptional job, and leaves your space sparkling.",
  },
];

const TESTIMONIALS = [
  {
    text: "I was nervous at first but Deusizi Sparkle exceeded every expectation. My house has never looked this clean. Booking took 2 minutes and the maid was punctual and thorough.",
    name: "Amaka O.",
    location: "Lekki, Lagos",
    stars: 5,
  },
  {
    text: "Used them for a move-out clean after 3 years in an apartment. They got my full deposit back. Worth every naira — I'll never clean myself again.",
    name: "Chidi E.",
    location: "Wuse II, Abuja",
    stars: 5,
  },
  {
    text: "The recurring plan is perfect for my busy schedule. Same maid every week, reliable, professional, and my apartment stays immaculate.",
    name: "Funmi A.",
    location: "Victoria Island, Lagos",
    stars: 5,
  },
  {
    text: "What I love most is the transparency — I saw reviews before booking and the maid was exactly as described. No surprises, just great service.",
    name: "Bola M.",
    location: "Garki, Abuja",
    stars: 5,
  },
];

export default function WhyHireUs() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* ── Hero ────────────────────────────── */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Why choose us</p>
        <h1 className={styles.heroTitle}>
          A cleaner home.
          <br />
          <em>Zero hassle.</em>
        </h1>
        <p className={styles.heroDesc}>
          Deusizi Sparkle connects you with Nigeria's most trusted home cleaning
          professionals. Vetted, insured, rated — and just a tap away.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* ── Stats ───────────────────────────── */}
      <div className={styles.stats}>
        {[
          ["100+", "Homes Cleaned"],
          ["50+", "Verified Maids"],
          ["98%", "Satisfaction Rate"],
          ["2 min", "Average Booking Time"],
        ].map(([num, label]) => (
          <div key={label} className={styles.statItem}>
            <p className={styles.statNum}>{num}</p>
            <p className={styles.statLabel}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Reasons ─────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Our difference</p>
        <h2 className={styles.sectionTitle}>
          7 reasons customers choose Deusizi Sparkle
        </h2>
        <div className={styles.reasons}>
          {REASONS.map((r) => (
            <div key={r.title} className={styles.reasonCard}>
              <div className={styles.reasonIcon}>{r.icon}</div>
              <div className={styles.reasonBody}>
                <p className={styles.reasonTitle}>{r.title}</p>
                <p className={styles.reasonText}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ────────────────────── */}
      <div className={styles.process}>
        <p className={styles.sectionEyebrow}>How it works</p>
        <h2 className={styles.sectionTitle}>Clean home in 4 simple steps</h2>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s.title} className={styles.step}>
              <div className={styles.stepNum}>{i + 1}</div>
              <div className={styles.stepBody}>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Guarantee ───────────────────────── */}
      <div className={styles.guarantee}>
        <div className={styles.guaranteeIcon}>🛡️</div>
        <h3 className={styles.guaranteeTitle}>
          Our 100% Satisfaction Guarantee
        </h3>
        <p className={styles.guaranteeText}>
          If you're not completely satisfied with your cleaning, contact us
          within 24 hours. We'll send your maid back to re-clean — or issue a
          full refund. No forms, no friction. We stand behind every service we
          provide.
        </p>
      </div>

      {/* ── Testimonials ────────────────────── */}
      <div className={styles.testimonials}>
        <p className={styles.sectionEyebrow} style={{ paddingTop: 50 }}>
          What our customers say
        </p>
        <h2 className={styles.sectionTitle}>Real homes. Real results.</h2>
        <div className={styles.testimonialList}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <p className={styles.testimonialText}>"{t.text}"</p>
              <div className={styles.testimonialAuthor}>
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
                <div className={styles.testimonialStars}>
                  {"★".repeat(t.stars)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ─────────────────────────────── */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready for a cleaner home?</h2>
        <p className={styles.ctaText}>
          Join hundreds of happy customers across Abuja and Lagos. Book your
          first clean today — in under 2 minutes.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/maids")}
          >
            Browse Maids Now
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
