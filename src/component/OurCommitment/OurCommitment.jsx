import { useNavigate } from "react-router-dom";
import styles from "./OurCommitment.module.css";
import FixedHeader from "../FixedHeader";

const PILLARS = [
  {
    icon: "🛡️",
    name: "Safety & Trust",
    sub: "Non-negotiable, every time",
    desc: "Every maid is vetted before joining our platform and held to strict conduct standards throughout their time with us. Your safety and trust are not features — they are the foundation.",
    promises: [
      "Multi-stage background verification for all maids",
      "Immediate suspension for conduct violations",
      "Secure payment processing — your card data is never stored",
      "Admin review of every booking before confirmation",
    ],
  },
  {
    icon: "⚖️",
    name: "Fairness & Transparency",
    sub: "What you see is what you get",
    desc: "We don't do hidden fees, misleading promotions, or opaque pricing. Customers know what they'll pay before they book. Maids know what they'll earn before they accept.",
    promises: [
      "Prices displayed upfront — no surprise charges",
      "Maids set their own hourly rates",
      "All platform deductions disclosed clearly",
      "Honest review system with no manipulation",
    ],
  },
  {
    icon: "✅",
    name: "Quality & Standards",
    sub: "Consistent excellence, every visit",
    desc: "We maintain a 50-point cleaning checklist, require punctuality, and follow up on every booking with a customer review. Maids who underperform receive coaching — and if they don't improve, they leave.",
    promises: [
      "Comprehensive room-by-room cleaning checklist",
      "Rating system holds every maid accountable",
      "Low-rated maids coached or removed",
      "24-hour re-clean guarantee if anything is missed",
    ],
  },
  {
    icon: "🤝",
    name: "Maid Welfare",
    sub: "Professionals, not commodities",
    desc: "We believe the people doing the cleaning are skilled professionals who deserve respect, fair pay, and reliable work. Their welfare is part of our commitment — not an afterthought.",
    promises: [
      "Fair, market-rate pay with no arbitrary deductions",
      "Protection from unreasonable customer demands",
      "Clear, respectful dispute resolution process",
      "Ongoing support, training, and development",
    ],
  },
  {
    icon: "🌿",
    name: "Environmental Responsibility",
    sub: "Clean homes, clean planet",
    desc: "We use plant-based, biodegradable cleaning products on every booking by default. We're reducing our chemical footprint across every home we clean in Nigeria.",
    promises: [
      "No bleach, ammonia, or toxic chemicals",
      "Biodegradable products on all bookings",
      "Minimal packaging across all cleaning supplies",
      "Working toward carbon-neutral operations",
    ],
  },
  {
    icon: "📞",
    name: "Responsiveness",
    sub: "Real people, real answers",
    desc: "When something goes wrong — and sometimes things do — we respond quickly, take accountability, and fix it. No chatbots, no runaround. A real person who cares about your experience.",
    promises: [
      "Support response within 2 business hours",
      "Complaints escalated immediately if unresolved",
      "Refunds processed within 3–5 business days",
      "Post-booking follow-up on every complaint",
    ],
  },
];

const CUSTOMER_COMMITS = [
  {
    icon: "🔒",
    title: "Your home is safe",
    text: "Every maid is verified. We take full responsibility for who we send into your space.",
  },
  {
    icon: "💳",
    title: "Your money is protected",
    text: "Payments are held securely. If a booking is rejected or cancelled, refunds are automatic.",
  },
  {
    icon: "⏰",
    title: "Your time is respected",
    text: "Maids arrive on time or notify you in advance. Consistent lateness is grounds for removal.",
  },
  {
    icon: "🔄",
    title: "Your satisfaction is guaranteed",
    text: "Not happy? Tell us within 24 hours. We re-clean for free or refund in full.",
  },
  {
    icon: "🙅",
    title: "No hidden fees, ever",
    text: "The price you see before booking is the price you pay. Always.",
  },
  {
    icon: "📋",
    title: "Honest reviews only",
    text: "We never suppress negative reviews. Every rating is real and publicly visible.",
  },
];

const MAID_COMMITS = [
  "We will always pay you on time and in full, with no unexplained deductions.",
  "We will treat you as a skilled professional, not a commodity or a cost to minimize.",
  "We will provide clear booking details, giving you enough time to prepare for every job.",
  "We will protect you from unfair customer complaints with a transparent investigation process.",
  "We will invest in your development through training, feedback, and platform improvements.",
  "We will advocate for fair working conditions and reasonable expectations on every booking.",
];

const GUARANTEES = [
  "If a maid fails to show up for a confirmed booking, you receive a full refund within 24 hours.",
  "If you're not satisfied with the clean, we send the maid back within 24 hours — free of charge.",
  "If you find an undisclosed charge on your payment, we refund it plus a 10% goodwill credit.",
  "If a maid damages property during a clean, we investigate and facilitate fair compensation.",
];

const PLANET_COMMITS = [
  {
    icon: "🌱",
    title: "Plant-based only",
    text: "Every product we use is sourced from natural plant extracts. No petrochemicals, ever.",
  },
  {
    icon: "♻️",
    title: "Minimal packaging",
    text: "We use concentrated, refillable products to reduce plastic waste across all bookings.",
  },
  {
    icon: "💧",
    title: "Waterway safe",
    text: "Our biodegradable products break down naturally without polluting rivers or groundwater.",
  },
  {
    icon: "🌍",
    title: "Nigeria first",
    text: "We prioritize locally sourced eco products that support Nigerian businesses and reduce import emissions.",
  },
];

export default function OurCommitment() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Our commitment</p>
        <h1 className={styles.heroTitle}>
          Promises we
          <br />
          <em>actually keep.</em>
        </h1>
        <p className={styles.heroDesc}>
          Anyone can make promises. We put ours in writing — and we hold
          ourselves accountable to every single one of them.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* Opening */}
      <div className={styles.statement}>
        <div className={styles.statementInner}>
          <p className={styles.statementQuote}>
            "A commitment is not a marketing line. It is a{" "}
            <em>standard we hold ourselves to</em>, even when it's inconvenient
            — especially when it's inconvenient."
          </p>
          <p className={styles.statementText}>
            The commitments on this page are not aspirational goals or brand
            copy. They are operating standards. When we fall short — and we are
            human, so we sometimes do — we acknowledge it, fix it, and use it to
            improve. That's what commitment actually means.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className={styles.pillars}>
        <p className={styles.sectionEyebrow}>Six commitments</p>
        <h2 className={styles.sectionTitle}>What we commit to, and how</h2>
        <div className={styles.pillarCards}>
          {PILLARS.map((p) => (
            <div key={p.name} className={styles.pillarCard}>
              <div className={styles.pillarBanner} />
              <div className={styles.pillarBody}>
                <div className={styles.pillarTop}>
                  <div className={styles.pillarIcon}>{p.icon}</div>
                  <div>
                    <p className={styles.pillarName}>{p.name}</p>
                    <p className={styles.pillarSub}>{p.sub}</p>
                  </div>
                </div>
                <p className={styles.pillarDesc}>{p.desc}</p>
                <div className={styles.pillarPromises}>
                  {p.promises.map((pr) => (
                    <div key={pr} className={styles.promise}>
                      <div className={styles.promiseDot}>✓</div>
                      <span>{pr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* To customers */}
      <div className={styles.toCustomers}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          To every customer
        </p>
        <h2 className={styles.toCustomersTitle}>
          What you can always expect from us
        </h2>
        <p className={styles.toCustomersSub}>
          These are not aspirations. They are standards we hold ourselves to on
          every single booking.
        </p>
        <div className={styles.customerCommits}>
          {CUSTOMER_COMMITS.map((c) => (
            <div key={c.title} className={styles.customerCommit}>
              <div className={styles.customerCommitIcon}>{c.icon}</div>
              <div>
                <p className={styles.customerCommitTitle}>{c.title}</p>
                <p className={styles.customerCommitText}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* To maids */}
      <div className={styles.toMaids}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          To every maid on our platform
        </p>
        <h2 className={styles.toMaidsTitle}>
          Our commitment to the people who clean
        </h2>
        <p className={styles.toMaidsSub}>
          We are only as good as our maids. That's why we take our commitment to
          them as seriously as our commitment to customers.
        </p>
        <div className={styles.maidCommits}>
          {MAID_COMMITS.map((c, i) => (
            <div key={i} className={styles.maidCommit}>
              <div className={styles.maidCommitDot}>✓</div>
              <p className={styles.maidCommitText}>{c}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee */}
      <div className={styles.guarantee}>
        <div className={styles.guaranteeInner}>
          <p className={styles.guaranteeLabel}>Our guarantee</p>
          <h3 className={styles.guaranteeTitle}>
            What happens when we fall short
          </h3>
          <div className={styles.guaranteeItems}>
            {GUARANTEES.map((g, i) => (
              <div key={i} className={styles.guaranteeItem}>
                <div className={styles.guaranteeCheck}>✓</div>
                <p className={styles.guaranteeText}>{g}</p>
              </div>
            ))}
          </div>
          <button
            className={styles.guaranteeBtn}
            onClick={() => navigate("/why-hire-us")}
          >
            See all our guarantees →
          </button>
        </div>
      </div>

      {/* Planet */}
      <div className={styles.planet}>
        <p className={styles.sectionEyebrow}>Our planet commitment</p>
        <h2 className={styles.sectionTitle}>
          Cleaning without the cost to the environment
        </h2>
        <div className={styles.planetCards}>
          {PLANET_COMMITS.map((p) => (
            <div key={p.title} className={styles.planetCard}>
              <div className={styles.planetIcon}>{p.icon}</div>
              <div>
                <p className={styles.planetTitle}>{p.title}</p>
                <p className={styles.planetText}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Hold us to our word</h2>
        <p className={styles.ctaText}>
          Book a clean and experience what a genuine commitment looks like in
          practice.
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
            onClick={() => navigate("/our-approach")}
          >
            Our Approach
          </button>
        </div>
      </div>
    </div>
  );
}
