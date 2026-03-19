import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MoveInCleaning.module.css";
import FixedHeader from "../FixedHeader";

const SERVICES = [
  {
    icon: "🏠",
    name: "Move-In Clean",
    tagline: "Start fresh in your new home",
    desc: "Your new place should be spotless before your furniture arrives. We deep-clean every room so you can unpack into a truly clean, sanitized home.",
    checklist: [
      "Full kitchen & appliance clean",
      "Scrub all bathrooms",
      "Wipe all cabinets inside & out",
      "Vacuum & mop all floors",
      "Wipe skirting boards & vents",
      "Clean windows & sills",
    ],
    from: "₦15,000",
  },
  {
    icon: "📦",
    name: "Move-Out Clean",
    tagline: "Leave spotless, get your deposit back",
    desc: "Moving out? We clean to landlord standards so you get your full security deposit back. Our move-out clean covers everything landlords look for.",
    checklist: [
      "Deep-clean entire property",
      "Oven & extractor fan clean",
      "All walls spot-cleaned",
      "Grout & tile scrubbing",
      "Light fixtures & switches",
      "Certificate of clean available",
    ],
    from: "₦18,000",
  },
];

const ROOMS = {
  Kitchen: [
    "Clean inside oven, hob & grill",
    "Degrease extractor hood & filter",
    "Wipe all cabinet doors & handles",
    "Clean inside cabinets & drawers",
    "Descale sink & taps",
    "Clean fridge inside & out",
    "Wipe all countertops",
    "Clean tiles & backsplash",
  ],
  Bathrooms: [
    "Scrub toilet, cistern & seat",
    "Deep-clean shower & screen",
    "Descale taps & showerhead",
    "Scrub tiles & grout",
    "Clean mirrors & glass",
    "Wipe vanity & cupboards",
    "Mop & disinfect floor",
    "Empty & clean bins",
  ],
  Bedrooms: [
    "Dust all surfaces & furniture",
    "Wipe wardrobe doors inside & out",
    "Vacuum carpet / mop floor",
    "Clean light switches & sockets",
    "Wipe skirting boards",
    "Clean mirrors & glass",
    "Vacuum under bed",
    "Wipe window sills",
  ],
  "Living Areas": [
    "Dust all surfaces",
    "Vacuum sofas & cushions",
    "Mop / vacuum floors",
    "Wipe skirting boards",
    "Clean light switches",
    "Wipe door frames & handles",
    "Clean mirrors & artwork frames",
    "Tidy & remove rubbish",
  ],
};

const REASONS = [
  {
    icon: "💰",
    title: "Protect your security deposit",
    text: "Landlords are meticulous at move-out inspections. A professional clean ensures every item on their checklist is ticked — saving you thousands in deductions.",
  },
  {
    icon: "🧫",
    title: "Sanitize before you move in",
    text: "You don't know who lived there before or what they left behind. Our clean eliminates bacteria, allergens, and grime so you start truly fresh.",
  },
  {
    icon: "📋",
    title: "Certificate of clean",
    text: "We provide a written confirmation of your move-out clean on request — accepted by most landlords and property managers as proof of professional cleaning.",
  },
  {
    icon: "⚡",
    title: "Timed to your schedule",
    text: "We work around your moving timeline — day before keys handover, morning of move-in day, or right after the removal van leaves. You choose.",
  },
];

const STEPS = [
  {
    title: "Book your date",
    text: "Choose move-in or move-out, select a maid, pick your date and time. Booking takes under 2 minutes.",
  },
  {
    title: "Pay securely via Paystack",
    text: "Your payment is held securely. Our admin team confirms the booking and notifies your maid.",
  },
  {
    title: "We arrive & clean",
    text: "Your professional arrives fully equipped. We work room-by-room to our comprehensive checklist.",
  },
  {
    title: "Inspect & sign off",
    text: "Walk through with your maid on completion. Not satisfied with any area? We re-clean it on the spot.",
  },
];

const TIPS = [
  "Book your clean 24–48 hours before handing over keys to give us the time to do a thorough job.",
  "Make sure utilities (electricity & water) are still connected on the day of the clean.",
  "Remove all personal belongings before the clean — we work best in an empty space.",
  "Take photos of the property before and after the clean for your own records.",
  "Request a certificate of clean if your landlord or agent requires proof.",
];

const FAQS = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 24–48 hours in advance. For move-out cleans near month-end (when demand is highest), try to book 3–5 days ahead to secure your preferred date.",
  },
  {
    q: "Do I need to be present during the clean?",
    a: "No. Many customers hand over a spare key or arrange access with their landlord. We'll let you know when we arrive and send a completion message when we're done.",
  },
  {
    q: "What if my landlord isn't satisfied?",
    a: "Contact us within 24 hours of the inspection and we'll return to address any specific issues — free of charge. We stand behind our work.",
  },
  {
    q: "How long does a move-out clean take?",
    a: "Typically 4–8 hours depending on property size and condition. We'll give you a time estimate when you book. For larger properties we may send a team of two.",
  },
  {
    q: "Do you clean furnished or unfurnished properties?",
    a: "Both. For furnished properties we clean around existing furniture. Empty properties get the most thorough clean as we can access every corner.",
  },
];

export default function MoveInCleaning() {
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState("Kitchen");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Move-in / Move-out cleaning</p>
        <h1 className={styles.heroTitle}>
          Your fresh start
          <br />
          <em>begins here.</em>
        </h1>
        <p className={styles.heroDesc}>
          Professional move-in and move-out cleans across Abuja and Lagos. Get
          your deposit back. Unpack into a spotless home.
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
          ["🛡️", "Deposit-back guarantee"],
          ["📋", "Certificate available"],
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
        <h2 className={styles.sectionTitle}>Moving in or moving out?</h2>
        <div className={styles.serviceCards}>
          {SERVICES.map((s) => (
            <div key={s.name} className={styles.serviceCard}>
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

      {/* Room-by-room checklist */}
      <div className={styles.checklist}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Full checklist
        </p>
        <h2 className={styles.checklistTitle}>What we clean, room by room</h2>
        <p className={styles.checklistSub}>
          Every item below is included in your move clean — no hidden extras.
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

      {/* Why it matters */}
      <div className={styles.reasons}>
        <p className={styles.sectionEyebrow}>Why it matters</p>
        <h2 className={styles.sectionTitle}>More than just a clean</h2>
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

      {/* Moving tips */}
      <div className={styles.tipsBanner}>
        <div className={styles.tipsBannerHeader}>
          <span className={styles.tipsHeaderIcon}>💡</span>
          <p className={styles.tipsHeaderTitle}>Pro tips for your move</p>
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
        <h2 className={styles.ctaTitle}>Ready to book your move clean?</h2>
        <p className={styles.ctaText}>
          Start fresh in your new home or leave your old one spotless. Book in
          under 2 minutes — no contracts.
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
