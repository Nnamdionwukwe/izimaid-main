import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Kitchens.module.css";
import FixedHeader from "../FixedHeader";

const SERVICES = [
  {
    icon: "🔥",
    name: "Hob & Oven Deep Clean",
    tagline: "Grease gone, completely",
    desc: "Years of baked-on grease, burnt food, and carbonised residue removed without damaging your appliances. We disassemble hob burners and oven racks for a thorough clean you cannot achieve yourself.",
    checklist: [
      "Disassemble and soak burner caps",
      "Degrease hob surface and drip trays",
      "Clean inside oven cavity",
      "Degrease oven door glass (inside and out)",
      "Clean grill pan and racks",
      "Wipe extractor hood and filter",
    ],
    from: "₦8,000",
  },
  {
    icon: "🍽️",
    name: "Full Kitchen Deep Clean",
    tagline: "Every surface, every corner",
    desc: "A comprehensive top-to-bottom kitchen clean covering every surface, appliance, cabinet, and corner. Ideal as a monthly maintenance clean or before a special occasion or property inspection.",
    checklist: [
      "All the above (hob, oven, extractor)",
      "Degrease all cabinet doors and handles",
      "Clean inside cabinets and drawers",
      "Descale sink, taps, and draining board",
      "Wipe all countertops and backsplash",
      "Mop kitchen floor and clean skirting",
    ],
    from: "₦14,000",
  },
  {
    icon: "🧊",
    name: "Fridge & Freezer Clean",
    tagline: "Hygienic cold storage",
    desc: "A thorough fridge and freezer clean including defrosting, sanitising all internal surfaces, wiping door seals, and removing odours. Safe food storage starts with a clean appliance.",
    checklist: [
      "Empty and safely store food",
      "Remove and wash all shelves and drawers",
      "Wipe internal walls and base",
      "Clean and disinfect door seals",
      "Defrost freezer compartment",
      "Deodorise with natural solution",
    ],
    from: "₦5,500",
  },
];

const CHECKLIST_AREAS = {
  Surfaces: [
    "Wipe all countertops with disinfectant",
    "Clean tiles and backsplash",
    "Wipe down all cabinet doors and handles",
    "Clean inside cabinets and drawers",
    "Wipe walls around cooking areas",
    "Clean window sills and ledges",
  ],
  Appliances: [
    "Deep-clean oven inside and out",
    "Degrease hob and burner caps",
    "Clean extractor hood and filter",
    "Wipe microwave inside and out",
    "Clean fridge inside, shelves, and seals",
    "Wipe dishwasher exterior and door seal",
  ],
  Sink: [
    "Descale sink basin",
    "Descale and polish taps",
    "Clean draining board",
    "Clear and flush plug hole",
    "Scrub around tap base",
    "Disinfect entire sink area",
  ],
  Floors: [
    "Sweep all debris",
    "Mop with disinfectant solution",
    "Clean skirting boards",
    "Scrub grout lines",
    "Clean behind appliances",
    "Dry-buff to prevent streaking",
  ],
};

const REASONS = [
  {
    icon: "🧫",
    title: "Kitchens harbour the most bacteria",
    text: "Studies consistently show kitchen surfaces — especially around the sink and chopping boards — carry more bacteria than a toilet seat. A professional clean eliminates pathogens your everyday wipe-down misses.",
  },
  {
    icon: "🔥",
    title: "Grease build-up is a fire hazard",
    text: "Grease accumulation on hobs, extractors, and ovens is one of the leading causes of kitchen fires. Regular deep cleaning removes combustible grease before it becomes dangerous.",
  },
  {
    icon: "🏠",
    title: "Kitchens sell and rent homes",
    text: "Estate agents consistently report that kitchen condition is the single biggest factor in a buyer's or tenant's first impression. A professionally cleaned kitchen adds perceived value immediately.",
  },
  {
    icon: "⏱️",
    title: "Save hours every week",
    text: "A professionally deep-cleaned kitchen is dramatically easier to maintain day-to-day. When there is no baked-on grease or limescale build-up, your daily 10-minute wipe-down actually works.",
  },
];

const STEPS = [
  {
    title: "Book your kitchen clean",
    text: "Choose your service type, select a maid, and pick a date and time. Booking takes under 2 minutes with no contracts.",
  },
  {
    title: "Pay securely via Paystack",
    text: "Your payment is held securely. Our team confirms the booking and sends you a reminder the day before.",
  },
  {
    title: "We arrive fully equipped",
    text: "Your professional brings all specialist degreasers, cloths, and tools. You don't need to provide anything.",
  },
  {
    title: "Inspect and approve",
    text: "Walk through the kitchen on completion. Any area that doesn't meet your standard gets re-cleaned on the spot — no extra charge.",
  },
];

const TIPS = [
  "Empty your oven and fridge before the clean so we can access every surface without delays.",
  "Leave at least 3 hours for a full kitchen deep clean — rushing a thorough job produces poor results.",
  "Book a kitchen clean before any property viewing, inspection, or family occasion for maximum impact.",
  "Ask for extractor filter cleaning specifically — it's often skipped but is critical for fire safety.",
  "A monthly maintenance clean costs far less than a yearly emergency deep clean of severe grease build-up.",
];

const FAQS = [
  {
    q: "Do you bring your own cleaning products?",
    a: "Yes. All our professionals arrive fully equipped with commercial-grade degreasers, descalers, microfibre cloths, and all necessary tools. You don't need to provide anything.",
  },
  {
    q: "How long does a kitchen deep clean take?",
    a: "A full kitchen deep clean typically takes 3–5 hours depending on the size of the kitchen and the level of grease build-up. An oven and hob clean alone takes 1.5–2.5 hours.",
  },
  {
    q: "Will the chemicals damage my surfaces?",
    a: "No. We use products appropriate for your surface type — granite-safe solutions for stone countertops, non-abrasive cleaners for delicate surfaces. Your maid will assess the kitchen before beginning.",
  },
  {
    q: "Can you clean while I'm at work?",
    a: "Absolutely. Many clients arrange key access or leave a spare key. We'll message you when we arrive and send a completion photo when the kitchen is done.",
  },
  {
    q: "How often should I book a kitchen deep clean?",
    a: "For a regularly used family kitchen, we recommend a deep clean every 4–6 weeks. For lighter use, every 8–12 weeks is sufficient. Between deep cleans, your daily wipe-down maintains the standard.",
  },
  {
    q: "Do you clean integrated and built-in appliances?",
    a: "Yes. We clean around integrated appliances carefully. For built-in ovens and hobs we follow the same process as freestanding models — disassembling what can safely be removed and cleaning in place where not.",
  },
];

export default function Kitchens() {
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState("Surfaces");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Professional kitchen cleaning</p>
        <h1 className={styles.heroTitle}>
          A kitchen that's truly
          <br />
          <em>spotless.</em>
        </h1>
        <p className={styles.heroDesc}>
          Deep kitchen cleans across Abuja and Lagos. Hobs, ovens, cabinets,
          tiles, and floors — we clean what everyday wiping misses.
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
          ["✅", "Vetted professionals"],
          ["🧴", "All products supplied"],
          ["🔥", "Grease specialists"],
          ["⚡", "Same-week booking"],
          ["🔒", "Secure payment"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Choose your service</p>
        <h2 className={styles.sectionTitle}>What do you need cleaned?</h2>
        <div className={styles.serviceCards}>
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              className={styles.serviceCard}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
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
                <div className={styles.checkList}>
                  {s.checklist.map((item) => (
                    <div key={item} className={styles.checkItem}>
                      <div className={styles.checkDot}>✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.serviceCardFooter}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceFrom}>Starting from</span>
                  <span className={styles.priceAmount}>{s.from}</span>
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

      {/* Area-by-area checklist */}
      <div className={styles.checklist}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Full checklist
        </p>
        <h2 className={styles.checklistTitle}>Every area, every task</h2>
        <p className={styles.checklistSub}>
          Nothing is overlooked. Here's exactly what's included in a full
          kitchen deep clean.
        </p>
        <div className={styles.areaTabs}>
          {Object.keys(CHECKLIST_AREAS).map((area) => (
            <button
              key={area}
              className={`${styles.areaTab} ${activeArea === area ? styles.areaTabActive : ""}`}
              onClick={() => setActiveArea(area)}
            >
              {area}
            </button>
          ))}
        </div>
        <div className={styles.areaItems}>
          {CHECKLIST_AREAS[activeArea].map((item) => (
            <div key={item} className={styles.areaItem}>
              <div className={styles.areaCheck}>✓</div>
              <span className={styles.areaText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why it matters */}
      <div className={styles.reasons}>
        <p className={styles.sectionEyebrow}>Why it matters</p>
        <h2 className={styles.sectionTitle}>More than just appearances</h2>
        <div className={styles.reasonCards}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className={styles.reasonCard}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={styles.reasonIcon}>{r.icon}</div>
              <div>
                <p className={styles.reasonTitle}>{r.title}</p>
                <p className={styles.reasonText}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.timeline}>
        <p className={styles.sectionEyebrow}>The process</p>
        <h2 className={styles.sectionTitle}>
          From booking to spotless — 4 simple steps
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

      {/* Tips banner */}
      <div className={styles.tipsBanner}>
        <div className={styles.tipsBannerHeader}>
          <span className={styles.tipsHeaderIcon}>💡</span>
          <p className={styles.tipsHeaderTitle}>
            Tips to get the most from your kitchen clean
          </p>
        </div>
        <div className={styles.tipsList}>
          {TIPS.map((tip, i) => (
            <div key={i} className={styles.tipItem}>
              <div className={styles.tipDot}>{i + 1}</div>
              <p className={styles.tipText}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
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

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Ready for a kitchen you're proud of?
        </h2>
        <p className={styles.ctaText}>
          Book a professional kitchen clean in under 2 minutes. All products
          supplied. Satisfaction guaranteed or we re-clean for free.
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
