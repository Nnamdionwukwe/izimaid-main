import { useNavigate } from "react-router-dom";
import styles from "./OurApproach.module.css";
import FixedHeader from "../FixedHeader";

const PILLARS = [
  {
    num: "01",
    title: "People first, always",
    text: "Every decision we make starts with one question: is this good for the people in our community? That includes our maids — who are skilled professionals deserving of fair pay and respect — and our customers, who trust us with their homes.",
  },
  {
    num: "02",
    title: "Transparency over polish",
    text: "We don't hide behind glossy promises. You see real ratings, read real reviews, and pay a price that reflects the actual work. No hidden fees. No surprise charges. No fine print designed to confuse.",
  },
  {
    num: "03",
    title: "Standards that don't slip",
    text: "Every maid is vetted. Every booking is reviewed. Every complaint is taken seriously. We'd rather have fewer maids on our platform than compromise the trust customers place in us.",
  },
  {
    num: "04",
    title: "Technology with a human touch",
    text: "Our platform makes booking fast and simple — but behind every transaction is a team of real people ensuring things go right. When something goes wrong, you reach a human, not a chatbot.",
  },
];

const PROCESS_STEPS = [
  {
    icon: "🔍",
    title: "Maid application & screening",
    text: "Every maid who applies to Deusizi Sparkle submits to a multi-stage vetting process: background check, reference verification, skills assessment, and a personal interview with our team.",
  },
  {
    icon: "✅",
    title: "Approval & onboarding",
    text: "Only maids who pass all stages are listed on our platform. They complete our onboarding program covering our standards, customer communication, eco-friendly product use, and safety protocols.",
  },
  {
    icon: "📅",
    title: "Booking & payment",
    text: "Customers book through our platform. Payment is held securely via Paystack and only released after our admin team reviews and approves the booking — ensuring fairness on both sides.",
  },
  {
    icon: "🏠",
    title: "Service delivery",
    text: "Your maid arrives on time, equipped with all necessary materials. They work through our comprehensive room-by-room checklist and communicate with you before leaving.",
  },
  {
    icon: "⭐",
    title: "Review & quality control",
    text: "After every booking, we invite customers to rate and review. Low-rated maids receive coaching and support. Persistent quality issues result in removal from the platform.",
  },
];

const VALUES = [
  {
    emoji: "🤝",
    name: "Trust",
    text: "We vet every maid and every booking. Trust is earned through consistent action, not marketing.",
  },
  {
    emoji: "⚖️",
    name: "Fairness",
    text: "Fair prices for customers. Fair pay for maids. No one gets exploited on our platform.",
  },
  {
    emoji: "🌿",
    name: "Sustainability",
    text: "Eco-friendly products by default. We clean homes without harming the environment.",
  },
  {
    emoji: "💬",
    name: "Transparency",
    text: "Real reviews. Real prices. Real people. No hidden fees or misleading promises.",
  },
  {
    emoji: "🎯",
    name: "Excellence",
    text: "We hold ourselves and our maids to a standard that makes customers proud to recommend us.",
  },
  {
    emoji: "🏙️",
    name: "Community",
    text: "We're building a cleaning economy that benefits Nigerian families and working professionals alike.",
  },
  {
    emoji: "🔄",
    name: "Consistency",
    text: "Great service once is luck. Great service every time is a system — and that's what we've built.",
  },
  {
    emoji: "🛡️",
    name: "Safety",
    text: "Your home, your safety, and your data are always protected. Non-negotiable.",
  },
];

const STANDARDS = [
  {
    icon: "🧹",
    name: "Cleaning standards",
    desc: "Every maid follows our 50-point room-by-room checklist on every visit",
  },
  {
    icon: "⏰",
    name: "Punctuality",
    desc: "Maids are expected to arrive within the confirmed time window, always",
  },
  {
    icon: "🗣️",
    name: "Communication",
    desc: "Maids confirm arrival and completion — customers are never left wondering",
  },
  {
    icon: "🌿",
    name: "Eco products",
    desc: "Plant-based, non-toxic cleaning products used on every booking by default",
  },
];

export default function OurApproach() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>About us</p>
        <h1 className={styles.heroTitle}>
          How we do
          <br />
          <em>what we do.</em>
        </h1>
        <p className={styles.heroDesc}>
          Deusizi Sparkle isn't just a cleaning marketplace. It's a system built
          on principles — for customers who expect more, and maids who deserve
          better.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* Manifesto */}
      <div className={styles.manifesto}>
        <div className={styles.manifestoInner}>
          <p className={styles.manifestoQuote}>
            "We believe that a clean home is not a luxury — it's a foundation
            for a better life. And the people who provide that service deserve{" "}
            <em>respect, fair pay, and reliable work.</em>"
          </p>
          <p className={styles.manifestoText}>
            That belief shapes everything we do: how we vet maids, how we price
            services, how we resolve disputes, and how we build the technology
            that connects them all. We are not perfect — but we are consistent,
            transparent, and genuinely trying to get it right.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className={styles.pillars}>
        <p className={styles.pillarsEyebrow}>Our pillars</p>
        <h2 className={styles.pillarsTitle}>The principles we build on</h2>
        <div className={styles.pillarList}>
          {PILLARS.map((p) => (
            <div key={p.num} className={styles.pillarCard}>
              <div className={styles.pillarNum}>{p.num}</div>
              <div className={styles.pillarBody}>
                <p className={styles.pillarTitle}>{p.title}</p>
                <p className={styles.pillarText}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className={styles.process}>
        <p className={styles.sectionEyebrow}>How it works behind the scenes</p>
        <h2 className={styles.sectionTitle}>
          From maid application to your clean home
        </h2>
        <div className={styles.processSteps}>
          {PROCESS_STEPS.map((s, i) => (
            <div key={s.title} className={styles.processStep}>
              <div className={styles.processIcon}>{s.icon}</div>
              <div className={styles.processBody}>
                <p className={styles.processTitle}>{s.title}</p>
                <p className={styles.processText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className={styles.values}>
        <p className={styles.sectionEyebrow}>What we stand for</p>
        <h2 className={styles.sectionTitle}>Our values</h2>
        <div className={styles.valueGrid}>
          {VALUES.map((v) => (
            <div key={v.name} className={styles.valueCard}>
              <div className={styles.valueEmoji}>{v.emoji}</div>
              <p className={styles.valueName}>{v.name}</p>
              <p className={styles.valueText}>{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Standards */}
      <div className={styles.standards}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Non-negotiable
        </p>
        <h2 className={styles.standardsTitle}>Our service standards</h2>
        <p className={styles.standardsSub}>
          These aren't aspirations — they're requirements. Every maid on our
          platform is held to all four standards on every single booking.
        </p>
        <div className={styles.standardGrid}>
          {STANDARDS.map((s) => (
            <div key={s.name} className={styles.standardItem}>
              <div className={styles.standardIcon}>{s.icon}</div>
              <p className={styles.standardName}>{s.name}</p>
              <p className={styles.standardDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div className={styles.story}>
        <div className={styles.storyInner}>
          <p className={styles.sectionEyebrow}>Our story</p>
          <h2 className={styles.sectionTitle}>Why we built this</h2>
          <p className={styles.storyText}>
            Deusizi Sparkle was born out of a simple frustration: finding a
            reliable, professional cleaner in Abuja or Lagos was harder than it
            should be. The few options available were unreliable, opaque on
            pricing, or dismissed the very maids doing the work as an
            afterthought.
          </p>
          <div className={styles.storyHighlight}>
            "We wanted to build something different — a platform where customers
            could trust who was coming into their homes, and where maids could
            build a stable, professional income doing work they're skilled at."
          </div>
          <p className={styles.storyText}>
            So we started with the fundamentals: rigorous vetting, transparent
            pricing, secure payments, and a review system that actually holds
            people accountable. We built technology that gets out of the way and
            lets the human connection between maid and customer be what it
            should be — professional, respectful, and reliable.
          </p>
          <p className={styles.storyText}>
            We're still building. Every piece of feedback we receive, every
            complaint we resolve, and every five-star review we earn pushes us
            to raise our own standards. That's our approach — and we're not
            planning to change it.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Experience the difference</h2>
        <p className={styles.ctaText}>
          Principles only mean something in action. Book your first clean and
          see our approach for yourself.
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
            onClick={() => navigate("/why-hire-us")}
          >
            Why Hire Us
          </button>
        </div>
      </div>
    </div>
  );
}
