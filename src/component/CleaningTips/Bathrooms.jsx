import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Bathrooms.module.css";
import FixedHeader from "../FixedHeader";

const SERVICES = [
  {
    icon: "🚿",
    name: "Bathroom Deep Clean",
    tagline: "Scrubbed to perfection",
    desc: "A thorough deep clean of your entire bathroom — toilet, shower, bath, tiles, grout, mirrors, and floors. Removes limescale, soap scum, mould, and bacteria that daily cleaning misses.",
    checklist: [
      "Scrub and disinfect toilet inside and out",
      "Deep-clean shower cubicle and screen",
      "Descale showerhead, taps, and fixtures",
      "Scrub tiles and clean grout lines",
      "Clean bath inside and polish taps",
      "Mop and disinfect floor thoroughly",
    ],
    from: "₦7,000",
  },
  {
    icon: "🧼",
    name: "Grout & Tile Restoration",
    tagline: "Bright tiles, clean lines",
    desc: "Specialist cleaning of bathroom tiles and grout lines that have discoloured, blackened, or developed mould. We restore grout to near-original condition without chemical damage to the tile surface.",
    checklist: [
      "Apply specialist grout cleaner",
      "Scrub all grout lines with detail brush",
      "Remove black mould from grout",
      "Clean tile surfaces and remove soap scum",
      "Buff tiles to a streak-free finish",
      "Apply grout sealant where appropriate",
    ],
    from: "₦6,000",
  },
  {
    icon: "💎",
    name: "Full Bathroom Sanitise",
    tagline: "Clinically clean",
    desc: "A hospital-grade sanitisation of the entire bathroom. Every surface, fixture, and fitting treated with commercial disinfectant. Ideal for post-illness recovery, move-ins, or properties between tenants.",
    checklist: [
      "Disinfect all surfaces with hospital-grade product",
      "Sanitise all door handles and light switches",
      "Deep-clean and disinfect toilet and cistern",
      "Sanitise shower, bath, and sink",
      "Clean extractor fan and air vents",
      "Replace bin liner and restock supplies",
    ],
    from: "₦9,500",
  },
];

const CHECKLIST_AREAS = {
  Toilet: [
    "Clean inside bowl with specialist cleaner",
    "Scrub under toilet rim thoroughly",
    "Disinfect toilet seat, lid, and base",
    "Wipe cistern top, sides, and flush handle",
    "Clean behind and around toilet base",
    "Disinfect all external toilet surfaces",
  ],
  Shower: [
    "Scrub shower tray or floor",
    "Clean shower screen or curtain",
    "Descale showerhead and rail",
    "Scrub shower wall tiles and grout",
    "Clean shower door tracks and seals",
    "Wipe shower controls and mixer",
  ],
  Sink: [
    "Scrub and disinfect sink basin",
    "Descale taps and polish chrome",
    "Clean around tap base and plug",
    "Wipe vanity unit top and front",
    "Clean mirror streak-free",
    "Wipe splash tiles behind sink",
  ],
  Floors: [
    "Sweep all debris and hair",
    "Mop with disinfectant solution",
    "Scrub floor grout lines",
    "Clean skirting boards and wall base",
    "Dry floor to prevent streaking",
    "Clean behind toilet and under vanity",
  ],
};

const REASONS = [
  {
    icon: "🦠",
    title: "Bathrooms are the highest-risk room",
    text: "Warm, moist conditions make bathrooms the fastest-growing environment for bacteria, mould, and fungi in the home. Daily wiping manages visible dirt but does not eliminate the pathogens that grow in grout lines, around fixtures, and behind toilets.",
  },
  {
    icon: "💧",
    title: "Limescale damages fixtures permanently",
    text: "Hard water deposits build up on taps, showerheads, and tiles over time and eventually cause permanent damage if left untreated. Professional descaling removes existing limescale and extends the life of your bathroom fittings significantly.",
  },
  {
    icon: "🌿",
    title: "Mould is a health hazard",
    text: "Black mould in bathroom grout and around window seals releases spores that trigger respiratory problems, skin irritation, and allergic reactions. It must be treated with specialist products — bleach-and-water simply bleaches the surface without killing the root.",
  },
  {
    icon: "✨",
    title: "A clean bathroom lifts the whole home",
    text: "The state of a bathroom is one of the strongest signals of how well a home is maintained. A professionally cleaned bathroom — gleaming tiles, fresh-smelling, streak-free mirrors — transforms the feel of the entire property.",
  },
];

const STEPS = [
  {
    title: "Book your bathroom clean",
    text: "Choose your service, select a maid, and pick your date and time. Booking takes under 2 minutes — no contracts required.",
  },
  {
    title: "Pay securely via Paystack",
    text: "Your payment is held securely. Our team confirms the booking and your professional is briefed on your bathroom before arrival.",
  },
  {
    title: "We arrive fully equipped",
    text: "Your professional brings specialist descalers, grout brushes, disinfectants, and all tools needed for a thorough bathroom clean — nothing for you to provide.",
  },
  {
    title: "Inspect and approve",
    text: "Walk through the bathroom on completion. Any area that does not meet your standard is re-cleaned immediately at no extra charge.",
  },
];

const TIPS = [
  "Squeegee your shower screen and tiles after every use — it takes 30 seconds and prevents 80% of limescale and soap scum build-up.",
  "Leave the bathroom door open after bathing to ventilate moisture. Mould cannot grow without humidity — remove the humidity and you remove the mould.",
  "Pour a cup of white vinegar into your toilet bowl once a week and leave overnight — it removes limescale without any scrubbing.",
  "Wrap a vinegar-soaked cloth around taps and showerheads for 30 minutes monthly — limescale dissolves without any abrasive scrubbing that could scratch chrome.",
  "Re-seal grout annually to prevent moisture penetration — sealed grout resists mould growth and is dramatically easier to keep clean.",
];

const FAQS = [
  {
    q: "How long does a bathroom deep clean take?",
    a: "A standard bathroom deep clean takes 1–2.5 hours depending on the size, the number of fixtures, and the level of limescale and soap scum build-up. A heavily neglected bathroom with severe limescale or mould may take longer — we will let you know when you book.",
  },
  {
    q: "Can you remove black mould from grout?",
    a: "Yes. We use specialist mould treatments that penetrate grout to kill the root rather than just bleaching the surface. Severe, deep-set mould may require two treatments to fully resolve — we will be honest about what a single clean can achieve and advise on follow-up if needed.",
  },
  {
    q: "Will the cleaning products damage my tiles or chrome?",
    a: "No. We assess your specific tile type, chrome, and surface finishes before selecting products. Natural stone tiles receive different treatment from ceramic; brushed chrome different from polished. Nothing is applied that is unsuitable for your specific surfaces.",
  },
  {
    q: "Do you clean shower curtains?",
    a: "We clean plastic shower curtains in place by wiping them down with disinfectant. Fabric shower curtains can be removed and machine-washed if you have a washing machine accessible — we will advise on this during the clean.",
  },
  {
    q: "Can you clean a bathroom that hasn't been deep-cleaned in years?",
    a: "Yes. Heavily neglected bathrooms with years of limescale, soap scum, and mould build-up are exactly the situations we specialise in. We may recommend a second visit for the worst build-up, but a single deep clean will produce a dramatic, visible improvement in every case.",
  },
  {
    q: "How often should I book a bathroom deep clean?",
    a: "For a regularly used family bathroom, we recommend a professional deep clean every 4–6 weeks alongside your daily maintenance. For lighter-use bathrooms or en-suites, every 6–10 weeks maintains a genuinely clean standard without over-servicing.",
  },
];

export default function Bathrooms() {
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState("Toilet");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Professional bathroom cleaning</p>
        <h1 className={styles.heroTitle}>
          Bathrooms cleaned
          <br />
          <em>to the last tile.</em>
        </h1>
        <p className={styles.heroDesc}>
          Deep bathroom cleans across Abuja and Lagos. Limescale, mould, grout,
          and every fixture — restored to a standard that actually shows.
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
          ["💧", "Limescale specialists"],
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
        <h2 className={styles.sectionTitle}>What does your bathroom need?</h2>
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
        <h2 className={styles.checklistTitle}>Every fixture, every task</h2>
        <p className={styles.checklistSub}>
          Exactly what is covered in a full bathroom deep clean — nothing
          overlooked.
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
            Tips to keep your bathroom cleaner for longer
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
        <h2 className={styles.ctaTitle}>Ready for a bathroom that sparkles?</h2>
        <p className={styles.ctaText}>
          Book a professional bathroom clean in under 2 minutes. All products
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
