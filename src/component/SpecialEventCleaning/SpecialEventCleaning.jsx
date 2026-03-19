import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SpecialEventCleaning.module.css";
import FixedHeader from "../FixedHeader";

const EVENTS = [
  {
    icon: "🎉",
    name: "Birthday Party Clean",
    tagline: "Before & after the celebrations",
    desc: "We set up your space before guests arrive and restore it afterward. No mess left behind — just great memories.",
    tags: ["Pre-party prep", "Post-party restore", "Same-day available"],
    from: "₦9,000",
  },
  {
    icon: "💍",
    name: "Wedding & Reception",
    tagline: "Your venue, immaculate",
    desc: "Pre-wedding venue prep and post-reception cleanup. We handle the mess so you handle the memories.",
    tags: ["Venue cleaning", "Pre & post event", "Team available"],
    from: "₦25,000",
  },
  {
    icon: "🎄",
    name: "Holiday Gathering",
    tagline: "Christmas, Eid, Easter & more",
    desc: "Entertain family and friends with confidence. A deep clean before the festivities and a quick restore after.",
    tags: ["Pre-holiday deep clean", "Post-event tidy", "Seasonal booking"],
    from: "₦12,000",
  },
  {
    icon: "🏢",
    name: "Corporate Event",
    tagline: "Office parties & meetings",
    desc: "Professional cleaning before and after corporate events, client meetings, and office celebrations.",
    tags: ["Office space", "Professional team", "Flexible timing"],
    from: "₦18,000",
  },
  {
    icon: "🎓",
    name: "Graduation Party",
    tagline: "Celebrate without the cleanup",
    desc: "Your graduate deserves a party. We handle everything before and after so the whole family can celebrate.",
    tags: ["Pre & post party", "Family home", "Quick turnaround"],
    from: "₦10,000",
  },
  {
    icon: "🍽️",
    name: "Dinner Party Clean",
    tagline: "Impress guests, stress-free",
    desc: "Kitchen deep-clean before service, full home tidy, and post-dinner cleanup including dishes and surfaces.",
    tags: ["Kitchen focus", "Pre & post dinner", "Same evening"],
    from: "₦8,000",
  },
];

const TIMELINE_ITEMS = [
  {
    emoji: "📅",
    name: "Book in advance",
    desc: "Reserve your slot early for weekends and holidays",
  },
  {
    emoji: "🧹",
    name: "Pre-event clean",
    desc: "We arrive before guests to set the stage",
  },
  {
    emoji: "🎊",
    name: "Event happens",
    desc: "You enjoy — we're on standby if needed",
  },
  {
    emoji: "✨",
    name: "Post-event restore",
    desc: "We return and leave it spotless",
  },
];

const INCLUDED = [
  "Pre-event deep clean",
  "All floors vacuumed & mopped",
  "Bathrooms scrubbed",
  "Kitchen & surfaces wiped",
  "Mirrors & glass cleaned",
  "Bins emptied & relined",
  "Post-event cleanup",
  "Glassware & dishes area",
  "Food & drink spills",
  "Furniture repositioned",
  "Rubbish removed",
  "Final walkthrough",
];

const BENEFITS = [
  {
    icon: "⚡",
    title: "Fast turnaround",
    text: "Need us in 3 hours? We accommodate urgent event bookings when availability allows. For large events, a team of two ensures the job is done fast and thoroughly.",
  },
  {
    icon: "🎯",
    title: "Event-specific focus",
    text: "A birthday party clean is different from a corporate event. We prioritize the right areas — kitchen, bathrooms, living spaces, or the venue's key zones — based on your event type.",
  },
  {
    icon: "🤝",
    title: "Before & after packages",
    text: "Book a single pre-event clean, a post-event cleanup, or both together at a bundled rate. We coordinate around your event schedule so there's zero disruption.",
  },
  {
    icon: "📋",
    title: "Custom requirements",
    text: "Need specific areas focused on, a particular order of cleaning, or coordination with caterers and decorators? Leave it in the booking notes and we'll accommodate.",
  },
];

const STEPS = [
  {
    title: "Tell us your event",
    text: "Choose your event type, date, and whether you need pre-event, post-event, or both. Add timing details and any special requirements in the notes.",
  },
  {
    title: "Book your maid or team",
    text: "For large events we recommend a team of two. Select availability, confirm timing, and pay securely via Paystack.",
  },
  {
    title: "We arrive & clean",
    text: "Your maid or team arrives at the agreed time, works through our event checklist, and ensures everything is perfect before or after your guests.",
  },
  {
    title: "Enjoy your event",
    text: "Focus on your celebration — not the cleanup. We handle everything and leave your space spotless, every time.",
  },
];

const COMMITMENTS = [
  "We coordinate around your event schedule — arriving before guests and returning after, on your timeline.",
  "For high-stakes events like weddings or corporate functions, we always send our most experienced maids.",
  "We are discreet and professional around guests — if we're still cleaning when people arrive, you won't notice us.",
  "If the post-event state is worse than expected, we stay until the job is fully done — no time limit.",
  "Satisfaction guaranteed — if anything is missed, we return within 24 hours and fix it free of charge.",
];

const FAQS = [
  {
    q: "Can I book for both before and after the event?",
    a: "Yes — our before & after package is the most popular option. We clean before your guests arrive, then return after the event to restore your space. Bundle bookings receive a 10% discount.",
  },
  {
    q: "How much notice do you need for event cleaning?",
    a: "For standard events, 24–48 hours notice is ideal. For weddings, corporate events, or large gatherings, we recommend booking at least 1 week in advance to guarantee your preferred team and timing.",
  },
  {
    q: "Can you clean while the event is happening?",
    a: "Yes — our maids are professional and discreet. We can work around guests, keeping bathrooms fresh, removing empties, and managing the kitchen throughout the event if required.",
  },
  {
    q: "Do you clean outdoor or garden areas?",
    a: "Yes. We clean patios, balconies, and outdoor entertaining areas as part of event packages. Just mention it when booking and we'll factor it into the time estimate.",
  },
  {
    q: "What if the event runs over and you need to come later?",
    a: "Just let us know as soon as possible. We do our best to accommodate schedule changes. For post-event cleans, a 1–2 hour flexibility window is usually manageable.",
  },
];

export default function SpecialEventCleaning() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Special event cleaning</p>
        <h1 className={styles.heroTitle}>
          Your event.
          <br />
          <em>We handle the rest.</em>
        </h1>
        <p className={styles.heroDesc}>
          Professional before & after cleaning for every special occasion —
          parties, weddings, corporate events, and more.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => navigate("/maids")}
          >
            Book Event Clean
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() => navigate("/request-a-free-estimate")}
          >
            Get a Free Estimate
          </button>
        </div>
      </div>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          ["📅", "Before & after packages"],
          ["⚡", "Fast turnaround"],
          ["👥", "Teams available"],
          ["🛡️", "Satisfaction guaranteed"],
          ["🔒", "Secure payment"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Event cards */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Pick your event</p>
        <h2 className={styles.sectionTitle}>
          We clean for every special occasion
        </h2>
        <div className={styles.eventCards}>
          {EVENTS.map((e) => (
            <div key={e.name} className={styles.eventCard}>
              <div className={styles.cardBanner} />
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>{e.icon}</div>
                  <div>
                    <p className={styles.cardName}>{e.name}</p>
                    <p className={styles.cardTagline}>{e.tagline}</p>
                  </div>
                </div>
                <p className={styles.cardDesc}>{e.desc}</p>
                <div className={styles.cardTags}>
                  {e.tags.map((t) => (
                    <span key={t} className={styles.cardTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardPrice}>
                  From <strong>{e.from}</strong>
                </div>
                <button
                  className={styles.bookBtn}
                  onClick={() => navigate("/maids")}
                >
                  Book Now
                </button>
              </div>
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
          How it works
        </p>
        <h2 className={styles.timelineTitle}>The event cleaning timeline</h2>
        <p className={styles.timelineSub}>
          We fit seamlessly around your schedule — before, during, or after.
        </p>
        <div className={styles.timelineGrid}>
          {TIMELINE_ITEMS.map((t) => (
            <div key={t.name} className={styles.timelineItem}>
              <div className={styles.timelineEmoji}>{t.emoji}</div>
              <p className={styles.timelineName}>{t.name}</p>
              <p className={styles.timelineDesc}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Included */}
      <div className={styles.included}>
        <p className={styles.sectionEyebrow}>Every event clean includes</p>
        <h2 className={styles.sectionTitle}>What's covered in every booking</h2>
        <div className={styles.includedGrid}>
          {INCLUDED.map((item) => (
            <div key={item} className={styles.includedItem}>
              <div className={styles.includedCheck}>✓</div>
              <span className={styles.includedText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className={styles.benefits}>
        <p className={styles.sectionEyebrow}>Why it works</p>
        <h2 className={styles.sectionTitle}>
          Built for events, not just houses
        </h2>
        <div className={styles.benefitCards}>
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className={styles.benefitCard}
              style={{ animationDelay: `${i * 0.07}s` }}
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

      {/* Steps */}
      <div className={styles.steps}>
        <p className={styles.sectionEyebrow}>The process</p>
        <h2 className={styles.sectionTitle}>
          From booking to spotless — 4 steps
        </h2>
        <div className={styles.stepList}>
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

      {/* Commitment */}
      <div className={styles.commitment}>
        <div className={styles.commitHeader}>
          <span className={styles.commitHeaderIcon}>🤝</span>
          <p className={styles.commitHeaderTitle}>Our event cleaning promise</p>
        </div>
        <div className={styles.commitList}>
          {COMMITMENTS.map((c, i) => (
            <div key={i} className={styles.commitItem}>
              <div className={styles.commitDot}>✓</div>
              <p className={styles.commitText}>{c}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Event cleaning — answered</h2>
        <div className={styles.faqList}>
          {FAQS.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{f.q}</span>
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
        <h2 className={styles.ctaTitle}>Book your event clean today</h2>
        <p className={styles.ctaText}>
          Before, after, or both. Professional event cleaning across Abuja and
          Lagos — no stress, no mess.
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
