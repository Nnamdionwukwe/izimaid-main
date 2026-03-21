import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Kitchens.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  {
    icon: "🚽",
    name: "Toilet",
    tagline: "The most bacteria-dense fixture — clean it properly",
    tips: [
      {
        title:
          "Clean the toilet in a specific sequence — inside, then outside, then seat",
        text: "The sequence in which you clean a toilet is as important as the products you use. Apply toilet cleaner under the rim first and leave it to dwell for a minimum of 5 minutes while you clean the exterior — this is the contact time the chemical needs to kill bacteria and dissolve limescale. Clean the cistern lid and body next, moving from the top down. Clean the seat last — both the top surface and the underside, which accumulates bacteria at the hinge points. The bowl is cleaned last with the brush, working under the rim and down to the water. Never start with the seat — you will transfer bacteria from the bowl area to a surface people sit on.",
      },
      {
        title: "Clean under the toilet rim every week without exception",
        text: "The area under the toilet rim is the highest-bacteria zone in the entire bathroom and the most commonly neglected area of toilet cleaning. Bacteria and mould growth begins here within 48 hours of a clean in a regularly used bathroom. Apply a toilet gel or foam that clings to the underside of the rim and leave it to dwell. Use the toilet brush to scrub thoroughly under the entire rim circumference — not just the visible front section. The dark staining that develops on neglected toilet rims is almost entirely preventable with consistent weekly attention.",
      },
      {
        title:
          "Disinfect the toilet base, hinges, and behind the cistern monthly",
        text: "The areas that are cleaned least often around a toilet are the ones that deteriorate most visibly — the floor at the base of the toilet where cleaning products rarely reach, the hinge bolts on the toilet seat where bacteria accumulate in the crevices, and the wall behind and beside the cistern. Monthly, move any objects from around the toilet, clean the floor immediately around the base with a disinfectant spray and cloth, wipe behind and under the cistern, and clean the hinge bolts with a cotton bud dampened with bleach solution. These areas are photographed in every toilet inspection and reveal the thoroughness of a clean immediately.",
      },
      {
        title: "Replace your toilet brush every 3 months",
        text: "A toilet brush used beyond 3 months accumulates bacterial contamination in the bristles that is not removed by any amount of rinsing. The brush then deposits bacteria back into the bowl and onto the rim during every use. After each use, hold the brush over the bowl and pour a small amount of bleach over the bristles, allow it to drain into the bowl, and store in the holder with a small amount of disinfectant in the base. Replace the brush and holder together every 3 months — it is the lowest-cost hygiene upgrade in any bathroom.",
      },
      {
        title: "Remove toilet seat and clean underneath every month",
        text: "Most toilet seats are designed to be removed for cleaning — lift the seat, locate the hinge caps at the back, press the quick-release buttons, and lift the seat away. The area beneath the seat hinge attachment points where the seat meets the rim is one of the most bacteria-laden surfaces in the bathroom and is completely inaccessible without removal. Wash the seat in the sink with hot soapy water, scrub the hinge area with a brush, rinse, and dry before reattaching. The floor under the toilet hinge area should also be cleaned while the seat is removed.",
      },
      {
        title: "Address toilet limescale before it becomes permanent",
        text: "Toilet limescale — the brown-orange ring at the waterline and the white mineral deposits under the rim — is caused by calcium and magnesium minerals in the water supply precipitating onto ceramic surfaces. Address it while it is light-coloured and powdery: commercial limescale removers or a paste of citric acid and water applied to the affected areas and left for several hours will dissolve early-stage deposits. Established dark brown limescale requires pumice stone cleaning and may need professional treatment. The difference between a toilet that cleans easily and one that requires hour-long scrubbing is entirely preventable with bi-monthly limescale treatment.",
      },
    ],
  },
  {
    icon: "🚿",
    name: "Shower & Bath",
    tagline: "Where soap scum, limescale, and mould compete for attention",
    tips: [
      {
        title: "Squeegee the shower screen and walls after every single use",
        text: "The 20 seconds spent squeegeeing a shower screen after every use eliminates the need for deep shower cleaning in almost every bathroom. Soap scum, limescale, and mould all begin as water film left on shower surfaces — calcium minerals in water form limescale as the water evaporates, surfactants in soap products form scum as the film dries, and trapped moisture on surfaces creates the conditions for mould. Removing the water film before it dries removes the substrate for all three problems simultaneously. A squeegee hung inside the shower requires no thinking — it simply becomes part of the exit routine.",
      },
      {
        title: "Descale the showerhead every 6 weeks",
        text: "Limescale accumulating inside and around showerhead nozzles progressively reduces water flow, distorts the spray pattern, and eventually blocks nozzles entirely. Fill a plastic bag with undiluted white vinegar, submerge the showerhead in the bag, and secure it with an elastic band or cable tie so the showerhead is fully immersed. Leave for a minimum of 1 hour — overnight is ideal for heavy buildup. Remove the bag and run hot water for 30 seconds. Use an old toothbrush to clean any remaining deposits around the nozzles. This approach requires no disassembly and costs pennies.",
      },
      {
        title:
          "Clean shower grout with a targeted application, not a general spray",
        text: "General shower spray applied to tiled walls runs off before it has time to act on grout lines. Grout requires a product applied directly and left to dwell. Apply a gel or foam grout cleaner directly to the grout lines using a brush or old toothbrush, leave for the dwell time specified on the product (typically 5–10 minutes), scrub, and rinse. For black mould in grout, undiluted bleach applied with a toothbrush and left for 20 minutes kills the mould at its roots — superficial cleaning only removes visible mould while leaving the spores that cause immediate regrowth.",
      },
      {
        title:
          "Treat shower seals and silicone caulking before mould establishes",
        text: "Shower tray seals, bath seals, and the silicone caulking at all junctions between the shower and wall are the fastest surfaces to develop mould in any bathroom — the silicone is porous and provides an ideal environment for mould spores to establish. Spray with a mould-inhibiting bathroom spray immediately after cleaning and squeegee dry. Once black mould is established in silicone, it cannot be killed through surface cleaning — the silicone must be cut out and replaced. This is a professional task that costs significantly more than the spray bottle it could have been prevented with.",
      },
      {
        title: "Clean the bath tray and waste regularly to prevent drain odour",
        text: "Shower trays and bath waste plug areas accumulate hair, soap scum, and skin debris in the drain mechanism that decomposes and produces the sulphuric odour that develops in bathrooms that appear otherwise clean. Remove the drain cover weekly and remove accumulated hair and debris manually — this is impossible to do with cleaning spray alone and is the primary source of shower drain smell. Pour a kettle of boiling water down the drain weekly to dissolve accumulated soap and fat. Monthly, use a drain unblocker or baking soda and white vinegar flush to clear deeper buildup.",
      },
      {
        title: "Ventilate the bathroom for 20 minutes after every shower",
        text: "Every shower deposits approximately 1 litre of water vapour into the bathroom air. This moisture condenses on every cold surface in the room — walls, ceiling, mirror, and any areas with lower surface temperature. If not removed quickly, this moisture creates the conditions for mould growth within 24–48 hours. The bathroom extractor fan should run during the shower and for a minimum of 20 minutes after. If no extractor exists, open the window for the same period. Wipe down tiled walls that have condensation on them — removing the condensed moisture before it dries prevents both watermarking and mould.",
      },
    ],
  },
  {
    icon: "🧼",
    name: "Sink & Taps",
    tagline: "The most-used, most-seen fixture in the bathroom",
    tips: [
      {
        title:
          "Wipe the sink and taps dry after every use to prevent watermarks",
        text: "Bathroom sinks develop unsightly water marks and limescale rings at the waterline and around taps from water that is left to evaporate on the ceramic surface. Wiping the sink basin and taps dry with a cloth after the last use of the day takes 30 seconds and prevents the accumulation of mineral deposits that require dedicated descaling once established. Keep a dedicated sink cloth on a hook next to the basin — the barrier to the habit is the cloth being accessible. This habit makes weekly cleaning faster and the sink consistently presentable for visitors.",
      },
      {
        title: "Descale taps and chrome fixtures with the vinegar wrap method",
        text: "Limescale buildup at the base of taps, around the aerator, and on chrome surfaces is mineral deposit that standard bathroom sprays rarely remove. Soak a cloth in undiluted white vinegar, wrap it around the tap and the affected area, and secure it with an elastic band. Leave for a minimum of 30 minutes — 2 hours for heavy buildup. Remove the cloth and wipe clean with a dry cloth. The acetic acid in the vinegar dissolves calcium deposits without abrasive scrubbing that would scratch chrome. Buff dry with a second cloth to prevent new watermarks forming immediately.",
      },
      {
        title: "Clean the aerator on taps every 3 months",
        text: "The small mesh filter at the tip of the tap spout — the aerator — collects limescale and fine debris from the water supply that progressively reduces flow rate and distorts the water stream. Unscrew the aerator by hand or with pliers wrapped in cloth (to prevent scratching), soak in white vinegar for 30 minutes, use a toothbrush to remove any remaining debris, rinse, and reattach. Replacing a severely blocked aerator costs very little; ignoring it costs water pressure and eventually requires plumbing attention.",
      },
      {
        title: "Disinfect the sink drain and overflow hole weekly",
        text: "The sink drain and overflow opening (the oval hole near the top of the basin that prevents overflowing) are environments that accumulate bacteria, soap residue, and mould in their dark, moist interiors. Pour a small amount of white vinegar followed by baking soda down both the drain and the overflow hole weekly — the fizzing reaction dislodges buildup and deodorises. For persistent drain odour, a dedicated bathroom drain cleaner used monthly is more effective. The overflow hole is particularly neglected and is the source of an unidentified odour in many bathrooms.",
      },
      {
        title: "Clean the under-sink cabinet and surrounding area monthly",
        text: "The area under the bathroom sink accumulates moisture from pipe condensation, cleaning product residue, and debris that falls from the counter above. Inspect for damp patches and pipe drips monthly — a slow pipe drip goes unnoticed until it causes damage to the cabinet base. Wipe the interior of the cabinet with a dry cloth and leave the door open for an hour to air. Check product bottles for leaks and expired items. Clean the pedestal or cabinet exterior and the floor immediately around it — this area is frequently missed during routine cleaning.",
      },
      {
        title: "Polish chrome fixtures to remove residue without scratching",
        text: "Chrome bathroom fittings require a specific approach to maintain their mirror-like finish. Never use abrasive pads or powders on chrome — even mild abrasive action creates micro-scratches that dull the surface permanently and create more surface area for future deposits to adhere to. Use a soft microfibre cloth with a small amount of baby oil or dedicated chrome polish to remove water marks and restore shine. Buff in a circular motion until the surface is dry and streak-free. For heavily tarnished chrome, a mixture of baking soda and lemon juice applied gently with a cloth removes tarnish without abrasion.",
      },
    ],
  },
  {
    icon: "🧽",
    name: "Tiles & Grout",
    tagline: "The surfaces that reveal the real standard of a bathroom",
    tips: [
      {
        title:
          "Apply tile cleaner and leave it to dwell — never spray and immediately wipe",
        text: "The most common bathroom cleaning mistake is spraying tile cleaner and wiping it off within seconds — this removes surface soil but does not allow the antibacterial agents in the product to kill the bacteria and mould spores embedded in tile surfaces and grout. Apply tile spray, leave for a minimum of 60 seconds, and then wipe. For a genuine antibacterial clean rather than just a cosmetic one, the dwell time is not optional. The same principle applies to toilet cleaner, shower spray, and any disinfectant product — read the label and observe the contact time stated.",
      },
      {
        title: "Clean grout lines with a dedicated brush, not a cleaning cloth",
        text: "Grout lines in bathroom tiles are recessed and textured — a flat cleaning cloth passes over the surface without contacting the grout. A dedicated grout brush (or an old toothbrush) reaches into the recessed lines and physically removes the accumulated soap scum, mineral deposits, and mould that make grout discolour. Work in short, firm strokes along the grout line rather than across it. The difference in grout cleanliness between cloth cleaning and brush cleaning is significant and visible within the first session.",
      },
      {
        title: "Seal grout annually to prevent staining and mould",
        text: "Unsanitary grout that stains and darkens rapidly is almost always unsealed or has a worn seal that allows moisture, soap, and bacteria to penetrate into the porous grout material. After a thorough cleaning, apply a grout sealer using the applicator provided — a thin nozzle that runs directly along grout lines. Allow to dry completely per the manufacturer's instruction. Sealed grout resists staining, wipes clean easily, and dramatically reduces mould growth. This is the single maintenance step that most visibly improves bathroom appearance over time and is rarely done.",
      },
      {
        title: "Remove limescale from tiles with targeted acid treatment",
        text: "The white-grey mineral deposits on bathroom tiles — particularly in the splash zone around the bath and shower — are calcium and magnesium from hard water. General bathroom sprays remove soap scum effectively but are often insufficient against established limescale, which requires an acid to dissolve. A diluted citric acid solution (2 tablespoons per litre of water) applied to the affected tiles and left for 15 minutes dissolves limescale without damaging glazed tile surfaces. Rinse thoroughly afterwards. Never use acid-based products on natural stone tiles — they etch the surface irreversibly.",
      },
      {
        title: "Treat mould on tiles at the root, not just the surface",
        text: "Black mould visible on bathroom tile surfaces is the fruiting body of a fungal colony whose root structure (hyphae) penetrates beneath the surface. Wiping visible mould removes the surface layer but leaves the root structure intact — regrowth appears within days. Undiluted bleach applied directly to the affected area and left for 20–30 minutes before scrubbing penetrates deeply enough to kill the root structure. Wear gloves and ensure ventilation during application. For mould that returns within weeks regardless of treatment, the cause is inadequate ventilation — address the humidity source, not just the symptom.",
      },
      {
        title: "Deep-clean shower tile corners where soap scum concentrates",
        text: "The internal corners of tiled shower enclosures and the junction between the shower tray and walls accumulate the heaviest concentrations of soap scum, mould, and silicone-embedded contamination in the entire bathroom. These corners are also the hardest to reach with standard cleaning tools. Use a dedicated grout brush or an old electric toothbrush head for corner grout cleaning. For the tray-to-wall junction, a silicone caulk cleaner applied with a brush and left overnight is the most effective approach. Corners that are consistently neglected develop silicone contamination that requires professional replacement.",
      },
    ],
  },
  {
    icon: "💧",
    name: "Mould & Moisture",
    tagline: "Prevention costs a spray bottle. Remediation costs a builder.",
    tips: [
      {
        title: "Understand why your bathroom grows mould before treating it",
        text: "Mould in bathrooms is not a cleaning failure — it is a ventilation failure. Cleaning removes visible mould but does not address the underlying cause: consistent high humidity that creates conditions where mould can regrow faster than it can be cleaned. Every bathroom that regularly grows mould has one or more of the following issues: an extractor fan that is too small for the bathroom volume, a fan that is not running for long enough after showering, inadequate window ventilation, or shower and bath habits that produce excessive steam. Identify and address the cause, then clean the mould. Without addressing the cause, treatment is perpetual and futile.",
      },
      {
        title:
          "Run the extractor fan for 20 minutes after every shower — not during it",
        text: "The most common extractor fan usage error is running it during the shower and turning it off immediately when leaving. The majority of moisture enters the air during the cooling down period after a shower ends — when the wet surfaces in the bathroom continue to evaporate moisture into a room whose temperature is dropping. The fan should run for a minimum of 20 minutes after the shower is turned off. Install a timer switch on the extractor so this happens automatically. A bathroom extractor fan that runs correctly prevents 80% of the mould growth that occurs in bathrooms with inadequate ventilation.",
      },
      {
        title:
          "Wipe condensation from walls and mirrors immediately after showering",
        text: "Condensation on bathroom walls and mirrors is water in a ready-to-evaporate state — if removed before it evaporates, it cannot contribute to airborne humidity. Keep a squeegee or dedicated condensation cloth in the bathroom and wipe tiled walls and the mirror immediately after showering. This is a 60-second task that directly reduces the humidity level in the bathroom during the critical post-shower period when mould spores are most active. Mirrors wiped dry also stay clear far longer between cleans.",
      },
      {
        title:
          "Apply mould-inhibiting spray to vulnerable surfaces after cleaning",
        text: "Silicone seals, grout lines, ceiling corners, and the areas behind the toilet and beside the bath are the first surfaces to develop mould in any bathroom. After each thorough clean, spray these areas with a mould-inhibiting bathroom spray — products containing active mould inhibitors create a surface coating that prevents spore germination between cleans. This is not a substitute for adequate ventilation but significantly extends the interval between mould treatments, particularly in bathrooms with structural humidity challenges that cannot be immediately resolved.",
      },
      {
        title:
          "Check behind and underneath bath panels and under-sink cabinets",
        text: "The area behind bath panels and under bathroom cabinets is one of the most common locations for undetected mould growth in residential bathrooms — it has poor ventilation, zero light, and is in direct proximity to water sources. Remove the bath panel and inspect every 6 months. If you find mould, clean with undiluted bleach, allow to dry completely, and leave the panel off for several hours before replacing. A small battery-powered fan placed in the void for a few hours after replacement significantly reduces recurrence. Any leak detected in this area should be repaired before the panel is replaced.",
      },
      {
        title: "Replace silicone bathroom sealant when mould cannot be removed",
        text: "Black mould that returns within a week of cleaning, or mould that has turned silicone a permanent dark colour despite treatment, indicates fungal contamination has penetrated into the silicone material itself and cannot be killed from the surface. The only solution is removal and replacement. Cut out the old silicone with a silicone removal tool, clean the substrate thoroughly with bleach and allow to dry completely, and apply new silicone sealant in a continuous bead. Anti-mould silicone sealant containing fungicide provides better protection than standard sealant. New silicone lasts 5–10 years before requiring replacement.",
      },
    ],
  },
  {
    icon: "✨",
    name: "Mirrors & Surfaces",
    tagline: "The finishing details that define how clean a bathroom feels",
    tips: [
      {
        title: "Clean mirrors with a 50/50 water and white vinegar solution",
        text: "Glass mirror cleaner performs well on light dust and fingerprints but leaves a slight chemical film that attracts subsequent dust faster than a vinegar solution. A 50/50 solution of white vinegar and water in a spray bottle applied to a lint-free cloth (not sprayed directly onto the mirror — solution runs into the mirror edge and loosens the backing) produces a streak-free, film-free mirror surface that stays clean significantly longer. Wipe in horizontal strokes, then vertical strokes, buffing with a dry section of the cloth at the end. The vinegar smell dissipates completely within minutes of drying.",
      },
      {
        title:
          "Clean vanity surfaces with a dedicated bathroom cleaner, not kitchen products",
        text: "Bathroom vanity surfaces are regularly exposed to toothpaste (abrasive), hairspray (adhesive resin film), cosmetics, and water — a combination that kitchen all-purpose sprays are not formulated for. A dedicated bathroom spray contains surfactants and descalers appropriate for the specific soiling found in bathrooms. Apply to the counter, leave for 60 seconds, and wipe with a microfibre cloth. For hairspray buildup — the sticky, slightly tacky film on surfaces near the mirror — rubbing alcohol applied to a cloth removes it more effectively than any spray cleaner.",
      },
      {
        title: "Organise and wipe bathroom storage weekly",
        text: "Bathroom shelves, medicine cabinets, and vanity storage accumulate a film of product residue, water splash, and hairspray across all surfaces. Wipe shelves weekly as part of the bathroom clean — remove all products, wipe the shelf, wipe the base of each product bottle before replacing, and return only what is in current use. Products stored in the bathroom that are not used regularly should be relocated — bathroom humidity degrades formulations and degrades product packaging faster than any other room in the house.",
      },
      {
        title: "Clean bathroom ceiling corners monthly for mould prevention",
        text: "Bathroom ceiling corners — particularly above the shower and directly opposite the extractor fan — are the last surfaces to be reached by airflow and the first to develop mould growth. They are also completely invisible from a normal standing position and therefore never cleaned voluntarily. Check the ceiling corners monthly by stepping back and looking directly upward. At the first sign of grey or black spotting, treat with undiluted bleach applied with a cloth secured around a broom handle, leave for 15 minutes, and wipe clean. Addressing ceiling mould in its early stages requires 5 minutes; established ceiling mould requires painting after treatment.",
      },
      {
        title: "Polish chrome and glass with baby oil for lasting shine",
        text: "After cleaning chrome taps, towel rails, and glass surfaces, a single drop of baby oil buffed across the surface with a dry cloth provides a thin protective layer that repels water and prevents new limescale from adhering. The effect lasts 2–3 weeks between cleans. The key is a tiny amount — too much creates an oily film. Apply one drop to the cloth, not to the surface, and buff until it appears dry. This is the technique used in show homes to maintain the appearance of bathroom fixtures between viewings.",
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: "🪣",
    time: "20 sec",
    tip: "Squeegee the shower screen immediately after every shower — it prevents limescale, soap scum, and mould from ever forming.",
  },
  {
    icon: "🫙",
    time: "1 min",
    tip: "Wrap a vinegar-soaked cloth around a limescale-caked tap, secure with an elastic band, and leave for 30 minutes — the limescale dissolves itself.",
  },
  {
    icon: "🧴",
    time: "30 sec",
    tip: "Apply toilet cleaner under the rim and leave it while you clean the rest of the bathroom — the chemistry does the work for you.",
  },
  {
    icon: "💨",
    time: "30 sec",
    tip: "Run the extractor fan for 20 minutes after your shower, not during it — that is when most moisture enters the air.",
  },
  {
    icon: "🪥",
    time: "2 min",
    tip: "Use an old toothbrush dipped in baking soda paste on grout lines — a flat cloth never reaches into the recessed groove.",
  },
  {
    icon: "💧",
    time: "30 sec",
    tip: "Wipe the sink and taps dry after the last use of the day — it takes 30 seconds and prevents a week's worth of watermark build-up.",
  },
  {
    icon: "🫧",
    time: "1 min",
    tip: "Pour baking soda into the drain, follow with white vinegar, wait 5 minutes, flush with boiling water — drain odour eliminated.",
  },
  {
    icon: "✨",
    time: "30 sec",
    tip: "Buff one drop of baby oil onto chrome taps after cleaning — it repels water for weeks and prevents new limescale from adhering.",
  },
];

const TIPS = [
  "The bathroom is the room where cleaning frequency matters more than cleaning intensity. A thorough monthly clean combined with a 5-minute daily wipe-down routine produces a consistently better bathroom than a 2-hour deep clean every 6 weeks. Bacteria and mould re-establish within 48 hours — the cleaning schedule must reflect this.",
  "Every bathroom cleaning problem has a root cause that is not the surface itself. Persistent mould is inadequate ventilation. Perpetual limescale is insufficient post-use drying. Recurring drain odour is accumulated drain debris. Addressing the root cause eliminates the problem; treating the surface only manages it.",
  "Grout is the defining indicator of bathroom cleanliness. Visitors assess the cleanliness of a bathroom primarily through the condition of grout lines — clean white grout reads as a hygienic bathroom regardless of fixture age; dark grey grout reads as neglected regardless of how clean the fixtures are. Invest in grout: brush it weekly, seal it annually.",
  "The squeegee is the highest-return investment in bathroom maintenance. A £3 squeegee hung inside the shower and used for 20 seconds after every shower eliminates the need for weekly shower deep-cleaning in most bathrooms. No single cleaning product, technique, or habit produces a better return for less effort.",
  "When booking a professional bathroom clean, specify the areas that standard cleans consistently miss: under the toilet seat, behind the cistern, the shower drain cover, the extractor fan cover, and bathroom ceiling corners. A thorough professional bathroom clean of these areas once a month prevents the remediation work that follows when they are neglected for a year.",
];

const FAQS = [
  {
    q: "How do I remove black mould from bathroom silicone sealant?",
    a: "Apply undiluted bleach directly to the affected silicone using an old toothbrush or cotton wool ball. Leave for 30 minutes to 1 hour — longer than the standard 10-minute application. Rinse with water. If the mould has penetrated deeply into the silicone — visible as dark discolouration that does not respond to bleach — the silicone must be removed and replaced. Cut the old silicone out with a Stanley knife or silicone removal tool, clean the substrate with bleach and allow to dry completely (24 hours minimum), and apply new anti-mould silicone sealant. Standard cleaning cannot resolve mould that is inside the silicone material.",
  },
  {
    q: "How do I get rid of the brown stain at the bottom of the toilet?",
    a: "The brown ring at the waterline and the brown deposits at the bottom of the toilet bowl are a combination of limescale and iron deposits from the water supply — they are not the result of poor hygiene but of hard water chemistry. Commercial limescale removers left in the bowl overnight are the most effective treatment. For stubborn deposits that have built up over months, turn off the water supply, flush to empty the bowl, and apply a paste of citric acid powder and water directly to the affected areas. Leave for several hours. A pumice stone (used wet, not dry) can physically remove deposits that chemistry alone cannot dissolve.",
  },
  {
    q: "What causes bathroom drain smell and how do I permanently fix it?",
    a: "Bathroom drain smell has three common sources: accumulated hair and soap scum in the drain trap (the first and most common cause), a dry P-trap that has allowed sewer gas to escape into the bathroom (occurs in drains used infrequently), or bacterial growth in the drain pipe itself. For the first cause, remove and clean the drain cover and manually remove accumulated debris weekly. For a dry P-trap, run water for 30 seconds to reseal it. For bacterial drain odour, a monthly flush of boiling water followed by baking soda and white vinegar, then boiling water again, eliminates bacteria and grease without chemical drain unblockers.",
  },
  {
    q: "How do I stop the bathroom mirror from fogging after a shower?",
    a: "The simplest approach is to apply a thin layer of shaving cream to the mirror, wipe it off with a clean cloth, and buff dry — the residual layer prevents water vapour from condensing on the surface for several weeks. Alternatively, apply a small amount of baby shampoo diluted in water and buff dry. Commercial anti-fog sprays produce the same effect with greater durability. The most permanent solution is a heated mirror with a de-misting element, or consistently running the extractor fan during and after showering to prevent steam from reaching the mirror surface.",
  },
  {
    q: "How often should bathroom grout be replaced versus cleaned?",
    a: "Grout that is discoloured but structurally intact should be cleaned — a thorough deep clean with a brush and bleach-based grout cleaner, followed by re-sealing, restores grout appearance significantly in most cases. Grout that is cracked, crumbling, missing in sections, or has mould that returns within days of treatment despite cleaning should be replaced. Re-grouting is a DIY task for small areas — rake out old grout with a grout rake, vacuum the joints, apply new grout with a float tool, and seal once cured. Professional re-grouting is advisable for large areas or complex tile patterns.",
  },
  {
    q: "Is bleach safe to use in a bathroom with limited ventilation?",
    a: "Bleach releases chlorine gas, which is an irritant to the respiratory system and mucous membranes — this is the characteristic sharp smell of bleach. In a bathroom with good ventilation, diluted bleach is safe for most cleaning applications. In a poorly ventilated bathroom with no window or an inadequate extractor, bleach should be used sparingly, with the door open, and you should leave the room immediately after application and return only to rinse once the fumes have dispersed. Never mix bleach with any other cleaning product — bleach combined with ammonia-based cleaners, vinegar, or hydrogen peroxide produces toxic gases. Use single products sequentially with a water rinse between them.",
  },
];

export default function Bathrooms() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Toilet");
  const [openTip, setOpenTip] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const category = CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Bathroom cleaning guide</p>
        <h1 className={styles.heroTitle}>
          Bathroom cleaning tips
          <br />
          <em>that go deeper.</em>
        </h1>
        <p className={styles.heroDesc}>
          The most thorough bathroom cleaning guide available — from toilet
          hygiene and shower grout to mould prevention, limescale removal, and
          the finishing details that define a truly clean bathroom.
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
          ["🚽", "Toilet hygiene"],
          ["🚿", "Shower & bath"],
          ["🧽", "Tiles & grout"],
          ["💧", "Mould prevention"],
          ["✨", "Mirrors & surfaces"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Category tips */}
      <div className={styles.section} id="tips-section">
        <p className={styles.sectionEyebrow}>Fixture by fixture</p>
        <h2 className={styles.sectionTitle}>
          Tips for every part of your bathroom
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
          8 bathroom quick wins for today
        </h2>
        <p className={styles.quickWinsSub}>
          No specialist products, no equipment — just techniques that take under
          2 minutes and produce results you can see and smell immediately.
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
            The principles behind a clean bathroom
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
          Our vetted maids know every technique in this guide. Book a
          professional bathroom clean and come home to a spotless, hygienic
          bathroom — every fixture, every grout line, every surface.
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
