import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OneTimeCleaning.module.css";

const SERVICES = [
  {
    icon: "🏠",
    name: "Standard Clean",
    tagline: "Everyday tidiness, professional finish",
    desc: "A thorough top-to-bottom clean of your home. Perfect when you just need everything fresh and spotless without any heavy-duty scrubbing.",
    checklist: [
      "Vacuum & mop all floors",
      "Dust surfaces & furniture",
      "Clean bathrooms & toilets",
      "Wipe kitchen counters & sink",
      "Clean mirrors & glass",
      "Empty bins throughout",
    ],
    from: "₦6,000",
  },
  {
    icon: "✨",
    name: "Deep Clean",
    tagline: "The full reset your home deserves",
    desc: "A comprehensive, intensive clean that reaches every corner. Ideal for homes that haven't been professionally cleaned in a while or need a seasonal refresh.",
    checklist: [
      "Everything in Standard Clean",
      "Inside oven & microwave",
      "Inside fridge & freezer",
      "Behind & under appliances",
      "Grout & tile scrubbing",
      "Skirting boards & vents",
    ],
    from: "₦12,000",
  },
  {
    icon: "📦",
    name: "Move In / Move Out",
    tagline: "Spotless handover, guaranteed",
    desc: "Designed for tenants moving out or new homeowners moving in. We clean every inch so you get your deposit back or start fresh in a pristine space.",
    checklist: [
      "Full deep-clean checklist",
      "Inside all cabinets & drawers",
      "Window sills & tracks",
      "Light fixtures & switches",
      "Walls spot-cleaned",
      "Professional-grade products",
    ],
    from: "₦18,000",
  },
];

const OCCASIONS = [
  { emoji: "🎉", name: "After a Party", desc: "Restore order quickly" },
  { emoji: "🛏️", name: "Airbnb Turnover", desc: "Guest-ready in hours" },
  { emoji: "👶", name: "New Baby", desc: "Safe, allergen-free home" },
  { emoji: "🏡", name: "Before Selling", desc: "Make your best impression" },
  { emoji: "✈️", name: "Returning Home", desc: "Come back to clean" },
  { emoji: "🎄", name: "Before Holidays", desc: "Entertain with confidence" },
  { emoji: "🏗️", name: "Post-Renovation", desc: "Clear dust & debris" },
  { emoji: "🎓", name: "Moving Out", desc: "Get your deposit back" },
];

const STEPS = [
  {
    title: "Choose your service",
    text: "Browse Standard, Deep Clean, or Move In/Out. Pick what your home needs right now.",
  },
  {
    title: "Select a maid & date",
    text: "Browse available professionals, read their reviews, and book your preferred date and time.",
  },
  {
    title: "Pay securely",
    text: "Complete payment via Paystack. Our admin reviews and confirms your booking within minutes.",
  },
  {
    title: "We clean, you relax",
    text: "Your maid arrives on time, does exceptional work, and leaves your home spotless.",
  },
];

const ADDONS = [
  { emoji: "🪟", name: "Window Cleaning", price: "From ₦2,000" },
  { emoji: "🛋️", name: "Upholstery Clean", price: "From ₦3,500" },
  { emoji: "🧺", name: "Laundry & Ironing", price: "From ₦2,500" },
  { emoji: "🍳", name: "Oven Deep Clean", price: "From ₦1,500" },
  { emoji: "🪴", name: "Balcony & Patio", price: "From ₦1,800" },
  { emoji: "🚗", name: "Garage Tidy", price: "From ₦2,000" },
];

const FAQS = [
  {
    q: "How long does a one-time clean take?",
    a: "A Standard Clean typically takes 2–4 hours depending on home size. A Deep Clean or Move In/Out can take 4–8 hours. Your maid will let you know on arrival.",
  },
  {
    q: "Do I need to be home during the clean?",
    a: "You don't have to be. Many customers provide access and return to a clean home. Just make sure there's a way for the maid to get in and out safely.",
  },
  {
    q: "What if I'm not satisfied with the result?",
    a: "Contact us within 24 hours and we'll arrange a free re-clean of any areas you're not happy with, or issue a full refund. No questions asked.",
  },
  {
    q: "Do the maids bring their own supplies?",
    a: "Yes — all cleaning equipment and eco-friendly products are included. If you have specific products you'd prefer, just leave them out and let us know.",
  },
  {
    q: "Can I book same-day?",
    a: "Subject to availability. We recommend booking at least 24 hours in advance to ensure you get the maid of your choice at your preferred time.",
  },
];

export default function OneTimeCleaning() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>One-time cleaning</p>
        <h1 className={styles.heroTitle}>
          One visit.
          <br />
          <em>Completely clean.</em>
        </h1>
        <p className={styles.heroDesc}>
          No subscriptions. No commitments. Just a professional clean whenever
          you need one — booked in under 2 minutes.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* Service types */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Pick your service</p>
        <h2 className={styles.sectionTitle}>What kind of clean do you need?</h2>
        <div className={styles.serviceCards}>
          {SERVICES.map((s) => (
            <div key={s.name} className={styles.serviceCard}>
              <div className={styles.serviceCardBanner} />
              <div className={styles.serviceCardBody}>
                <div className={styles.serviceCardTop}>
                  <div className={styles.serviceCardIcon}>{s.icon}</div>
                  <div>
                    <p className={styles.serviceCardName}>{s.name}</p>
                    <p className={styles.serviceCardTagline}>{s.tagline}</p>
                  </div>
                </div>
                <p className={styles.serviceCardDesc}>{s.desc}</p>
                <div className={styles.serviceCardChecklist}>
                  {s.checklist.map((item) => (
                    <div key={item} className={styles.checkItem}>
                      <div className={styles.checkDot}>✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.serviceCardFooter}>
                <div className={styles.serviceCardPrice}>
                  Starting from <strong>{s.from}</strong>
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

      {/* When you need it */}
      <div className={styles.occasions}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Perfect for
        </p>
        <h2 className={styles.occasionsTitle}>
          Every occasion that calls for a clean
        </h2>
        <p className={styles.occasionsSub}>
          Whether it's a one-off situation or a special moment — we're here for
          it.
        </p>
        <div className={styles.occasionGrid}>
          {OCCASIONS.map((o) => (
            <div key={o.name} className={styles.occasionItem}>
              <div className={styles.occasionEmoji}>{o.emoji}</div>
              <p className={styles.occasionName}>{o.name}</p>
              <p className={styles.occasionDesc}>{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.howItWorks}>
        <p className={styles.sectionEyebrow}>The process</p>
        <h2 className={styles.sectionTitle}>
          Booked, cleaned, done — in 4 steps
        </h2>
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

      {/* Add-ons */}
      <div className={styles.addons}>
        <p className={styles.sectionEyebrow}>Optional extras</p>
        <h2 className={styles.sectionTitle}>Enhance your clean with add-ons</h2>
        <div className={styles.addonGrid}>
          {ADDONS.map((a) => (
            <div key={a.name} className={styles.addonCard}>
              <div className={styles.addonEmoji}>{a.emoji}</div>
              <div>
                <p className={styles.addonName}>{a.name}</p>
                <p className={styles.addonPrice}>{a.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee */}
      <div className={styles.guarantee}>
        <div className={styles.guaranteeIcon}>🛡️</div>
        <div>
          <h3 className={styles.guaranteeTitle}>100% Satisfaction Guarantee</h3>
          <p className={styles.guaranteeText}>
            Not satisfied? We'll come back within 24 hours and re-clean any area
            that doesn't meet your expectations — completely free. If you're
            still not happy, we'll refund you in full.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Everything you need to know</h2>
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
        <h2 className={styles.ctaTitle}>Ready for a spotless home?</h2>
        <p className={styles.ctaText}>
          Book your one-time clean today. No subscription required. Choose your
          maid, pick your date, pay securely.
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
