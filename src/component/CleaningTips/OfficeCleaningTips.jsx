import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Kitchens.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  {
    icon: "🖥️",
    name: "Workstations",
    tagline: "The highest-touch, highest-germ surface in the office",
    tips: [
      {
        title: "Wipe your desk surface daily with a disinfectant cloth",
        text: "The average office desk carries 400 times more bacteria than a toilet seat — primarily because it is touched constantly but rarely cleaned. Wipe the entire desk surface daily with a disinfectant wipe or spray, including the area under the monitor, the edges of the desk, and the desk mat. This daily habit prevents the bacterial build-up that causes illness in office environments.",
      },
      {
        title: "Clean your keyboard and mouse weekly",
        text: "Turn the keyboard upside down and tap firmly to dislodge crumbs and debris. Use compressed air between the keys. Wipe the key surfaces with an antibacterial wipe, paying attention to the most-used keys (QWERTY row, spacebar, enter). Clean the mouse entirely — including the underside sensor area and the scroll wheel — with a wipe. Keyboards and mice are the most bacteria-laden items on any desk and are cleaned by the fewest people.",
      },
      {
        title: "Disinfect your phone handset and headset weekly",
        text: "Telephone handsets and headsets are pressed against the mouth and ear repeatedly throughout the day. Spray an antibacterial solution onto a cloth (never directly onto the handset — liquid damages the electronics) and wipe the earpiece, mouthpiece, and body thoroughly. If shared between users, this should happen between each user and at the end of every day. Shared phones are one of the fastest vectors for respiratory illness in offices.",
      },
      {
        title: "Clean monitor screens with a dry microfibre cloth only",
        text: "Monitor screens should only be wiped with a dry or very slightly damp microfibre cloth — never with paper towels, which scratch the anti-glare coating, and never with glass cleaner or alcohol sprays, which permanently damage the screen surface. Wipe in smooth horizontal strokes rather than circular motions. Clean screens improve visual clarity and reduce eye strain during long working sessions.",
      },
      {
        title: "Organise cables and wipe under equipment monthly",
        text: "Cable buildup under desks and behind monitors accumulates dust that reduces airflow and causes electronics to run hot. Bundle cables with cable ties or a cable management sleeve. Once a month, move all desk equipment, vacuum the desk surface thoroughly, and wipe with a damp cloth before replacing items. Clean, organised cable runs also reduce the electromagnetic interference that degrades network signal quality.",
      },
    ],
  },
  {
    icon: "🚽",
    name: "Office Bathrooms",
    tagline: "High footfall demands higher frequency",
    tips: [
      {
        title: "Clean office bathrooms at minimum twice daily",
        text: "Unlike a home bathroom used by two to four people, an office bathroom may be used by 20 or more people. The cleaning frequency must reflect this. A morning clean before staff arrive and a midday clean during or after lunch are the minimum for offices with 10 or more staff. Larger offices or those with high visitor footfall should clean three times daily. High-frequency cleaning is not optional — it is a hygiene and compliance requirement.",
      },
      {
        title: "Disinfect all touch points every clean session",
        text: "The highest-risk surfaces in an office bathroom are not the toilet — they are the door handle, door lock, tap handles, paper towel dispenser, and soap dispenser. These are touched by every user, often after toilet use and before handwashing is complete. Every cleaning session must include a targeted disinfectant wipe of all of these surfaces. Spraying a toilet and calling the bathroom clean while leaving the door handle untouched is insufficient.",
      },
      {
        title: "Stock soap, paper towels, and toilet paper proactively",
        text: "Running out of soap or paper towels in an office bathroom creates a hygiene emergency — staff who cannot wash and dry hands properly carry contamination back to their desks and communal areas. Check and restock consumables every cleaning session. Keep a minimum of two spare rolls per cubicle and one spare soap dispenser refill per sink. The cost of consumable stock is negligible compared to illness-related staff absence.",
      },
      {
        title: "Clean grout and tile surfaces weekly with a specialist cleaner",
        text: "Office bathroom tiles and grout are exposed to significantly more moisture and traffic than domestic equivalents and deteriorate faster without weekly attention. Apply a mould-inhibiting tile cleaner to grout lines weekly, scrub with a stiff brush, and rinse. This prevents the mould growth that requires professional remediation if left for months. A visibly clean bathroom also affects how clients and visitors perceive your business.",
      },
      {
        title: "Empty bins after every session — never wait until full",
        text: "Office bathroom bins fill faster than any other bin in a building. An overflowing bathroom bin is both a hygiene risk and an immediate negative impression for any visitor. Empty bins at every cleaning session regardless of how full they appear, replace the bin liner, and wipe the interior of the bin with a disinfectant spray. Bins should never reach more than two-thirds full before being changed.",
      },
    ],
  },
  {
    icon: "🍽️",
    name: "Kitchen & Breakroom",
    tagline: "The most bacteria-dense shared space",
    tips: [
      {
        title: "Establish a clean-as-you-go culture — and enforce it",
        text: "Office kitchen culture determines hygiene standards more than any cleaning schedule. A kitchen where staff leave dishes in the sink, spill coffee on the counter, and return food containers to the fridge unlabelled will deteriorate faster than any cleaner can manage. Post a clear set of kitchen rules in a visible location. Designate a daily 'kitchen duty' rotation. When behaviour changes, the cleaner's job becomes achievable instead of Sisyphean.",
      },
      {
        title: "Clean the fridge out completely every Friday",
        text: "Office fridges accumulate forgotten food containers, expired items, and unlabelled leftovers at a rate that creates odour and bacterial contamination within days. Every Friday afternoon, remove everything from the fridge, discard anything unlabelled or past its date, wipe all shelves with a baking soda solution, and replace only current, labelled items. Monday morning should begin with a clean, fresh-smelling fridge — this has a measurable effect on staff satisfaction.",
      },
      {
        title: "Descale the coffee machine and kettle weekly",
        text: "Coffee machines and kettles in offices operate at a frequency — dozens of uses per day — that builds limescale rapidly. Limescale deposits alter the taste of coffee and water, reduce heating efficiency, and shorten appliance lifespan. Descale using a commercial descaling tablet or a 50/50 white vinegar and water solution weekly. Wipe the external surfaces of the machine daily — the drip tray and handle area are particularly prone to residue buildup.",
      },
      {
        title: "Clean the microwave interior after every use",
        text: "Office microwaves are used many more times per day than domestic ones, with a much wider variety of food types — increasing the frequency of splatter and the bacterial contamination risk from food residue. Post a sign above the microwave requesting users to cover food and wipe after use. During each cleaning session, remove the turntable, wash it in the sink, wipe the interior walls and roof with a disinfectant cloth, and replace.",
      },
      {
        title: "Wipe communal tables and surfaces between uses",
        text: "Breakroom and lunchroom tables accumulate food particles, liquid rings, and hand contact contamination from multiple users throughout the day. A spray bottle of diluted disinfectant and a cloth roll should be permanently accessible on or near the table. Tables should be wiped between each user — not just during the morning clean. This is particularly important for offices where the same breakroom tables are used for client meetings.",
      },
    ],
  },
  {
    icon: "🌫️",
    name: "Air Quality & Ventilation",
    tagline: "What you breathe affects how you perform",
    tips: [
      {
        title: "Clean air vents and grilles monthly",
        text: "HVAC vents and air conditioning grilles accumulate dust that is then distributed through the office air supply. Dust on vents reduces airflow, increases energy consumption, and contributes to the particulate load in the air that occupants breathe. Remove vent covers monthly and vacuum the grille and the duct opening behind it. Wipe the cover with a damp cloth before replacing. An office with clean vents has measurably better air quality.",
      },
      {
        title: "Replace or clean air filters on the recommended schedule",
        text: "Air conditioning and HVAC filters capture dust, pollen, mould spores, and bacteria from the air circulating through the building. A filter operating beyond its replacement date passes these particles back into the office rather than capturing them. Check the manufacturer's recommended replacement interval — typically 1–3 months depending on filter type and usage intensity. In offices with high occupancy or in dusty environments, replace more frequently.",
      },
      {
        title: "Open windows for at least 10 minutes daily",
        text: "Recirculated office air accumulates CO2, VOCs from furniture and cleaning products, and biological contamination from occupants throughout the working day. The simplest and most effective ventilation strategy is opening windows for a minimum of 10 minutes, ideally during a period when occupancy is low. Research consistently shows improved cognitive performance — focus, decision-making, and response time — in better-ventilated offices.",
      },
      {
        title: "Place air-purifying plants in high-traffic areas",
        text: "Certain plants measurably reduce indoor air pollutants — spider plants, peace lilies, snake plants, and pothos remove benzene, formaldehyde, and VOCs from the air. Place one plant per approximately 10 square metres of office space in areas with high occupancy and low natural ventilation. Plants also reduce psychological stress in workplace environments, with research showing a 15% improvement in productivity in plant-containing offices.",
      },
      {
        title: "Use fragrance-free cleaning products in enclosed spaces",
        text: "Many commercial cleaning products contain synthetic fragrances that leave chemical residues in enclosed office air long after the cleaner has left. These VOCs cause headaches, respiratory irritation, and reduced air quality. Switch to fragrance-free or certified low-VOC cleaning products for all office cleaning tasks. If the office smells strongly of cleaning product the morning after cleaning, the product contains chemicals that should not be inhaled during the working day.",
      },
    ],
  },
  {
    icon: "🏢",
    name: "Common Areas & Floors",
    tagline: "First impressions and footfall management",
    tips: [
      {
        title: "Vacuum carpeted areas daily and deep-clean quarterly",
        text: "Office carpets in high-traffic areas accumulate dust, particulate matter, and biological contamination at a rate that requires daily vacuuming to manage. Use a commercial-grade vacuum with a HEPA filter — domestic vacuums do not have sufficient suction for commercial carpet pile. Schedule a professional hot-water extraction carpet clean quarterly. Carpets that are not deep-cleaned regularly emit particles into the office air as they are walked on.",
      },
      {
        title: "Mop hard floors with the two-bucket method",
        text: "Single-bucket mopping spreads increasingly dirty water across an already-cleaned floor. Use two buckets — one with cleaning solution, one with clean rinse water — and wring into the dirty bucket, rinse in clean water, load from the clean bucket. This ensures the floor you finish is as clean as the floor you started on. Hard office floors should be mopped at minimum daily in reception and kitchen areas, and three times weekly in other zones.",
      },
      {
        title: "Place entrance matting at all external door thresholds",
        text: "Research shows that 80% of indoor dirt enters through doorways. Quality entrance matting traps particulates before they enter the building — reducing floor cleaning frequency, protecting carpet pile, and improving indoor air quality. Mats should be long enough for two full strides (a minimum of 1.5 metres) to be effective. Clean entrance mats twice weekly — a dirty mat re-deposits what it has captured every time it is walked on.",
      },
      {
        title: "Clean glass partitions and doors weekly",
        text: "Glass partitions and doors in modern offices accumulate fingerprints and smearing that degrade the visual environment significantly faster than solid surfaces. Use a glass cleaner and lint-free cloth or squeegee, working top to bottom in a single direction. In client-facing reception areas, glass should be cleaned daily. In internal areas, weekly is sufficient. Clean glass partitions make an office feel professionally maintained regardless of the state of other surfaces.",
      },
      {
        title: "Disinfect lifts and staircases daily — handles especially",
        text: "Lifts, staircase handrails, and communal door handles in multi-floor offices are among the highest-touch surfaces in any building and are touched by nearly every person in the building at some point during the day. Disinfect lift buttons (especially ground floor and most common destinations), handrails, and door handles as the first task of every cleaning session. These surfaces are the primary transmission vectors for illness across an entire building.",
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: "🖥️",
    time: "30 sec",
    tip: "Keep a pack of antibacterial wipes in your desk drawer and wipe your keyboard at the start of each day.",
  },
  {
    icon: "🗑️",
    time: "1 min",
    tip: "Empty your desk bin every evening — it takes 60 seconds and prevents the odour that accumulates from overnight decomposition.",
  },
  {
    icon: "💨",
    time: "2 min",
    tip: "Open the office windows for 10 minutes first thing in the morning to flush out overnight accumulated CO2 and stale air.",
  },
  {
    icon: "☕",
    time: "30 sec",
    tip: "Wipe the coffee machine drip tray and surrounding area immediately after use — dried coffee residue is far harder to remove.",
  },
  {
    icon: "📱",
    time: "1 min",
    tip: "Wipe your desk phone handset with an antibacterial wipe at the end of every call day — it is the most bacteria-dense object on any desk.",
  },
  {
    icon: "🧴",
    time: "30 sec",
    tip: "Refill the hand soap dispenser before it runs out completely — an empty dispenser breaks the handwashing habit immediately.",
  },
  {
    icon: "🌿",
    time: "1 min",
    tip: "Wipe dust off office plants' leaves monthly — dusty leaves reduce photosynthesis and the plant's air-purifying effectiveness.",
  },
  {
    icon: "🚪",
    time: "30 sec",
    tip: "Wipe the office entrance door handle with a disinfectant wipe every morning — it is touched by every single person who enters.",
  },
];

const TIPS = [
  "Office cleaning frequency should be determined by headcount, not floor area. A 10-person office requires daily cleaning in kitchens and bathrooms; a 50-person office requires twice-daily cleaning in the same areas.",
  "The return on investment for professional office cleaning is measurable — research shows that clean office environments reduce sick days by 25–30% by eliminating the bacterial and viral transmission vectors that cause seasonal illness.",
  "Establish clear staff responsibility for shared spaces: a rota for kitchen duty, a sign-above-the-sink policy, and a labelling requirement for fridge items. The cleaner maintains standards — staff behaviour determines whether those standards are achievable.",
  "Book a deep clean quarterly in addition to daily maintenance cleaning. Deep cleans should address areas daily cleaning does not reach: behind furniture, inside vents, carpet extraction, and the undersides of desks and chairs.",
  "Fragrance-free, VOC-free cleaning products are not merely a preference — in enclosed office environments, synthetic cleaning fragrances contribute to air quality degradation that has measurable effects on staff cognitive performance and wellbeing.",
];

const FAQS = [
  {
    q: "How often should an office be professionally cleaned?",
    a: "For most offices, daily professional cleaning of bathrooms, kitchen areas, and high-traffic surfaces is the minimum standard. Workstation areas should be cleaned 3–5 times per week. Deep cleaning of carpets, upholstery, air vents, and hard-to-reach areas should be scheduled quarterly. The frequency should increase with headcount — an office with 50+ staff needs more intensive cleaning than a 10-person workspace.",
  },
  {
    q: "Who is responsible for office cleaning — staff or the cleaning team?",
    a: "The professional cleaning team handles systematic cleaning on the agreed schedule. Staff responsibility covers daily maintenance behaviours: washing their own dishes, wiping up spills immediately, keeping their desks tidy, labelling fridge items, and not leaving rubbish on desks overnight. When both sides fulfil their responsibilities, a professional cleaning schedule is achievable. When staff behaviour is poor, no cleaning schedule can maintain standards.",
  },
  {
    q: "What cleaning products are safe to use in an office with staff present?",
    a: "Products suitable for use while staff are present are those with low VOC content, fragrance-free formulations, and rapid drying times. Avoid bleach-based products in occupied spaces — the fumes are an irritant. Most surface disinfectants are safe once dry. For cleaning in occupied kitchens and bathrooms, always ensure ventilation is adequate during and after application. Supply a product data sheet for any chemical product used in a professional capacity.",
  },
  {
    q: "How do I reduce illness transmission in a shared office?",
    a: "The most effective interventions are: daily disinfection of all touch points (door handles, lift buttons, tap handles, keyboard and mice in shared workstations); accessible hand sanitiser at the entrance, kitchen, and bathroom; a clear sick-at-home policy that removes pressure to work through illness; and adequate ventilation. Illness transmission in offices drops significantly when touch-point cleaning frequency increases from weekly to daily.",
  },
  {
    q: "How should we handle office cleaning around hot-desking?",
    a: "Hot-desk environments require cleaning between occupants as a standard. Provide antibacterial wipes at each desk and establish a policy that desks are wiped before and after each use. Keyboards, mice, and phone handsets at hot-desk stations should be wipe-cleaned by the professional cleaning team daily. Shared storage areas and locker handles should be cleaned at least weekly.",
  },
  {
    q: "Can a professional cleaning team work outside business hours?",
    a: "Yes — and for most offices, out-of-hours cleaning is strongly preferable. Evening or early morning cleaning allows thorough access to all areas without disruption, permits the use of more intensive cleaning methods (such as floor machines), allows cleaning products to be applied with adequate dwell time, and does not disturb staff concentration. Most professional cleaning services offer flexible scheduling around your office hours.",
  },
];

export default function OfficeCleaningTips() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Workstations");
  const [openTip, setOpenTip] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const category = CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Office cleaning guide</p>
        <h1 className={styles.heroTitle}>
          Office cleaning tips
          <br />
          <em>that raise the standard.</em>
        </h1>
        <p className={styles.heroDesc}>
          Professional-grade office cleaning advice — from daily desk hygiene to
          deep-clean schedules that keep staff healthy and your workplace
          looking its best.
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
          ["🖥️", "Workstation hygiene"],
          ["🚽", "Bathroom standards"],
          ["☕", "Kitchen & breakroom"],
          ["🌫️", "Air quality"],
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
          Tips for every part of your office
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
          8 office quick wins you can use today
        </h2>
        <p className={styles.quickWinsSub}>
          No specialist products or equipment — just smart habits that take
          under 2 minutes and make a real difference.
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
            The principles behind a clean office
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
          Our vetted maids and commercial cleaning teams know every tip on this
          page. Book a professional office clean and come back to a spotless
          workspace — guaranteed.
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
