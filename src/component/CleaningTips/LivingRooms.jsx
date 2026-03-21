import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Kitchens.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  {
    icon: "🛋️",
    name: "Sofas & Upholstery",
    tagline: "The most used — and least cleaned — surface in your home",
    tips: [
      {
        title: "Vacuum your sofa every single week without exception",
        text: "A sofa that looks clean is rarely clean. Fabric upholstery traps dead skin cells, dust mite waste, pet dander, food crumbs, and hair between its fibres at a rate that makes it one of the highest-particle environments in the home. Use the upholstery attachment on your vacuum — not the floor head — and go over every surface: cushion fronts, backs, sides, the crevice between the backrest and seat, and underneath the removable cushions. If you have pets, vacuum twice a week. This single habit more than halves the cleaning time required when you eventually do a deep clean.",
      },
      {
        title: "Remove pet hair with a damp rubber glove",
        text: "No lint roller removes embedded pet hair from fabric upholstery effectively. A slightly damp rubber glove dragged across the fabric surface causes hair to clump together and lift away from the fibres in seconds. Work in one direction — dragging back and forth spreads the hair rather than collecting it. For deeply embedded hair in a thick fabric, spray a very light mist of water before using the glove. Once collected into clumps, the hair is easy to pick up by hand or lift with a dry cloth.",
      },
      {
        title: "Treat fabric stains by blotting inward — never rubbing outward",
        text: "Rubbing a stain spreads the substance deeper into the fabric fibres and enlarges the affected area. The correct technique for any fabric stain is to blot — press a clean cloth firmly onto the stain and lift straight up, working from the outer edge of the stain toward the centre. This concentrates the stain rather than spreading it. Apply a small amount of cold water and dish soap to the cloth (not directly onto the fabric) and continue blotting. Rinse by blotting with a cloth dampened in plain cold water. Never use hot water — it sets protein-based stains permanently.",
      },
      {
        title: "Deodorise upholstery with baking soda monthly",
        text: "Fabric upholstery absorbs cooking smells, pet odours, sweat, and general environmental odours continuously. Air fresheners mask these smells rather than eliminating them. The correct approach is baking soda — sprinkle a generous, even coat over the entire sofa surface, leave for a minimum of 30 minutes (and ideally several hours), then vacuum thoroughly. Baking soda is alkaline and chemically neutralises the acidic organic compounds responsible for most fabric odours. This leaves upholstery genuinely odour-free rather than perfumed.",
      },
      {
        title: "Check the fabric care label before any liquid cleaning",
        text: "Upholstery fabric care labels use a standardised code system that determines what cleaning methods are safe: W means water-based cleaners only, S means solvent-based cleaners only, WS means either is acceptable, and X means vacuum only — no liquid. Applying water to an S-coded fabric causes watermarking; applying solvent to a W-coded fabric can cause irreversible colour change. Check the label on every cushion and on the frame before applying any liquid. If there is no label, test any product on a hidden area — inside a cushion cover seam or under the base — and wait 30 minutes before proceeding.",
      },
      {
        title: "Rotate and flip sofa cushions every month",
        text: "Sofa cushions that are never rotated develop permanent compression in the areas most frequently sat on — typically one side of a three-seater and the cushion directly in front of the television. Monthly rotation distributes wear evenly, extends the lifespan of the cushion filling by years, and maintains the sofa's appearance. If your cushions are flippable (no pattern on one side), flip as well as rotate. Cushion inserts that have lost their shape should be replaced — they cannot be restored through cleaning.",
      },
    ],
  },
  {
    icon: "💨",
    name: "Dust & Air Quality",
    tagline: "What you can't see is what affects you most",
    tips: [
      {
        title: "Dust surfaces from top to bottom, never the reverse",
        text: "Dust is governed by gravity. When you dust a shelf, particles fall downward onto the surfaces below. If you have already cleaned the floor and then dust the shelves, you are creating work for yourself. The correct sequence is always top to bottom: ceiling and ceiling fans first, then high shelves and picture frames, then mid-height surfaces, then skirting boards, then the floor. This approach means each cleaning pass collects particles that have fallen from the surface above it, and the floor — cleaned last — collects everything.",
      },
      {
        title:
          "Use a damp microfibre cloth — never a dry cloth or feather duster",
        text: "A feather duster and a dry cloth both redistribute dust rather than removing it. They lift particles from a surface and suspend them in the air, where they settle back down within minutes. A slightly damp microfibre cloth traps particles electrostatically — they stick to the cloth fibres rather than becoming airborne. Wring the cloth until it is barely damp (no dripping) before use. For electronics and screens, use a dry microfibre cloth only — moisture and electronics are incompatible.",
      },
      {
        title: "Clean ceiling fans and light fittings monthly",
        text: "Ceiling fans accumulate a thick layer of dust on the top surface of each blade — completely invisible from the floor — that is redistributed throughout the room every time the fan is switched on. Use a pillowcase to clean ceiling fans: slip the open end over each blade and wipe firmly while pulling back, so the dust falls inside the pillowcase rather than onto the floor below. Light fittings and lampshades collect dust on their upper surfaces equally invisibly and should be wiped or vacuumed with a soft brush attachment monthly.",
      },
      {
        title: "Vacuum window tracks, blinds, and curtain bases regularly",
        text: "Window tracks accumulate dust, dead insects, and debris that is disturbed into the room air every time the window is opened. Use the crevice tool to vacuum window tracks monthly. Venetian blinds accumulate dense dust on each slat that is difficult to remove quickly — wipe each slat with a barely damp cloth, or use a purpose-made blind cleaning brush that cleans multiple slats simultaneously. Curtain bases collect dust that falls from the fabric above; vacuum along the hem line with the upholstery attachment weekly.",
      },
      {
        title: "Ventilate the living room daily — regardless of weather",
        text: "Indoor air in a living room that is never ventilated accumulates CO2 from occupants, VOCs from furniture off-gassing, dust particulates, and biological contamination at levels that measurably exceed outdoor air quality. Open at least one window for a minimum of 10 minutes daily — even in cold weather. The temperature benefit of a closed room is negligible compared to the air quality benefit of regular ventilation. In harmattan season, ventilate in the early morning and evening when dust levels are lowest.",
      },
      {
        title: "Address dust mites at their source — not just their symptoms",
        text: "Dust mites are the primary trigger for indoor allergies and are present in every living room with fabric upholstery, rugs, or curtains. They cannot be eliminated but their population can be managed. Wash throw cushion covers and blankets at 60°C monthly — 60°C is the temperature at which dust mites are killed; lower temperatures leave them alive. Use a HEPA-filter vacuum which captures mite waste particles rather than re-exhausting them into the air. Reduce indoor humidity below 50% where possible — dust mites cannot survive in low-humidity environments.",
      },
    ],
  },
  {
    icon: "🪴",
    name: "Surfaces & Shelving",
    tagline: "Every surface tells the story of how clean your home is",
    tips: [
      {
        title: "Declutter shelves before you dust them — every time",
        text: "Dusting around objects is inefficient and ineffective. Objects accumulate their own dust coating that transfers back onto the cleaned surface the moment you replace them. Before dusting any shelf, remove every item from it, dust the empty shelf surface, dust or wipe each object individually before replacing it, and return only what you intend to keep on that shelf. This process takes twice as long the first time and half as long every time thereafter, because you will be more selective about what you leave on display.",
      },
      {
        title: "Use the right cleaner for each surface material",
        text: "Wood surfaces — real or veneered — should be cleaned with a damp cloth and a wood-safe cleaner, then dried immediately. Excess moisture causes wood to warp and lift at veneer edges. Glass surfaces respond to a 50/50 water and white vinegar solution applied with a microfibre cloth and buffed dry. Marble and natural stone surfaces must never be cleaned with acidic products — white vinegar, lemon juice, and most bathroom cleaners etch the surface permanently. Use a pH-neutral stone cleaner only. Metal and chrome surfaces clean effectively with a damp microfibre cloth; a dry buff with a second cloth prevents water marks.",
      },
      {
        title: "Clean picture frames, ornaments, and books monthly",
        text: "Picture frames — particularly those with ornate moulding — accumulate dense dust in their recesses that is both visible and difficult to remove once it builds. Use a soft paintbrush to loosen dust from carved or textured frames before wiping with a damp cloth. Books on open shelves accumulate dust on their top edges; vacuum along the top of each row with a soft brush attachment monthly. Ornaments should be wiped individually with a damp cloth — surface cleaning around them is not an acceptable substitute.",
      },
      {
        title: "Polish wood furniture with the grain, not against it",
        text: "Wood grain runs in one direction — applying polish, wax, or oil in circular motions or against the grain deposits product unevenly and can leave a hazy, streaked appearance. Always apply and buff wood care products in the direction of the grain with a soft cloth. Less product applied evenly produces better results than more product applied carelessly. Over-application of furniture polish builds up a sticky residue that attracts more dust than unpolished wood. Apply a light coat of wood conditioner or polish every 3–6 months — not at every clean.",
      },
      {
        title: "Clean behind and under furniture twice a year",
        text: "The area behind the sofa, under bookcases, and beneath television units is invisible during normal use and therefore almost never cleaned voluntarily. It accumulates extraordinary quantities of dust, pet hair, fallen objects, and in Nigerian homes, harmattan dust that has infiltrated through window gaps. Pull every piece of furniture away from the wall twice a year — during the dry season reset and mid-year — vacuum the floor and wall thoroughly, and wipe the wall surface with a damp cloth. Replace furniture only after the area is completely dry.",
      },
      {
        title: "Wipe light switches, remote controls, and sockets weekly",
        text: "Light switches are touched multiple times daily by every occupant of the room and are almost universally overlooked during cleaning routines. Remote controls are passed between users, placed on multiple surfaces, and occasionally dropped — making them one of the most bacteria-laden objects in any living room. Wipe light switches, socket surrounds, remote controls, and any regularly-touched surface controls with an antibacterial wipe or lightly dampened disinfectant cloth weekly. Pay particular attention to the edges of light switches where grime accumulates.",
      },
    ],
  },
  {
    icon: "🪟",
    name: "Windows & Glass",
    tagline: "Natural light starts with clean glass",
    tips: [
      {
        title: "Clean windows on an overcast day for streak-free results",
        text: "The most common cause of streaky windows is cleaning in direct sunlight. The sun causes the cleaning solution to dry before you can wipe it away, leaving mineral deposits and soap residue on the glass. Choose a cloudy day or clean windows in the early morning before the sun reaches them. Work on one window at a time, and do not leave solution on the glass for more than 30 seconds before wiping. This one change produces consistently better results than any specialist window cleaning product used in the wrong conditions.",
      },
      {
        title:
          "Use crumpled newspaper or a lint-free cloth — never paper towels",
        text: "Paper towels leave lint fibres on glass that are visible as a haze in certain light conditions. Crumpled newspaper is the traditional and still-effective alternative — the slightly abrasive texture polishes the glass as you wipe and the ink does not transfer onto the surface. A dedicated lint-free window cloth (not a general microfibre cloth, which can leave very fine fibres) is the professional equivalent. In all cases, apply the cleaning solution to the cloth rather than directly to the glass to prevent drips onto frames and sills.",
      },
      {
        title: "Clean window frames and sills before the glass",
        text: "Dust and residue from frames and sills runs onto glass during cleaning, undoing your work immediately. Always clean in this order: vacuum the window track with a crevice tool, wipe the frame with a damp cloth, clean the sill, then clean the glass. Use a cotton bud or folded cloth to reach into the corners of frames where grime accumulates in the groove. Wooden frames should be wiped dry immediately after cleaning — standing moisture causes swelling and paint lifting.",
      },
      {
        title: "Apply a water-repellent treatment to exterior glass annually",
        text: "A hydrophobic glass treatment applied to exterior windows causes rain water to bead and run off rather than spreading and drying into mineral deposits. This dramatically reduces the frequency of cleaning required and prevents the calcium staining that builds on exterior glass in areas with hard water. Apply after a thorough clean following the manufacturer's instruction — most require a dry surface and 24 hours before the first rain. The effect lasts 6–12 months depending on the product and weather conditions.",
      },
      {
        title: "Clean glass table tops and TV screens with different products",
        text: "Glass table tops are best cleaned with a 50/50 water and white vinegar solution — it cuts grease and fingerprints and leaves the surface streak-free. Never use this solution on a TV, monitor, or tablet screen — the acidity can permanently damage anti-reflective and anti-glare coatings. Screen surfaces should be wiped with a dry microfibre cloth only, or a cloth barely dampened with distilled water in the case of stubborn marks. The distinction matters — replacing a television because of improper cleaning is an expensive lesson.",
      },
    ],
  },
  {
    icon: "🏠",
    name: "Floors & Rugs",
    tagline: "The foundation of every clean living room",
    tips: [
      {
        title: "Vacuum in two perpendicular directions for thorough results",
        text: "A single-direction vacuum pass lifts fibres in one orientation and misses particles trapped in the opposite direction of the carpet pile. Vacuum the room first in a north-south direction, then again in an east-west direction. This lifts fibres from both angles, dislodges embedded particles, and produces a visibly cleaner and more evenly groomed carpet finish. For heavily trafficked areas, add a diagonal pass. This technique doubles cleaning effectiveness with only a 50% time increase.",
      },
      {
        title: "Mop hard floors with the two-bucket method",
        text: "The single most common mopping mistake is using one bucket — after the first few square metres of floor, the mop is redistributing grey water rather than cleaning. Use two buckets: one with your diluted floor cleaner and one with clean rinse water. Wring the mop into the dirty bucket, rinse in the clean water bucket, then reload from the cleaning solution. Change both buckets when the water darkens. The floor you finish is as clean as the floor you started — not progressively dirtier.",
      },
      {
        title: "Vacuum rugs from underneath as well as the top",
        text: "The underside of rugs accumulates dust, grit, and debris that migrates up through the pile and acts as an abrasive on the rug fibres from below. Every three months, fold the rug back and vacuum the underside, then vacuum the floor beneath, before replacing the rug right-side up. For smaller rugs, take them outside and beat them against a railing or wall — this dislodges embedded grit that vacuuming alone cannot reach. Grit trapped in rug fibres is the primary cause of premature wear.",
      },
      {
        title: "Treat hard floor spills within 60 seconds",
        text: "Most hard floor materials — whether tile, wood, or vinyl — are only damaged by spills that are left to dry. Tiled floors with grout are stained by coloured liquids when grout is unsealed or aged; hardwood floors are warped by moisture that penetrates the surface seal. The 60-second rule: any liquid spill on a hard floor should be blotted up completely within 60 seconds to prevent surface penetration. Keep a roll of kitchen paper accessible in the living room rather than solely in the kitchen.",
      },
      {
        title: "Have area rugs professionally cleaned annually",
        text: "Regular vacuuming maintains a rug's surface appearance but does not remove the dust, oils, and particulate matter embedded deep in the pile — particularly from foot traffic and pets. Annual professional hot-water extraction cleaning restores the pile, removes deeply embedded soiling, and kills dust mites and their eggs. The colour of the rinse water during a first professional clean of an 'apparently clean' rug is consistently darkened, demonstrating the level of invisible contamination that routine vacuuming does not address.",
      },
      {
        title: "Place felt pads under all furniture legs",
        text: "The underside of furniture legs — particularly those with metal feet or rough-cut wood — scratch and scuff hard floors and compress carpet pile permanently. Self-adhesive felt pads fitted to every furniture leg prevent surface scratching on hard floors, reduce carpet compression marks, and make moving furniture for cleaning significantly easier and quieter. Replace felt pads annually or when they begin to slide off — a worn felt pad provides less protection than no pad at all and can trap grit that accelerates scratching.",
      },
    ],
  },
  {
    icon: "📺",
    name: "Electronics & Entertainment",
    tagline: "Clean gear lasts longer and performs better",
    tips: [
      {
        title: "Dust electronics with a soft dry brush before wiping",
        text: "Electronics attract dust electrostatically — the static charge from powered devices draws and holds particles to their surfaces more aggressively than any other item in the room. A soft bristle brush (such as a clean paintbrush or purpose-made electronics brush) used first to dislodge dust before wiping prevents particles from being ground into ventilation slots and surface textures. For the television rear panel and speaker grilles, use compressed air to clear vents — blocked vents cause electronics to run hot and shorten their lifespan.",
      },
      {
        title: "Never spray liquid directly onto any electronic surface",
        text: "Liquid entering electronic ventilation slots — even in microscopic quantities from aerosol spray — causes corrosion of internal components that may not manifest as a problem for weeks or months. Always apply cleaning solution to a cloth and wipe the surface with the cloth. For remote controls and game controllers, wrap a slightly damp cloth around a cocktail stick or cotton bud to clean between buttons. The extra 30 seconds this approach takes is far less costly than replacing electronics damaged by moisture.",
      },
      {
        title: "Clean television speakers and ventilation grilles monthly",
        text: "Fabric speaker grilles on televisions and soundbars accumulate dust that progressively muffle sound output — noticeably so over 6–12 months without cleaning. Use a soft brush to gently dislodge accumulated dust, then use the brush attachment on a vacuum set to its lowest suction setting to collect dislodged particles. Avoid pressing the fabric inward — this pushes dust further into the speaker cavity. Rear ventilation grilles on televisions should be cleared with compressed air monthly — restricted airflow is the leading cause of television overheating.",
      },
      {
        title: "Manage cables to reduce dust accumulation",
        text: "Cable bundles behind entertainment units accumulate dust faster than any other area in the living room due to the electrostatic charge that runs through powered cables. Organise cables with reusable cable ties or a cable management sleeve to reduce surface area exposed to dust and make cleaning the area possible without disconnecting everything. Route cables along the wall or under a cable cover channel rather than across open floor areas. Once a month, pull the entertainment unit forward, vacuum all cables and the floor behind, and wipe the wall surface.",
      },
      {
        title: "Wipe remote controls with an antibacterial wipe twice a week",
        text: "Remote controls are among the most bacteria-laden objects in any room — touched by every occupant, placed on multiple surfaces including the floor, and almost never cleaned. A study of hotel rooms found remote controls consistently carried the highest bacterial load of any surface in the room, including bathroom faucets. Wipe remote controls with an antibacterial wipe twice a week, paying particular attention to the space between buttons. Allow to dry completely before use — do not use while still wet as moisture can enter the button gaps.",
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: "🧤",
    time: "1 min",
    tip: "Put on a damp rubber glove and run your hand across the sofa to collect all pet hair and lint in seconds.",
  },
  {
    icon: "🧂",
    time: "30 sec",
    tip: "Sprinkle baking soda on the sofa and rugs before you vacuum — it neutralises odours rather than just masking them.",
  },
  {
    icon: "📰",
    time: "1 min",
    tip: "Crumple a sheet of newspaper to clean glass surfaces and mirrors streak-free — works better than any paper towel.",
  },
  {
    icon: "🪣",
    time: "2 min",
    tip: "Flip and rotate all sofa cushions monthly — it takes 2 minutes and doubles the lifespan of your sofa.",
  },
  {
    icon: "💡",
    time: "1 min",
    tip: "Use a pillowcase to clean ceiling fan blades — slip it over each blade and wipe, trapping all the dust inside.",
  },
  {
    icon: "🧹",
    time: "30 sec",
    tip: "Vacuum in a cross pattern — north-south, then east-west — to lift carpet fibres from both directions.",
  },
  {
    icon: "🪟",
    time: "2 min",
    tip: "Clean windows on an overcast morning before the sun hits them — the solution won't dry before you wipe, so zero streaks.",
  },
  {
    icon: "📺",
    time: "30 sec",
    tip: "Never spray liquid onto a screen — apply to a cloth first and wipe gently with a dry microfibre cloth.",
  },
];

const TIPS = [
  "The living room is the room most people clean reactively — only when it looks dirty. But the most damaging accumulation in a living room (dust mites, embedded grit in rugs, sofa bacteria) is invisible. Weekly maintenance prevents the kind of deterioration that no amount of reactive cleaning can reverse.",
  "Upholstery is the defining surface of a living room — its condition determines the overall impression of the space. A clean floor with a dirty sofa reads as a messy room; a clean sofa with minor floor dust reads as a lived-in but cared-for home. Prioritise upholstery in your routine.",
  "Air quality in living rooms deteriorates faster than any other room because it is occupied for the longest periods. The combination of furniture off-gassing, dust accumulation, and lack of the ventilation that cooking forces in kitchens creates an environment that measurably affects sleep quality and allergy symptoms. Daily ventilation is the highest-return habit you can build.",
  "When booking a professional living room clean, specify the sofa vacuum and deodorise treatment explicitly — many standard cleans do not include upholstery as a default. The sofa is the most valuable item in the room to clean and the one most commonly omitted.",
  "Harmattan season requires a modified living room cleaning routine. Seal window gaps with foam strips before the season peaks, increase dusting frequency to three times per week rather than weekly, and switch to damp microfibre wiping rather than dry dusting — dry dusting during harmattan simply redistributes fine dust particles into the air.",
];

const FAQS = [
  {
    q: "How often should I professionally clean my living room?",
    a: "For most households, a professional deep clean every 3 months maintains the living room in excellent condition when combined with a weekly maintenance routine. Households with pets, children, or allergy sufferers benefit from a monthly professional clean, particularly for upholstery and rugs. An annual professional rug extraction clean is recommended for all households regardless of how clean the rug appears — embedded soiling that vacuuming cannot reach accumulates over time.",
  },
  {
    q: "What is the best way to clean a leather sofa?",
    a: "Leather requires a different approach to fabric upholstery. Wipe with a barely damp cloth for regular cleaning — excess moisture dries and cracks leather. Quarterly, apply a dedicated leather conditioner to prevent drying and cracking — never use petroleum-based products, furniture polish, or oils not specifically formulated for leather as these degrade the surface. For stains, blot immediately and use a leather-specific cleaner. Leather with heavy cracking or peeling requires professional restoration, not cleaning.",
  },
  {
    q: "How do I remove a water stain ring from a wooden table?",
    a: "Fresh water rings on wood can often be removed by rubbing non-gel white toothpaste into the ring in the direction of the grain with a soft cloth — the mild abrasive lifts the mineral deposit without scratching the surface. For older or more established rings, a mixture of equal parts white vinegar and olive oil applied and buffed with a cloth is effective on unsealed or lightly sealed wood. Polyurethane-sealed surfaces are more resistant and may require a professional polish. Prevention — using coasters consistently — is significantly easier than the cure.",
  },
  {
    q: "My living room always smells stale. What is the cause?",
    a: "Stale odour in living rooms has three primary sources: fabric upholstery absorbing body odour, pet dander, and cooking smells; poor ventilation allowing CO2 and VOCs to build; and dust accumulation in hard-to-reach areas including behind furniture, in carpet pile, and in curtain fabric. Address all three: deodorise upholstery with baking soda monthly, ventilate daily for at least 10 minutes, and schedule a thorough deep clean including the areas behind and under all furniture. If the smell persists, the source is likely the sofa itself — a professional upholstery clean resolves what surface cleaning cannot reach.",
  },
  {
    q: "How do I clean curtains without taking them down?",
    a: "For routine maintenance, attach the upholstery tool to your vacuum and run it over the entire curtain surface — including the back — working from the top down. This removes accumulated dust without disturbing the hanging. For deodorising, lightly mist with a fabric refresher spray and allow to dry with windows open. Curtains should be taken down and machine-washed or dry-cleaned annually — no amount of in-place maintenance substitutes for a full wash. Check the care label before washing — many lined or interlined curtains require specialist cleaning.",
  },
  {
    q: "Is it safe to use white vinegar on all living room surfaces?",
    a: "No — and this is the most common cleaning mistake that causes permanent damage. White vinegar is safe on glass surfaces, most tile surfaces, and stainless steel. It permanently etches and strips the sealant from natural stone surfaces including marble, granite, and slate. It can lift the finish from certain wood surfaces. It can fade some fabric dyes when used undiluted. As a rule: dilute vinegar for glass (50/50 with water), avoid completely on stone and polished wood, and always test on a hidden area of fabric before wider application.",
  },
];

export default function LivingRooms() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Sofas & Upholstery");
  const [openTip, setOpenTip] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const category = CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Living room cleaning guide</p>
        <h1 className={styles.heroTitle}>
          Living room tips
          <br />
          <em>for every surface.</em>
        </h1>
        <p className={styles.heroDesc}>
          The most comprehensive living room cleaning guide available — from
          sofa upholstery and dust management to glass, floors, rugs, and
          electronics. Every surface covered, every technique explained.
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
          ["🛋️", "Sofas & upholstery"],
          ["💨", "Dust & air quality"],
          ["🪟", "Windows & glass"],
          ["🏠", "Floors & rugs"],
          ["📺", "Electronics"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Category tips */}
      <div className={styles.section} id="tips-section">
        <p className={styles.sectionEyebrow}>Surface by surface</p>
        <h2 className={styles.sectionTitle}>
          Tips for every part of your living room
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
          8 living room quick wins for today
        </h2>
        <p className={styles.quickWinsSub}>
          No specialist products, no equipment — just clever techniques that
          take under 2 minutes and produce results you can see immediately.
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
            The principles behind a clean living room
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
          Our vetted maids know every technique in this guide — and bring their
          own supplies. Book a professional living room clean and come home to
          spotless.
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
