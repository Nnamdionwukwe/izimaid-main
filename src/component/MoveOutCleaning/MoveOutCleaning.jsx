import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MoveOutCleaning.module.css";

const PACKAGES = [
  {
    icon: "🏠",
    name: "Standard Move-Out",
    tagline: "For well-maintained properties",
    desc: "A thorough top-to-bottom clean of your property before key handover. Covers all rooms, bathrooms, kitchen, and floors to landlord inspection standards.",
    checklist: [
      "Full kitchen clean & degrease",
      "Bathrooms scrubbed & disinfected",
      "All floors vacuumed & mopped",
      "Surfaces & furniture wiped",
      "Mirrors & glass cleaned",
      "Bins emptied throughout",
    ],
    from: "₦15,000",
  },
  {
    icon: "✨",
    name: "Deep Move-Out",
    tagline: "For properties needing extra attention",
    desc: "Our most comprehensive move-out package. Includes everything in Standard plus inside appliances, grout scrubbing, walls spot-cleaned, and hard-to-reach areas.",
    checklist: [
      "Everything in Standard",
      "Inside oven, hob & extractor",
      "Inside fridge & freezer",
      "Grout & tile deep scrub",
      "Walls spot-cleaned",
      "Skirting boards & vents",
    ],
    from: "₦22,000",
  },
  {
    icon: "📋",
    name: "Inventory Clean",
    tagline: "Matched to your check-out report",
    desc: "We work directly from your tenancy check-out inventory report, addressing every flagged item. Designed to pass even the strictest landlord or letting agent inspection.",
    checklist: [
      "Inventory report reviewed",
      "Every flagged item addressed",
      "Agent-standard checklist",
      "Certificate of clean provided",
      "Photo evidence on request",
      "Re-clean guarantee included",
    ],
    from: "₦28,000",
  },
];

const ROOMS = {
  Kitchen: [
    "Degrease hob, oven & grill",
    "Clean extractor hood & filter",
    "Wipe all cabinet doors & handles",
    "Clean inside all cabinets",
    "Descale sink & taps",
    "Clean inside fridge & freezer",
    "Wipe all countertops",
    "Scrub tiles & backsplash",
  ],
  Bathrooms: [
    "Scrub toilet, cistern & seat",
    "Deep-clean shower & screen",
    "Descale taps, shower & head",
    "Scrub tiles & grout",
    "Clean mirrors & cabinets",
    "Wipe vanity & surfaces",
    "Disinfect & mop floor",
    "Replace bin liner",
  ],
  Bedrooms: [
    "Dust all surfaces",
    "Vacuum carpet / mop floor",
    "Wipe wardrobe inside & out",
    "Clean mirrors & glass",
    "Wipe skirting boards",
    "Clean light switches",
    "Vacuum under furniture",
    "Wipe window sills & frames",
  ],
  "Living Areas": [
    "Dust all surfaces & furniture",
    "Vacuum sofa & cushions",
    "Vacuum / mop all floors",
    "Wipe skirting boards",
    "Clean light switches",
    "Wipe door frames & handles",
    "Clean balcony door glass",
    "Remove all rubbish",
  ],
};

const DEPOSIT_TIPS = [
  {
    icon: "📸",
    title: "Document everything before cleaning",
    text: "Take timestamped photos of every room before and after the clean. This protects you if the landlord disputes the condition of the property.",
  },
  {
    icon: "📋",
    title: "Get a copy of your check-out report",
    text: "Ask your landlord or agent for the check-out inventory report in advance. Share it with your maid so every flagged item is addressed specifically.",
  },
  {
    icon: "🗓️",
    title: "Book 1–2 days before key handover",
    text: "Give yourself a buffer — don't clean on the same day as the inspection. A day's gap means you can fix anything the landlord flags.",
  },
  {
    icon: "📄",
    title: "Request a certificate of clean",
    text: "Ask us for a written confirmation of your move-out clean. Most landlords and letting agents accept this as proof of professional cleaning.",
  },
];

const STEPS = [
  {
    title: "Share your inventory report",
    text: "Send us your check-out inventory (if available) so we know exactly what your landlord expects. No report? No problem — we use our standard landlord checklist.",
  },
  {
    title: "Book your date",
    text: "Choose your preferred date — ideally 1–2 days before key handover. Book a single maid or a team of two for larger properties.",
  },
  {
    title: "We clean to landlord standards",
    text: "Your maid works through every room systematically. We flag anything beyond cleaning (damage, repairs needed) so you can address it before inspection.",
  },
  {
    title: "Inspection passed — deposit returned",
    text: "Walk through with your landlord confidently. If anything is flagged, contact us within 24 hours and we'll return free of charge.",
  },
];

const COMMITMENTS = [
  "We clean to the specific standards landlords and letting agents expect — not just 'clean enough'.",
  "If your landlord flags any cleaning issue within 24 hours of inspection, we return and fix it for free.",
  "We provide a written certificate of clean on request, accepted by most agents as proof.",
  "We never cut corners — inside appliances, grout, skirting boards, and vents are all included.",
  "Our maids know what landlords look for and prioritize those areas on every move-out clean.",
];

const FAQS = [
  {
    q: "How soon before key handover should I book?",
    a: "Book 1–2 days before your inspection or key handover. This gives you time to raise any concerns with us before the landlord sees the property. Avoid cleaning on the same day as the inspection.",
  },
  {
    q: "What if the landlord isn't satisfied?",
    a: "Contact us within 24 hours of the inspection and tell us exactly what was flagged. We'll return and re-clean those specific areas at no extra cost. This is our deposit guarantee.",
  },
  {
    q: "Do you provide a certificate of clean?",
    a: "Yes. Request it when booking and we'll issue a written confirmation of your professional move-out clean, including date, address, and scope. Most landlords and agencies accept this as proof.",
  },
  {
    q: "Should I be present during the clean?",
    a: "You don't need to be. Many customers hand over a key or arrange building access and return to a completed clean. We send a message when we arrive and when we're done.",
  },
  {
    q: "What if I have a long inventory list of issues?",
    a: "Choose our Inventory Clean package and share the check-out report with us. Your maid will work through it item by item, addressing every flagged point specifically.",
  },
];

export default function MoveOutCleaning() {
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState("Kitchen");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Move-out cleaning</p>
        <h1 className={styles.heroTitle}>
          Leave spotless.
          <br />
          <em>Get your deposit back.</em>
        </h1>
        <p className={styles.heroDesc}>
          Professional move-out cleans across Abuja and Lagos. We clean to
          landlord standards so you walk away with your full security deposit.
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

      {/* Guarantee banner */}
      <div className={styles.guaranteeBanner}>
        <span className={styles.guaranteeEmoji}>🛡️</span>
        <span className={styles.guaranteeText}>Deposit-Back Guarantee</span>
        <span className={styles.guaranteeHighlight}>
          — If your landlord flags any issue within 24 hours, we return and
          re-clean free of charge.
        </span>
      </div>

      {/* Packages */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Choose your package</p>
        <h2 className={styles.sectionTitle}>
          Move-out cleans for every situation
        </h2>
        <div className={styles.packageCards}>
          {PACKAGES.map((p) => (
            <div key={p.name} className={styles.packageCard}>
              <div className={styles.packageBanner} />
              <div className={styles.packageBody}>
                <div className={styles.packageTop}>
                  <div className={styles.packageIcon}>{p.icon}</div>
                  <div>
                    <p className={styles.packageName}>{p.name}</p>
                    <p className={styles.packageTagline}>{p.tagline}</p>
                  </div>
                </div>
                <p className={styles.packageDesc}>{p.desc}</p>
                <div className={styles.checkList}>
                  {p.checklist.map((item) => (
                    <div key={item} className={styles.checkItem}>
                      <div className={styles.checkDot}>✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.packageFooter}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceFrom}>Starting from</span>
                  <span className={styles.priceAmount}>{p.from}</span>
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

      {/* Landlord checklist */}
      <div className={styles.landlord}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Landlord standard
        </p>
        <h2 className={styles.landlordTitle}>What we clean, room by room</h2>
        <p className={styles.landlordSub}>
          Every item below is included — the same areas your landlord will
          inspect.
        </p>
        <div className={styles.roomTabs}>
          {Object.keys(ROOMS).map((room) => (
            <button
              key={room}
              className={`${styles.roomTab} ${activeRoom === room ? styles.roomTabActive : ""}`}
              onClick={() => setActiveRoom(room)}
            >
              {room}
            </button>
          ))}
        </div>
        <div className={styles.roomItems}>
          {ROOMS[activeRoom].map((item) => (
            <div key={item} className={styles.roomItem}>
              <div className={styles.roomCheck}>✓</div>
              <span className={styles.roomText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit tips */}
      <div className={styles.depositTips}>
        <p className={styles.sectionEyebrow}>Protect your deposit</p>
        <h2 className={styles.sectionTitle}>
          4 tips to guarantee your deposit back
        </h2>
        <div className={styles.tipsGrid}>
          {DEPOSIT_TIPS.map((t, i) => (
            <div
              key={t.title}
              className={styles.tipCard}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={styles.tipIcon}>{t.icon}</div>
              <div>
                <p className={styles.tipTitle}>{t.title}</p>
                <p className={styles.tipText}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        <p className={styles.sectionEyebrow}>The process</p>
        <h2 className={styles.sectionTitle}>
          From booking to deposit returned
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

      {/* Commitment */}
      <div className={styles.commitment}>
        <div className={styles.commitHeader}>
          <span className={styles.commitHeaderIcon}>🤝</span>
          <p className={styles.commitHeaderTitle}>Our move-out promise</p>
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
        <h2 className={styles.sectionTitle}>Move-out cleaning — answered</h2>
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
        <h2 className={styles.ctaTitle}>Book your move-out clean today</h2>
        <p className={styles.ctaText}>
          Get your full deposit back. Professional, landlord-standard cleaning
          across Abuja and Lagos.
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
