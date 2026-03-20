import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Kitchens.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  {
    icon: "🔥",
    name: "Hob & Oven",
    tagline: "Tackle the grease at its source",
    tips: [
      {
        title: "Clean the hob within 5 minutes of cooking",
        text: "Grease and food residue on a hob surface wipes away in seconds while still warm. The same residue baked on overnight takes 15 minutes and specialist degreaser. Keep a damp cloth near the hob and wipe immediately after every meal. This single habit eliminates the need for a weekly hob scrub entirely.",
      },
      {
        title: "Soak burner caps in hot soapy water weekly",
        text: "Gas hob burner caps accumulate food residue in the small holes that can block the flame over time. Remove them weekly and submerge in a bowl of hot water and dish soap for 20 minutes. The residue loosens without scrubbing. Use an old toothbrush to clear any blocked holes, rinse, and allow to dry fully before replacing.",
      },
      {
        title: "Deep-clean the oven with an overnight soak",
        text: "Apply a commercial oven cleaner or a thick paste of baking soda and water to the oven interior before bed — avoiding heating elements. Leave overnight. In the morning, the baked-on grease wipes away with minimal effort. Spray with white vinegar to remove any baking soda residue and buff dry. Attempting an oven clean without a soak produces a fraction of the result in double the time.",
      },
      {
        title: "Clean oven racks separately in the bath",
        text: "Oven racks cleaned inside the oven are almost impossible to clean thoroughly. Fill the bath or a large container with hot water and dish soap, submerge the racks, and leave for 2–4 hours. The grease releases and the racks wipe clean with a cloth. Return them to the bath to rinse. This method takes 5 minutes of active effort, not 30.",
      },
      {
        title: "Degrease the extractor hood and filter monthly",
        text: "The extractor hood and metal mesh filter accumulate grease that becomes a fire hazard if left. Remove the filter and submerge it in boiling water with a squirt of dish soap and a tablespoon of baking soda. The grease dissolves in minutes. Wipe the exterior of the hood with a diluted degreaser and microfibre cloth. A clean extractor also performs better — a blocked filter reduces suction by up to 50%.",
      },
    ],
  },
  {
    icon: "🍽️",
    name: "Surfaces & Cabinets",
    tagline: "Clear, clean, and germ-free",
    tips: [
      {
        title: "Declutter surfaces before you wipe them",
        text: "Wiping around items on a kitchen countertop misses the very areas that accumulate the most bacteria — the edges and undersides of appliances, the spaces between items. Before any surface clean, move every item off the counter, wipe the surface from back to front, then return only what you actively use. Items stored on the counter that are used less than daily should live in a cupboard.",
      },
      {
        title: "Use the right product for your surface material",
        text: "Granite and natural stone countertops are damaged by acidic cleaners including white vinegar and lemon juice — use a pH-neutral cleaner or warm soapy water. Stainless steel scratches with abrasive pads — use a microfibre cloth in the direction of the grain. Laminate surfaces tolerate most cleaners but are damaged by excess moisture. Knowing your surface material prevents the permanent damage that the wrong product causes.",
      },
      {
        title: "Wipe cabinet doors with a damp cloth weekly",
        text: "Kitchen cabinet doors around the hob and oven accumulate grease films that are invisible until they build into a sticky layer. Wipe all cabinet doors with a barely damp microfibre cloth weekly as part of your post-cooking routine. Pay particular attention to the area directly above and beside the hob where grease vapour settles most heavily.",
      },
      {
        title: "Empty and wipe inside cabinets twice a year",
        text: "The inside of kitchen cabinets accumulates crumbs, spice dust, and residue from packaging that serves as both a food source for pests and a contamination risk for your stored food. Twice a year, empty every cabinet completely, wipe the interior with a damp cloth, check for expired items, and line shelves with fresh shelf liner before replacing only what you are keeping.",
      },
      {
        title: "Clean the backsplash tiles after every cooking session",
        text: "Backsplash tiles behind the hob are hit by cooking splatter at every meal. A warm damp cloth immediately after cooking removes everything in 60 seconds. Left for a week, the same splatter requires tile cleaner and a scrubbing brush. Grout between tiles is particularly susceptible to staining — the faster you clean it, the less it discolours over time.",
      },
    ],
  },
  {
    icon: "🧊",
    name: "Fridge & Appliances",
    tagline: "Keep food storage truly hygienic",
    tips: [
      {
        title: "Clean the fridge once a month — all shelves out",
        text: "A monthly fridge clean should involve removing every shelf and drawer, washing them in hot soapy water, and wiping the internal walls, base, and door pockets with a solution of baking soda and warm water (1 tablespoon per litre). This solution cleans without leaving chemical residues near food and neutralises odours. Replace shelves only when fully dry.",
      },
      {
        title: "Wipe fridge door seals with vinegar weekly",
        text: "The rubber door gasket on a fridge accumulates food residue and moisture in its folds, developing mould and bacteria rapidly. Wipe the seal with a cloth dampened in undiluted white vinegar weekly. Pull back the folds to clean inside them — this is where mould typically first appears. A clean, intact seal also maintains cold temperature more efficiently.",
      },
      {
        title: "Clean the microwave with steam — no scrubbing",
        text: "Fill a microwave-safe bowl with equal parts water and white vinegar and microwave on high for 5 minutes. Leave the door closed for 2 more minutes — the steam loosens all food splatter inside. Open and wipe with a cloth. Everything comes off without scrubbing. Clean the turntable plate separately in the sink with dish soap.",
      },
      {
        title: "Descale your kettle monthly",
        text: "Fill the kettle halfway with equal parts water and white vinegar and bring to the boil. Leave the solution for 30 minutes, discard, and boil twice with fresh water before using. Limescale inside a kettle affects boiling efficiency, deposits mineral particles in drinks, and shortens the element's lifespan. Monthly descaling adds years to the appliance.",
      },
      {
        title: "Run your dishwasher empty with vinegar monthly",
        text: "Place a cup of white vinegar in a dishwasher-safe bowl on the top rack and run an empty cycle on the hottest setting. This removes limescale, grease, and detergent residue from the interior. Follow with a sprinkle of baking soda on the base and run a short hot cycle to deodorise. A clean dishwasher cleans dishes better and lasts significantly longer.",
      },
    ],
  },
  {
    icon: "💧",
    name: "Sink & Drains",
    tagline: "The highest-bacteria zone",
    tips: [
      {
        title: "Disinfect the sink daily — not just rinse it",
        text: "Kitchen sinks carry more bacteria per square centimetre than most toilet seats — including E. coli and Salmonella from raw meat and vegetables. Rinsing moves bacteria around rather than eliminating them. After washing up, spray the sink basin and surrounding area with a diluted disinfectant, leave for 30 seconds, then wipe dry. This daily habit eliminates the primary bacteria reservoir in your kitchen.",
      },
      {
        title: "Descale taps and the sink weekly with vinegar",
        text: "Limescale around the tap base and sink edges is both unsightly and difficult to remove once it builds. Spray with undiluted white vinegar, leave for 10 minutes, and wipe clean. For taps, wrap a vinegar-soaked cloth around them and secure it in place for 30 minutes. The limescale dissolves without abrasive scrubbing that can scratch chrome.",
      },
      {
        title: "Flush drains with boiling water weekly",
        text: "Pour a full kettle of boiling water directly down the kitchen drain once a week to dissolve grease build-up before it narrows the pipe. For a deeper clear, follow with half a cup of baking soda, then half a cup of white vinegar. Let the fizzing reaction work for 10 minutes before flushing with boiling water. This prevents blockages that require chemical drain unblockers.",
      },
      {
        title: "Clean the plug and drain basket daily",
        text: "Food particles trapped in the drain basket begin decomposing and producing odour within 24 hours in the warm, moist drain environment. Empty the drain basket after every washing-up session and rinse it under running water. Once a week, scrub it with an old toothbrush and dish soap. This is the primary cause of kitchen drain odour and the easiest to prevent.",
      },
      {
        title: "Sanitise your chopping boards after every use",
        text: "Chopping boards — particularly wood and plastic ones with cut grooves — harbour bacteria in levels that make them one of the highest-risk surfaces in the kitchen. After every use, wash with hot soapy water, then spray with a diluted bleach solution (1 teaspoon per litre) or white vinegar and allow to air dry upright. Replace boards with deep grooves that no longer sanitise effectively.",
      },
    ],
  },
  {
    icon: "🧹",
    name: "Floors & General",
    tagline: "Finish every session properly",
    tips: [
      {
        title: "Sweep before you mop — always",
        text: "Mopping over loose debris pushes it around the floor and leaves residue in the mop head that contaminates subsequent areas. Always sweep or vacuum the entire kitchen floor before mopping. Pay particular attention to the area under the kickboards of kitchen units, which accumulates debris invisibly and is cleaned last.",
      },
      {
        title: "Use two buckets when mopping",
        text: "The single biggest mistake in floor mopping is using one bucket — you are spreading increasingly dirty water over a clean floor after the first few passes. Use two buckets: one with your cleaning solution and one with plain rinse water. Wring the mop into the dirty bucket, rinse in clean water, then reload from the clean bucket. The floor you finish on is as clean as the floor you started on.",
      },
      {
        title: "Clean skirting boards and kickboards monthly",
        text: "The base of kitchen walls and unit kickboards accumulate grease film, dust, and food residue that is below eye level and therefore overlooked. Wipe them monthly with a damp cloth — include the underside of wall unit overhangs which collect grease vapour. In a kitchen with a gas hob, this area collects combustible grease that should not be left to accumulate.",
      },
      {
        title: "Clean behind appliances twice a year",
        text: "The area behind the fridge, oven, and washing machine accumulates extraordinary quantities of dust, grease, and food debris that are completely invisible from normal standing height. Pull these appliances out twice a year, vacuum the floor and wall thoroughly, check power cables and water hoses for damage, and replace. The buildup behind a fridge can impair cooling efficiency by reducing airflow.",
      },
      {
        title: "End every clean by wiping light switches and handles",
        text: "Light switches, cabinet handles, and the fridge door handle are the highest-touch surfaces in the kitchen and the fastest vectors for cross-contamination between raw food preparation and other surfaces. Wipe them with a disinfectant spray and cloth at the end of every kitchen clean as a final step. This takes 60 seconds and eliminates one of the most significant germ transmission routes in the home.",
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: "🍋",
    time: "30 sec",
    tip: "Rub a cut lemon over a wooden chopping board to deodorise and naturally disinfect the surface.",
  },
  {
    icon: "🧂",
    time: "1 min",
    tip: "Pour salt immediately on a fresh spill — it absorbs the liquid before it stains the surface.",
  },
  {
    icon: "🫧",
    time: "2 min",
    tip: "Place a bowl of water with lemon slices in the microwave and heat for 3 minutes to steam-clean the interior.",
  },
  {
    icon: "♨️",
    time: "30 sec",
    tip: "Wipe the hob with a damp cloth while it's still slightly warm — grease comes off in one pass.",
  },
  {
    icon: "🪥",
    time: "1 min",
    tip: "Use an old toothbrush dipped in baking soda paste to clean grout lines between backsplash tiles.",
  },
  {
    icon: "🧴",
    time: "2 min",
    tip: "Mix equal parts dish soap and white vinegar in a spray bottle for a powerful all-purpose kitchen degreaser.",
  },
  {
    icon: "🧊",
    time: "30 sec",
    tip: "Place an open box of baking soda in the back of your fridge to continuously absorb odours between cleans.",
  },
  {
    icon: "💧",
    time: "1 min",
    tip: "Run hot water for 30 seconds after each washing-up session to clear grease from the drain pipe while it's liquid.",
  },
];

const TIPS = [
  "The kitchen is the one room where daily maintenance pays back more than any other — 5 minutes after every meal prevents the hour-long weekly deep clean.",
  "Grease is the kitchen's primary cleaning challenge. Address it while it's fresh and liquid — not after it has baked on, cooled, and hardened into carbonised residue.",
  "Keep cleaning products visible and accessible in the kitchen. If the spray bottle is under the sink behind six other things, you won't use it. Proximity determines whether a habit happens.",
  "When booking a professional kitchen clean, ask specifically for oven and extractor filter — these are the two areas most likely to be omitted from a standard clean and both have fire safety implications.",
  "A kitchen that smells fresh after cleaning was actually cleaned. If there is still an odour after wiping, the drain basket, fridge seal, or chopping boards were missed — these are the three primary odour sources.",
];

const FAQS = [
  {
    q: "How do I remove baked-on grease from the oven?",
    a: "The only effective approach is a chemical dwell time before scrubbing. Apply a commercial oven cleaner or a thick baking soda and water paste to all greasy surfaces, leave overnight, and wipe away the next morning. The chemistry does the work — attempting to scrub without a soak is labour-intensive and produces poor results. Spray with white vinegar after to remove residue and neutralise any remaining cleaner.",
  },
  {
    q: "How do I get rid of kitchen drain smell?",
    a: "The primary cause is food debris in the drain basket or plug, decomposing grease in the drain pipe, or bacteria growing in the drain itself. Empty and scrub the drain basket daily. Pour boiling water down the drain weekly. For persistent odour, pour half a cup of baking soda into the drain, follow with half a cup of white vinegar, leave 10 minutes, then flush with boiling water. If odour persists, the U-bend may need clearing.",
  },
  {
    q: "What is the best way to clean stainless steel appliances?",
    a: "Always wipe in the direction of the grain (the faint lines running across the surface). Use a microfibre cloth dampened with warm water and a drop of dish soap for general cleaning, and a dedicated stainless steel cleaner for fingerprints and water marks. Never use abrasive pads or powders — they create micro-scratches that trap grease and worsen the appearance over time.",
  },
  {
    q: "How often should I clean the fridge?",
    a: "A full empty-and-wipe fridge clean should happen monthly. Between full cleans, wipe up any spills immediately, check for expired items weekly, and wipe the door seal with white vinegar weekly. The fridge door seal is the most commonly neglected area and the fastest to develop mould — a 30-second weekly wipe prevents a much longer clean when mould establishes itself.",
  },
  {
    q: "Is white vinegar safe on all kitchen surfaces?",
    a: "No. White vinegar is acidic and permanently damages natural stone surfaces including granite, marble, and limestone — it etches the surface and removes the seal. It is safe and effective on glass, stainless steel (in diluted form), ceramic tiles, and most laminate surfaces. For stone worktops, use a pH-neutral cleaner. When in doubt about your surface material, test on a hidden area first.",
  },
  {
    q: "How do I stop my kitchen smelling after cooking?",
    a: "Ventilate immediately and continuously — run the extractor and open a window during and after cooking. Wipe the hob and surrounding surfaces while still warm. Check the drain basket is empty. Place a bowl of white vinegar on the counter for an hour to absorb airborne cooking odours. If the smell persists after ventilation, the source is likely the extractor filter (needs cleaning) or the chopping board (needs replacing or deep sanitising).",
  },
];

export default function KitchenTips() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Hob & Oven");
  const [openTip, setOpenTip] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const category = CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Kitchen cleaning guide</p>
        <h1 className={styles.heroTitle}>
          Kitchen cleaning tips
          <br />
          <em>that actually work.</em>
        </h1>
        <p className={styles.heroDesc}>
          Practical, professional-grade kitchen cleaning advice — from daily
          habits that prevent build-up to the deep-clean methods that restore
          any kitchen to its best.
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
            onClick={() =>
              document
                .getElementById("tips-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Read the Tips
          </button>
        </div>
      </div>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          ["🧪", "Chemical-free options"],
          ["🔥", "Grease & oven tips"],
          ["💡", "8 quick wins"],
          ["🏠", "Every kitchen area"],
          ["✅", "Expert-approved"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Category tips */}
      <div className={styles.section} id="tips-section">
        <p className={styles.sectionEyebrow}>Area-by-area guide</p>
        <h2 className={styles.sectionTitle}>
          Tips for every part of your kitchen
        </h2>

        {/* Category tabs */}
        <div className={styles.catTabs}>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              className={`${styles.catTab} ${activeCategory === c.name ? styles.catTabActive : ""}`}
              onClick={() => {
                setActiveCategory(c.name);
                setOpenTip(null);
              }}
            >
              <span className={styles.catTabIcon}>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Active category label */}
        <div className={styles.catLabel}>
          <span className={styles.catLabelIcon}>{category.icon}</span>
          <div>
            <p className={styles.catLabelName}>{category.name}</p>
            <p className={styles.catLabelTagline}>{category.tagline}</p>
          </div>
        </div>

        {/* Tips accordion */}
        <div className={styles.tipsList}>
          {category.tips.map((tip, i) => (
            <div
              key={tip.title}
              className={`${styles.tipCard} ${openTip === i ? styles.tipCardOpen : ""}`}
            >
              <button
                className={styles.tipQuestion}
                onClick={() => setOpenTip(openTip === i ? null : i)}
              >
                <div className={styles.tipQuestionLeft}>
                  <div className={styles.tipNum}>{i + 1}</div>
                  <span className={styles.tipTitle}>{tip.title}</span>
                </div>
                <span
                  className={`${styles.tipChevron} ${openTip === i ? styles.tipChevronOpen : ""}`}
                >
                  ▾
                </span>
              </button>
              {openTip === i && <p className={styles.tipAnswer}>{tip.text}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick wins */}
      <div className={styles.quickWins}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Instant results
        </p>
        <h2 className={styles.quickWinsTitle}>
          8 kitchen quick wins you can use today
        </h2>
        <p className={styles.quickWinsSub}>
          No specialist products, no equipment — just clever tricks that
          actually work and take under 2 minutes each.
        </p>
        <div className={styles.quickWinsGrid}>
          {QUICK_WINS.map((w, i) => (
            <div
              key={i}
              className={styles.quickWinCard}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={styles.quickWinTop}>
                <span className={styles.quickWinIcon}>{w.icon}</span>
                <span className={styles.quickWinTime}>{w.time}</span>
              </div>
              <p className={styles.quickWinText}>{w.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips banner */}
      <div className={styles.tipsBanner}>
        <div className={styles.tipsBannerHeader}>
          <span className={styles.tipsHeaderIcon}>💡</span>
          <p className={styles.tipsHeaderTitle}>
            The principles behind a clean kitchen
          </p>
        </div>
        <div className={styles.tipsList2}>
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
          Rather leave it to the professionals?
        </h2>
        <p className={styles.ctaText}>
          Our vetted maids know every tip on this page and then some. Book a
          professional kitchen clean and come home to a spotless kitchen —
          guaranteed.
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
