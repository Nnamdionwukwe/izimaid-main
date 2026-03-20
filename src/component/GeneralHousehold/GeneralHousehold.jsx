import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GeneralHousehold.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  {
    icon: "🍳",
    name: "Kitchen",
    tagline: "The heart of the home",
    color: "rgb(187, 19, 47)",
    tips: [
      {
        title: "Degrease your hob weekly",
        text: "Mix equal parts white vinegar and water in a spray bottle. Spray the hob surface, leave for 5 minutes, then wipe with a microfibre cloth. For stubborn grease, add a few drops of dish soap and scrub with a soft brush.",
      },
      {
        title: "Clean your oven naturally",
        text: "Make a paste from baking soda and water, spread it inside the oven avoiding the heating elements, and leave overnight. Wipe away the next morning with a damp cloth, then spray with white vinegar to remove any residue.",
      },
      {
        title: "Descale your sink and taps",
        text: "Soak a cloth in white vinegar and wrap it around taps for 30 minutes. For the sink, sprinkle baking soda, scrub with a sponge, then rinse. This removes limescale and kills bacteria without harsh chemicals.",
      },
      {
        title: "Freshen your fridge monthly",
        text: "Remove all items, wipe shelves with a mixture of warm water and baking soda (1 tbsp per litre). Place an open box of baking soda or a bowl of coffee grounds inside to absorb odours between cleans.",
      },
      {
        title: "Keep drains clear",
        text: "Pour boiling water down kitchen drains weekly to dissolve grease build-up. Once a month, pour half a cup of baking soda followed by half a cup of white vinegar. Let it fizz for 15 minutes, then flush with hot water.",
      },
    ],
  },
  {
    icon: "🚿",
    name: "Bathroom",
    tagline: "Spotless every day",
    color: "rgb(32, 32, 65)",
    tips: [
      {
        title: "Prevent mould before it starts",
        text: "After every shower, use a squeegee to remove water from tiles and the shower screen. Leave the bathroom door open or run an extractor fan for 20 minutes after bathing. Mould needs moisture — eliminate it and mould cannot grow.",
      },
      {
        title: "Shine your toilet without chemicals",
        text: "Sprinkle baking soda inside the bowl and add a cup of white vinegar. Let it fizz for 10 minutes, then scrub with a toilet brush. For the exterior, wipe with a diluted disinfectant spray and dry with a cloth.",
      },
      {
        title: "Remove soap scum from tiles",
        text: "Mix one part dish soap with two parts white vinegar in a spray bottle. Spray on tiles and shower screens, leave for 15 minutes, then scrub with a non-scratch sponge and rinse thoroughly. The soap scum dissolves without scratching.",
      },
      {
        title: "Keep grout bright",
        text: "Make a paste of baking soda and hydrogen peroxide. Apply to grout lines with an old toothbrush and scrub in circular motions. Leave for 10 minutes before rinsing. For maintenance, spray grout with white vinegar weekly.",
      },
      {
        title: "Clean your showerhead with a bag",
        text: "Fill a plastic bag with white vinegar, tie it around the showerhead so the head is submerged, and leave overnight. Remove the bag and run the shower for a minute. Limescale dissolves completely — no scrubbing needed.",
      },
    ],
  },
  {
    icon: "🛋️",
    name: "Living Room",
    tagline: "Fresh, dust-free spaces",
    color: "rgb(187, 19, 47)",
    tips: [
      {
        title: "Dust from top to bottom, always",
        text: "Always start dusting at the highest point in the room — ceiling fans, tops of shelves, picture frames — and work downward. This way, dust that falls lands on surfaces you haven't cleaned yet rather than ones you have.",
      },
      {
        title: "Vacuum sofas and cushions weekly",
        text: "Use the upholstery attachment on your vacuum to clean all sofa surfaces including the sides and back. Remove cushions and vacuum underneath them — crumbs and dust collect there. Flip reversible cushions each time for even wear.",
      },
      {
        title: "Remove pet hair with a rubber glove",
        text: "Dampen a rubber glove and run your hand over fabric surfaces. The static charge attracts pet hair and rolls it into easy-to-remove clumps. Far more effective than a lint roller on large surfaces like sofas and armchairs.",
      },
      {
        title: "Clean electronics without damage",
        text: "Use a dry microfibre cloth for screens — never spray liquid directly onto any electronic surface. For keyboards, turn them upside down and tap gently to dislodge debris, then use compressed air or a soft brush between the keys.",
      },
      {
        title: "Refresh rugs between washes",
        text: "Sprinkle baking soda generously over rugs and carpets, leave for 15–20 minutes, then vacuum thoroughly. The baking soda absorbs odours, leaving rugs smelling fresh without any chemicals or water.",
      },
    ],
  },
  {
    icon: "🛏️",
    name: "Bedroom",
    tagline: "Sleep in a clean sanctuary",
    color: "rgb(32, 32, 65)",
    tips: [
      {
        title: "Wash bedding on 60°C weekly",
        text: "Bedding accumulates sweat, dead skin cells, and dust mites within days. Washing at 60°C kills dust mites effectively. Use two sets and rotate them so bedding is always fresh while the other set is being washed or drying.",
      },
      {
        title: "Flip and rotate your mattress",
        text: "Rotate your mattress 180° every three months and flip it (if double-sided) every six months. This prevents body impressions from forming, extends the mattress life, and ensures a more even, supportive sleep surface.",
      },
      {
        title: "Declutter before you clean",
        text: "Before any bedroom clean, spend 5 minutes returning items to where they belong. Cleaning around clutter takes twice as long and results are half as good. A clear surface takes seconds to wipe; a cluttered one takes minutes.",
      },
      {
        title: "Vacuum under the bed monthly",
        text: "Dust bunnies accumulate rapidly under beds and can worsen allergies. Vacuum under the bed and behind bedside tables monthly. If the bed is low to the ground, use a flat vacuum head or a microfibre mop with a long handle.",
      },
      {
        title: "Air the room every morning",
        text: "Open windows for at least 10 minutes each morning. This flushes out carbon dioxide, moisture, and stale air from sleeping. Fold back the duvet to let the mattress breathe too — this dramatically reduces moisture and odour build-up.",
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: "🍋",
    tip: "Rub a cut lemon on a chopping board to remove stains and odours — no chemicals needed.",
  },
  {
    icon: "🧂",
    tip: "Pour salt on a wine spill immediately and leave for 5 minutes before blotting — it absorbs the liquid before it stains.",
  },
  {
    icon: "🪟",
    tip: "Clean windows on a cloudy day, not in direct sunlight — the sun dries the cleaner too fast and leaves streaks.",
  },
  {
    icon: "🧴",
    tip: "A drop of dish soap in your mop bucket cuts through floor grease far better than dedicated floor cleaners.",
  },
  {
    icon: "🎹",
    tip: "Use cotton ear buds dipped in white vinegar to clean keyboard gaps, tap crevices, and grout lines.",
  },
  {
    icon: "♨️",
    tip: "Run an empty dishwasher with a cup of white vinegar on the top rack monthly to remove limescale and odours.",
  },
  {
    icon: "🪴",
    tip: "Wipe dusty plant leaves with a damp cloth — clean leaves absorb light better and the plant grows healthier.",
  },
  {
    icon: "🛁",
    tip: "Shaving foam removes watermarks from mirrors and glass — spray, leave 30 seconds, wipe off with a dry cloth.",
  },
];

const SCHEDULE = [
  {
    freq: "Daily",
    color: "rgb(187, 19, 47)",
    tasks: [
      "Make the bed",
      "Wipe kitchen surfaces after cooking",
      "Wash dishes or load the dishwasher",
      "Sweep or spot-mop kitchen floor",
      "Wipe bathroom basin and mirror",
      "Empty small bins when full",
    ],
  },
  {
    freq: "Weekly",
    color: "rgb(32, 32, 65)",
    tasks: [
      "Vacuum all rooms",
      "Mop hard floors",
      "Clean toilet, shower, and bath",
      "Wash bedding",
      "Wipe skirting boards and light switches",
      "Wipe kitchen appliance fronts",
    ],
  },
  {
    freq: "Monthly",
    color: "rgb(187, 19, 47)",
    tasks: [
      "Deep-clean oven and hob",
      "Clean inside fridge",
      "Vacuum sofas and under furniture",
      "Descale taps and showerheads",
      "Wash windows inside and out",
      "Declutter one room or storage area",
    ],
  },
  {
    freq: "Seasonally",
    color: "rgb(32, 32, 65)",
    tasks: [
      "Flip and rotate mattress",
      "Clean curtains and blinds",
      "Wipe walls and ceiling corners",
      "Clean inside kitchen cabinets",
      "Clear gutters and exterior drains",
      "Service washing machine with cleaner",
    ],
  },
];

const PRODUCTS = [
  {
    name: "White Vinegar",
    uses: "Descaling, deodorising, cutting through grease",
    icon: "🍶",
    cost: "Very low",
  },
  {
    name: "Baking Soda",
    uses: "Scrubbing, odour absorption, stain removal",
    icon: "🥄",
    cost: "Very low",
  },
  {
    name: "Microfibre Cloths",
    uses: "Dusting, polishing, streak-free surface cleaning",
    icon: "🧹",
    cost: "Low",
  },
  {
    name: "Dish Soap",
    uses: "Degreasing surfaces, floors, upholstery pre-treatment",
    icon: "🧴",
    cost: "Very low",
  },
  {
    name: "Rubber Gloves",
    uses: "Hand protection, pet hair removal from fabric",
    icon: "🧤",
    cost: "Low",
  },
  {
    name: "Spray Bottle",
    uses: "Applying DIY cleaning solutions evenly",
    icon: "💦",
    cost: "Very low",
  },
];

export default function GeneralHousehold() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Kitchen");
  const [openTip, setOpenTip] = useState(null);

  const category = CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Home cleaning guide</p>
        <h1 className={styles.heroTitle}>
          Cleaning tips for
          <br />
          <em>every room.</em>
        </h1>
        <p className={styles.heroDesc}>
          Practical, professional-grade cleaning advice for Nigerian homes.
          Spend less time cleaning and live in a fresher, healthier space.
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
          ["⏱️", "Time-saving tricks"],
          ["💰", "Budget-friendly"],
          ["🏠", "All room types"],
          ["✅", "Expert-approved"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Room-by-room tips */}
      <div className={styles.section} id="tips-section">
        <p className={styles.sectionEyebrow}>Room-by-room guide</p>
        <h2 className={styles.sectionTitle}>
          Tips for every corner of your home
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

        {/* Active category header */}
        <div
          className={styles.catHeader}
          style={{ borderLeftColor: category.color }}
        >
          <span className={styles.catHeaderIcon}>{category.icon}</span>
          <div>
            <p className={styles.catHeaderName}>{category.name}</p>
            <p className={styles.catHeaderTagline}>{category.tagline}</p>
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
                  <div
                    className={styles.tipNum}
                    style={{ background: category.color }}
                  >
                    {i + 1}
                  </div>
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
          8 quick wins you can use today
        </h2>
        <p className={styles.quickWinsSub}>
          No specialist equipment, no expensive products — just clever tricks
          that actually work.
        </p>
        <div className={styles.quickWinsGrid}>
          {QUICK_WINS.map((w, i) => (
            <div key={i} className={styles.quickWinCard}>
              <span className={styles.quickWinIcon}>{w.icon}</span>
              <p className={styles.quickWinText}>{w.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cleaning schedule */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Stay on top of it</p>
        <h2 className={styles.sectionTitle}>Your complete cleaning schedule</h2>
        <div className={styles.scheduleGrid}>
          {SCHEDULE.map((s) => (
            <div key={s.freq} className={styles.scheduleCard}>
              <div
                className={styles.scheduleHeader}
                style={{ background: s.color }}
              >
                {s.freq}
              </div>
              <div className={styles.scheduleTasks}>
                {s.tasks.map((task) => (
                  <div key={task} className={styles.scheduleTask}>
                    <div
                      className={styles.scheduleCheck}
                      style={{ background: s.color }}
                    >
                      ✓
                    </div>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Essential products */}
      <div className={styles.products}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Your cleaning kit
        </p>
        <h2 className={styles.productsTitle}>
          6 essentials that do everything
        </h2>
        <p className={styles.productsSub}>
          You don't need a cupboard full of chemicals. These six items handle
          95% of every cleaning job in your home.
        </p>
        <div className={styles.productsGrid}>
          {PRODUCTS.map((p) => (
            <div key={p.name} className={styles.productCard}>
              <div className={styles.productIcon}>{p.icon}</div>
              <p className={styles.productName}>{p.name}</p>
              <p className={styles.productUses}>{p.uses}</p>
              <div className={styles.productCost}>
                <span className={styles.productCostLabel}>Cost: </span>
                {p.cost}
              </div>
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
          professional clean and come home to a spotless house — guaranteed.
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
