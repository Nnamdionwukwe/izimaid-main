import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Bedrooms.module.css";
import FixedHeader from "../FixedHeader";

const SERVICES = [
  {
    icon: "🛏️",
    name: "Bedroom Deep Clean",
    tagline: "Rest in a truly clean space",
    desc: "A thorough deep clean of your entire bedroom — mattress, floors, wardrobes, surfaces, windows, and all the corners that daily tidying misses. Designed for a genuinely restful, allergen-reduced sleep environment.",
    checklist: [
      "Vacuum mattress and wipe bed frame",
      "Dust and wipe all surfaces and furniture",
      "Vacuum or mop floors thoroughly",
      "Wipe wardrobe doors inside and out",
      "Clean windows and window sills inside",
      "Sanitise light switches and door handles",
    ],
    from: "₦8,000",
  },
  {
    icon: "🪟",
    name: "Wardrobe & Storage Clean",
    tagline: "Organised, dust-free storage",
    desc: "A focused clean of wardrobe interiors, chest of drawers, storage boxes, and bedroom shelving. Dust and debris accumulate inside storage and transfer to clothes and linens — this clean eliminates them completely.",
    checklist: [
      "Empty and wipe all wardrobe interiors",
      "Clean wardrobe rails and hooks",
      "Wipe all drawer interiors",
      "Dust shelving and storage boxes",
      "Vacuum wardrobe floor and corners",
      "Wipe all exterior wardrobe surfaces",
    ],
    from: "₦5,500",
  },
  {
    icon: "🌙",
    name: "Mattress & Bedding Clean",
    tagline: "Sleep hygiene restored",
    desc: "A specialist clean targeting your mattress, pillows, and bed frame. Removes dust mites, dead skin cells, sweat residue, and allergens that accumulate in bedding and mattress fibres over time.",
    checklist: [
      "Vacuum mattress with upholstery attachment",
      "Spot-treat mattress stains",
      "Deodorise mattress with natural solution",
      "Wipe bed frame and headboard",
      "Flip or rotate mattress if appropriate",
      "Wash and replace bedding on 60°C",
    ],
    from: "₦6,000",
  },
];

const CHECKLIST_AREAS = {
  Surfaces: [
    "Dust all furniture tops and ledges",
    "Wipe bedside tables and lamps",
    "Clean dressing table and mirror",
    "Dust all picture frames and artwork",
    "Wipe light switches and sockets",
    "Clean door handles and frames",
  ],
  Wardrobe: [
    "Wipe interior walls and base",
    "Clean wardrobe rails and hooks",
    "Dust all shelves inside",
    "Wipe wardrobe door fronts",
    "Vacuum wardrobe floor",
    "Wipe mirror doors streak-free",
  ],
  Floors: [
    "Vacuum entire carpet or mop floor",
    "Move lighter furniture and clean underneath",
    "Vacuum under the bed",
    "Clean floor edges and skirting boards",
    "Mop hard floor with disinfectant",
    "Dry-buff to prevent streaking",
  ],
  Bed: [
    "Vacuum mattress surface",
    "Wipe bed frame and headboard",
    "Wipe bedside rails if fitted",
    "Wash all bedding on 60°C",
    "Flip pillow and change pillowcase",
    "Dust under and around bed base",
  ],
};

const REASONS = [
  {
    icon: "🌬️",
    title: "You spend a third of your life here",
    text: "The average person spends 7–9 hours in their bedroom every single night. Dust mites, allergens, and bacteria that accumulate in an unclean bedroom are continuously inhaled during sleep — directly affecting the quality of your rest and the health of your respiratory system.",
  },
  {
    icon: "🪲",
    title: "Mattresses harbour millions of dust mites",
    text: "A typical mattress contains between 100,000 and 10 million dust mites feeding on shed skin cells. They are invisible but their waste particles are the most common trigger of asthma and allergic rhinitis. Professional vacuuming and treatment dramatically reduces their population.",
  },
  {
    icon: "😴",
    title: "Cleanliness directly improves sleep quality",
    text: "Research consistently shows people sleep faster and more deeply in visually tidy, clean-smelling bedrooms. The psychological signal of an ordered, clean space reduces cortisol and prepares the mind for sleep — a clean bedroom is not a luxury, it is sleep hygiene.",
  },
  {
    icon: "🧺",
    title: "Wardrobes transfer dust to your clothes",
    text: "Dust that accumulates inside wardrobes and chest of drawers coats your clothes and transfers to your skin throughout the day. Regular cleaning of wardrobe interiors prevents this cycle and keeps freshly laundered clothes actually clean when you wear them.",
  },
];

const STEPS = [
  {
    title: "Book your bedroom clean",
    text: "Choose your service, select a maid, and pick your date and time. Booking takes under 2 minutes — no contracts required.",
  },
  {
    title: "Pay securely via Paystack",
    text: "Your payment is held securely. Our team confirms the booking and your professional is briefed on your bedroom before arrival.",
  },
  {
    title: "We arrive fully equipped",
    text: "Your professional brings all products, upholstery attachments, microfibre cloths, and specialist tools — nothing for you to provide.",
  },
  {
    title: "Inspect and approve",
    text: "Walk through the bedroom on completion. Any surface that doesn't meet your standard is re-cleaned immediately — no extra charge.",
  },
];

const TIPS = [
  "Wash bedding weekly on 60°C — this is the only temperature that kills dust mites reliably. Lower temperatures clean but do not eliminate them.",
  "Air your bedroom for 10 minutes every morning before making the bed — this allows moisture from sleeping to evaporate from the mattress rather than trapping it under the duvet.",
  "Vacuum your mattress monthly using the upholstery attachment before changing bedding — the mattress is the single highest concentration of allergens in your bedroom.",
  "Keep surfaces as clear as possible between deep cleans — fewer items on display means less surface area for dust to settle and a faster, more thorough result when you do clean.",
  "Place a hamper in the bedroom for worn clothes rather than leaving them on chairs and floors — this one change reduces bedroom dust and makes the room quicker to clean by up to 40%.",
];

const FAQS = [
  {
    q: "How long does a bedroom deep clean take?",
    a: "A standard bedroom deep clean takes 1.5–3 hours depending on room size, the volume of furniture and storage, and the level of dust build-up. A wardrobe and storage clean adds 30–60 minutes. We'll give you a more accurate estimate when you book.",
  },
  {
    q: "Do you move furniture to clean underneath?",
    a: "We move lighter furniture — bedside tables, chairs, and smaller items — to clean underneath them. For heavy items like solid wardrobes, bed frames with bases, and dressers, we use long-handled tools to reach as far underneath as possible without the risk of damage.",
  },
  {
    q: "Can you remove stains from my mattress?",
    a: "We can treat and significantly reduce most surface stains on mattresses. Old, deep-set, or liquid stains may not be fully removable in a single treatment and we will always be honest about what is achievable before we begin. Spot treatment is included in our mattress clean service.",
  },
  {
    q: "Should I empty my wardrobe before the clean?",
    a: "For the most thorough wardrobe interior clean, yes — removing clothes allows us to wipe every shelf and the floor properly. If emptying is not practical, we clean around items and use long-handled tools to reach the back of shelves. Let us know when booking and we'll advise accordingly.",
  },
  {
    q: "How often should I book a bedroom deep clean?",
    a: "For an actively used bedroom, we recommend a professional deep clean every 4–6 weeks alongside weekly bedding changes and daily ventilation. For guest bedrooms in lighter use, every 6–10 weeks is sufficient to maintain a genuinely clean standard.",
  },
  {
    q: "Do you clean en-suite bathrooms as part of a bedroom clean?",
    a: "En-suite bathrooms are not included in a standard bedroom clean but can be added as a separate bathroom service at the time of booking. Many customers book both together for a complete bedroom and en-suite package — just let us know when booking.",
  },
];

export default function Bedrooms() {
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState("Surfaces");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Professional bedroom cleaning</p>
        <h1 className={styles.heroTitle}>
          Sleep better in a room
          <br />
          <em>that's truly clean.</em>
        </h1>
        <p className={styles.heroDesc}>
          Deep bedroom cleans across Abuja and Lagos. Mattresses, floors,
          wardrobes, and every surface — cleaned to a standard that improves
          your sleep and your health.
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
          ["🌙", "Sleep hygiene specialists"],
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
        <h2 className={styles.sectionTitle}>What does your bedroom need?</h2>
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
          Exactly what is covered in a full bedroom deep clean — nothing
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
        <h2 className={styles.sectionTitle}>More than just a tidy room</h2>
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
            Tips to keep your bedroom cleaner for longer
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
          Ready to sleep in a truly clean bedroom?
        </h2>
        <p className={styles.ctaText}>
          Book a professional bedroom clean in under 2 minutes. All products
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
