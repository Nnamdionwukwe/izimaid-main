import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SpringCleaning.module.css";
import FixedHeader from "../FixedHeader";

const PHASES = [
  {
    icon: "📦",
    name: "Declutter First",
    tagline: "Clear before you clean",
    color: "rgb(187, 19, 47)",
    tips: [
      {
        title: "Do every room before you clean any room",
        text: "The single biggest mistake in spring cleaning is starting to scrub while the house is still full of clutter. Complete your declutter pass through every room first — fill bags, make decisions, move items out — then begin cleaning into empty, clear spaces. Cleaning around clutter wastes time and produces poor results.",
      },
      {
        title: "Use the four-box method",
        text: "For every room, have four boxes or bags ready: Keep, Donate, Discard, and Relocate. Handle every item once and place it directly into one of the four. Don't create a 'maybe' pile — it becomes a permanent fixture. A decision made now prevents a longer session later.",
      },
      {
        title: "Start with storage, not open areas",
        text: "Most clutter originates from overfull storage — wardrobes that no longer close, drawers that jam, kitchen cabinets that avalanche. Begin in these spaces, not in the open living areas that look clean but are hiding their clutter in storage. Clearing storage first makes every subsequent step easier.",
      },
      {
        title: "Apply the 12-month rule",
        text: "If you haven't used, worn, or needed something in the past 12 months, it is clutter. This rule applies to clothes, kitchen equipment, toiletries, stationery, and decorative items. Exceptions exist — seasonal items and sentimental pieces — but the rule eliminates most of the deliberation that slows decluttering down.",
      },
    ],
  },
  {
    icon: "🧹",
    name: "Top to Bottom",
    tagline: "Work with gravity",
    color: "rgb(32, 32, 65)",
    tips: [
      {
        title: "Start at the ceiling, finish at the floor",
        text: "Always clean from the highest point in a room downward — ceiling fans, tops of wardrobes, light fittings, then shelves, then surfaces, then floors last. Dust and debris fall downward as you clean. If you vacuum the floor first and then dust the shelves, you are creating work twice. Top to bottom is the only order that makes logical sense.",
      },
      {
        title: "Clean ceiling fans before anything else",
        text: "A ceiling fan that hasn't been cleaned in months can deposit a thick layer of dust over an entire room in a single spin. Before you begin any room, wipe the ceiling fan blades with a damp microfibre cloth or use a purpose-made fan duster. Wrap each blade in the cloth and slide it off — this captures the dust rather than scattering it.",
      },
      {
        title: "Don't forget the tops of doors and door frames",
        text: "The top edges of interior doors and the horizontal surface of door frames collect dust year-round and are almost never cleaned in regular maintenance. During a spring clean, wipe these with a damp cloth before moving to lower surfaces. If you see black residue, this is a combination of dust and mould that needs disinfectant, not just a dry wipe.",
      },
      {
        title: "Walls before floors, always",
        text: "Spring cleaning is one of the few times you should wipe walls and painted surfaces. Use sugar soap or a diluted all-purpose cleaner and a damp cloth to remove finger marks, scuffs, and general grime. Work in sections from top to bottom. Any drips or splash marks will be collected in the final floor clean.",
      },
    ],
  },
  {
    icon: "🍳",
    name: "Kitchen Reset",
    tagline: "The most important room",
    color: "rgb(187, 19, 47)",
    tips: [
      {
        title: "Empty every cabinet before you wipe it",
        text: "The only way to truly spring-clean a kitchen is to empty every cabinet completely, wipe the interior with a damp cloth, check for expired items, and replace only what you are keeping. Half-measures — wiping around items — just move dust from one location to another. Empty, wipe, decide, replace.",
      },
      {
        title: "Deep-clean the oven overnight",
        text: "Apply a commercial oven cleaner to the oven interior last thing at night and leave it to work overnight. In the morning, the baked-on grease will wipe away with minimal effort. Clean the oven racks separately in the bath or a large container of hot water and dish soap. Attempting an oven deep-clean without an overnight soak is a frustrating, partially effective exercise.",
      },
      {
        title: "Descale everything at once",
        text: "Fill your kettle with equal parts water and white vinegar and boil it. Leave the solution for 30 minutes, discard, and boil with clean water twice. Simultaneously, wrap a vinegar-soaked cloth around every tap in the kitchen and leave for 30–60 minutes. Soak the showerhead in a bag of vinegar. Address all limescale in one session — the setup time is the same, the results are dramatically better.",
      },
      {
        title: "Clean the inside of the fridge last",
        text: "The fridge is the last kitchen item to tackle — after countertops, cabinets, appliances, and the floor — because food needs to be temporarily stored elsewhere during the clean. Remove every item, check expiry dates ruthlessly, wipe all shelves and drawers with a baking soda solution (1 tbsp per litre of warm water), and replace only what you are keeping. Place a box of baking soda inside to absorb odours.",
      },
    ],
  },
  {
    icon: "🛏️",
    name: "Bedroom Refresh",
    tagline: "Restore your sanctuary",
    color: "rgb(32, 32, 65)",
    tips: [
      {
        title: "Flip and rotate every mattress",
        text: "Spring is the ideal time to flip and rotate mattresses — once a year is the minimum for maintaining even support and extending mattress life. Vacuum the newly exposed surface before making the bed. For non-flippable mattresses, rotate 180° so the head end is at the foot. This one annual task significantly extends the useful life of a mattress.",
      },
      {
        title: "Wash everything textile in the bedroom",
        text: "Spring clean weekend is the time to wash items that are otherwise overlooked — pillows (check the care label), duvet (take to a laundrette if too large for your machine), mattress protector, curtains, and any decorative cushion covers. The volume of dust mite allergens embedded in bedroom textiles after a full year is substantial. A full textile wash makes a measurable difference to sleep quality.",
      },
      {
        title: "Sort your wardrobe by season",
        text: "As part of the bedroom spring clean, shift your wardrobe from winter to spring-summer configuration. Pack winter items into sealed storage bags or boxes — vacuum-seal bags maximise space and protect against moths and dust. Wash everything before storage, not after. Clean clothes store far better than worn ones and are ready to wear immediately when you retrieve them.",
      },
      {
        title: "Clean under and behind every piece of furniture",
        text: "The once-a-year spring clean is the time to actually move every wardrobe, chest of drawers, and bedside table. The dust accumulation behind and beneath bedroom furniture over 12 months is substantial and is continuously circulated by movement in the room. Vacuum thoroughly, mop hard floors, and replace furniture. The difference in air quality is immediate.",
      },
    ],
  },
  {
    icon: "🪟",
    name: "Windows & Light",
    tagline: "Let the brightness back in",
    color: "rgb(187, 19, 47)",
    tips: [
      {
        title: "Clean windows on a cloudy day",
        text: "This is not a myth. Cleaning windows in direct sunlight causes the cleaning solution to dry faster than you can wipe it, leaving streaks that require re-cleaning. Choose a cloudy, dry day or clean in the shade in the morning or late afternoon. A 50/50 mix of white vinegar and water in a spray bottle, followed by a microfibre cloth, produces streak-free results on most glass.",
      },
      {
        title: "Don't forget the window tracks",
        text: "Window tracks accumulate years of dust, dead insects, and debris and are rarely cleaned. Use a dry brush or old toothbrush to loosen debris in the tracks, vacuum the loose material, then wipe with a damp cloth. A cotton ear bud dipped in vinegar solution reaches the corners and seams that a cloth cannot access. Clean tracks improve the operation of the window and prevent the debris from blowing onto clean sills.",
      },
      {
        title: "Wipe all light fittings and shades",
        text: "Light fittings collect dust that, when lit, effectively projects a slightly dimmer, warmer light than the bulb is rated for. During a spring clean, turn off and allow all light fittings to cool, then wipe pendant shades with a damp cloth and use a dry microfibre cloth for any bulbs accessible without removing them. The improvement in light quality is noticeable.",
      },
      {
        title: "Clean curtains and wash or dust blinds",
        text: "Curtains should be washed or dry-cleaned at least annually — spring clean is the natural time. Check care labels carefully; many fabric curtains are machine washable on a gentle cycle. Roller blinds can be wiped in place with a damp cloth. Venetian blinds respond well to the cotton-glove method — wear cotton gloves and run your fingers along each slat, collecting the dust rather than distributing it.",
      },
    ],
  },
  {
    icon: "🛁",
    name: "Bathrooms Deep",
    tagline: "The full reset",
    color: "rgb(32, 32, 65)",
    tips: [
      {
        title: "Treat grout before anything else",
        text: "Spring clean is the time to address grout properly. Apply a specialist grout cleaner or a paste of baking soda and hydrogen peroxide to all grout lines, leave for 15–20 minutes, then scrub with a stiff brush or old toothbrush. For black mould in grout, use a mould-specific treatment — standard cleaners bleach the surface but do not kill the root. Rinse thoroughly and seal the grout once clean to prevent future penetration.",
      },
      {
        title: "Descale the toilet cistern",
        text: "The inside of the toilet cistern accumulates limescale, rust, and mineral deposits that affect flushing efficiency. Turn off the water supply, flush to empty the cistern, and wipe the interior with white vinegar and a cloth. For heavy limescale, leave undiluted vinegar in the cistern for 30–60 minutes before wiping. This is done once or twice a year at most and makes a genuine difference to toilet performance.",
      },
      {
        title: "Remove and soak the showerhead",
        text: "A showerhead that is clogged with limescale delivers reduced water pressure and uneven flow. Remove it (or tie a bag of undiluted white vinegar around it if fixed) and leave submerged for a minimum of 3 hours or overnight. Every blocked nozzle will clear. Scrub with an old toothbrush, rinse, and refit. This single task restores shower performance more than any other in the bathroom.",
      },
      {
        title: "Wash the shower curtain and bath mat",
        text: "Shower curtains are one of the highest-germ surfaces in the home and are often left unwashed for years. Most plastic and fabric shower curtains are machine washable — add two or three towels to the load to act as scrubbers and wash on a warm cycle with your usual detergent. Bath mats should be washed weekly in regular maintenance but if they have been neglected, spring clean is the time to assess whether they need replacing.",
      },
    ],
  },
];

const ROOM_ORDER = [
  {
    room: "Bedroom 1",
    reason: "Textiles, mattress flip, wardrobe sort — start where you sleep",
  },
  {
    room: "Bedroom 2 / Kids' Rooms",
    reason: "Declutter toys, wash bedding, clean under furniture",
  },
  { room: "Bathrooms", reason: "Grout treatment, descale, deep fixture clean" },
  {
    room: "Kitchen",
    reason: "Cabinet empty-and-wipe, oven clean, fridge reset",
  },
  { room: "Living Room", reason: "Sofa vacuum, shelf clear, window clean" },
  {
    room: "Storage & Utility Areas",
    reason: "Clear clutter, reorganise, dispose of expired items",
  },
  {
    room: "Windows, Lights & Outdoor",
    reason: "Final pass — light fittings, curtains, exterior areas",
  },
];

const SUPPLIES = [
  {
    icon: "🍶",
    item: "White vinegar (1L)",
    use: "Descaling, glass cleaning, disinfecting",
  },
  {
    icon: "🥄",
    item: "Baking soda (500g)",
    use: "Scrubbing, deodorising, grout paste",
  },
  { icon: "🧼", item: "Sugar soap", use: "Washing walls and painted surfaces" },
  {
    icon: "🧤",
    item: "Rubber gloves (2 pairs)",
    use: "One for kitchen, one for bathrooms",
  },
  {
    icon: "🧹",
    item: "Microfibre cloths (x6)",
    use: "Surfaces, glass, general wiping",
  },
  {
    icon: "💦",
    item: "Spray bottles (x2)",
    use: "Vinegar solution, all-purpose mix",
  },
  {
    icon: "🪣",
    item: "Two buckets",
    use: "Clean water and dirty water separation",
  },
  {
    icon: "🗑️",
    item: "Large bin bags (x10)",
    use: "Declutter — donate, discard, relocate",
  },
];

const TIPS = [
  "Block out a full weekend rather than trying to spring-clean in evenings — interrupted sessions lose momentum and the house spends days in a half-cleaned state.",
  "Start each day of the spring clean with a written list of exactly which rooms and tasks you will complete that day — vague intentions produce vague results.",
  "Open every window in the house for the entire duration of the spring clean — ventilation removes dust particles, chemical odours, and stale air as you work.",
  "Do one laundry load for every hour of cleaning — curtains, bedding, cushion covers, and bath mats all need washing and the machine can run continuously while you clean.",
  "Photograph each room before you start — the before and after comparison is motivating and documents any pre-existing damage for rental or insurance purposes.",
];

const FAQS = [
  {
    q: "How long does a full spring clean take?",
    a: "A thorough spring clean of a 2-bedroom home takes approximately 10–16 hours — typically a full weekend. A 3–4 bedroom home requires 16–24 hours. These times assume a house in regular maintenance. A home that has not been deeply cleaned for 12+ months will take longer. Planning for two full days and completing in one and a half is better than planning for one day and finishing nothing.",
  },
  {
    q: "What is the most important room to spring-clean?",
    a: "The kitchen. It is the highest-traffic room in the home, the most bacteria-laden, and the one where cleaning is most frequently limited to surface wiping. A kitchen that has been properly spring-cleaned — cabinets emptied, oven deep-cleaned, fridge reset, limescale addressed — transforms the daily experience of the entire home.",
  },
  {
    q: "Should I hire a professional for a spring clean?",
    a: "For the declutter and organisation stages, you are the only person who can make decisions about what to keep. For the actual deep cleaning — particularly kitchens, bathrooms, and oven cleans — a professional produces results in half the time with specialist products. The most effective approach is to declutter yourself and book a professional for the deep clean.",
  },
  {
    q: "How often should I do a full spring clean?",
    a: "Once a year is the minimum for a full spring clean. Many Nigerian households do two — one at the start of the year and one mid-year, often before a major family occasion or at the end of the rainy season. The key is that a spring clean resets the baseline standard that regular maintenance then sustains.",
  },
  {
    q: "What do I do with items I'm decluttering?",
    a: "Clothes and household items in good condition can be donated to charities, churches, or neighbours. Electronics should be disposed of responsibly — many manufacturers and retailers accept old devices. Items beyond use should be bagged and disposed of with your regular waste. Do not create a 'maybe' bag that re-enters the house — decisions made during a declutter must be acted on.",
  },
];

export default function SpringCleaning() {
  const navigate = useNavigate();
  const [activePhase, setActivePhase] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Annual home reset guide</p>
        <h1 className={styles.heroTitle}>
          Spring cleaning tips
          <br />
          <em>that actually work.</em>
        </h1>
        <p className={styles.heroDesc}>
          A complete room-by-room spring cleaning guide for Nigerian homes —
          from decluttering to deep cleaning every surface, fixture, and corner
          of your home.
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
                .getElementById("phases-section")
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
          ["🏠", "Every room covered"],
          ["📋", "Phase-by-phase guide"],
          ["🧴", "Natural product tips"],
          ["⏱️", "Time estimates included"],
          ["✅", "Expert-approved"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Phase-by-phase tips */}
      <div className={styles.section} id="phases-section">
        <p className={styles.sectionEyebrow}>Phase-by-phase guide</p>
        <h2 className={styles.sectionTitle}>
          Six phases for a complete spring clean
        </h2>
        <p className={styles.sectionDesc}>
          Select a phase to read the full tips. Work through them in order for
          the most efficient spring clean — each phase builds on the last.
        </p>

        {/* Phase selector */}
        <div className={styles.phaseSelector}>
          {PHASES.map((p, i) => (
            <button
              key={p.name}
              className={`${styles.phaseBtn} ${activePhase === i ? styles.phaseBtnActive : ""}`}
              style={
                activePhase === i
                  ? { borderColor: p.color, color: p.color }
                  : {}
              }
              onClick={() => setActivePhase(i)}
            >
              <span className={styles.phaseIcon}>{p.icon}</span>
              <div className={styles.phaseBtnText}>
                <span className={styles.phaseNum}>Phase {i + 1}</span>
                <span className={styles.phaseName}>{p.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Active phase tips */}
        <div className={styles.phaseContent}>
          <div
            className={styles.phaseHeader}
            style={{ borderLeftColor: PHASES[activePhase].color }}
          >
            <span className={styles.phaseHeaderIcon}>
              {PHASES[activePhase].icon}
            </span>
            <div>
              <p className={styles.phaseHeaderTitle}>
                Phase {activePhase + 1}: {PHASES[activePhase].name}
              </p>
              <p className={styles.phaseHeaderTagline}>
                {PHASES[activePhase].tagline}
              </p>
            </div>
          </div>

          <div className={styles.tipCards}>
            {PHASES[activePhase].tips.map((tip, i) => (
              <div
                key={tip.title}
                className={styles.tipCard}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={styles.tipCardTop}>
                  <div
                    className={styles.tipNum}
                    style={{ background: PHASES[activePhase].color }}
                  >
                    {i + 1}
                  </div>
                  <p className={styles.tipTitle}>{tip.title}</p>
                </div>
                <p className={styles.tipText}>{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room order */}
      <div className={styles.orderSection}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Where to start
        </p>
        <h2 className={styles.orderTitle}>The ideal room order</h2>
        <p className={styles.orderSub}>
          Spring-clean rooms in this sequence for the most efficient flow — each
          room feeds into the next.
        </p>
        <div className={styles.orderList}>
          {ROOM_ORDER.map((r, i) => (
            <div key={r.room} className={styles.orderItem}>
              <div className={styles.orderNum}>{i + 1}</div>
              <div className={styles.orderBody}>
                <p className={styles.orderRoom}>{r.room}</p>
                <p className={styles.orderReason}>{r.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supplies list */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>What you'll need</p>
        <h2 className={styles.sectionTitle}>
          8 supplies for a complete spring clean
        </h2>
        <p className={styles.sectionDesc}>
          Everything below is affordable, widely available, and handles the vast
          majority of spring-cleaning tasks without specialist chemicals.
        </p>
        <div className={styles.suppliesGrid}>
          {SUPPLIES.map((s, i) => (
            <div
              key={s.item}
              className={styles.supplyCard}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={styles.supplyIcon}>{s.icon}</div>
              <p className={styles.supplyItem}>{s.item}</p>
              <p className={styles.supplyUse}>{s.use}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips banner */}
      <div className={styles.tipsBanner}>
        <div className={styles.tipsBannerHeader}>
          <span className={styles.tipsHeaderIcon}>💡</span>
          <p className={styles.tipsHeaderTitle}>
            Tips for making your spring clean actually happen
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
          Rather let the professionals handle it?
        </h2>
        <p className={styles.ctaText}>
          Book a professional spring clean and hand the entire deep-cleaning
          phase to our vetted maids. You declutter — we do the rest.
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
