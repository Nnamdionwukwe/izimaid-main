import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Seasonal.module.css";
import FixedHeader from "../FixedHeader";

const SEASONS = [
  "All",
  "Harmattan",
  "Rainy Season",
  "Dry Season",
  "Year-Round",
];

const ARTICLES = [
  {
    id: 1,
    season: "Harmattan",
    seasonColor: "rgb(212, 140, 30)",
    tag: "Harmattan",
    title:
      "The Harmattan Dust Guide: How to Keep Your Home Clean When the Dust Never Stops",
    excerpt:
      "Harmattan season brings relentless red dust through every crack and gap. Here is a room-by-room strategy for staying on top of it without cleaning your home three times a day.",
    readTime: "6 min read",
    tips: [
      "Seal window gaps with foam strips before harmattan peaks in November",
      "Switch to microfibre cloths — they trap dust instead of spreading it",
      "Wipe down surfaces daily with a slightly damp cloth, not a dry one",
      "Use a HEPA-filter fan or air purifier in bedrooms",
    ],
    featured: true,
  },
  {
    id: 2,
    season: "Harmattan",
    seasonColor: "rgb(212, 140, 30)",
    tag: "Harmattan",
    title: "Protecting Your Furniture and Electronics During Harmattan",
    excerpt:
      "Fine dust gets inside everything — speakers, keyboards, air vents, fabric sofas. A few preventive steps in October can save you expensive repairs by January.",
    readTime: "5 min read",
    tips: [
      "Cover speakers and TV screens with light fabric when not in use",
      "Clean keyboard and laptop vents with compressed air monthly",
      "Apply wood conditioner to wooden furniture to prevent cracking",
      "Wash sofa covers every two weeks during peak harmattan",
    ],
    featured: false,
  },
  {
    id: 3,
    season: "Harmattan",
    seasonColor: "rgb(212, 140, 30)",
    tag: "Harmattan",
    title: "Harmattan Skin and Home: Moisture is Your Best Friend",
    excerpt:
      "The same dry air that cracks your lips also dries out your wooden floors, plaster walls, and fabric furnishings. Here is how to add moisture back into your home naturally.",
    readTime: "4 min read",
    tips: [
      "Place bowls of water near radiators or hot areas to humidify rooms",
      "Mop floors with a lightly damp mop rather than a dry one",
      "Use a door mat at every entrance — most dust walks in on feet",
      "Wipe skirting boards weekly; they collect the most settled dust",
    ],
    featured: false,
  },
  {
    id: 4,
    season: "Rainy Season",
    seasonColor: "rgb(32, 120, 200)",
    tag: "Rainy Season",
    title: "Rainy Season Cleaning: Mud, Mould, and the Smell of Damp — Handled",
    excerpt:
      "The rains bring mud into your hallways, damp into your walls, and mould behind your furniture. This guide covers everything you need before, during, and after the wet season.",
    readTime: "7 min read",
    tips: [
      "Place heavy-duty door mats at all entrances before the first rains",
      "Check bathroom grout for mould growth every fortnight",
      "Run fans or open windows daily to prevent indoor humidity build-up",
      "Inspect under sinks and behind washing machines for damp patches",
    ],
    featured: true,
  },
  {
    id: 5,
    season: "Rainy Season",
    seasonColor: "rgb(32, 120, 200)",
    tag: "Rainy Season",
    title: "How to Prevent and Remove Mould in a Nigerian Home",
    excerpt:
      "Mould grows fast in hot, humid conditions. It is not just unsightly — it is a health hazard. Here is how to stop it forming, and what to do if it is already there.",
    readTime: "6 min read",
    tips: [
      "Mix white vinegar and water in a spray bottle for natural mould removal",
      "Never paint over mould — treat the root cause first",
      "Check the back of wardrobes against external walls every month",
      "Ensure your kitchen and bathroom extractor fans are working properly",
    ],
    featured: false,
  },
  {
    id: 6,
    season: "Rainy Season",
    seasonColor: "rgb(32, 120, 200)",
    tag: "Rainy Season",
    title: "Keeping Your Floors Clean When It Rains Every Day",
    excerpt:
      "Muddy shoes, wet umbrellas, and dripping bags — rainy season is brutal on floors. This routine will keep your tiles, hardwood, and rugs looking clean despite the weather.",
    readTime: "4 min read",
    tips: [
      "Create a shoe-removal zone at your front door with a boot tray",
      "Mop tile floors with a disinfectant solution twice a week",
      "Lift rugs and mats to dry them fully every few days",
      "Use a squeegee on bathroom floors after every shower to reduce mould",
    ],
    featured: false,
  },
  {
    id: 7,
    season: "Dry Season",
    seasonColor: "rgb(187, 19, 47)",
    tag: "Dry Season",
    title: "The Dry Season Deep Clean: Your Annual Home Reset Guide",
    excerpt:
      "When the rains stop and the air clears, it is the perfect time for a full home reset. This is your room-by-room deep clean checklist for the dry season.",
    readTime: "8 min read",
    tips: [
      "Start from top to bottom — ceiling fans, then shelves, then floors",
      "Pull all furniture away from walls and clean behind and underneath",
      "Wash curtains, cushion covers, and bedding on the same day",
      "Descale taps, showerheads, and kettle — limescale builds over the wet season",
    ],
    featured: true,
  },
  {
    id: 8,
    season: "Dry Season",
    seasonColor: "rgb(187, 19, 47)",
    tag: "Dry Season",
    title: "Outdoor and Balcony Cleaning for the Dry Season",
    excerpt:
      "Finally — weather dry enough to tackle the balcony, compound, and outdoor furniture. Here is how to get your outdoor spaces looking their best before the heat peaks.",
    readTime: "5 min read",
    tips: [
      "Sweep and mop balcony tiles with a diluted bleach solution",
      "Clean outdoor furniture with warm soapy water and a stiff brush",
      "Check for and clear blocked drainage channels and gutters",
      "Wash window exteriors while the weather is calm and dry",
    ],
    featured: false,
  },
  {
    id: 9,
    season: "Year-Round",
    seasonColor: "rgb(32, 32, 65)",
    tag: "Year-Round",
    title: "The 15-Minute Daily Clean That Works in Any Season",
    excerpt:
      "Regardless of harmattan, rain, or dry heat — this daily 15-minute routine will keep your home consistently clean without it ever feeling like a chore.",
    readTime: "4 min read",
    tips: [
      "Wipe the kitchen counter and hob every evening after cooking",
      "Do one load of laundry every other day rather than a weekly mountain",
      "Spend 5 minutes tidying surfaces before bed — it changes everything",
      "Empty bins before they overflow rather than waiting until full",
    ],
    featured: false,
  },
  {
    id: 10,
    season: "Year-Round",
    seasonColor: "rgb(32, 32, 65)",
    tag: "Year-Round",
    title: "Eco-Friendly Cleaning Products You Can Make at Home in Nigeria",
    excerpt:
      "Shop-bought cleaners are expensive and full of chemicals. These simple homemade alternatives work just as well — and many of the ingredients are already in your kitchen.",
    readTime: "5 min read",
    tips: [
      "White vinegar + water: all-purpose surface spray",
      "Baking soda + lemon juice: sink and grout scrub",
      "Coconut oil + lemon: natural wood polish",
      "Bicarbonate of soda: fridge and bin deodoriser",
    ],
    featured: true,
  },
];

const SEASONAL_CALENDAR = [
  {
    month: "Oct – Jan",
    season: "Harmattan",
    icon: "🌬️",
    focus: "Dust control, furniture protection, sealing gaps",
  },
  {
    month: "Apr – Jul",
    season: "Rainy Season",
    icon: "🌧️",
    focus: "Mould prevention, floor care, damp management",
  },
  {
    month: "Nov – Mar",
    season: "Dry Season",
    icon: "☀️",
    focus: "Deep cleaning, outdoor spaces, annual reset",
  },
  {
    month: "All year",
    season: "Year-Round",
    icon: "🏠",
    focus: "Daily routines, eco products, maintenance cleans",
  },
];

const QUICK_TIPS = [
  {
    icon: "🧂",
    tip: "Pour salt down your drain weekly to prevent blockages and odours",
  },
  {
    icon: "🍋",
    tip: "Half a lemon cleans and deodorises your microwave in 5 minutes",
  },
  {
    icon: "🪣",
    tip: "Change your mop water every room — dirty water just spreads dirt",
  },
  {
    icon: "🧴",
    tip: "Spray cleaner and leave it 30 seconds before wiping — it works harder",
  },
  {
    icon: "🌬️",
    tip: "Open windows for 10 minutes every morning to reduce indoor humidity",
  },
  {
    icon: "🛁",
    tip: "Sprinkle baking soda in your toilet and leave overnight to remove stains",
  },
];

export default function Seasonal() {
  const navigate = useNavigate();
  const [activeSeason, setActiveSeason] = useState("All");
  const [expandedTips, setExpandedTips] = useState({});

  const filtered =
    activeSeason === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.season === activeSeason);

  const featured = filtered.filter((a) => a.featured);
  const regular = filtered.filter((a) => !a.featured);

  function toggleTips(id) {
    setExpandedTips((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Practically Spotless Blog</p>
        <h1 className={styles.heroTitle}>
          Seasonal cleaning
          <br />
          <em>made simple.</em>
        </h1>
        <p className={styles.heroDesc}>
          Nigeria's seasons are tough on your home. Harmattan dust, rainy season
          mould, dry season grime — each brings its own challenges. This is your
          practical, no-nonsense guide to staying ahead of all of them.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => navigate("/maids")}
          >
            Book a Seasonal Clean
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("articles")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Read the Blog
          </button>
        </div>
      </div>

      {/* Seasonal calendar */}
      <div className={styles.calendarBar}>
        {SEASONAL_CALENDAR.map((c) => (
          <div key={c.season} className={styles.calendarItem}>
            <span className={styles.calendarIcon}>{c.icon}</span>
            <div>
              <p className={styles.calendarSeason}>{c.season}</p>
              <p className={styles.calendarMonth}>{c.month}</p>
              <p className={styles.calendarFocus}>{c.focus}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Articles */}
      <div className={styles.section} id="articles">
        <p className={styles.sectionEyebrow}>Seasonal guides</p>
        <h2 className={styles.sectionTitle}>Browse by season</h2>

        {/* Season filter tabs */}
        <div className={styles.filterTabs}>
          {SEASONS.map((s) => (
            <button
              key={s}
              className={`${styles.filterTab} ${activeSeason === s ? styles.filterTabActive : ""}`}
              onClick={() => setActiveSeason(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Featured articles */}
        {featured.length > 0 && (
          <>
            <p className={styles.subLabel}>Featured</p>
            <div className={styles.featuredGrid}>
              {featured.map((a) => (
                <div key={a.id} className={styles.featuredCard}>
                  <div
                    className={styles.featuredBanner}
                    style={{ background: a.seasonColor }}
                  />
                  <div className={styles.featuredBody}>
                    <div className={styles.articleMeta}>
                      <span
                        className={styles.articleTag}
                        style={{
                          color: a.seasonColor,
                          borderColor: a.seasonColor,
                        }}
                      >
                        {a.tag}
                      </span>
                      <span className={styles.articleRead}>{a.readTime}</span>
                    </div>
                    <h3 className={styles.articleTitle}>{a.title}</h3>
                    <p className={styles.articleExcerpt}>{a.excerpt}</p>

                    <button
                      className={styles.tipsToggle}
                      onClick={() => toggleTips(a.id)}
                    >
                      {expandedTips[a.id] ? "Hide tips ▴" : "Show key tips ▾"}
                    </button>

                    {expandedTips[a.id] && (
                      <div className={styles.tipsList}>
                        {a.tips.map((tip, i) => (
                          <div key={i} className={styles.tipItem}>
                            <div
                              className={styles.tipDot}
                              style={{ background: a.seasonColor }}
                            >
                              ✓
                            </div>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.articleFooter}>
                    <button
                      className={styles.bookBtn}
                      onClick={() => navigate("/maids")}
                    >
                      Book a Clean
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Regular articles */}
        {regular.length > 0 && (
          <>
            <p
              className={styles.subLabel}
              style={{ marginTop: featured.length > 0 ? 32 : 0 }}
            >
              More articles
            </p>
            <div className={styles.articleGrid}>
              {regular.map((a) => (
                <div key={a.id} className={styles.articleCard}>
                  <div className={styles.articleCardTop}>
                    <div className={styles.articleMeta}>
                      <span
                        className={styles.articleTag}
                        style={{
                          color: a.seasonColor,
                          borderColor: a.seasonColor,
                        }}
                      >
                        {a.tag}
                      </span>
                      <span className={styles.articleRead}>{a.readTime}</span>
                    </div>
                    <h3 className={styles.articleTitleSm}>{a.title}</h3>
                    <p className={styles.articleExcerptSm}>{a.excerpt}</p>
                  </div>

                  <button
                    className={styles.tipsToggleSm}
                    onClick={() => toggleTips(a.id)}
                  >
                    {expandedTips[a.id] ? "Hide tips ▴" : "Key tips ▾"}
                  </button>

                  {expandedTips[a.id] && (
                    <div className={styles.tipsList}>
                      {a.tips.map((tip, i) => (
                        <div key={i} className={styles.tipItem}>
                          <div
                            className={styles.tipDot}
                            style={{ background: a.seasonColor }}
                          >
                            ✓
                          </div>
                          <span>{tip}</span>
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

      {/* Quick tips strip */}
      <div className={styles.quickTips}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Quick wins
        </p>
        <h2 className={styles.quickTipsTitle}>
          6 tips that work in every season
        </h2>
        <div className={styles.quickTipsGrid}>
          {QUICK_TIPS.map((t) => (
            <div key={t.tip} className={styles.quickTipCard}>
              <span className={styles.quickTipEmoji}>{t.icon}</span>
              <p className={styles.quickTipText}>{t.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Let the professionals handle it.</h2>
        <p className={styles.ctaText}>
          Reading the guide is step one. Booking a maid is step two. Leave the
          seasonal deep clean to us — you focus on everything else.
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
