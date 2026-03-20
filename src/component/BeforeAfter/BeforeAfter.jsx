import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BeforeAfter.module.css";
import FixedHeader from "../FixedHeader";

const BEFORE_STEPS = [
  {
    icon: "📋",
    title: "Confirm your booking",
    text: "You'll receive a booking confirmation by email and SMS with your maid's name, photo, arrival time, and a link to your booking details.",
  },
  {
    icon: "🔑",
    title: "Arrange access",
    text: "Decide how your maid will enter. You can be home, give a key, leave a code, or arrange with a neighbour. Note your preference in the booking.",
  },
  {
    icon: "📦",
    title: "Clear personal items",
    text: "Put away valuables, important documents, and anything fragile. This lets your maid clean surfaces thoroughly without risk to your belongings.",
  },
  {
    icon: "🐾",
    title: "Secure pets if needed",
    text: "If you have pets, secure them in a room or arrange for them to be out during the clean. Note any pet details in your booking so your maid is prepared.",
  },
  {
    icon: "📝",
    title: "Leave special instructions",
    text: "Added specific notes to your booking? Your maid will review them before arrival. Leave a printed note too if it helps — we encourage clear communication.",
  },
  {
    icon: "✅",
    title: "That's it — you're ready",
    text: "You don't need to prepare the house or pre-clean anything. That's our job. Just make sure there's access to water and cleaning areas.",
  },
];

const DURING_TIPS = [
  {
    icon: "🏠",
    title: "You don't need to be home",
    text: "Many customers give key access and return to a spotless home. If you prefer to stay, that's fine too — just let your maid work without interruption.",
  },
  {
    icon: "📍",
    title: "Arrival notification",
    text: "Your maid sends a message when they arrive and when they leave. You'll always know what's happening, even if you're not home.",
  },
  {
    icon: "⏱️",
    title: "Estimated duration",
    text: "A 1-bed takes 2–3 hours, a 3-bed takes 4–6 hours. For deep cleans, add 30–60 minutes per room. We always allocate enough time — nothing is rushed.",
  },
  {
    icon: "💬",
    title: "Questions during the clean",
    text: "If your maid has questions — about a specific area or product — they'll contact you directly via the app. Keep your phone available.",
  },
];

const AFTER_STEPS = [
  {
    icon: "📸",
    title: "Completion message",
    text: "Once the clean is complete, your maid sends a completion confirmation. Some maids include a brief summary of what was done.",
  },
  {
    icon: "🕐",
    title: "Ventilate if needed",
    text: "Open windows for 15–20 minutes after a deep clean to let any cleaning product scent clear. Surfaces will be dry within minutes.",
  },
  {
    icon: "🔍",
    title: "Do a walkthrough",
    text: "Walk through each room and inspect the clean. Check the areas on your booking checklist. If anything was missed, contact us immediately.",
  },
  {
    icon: "⭐",
    title: "Leave a review",
    text: "Your review takes 30 seconds and makes a real difference. It helps your maid build their reputation and helps other customers find great help.",
  },
  {
    icon: "📅",
    title: "Set up a recurring plan",
    text: "If you were happy, consider booking a weekly or fortnightly plan. You'll be assigned the same maid — they'll learn your home and standards over time.",
  },
  {
    icon: "🛡️",
    title: "Something wasn't right?",
    text: "Contact us within 24 hours if anything was missed or not up to standard. We'll send a reclean or resolve the issue — no questions asked.",
  },
];

const FAQS = [
  {
    q: "What if I'm not happy with the clean?",
    a: "Contact us within 24 hours and we'll arrange a reclean of any missed areas at no extra charge. We take quality seriously and want every customer to be completely satisfied.",
  },
  {
    q: "Do I need to provide anything for the maid?",
    a: "No — your maid arrives with all equipment and products. Just ensure there's access to a water supply and power. If you have specific products you prefer, leave them out.",
  },
  {
    q: "What happens if my maid is running late?",
    a: "Your maid will notify you via the app if they're delayed. We expect punctuality from all our maids. If lateness becomes a pattern, contact us and we'll address it.",
  },
  {
    q: "Can I give my maid a key for future visits?",
    a: "Yes — many customers do this for regular bookings. Note the key arrangement in your booking preferences. We recommend a dedicated set rather than your main keys.",
  },
  {
    q: "What should I do with my pet during the clean?",
    a: "Secure pets in a separate room or arrange for them to be out during the visit. Note any pet details in your booking so your maid is prepared on arrival.",
  },
];

const TIPS = [
  {
    emoji: "🧴",
    tip: "Put preferred products on the counter so your maid sees them immediately",
  },
  {
    emoji: "📋",
    tip: "Leave a printed checklist for any tasks you want prioritised",
  },
  {
    emoji: "🪣",
    tip: "Empty kitchen and bathroom bins before the maid arrives",
  },
  {
    emoji: "📦",
    tip: "Clear flat surfaces of clutter so every inch can be cleaned",
  },
  {
    emoji: "🐶",
    tip: "Note which rooms pets use most so they get extra attention",
  },
  {
    emoji: "💡",
    tip: "Leave all lights on so your maid can see every surface clearly",
  },
];

export default function BeforeAfter() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("before");

  const TABS = [
    { key: "before", label: "Before your clean" },
    { key: "during", label: "During your clean" },
    { key: "after", label: "After your clean" },
  ];

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Your complete guide</p>
        <h1 className={styles.heroTitle}>
          Before and after
          <br />
          <em>your cleaning.</em>
        </h1>
        <p className={styles.heroDesc}>
          Everything you need to know — what to do before your maid arrives,
          what happens during the clean, and what to expect when they leave.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => navigate("/maids")}
          >
            Book a Clean
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() => navigate("/whats-included")}
          >
            What's Included
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsBar}>
        {[
          ["98%", "Satisfaction rate"],
          ["15m", "Prep time needed"],
          ["24h", "Issue resolution"],
          ["5★", "Average rating"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* Tabbed guide */}
      <div className={styles.guide}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Step by step
        </p>
        <h2 className={styles.guideTitle}>Your complete cleaning guide</h2>

        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "before" && (
          <div className={styles.stepGrid}>
            {BEFORE_STEPS.map((s, i) => (
              <div key={s.title} className={styles.stepCard}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "during" && (
          <div className={styles.duringGrid}>
            {DURING_TIPS.map((d) => (
              <div key={d.title} className={styles.duringCard}>
                <div className={styles.duringIcon}>{d.icon}</div>
                <div>
                  <p className={styles.duringTitle}>{d.title}</p>
                  <p className={styles.duringText}>{d.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "after" && (
          <div className={styles.stepGrid}>
            {AFTER_STEPS.map((s, i) => (
              <div key={s.title} className={styles.stepCard}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Pro tips</p>
        <h2 className={styles.sectionTitle}>Get more from every clean</h2>
        <p className={styles.sectionSub}>
          Small things that make a big difference to the quality of your clean.
        </p>
        <div className={styles.tipsGrid}>
          {TIPS.map((t) => (
            <div key={t.tip} className={styles.tipCard}>
              <span className={styles.tipEmoji}>{t.emoji}</span>
              <p className={styles.tipText}>{t.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Day of your clean
        </p>
        <h2 className={styles.timelineTitle}>
          What a typical clean day looks like
        </h2>
        <div className={styles.timelineList}>
          {[
            {
              time: "Day before",
              event:
                "Receive reminder with your maid's details and arrival window",
            },
            {
              time: "Morning",
              event: "Clear surfaces and secure pets. No other prep needed",
            },
            {
              time: "On arrival",
              event: "Maid sends arrival message and begins the checklist",
            },
            {
              time: "During",
              event:
                "You can be home or out — maid works through each room systematically",
            },
            {
              time: "Completion",
              event:
                "Maid sends done message and leaves your home locked and secure",
            },
            {
              time: "That evening",
              event:
                "Review request arrives — 30 seconds to leave a star rating",
            },
          ].map((item) => (
            <div key={item.time} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <p className={styles.timelineTime}>{item.time}</p>
                <p className={styles.timelineEvent}>{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Common questions answered</h2>
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

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to book your clean?</h2>
        <p className={styles.ctaText}>
          Now you know exactly what to expect — from booking to spotless home.
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
