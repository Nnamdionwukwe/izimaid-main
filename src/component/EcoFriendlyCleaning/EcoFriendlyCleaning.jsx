import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EcoFriendlyCleaning.module.css";

const PRODUCTS = [
  {
    icon: "🌿",
    name: "Plant-Based All-Purpose Cleaner",
    desc: "Derived from natural plant extracts, this cleaner cuts through grease and grime on all surfaces without harsh chemicals or toxic fumes.",
    tags: ["Biodegradable", "No VOCs", "Child-safe"],
  },
  {
    icon: "🍋",
    name: "Citrus & Vinegar Disinfectant",
    desc: "A powerful natural disinfectant made from citric acid and white vinegar. Kills 99.9% of common bacteria while being safe around pets and children.",
    tags: ["Non-toxic", "Pet-safe", "Antibacterial"],
  },
  {
    icon: "🫧",
    name: "Baking Soda Scrub",
    desc: "Our go-to for stubborn stains, grout, and bathroom tiles. Abrasive enough to clean effectively, gentle enough to leave surfaces unscratched.",
    tags: ["Zero waste", "No plastic", "Natural"],
  },
  {
    icon: "🧴",
    name: "Castile Soap Solution",
    desc: "A versatile vegetable-oil soap safe for floors, surfaces, and fabrics. Leaves no chemical residue and is fully compostable.",
    tags: ["Vegan", "Compostable", "Allergy-safe"],
  },
];

const WHY_ITEMS = [
  {
    emoji: "👶",
    name: "Safe for children",
    desc: "No toxic residue on floors, toys or surfaces babies touch",
  },
  {
    emoji: "🐾",
    name: "Safe for pets",
    desc: "No harmful chemicals that could harm cats or dogs",
  },
  {
    emoji: "🌍",
    name: "Better for the planet",
    desc: "Biodegradable products don't pollute waterways",
  },
  {
    emoji: "😮‍💨",
    name: "Better air quality",
    desc: "No harsh fumes or VOCs that affect indoor air",
  },
  {
    emoji: "🤧",
    name: "Allergy-friendly",
    desc: "Ideal for sensitive skin and respiratory conditions",
  },
  {
    emoji: "🌱",
    name: "Sustainable future",
    desc: "Reducing chemical load on Nigeria's environment",
  },
  {
    emoji: "✅",
    name: "Just as effective",
    desc: "Our eco products deliver the same deep clean result",
  },
  {
    emoji: "💚",
    name: "Good conscience",
    desc: "Clean home, clean conscience — for you and the planet",
  },
];

const BENEFITS = [
  {
    icon: "🫁",
    title: "Healthier indoor air",
    text: "Conventional cleaners release volatile organic compounds (VOCs) that linger in your home for hours. Our plant-based products leave nothing toxic behind — just clean air.",
  },
  {
    icon: "🧒",
    title: "Safer for your family",
    text: "Children spend more time on floors and put their hands in their mouths. Eco cleaning removes the risk of chemical exposure that conventional products leave behind.",
  },
  {
    icon: "🌊",
    title: "Protects Nigeria's waterways",
    text: "Chemical cleaners drain into rivers and damage aquatic ecosystems. Our biodegradable products break down naturally without polluting local water sources.",
  },
  {
    icon: "♻️",
    title: "Reduced plastic waste",
    text: "We use concentrated, refillable or minimal-packaging products where possible. Less packaging means less plastic waste entering Lagos and Abuja's landfills.",
  },
];

const COMMITMENTS = [
  "We never use bleach, ammonia, phosphates, or parabens in any of our cleaning solutions.",
  "All our spray bottles and containers are reused or made from recycled materials.",
  "We train every maid on eco-cleaning techniques that deliver results without chemical dependency.",
  "We are working toward carbon-neutral operations — from product sourcing to transport.",
  "We disclose every ingredient in our cleaning products — no hidden chemicals, ever.",
];

const FAQS = [
  {
    q: "Are eco-friendly products as effective as chemical ones?",
    a: "Yes. Modern plant-based formulas clean just as thoroughly as chemical products for everyday dirt, grease, bacteria, and stains. For truly stubborn cases (like heavy limescale or deep mold), we use targeted natural treatments that are equally powerful.",
  },
  {
    q: "Is eco cleaning suitable for deep cleans?",
    a: "Absolutely. Our full range of eco products covers everything from light daily cleaning to deep kitchen degrease, bathroom disinfection, and move-in/out cleans.",
  },
  {
    q: "Do eco products disinfect properly?",
    a: "Our citric acid and vinegar-based disinfectants are proven to kill 99.9% of common household bacteria and viruses, making them fully suitable for kitchen and bathroom disinfection.",
  },
  {
    q: "Will my home smell clean?",
    a: "Yes — we use naturally scented products with essential oils like citrus, lavender, and eucalyptus. Your home will smell genuinely fresh, not artificially fragrant.",
  },
  {
    q: "Can I request eco cleaning on any booking?",
    a: "Yes. Simply mention it in your booking notes or when browsing maids. All our maids are trained in eco-cleaning. There is no extra charge for eco products.",
  },
];

export default function EcoFriendlyCleaning() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLeaf}>🌿</div>
        <p className={styles.heroEyebrow}>Eco-friendly cleaning</p>
        <h1 className={styles.heroTitle}>
          Clean home.
          <br />
          <em>Clean planet.</em>
        </h1>
        <p className={styles.heroDesc}>
          We clean with nature — not against it. Every product we use is
          plant-based, biodegradable, and safe for your family, pets, and the
          environment.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => navigate("/maids")}
          >
            Book an Eco Clean
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
          ["100%", "Natural products"],
          ["0", "Toxic chemicals"],
          ["♻️", "Biodegradable"],
          ["✅", "Same great results"],
        ].map(([num, label]) => (
          <div key={label} className={styles.statItem}>
            <p className={styles.statNum}>{num}</p>
            <p className={styles.statLabel}>{label}</p>
          </div>
        ))}
      </div>

      {/* Products */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Our products</p>
        <h2 className={styles.sectionTitle}>What we clean with</h2>
        <div className={styles.productGrid}>
          {PRODUCTS.map((p) => (
            <div key={p.name} className={styles.productCard}>
              <div className={styles.productIcon}>{p.icon}</div>
              <div>
                <p className={styles.productName}>{p.name}</p>
                <p className={styles.productDesc}>{p.desc}</p>
                <div className={styles.productTags}>
                  {p.tags.map((t) => (
                    <span key={t} className={styles.productTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why eco matters */}
      <div className={styles.whyEco}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Why it matters
        </p>
        <h2 className={styles.whyEcoTitle}>8 reasons to choose eco cleaning</h2>
        <p className={styles.whyEcoSub}>
          For your home, your family, and the world your children will inherit.
        </p>
        <div className={styles.whyGrid}>
          {WHY_ITEMS.map((w) => (
            <div key={w.name} className={styles.whyItem}>
              <div className={styles.whyEmoji}>{w.emoji}</div>
              <p className={styles.whyName}>{w.name}</p>
              <p className={styles.whyDesc}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>The difference</p>
        <h2 className={styles.sectionTitle}>Beyond clean — genuinely better</h2>
        <div className={styles.benefitCards}>
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              className={styles.benefitCard}
              style={{ animationDelay: `${i * 0.08}s` }}
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

      {/* Certifications */}
      <div className={styles.certs}>
        <p className={styles.sectionEyebrow}>Our standards</p>
        <h2 className={styles.sectionTitle} style={{ marginBottom: 20 }}>
          What eco means to us
        </h2>
        <div className={styles.certGrid}>
          {[
            {
              emoji: "🌱",
              name: "Plant-Based Only",
              desc: "Every ingredient sourced from natural plant extracts",
            },
            {
              emoji: "🚫",
              name: "Zero Harsh Chemicals",
              desc: "No bleach, ammonia, phosphates, or parabens",
            },
            {
              emoji: "♻️",
              name: "Minimal Packaging",
              desc: "Recycled or reused containers where possible",
            },
            {
              emoji: "💚",
              name: "Fully Biodegradable",
              desc: "Breaks down naturally — no environmental damage",
            },
          ].map((c) => (
            <div key={c.name} className={styles.certCard}>
              <div className={styles.certEmoji}>{c.emoji}</div>
              <p className={styles.certName}>{c.name}</p>
              <p className={styles.certDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our commitment */}
      <div className={styles.commitment}>
        <div className={styles.commitmentHeader}>
          <span className={styles.commitmentHeaderIcon}>🤝</span>
          <p className={styles.commitmentHeaderTitle}>Our eco commitment</p>
        </div>
        <div className={styles.commitmentList}>
          {COMMITMENTS.map((c, i) => (
            <div key={i} className={styles.commitItem}>
              <div className={styles.commitDot}>✓</div>
              <p className={styles.commitText}>{c}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Eco cleaning — answered</h2>
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
        <h2 className={styles.ctaTitle}>Book your eco-friendly clean today</h2>
        <p className={styles.ctaText}>
          Same great results. Zero toxic chemicals. Better for your family, your
          home, and Nigeria's environment.
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
