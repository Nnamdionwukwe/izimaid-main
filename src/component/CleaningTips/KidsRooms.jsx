import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Kitchens.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  {
    icon: "🧸",
    name: "Toys & Soft Items",
    tagline: "What children touch most carries the most bacteria",
    tips: [
      {
        title:
          "Sort toys by material before cleaning — each type needs a different approach",
        text: "The most common toy cleaning mistake is using one method for everything. Hard plastic toys, soft plush toys, wooden toys, electronic toys, and rubber or bath toys each have different material properties that respond differently to water, heat, and chemical cleaners. Hard plastic tolerates diluted disinfectant or dishwasher cleaning; soft toys require machine washing or freeze treatment; wooden toys are damaged by soaking and require damp wipe only; electronic toys must never be submerged; rubber toys can harbour internal mould if water enters sealed cavities. Sort before you clean — it takes 2 minutes and prevents permanent damage.",
      },
      {
        title:
          "Sanitise hard plastic toys weekly in a vinegar and water solution",
        text: "Hard plastic toys handled daily accumulate bacteria, saliva, and general environmental contamination at a rate that warrants weekly sanitising — particularly for toys handled by children under 5 who regularly put objects in their mouths. A 50/50 solution of white vinegar and water in a spray bottle, applied to the toy and left for 5 minutes before wiping dry, is effective against most common bacteria and safe for contact with children immediately after drying. For heavily soiled plastic toys, the top rack of a dishwasher on a cool cycle works well — check for dishwasher-safe labelling first. Avoid bleach-based products on any toy that will contact a child's mouth.",
      },
      {
        title: "Machine wash soft toys monthly at 60°C to kill dust mites",
        text: "Soft toys are among the highest dust mite environments in a child's bedroom — warm, fabric-covered, frequently held close to a child's face, and rarely washed. Dust mite allergens in soft toys are a documented trigger for childhood respiratory allergies. Wash all machine-washable soft toys at 60°C — this is the temperature at which dust mites are killed. Check the care label: most modern soft toys are machine washable in a pillowcase or mesh laundry bag to protect them. For toys with electronics, batteries, or delicate decoration, the freeze method kills dust mites without washing: seal in a plastic bag and freeze for 24 hours.",
      },
      {
        title: "Clean wooden toys with a barely damp cloth — never soak them",
        text: "Wooden toys are damaged by prolonged moisture exposure — the wood swells, the paint or lacquer lifts, joints separate, and the toy becomes structurally compromised. Clean with a cloth dampened in a solution of mild soap and water, wring it almost completely dry before applying to the wood, wipe quickly, and immediately buff dry with a second cloth. Allow to air dry completely before storage — never store wooden toys while damp. For unfinished wood toys, rub with food-grade mineral oil every few months to prevent drying and cracking.",
      },
      {
        title: "Inspect and replace worn or damaged toys before cleaning",
        text: "Cleaning a toy that has cracks, loose parts, or worn surface coating is counterproductive — cracked plastic harbours bacteria in the crevices that cleaning cannot reach; loose parts become choking hazards during the handling of cleaning; worn painted surfaces on older toys may expose underlying lead-based paint. Inspect every toy for structural integrity before the cleaning session. Discard any toy that is cracked, has detached or loose small parts, or has visible paint degradation on the surface. The safety check and the cleaning session should always happen together.",
      },
      {
        title: "Rotate toy storage to reduce the volume being cleaned at once",
        text: "A child's bedroom with every toy accessible simultaneously produces two problems: overwhelming clutter that makes cleaning difficult and time-consuming, and rapid contamination of a large number of items that are touched but not played with. Implement a toy rotation system — divide the collection into three or four sets, keep one set accessible at a time, and rotate every two to four weeks. The set being cleaned can be sanitised completely during the rotation without the pressure of a child being without their toys. Rotation also renews children's interest in existing toys without purchasing new ones.",
      },
    ],
  },
  {
    icon: "🛏️",
    name: "Beds & Bedding",
    tagline: "Children spend half their lives here — make it genuinely clean",
    tips: [
      {
        title: "Wash children's bedding at 60°C every week",
        text: "Children's bedding accumulates a higher biological load than adult bedding — more sweat, more saliva, more skin debris, and more frequent food contamination from bedtime snacks. The combination of warmth, moisture, and organic material creates ideal conditions for dust mite proliferation and bacterial growth. Wash all bedding — duvet cover, pillowcases, and fitted sheet — every week at 60°C. For children with allergies or eczema, this frequency is not optional. Use fragrance-free, hypoallergenic detergent — synthetic fragrance in laundry products is a documented trigger for childhood skin sensitisation.",
      },
      {
        title: "Vacuum and deodorise the mattress monthly",
        text: "Children's mattresses accumulate dust mites, dead skin cells, sweat absorption, and — particularly for younger children — accident residue that requires more frequent attention than adult mattresses. Vacuum the mattress surface monthly using the upholstery attachment, applying slow overlapping passes in two perpendicular directions. Sprinkle baking soda over the entire surface, leave for a minimum of 30 minutes, and vacuum thoroughly — baking soda absorbs moisture and odours that cleaning spray cannot reach inside the mattress material. Flip or rotate the mattress every 3 months to distribute wear.",
      },
      {
        title: "Use a waterproof mattress protector — and wash it fortnightly",
        text: "A waterproof mattress protector is the single most important purchase for a child's bedroom. It prevents urine, spills, and perspiration from penetrating into the mattress core where they cannot be cleaned. Choose a breathable waterproof protector rather than a pure plastic cover — breathable versions prevent the heat and moisture build-up that makes children uncomfortable and encourages sweating. Wash the protector every two weeks at 60°C. Replace when the waterproof membrane begins to crinkle, delaminate, or fail the water resistance test.",
      },
      {
        title: "Clean the bed frame and under-bed area monthly",
        text: "The space under a child's bed is typically used for storage of toys, books, and miscellaneous items, and accumulates the heaviest dust load of any area in the bedroom — partly due to reduced airflow and partly due to items blocking cleaning access. Clear the under-bed area completely once a month, vacuum the floor thoroughly including the edges along the bed legs, and vacuum along the bed frame base. Wipe the bed frame itself — including the headboard and any decorative elements that collect dust — with a damp cloth. The under-bed area should be treated as a cleaning priority, not an afterthought.",
      },
      {
        title: "Wash and inspect pillows every 3 months",
        text: "Children's pillows absorb more sweat, drool, and hair oil relative to their size than adult pillows and therefore require more frequent washing. Most synthetic pillows are machine washable — wash two together to balance the drum, on a gentle cycle at 40°C or as per the care label, and tumble dry on low until completely dry. Pillows not thoroughly dried develop mould inside the filling. Check the pillow support by folding it in half — if it does not spring back, the support has collapsed and it should be replaced. Replace children's pillows every 1–2 years regardless of apparent condition.",
      },
      {
        title:
          "Establish a daily bed-making habit from the earliest possible age",
        text: "A made bed changes the entire visual impression of a child's bedroom more than any other single action — it transforms a messy-looking room into a tidy one in under 2 minutes. Beyond aesthetics, a made bed allows bedding to air during the day rather than remaining bunched, which reduces moisture and dust mite accumulation. Involve children in making their own beds from age 3 upward — the standard needed at age 3 is simply sheets pulled up; perfection is not the goal. A child who makes their bed daily develops a maintenance habit that extends naturally to keeping the rest of their space tidy.",
      },
    ],
  },
  {
    icon: "🎨",
    name: "Art & Craft Areas",
    tagline: "Creativity and cleanliness can coexist — with the right system",
    tips: [
      {
        title:
          "Contain art and craft activity to a defined, easy-to-clean zone",
        text: "The single most effective art and craft cleaning strategy is containment. Designate a specific surface — ideally a table with a washable or wipe-clean top — for all art and craft activities. Cover it with a washable tablecloth, a PVC-backed craft mat, or a large sheet of paper during sessions. At the end of every session, the mat is wiped, shaken, or discarded, and the contaminated zone is contained rather than spread across the bedroom floor and adjacent surfaces. A child allowed to do craft on their bed, carpet, or in multiple locations distributes the cleaning problem across the entire room.",
      },
      {
        title: "Remove paint and glue stains immediately before they cure",
        text: "Most craft materials — including washable paints, PVA glue, and modelling clay — are designed to be removed while wet and are extremely difficult to remove once cured. The moment a craft session ends, wipe all surfaces immediately, rinse fabric items before the paint or glue dries, and address carpet spots with cold water and a cloth while still wet. Dried washable paint on carpet responds to a mixture of cold water and dish soap blotted firmly. Dried PVA glue on hard surfaces peels off cleanly once dry. The rule: act within 5 minutes of a spill and it takes 30 seconds to clean; act the next morning and it takes 30 minutes.",
      },
      {
        title: "Store art supplies in clearly labelled, airtight containers",
        text: "Open art supply storage — pencils scattered in a drawer, paint pots with loose lids, glue sticks without caps — results in dried-out materials, contaminated surfaces, and a cleaning challenge before any craft session begins. Store every category of art supply in its own airtight container: pencils in a pot, paints in a lidded box, glue in a sealed tray. Label every container clearly enough for the child to return items independently. Airtight storage also extends the life of materials significantly — oil-based and water-based materials last indefinitely in sealed storage versus days in open air.",
      },
      {
        title: "Clean paintbrushes, rollers, and tools immediately after use",
        text: "Paintbrushes not cleaned within 30 minutes of water-based paint use become permanently stiff — the acrylic binder in the paint cures around the bristles. Rinse in warm water immediately after use, working the water through the bristles from the base toward the tip. For oil-based paints, rinse in the appropriate solvent before water washing. Reshape the bristles by hand before storing — always store brushes bristle-up or flat, never bristle-down which permanently deforms the shape. A clean, well-maintained brush set used by a child is a better educational tool than a collection of ruined brushes.",
      },
      {
        title: "Wash children's hands before and after all craft activities",
        text: "Art and craft materials — even those labelled child-safe — contain dyes, binders, and chemicals that should not be ingested or remain on skin for extended periods. Establish a hand-washing routine that brackets every craft session: hands washed before (to prevent product contamination from dirty hands), and hands washed immediately after (to remove any product absorbed into the skin during the session). This habit also prevents dye transfer from hands to furniture, fabrics, and walls during the movement around the room that inevitably follows a craft session.",
      },
    ],
  },
  {
    icon: "🌬️",
    name: "Air Quality & Allergens",
    tagline:
      "Children breathe more air per kilogram than adults — quality matters more",
    tips: [
      {
        title: "Use a HEPA vacuum in children's bedrooms — not a standard one",
        text: "Standard vacuum cleaners with non-HEPA filters extract particles from the carpet or floor and exhaust the fine particles — including dust mite waste, which is the primary indoor allergen trigger — back into the room air through the exhaust. A HEPA (High Efficiency Particulate Air) filter captures 99.97% of particles down to 0.3 microns, which includes dust mite waste, pet dander, mould spores, and pollen. In a child's bedroom, the difference in air quality between a standard vacuum and a HEPA vacuum is measurable and clinically significant for children with respiratory sensitivities. The filter must be replaced on schedule to maintain its effectiveness.",
      },
      {
        title: "Keep soft furnishings to a minimum in a child's bedroom",
        text: "Every soft surface in a child's bedroom — stuffed animals, fabric wall hangings, upholstered seating, carpet, curtains, rugs — is a reservoir for dust mites, dander, and allergens. The more soft surfaces there are, the higher the allergen load in the room. This does not mean a bedroom should be bare — it means the decision about what soft items to include should be deliberate. A hard floor with a washable rug is easier to maintain than carpet. Roller blinds are easier to clean than curtains. A limited selection of regularly washed soft toys is better than a large collection that is never cleaned.",
      },
      {
        title: "Ventilate the bedroom for at least 15 minutes every morning",
        text: "Children's bedrooms accumulate CO2, moisture from breathing, and VOC off-gassing from furniture and bedding throughout the night. The concentration of these compounds in an unventilated room first thing in the morning is consistently higher than outdoor air quality. Open the window for a minimum of 15 minutes every morning before the room is used during the day — ideally while making the bed, so the bedding airs simultaneously. In harmattan season, ventilate in the early morning before dust levels rise, and use a damp cloth to wipe windowsills after closing.",
      },
      {
        title:
          "Wash curtains every 3 months and replace with roller blinds if allergies are an issue",
        text: "Curtains in a child's bedroom accumulate dust, dander, and allergens continuously between washes. Most curtain fabrics require machine washing but do not carry specific allergen control certifications — the wash removes surface contamination but does not guarantee allergen levels comparable to a hard blind surface. For children with diagnosed dust mite or pet dander allergies, replacing curtains with easy-wipe roller blinds is a clinically supported intervention that consistently reduces bedroom allergen load. Where curtains are retained, wash at the maximum temperature the care label permits, every 3 months.",
      },
      {
        title:
          "Use fragrance-free, hypoallergenic products for all bedroom cleaning",
        text: "Synthetic fragrances in cleaning products, fabric conditioners, and air fresheners are among the most common triggers for childhood respiratory sensitisation — the process by which a child develops an allergy or asthma response to a substance through repeated low-level exposure. Use fragrance-free laundry detergent for all bedroom linen. Use fragrance-free surface cleaners for bedroom surfaces. Never use aerosol air fresheners in a child's bedroom — they deposit synthetic fragrance particles on every surface and into the room air. Genuine cleanliness has no smell; fragrance is a masking agent that deposits chemicals, not a cleaning outcome.",
      },
    ],
  },
  {
    icon: "🗂️",
    name: "Organisation & Tidying",
    tagline: "A tidy room is easier to clean — and easier to keep clean",
    tips: [
      {
        title: "Design storage that children can use independently from age 3",
        text: "Storage that a child cannot access independently creates a dependency on adults for every tidy-up and guarantees that items are not returned between adult interventions. Design storage at the child's height: low open shelves, baskets at floor level, hooks at child height. Label storage with pictures for pre-readers and words alongside pictures for early readers. The standard for independent storage is: the child can retrieve and return any item without asking for help. When this is achievable, tidying transitions from an adult task to an age-appropriate responsibility.",
      },
      {
        title:
          "Implement a 10-minute end-of-day tidy as a non-negotiable routine",
        text: "The gap between a tidy room and a chaotic one is almost always a consistent daily reset, not a periodic deep clean. A 10-minute tidy at the end of every day — before bed, or immediately after school — prevents the accumulation of disorder that eventually requires an hour to address. Involve the child from the earliest possible age: even a 2-year-old can put a block in a bucket with guidance. The routine matters more than the standard. A child who tidies imperfectly every day develops better habits than one who tidies perfectly once a week under adult supervision.",
      },
      {
        title: "Declutter the bedroom with the child twice a year",
        text: "Children's belongings accumulate faster than any other household category — birthday presents, school art projects, outgrown books and toys, and the general debris of childhood. Twice a year, do a declutter session with the child present. Involve them in the decisions — items to keep, items to donate, items to discard — framed as a positive process of making room for new things and giving unused items to children who need them. A child who participates in decluttering develops an understanding of the relationship between possessions and space that most adults never learn. The bedroom after a joint declutter is dramatically easier to clean and maintain.",
      },
      {
        title: "Keep a dedicated laundry basket in the bedroom — not the floor",
        text: "Clothing discarded on bedroom floors is the primary driver of bedroom disorder and the primary obstacle to floor vacuuming in children's rooms. A clearly designated, accessible laundry basket in a fixed location removes the alternative that floor-discarding represents. Choose a basket that is easy to carry to the washing machine and large enough for one week's worth of clothing for the child's age group. Establish the expectation from age 3 that clothing removed from the body goes directly into the basket. The floor is not a wardrobe; this distinction, established early, prevents the adult version of the same behaviour.",
      },
      {
        title: "Clean as you go during play — not only after it ends",
        text: "A cleaning session at the end of a play period addresses an already-large accumulation of disorder. A simple rule applied during play — before a new set of toys comes out, the previous set goes away — keeps the room manageable at all times and teaches children a habit of proportional management rather than deferred clearing. This rule applied consistently means the end-of-day tidy is a 5-minute reset rather than a 20-minute challenge. It also produces a calmer play environment — research consistently shows children play more creatively in less cluttered spaces.",
      },
    ],
  },
  {
    icon: "🧴",
    name: "Safe Cleaning Products",
    tagline: "What you clean with matters as much as how you clean",
    tips: [
      {
        title:
          "Understand what child-safe actually means on a cleaning product label",
        text: "The term 'child-safe' on a cleaning product is not a regulated claim — it is a marketing statement that means different things from different manufacturers. A genuinely child-safe cleaning product for a bedroom context is one that: contains no synthetic fragrances, no harsh solvents, no bleach or chlorine compounds, is biodegradable, and has an independent certification such as EU Ecolabel, Nordic Swan, or a paediatric safety certification. Read the ingredient list, not just the front label. If the product contains ethanol, quaternary ammonium compounds, sodium hypochlorite, or synthetic perfumes, it is not appropriate for routine use in a child's sleeping space.",
      },
      {
        title:
          "Use white vinegar and baking soda as your primary bedroom cleaners",
        text: "White vinegar (5% acetic acid) and baking soda (sodium bicarbonate) clean and deodorise effectively without any chemical residue that poses a risk to children. Diluted white vinegar — 50/50 with water — cleans hard surfaces, glass, and plastic toys effectively and dries without residue. Baking soda sprinkled on fabric surfaces, left, and vacuumed deodorises without any chemical application. Neither product contains VOCs, synthetic fragrances, or compounds that require rinsing from surfaces before a child comes into contact with them. They are the most appropriate general cleaners for a child's bedroom by a wide margin.",
      },
      {
        title: "Never use aerosol sprays in a child's bedroom",
        text: "Aerosol cleaning sprays, air fresheners, furniture polishes, and fabric refreshers deposit fine droplets of chemical compounds throughout the room air and onto all surfaces — including bedding, pillows, and soft toys that the child will subsequently put against their face. Aerosol particles remain suspended in room air for 30–60 minutes after spraying. In a child's bedroom, use spray-free alternatives: apply products to a cloth before use, use pump spray bottles rather than aerosols, and never use aerosol air fresheners or fabric sprays. Open the window instead of using any airborne fragrance product.",
      },
      {
        title: "Store all cleaning products locked away from children",
        text: "Cleaning products — including those labelled child-safe or natural — should never be accessible to children. Child-resistant packaging is not child-proof packaging; it slows access, it does not prevent it. Store all cleaning products, including vinegar, baking soda mixes, and commercial products, in a locked cupboard at adult height. The NHS and poison control centres consistently report cleaning product ingestion as one of the most common causes of domestic child poisoning. The accessibility of a product is the primary risk factor — a locked cupboard eliminates the risk regardless of the product's toxicity.",
      },
      {
        title: "Air the bedroom for 30 minutes after any cleaning session",
        text: "Even the most gentle, natural cleaning products produce some level of VOC or compound in the air during application. After any cleaning session — including mopping with diluted vinegar, spraying surfaces, or washing bedding with fragrance-free detergent — open the bedroom window fully for a minimum of 30 minutes before the child occupies the room. This allows any airborne compounds to disperse and ensures the room air quality is equivalent to outdoor air before a child breathes it during sleep. This is a non-negotiable step, not an optional one.",
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: "🧸",
    time: "1 min",
    tip: "Put soft toys in a sealed bag and freeze overnight — it kills dust mites without washing, and works on toys that can't be machine washed.",
  },
  {
    icon: "🛏️",
    time: "2 min",
    tip: "Strip the bed and sprinkle baking soda on the mattress while washing the bedding — vacuum it up when the laundry is done.",
  },
  {
    icon: "🎨",
    time: "30 sec",
    tip: "Place a PVC tablecloth under art activities — clean-up takes 30 seconds instead of 20 minutes.",
  },
  {
    icon: "🪣",
    time: "1 min",
    tip: "A damp rubber glove dragged across carpet and fabric surfaces picks up every hair and piece of fluff in seconds.",
  },
  {
    icon: "🧴",
    time: "30 sec",
    tip: "Spray hard plastic toys with a 50/50 vinegar and water solution, leave 5 minutes, wipe — safe for mouths, effective against bacteria.",
  },
  {
    icon: "📦",
    time: "2 min",
    tip: "Rotate one third of toys into a box — the room becomes instantly tidier and children play more engagedly with what remains.",
  },
  {
    icon: "💨",
    time: "30 sec",
    tip: "Open the bedroom window for 15 minutes every morning — overnight CO2 and VOC accumulation clears faster than you'd think.",
  },
  {
    icon: "🧹",
    time: "10 min",
    tip: "A 10-minute end-of-day tidy with the child beats any deep clean — the room is always manageable, never overwhelming.",
  },
];

const TIPS = [
  "Children's bedrooms require more frequent cleaning than adult bedrooms — more skin debris, more saliva, more food contamination, and more physical contact with every surface in the room. The cleaning schedule that works for an adult bedroom is insufficient for a child's sleeping and play environment.",
  "The most impactful single investment in a child's bedroom cleanliness is a HEPA vacuum. The difference between vacuuming with a standard filter and a HEPA filter is the difference between moving allergens around the room and actually removing them. For children with any respiratory sensitivity, this is not a luxury.",
  "Child-safe cleaning is as much about what you don't use as what you do. Synthetic fragrances, aerosol sprays, bleach-based products, and harsh solvents have no place in a child's bedroom. White vinegar, baking soda, fragrance-free detergent, and warm water handle 95% of the cleaning required — safely and effectively.",
  "Organisation is not separate from cleanliness — it is the prerequisite for it. A bedroom that cannot be tidied independently by the child will not be cleaned effectively by anyone. Design the storage, establish the habits, and involve the child in the process. The return is a bedroom that is easier to clean and a child who understands how to maintain a space.",
  "Dust mites are the invisible occupants of every children's bedroom. They cannot be eliminated, but their population can be managed below the threshold that triggers allergic responses. The three most effective interventions are: 60°C laundry for all bedding weekly, monthly mattress vacuuming and deodorising, and limiting the soft furnishings that serve as their habitat.",
];

const FAQS = [
  {
    q: "How do I remove crayon marks from painted walls?",
    a: "For crayon on standard emulsion paint, a small amount of non-gel white toothpaste applied to the mark and rubbed gently with a soft cloth removes most crayon wax residue without damaging the paint surface. For washable paint finishes, a magic eraser (melamine foam) used with light pressure is highly effective. For marks on gloss or satin paint, a cloth barely dampened with rubbing alcohol removes crayon without lifting the paint finish. Act while the marks are fresh — crayon that has been on a wall for months has had the wax absorbed further into the paint surface and is harder to remove.",
  },
  {
    q: "How do I clean a child's mattress after a bedwetting accident?",
    a: "Act immediately. Remove all bedding and the mattress protector and put them in the wash. Blot the mattress surface with dry towels, pressing firmly to absorb as much moisture as possible — do not rub, as this spreads the contamination and pushes it deeper. Mix a solution of cold water, a small amount of dish soap, and white vinegar, apply to the affected area with a cloth, and blot again. Sprinkle baking soda generously over the entire damp area and leave for several hours — overnight if possible — then vacuum. Never use hot water or heat-dry a wet mattress as this sets protein-based stains. The mattress must be completely dry before replacing the bedding.",
  },
  {
    q: "What is the safest disinfectant to use in a child's bedroom?",
    a: "The safest effective disinfectant for a child's bedroom is a 50/50 white vinegar and water solution — it kills most common bacteria and viruses on contact and leaves no chemical residue after drying. For situations requiring a higher level of disinfection (illness in the home, confirmed viral contamination), a hydrogen peroxide solution (3%, available from pharmacies) is effective against a broader spectrum of pathogens and is safe once dry with no harmful residue. Avoid bleach-based products in sleeping areas — the chlorine compounds off-gas and remain in the air for hours. If commercial products are required, choose those with an independent safety certification and fragrance-free formulation.",
  },
  {
    q: "How do I get rid of the musty smell in my child's bedroom?",
    a: "A musty smell in a child's bedroom has one of three primary sources: mould growth in a hidden location (behind furniture, under the bed, in the wardrobe), accumulated moisture in the mattress or soft toys, or inadequate ventilation causing general humidity build-up. Investigate all three before treating the symptom. Inspect the room perimeter for mould, particularly at the base of exterior walls and in corners behind furniture. Remove and inspect the mattress — a smell from the mattress requires baking soda treatment and extended airing. Open the window daily and wash all bedding including duvet and pillows. If the smell persists after all these steps, a structural moisture issue is likely and requires a professional assessment.",
  },
  {
    q: "At what age can children clean their own rooms?",
    a: "From age 2: putting toys in containers with adult guidance. From age 3: making the bed to an approximate standard, putting dirty clothes in the laundry basket, returning toys to their storage. From age 5: more thorough bed-making, tidying the full room with minimal prompting, putting laundry away. From age 7: vacuuming with supervision, wiping surfaces, changing their own bedding. From age 10: fully independent bedroom maintenance with weekly checks. The key across all ages is not the standard of the result but the consistency of the habit — a 4-year-old who tidies imperfectly every day develops better maintenance skills than one who tidies perfectly once a week under pressure.",
  },
  {
    q: "How do I prevent mould growing on children's bathroom toys?",
    a: "Bath toys with holes are the primary issue — water enters and cannot escape or dry, creating an interior mould environment within days. The simplest solution is to seal the holes with a hot glue gun — eliminating the cavity entirely. For toys with holes that cannot be sealed, squeeze out all water after every bath and air them in a dry location — not left in a wet bath tray. Weekly, soak all bath toys in a solution of white vinegar and water for 30 minutes, rinse, and allow to air dry. Any bath toy that has visible mould emerging from internal holes — brown or black discharge when squeezed — should be discarded immediately and not returned to use.",
  },
];

export default function KidsRooms() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Toys & Soft Items");
  const [openTip, setOpenTip] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const category = CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Kids' room cleaning guide</p>
        <h1 className={styles.heroTitle}>
          Cleaning kids' rooms
          <br />
          <em>the right way.</em>
        </h1>
        <p className={styles.heroDesc}>
          The most thorough children's bedroom cleaning guide available — safe
          products, toy sanitisation, dust mite control, organisation systems,
          and the habits that keep a kids' room genuinely clean between
          professional visits.
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
          ["🧸", "Toy sanitisation"],
          ["🛏️", "Beds & bedding"],
          ["🌬️", "Air quality"],
          ["🧴", "Safe products"],
          ["✅", "Child-safe methods"],
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
          Tips for every part of a child's bedroom
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
          8 kids' room quick wins for today
        </h2>
        <p className={styles.quickWinsSub}>
          Safe, simple, and effective — each one takes under 2 minutes and makes
          a visible difference immediately.
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
            The principles behind a genuinely clean kids' room
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
          Our vetted maids use child-safe products and know every technique in
          this guide. Book a professional kids' room clean and give your child a
          genuinely hygienic, fresh space.
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
