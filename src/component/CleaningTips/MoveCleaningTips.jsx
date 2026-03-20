import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MoveCleaningTips.module.css";
import FixedHeader from "../FixedHeader";

const TABS = ["Move-In", "Move-Out"];

const TIPS = {
  "Move-In": [
    {
      icon: "🧹",
      title: "Clean before your furniture arrives",
      text: "The single best time to clean a new property is before anything is moved in. Every surface, corner, and floor is fully accessible. Once furniture arrives, deep cleaning becomes dramatically harder — especially under heavy items and inside built-in spaces.",
    },
    {
      icon: "🧫",
      title: "Sanitise, don't just wipe",
      text: "You have no idea what the previous occupants left behind in terms of germs, allergens, or pests. Use a proper disinfectant on all hard surfaces — kitchen countertops, bathroom basins, toilet seats, light switches, and door handles. A quick wipe with a damp cloth is not the same as sanitising.",
    },
    {
      icon: "🍳",
      title: "Start with the kitchen and bathrooms",
      text: "These two rooms harbour the most bacteria and are the most used from day one. Deep-clean the oven, hob, and inside cabinets before you store your food and cookware. Scrub the toilet, shower, and basin before your toiletries go in. Everything else can follow.",
    },
    {
      icon: "🔍",
      title: "Inspect hidden areas before cleaning over them",
      text: "Before you start cleaning, inspect behind appliances, inside kitchen cabinets, under bathroom vanities, and inside wardrobes. Note any mould, pest activity, or damage and report it to your landlord or agent in writing before cleaning — otherwise you may become liable for pre-existing issues.",
    },
    {
      icon: "🪟",
      title: "Clean windows and tracks thoroughly",
      text: "Window tracks collect years of dust, dead insects, and grime that previous occupants rarely clean. Use a dry brush or old toothbrush to loosen the debris in the tracks, vacuum it out, then wipe with a damp cloth. Clean the glass with a vinegar-water solution for streak-free results.",
    },
    {
      icon: "💨",
      title: "Ventilate while you clean",
      text: "Open all windows and doors while cleaning to circulate fresh air and speed up drying. This also helps remove any chemical odours from cleaning products and expels musty smells that have built up in a vacant property. Leave windows open for at least an hour after finishing.",
    },
    {
      icon: "🏷️",
      title: "Check and clean inside all storage",
      text: "Wardrobes, kitchen cabinets, bathroom cupboards, and utility spaces all need wiping inside and out before you put your belongings in. Previous occupants leave residues, crumbs, and sometimes pests. Line shelves with fresh shelf liner after cleaning for easy maintenance.",
    },
    {
      icon: "📸",
      title: "Photograph the property after cleaning",
      text: "Once you have cleaned and before any furniture arrives, photograph every room thoroughly — floors, walls, ceilings, fixtures, and appliances. Date-stamp the images. These photos protect you if the landlord later claims you damaged or dirtied something that was already in that condition on arrival.",
    },
  ],
  "Move-Out": [
    {
      icon: "📋",
      title: "Use your original inventory as a checklist",
      text: "Dig out the inventory report from when you moved in and use it as your cleaning guide. Every item listed must be returned to the same condition. Pay particular attention to anything noted as 'good' or 'clean' on arrival — if it was listed clean, it must be returned clean.",
    },
    {
      icon: "💰",
      title: "Your deposit depends on this clean",
      text: "Cleaning is the single most common reason landlords make deductions from security deposits. A professional move-out clean costs a fraction of what you risk losing. Even if you clean yourself, budget at least a full day and be methodical — rushing a move-out clean is costly.",
    },
    {
      icon: "🔥",
      title: "The oven is the most inspected appliance",
      text: "Landlords and letting agents check the oven first — always. Baked-on grease and carbonised food residue from months of cooking must be completely removed. Use a commercial oven cleaner, leave it overnight if needed, and clean the oven glass inside and out. Don't forget the grill pan and racks.",
    },
    {
      icon: "🚿",
      title: "Tackle limescale and mould before the inspection",
      text: "In Nigerian climates, limescale on taps and showerheads, and mould in bathroom grout and around window seals, are common and will be flagged by any inspector. Use a descaler on taps and showerheads and a mould remover on grout. Leave both products on for the time specified on the packaging — don't rush.",
    },
    {
      icon: "🎨",
      title: "Spot-clean walls before repainting becomes necessary",
      text: "Scuff marks, fingerprints, and minor stains on painted walls can often be removed with a magic eraser or diluted sugar soap. Deal with them before the inspection — if left, the landlord may charge for repainting an entire room for marks that could have been spot-cleaned in minutes.",
    },
    {
      icon: "🪑",
      title: "Clean behind and underneath every piece of furniture",
      text: "Landlords and agents move furniture during inspections. The area behind the sofa, under the bed, and behind wardrobes must be vacuumed and mopped. Dust bunnies and debris that have accumulated there for years will be counted against you if found.",
    },
    {
      icon: "🌿",
      title: "Don't forget the garden and outdoor areas",
      text: "If your tenancy includes a garden, balcony, or outdoor space, it must be returned in the same condition as the inventory. Remove all rubbish, sweep patios, and cut back any overgrown plants. Outdoor areas are a common source of disputes but are easy to overlook during a busy move.",
    },
    {
      icon: "📜",
      title: "Request a certificate of clean",
      text: "If you hire a professional cleaning company, ask for a written certificate confirming the clean was carried out. Most reputable companies provide this on request. Many letting agents and landlords accept this as proof of professional cleaning and will not deduct for cleaning if it is presented at the inspection.",
    },
  ],
};

const CHECKLIST = {
  "Move-In": {
    Kitchen: [
      "Clean inside oven, hob, and grill",
      "Degrease extractor hood and filter",
      "Wipe inside and outside all cabinets",
      "Descale sink and taps",
      "Clean fridge inside and out",
      "Wipe all countertops and backsplash",
      "Mop floor and clean skirting",
    ],
    Bathrooms: [
      "Scrub toilet inside and outside",
      "Deep-clean shower and screen",
      "Descale showerhead and taps",
      "Scrub tiles and grout",
      "Clean mirrors and glass",
      "Wipe vanity and cupboards",
      "Mop and disinfect floor",
    ],
    Bedrooms: [
      "Wipe inside all wardrobes",
      "Dust all surfaces and ledges",
      "Vacuum carpet or mop floor",
      "Clean light switches and sockets",
      "Wipe window sills and tracks",
      "Vacuum under bed area",
      "Clean mirrors",
    ],
    "Living Areas": [
      "Dust all surfaces and shelves",
      "Vacuum sofas and cushions",
      "Vacuum or mop floors",
      "Wipe skirting boards",
      "Clean light switches",
      "Wipe door frames and handles",
      "Clean windows inside",
    ],
  },
  "Move-Out": {
    Kitchen: [
      "Deep-clean oven to bare metal",
      "Clean grill pan and oven racks",
      "Degrease hob and burner caps",
      "Clean extractor filter",
      "Wipe inside all cabinets",
      "Descale sink, taps, and draining board",
      "Clean fridge and defrost freezer",
    ],
    Bathrooms: [
      "Remove all limescale from taps",
      "Descale showerhead",
      "Scrub grout and remove mould",
      "Clean toilet cistern and seat",
      "Polish all mirrors and glass",
      "Clean extractor fan",
      "Disinfect all surfaces",
    ],
    Bedrooms: [
      "Vacuum and mop under all furniture",
      "Clean inside and behind wardrobes",
      "Spot-clean wall marks",
      "Clean inside window tracks",
      "Remove all wall fixings and fill holes",
      "Vacuum curtains or wipe blinds",
      "Clean light fittings",
    ],
    "Living Areas": [
      "Move and clean behind all furniture",
      "Spot-clean all wall marks",
      "Vacuum and mop under sofa",
      "Clean skirting boards thoroughly",
      "Wipe all door frames and handles",
      "Clean windows inside and out",
      "Remove all personal items and rubbish",
    ],
  },
};

const COMPARE = [
  {
    aspect: "When to book",
    moveIn: "1–2 days before you move furniture in",
    moveOut: "1–2 days before your tenancy ends",
  },
  {
    aspect: "Primary goal",
    moveIn: "Sanitise and start fresh",
    moveOut: "Restore to original condition and get deposit back",
  },
  {
    aspect: "Key focus areas",
    moveIn: "Kitchen, bathrooms, hidden storage",
    moveOut: "Oven, grout, walls, behind furniture",
  },
  {
    aspect: "Certificate needed?",
    moveIn: "Recommended for records",
    moveOut: "Often required by landlord or agent",
  },
  {
    aspect: "Duration (2-bed flat)",
    moveIn: "4–6 hours",
    moveOut: "5–8 hours",
  },
  {
    aspect: "Starting price",
    moveIn: "From ₦15,000",
    moveOut: "From ₦18,000",
  },
];

const FAQS = [
  {
    q: "Should I clean before or after the removal van?",
    a: "For a move-in clean, always clean before the removal van arrives — every surface is fully accessible and you'll get a far more thorough result. For a move-out clean, aim to clean after the removal van has taken your furniture so you can clean behind and underneath everything.",
  },
  {
    q: "Do I need to be present during the clean?",
    a: "No. Many customers arrange key access for our professionals. We message you when we arrive and send a completion confirmation with photos when we're done. You just need to ensure utilities (water and electricity) are connected on the day.",
  },
  {
    q: "What if my landlord isn't satisfied with the move-out clean?",
    a: "Contact us within 24 hours of the inspection and we will return to address any specific areas raised — free of charge. We recommend requesting a certificate of clean from us which most landlords and agents accept as evidence of professional cleaning.",
  },
  {
    q: "Do you supply all cleaning products and equipment?",
    a: "Yes. Our professionals arrive fully equipped with commercial-grade degreasers, descalers, mould removers, microfibre cloths, and all necessary tools. You don't need to provide anything except access to water and electricity.",
  },
  {
    q: "Can I combine a move-out and move-in clean on the same day?",
    a: "Yes, if you're moving out of one property and into another. We can coordinate two separate teams to handle both properties. Book both at the same time and let us know in the notes — we'll align the timing to your moving schedule.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 48 hours in advance. For end-of-month move-outs (when demand is highest), book 4–7 days ahead to secure your preferred date and time. Same-day bookings are occasionally available — contact us directly.",
  },
];

const STEPS = [
  {
    title: "Book your date",
    text: "Choose move-in or move-out, select a maid, pick your date and time. Booking takes under 2 minutes with no contracts required.",
  },
  {
    title: "Pay securely via Paystack",
    text: "Your payment is held securely. Our admin team confirms the booking and your maid is notified immediately.",
  },
  {
    title: "We arrive fully equipped",
    text: "Your professional arrives with all products and tools. We work systematically through every room on the comprehensive checklist.",
  },
  {
    title: "Inspect and sign off",
    text: "Walk through the property on completion. Any area that doesn't meet your standard gets re-cleaned on the spot at no extra charge.",
  },
];

export default function MoveCleaningTips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Move-In");
  const [activeRoom, setActiveRoom] = useState("Kitchen");
  const [openFaq, setOpenFaq] = useState(null);

  const tips = TIPS[activeTab];
  const checklist = CHECKLIST[activeTab];
  const rooms = Object.keys(checklist);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setActiveRoom("Kitchen");
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Move cleaning guide</p>
        <h1 className={styles.heroTitle}>
          Move-in & move-out
          <br />
          <em>cleaning tips.</em>
        </h1>
        <p className={styles.heroDesc}>
          Everything you need to know about cleaning when you move — whether
          you're starting fresh in a new home or leaving your old one spotless
          to get your deposit back.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => navigate("/maids")}
          >
            Book a Professional
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
          ["🛡️", "Deposit-back guarantee"],
          ["📋", "Certificate available"],
          ["⚡", "Same-week booking"],
          ["🔒", "Secure payment"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Tab switcher + tips */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Tips & advice</p>
        <h2 className={styles.sectionTitle}>
          What you need to know before you move
        </h2>

        {/* Main tab switcher */}
        <div className={styles.mainTabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.mainTab} ${activeTab === tab ? styles.mainTabActive : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === "Move-In" ? "🏠" : "📦"} {tab} Tips
            </button>
          ))}
        </div>

        {/* Tab label */}
        <div className={styles.tabLabel}>
          <span className={styles.tabLabelIcon}>
            {activeTab === "Move-In" ? "🏠" : "📦"}
          </span>
          <div>
            <p className={styles.tabLabelTitle}>
              {activeTab === "Move-In"
                ? "Moving into a new home"
                : "Moving out of your current home"}
            </p>
            <p className={styles.tabLabelSub}>
              {activeTab === "Move-In"
                ? "Start your life in this property the right way — clean, sanitised, and truly fresh."
                : "Leave spotless, protect your deposit, and end your tenancy on the best possible terms."}
            </p>
          </div>
        </div>

        {/* Tips grid */}
        <div className={styles.tipsGrid}>
          {tips.map((tip, i) => (
            <div
              key={tip.title}
              className={styles.tipCard}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={styles.tipCardTop}>
                <div className={styles.tipIcon}>{tip.icon}</div>
                <p className={styles.tipTitle}>{tip.title}</p>
              </div>
              <p className={styles.tipText}>{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Room-by-room checklist */}
      <div className={styles.checklist}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {activeTab} checklist
        </p>
        <h2 className={styles.checklistTitle}>
          {activeTab === "Move-In"
            ? "What to clean before you unpack"
            : "What to clean before you hand over the keys"}
        </h2>
        <p className={styles.checklistSub}>
          {activeTab === "Move-In"
            ? "Work through these room by room — everything below is included in our professional move-in clean."
            : "Every item below is checked by landlords and agents at move-out inspections."}
        </p>

        {/* Tab switcher inside checklist */}
        <div className={styles.checklistTabRow}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.checklistTab} ${activeTab === tab ? styles.checklistTabActive : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === "Move-In" ? "🏠" : "📦"} {tab}
            </button>
          ))}
        </div>

        <div className={styles.roomTabs}>
          {rooms.map((room) => (
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
          {checklist[activeRoom].map((item) => (
            <div key={item} className={styles.roomItem}>
              <div className={styles.roomCheck}>✓</div>
              <span className={styles.roomText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Side by side</p>
        <h2 className={styles.sectionTitle}>
          Move-in vs move-out — how they differ
        </h2>
        <div className={styles.compareTable}>
          <div className={styles.compareHeader}>
            <div className={styles.compareAspectHead} />
            <div className={styles.compareColHead}>🏠 Move-In</div>
            <div className={styles.compareColHead}>📦 Move-Out</div>
          </div>
          {COMPARE.map((row, i) => (
            <div
              key={row.aspect}
              className={`${styles.compareRow} ${i % 2 === 0 ? styles.compareRowAlt : ""}`}
            >
              <div className={styles.compareAspect}>{row.aspect}</div>
              <div className={styles.compareCell}>{row.moveIn}</div>
              <div className={styles.compareCell}>{row.moveOut}</div>
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
            Pro tips for a smooth move clean
          </p>
        </div>
        <div className={styles.proTipsList}>
          {[
            "Book your clean 24–48 hours before your move date to guarantee access to every surface.",
            "Ensure water and electricity are still connected on the day of the clean.",
            "Remove all personal belongings before the clean — we work best in an empty space.",
            "Take dated photos before and after the clean for your records.",
            "Request a certificate of clean if your landlord or agent requires written proof.",
          ].map((tip, i) => (
            <div key={i} className={styles.proTipItem}>
              <div className={styles.proTipDot}>{i + 1}</div>
              <p className={styles.proTipText}>{tip}</p>
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
        <h2 className={styles.ctaTitle}>Ready to book your move clean?</h2>
        <p className={styles.ctaText}>
          Moving in or moving out — we handle both. Book in under 2 minutes, all
          products supplied, satisfaction guaranteed.
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
