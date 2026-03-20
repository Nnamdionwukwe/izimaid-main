import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TipsAndTricks.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  "All",
  "Kitchen",
  "Bathroom",
  "Bedroom",
  "Living Room",
  "Laundry",
  "Outdoor",
  "Hacks",
];

const TIPS = [
  {
    id: 1,
    category: "Kitchen",
    categoryColor: "rgb(212, 100, 30)",
    icon: "🍳",
    title: "The 5-Minute Kitchen Reset That Actually Works",
    excerpt:
      "You don't need an hour to have a clean kitchen. This 5-step reset keeps counters clear, the sink empty, and your kitchen looking clean even on your busiest days.",
    featured: true,
    tricks: [
      {
        label: "Empty the sink first",
        detail:
          "A clean sink is the visual anchor of a clean kitchen. Do it first, every time.",
      },
      {
        label: "Wipe counters in one sweep",
        detail:
          "Use one damp microfibre cloth and wipe in a single left-to-right sweep. Never circular — you just move dirt around.",
      },
      {
        label: "Load the dishwasher or stack neatly",
        detail:
          "Dishes left 'to soak' always end up sitting for days. Wash or stack now.",
      },
      {
        label: "Wipe the hob after every cook",
        detail:
          "Grease hardens in 10 minutes. Wipe it warm and it takes 30 seconds.",
      },
      {
        label: "Sweep the floor last",
        detail:
          "Everything falls to the floor — sweep after wiping surfaces, not before.",
      },
    ],
  },
  {
    id: 2,
    category: "Kitchen",
    categoryColor: "rgb(212, 100, 30)",
    icon: "🧴",
    title: "Natural Kitchen Cleaners You Already Own",
    excerpt:
      "Baking soda, white vinegar, and lemon do 90% of what expensive kitchen sprays do — without the chemicals or the cost.",
    featured: false,
    tricks: [
      {
        label: "Grease cutter: dish soap + baking soda",
        detail:
          "Mix into a paste. Apply to hob, leave 2 minutes, wipe. Works on burnt-on grease.",
      },
      {
        label: "Drain freshener: baking soda + boiling water",
        detail:
          "Pour half a cup of baking soda down the drain followed by boiling water weekly.",
      },
      {
        label: "Microwave steam clean: water + lemon",
        detail:
          "Microwave a bowl of water with half a lemon for 3 minutes. Wipe interior easily.",
      },
      {
        label: "Fridge deodoriser: open baking soda box",
        detail:
          "Leave an open box of baking soda on a fridge shelf. Replace every 3 months.",
      },
    ],
  },
  {
    id: 3,
    category: "Bathroom",
    categoryColor: "rgb(32, 120, 200)",
    icon: "🚿",
    title: "How to Clean Your Bathroom in 10 Minutes Flat",
    excerpt:
      "The bathroom feels like a big job but it is not — if you clean in the right order. Here is the fastest route from dirty to done.",
    featured: true,
    tricks: [
      {
        label: "Spray everything first, clean second",
        detail:
          "Spray toilet, sink, shower, and tiles. Let the cleaner sit and do the work while you do other things.",
      },
      {
        label: "Toilet: inside, then outside, then seat",
        detail:
          "Use the brush inside, then wipe the cistern, body, and seat with a cloth. Always this order.",
      },
      {
        label: "Shine the taps last",
        detail:
          "Taps are the detail that makes a bathroom look professionally cleaned. Buff with a dry cloth.",
      },
      {
        label: "Squeegee the shower screen",
        detail:
          "30 seconds after every shower prevents 90% of shower cleaning effort.",
      },
      {
        label: "Mop the floor by walking backwards to the door",
        detail:
          "Never mop yourself into a corner. Start at the back, move to the exit.",
      },
    ],
  },
  {
    id: 4,
    category: "Bathroom",
    categoryColor: "rgb(32, 120, 200)",
    icon: "🧽",
    title: "Getting Rid of Limescale the Easy Way",
    excerpt:
      "Limescale builds up fast in Nigerian water. Here are the tricks that actually dissolve it without scrubbing for an hour.",
    featured: false,
    tricks: [
      {
        label: "Soak taps in white vinegar overnight",
        detail:
          "Wrap a cloth soaked in white vinegar around taps and secure with an elastic band. Leave overnight.",
      },
      {
        label: "Showerhead: vinegar bag trick",
        detail:
          "Fill a plastic bag with white vinegar, tie it around the showerhead. Leave for an hour. Rinse.",
      },
      {
        label: "Toilet ring: cola + brush",
        detail:
          "Pour cola under the rim, leave 30 minutes. The phosphoric acid dissolves limescale rings.",
      },
      {
        label: "Tiles: lemon juice + salt paste",
        detail:
          "Rub a paste of lemon juice and salt onto grout and tile scale. Leave 10 minutes, scrub, rinse.",
      },
    ],
  },
  {
    id: 5,
    category: "Bedroom",
    categoryColor: "rgb(120, 50, 180)",
    icon: "🛏️",
    title: "Making Your Bed the Professional Way",
    excerpt:
      "Hotel beds look perfect because of technique, not because of expensive linen. Here is the exact method — takes under 3 minutes once you know it.",
    featured: false,
    tricks: [
      {
        label: "Shake the duvet, don't smooth it",
        detail:
          "Grab the far corners and flap the duvet once vigorously. It resets the filling instantly.",
      },
      {
        label: "Tuck the bottom sheet tight at the corners",
        detail:
          "Hospital corners: fold a 45-degree triangle at each corner and tuck firmly.",
      },
      {
        label: "Pillows stand upright at the headboard",
        detail:
          "Stand pillows against the headboard. They look intentional and hold their shape all day.",
      },
      {
        label: "One decorative throw changes everything",
        detail:
          "Fold it across the bottom third of the bed. It hides any imperfection below.",
      },
    ],
  },
  {
    id: 6,
    category: "Bedroom",
    categoryColor: "rgb(120, 50, 180)",
    icon: "👗",
    title: "Declutter Your Wardrobe in 30 Minutes",
    excerpt:
      "Most wardrobes have 30% of clothes taking up 80% of the space — things that don't fit, don't suit, or haven't been worn in years. Here is the fastest way to find them.",
    featured: false,
    tricks: [
      {
        label: "The hanger trick for what you actually wear",
        detail:
          "Hang all clothes with the hanger facing backwards. After each wear, face it forward. In 6 months, everything still backwards goes.",
      },
      {
        label: "Fold by colour, not by type",
        detail:
          "Colour-grouped wardrobes feel larger and are faster to navigate than type-grouped ones.",
      },
      {
        label: "One in, one out rule",
        detail:
          "For every new item you bring in, one existing item must leave. Enforces its own discipline.",
      },
      {
        label: "Shoe boxes labelled on the end",
        detail:
          "Stack shoe boxes and label the short end facing outward. You can see every pair without opening boxes.",
      },
    ],
  },
  {
    id: 7,
    category: "Living Room",
    categoryColor: "rgb(18, 140, 80)",
    icon: "🛋️",
    title: "Vacuuming Tricks That Actually Pick Up Everything",
    excerpt:
      "Most people vacuum the wrong way and wonder why the floor never feels clean. These techniques double the effectiveness of any vacuum or broom.",
    featured: true,
    tricks: [
      {
        label: "Slow down — twice as slow as feels right",
        detail:
          "Fast vacuuming barely picks up anything. Slow passes give suction time to work.",
      },
      {
        label: "Vacuum in two directions at 90 degrees",
        detail:
          "First pass north-south, second pass east-west. Lifts embedded fibres both ways.",
      },
      {
        label: "Use the crevice tool along skirting boards",
        detail:
          "Most dirt lives in the 2cm gap between carpet/floor and wall. Always finish with the edge tool.",
      },
      {
        label: "Dust surfaces before you vacuum, not after",
        detail:
          "Dusting knocks particles to the floor. Vacuum those particles up, not before they've fallen.",
      },
    ],
  },
  {
    id: 8,
    category: "Living Room",
    categoryColor: "rgb(18, 140, 80)",
    icon: "🪴",
    title: "Cleaning Tricks for Sofas, Cushions, and Fabric",
    excerpt:
      "Fabric furniture holds dust, pet hair, and odours like nothing else. These tricks remove all three without a specialist clean.",
    featured: false,
    tricks: [
      {
        label: "Rubber glove pet hair remover",
        detail:
          "Dampen a rubber glove and run your hand along fabric. Hair clumps and lifts instantly.",
      },
      {
        label: "Baking soda odour treatment",
        detail:
          "Sprinkle baking soda over fabric, leave 20 minutes, vacuum up. Neutralises all odours.",
      },
      {
        label: "Ice for chewing gum removal",
        detail:
          "Place ice cubes on gum for 5 minutes. It hardens and lifts off cleanly without pulling fabric.",
      },
      {
        label: "Washing-up liquid for fabric stains",
        detail:
          "Blot — never rub — washing-up liquid into a fresh stain. Work from the outside inward to avoid spreading.",
      },
    ],
  },
  {
    id: 9,
    category: "Laundry",
    categoryColor: "rgb(180, 30, 140)",
    icon: "👕",
    title: "Laundry Mistakes Everyone Makes (and How to Fix Them)",
    excerpt:
      "Clothes fade, shrink, and lose shape because of avoidable laundry habits. Fix these five mistakes and your clothes will last twice as long.",
    featured: false,
    tricks: [
      {
        label: "Wash darks inside out",
        detail:
          "Friction during washing fades fabric on the outer surface. Inside-out protects colour.",
      },
      {
        label: "Don't overfill the machine",
        detail:
          "Clothes need room to move to get clean. A packed drum just agitates a solid block.",
      },
      {
        label: "Cold water for most things",
        detail:
          "Hot water sets stains and shrinks fabric. Cold water cleans almost everything just as well.",
      },
      {
        label: "Air-dry in shade, not direct sun",
        detail:
          "Direct Nigerian sun bleaches and weakens fabric fibres fast. Shade-dry to preserve colour and shape.",
      },
    ],
  },
  {
    id: 10,
    category: "Laundry",
    categoryColor: "rgb(180, 30, 140)",
    icon: "🧺",
    title: "Stain Removal: The Right Treatment for Every Type",
    excerpt:
      "Different stains need different treatments — using the wrong one sets the stain permanently. Here is your fast-reference guide.",
    featured: false,
    tricks: [
      {
        label: "Blood: cold water only, immediately",
        detail:
          "Hot water cooks protein and sets blood permanently. Cold water and immediate action removes it.",
      },
      {
        label: "Oil/grease: dish soap before washing",
        detail:
          "Apply dish soap directly, work in, let sit 5 minutes. Wash normally. Oil lifts completely.",
      },
      {
        label: "Ink: rubbing alcohol on a cloth",
        detail:
          "Dab — never rub — rubbing alcohol from the outside of the stain inward. Repeat until gone.",
      },
      {
        label: "Red wine: white wine or sparkling water immediately",
        detail:
          "Pour white wine or sparkling water to dilute. Blot. Avoid rubbing at all costs.",
      },
    ],
  },
  {
    id: 11,
    category: "Outdoor",
    categoryColor: "rgb(60, 130, 40)",
    icon: "🏡",
    title: "Balcony and Compound Cleaning That Lasts",
    excerpt:
      "Outdoor spaces get dirty faster than anywhere in the home. This routine keeps your balcony and compound looking clean week after week with minimal effort.",
    featured: false,
    tricks: [
      {
        label: "Sweep before you wash",
        detail:
          "Always dry-sweep first. Washing while debris is present spreads it into cracks and grout.",
      },
      {
        label: "Diluted bleach for mildew on tiles",
        detail:
          "Mix 1 part bleach to 10 parts water. Apply, leave 5 minutes, scrub, rinse thoroughly.",
      },
      {
        label: "Garden hose from top to bottom",
        detail:
          "Always rinse from the highest point down — walls, then tiles, then drainage. Never bottom-up.",
      },
      {
        label: "Prevent drain blockages proactively",
        detail:
          "Pour boiling water mixed with dish soap down balcony drains monthly to clear grease and debris.",
      },
    ],
  },
  {
    id: 12,
    category: "Hacks",
    categoryColor: "rgb(32, 32, 65)",
    icon: "⚡",
    title: "10 Cleaning Hacks That Sound Fake But Actually Work",
    excerpt:
      "These tricks feel too simple to be real — but every one of them is backed by the chemistry of what you are cleaning. Try one this week.",
    featured: true,
    tricks: [
      {
        label: "Toothpaste removes water rings from wood",
        detail:
          "Non-gel white toothpaste rubbed into a water ring with a cloth lifts it in minutes.",
      },
      {
        label: "Newspaper for streak-free glass",
        detail:
          "Crumpled newspaper instead of paper towels leaves glass perfectly streak-free every time.",
      },
      {
        label: "Dryer sheet removes burnt-on pan food",
        detail:
          "Place a dryer sheet in the pan with warm water. Leave overnight. Food slides off.",
      },
      {
        label: "Chalk absorbs grease stains before washing",
        detail:
          "Rub white chalk on a fresh grease stain. Leave 10 minutes. Brush off. Wash normally.",
      },
      {
        label: "Bread picks up broken glass safely",
        detail:
          "Press a thick slice of bread onto broken glass shards. It picks up every fragment safely.",
      },
    ],
  },
];

const TOOL_SWAPS = [
  {
    old: "Paper towels on glass",
    swap: "Crumpled newspaper",
    why: "Zero streaks, actually polishes",
  },
  {
    old: "Feather duster",
    swap: "Damp microfibre cloth",
    why: "Traps dust instead of spreading it",
  },
  {
    old: "Bleach on grout",
    swap: "Baking soda paste + old toothbrush",
    why: "Safer, works just as well",
  },
  {
    old: "Fabric softener on towels",
    swap: "White vinegar in rinse cycle",
    why: "Restores absorbency bleached out by softener",
  },
  {
    old: "Air freshener sprays",
    swap: "Open baking soda + lemon slices",
    why: "Neutralises odour, not just masks it",
  },
  {
    old: "Expensive oven cleaner",
    swap: "Baking soda + vinegar overnight",
    why: "Dissolves grease naturally by morning",
  },
];

export default function TipsAndTricks() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedTricks, setExpandedTricks] = useState({});

  const filtered =
    activeCategory === "All"
      ? TIPS
      : TIPS.filter((t) => t.category === activeCategory);

  const featured = filtered.filter((t) => t.featured);
  const regular = filtered.filter((t) => !t.featured);

  function toggleTricks(id) {
    setExpandedTricks((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Practically Spotless Blog</p>
        <h1 className={styles.heroTitle}>
          Tips & tricks for a
          <br />
          <em>cleaner home.</em>
        </h1>
        <p className={styles.heroDesc}>
          Practical, tested cleaning tips for every room — from 5-minute resets
          to deep-clean hacks that actually work. No fluff, no expensive
          products, just techniques that make a real difference.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => navigate("/maids")}
          >
            Book a Professional Clean
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("tips")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Browse Tips
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {[
          ["12", "Tip guides"],
          ["50+", "Individual tricks"],
          ["8", "Room categories"],
          ["Free", "Always"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* Tips section */}
      <div className={styles.section} id="tips">
        <p className={styles.sectionEyebrow}>Room by room</p>
        <h2 className={styles.sectionTitle}>Browse by category</h2>

        {/* Category filter */}
        <div className={styles.filterTabs}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`${styles.filterTab} ${activeCategory === c ? styles.filterTabActive : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <>
            <p className={styles.subLabel}>Featured</p>
            <div className={styles.featuredGrid}>
              {featured.map((t) => (
                <div key={t.id} className={styles.featuredCard}>
                  <div
                    className={styles.cardBanner}
                    style={{ background: t.categoryColor }}
                  />
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span
                        className={styles.cardTag}
                        style={{
                          color: t.categoryColor,
                          borderColor: t.categoryColor,
                        }}
                      >
                        {t.icon} {t.category}
                      </span>
                      <span className={styles.cardCount}>
                        {t.tricks.length} tricks
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{t.title}</h3>
                    <p className={styles.cardExcerpt}>{t.excerpt}</p>

                    <button
                      className={styles.toggleBtn}
                      onClick={() => toggleTricks(t.id)}
                    >
                      {expandedTricks[t.id] ? "Hide tricks ▴" : "Show tricks ▾"}
                    </button>

                    {expandedTricks[t.id] && (
                      <div className={styles.tricksList}>
                        {t.tricks.map((tr, i) => (
                          <div key={i} className={styles.trickItem}>
                            <div
                              className={styles.trickDot}
                              style={{ background: t.categoryColor }}
                            >
                              {i + 1}
                            </div>
                            <div>
                              <p className={styles.trickLabel}>{tr.label}</p>
                              <p className={styles.trickDetail}>{tr.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.cardFooter}>
                    <button
                      className={styles.bookBtn}
                      onClick={() => navigate("/maids")}
                    >
                      Book a Professional Clean
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Regular */}
        {regular.length > 0 && (
          <>
            <p
              className={styles.subLabel}
              style={{ marginTop: featured.length > 0 ? 32 : 0 }}
            >
              More tips
            </p>
            <div className={styles.regularGrid}>
              {regular.map((t) => (
                <div key={t.id} className={styles.regularCard}>
                  <div className={styles.regularTop}>
                    <div className={styles.cardMeta}>
                      <span
                        className={styles.cardTag}
                        style={{
                          color: t.categoryColor,
                          borderColor: t.categoryColor,
                        }}
                      >
                        {t.icon} {t.category}
                      </span>
                      <span className={styles.cardCount}>
                        {t.tricks.length} tricks
                      </span>
                    </div>
                    <h3 className={styles.regularTitle}>{t.title}</h3>
                    <p className={styles.regularExcerpt}>{t.excerpt}</p>
                  </div>

                  <button
                    className={styles.toggleBtnSm}
                    onClick={() => toggleTricks(t.id)}
                  >
                    {expandedTricks[t.id] ? "Hide tricks ▴" : "Show tricks ▾"}
                  </button>

                  {expandedTricks[t.id] && (
                    <div className={styles.tricksList}>
                      {t.tricks.map((tr, i) => (
                        <div key={i} className={styles.trickItem}>
                          <div
                            className={styles.trickDot}
                            style={{ background: t.categoryColor }}
                          >
                            {i + 1}
                          </div>
                          <div>
                            <p className={styles.trickLabel}>{tr.label}</p>
                            <p className={styles.trickDetail}>{tr.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Tool swaps */}
      <div className={styles.swaps}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Smart substitutions
        </p>
        <h2 className={styles.swapsTitle}>Tool swaps that work better</h2>
        <p className={styles.swapsSub}>
          Stop using these. Start using these instead. Better results, lower
          cost.
        </p>
        <div className={styles.swapGrid}>
          {TOOL_SWAPS.map((s) => (
            <div key={s.old} className={styles.swapCard}>
              <div className={styles.swapRow}>
                <div className={styles.swapOld}>
                  <span className={styles.swapX}>✕</span>
                  <span>{s.old}</span>
                </div>
                <span className={styles.swapArrow}>→</span>
                <div className={styles.swapNew}>
                  <span className={styles.swapCheck}>✓</span>
                  <span>{s.swap}</span>
                </div>
              </div>
              <p className={styles.swapWhy}>{s.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Want it done for you?</h2>
        <p className={styles.ctaText}>
          Our maids know every trick in this guide — and they bring their own
          supplies. Book a clean and come home to spotless.
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
