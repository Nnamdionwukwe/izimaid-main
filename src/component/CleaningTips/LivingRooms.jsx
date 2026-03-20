import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LivingRooms.module.css";
import FixedHeader from "../FixedHeader";

const SERVICES = [
  {
    icon: "🛋️",
    name: "Living Room Deep Clean",
    tagline: "Every surface, every corner",
    desc: "A thorough deep clean of your entire living room — sofas, shelves, floors, windows, skirting boards, and all surfaces. Ideal monthly or before guests, family occasions, or property viewings.",
    checklist: [
      "Vacuum and spot-clean all sofas and cushions",
      "Dust all shelves, surfaces, and ornaments",
      "Clean TV, screens, and electronics",
      "Vacuum or mop all floors thoroughly",
      "Wipe skirting boards and door frames",
      "Clean windows and window sills inside",
    ],
    from: "₦9,000",
  },
  {
    icon: "🪑",
    name: "Upholstery & Fabric Clean",
    tagline: "Fresh sofas, fresh home",
    desc: "Specialist cleaning of fabric sofas, armchairs, and upholstered furniture. Removes embedded dust, pet hair, odours, and surface stains without damaging delicate fabrics or foam.",
    checklist: [
      "Vacuum all upholstered surfaces",
      "Remove embedded pet hair",
      "Spot-treat visible stains",
      "Deodorise fabric with natural solution",
      "Clean cushion covers and piping",
      "Brush and refresh fabric texture",
    ],
    from: "₦7,500",
  },
  {
    icon: "🪞",
    name: "Surfaces & Décor Clean",
    tagline: "Dust-free, gleaming details",
    desc: "A meticulous clean of all decorative surfaces — shelving units, display cabinets, picture frames, mirrors, light fittings, and architectural details that accumulate dust and dull the room.",
    checklist: [
      "Dust and wipe all shelving units",
      "Clean inside and outside display cabinets",
      "Wipe all picture frames and artwork",
      "Polish all mirrors streak-free",
      "Clean ceiling light fittings and shades",
      "Wipe all light switches and sockets",
    ],
    from: "₦5,500",
  },
];

const CHECKLIST_AREAS = {
  Floors: [
    "Vacuum all carpeted areas thoroughly",
    "Move lighter furniture and vacuum underneath",
    "Mop all hard floor surfaces",
    "Clean floor edges and corners",
    "Scrub any stained grout or tile joints",
    "Dry-buff to prevent streaking",
  ],
  Furniture: [
    "Vacuum all sofa surfaces and cushions",
    "Wipe all hard furniture surfaces",
    "Clean under sofa cushions",
    "Dust all shelving and bookcase surfaces",
    "Wipe TV stand and media unit",
    "Polish wood surfaces with appropriate product",
  ],
  Surfaces: [
    "Dust all horizontal surfaces",
    "Wipe all ornaments and display items",
    "Clean remote controls and tech accessories",
    "Wipe window sills and ledges",
    "Clean light switches and sockets",
    "Wipe door handles and frames",
  ],
  Windows: [
    "Clean window glass inside",
    "Wipe all window frames",
    "Clean window sills",
    "Dust curtain rails and blinds",
    "Wipe curtain tie-backs",
    "Remove cobwebs from window corners",
  ],
};

const REASONS = [
  {
    icon: "🌬️",
    title: "Dust affects air quality and health",
    text: "Living rooms accumulate dust, dust mites, and allergens faster than any other room. Sofas, rugs, and curtains trap particles that circulate every time you sit down. Regular professional cleaning dramatically improves the air quality your family breathes every day.",
  },
  {
    icon: "🐾",
    title: "Pet hair and dander go deep",
    text: "If you have pets, standard vacuuming only removes surface hair. Pet dander embeds deep into sofa fabrics and carpet fibres and triggers allergies even in people who aren't usually affected. Professional equipment removes what household vacuums leave behind.",
  },
  {
    icon: "🏠",
    title: "It's the room guests judge first",
    text: "The living room is the first room visitors properly experience in your home. Its condition forms the impression they carry away. A professionally cleaned living room — gleaming surfaces, fresh-smelling sofas, dust-free shelves — signals a well-run, welcoming home.",
  },
  {
    icon: "⏳",
    title: "Maintain the quality of your furniture",
    text: "Dust and grime act as abrasives on furniture surfaces and fabric fibres over time. Regular professional cleaning extends the life of your sofa, rugs, and wood furniture significantly. Prevention is far cheaper than premature replacement.",
  },
];

const STEPS = [
  {
    title: "Book your living room clean",
    text: "Choose your service type, select a maid, and pick a date and time that suits you. The whole booking takes under 2 minutes.",
  },
  {
    title: "Pay securely via Paystack",
    text: "Your payment is held securely until the job is complete. Our team confirms the booking and your maid is briefed on your space.",
  },
  {
    title: "We arrive fully equipped",
    text: "Your professional brings all products and tools including upholstery attachments, microfibre cloths, and specialist surface cleaners — nothing for you to provide.",
  },
  {
    title: "Inspect and approve",
    text: "Walk through the living room on completion. Any surface or area that isn't to your standard gets re-cleaned immediately — no extra charge.",
  },
];

const TIPS = [
  "Vacuum your sofa weekly using the upholstery attachment — waiting for a visible build-up means the job takes twice as long.",
  "Dust from the highest point in the room downward — ceiling corners, shelves, then surfaces — so fallen dust is captured in a final floor clean.",
  "Open the windows while cleaning your living room to ventilate dust particles out rather than redistributing them around the room.",
  "Use a dry microfibre cloth on TV and monitor screens — never spray liquid directly onto any screen surface.",
  "Place a doormat at every entrance to the living room — it reduces the volume of dust and debris tracked in from other areas by up to 60%.",
];

const FAQS = [
  {
    q: "Can you clean delicate or antique furniture?",
    a: "Yes. Before beginning, our professional will assess all surfaces and furniture and use products appropriate to each material — specialist wood polish for antique pieces, gentle fabric cleaner for delicate upholstery, and non-abrasive solutions for lacquered or painted surfaces. Nothing is treated with a product unsuitable for it.",
  },
  {
    q: "Do you move furniture to clean underneath?",
    a: "We move lighter furniture — coffee tables, occasional chairs, side tables, and smaller sofas — to clean underneath them. For heavy items like large sectional sofas and entertainment units, we use long-handled tools to reach as far underneath as possible without the risk of damage from moving them.",
  },
  {
    q: "How long does a living room deep clean take?",
    a: "A standard living room deep clean takes 1.5–3 hours depending on the size of the room, the volume of furniture and décor, and the level of dust and grime build-up. We'll give you a more precise estimate when you book.",
  },
  {
    q: "Can you remove stains from my sofa?",
    a: "We can treat and significantly reduce most surface stains on fabric upholstery. Old, deep-set, or liquid stains (ink, wine, oil) may not be fully removable in a single treatment. We will always be honest with you about what is achievable before we begin.",
  },
  {
    q: "Do I need to tidy before the cleaner arrives?",
    a: "A basic tidy — clearing loose items from the floor and surfaces — helps us clean more thoroughly and efficiently. You don't need to deep-tidy, but the more accessible surfaces are, the better the result and the faster the clean.",
  },
  {
    q: "How often should I book a living room deep clean?",
    a: "For a family home with regular use, we recommend a deep clean every 4–6 weeks alongside your weekly vacuuming routine. For lighter-use spaces or homes without pets, every 6–8 weeks is sufficient to maintain a genuinely clean standard.",
  },
];

export default function LivingRooms() {
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState("Floors");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Professional living room cleaning</p>
        <h1 className={styles.heroTitle}>
          A living room worth
          <br />
          <em>living in.</em>
        </h1>
        <p className={styles.heroDesc}>
          Deep living room cleans across Abuja and Lagos. Sofas, floors,
          shelves, windows, and every surface — cleaned to a standard that
          shows.
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
          ["🛋️", "Upholstery specialists"],
          ["🧴", "All products supplied"],
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
        <h2 className={styles.sectionTitle}>
          What does your living room need?
        </h2>
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
          Here is exactly what is covered in a full living room deep clean —
          nothing overlooked.
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
            Tips to keep your living room cleaner for longer
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
          Ready to transform your living room?
        </h2>
        <p className={styles.ctaText}>
          Book a professional living room clean in under 2 minutes. All products
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
