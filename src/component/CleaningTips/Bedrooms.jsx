import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Kitchens.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  {
    icon: "🛏️",
    name: "Mattress & Bed",
    tagline: "You spend a third of your life here — clean it accordingly",
    tips: [
      {
        title: "Vacuum the mattress monthly using the upholstery attachment",
        text: "A mattress that has never been vacuumed contains years of accumulated dead skin cells, dust mite colonies, their waste products, hair, and in many cases residual moisture from perspiration. Vacuuming the mattress surface monthly with the upholstery attachment — using slow, overlapping passes in two perpendicular directions to maximise particle extraction — removes the surface layer of this accumulation. Vacuum both sides if the mattress is flippable. Pay particular attention to the seam tape that runs around the perimeter of the mattress, where dust and debris accumulate in the stitching recesses and are not dislodged by surface vacuuming.",
      },
      {
        title: "Deodorise the mattress with baking soda every 3 months",
        text: "Mattresses absorb perspiration, body oils, and airborne odours continuously throughout their use and off-gas these compounds back into the bedroom environment during the day. Vacuuming removes surface particles but does not address the odour compounds absorbed into the mattress material. Sprinkle a generous and even coat of baking soda over the entire surface, press it lightly into the fabric with your hands, and leave for a minimum of 4 hours — overnight produces significantly better results. Baking soda is alkaline and chemically neutralises the acidic organic compounds responsible for most mattress odour. Vacuum thoroughly to remove every trace before replacing bedding.",
      },
      {
        title:
          "Rotate your mattress every 3 months — flip if it is designed for it",
        text: "Mattresses used without rotation develop permanent compression in the areas most consistently slept on — typically the centre of a single and the occupant sides of a double. This compression reduces support, accelerates the structural deterioration of the spring or foam core, and creates a surface unevenness that affects sleep quality. Rotating the mattress 180 degrees every 3 months distributes the wear evenly around the entire surface. Mattresses described as one-sided should only be rotated, not flipped; traditional double-sided mattresses should be flipped on alternate rotations. A mattress that is consistently maintained lasts twice as long as one that is not.",
      },
      {
        title: "Treat mattress stains immediately with cold water — never hot",
        text: "The most common mattress stain types — perspiration, blood, and biological marks — are protein-based. Hot water denatures these proteins and permanently bonds them to the fabric fibres, setting the stain in a way that no subsequent cleaning can reverse. Always use cold water. For fresh stains: blot firmly with dry towels to absorb maximum moisture, then blot with a cloth dampened in cold water. For biological stains, apply an enzyme cleaner or a mixture of cold water, dish soap, and white vinegar; leave for 10 minutes, then blot. Never saturate the mattress — deep moisture cannot evaporate and creates internal mould. Use a fan or open window to accelerate drying after treatment.",
      },
      {
        title: "Use a mattress protector — and wash it monthly",
        text: "A quality mattress protector is the single most effective intervention in mattress hygiene. It prevents perspiration, skin oils, spills, and biological contamination from penetrating into the mattress core where they are inaccessible to any cleaning method. Choose a breathable protector rather than a pure plastic cover — breathable membrane protectors prevent moisture build-up that makes sleep uncomfortably warm. Machine wash the protector monthly at 60°C. Inspect the protector every 6 months — a waterproofing membrane that has begun to crinkle or crack has failed and should be replaced. The cost of a replacement protector is negligible compared to replacing a mattress.",
      },
      {
        title: "Clean the bed frame, headboard, and slats thoroughly monthly",
        text: "The bed frame accumulates dust on every horizontal surface — particularly the headboard if it is padded or upholstered, the top of the footboard, and along every slat where airflow carries particles. Metal frames wipe clean with a damp microfibre cloth. Wooden frames should be wiped with a cloth barely damp in diluted wood-safe cleaner, then immediately dried. Upholstered headboards should be vacuumed with the upholstery attachment weekly and spot-cleaned with a fabric cleaner as needed. The floor under the bed, the slats, and the base of the frame legs should be included in the monthly floor clean — these areas are consistently the dustiest in the bedroom and the most consistently skipped.",
      },
    ],
  },
  {
    icon: "🪨",
    name: "Dust & Allergens",
    tagline: "Invisible contamination that affects sleep quality every night",
    tips: [
      {
        title: "Follow the top-to-bottom sequence on every single clean",
        text: "Dust accumulates on every horizontal surface and falls downward when disturbed. Cleaning the floor before the surfaces — or even cleaning a low shelf before a higher one — means that particles from higher surfaces fall onto areas you have already cleaned, requiring re-cleaning. The correct sequence is invariable: ceiling and light fittings first, then the top of the wardrobe and high shelves, then mid-height surfaces, then skirting boards, then the floor. In a bedroom this means vacuuming last — not first. This one structural habit eliminates re-cleaning entire surfaces and reduces total cleaning time significantly.",
      },
      {
        title: "Address dust mites at source — not just their symptoms",
        text: "Dust mites are microscopic arachnids that feed on shed human skin cells and thrive in the warm, humid microenvironment of a bed. Every mattress, pillow, and duvet that has been used for more than a few weeks hosts a dust mite colony. It is not possible to eliminate them but their population can be managed below the threshold that triggers allergic responses. The three evidence-based interventions are: weekly washing of bedding at 60°C (the temperature at which mites are killed, not merely removed); monthly mattress vacuuming to reduce available food material; and reducing bedroom humidity below 50% where possible — mites cannot complete their life cycle in low-humidity environments.",
      },
      {
        title:
          "Use a damp microfibre cloth to dust surfaces — never a dry cloth",
        text: "A dry cloth or feather duster does not remove dust — it redistributes it. Dust particles disturbed by a dry cloth become airborne, remain suspended for several minutes, and settle back onto the surfaces you have just dusted within 20 minutes of finishing. A slightly damp microfibre cloth traps dust particles electrostatically — they adhere to the cloth fibres and are removed from the room when the cloth is washed. The cloth should be damp enough to pick up particles without leaving moisture on the surface — wring it until only a slight coolness is perceptible. For electronics, use a dry microfibre cloth only.",
      },
      {
        title: "Clean the tops of wardrobes and high shelves monthly",
        text: "The top surface of a wardrobe accumulates the deepest layer of undisturbed dust in any bedroom — it is invisible from normal standing height and therefore cleaned by almost nobody voluntarily. Dust on the wardrobe top falls into the room air during vibration (from closing doors, passing traffic, footsteps) and settles on every surface below. Use a step ladder to access the surface, vacuum with a brush attachment, and then wipe with a damp cloth. Monthly is sufficient given the accumulation rate. Similarly, the top surfaces of picture frames, ceiling fan blades, and the upper surfaces of curtain poles collect invisible dust deposits that require the same treatment.",
      },
      {
        title: "Ventilate the bedroom every morning for 15 minutes",
        text: "During 7–8 hours of sleep, a bedroom accumulates CO2 exhaled by occupants, water vapour from breathing and perspiration, VOC off-gassing from furniture and bedding materials, and biological particles shed during the night. The concentration of these compounds in an unventilated bedroom at the moment of waking consistently exceeds outdoor air quality by a significant margin. Open the window for a minimum of 15 minutes every morning — ideally while making the bed so the bedding airs simultaneously — before closing it for the day. In harmattan season, ventilate in the early morning before dust levels peak, and wipe the windowsill after closing.",
      },
      {
        title: "Wash all soft furnishings and bedroom textiles regularly",
        text: "Every soft item in the bedroom that is not regularly washed is a dust mite habitat: cushions, throw blankets, fabric headboards, curtains, and bed skirts all accumulate the warm, moist, organic environment that dust mites require. Wash throw cushion covers and blankets monthly at 60°C. Wash curtains every 3 months at the maximum temperature the care label permits. Bed skirts should be washed every 2–3 months. Items that cannot be machine washed — upholstered headboards, fabric-wrapped boxes — should be vacuumed with the upholstery attachment weekly. There is no substitute for regular washing in allergen control.",
      },
    ],
  },
  {
    icon: "👗",
    name: "Wardrobe & Storage",
    tagline: "Where most bedroom clutter actually lives",
    tips: [
      {
        title: "Empty and wipe wardrobes inside twice a year",
        text: "Wardrobe interiors accumulate dust from clothing fibres, fluff from garments, and fine particulate matter that enters through the door gap. The inside base of a wardrobe — beneath hanging clothes and behind shoe storage — is one of the most dust-dense environments in the bedroom and is cleaned by almost nobody. Twice a year, remove all clothing and storage items, vacuum the entire interior including the corners and the shelf surfaces, and wipe down with a slightly damp cloth. Replace items only after the interior is completely dry. A wardrobe that smells musty has a moisture problem — leave the door open for several hours to air before identifying the source.",
      },
      {
        title: "Declutter clothing before every cleaning session",
        text: "A wardrobe that is filled beyond its capacity — where items are compressed together, pushed to the back, and balanced on other items — is impossible to keep clean. Clothing folded into a full wardrobe cannot breathe, retains moisture, and develops the musty smell that many people attribute to the wardrobe itself. Twice a year, remove every item from the wardrobe and decide: keep, donate, or discard. Apply the standard that any item not worn in the previous 12 months is unlikely to be worn in the next 12. A wardrobe at 70–80% capacity is infinitely easier to maintain, smells better, and makes daily use significantly less frustrating.",
      },
      {
        title:
          "Store seasonal clothing in vacuum-sealed bags out of the bedroom",
        text: "Keeping off-season clothing in the same wardrobe as current clothing takes up space that forces active-use clothing to be compressed, makes finding items harder, and increases the total amount of fabric accumulating dust in the room. Vacuum-sealed storage bags compress winter clothing into flat, airtight packages that take a fraction of the storage space, protect from moths and moisture, and can be stored under the bed, in a spare room, or on a high shelf. Label every bag with the contents and the season before storage. This single change reduces the effective volume of a wardrobe by up to 40%.",
      },
      {
        title: "Clean and organise drawers every 3 months",
        text: "Bedroom drawers — particularly underwear and sock drawers — accumulate fabric fluff, dust, small items, and general debris at the base under the stored items. Every 3 months, remove all items from each drawer, vacuum the interior, wipe with a dry cloth, and replace only items that are current and in good condition. Use drawer dividers or simple boxes to separate categories — mixed drawers become disorganised faster than divided ones and are significantly more time-consuming to search through. A clean drawer organises faster than a dirty one and stays organised longer.",
      },
      {
        title: "Wipe down the exterior of wardrobes and dressers weekly",
        text: "Wardrobe door fronts, drawer fronts, handles, and the tops of dressers accumulate a film of skin oils from regular handling, combined with settled dust that adheres to the oily surface and creates a greasy-dusty texture over time. Wipe all exterior surfaces weekly with a damp microfibre cloth — the combination of oil and dust requires moisture to remove effectively, unlike dry dust alone. Pay particular attention to handle areas where oil transfer is highest. For wooden furniture with a lacquer or varnish finish, use a wood-safe cleaner applied to the cloth — not sprayed directly — and buff dry immediately to prevent moisture from penetrating the finish.",
      },
      {
        title:
          "Use cedar blocks or lavender sachets rather than mothballs in storage",
        text: "Traditional mothballs contain naphthalene or paradichlorobenzene — VOC compounds that off-gas into the bedroom air and are classified as potential carcinogens with long-term exposure. Cedar wood blocks and lavender sachets repel moths through natural aromatic compounds that are non-toxic. Cedar blocks lose effectiveness after approximately 6 months and should be refreshed by light sanding to expose fresh wood. Lavender sachets should be replaced annually. Neither is as aggressively effective as chemical mothballs against a severe infestation — in that case, professional treatment is required rather than storage products — but both are appropriate for standard preventive use in an occupied bedroom.",
      },
    ],
  },
  {
    icon: "🪟",
    name: "Floors, Surfaces & Windows",
    tagline: "Every surface you see and every surface you don't",
    tips: [
      {
        title: "Vacuum the bedroom floor in a cross-pattern weekly",
        text: "A single-direction vacuum pass lifts fibres in one orientation and misses particles trapped from the opposite direction of the carpet pile. Vacuuming north-south, then east-west, lifts fibres from both angles and extracts significantly more particles than a single pass. On hard floors, vacuuming is still preferable to sweeping before mopping — sweeping disperses fine particles into the air while vacuuming collects them. In a bedroom with a HEPA-filter vacuum, the cross-pattern approach combined with the correct filter produces measurably better air quality than any other vacuuming method.",
      },
      {
        title: "Clean under and behind furniture twice a year",
        text: "The area under the bed, behind the bedside tables, behind the wardrobe, and in the gap between the wardrobe and the wall accumulates the heaviest concentration of dust in any bedroom — poor airflow, no light, and no reason to clean it voluntarily. Twice a year, pull every piece of furniture away from walls, vacuum the floor and the wall surface thoroughly, wipe walls with a damp cloth if needed, and vacuum along the base of the furniture itself before replacing it. The visible difference in the dust collected from these areas during this twice-yearly clean demonstrates why it is necessary even when they appear clean from the doorway.",
      },
      {
        title: "Wipe skirting boards and door frames monthly",
        text: "Skirting boards and door frames collect the dust that falls from higher surfaces and settles at the lowest point of the wall. They are below eye level when cleaning and therefore perpetually deferred. Wipe them monthly with a barely damp cloth — a single wipe along the top surface of the skirting and the door frame. For skirting boards with ornate profiles, a vacuum crevice tool run along the upper edge before wiping is more effective than a cloth on its own. Skirting boards in a bedroom that are never cleaned develop a visible grey-brown accumulation that makes the room look neglected regardless of how well the other surfaces are maintained.",
      },
      {
        title: "Polish mirrors and glass surfaces with the vinegar method",
        text: "A 50/50 solution of white vinegar and water applied to a lint-free cloth and wiped across mirror and glass surfaces produces a streak-free, film-free finish that standard glass cleaner cannot match consistently. Apply the solution to the cloth — never spray directly onto the mirror, as solution runs into the edge and can loosen the mirror backing over time. Wipe in horizontal strokes, then vertical strokes, and buff with a dry section of the cloth. The vinegar smell dissipates completely within a few minutes of drying. Mirrors cleaned this way stay clear significantly longer between cleans than those cleaned with commercial sprays.",
      },
      {
        title:
          "Clean bedroom windows on an overcast morning for streak-free results",
        text: "The single most common cause of streaky windows is cleaning in direct sunlight — the solution dries before you can wipe it away, leaving mineral deposits on the glass. Choose an overcast day or clean early morning before the sun reaches the bedroom window. Clean the frame and sill before the glass — debris from these surfaces contaminates freshly cleaned glass if cleaned after. Apply solution to the cloth rather than directly to the glass. Use crumpled newspaper or a lint-free cloth rather than paper towels, which leave lint fibres visible in certain light. Work top to bottom in a single direction without circular motions.",
      },
      {
        title: "Place felt pads under all bedroom furniture legs",
        text: "The underside of furniture legs — particularly metal feet and rough-cut wooden feet — scratch and scuff hard bedroom floors with every micro-movement caused by vibration. On carpet, static furniture legs create compression marks that are slow to recover. Self-adhesive felt pads on every leg prevent floor scratching, reduce carpet compression, and make moving furniture for cleaning or rearranging dramatically easier without the noise and floor-marking that unprotected legs cause. Replace felt pads when they begin to slide or accumulate grit on the contact surface — a worn pad traps abrasive particles between it and the floor and accelerates scratching rather than preventing it.",
      },
    ],
  },
  {
    icon: "💡",
    name: "Lighting & Electronics",
    tagline: "Overlooked surfaces that accumulate more than you think",
    tips: [
      {
        title: "Dust light fittings and lamp shades monthly",
        text: "Light fittings and lamp shades in a bedroom collect dust on their upper surfaces that is completely invisible from the floor. When light passes through a dusty shade, it produces a dimmer, yellower quality of light and can cause a faint burning smell as dust contacts the warm bulb surface. Use the soft brush attachment on a vacuum for pleated or fabric lampshades — a cloth can deform the shape. For ceiling pendants and recessed light fittings, use a dry microfibre cloth to wipe the exterior surface. Always turn off the light and allow the bulb to cool before cleaning any light fitting — a cloth touching a hot bulb causes immediate cracking.",
      },
      {
        title:
          "Wipe all switch plates, plug sockets, and charging point covers weekly",
        text: "Light switches, plug socket surrounds, USB charging point covers, and any other regularly-touched wall fixtures accumulate skin oil residue, finger marks, and general contamination at a rate proportional to their use frequency — and light switches are used multiple times daily by every person in the room. Wipe with an antibacterial wipe or a barely damp cloth with mild cleaner weekly. Apply the cleaner to the cloth rather than spraying directly onto the plate — moisture entering a socket surround is a safety hazard. These surfaces are small and the cleaning takes under 60 seconds per room — they are among the highest-return habitual cleaning tasks in any bedroom.",
      },
      {
        title: "Clean electronics with a soft brush before wiping",
        text: "Bedside electronics — alarm clocks, phones, tablets, e-readers, small televisions — attract dust electrostatically and are cleaned infrequently. A soft bristle brush used first to dislodge dust before wiping prevents particles from being pressed into ventilation slots and gaps. For screens, use a dry microfibre cloth in slow horizontal strokes — never paper towels, which scratch anti-reflective coatings, and never cleaning spray applied directly to the screen, which can enter the edge seal and damage the display. A phone charging cable slot that has accumulated lint should be cleared with a wooden toothpick, not a metal tool.",
      },
      {
        title: "Replace air conditioning filter and clean unit covers monthly",
        text: "Bedroom air conditioning units accumulate dust on the intake grille and internal filter at a rate that reduces airflow, increases energy consumption, and distributes captured particles back into the room when the filter is overloaded. Most bedroom AC units have a removable front cover and a washable mesh filter — remove the cover, slide out the filter, rinse under running water, allow to dry completely before replacing, and wipe the cover and grille with a damp cloth. This takes 10 minutes and should happen monthly. An AC unit whose filter has never been cleaned is recirculating the particles it was supposed to capture.",
      },
      {
        title: "Manage charging cables to reduce dust accumulation and hazards",
        text: "Charging cables draped across bedroom surfaces, coiled on the bedside table, or running across the floor create several cleaning problems: they accumulate dust along their entire length, make surface cleaning around them impractical, and create trip hazards. Route cables along the back of furniture using adhesive cable clips or a cable management strip. Keep only one charging cable per device in the bedroom — coiled spare cables belong in a storage drawer. A bedside table with a single cable running along the back edge is cleaned in 10 seconds; one with three cables draped across the surface takes 3 minutes to clean around and another 3 minutes to unknot afterwards.",
      },
    ],
  },
  {
    icon: "🌙",
    name: "Sleep Environment",
    tagline: "A genuinely clean bedroom improves sleep quality measurably",
    tips: [
      {
        title:
          "Change all bedding weekly — duvet cover, pillowcases, and fitted sheet together",
        text: "Bedding accumulates perspiration, skin cells, hair oils, saliva, and environmental particles throughout the week. By day 7, the bacterial count on unwashed bedding has increased by a factor that most people would find unacceptable if they could see it. Wash duvet covers, pillowcases, and fitted sheets together every week. Use a washing temperature of at least 40°C for routine washing and 60°C during illness periods or for allergy management. Use a fragrance-free, hypoallergenic detergent — synthetic laundry fragrance is one of the most common triggers for sleep disruption and skin sensitisation in people who cannot identify a cause.",
      },
      {
        title: "Wash pillows every 3 months and replace them every 1–2 years",
        text: "Pillows absorb more body oil, sweat, and saliva relative to their volume than any other bedding item and develop an internal contamination profile that cannot be addressed by changing the pillowcase alone. Most synthetic pillows are machine washable — wash two together on a gentle 40°C cycle to balance the drum, and tumble dry on low heat until completely dry inside. Pillows not fully dried develop internal mould growth that is invisible but produces a distinctive smell. Replace pillows when they no longer spring back when folded in half — collapsed support affects spinal alignment and sleep quality beyond what any cleaning can restore.",
      },
      {
        title: "Keep the bedroom temperature between 16–19°C for optimal sleep",
        text: "Sleep quality is directly affected by bedroom temperature — the body's core temperature drops as part of the sleep initiation process, and a bedroom that is too warm prevents this process from completing efficiently. The ideal sleep temperature for most adults is 16–19°C. In a hot climate this requires active cooling. A clean, dust-free bedroom with good ventilation achieves this temperature more easily than a stuffy, dust-laden room that retains heat. The relationship between bedroom cleanliness and sleep temperature is direct: dust accumulation reduces airflow efficiency of bedding and increases the insulating effect of air conditioning filters.",
      },
      {
        title:
          "Remove all electronic screens from the bedroom or use a timed plug",
        text: "The cleaning argument for removing screens from the bedroom is separate from the sleep quality argument — electronic devices in the bedroom create cleaning challenges (cables, dust accumulation on multiple surfaces, charger residue on surfaces) while simultaneously producing the blue light wavelengths that suppress melatonin production and delay sleep onset. A bedroom with no screen other than a simple alarm clock is cleaner, requires less maintenance, and produces better sleep conditions. If screens cannot be removed, use a timed plug to cut power — and therefore light emission and electromagnetic field production — during sleeping hours.",
      },
      {
        title:
          "Air the bedroom and bedding every morning before remaking the bed",
        text: "The worst thing you can do for bedroom hygiene immediately after waking is to make the bed. Pulling the duvet over a warm, moisture-laden bed seals the perspiration, CO2, and biological matter from the night's sleep under an insulating layer where it cannot evaporate or dissipate. Open the window and pull back the duvet completely, folding it to the foot of the bed. Leave it uncovered for a minimum of 20 minutes while the bedroom ventilates. This allows moisture to evaporate, the mattress surface to dry, and body-temperature warmth to dissipate — all of which reduce the dust mite habitat that a warm, damp bed represents. Make the bed after — not before — this airing period.",
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: "🛏️",
    time: "30 min",
    tip: "Pull back the duvet every morning and leave the bed uncovered for 20 minutes before making it — moisture evaporates instead of sealing inside.",
  },
  {
    icon: "🧂",
    time: "4 hrs",
    tip: "Sprinkle baking soda over the entire mattress, leave 4 hours or overnight, then vacuum — genuine odour elimination, not masking.",
  },
  {
    icon: "🪣",
    time: "1 min",
    tip: "Use a pillowcase slipped over each ceiling fan blade to wipe it clean — all the dust goes inside the pillowcase, not onto the floor.",
  },
  {
    icon: "💨",
    time: "15 min",
    tip: "Open the bedroom window for 15 minutes every morning — overnight CO2, moisture, and VOC accumulation clears faster than you'd expect.",
  },
  {
    icon: "🧹",
    time: "5 min",
    tip: "Vacuum north-south then east-west — two-direction vacuuming lifts carpet fibres from both angles and removes significantly more particles.",
  },
  {
    icon: "📰",
    time: "2 min",
    tip: "Clean mirrors and bedroom glass with crumpled newspaper and a 50/50 vinegar solution — streak-free every time, no lint.",
  },
  {
    icon: "🔄",
    time: "5 min",
    tip: "Rotate your mattress 180 degrees every 3 months — it distributes wear evenly and doubles the lifespan of the mattress.",
  },
  {
    icon: "👗",
    time: "2 min",
    tip: "Wipe the exterior of your wardrobe doors and handles weekly with a damp cloth — skin oil and dust combine into a greasy film faster than any other surface.",
  },
];

const TIPS = [
  "A bedroom that is genuinely clean improves sleep quality in a measurable way. Reduced allergen load, lower dust mite populations, fresh air, and the psychological effect of an ordered environment all contribute to faster sleep onset and fewer disturbances during the night. Bedroom cleanliness is not purely aesthetic — it has documented health outcomes.",
  "The mattress is the most important surface in the bedroom and the least cleaned. It cannot be replaced as easily as bedding, it cannot be machine washed, and it hosts the highest concentration of biological contamination of any surface in the room. Monthly vacuuming, quarterly baking soda treatment, and a good mattress protector washed monthly are the minimum standard.",
  "Dust mite management is the single most impactful intervention for bedroom air quality. The three effective tools are: 60°C weekly bedding washes, a HEPA vacuum, and reduced bedroom humidity. Chemical sprays marketed as dust mite killers are largely ineffective — the evidence base supports the three physical interventions above.",
  "The biggest cleaning challenge in most bedrooms is not dirt but clutter. A surface covered with objects cannot be cleaned. A wardrobe that is full cannot be maintained. Organisation and decluttering are prerequisites for cleaning — not separate activities. Schedule twice-yearly declutter sessions and treat them as seriously as deep cleaning sessions.",
  "Morning airing is the highest-return bedroom habit that most people never develop. Leaving the bed uncovered for 20 minutes every morning, with the window open, reduces dust mite population, moisture accumulation, and mattress odour more effectively than any product. It costs nothing and requires no additional time — it simply requires doing the other morning tasks before making the bed.",
];

const FAQS = [
  {
    q: "How often should I professionally deep-clean my bedroom?",
    a: "For most households, a professional bedroom deep clean every 3 months maintains the room in excellent condition when combined with a weekly maintenance routine. The professional clean should address the areas that routine cleaning consistently misses: the mattress, behind and under all furniture, the top of the wardrobe, window tracks, ceiling fan blades, and skirting boards. For allergy sufferers or households with pets, a monthly professional clean — particularly for upholstery and the mattress — produces a measurably better health environment.",
  },
  {
    q: "How do I get rid of a musty smell in my bedroom?",
    a: "Musty bedroom smell has three primary sources: moisture accumulation in the mattress or bedding, mould growth in a hidden location (behind furniture against an external wall, in wardrobe corners, or under the bed), or inadequate ventilation causing humidity build-up over time. Investigate all three. Baking soda treatment and thorough airing of the mattress addresses mattress odour. Inspect the room perimeter and inside the wardrobe for visible mould — treat any found with undiluted bleach or white vinegar, depending on the surface material. Daily 15-minute ventilation prevents recurrence. If the smell persists after all interventions, a structural moisture or drainage problem is likely and requires professional assessment.",
  },
  {
    q: "What causes bedroom dust to accumulate so quickly?",
    a: "Bedroom dust accumulates faster than in other rooms for several specific reasons: shed skin cells are produced during sleep at a higher rate than during waking activity; fabric bedding and soft furnishings continuously shed microscopic fibres; the relatively low airflow in a bedroom during sleeping hours allows particles to settle on every surface undisturbed; and wardrobe opening and closing produces a bellows effect that releases stored fabric particles into the room air. Managing the sources — regular bedding washing, limiting soft furnishings, daily ventilation, and consistent vacuuming — reduces accumulation rate more effectively than frequent cleaning of accumulated dust.",
  },
  {
    q: "Is it safe to sleep in a room immediately after cleaning it?",
    a: "It depends on what was used for cleaning. After cleaning with natural products — vinegar, baking soda, fragrance-free detergent — ventilating for 20–30 minutes is sufficient. After using commercial cleaning sprays, disinfectants, or bleach-based products, ventilate for a minimum of 1 hour with the window fully open before sleeping in the room. VOCs from commercial products remain suspended in room air significantly longer than they are perceptible by smell. If the room was cleaned with aerosol products, allow 2 hours of ventilation. When in doubt, extend the ventilation period — the cost is opening a window; the risk of sleeping in VOC-laden air is not negligible over time.",
  },
  {
    q: "How do I prevent dust from settling on bedroom surfaces so quickly?",
    a: "Dust settles on surfaces faster in bedrooms with more soft furnishings (which shed fibres), higher humidity (which makes particles heavier and causes them to drop faster), and less air movement (which allows particles to settle rather than remain suspended until the next ventilation). Practical measures that slow accumulation: wash all soft textiles regularly, maintain bedroom humidity below 50%, ventilate daily to flush particles out of the room, minimise open storage surfaces where particles settle without obstruction, and use anti-static sprays on electronics — the static charge on powered devices actively attracts dust particles.",
  },
  {
    q: "What is the best way to maintain a bedroom with an en-suite bathroom?",
    a: "En-suite bathrooms share humidity between the bathroom and bedroom environment, which increases the allergen and mould risk in the adjacent sleeping space. Run the bathroom extractor for 20 minutes after every shower and keep the en-suite door closed during showering. Inspect the bedroom wall adjacent to the en-suite monthly for condensation or moisture evidence. In addition to the standard bedroom cleaning routine, the en-suite door and bathroom floor area adjacent to the bedroom should be included in the weekly bedroom clean. The higher moisture environment of an en-suite bedroom warrants increasing mattress airing frequency and replacing the mattress protector more frequently.",
  },
];

export default function Bedrooms() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Mattress & Bed");
  const [openTip, setOpenTip] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const category = CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Bedroom cleaning guide</p>
        <h1 className={styles.heroTitle}>
          Bedroom cleaning tips
          <br />
          <em>for better sleep.</em>
        </h1>
        <p className={styles.heroDesc}>
          The most thorough bedroom cleaning guide available — from mattress
          hygiene and dust mite control to wardrobe organisation, air quality,
          and the sleep environment habits that make a genuine difference to how
          you rest every night.
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
          ["🛏️", "Mattress hygiene"],
          ["🪨", "Dust & allergens"],
          ["👗", "Wardrobe care"],
          ["🌙", "Sleep environment"],
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
        <p className={styles.sectionEyebrow}>Area by area</p>
        <h2 className={styles.sectionTitle}>
          Tips for every part of your bedroom
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
          8 bedroom quick wins for today
        </h2>
        <p className={styles.quickWinsSub}>
          Simple habits and techniques — each one takes under 5 minutes and
          produces a measurable improvement in your bedroom environment.
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
            The principles behind a genuinely clean bedroom
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
          professional bedroom clean and wake up to a genuinely fresh, hygienic
          sleeping environment — every surface, every corner.
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
