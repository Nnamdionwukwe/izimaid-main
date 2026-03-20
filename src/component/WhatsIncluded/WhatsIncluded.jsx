import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WhatsIncluded.module.css";
import FixedHeader from "../FixedHeader";

const ROOMS = {
  Bedrooms: {
    icon: "🛏️",
    items: [
      "Dust all surfaces, furniture & shelves",
      "Vacuum carpet or mop hard floors",
      "Wipe wardrobe doors inside & out",
      "Clean mirrors & glass surfaces",
      "Wipe skirting boards & door frames",
      "Clean light switches & plug sockets",
      "Vacuum under beds & furniture",
      "Change bed linen (on request)",
    ],
  },
  Kitchen: {
    icon: "🍳",
    items: [
      "Wipe all countertops & work surfaces",
      "Clean sink & descale taps",
      "Degrease hob, grill & extractor fan",
      "Wipe cabinet doors & handles",
      "Clean inside microwave",
      "Wipe appliance exteriors (fridge, oven)",
      "Scrub tiles & backsplash",
      "Sweep & mop kitchen floor",
    ],
  },
  Bathrooms: {
    icon: "🚿",
    items: [
      "Scrub toilet bowl, cistern & seat",
      "Clean shower cubicle & screen",
      "Descale taps, showerhead & fixtures",
      "Scrub tiles & grout",
      "Clean mirrors & vanity cabinet",
      "Wipe vanity, countertop & surfaces",
      "Disinfect & mop floor",
      "Replace bin liner",
    ],
  },
  "Living Areas": {
    icon: "🛋️",
    items: [
      "Dust all surfaces & ornaments",
      "Vacuum sofa cushions & underneath",
      "Vacuum & mop all floors",
      "Wipe skirting boards & door frames",
      "Clean light switches & remotes",
      "Wipe door frames & handles",
      "Clean balcony door glass",
      "Tidy & organise surfaces",
    ],
  },
  Hallways: {
    icon: "🚪",
    items: [
      "Dust surfaces & picture frames",
      "Vacuum carpet or mop floor",
      "Clean entrance door & letterbox",
      "Wipe light switches & sockets",
      "Clean mirrors",
      "Wipe skirting boards",
    ],
  },
  "Dining Room": {
    icon: "🍽️",
    items: [
      "Dust all surfaces & shelves",
      "Clean dining table & chairs",
      "Vacuum carpet or mop floor",
      "Wipe skirting boards",
      "Clean light fittings & switches",
      "Polish glassware & crockery (on request)",
    ],
  },
};

const DEEP_CLEAN_EXTRAS = [
  {
    icon: "🧽",
    title: "Inside oven",
    text: "Full degrease of oven interior, racks and door glass",
  },
  {
    icon: "🧊",
    title: "Inside fridge & freezer",
    text: "Empty, clean and disinfect all shelves and drawers",
  },
  {
    icon: "🪟",
    title: "Window frames & sills",
    text: "Inside window glass, frames, sills and tracks",
  },
  {
    icon: "🧹",
    title: "Behind & under furniture",
    text: "Moved and cleaned underneath heavy furniture",
  },
  {
    icon: "🚿",
    title: "Grout scrubbing",
    text: "Deep scrub of bathroom and kitchen tile grout",
  },
  {
    icon: "💨",
    title: "Vents & extractor fans",
    text: "Dust and wipe all air vents and extractor fan covers",
  },
  {
    icon: "🪜",
    title: "Skirting board detail",
    text: "Hand-wipe all skirting boards around the property",
  },
  {
    icon: "🛁",
    title: "Limescale removal",
    text: "Descale all taps, showerheads and tile surfaces",
  },
];

const NOT_INCLUDED = [
  "Exterior windows above ground floor",
  "Biohazard or specialist cleaning",
  "Removal of heavy or large items",
  "Pest control or fumigation",
  "High-pressure jet washing",
  "Post-construction cleaning",
];

const STANDARDS = [
  {
    icon: "✅",
    title: "Checklist-based cleaning",
    text: "Every maid works through a printed or digital checklist for your service type. Nothing is skipped — every item is ticked off before we leave.",
  },
  {
    icon: "🔍",
    title: "Quality inspection",
    text: "Our team conducts random quality checks and reviews customer feedback after every clean to maintain consistent standards.",
  },
  {
    icon: "🌿",
    title: "Eco-friendly products",
    text: "We use non-toxic, biodegradable cleaning products by default — safe for children, pets, and sensitive surfaces.",
  },
  {
    icon: "⏱️",
    title: "Time allocation",
    text: "We allocate sufficient time per room so nothing is rushed. A 3-bedroom home receives a minimum of 4 hours — not a 90-minute dash.",
  },
];

const FAQS = [
  {
    q: "Does the checklist apply to every booking?",
    a: "Yes — the relevant checklist applies to every booking of that service type. For regular cleans the standard list applies; for deep cleans the extended list is used. You can also add or remove specific tasks in your booking notes.",
  },
  {
    q: "Can I request additional tasks not on the list?",
    a: "Absolutely. Add any special requests in the notes when booking. If it requires significant extra time, we'll confirm the additional cost before your booking is confirmed.",
  },
  {
    q: "Are cleaning products and equipment included?",
    a: "Yes — your maid arrives fully equipped with all products and tools. If you have specific products you prefer (for allergies or surfaces), leave them out and note it in your booking.",
  },
  {
    q: "What's the difference between a regular and deep clean?",
    a: "A regular clean covers all standard areas thoroughly. A deep clean adds intensive attention to areas often missed — inside appliances, behind furniture, grout scrubbing, limescale removal, and a full skirting board detail.",
  },
  {
    q: "Is laundry included?",
    a: "Laundry and linen changes are available as add-ons. Bed linen changes are included in the Full House Package. For other service types, request it in your booking notes and we'll confirm the additional time and cost.",
  },
];

export default function WhatsIncluded() {
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState("Bedrooms");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Full transparency</p>
        <h1 className={styles.heroTitle}>
          What's included in
          <br />
          <em>every clean.</em>
        </h1>
        <p className={styles.heroDesc}>
          No hidden extras, no shortcuts, no guesswork. Every task we perform is
          listed below — room by room, service by service.
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

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {[
          ["6", "Rooms covered"],
          ["40+", "Tasks per clean"],
          ["100%", "Checklist-based"],
          ["0", "Hidden extras"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* Room-by-room checklist */}
      <div className={styles.included}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Room by room
        </p>
        <h2 className={styles.includedTitle}>What we clean in every room</h2>
        <p className={styles.includedSub}>
          Select a room below to see the full task list included in your clean.
        </p>

        <div className={styles.roomTabs}>
          {Object.keys(ROOMS).map((room) => (
            <button
              key={room}
              className={`${styles.roomTab} ${activeRoom === room ? styles.roomTabActive : ""}`}
              onClick={() => setActiveRoom(room)}
            >
              {ROOMS[room].icon} {room}
            </button>
          ))}
        </div>

        <div className={styles.roomGrid}>
          {ROOMS[activeRoom].items.map((item) => (
            <div key={item} className={styles.roomItem}>
              <div className={styles.roomCheck}>✓</div>
              <span className={styles.roomText}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deep clean extras */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Deep clean only</p>
        <h2 className={styles.sectionTitle}>
          Additional tasks in a deep clean
        </h2>
        <p className={styles.sectionSub}>
          Everything in the standard clean, plus these intensive extras that go
          further.
        </p>
        <div className={styles.extraGrid}>
          {DEEP_CLEAN_EXTRAS.map((e) => (
            <div key={e.title} className={styles.extraCard}>
              <div className={styles.extraIcon}>{e.icon}</div>
              <div>
                <p className={styles.extraTitle}>{e.title}</p>
                <p className={styles.extraText}>{e.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our standards */}
      <div className={styles.standards}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Our standards
        </p>
        <h2 className={styles.standardsTitle}>How we ensure quality</h2>
        <p className={styles.standardsSub}>
          The checklist is only the start. Here's how we make sure every clean
          meets our bar.
        </p>
        <div className={styles.standardCards}>
          {STANDARDS.map((s) => (
            <div key={s.title} className={styles.standardCard}>
              <div className={styles.standardIcon}>{s.icon}</div>
              <div>
                <p className={styles.standardTitle}>{s.title}</p>
                <p className={styles.standardText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Not included */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>For clarity</p>
        <h2 className={styles.sectionTitle}>What's not included</h2>
        <p className={styles.sectionSub}>
          We believe in full transparency — here's what falls outside our
          standard service.
        </p>
        <div className={styles.notIncludedGrid}>
          {NOT_INCLUDED.map((item) => (
            <div key={item} className={styles.notIncludedItem}>
              <div className={styles.notIncludedDot}>✕</div>
              <span className={styles.notIncludedText}>{item}</span>
            </div>
          ))}
        </div>
        <p className={styles.notIncludedNote}>
          Need something specialist?{" "}
          <button
            className={styles.inlineLink}
            onClick={() => navigate("/contact")}
          >
            Contact our team
          </button>{" "}
          and we'll do our best to help or refer you.
        </p>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Checklist questions answered</h2>
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
        <h2 className={styles.ctaTitle}>Book with full confidence</h2>
        <p className={styles.ctaText}>
          You've seen everything we do. Now let us do it for your home.
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
