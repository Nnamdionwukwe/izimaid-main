import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ApartmentCleaning.module.css";
import FixedHeader from "../FixedHeader";

const SIZES = [
  {
    icon: "🏠",
    name: "Studio",
    size: "Up to 40m²",
    title: "Studio Apartment Clean",
    duration: "2–3 hours",
    from: "₦6,000",
    desc: "A compact but thorough clean of your studio. Every corner covered — bathroom, kitchenette, sleeping area, and floors — in a single focused session.",
    checks: [
      "Bathroom deep-clean",
      "Kitchenette wipe-down",
      "Vacuum & mop floors",
      "Dust all surfaces",
      "Clean mirrors & glass",
      "Empty bins",
    ],
  },
  {
    icon: "🏢",
    name: "1 Bedroom",
    size: "40–70m²",
    title: "1-Bedroom Apartment Clean",
    duration: "3–4 hours",
    from: "₦9,000",
    desc: "Perfect for single professionals or couples. We cover the bedroom, living area, kitchen, and bathroom thoroughly — leaving every room spotless.",
    checks: [
      "Bedroom dusting & vacuuming",
      "Full bathroom scrub",
      "Kitchen clean",
      "Living room tidy",
      "Mop all floors",
      "Clean skirting boards",
    ],
  },
  {
    icon: "🏬",
    name: "2 Bedroom",
    size: "70–110m²",
    title: "2-Bedroom Apartment Clean",
    duration: "4–5 hours",
    from: "₦14,000",
    desc: "Our most popular apartment clean. Two bedrooms, full bathroom, kitchen, and living areas — handled room by room to our complete checklist.",
    checks: [
      "2 bedrooms cleaned",
      "Full bathroom & WC",
      "Kitchen deep-clean",
      "Living & dining area",
      "All floors vacuumed & mopped",
      "Wipe all surfaces",
    ],
  },
  {
    icon: "🏰",
    name: "3 Bedroom",
    size: "110m²+",
    title: "3-Bedroom Apartment / Condo",
    duration: "5–7 hours",
    from: "₦20,000",
    desc: "Larger homes get the full treatment. Three bedrooms, multiple bathrooms, and living areas cleaned to the highest standard — often with a team of two.",
    checks: [
      "3 bedrooms deep-cleaned",
      "2+ bathrooms scrubbed",
      "Full kitchen clean",
      "All living areas",
      "Balcony & terrace",
      "All floors done",
    ],
  },
];

const ROOMS = {
  Bedrooms: [
    "Dust all furniture & surfaces",
    "Vacuum carpet / mop floor",
    "Wipe wardrobe doors inside & out",
    "Clean mirrors & glass",
    "Wipe skirting boards",
    "Clean light switches & sockets",
    "Vacuum under bed",
    "Make bed (if linen provided)",
  ],
  Kitchen: [
    "Wipe all countertops & surfaces",
    "Clean sink & taps",
    "Degrease hob & extractor hood",
    "Wipe cabinet doors & handles",
    "Clean inside microwave",
    "Wipe appliance exteriors",
    "Clean tiles & backsplash",
    "Mop kitchen floor",
  ],
  Bathroom: [
    "Scrub toilet, cistern & seat",
    "Clean shower & screen",
    "Descale taps & showerhead",
    "Scrub tiles & grout",
    "Clean mirrors & cabinets",
    "Wipe vanity & surfaces",
    "Disinfect floor",
    "Replace bin liner",
  ],
  "Living Areas": [
    "Dust all surfaces & furniture",
    "Vacuum sofa & cushions",
    "Vacuum / mop floor",
    "Wipe skirting boards",
    "Clean light switches",
    "Wipe door frames & handles",
    "Tidy & organize surfaces",
    "Clean balcony door glass",
  ],
};

const BENEFITS = [
  {
    icon: "🏙️",
    title: "Built for apartment living",
    text: "We understand the unique challenges of apartments — shared hallways, small kitchens, compact bathrooms. Our maids are trained specifically for urban apartment environments.",
  },
  {
    icon: "🔑",
    title: "No need to be home",
    text: "Many apartment residents give key access or work through their building's front desk. We let you know when we arrive and send a photo confirmation on completion.",
  },
  {
    icon: "📅",
    title: "Recurring or one-time",
    text: "Need a weekly tidy or a one-off deep clean? Both options available for any apartment size. Set up a recurring plan and never think about it again.",
  },
  {
    icon: "🛋️",
    title: "Respectful of your space",
    text: "We treat your apartment like our own. Nothing moved without being put back, nothing touched that shouldn't be. Your privacy and belongings are always respected.",
  },
];

const BUILDINGS = [
  { emoji: "🏢", name: "High-Rise Flats", desc: "Lekki, VI, Ikoyi, Wuse" },
  { emoji: "🏘️", name: "Estate Apartments", desc: "Gated communities" },
  { emoji: "🏨", name: "Serviced Apartments", desc: "Short-let & corporate" },
  { emoji: "🏠", name: "Terraced Houses", desc: "3–4 bedroom terrace" },
  { emoji: "🏗️", name: "New Developments", desc: "Move-in ready clean" },
  { emoji: "🛏️", name: "Airbnb Units", desc: "Turnover & guest-ready" },
  { emoji: "🏬", name: "Duplex & Maisonette", desc: "Multi-floor homes" },
  { emoji: "🏰", name: "Penthouse & Condo", desc: "Premium large spaces" },
];

const TIPS = [
  "Tidy personal items off surfaces before your maid arrives — it helps us clean faster and more thoroughly.",
  "Let your building security or front desk know in advance if your maid will need access.",
  "For deep cleans, emptying the fridge and clearing the oven beforehand saves significant time.",
  "Book recurring cleans for your Airbnb between every guest checkout to guarantee 5-star reviews.",
  "If you have pets, mention it when booking so your maid can bring the right tools for pet hair.",
];

const FAQS = [
  {
    q: "Can you clean without me being home?",
    a: "Yes — many of our apartment customers provide key access or arrange entry through their building's concierge or security desk. We notify you on arrival and send a message when the clean is complete.",
  },
  {
    q: "How long does an apartment clean take?",
    a: "A studio typically takes 2–3 hours. A 1-bed is 3–4 hours, a 2-bed is 4–5 hours, and a 3-bed apartment can take 5–7 hours. For larger spaces we may send a team of two.",
  },
  {
    q: "Do you clean Airbnb apartments between guests?",
    a: "Absolutely — it's one of our most popular services. We offer same-day turnover cleans, fresh linen changes, and a photo confirmation so you can verify remotely before your next guest arrives.",
  },
  {
    q: "Can I add extra rooms or balcony cleaning?",
    a: "Yes. Just mention any extras — balcony, extra bathrooms, inside appliances — in your booking notes. We'll include them in your session and adjust the time accordingly.",
  },
  {
    q: "Do I need to provide any supplies?",
    a: "No. Our maids bring all equipment and eco-friendly cleaning products. If you have specific products you prefer, leave them out and let us know in the booking notes.",
  },
];

export default function ApartmentCleaning() {
  const navigate = useNavigate();
  const [activeSize, setActiveSize] = useState(0);
  const [activeRoom, setActiveRoom] = useState("Bedrooms");
  const [openFaq, setOpenFaq] = useState(null);

  const panel = SIZES[activeSize];

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Apartment & condo cleaning</p>
        <h1 className={styles.heroTitle}>
          Your apartment,
          <br />
          <em>perfectly clean.</em>
        </h1>
        <p className={styles.heroDesc}>
          Professional cleaning for studios, 1–3 bedroom apartments, condos, and
          high-rise flats across Abuja and Lagos.
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

      {/* Size selector */}
      <div className={styles.sizeSection}>
        <p className={styles.sectionEyebrow}>Choose your size</p>
        <h2 className={styles.sectionTitle}>What size is your apartment?</h2>
        <div className={styles.sizeTabs}>
          {SIZES.map((s, i) => (
            <button
              key={s.name}
              className={`${styles.sizeTab} ${activeSize === i ? styles.sizeTabActive : ""}`}
              onClick={() => setActiveSize(i)}
            >
              <div className={styles.sizeTabIcon}>{s.icon}</div>
              <p className={styles.sizeTabName}>{s.name}</p>
              <p className={styles.sizeTabSize}>{s.size}</p>
            </button>
          ))}
        </div>
        <div className={styles.sizePanel}>
          <div className={styles.sizePanelHeader}>
            <div>
              <p className={styles.sizePanelTitle}>{panel.title}</p>
              <p className={styles.sizePanelDuration}>
                Approx. {panel.duration}
              </p>
            </div>
            <span className={styles.sizePanelPrice}>From {panel.from}</span>
          </div>
          <div className={styles.sizePanelBody}>
            <p className={styles.sizePanelDesc}>{panel.desc}</p>
            <div className={styles.checkGrid}>
              {panel.checks.map((c) => (
                <div key={c} className={styles.checkItem}>
                  <div className={styles.checkDot}>✓</div>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Room checklist */}
      <div className={styles.included}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Full checklist
        </p>
        <h2 className={styles.includedTitle}>What we clean, room by room</h2>
        <p className={styles.includedSub}>
          Every item below is covered — no hidden extras.
        </p>
        <div className={styles.roomTabs}>
          {Object.keys(ROOMS).map((room) => (
            <button
              key={room}
              className={`${styles.roomTab} ${activeRoom === room ? styles.roomTabActive : ""}`}
              onClick={() => setActiveRoom(room)}
            >
              {room}
            </button>
          ))}
        </div>
        <div className={styles.roomItems}>
          {ROOMS[activeRoom].map((item) => (
            <div key={item} className={styles.roomItem}>
              <div className={styles.roomCheck}>✓</div>
              <span className={styles.roomText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className={styles.benefits}>
        <p className={styles.sectionEyebrow}>Why us</p>
        <h2 className={styles.sectionTitle}>Made for apartment dwellers</h2>
        <div className={styles.benefitCards}>
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className={styles.benefitCard}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={styles.benefitIcon}>{b.icon}</div>
              <div>
                <p className={styles.benefitTitle}>{b.title}</p>
                <p className={styles.benefitText}>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Building types */}
      <div className={styles.buildingTypes}>
        <p className={styles.sectionEyebrow}>We service</p>
        <h2 className={styles.sectionTitle}>Every type of urban home</h2>
        <div className={styles.buildingGrid}>
          {BUILDINGS.map((b) => (
            <div key={b.name} className={styles.buildingCard}>
              <div className={styles.buildingEmoji}>{b.emoji}</div>
              <p className={styles.buildingName}>{b.name}</p>
              <p className={styles.buildingDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className={styles.tipStrip}>
        <div className={styles.tipStripHeader}>
          <span className={styles.tipHeaderIcon}>💡</span>
          <p className={styles.tipHeaderTitle}>
            Tips for a better apartment clean
          </p>
        </div>
        <div className={styles.tipList}>
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
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Apartment cleaning — answered</h2>
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
        <h2 className={styles.ctaTitle}>Book your apartment clean today</h2>
        <p className={styles.ctaText}>
          Studio to 3-bedroom — we clean it all. Browse available maids in your
          area and book in under 2 minutes.
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
