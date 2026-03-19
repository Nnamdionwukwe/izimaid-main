import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OccasionalCleaning.module.css";
import FixedHeader from "../FixedHeader";

const OCCASIONS = [
  {
    icon: "🎉",
    name: "Post-Party Clean",
    tagline: "Restore order after celebrations",
    desc: "The night was great — the mess doesn't have to linger. We handle everything left behind after parties, gatherings, and events so you can recover in peace.",
    tags: ["Same-day available", "Glassware & kitchen", "Floors & surfaces"],
    from: "₦8,000",
  },
  {
    icon: "🎄",
    name: "Holiday & Seasonal",
    tagline: "Entertain with a spotless home",
    desc: "Before Christmas, Eid, Easter, or any major gathering — a professional clean ensures your home is at its best when family and friends arrive.",
    tags: ["Pre-holiday prep", "Full home clean", "Same week booking"],
    from: "₦10,000",
  },
  {
    icon: "🏡",
    name: "Pre-Sale / Open House",
    tagline: "Make your best first impression",
    desc: "Selling your home? A professional clean before viewings or an open house dramatically increases perceived value and helps you sell faster, for more.",
    tags: ["Deep clean", "Staging-ready", "Photo-ready"],
    from: "₦15,000",
  },
  {
    icon: "👶",
    name: "New Baby Preparation",
    tagline: "Safe & sanitized for your newborn",
    desc: "Before your baby comes home, we deep-clean and sanitize your entire space using non-toxic, baby-safe products — every surface, every corner.",
    tags: ["Eco-safe products", "Allergen removal", "Nursery focus"],
    from: "₦12,000",
  },
  {
    icon: "✈️",
    name: "Return From Travel",
    tagline: "Come home to a fresh start",
    desc: "Been away for weeks or months? We clean before you arrive so you walk into a fresh, clean home — not a dusty, stale one. Book it in advance.",
    tags: ["Scheduled clean", "Airing & dusting", "Kitchen & bathrooms"],
    from: "₦9,000",
  },
  {
    icon: "🏗️",
    name: "Post-Renovation",
    tagline: "Dust, debris, and construction residue",
    desc: "Renovation dust goes everywhere. Our post-construction clean tackles fine dust, plaster residue, paint splashes, and debris — restoring your home after the builders leave.",
    tags: ["Heavy-duty clean", "Dust removal", "All surfaces"],
    from: "₦18,000",
  },
];

const WHEN_ITEMS = [
  { emoji: "🎊", name: "Before a party", desc: "Start the evening right" },
  { emoji: "🌅", name: "After a party", desc: "Back to normal quickly" },
  { emoji: "📸", name: "Photo shoot day", desc: "Perfect background" },
  { emoji: "🏠", name: "Property viewing", desc: "Impress buyers & renters" },
  { emoji: "🤱", name: "Baby shower", desc: "Clean & safe space" },
  { emoji: "👪", name: "Family visit", desc: "Look your best" },
  { emoji: "🎓", name: "Graduation party", desc: "Celebrate in style" },
  { emoji: "💼", name: "Home office reset", desc: "Clear the clutter" },
];

const INCLUDED = [
  "Dust all surfaces & furniture",
  "Vacuum & mop all floors",
  "Clean all bathrooms",
  "Kitchen counters & sink",
  "Clean mirrors & glass",
  "Empty bins & replace bags",
  "Wipe door handles & switches",
  "Tidy & organize spaces",
  "Remove party debris",
  "Clean appliance exteriors",
  "Skirting boards & vents",
  "Balcony sweep (on request)",
];

const BENEFITS = [
  {
    icon: "⚡",
    title: "Book on short notice",
    text: "Need a clean tomorrow before guests arrive? We accommodate last-minute bookings when availability allows. Always worth checking — we often have same-week slots.",
  },
  {
    icon: "🎯",
    title: "Tailored to the occasion",
    text: "A post-party clean is different from a pre-sale clean. Tell us the occasion and we'll prioritize the right areas — no time wasted on what doesn't matter.",
  },
  {
    icon: "🔄",
    title: "One-off or recurring",
    text: "An occasional clean works as a standalone booking. But many customers discover they love the results and switch to a recurring plan afterward.",
  },
  {
    icon: "📋",
    title: "Custom checklist available",
    text: "Have specific priorities? Let us know in your booking notes and your maid will focus on exactly what matters most for your situation.",
  },
];

const FAQS = [
  {
    q: "How much notice do I need to give?",
    a: "We recommend at least 24 hours notice. For same-day bookings, check availability directly — we sometimes have last-minute slots when a maid is nearby. Weekend and holiday slots book up quickly.",
  },
  {
    q: "Can I book for a specific time of day?",
    a: "Yes — morning, afternoon, or evening slots are available. When you book, choose your preferred start time and we'll confirm based on your selected maid's schedule.",
  },
  {
    q: "What if the occasion changes or I need to reschedule?",
    a: "You can reschedule up to 24 hours before your booking at no charge. Cancellations within 24 hours may incur a small fee. We understand plans change — just let us know as early as possible.",
  },
  {
    q: "Can you clean after a large party or event?",
    a: "Absolutely. Post-event cleans are one of our most popular occasional services. For very large gatherings (50+ guests), we recommend booking a team of two maids to ensure the job is done thoroughly and efficiently.",
  },
  {
    q: "Do you use safe products for baby preparation cleans?",
    a: "Yes — for newborn preparation cleans, we exclusively use non-toxic, plant-based, fragrance-free products that are safe for babies, including on surfaces they'll touch and in the air they'll breathe.",
  },
];

export default function OccasionalCleaning() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Occasional cleaning</p>
        <h1 className={styles.heroTitle}>
          Clean when
          <br />
          <em>it matters most.</em>
        </h1>
        <p className={styles.heroDesc}>
          No subscription needed. Book a professional clean for any special
          occasion — parties, holidays, home sales, new babies, and more.
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
            onClick={() => navigate("/request-a-free-estimate")}
          >
            Get a Free Estimate
          </button>
        </div>
      </div>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          ["📅", "No subscription"],
          ["⚡", "Short notice welcome"],
          ["🎯", "Occasion-tailored"],
          ["🛡️", "Satisfaction guaranteed"],
          ["🔒", "Secure payment"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Occasion cards */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>What's the occasion?</p>
        <h2 className={styles.sectionTitle}>
          We clean for every moment that counts
        </h2>
        <div className={styles.occasionCards}>
          {OCCASIONS.map((o) => (
            <div key={o.name} className={styles.occasionCard}>
              <div className={styles.cardBanner} />
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>{o.icon}</div>
                  <div>
                    <p className={styles.cardName}>{o.name}</p>
                    <p className={styles.cardTagline}>{o.tagline}</p>
                  </div>
                </div>
                <p className={styles.cardDesc}>{o.desc}</p>
                <div className={styles.cardTags}>
                  {o.tags.map((t) => (
                    <span key={t} className={styles.cardTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardPrice}>
                  From <strong>{o.from}</strong>
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

      {/* When to book */}
      <div className={styles.whenSection}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Perfect for
        </p>
        <h2 className={styles.whenTitle}>
          Any time you need your home at its best
        </h2>
        <p className={styles.whenSub}>
          Occasional cleaning fits around your life — not the other way around.
        </p>
        <div className={styles.whenGrid}>
          {WHEN_ITEMS.map((w) => (
            <div key={w.name} className={styles.whenItem}>
              <div className={styles.whenEmoji}>{w.emoji}</div>
              <p className={styles.whenName}>{w.name}</p>
              <p className={styles.whenDesc}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What's included */}
      <div className={styles.included}>
        <p className={styles.sectionEyebrow}>Every clean includes</p>
        <h2 className={styles.sectionTitle}>What we cover on every visit</h2>
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
        <p className={styles.sectionEyebrow}>Why occasional cleaning works</p>
        <h2 className={styles.sectionTitle}>Flexible by design</h2>
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

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Occasional cleaning — answered</h2>
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
        <h2 className={styles.ctaTitle}>Book your occasional clean today</h2>
        <p className={styles.ctaText}>
          No subscription. No commitment. Just a professional clean whenever
          your home needs it most.
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
