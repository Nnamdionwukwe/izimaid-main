import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomeCleaning.module.css";

const SERVICES = [
  {
    icon: "🧹",
    name: "Regular Home Clean",
    tagline: "Weekly or fortnightly maintenance",
    desc: "Keep your home consistently clean with a regular maintenance clean. Perfect for busy families and professionals who want a permanently tidy living space.",
    checklist: [
      "Vacuum & mop all floors",
      "Dust all surfaces & furniture",
      "Clean bathrooms & toilets",
      "Wipe kitchen counters & sink",
      "Clean mirrors & glass",
      "Empty bins throughout",
    ],
    from: "₦8,000",
  },
  {
    icon: "✨",
    name: "Deep Home Clean",
    tagline: "Comprehensive top-to-bottom reset",
    desc: "A thorough, intensive clean that covers every corner of your home. Ideal as a seasonal refresh, first-time clean, or when your home needs more than the usual tidy.",
    checklist: [
      "Everything in Regular Clean",
      "Inside oven & microwave",
      "Inside fridge & freezer",
      "Grout & tile scrubbing",
      "Behind & under furniture",
      "Skirting boards & vents",
    ],
    from: "₦14,000",
  },
  {
    icon: "🏡",
    name: "Full House Package",
    tagline: "Every room, every surface",
    desc: "Our most comprehensive home cleaning service. Every room treated individually, add-ons included, and a full checklist sign-off at the end. Ideal for large homes.",
    checklist: [
      "Full deep-clean checklist",
      "All bedrooms & living areas",
      "Inside all appliances",
      "Balcony & outdoor areas",
      "Laundry & linen change",
      "Certificate of clean",
    ],
    from: "₦22,000",
  },
];

const ROOMS = {
  Bedrooms: [
    "Dust all surfaces & furniture",
    "Vacuum carpet / mop floor",
    "Wipe wardrobe doors inside & out",
    "Clean mirrors & glass",
    "Wipe skirting boards",
    "Clean light switches",
    "Vacuum under bed",
    "Change bed linen (on request)",
  ],
  Kitchen: [
    "Wipe all countertops",
    "Clean sink & descale taps",
    "Degrease hob & extractor",
    "Wipe cabinet doors & handles",
    "Clean inside microwave",
    "Wipe appliance exteriors",
    "Scrub tiles & backsplash",
    "Mop kitchen floor",
  ],
  Bathrooms: [
    "Scrub toilet, cistern & seat",
    "Clean shower & screen",
    "Descale taps & showerhead",
    "Scrub tiles & grout",
    "Clean mirrors & cabinets",
    "Wipe vanity & surfaces",
    "Disinfect & mop floor",
    "Replace bin liner",
  ],
  "Living Areas": [
    "Dust all surfaces",
    "Vacuum sofa & cushions",
    "Vacuum / mop floors",
    "Wipe skirting boards",
    "Clean light switches",
    "Wipe door frames & handles",
    "Clean balcony door glass",
    "Tidy & organize surfaces",
  ],
};

const HOUSE_SIZES = [
  {
    emoji: "🏠",
    name: "1-Bedroom Home",
    duration: "2–3 hrs",
    price: "From ₦8,000",
  },
  {
    emoji: "🏡",
    name: "2-Bedroom Home",
    duration: "3–4 hrs",
    price: "From ₦12,000",
  },
  {
    emoji: "🏘️",
    name: "3-Bedroom Home",
    duration: "4–6 hrs",
    price: "From ₦18,000",
  },
  {
    emoji: "🏰",
    name: "4+ Bedroom Home",
    duration: "6–8 hrs",
    price: "From ₦26,000",
  },
];

const BENEFITS = [
  {
    icon: "👨‍👩‍👧",
    title: "Built for family homes",
    text: "We understand the unique demands of a family home — school bags, pet hair, kitchen grease, and children's rooms. Our maids are trained for real-world home environments, not showrooms.",
  },
  {
    icon: "🔑",
    title: "No need to be home",
    text: "Many customers give key access and return to a freshly cleaned house. We send an arrival message and a completion confirmation — so you always know what's happening.",
  },
  {
    icon: "🌿",
    title: "Safe for children & pets",
    text: "We use eco-friendly, non-toxic cleaning products by default. Your family can move freely through the home as soon as we're done — no chemical residue, no harsh fumes.",
  },
  {
    icon: "📅",
    title: "One-off or recurring",
    text: "Book a single clean or set up a weekly/fortnightly plan. Recurring customers get a consistent maid who learns your home, your preferences, and your standards over time.",
  },
];

const TESTIMONIALS = [
  {
    text: "Deusizi Sparkle transformed my 3-bedroom home in one visit. The kitchen and bathrooms are cleaner than when we moved in. We've now set up a weekly plan — I'll never go back.",
    name: "Ngozi A.",
    location: "Gwarinpa, Abuja",
    stars: 5,
  },
  {
    text: "With two kids and a dog, our house was a disaster. The maid arrived on time, worked quietly and thoroughly, and I came home to a spotless house. Worth every naira.",
    name: "Tunde B.",
    location: "Lekki Phase 1, Lagos",
    stars: 5,
  },
  {
    text: "I was nervous about letting someone into my home but the vetting process gave me confidence. My maid Adaeze is now part of our weekly routine. Absolutely brilliant service.",
    name: "Chioma E.",
    location: "Maitama, Abuja",
    stars: 5,
  },
  {
    text: "Booked a deep clean before my parents visited. My mum inspected every corner and couldn't find a single thing to complain about. That never happens. Highly recommended.",
    name: "Emeka O.",
    location: "Victoria Island, Lagos",
    stars: 5,
  },
];

const STEPS = [
  {
    title: "Browse maids in your area",
    text: "View available professionals near you, read their reviews, and check their rates. Filter by service type or availability.",
  },
  {
    title: "Book your date & time",
    text: "Select your preferred date, time slot, and duration. Add any special instructions — pets, specific rooms, or products you prefer.",
  },
  {
    title: "Pay securely via Paystack",
    text: "Your payment is processed securely. Our admin team reviews and confirms your booking, then notifies your maid.",
  },
  {
    title: "Arrive home to spotless",
    text: "Your maid shows up on time, works through our full checklist, and leaves your home in perfect condition.",
  },
];

const FAQS = [
  {
    q: "Do you clean houses as well as apartments?",
    a: "Yes — we clean all types of residential properties, from studio apartments to large 4+ bedroom family homes and bungalows. Larger homes may require a team of two maids.",
  },
  {
    q: "Can I have the same maid every time?",
    a: "For recurring bookings, we assign you the same maid whenever possible. They learn your home, your preferences, and your standards — making every clean better than the last.",
  },
  {
    q: "What if I have pets?",
    a: "Just mention it in your booking notes. Our maids are experienced with pet-friendly homes and come prepared for pet hair, odors, and the areas animals frequent most.",
  },
  {
    q: "Do I need to provide cleaning supplies?",
    a: "No — your maid arrives with all equipment and eco-friendly products. If you have specific products you prefer, leave them out and note it when booking.",
  },
  {
    q: "Can I book a clean on short notice?",
    a: "We accommodate same-week and sometimes same-day bookings when availability allows. For the best choice of maid and time, we recommend booking 24–48 hours in advance.",
  },
];

export default function HomeCleaning() {
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState("Bedrooms");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Home cleaning</p>
        <h1 className={styles.heroTitle}>
          The home you love,
          <br />
          <em>always at its best.</em>
        </h1>
        <p className={styles.heroDesc}>
          Professional home cleaning for families across Abuja and Lagos. Vetted
          maids, reliable results, and a home you're proud to come back to.
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

      {/* Stats */}
      <div className={styles.statsBar}>
        {[
          ["100+", "Homes cleaned"],
          ["50+", "Vetted maids"],
          ["98%", "Satisfaction rate"],
          ["2 min", "To book"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* Services */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Choose your clean</p>
        <h2 className={styles.sectionTitle}>Home cleaning for every need</h2>
        <div className={styles.serviceCards}>
          {SERVICES.map((s) => (
            <div key={s.name} className={styles.serviceCard}>
              <div className={styles.cardBanner} />
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon}>{s.icon}</div>
                  <div>
                    <p className={styles.cardName}>{s.name}</p>
                    <p className={styles.cardTagline}>{s.tagline}</p>
                  </div>
                </div>
                <p className={styles.cardDesc}>{s.desc}</p>
                <div className={styles.checkList}>
                  {s.checklist.map((item) => (
                    <div key={item} className={styles.checkItem}>
                      <div className={styles.checkDot}>✓</div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.cardFooter}>
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
          Every item below is included — no hidden extras, no shortcuts.
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

      {/* House sizes */}
      <div className={styles.houseSizes}>
        <p className={styles.sectionEyebrow}>Pricing by size</p>
        <h2 className={styles.sectionTitle}>How much does it cost?</h2>
        <div className={styles.sizeGrid}>
          {HOUSE_SIZES.map((s) => (
            <div key={s.name} className={styles.sizeCard}>
              <div className={styles.sizeEmoji}>{s.emoji}</div>
              <p className={styles.sizeName}>{s.name}</p>
              <p className={styles.sizeDuration}>{s.duration}</p>
              <p className={styles.sizePrice}>{s.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className={styles.benefits}>
        <p className={styles.sectionEyebrow}>Why Deusizi Sparkle</p>
        <h2 className={styles.sectionTitle}>
          Cleaning built around your family
        </h2>
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

      {/* Testimonials */}
      <div className={styles.testimonials}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Real families
        </p>
        <h2 className={styles.testimonialsTitle}>What our customers say</h2>
        <p className={styles.testimonialsSub}>
          Hundreds of homes cleaned across Abuja and Lagos.
        </p>
        <div className={styles.testimonialList}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <p className={styles.testimonialText}>"{t.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialLocation}>{t.location}</p>
                </div>
                <div className={styles.testimonialStars}>
                  {"★".repeat(t.stars)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className={styles.process}>
        <p className={styles.sectionEyebrow}>How it works</p>
        <h2 className={styles.sectionTitle}>
          From booking to spotless home — 4 steps
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

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Home cleaning — answered</h2>
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
        <h2 className={styles.ctaTitle}>Book your home clean today</h2>
        <p className={styles.ctaText}>
          Professional, reliable, family-friendly cleaning across Abuja and
          Lagos. Book in under 2 minutes.
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
