import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./KidsRooms.module.css";
import FixedHeader from "../FixedHeader";

const SERVICES = [
  {
    icon: "🧸",
    name: "Kid's Room Deep Clean",
    tagline: "Safe, thorough, child-friendly",
    desc: "A comprehensive deep clean of your child's bedroom using child-safe, non-toxic products. Every surface, toy area, floor, and storage space cleaned to a hygienic standard that protects young immune systems.",
    checklist: [
      "Dust and wipe all surfaces and furniture",
      "Vacuum or mop floors under all items",
      "Wipe down toy storage and shelving",
      "Clean windows and window sills",
      "Sanitise light switches and door handles",
      "Vacuum mattress and wipe bed frame",
    ],
    from: "₦8,500",
  },
  {
    icon: "🪀",
    name: "Toy & Play Area Clean",
    tagline: "Germ-free play spaces",
    desc: "A focused clean of toy storage areas, play mats, activity tables, and high-touch toy surfaces. Removes the bacteria and germs that accumulate on frequently handled items that young children put in their mouths.",
    checklist: [
      "Wipe all hard toy surfaces with child-safe disinfectant",
      "Clean and sanitise play mats and foam tiles",
      "Wipe activity tables and play desks",
      "Clean toy storage bins and shelves",
      "Sanitise soft toy surfaces where possible",
      "Clean under and around play areas",
    ],
    from: "₦5,500",
  },
  {
    icon: "🛏️",
    name: "Cot & Nursery Clean",
    tagline: "Safe from day one",
    desc: "A specialist clean for nurseries and rooms with infants or toddlers. Every product used is infant-safe and fragrance-free. Designed for the most vulnerable members of your household.",
    checklist: [
      "Wipe cot or toddler bed with infant-safe product",
      "Clean changing table and mat",
      "Wipe all nursery furniture",
      "Vacuum and sanitise nursery floor",
      "Clean window sills and ledges",
      "Wipe all switches, handles, and vents",
    ],
    from: "₦7,000",
  },
];

const CHECKLIST_AREAS = {
  Surfaces: [
    "Dust all furniture tops and shelves",
    "Wipe desk or activity table",
    "Clean bookshelf and book tops",
    "Wipe wardrobe doors inside and out",
    "Clean bedside table and lamp",
    "Wipe all skirting boards",
  ],
  Floors: [
    "Vacuum carpet or mop hard floor",
    "Move smaller furniture and clean underneath",
    "Clean play mat and foam tiles",
    "Vacuum under the bed",
    "Clean floor edges and corners",
    "Remove all toys from floor before cleaning",
  ],
  Bed: [
    "Vacuum mattress surface",
    "Wipe bed frame and headboard",
    "Wash bedding on 60°C",
    "Wipe bedside rails if fitted",
    "Flip pillow and clean pillow case",
    "Dust under and around bed frame",
  ],
  Toys: [
    "Wipe all hard plastic toys with child-safe disinfectant",
    "Clean toy storage boxes and bins",
    "Wipe activity table and chair",
    "Clean board games and puzzle boxes",
    "Wipe electronic toy surfaces",
    "Sanitise teething toys with infant-safe product",
  ],
};

const REASONS = [
  {
    icon: "🦠",
    title: "Children's immune systems need protection",
    text: "Children under 5 have developing immune systems that are far more vulnerable to bacteria, dust mites, and allergens than adults. Professional cleaning removes the pathogens that accumulate in toys, carpets, and mattresses and that standard dusting never reaches.",
  },
  {
    icon: "🤧",
    title: "Dust mites trigger childhood allergies",
    text: "Children's bedrooms — particularly mattresses, pillows, and stuffed toys — are among the highest concentrations of dust mites in any home. Regular professional vacuuming and mattress treatment significantly reduces dust mite populations and allergy symptoms.",
  },
  {
    icon: "🧴",
    title: "Children put everything in their mouths",
    text: "Toys, play mats, and activity surfaces that children touch and mouth constantly are vectors for illness if not regularly sanitised. Our child-safe disinfectants eliminate germs without leaving chemical residues that could harm young children.",
  },
  {
    icon: "😴",
    title: "Clean rooms mean better sleep",
    text: "A dust-free, well-ventilated bedroom with clean bedding directly improves the quality of a child's sleep. Children who sleep in clean environments wake less frequently, sleep longer, and are less prone to nighttime respiratory symptoms.",
  },
];

const STEPS = [
  {
    title: "Book your kid's room clean",
    text: "Choose your service, select a maid, and pick your date and time. All our professionals are briefed on child-safe product requirements before arrival.",
  },
  {
    title: "Pay securely via Paystack",
    text: "Your payment is held securely. Our team confirms the booking and notes any specific product requirements — fragrance-free, infant-safe — in your booking record.",
  },
  {
    title: "We arrive with child-safe products",
    text: "Every product used in a child's room is non-toxic, fragrance-free where requested, and safe for surfaces children will touch and mouth. Nothing is used that we wouldn't use around our own children.",
  },
  {
    title: "Inspect together",
    text: "Walk through the room on completion. Any area that doesn't meet your standard is re-cleaned on the spot. Your child's safety is our standard, not just your satisfaction.",
  },
];

const TIPS = [
  "Wash children's bedding weekly on 60°C — this temperature kills dust mites, which are the most common trigger of childhood asthma and allergies.",
  "Keep stuffed toys to a rotation — wash soft toys in a mesh laundry bag monthly and store the rest. Fewer toys on display means less surface area for dust.",
  "Vacuum your child's mattress monthly using the upholstery attachment — mattresses accumulate dead skin, dust mites, and sweat rapidly without visible signs.",
  "Open the window in your child's room for at least 10 minutes every morning — fresh air circulation dramatically reduces airborne dust and humidity.",
  "Use a door mat and no-shoes rule near children's rooms — shoes carry in outdoor bacteria, pesticides, and allergens that accumulate in carpet at crawling and playing height.",
];

const FAQS = [
  {
    q: "Are all cleaning products safe for children?",
    a: "Yes. For all children's rooms, we use non-toxic, child-safe cleaning products with no harsh chemical residues. For nurseries and rooms with infants under 12 months, we use fragrance-free, infant-grade products specifically formulated for surfaces young babies will contact. You can specify your product preferences when you book.",
  },
  {
    q: "Do you clean soft toys and stuffed animals?",
    a: "We wipe down the surfaces of soft toys with a child-safe, damp cloth where appropriate. We do not machine wash soft toys as part of a standard clean — this is best done by the parent. We can advise you on the best method for specific toys during the visit.",
  },
  {
    q: "Is it safe to stay in the room while it's being cleaned?",
    a: "All products we use are safe once dried — typically within 5–15 minutes depending on ventilation. For very young children and infants, we recommend keeping them out of the room until surfaces are fully dry. We will let you know when it is safe to re-enter.",
  },
  {
    q: "How do you clean play mats and foam tiles?",
    a: "We wipe foam play mats and interlocking tiles with a diluted child-safe disinfectant and allow them to air dry fully before replacing them. For play mats with deep textures, we use a soft brush to reach into grooves and seams where bacteria accumulate.",
  },
  {
    q: "How often should a child's room be professionally deep-cleaned?",
    a: "For young children under 5, we recommend a professional deep clean every 3–4 weeks alongside your daily and weekly maintenance. For school-age children, every 4–6 weeks is appropriate. Nurseries with infants benefit from a clean every 2–3 weeks, particularly during cold and flu season.",
  },
  {
    q: "Can you clean during nap time or while the child is out?",
    a: "Yes. Many parents prefer the clean to happen during school hours or while the child is out so the room is fresh and dry when they return. We can work quietly if nap time is unavoidable — just let us know when you book and we will schedule and approach accordingly.",
  },
];

export default function KidsRooms() {
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState("Surfaces");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>
          Professional children's room cleaning
        </p>
        <h1 className={styles.heroTitle}>
          Safe, clean spaces
          <br />
          <em>for little ones.</em>
        </h1>
        <p className={styles.heroDesc}>
          Child-safe deep cleans for bedrooms, nurseries, and play areas across
          Abuja and Lagos. Non-toxic products. Germ-free results. Peace of mind
          for parents.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => navigate("/maids")}
          >
            Book a Clean
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() => navigate("/request-a-free-estimate")}
          >
            Get a Free Estimate
          </button>
        </div>
      </div>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          ["✅", "Vetted professionals"],
          ["🌿", "Child-safe products only"],
          ["🍼", "Infant-grade options"],
          ["⚡", "Same-week booking"],
          ["🔒", "Secure payment"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Choose your service</p>
        <h2 className={styles.sectionTitle}>
          What does your child's room need?
        </h2>
        <div className={styles.serviceCards}>
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              className={styles.serviceCard}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={styles.serviceCardBanner} />
              <div className={styles.serviceCardBody}>
                <div className={styles.serviceCardTop}>
                  <div className={styles.serviceCardIcon}>{s.icon}</div>
                  <div>
                    <p className={styles.serviceCardName}>{s.name}</p>
                    <p className={styles.serviceCardTagline}>{s.tagline}</p>
                  </div>
                </div>
                <p className={styles.serviceCardDesc}>{s.desc}</p>
                <div className={styles.checkList}>
                  {s.checklist.map((item) => (
                    <div key={item} className={styles.checkItem}>
                      <div className={styles.checkDot}>✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.serviceCardFooter}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceFrom}>Starting from</span>
                  <span className={styles.priceAmount}>{s.from}</span>
                </div>
                <button
                  className={styles.bookBtn}
                  onClick={() => navigate("/maids")}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Area-by-area checklist */}
      <div className={styles.checklist}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Full checklist
        </p>
        <h2 className={styles.checklistTitle}>Every area, every task</h2>
        <p className={styles.checklistSub}>
          Exactly what is covered in a full kid's room deep clean — nothing
          overlooked.
        </p>
        <div className={styles.areaTabs}>
          {Object.keys(CHECKLIST_AREAS).map((area) => (
            <button
              key={area}
              className={`${styles.areaTab} ${activeArea === area ? styles.areaTabActive : ""}`}
              onClick={() => setActiveArea(area)}
            >
              {area}
            </button>
          ))}
        </div>
        <div className={styles.areaItems}>
          {CHECKLIST_AREAS[activeArea].map((item) => (
            <div key={item} className={styles.areaItem}>
              <div className={styles.areaCheck}>✓</div>
              <span className={styles.areaText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why it matters */}
      <div className={styles.reasons}>
        <p className={styles.sectionEyebrow}>Why it matters</p>
        <h2 className={styles.sectionTitle}>
          Children deserve the cleanest rooms
        </h2>
        <div className={styles.reasonCards}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className={styles.reasonCard}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={styles.reasonIcon}>{r.icon}</div>
              <div>
                <p className={styles.reasonTitle}>{r.title}</p>
                <p className={styles.reasonText}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.timeline}>
        <p className={styles.sectionEyebrow}>The process</p>
        <h2 className={styles.sectionTitle}>
          From booking to spotless — 4 simple steps
        </h2>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s.title} className={styles.step}>
              <div className={styles.stepNum}>{i + 1}</div>
              <div className={styles.stepBody}>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips banner */}
      <div className={styles.tipsBanner}>
        <div className={styles.tipsBannerHeader}>
          <span className={styles.tipsHeaderIcon}>💡</span>
          <p className={styles.tipsHeaderTitle}>
            Tips for keeping children's rooms healthier
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
          Give your child the cleanest room in the house.
        </h2>
        <p className={styles.ctaText}>
          Book a child-safe professional clean in under 2 minutes. All products
          supplied. Infant-safe options available. Satisfaction guaranteed.
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
