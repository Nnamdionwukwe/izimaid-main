import { useNavigate } from "react-router-dom";
import styles from "./DeusiziGroup.module.css";
import FixedHeader from "../FixedHeader";

const FURNITURE_FEATURES = [
  "Authentic Italian furniture sourced directly from manufacturers in Milan, Florence & Veneto",
  "Exclusive collections: sofas, dining sets, bedroom suites, office furniture & décor",
  "Custom orders — choose your finish, fabric, and dimensions with delivery to your home",
  "Interior consultation service to help you find the perfect pieces for your space",
  "Showroom experience at Rhema Mall, Abuja — see, touch, and feel every piece before you buy",
];

const SPARKLE_FEATURES = [
  "Vetted, professional cleaning maids across Abuja and Lagos",
  "Residential cleaning: standard, deep, move-in/out, recurring, and event cleaning",
  "Secure online booking and payment via Paystack",
  "Eco-friendly, plant-based cleaning products on every booking",
  "Admin-reviewed bookings with a 24-hour satisfaction guarantee",
];

const WHY_CARDS = [
  {
    icon: "🏛️",
    title: "A trusted Nigerian group",
    text: "Deusizi has been serving Nigerians with premium products and services. Our reputation is built on consistency, quality, and keeping our word.",
  },
  {
    icon: "🇮🇹",
    title: "Genuine Italian craftsmanship",
    text: "Deusizi Home imports directly from Italian manufacturers — no middlemen, no replicas. Every piece carries the authenticity of Italian design heritage.",
  },
  {
    icon: "🧹",
    title: "Professional home services",
    text: "Deusizi Sparkle brings the same premium standard to home cleaning that our furniture brand brings to home furnishing. Excellence across the group.",
  },
  {
    icon: "🤝",
    title: "Relationships over transactions",
    text: "Whether you're buying a sofa or booking a maid, we invest in long-term relationships. Our customers return — and refer their friends — because we earn it.",
  },
  {
    icon: "📍",
    title: "Rooted in Abuja",
    text: "Rhema Mall is our home. We are a Nigerian company, serving Nigerian families, building a legacy in the FCT and expanding across the country.",
  },
  {
    icon: "✨",
    title: "One group, two promises",
    text: "Beautiful homes. Clean homes. Deusizi Group exists to help Nigerians live better at home — through world-class furniture and world-class care.",
  },
];

const SYNERGY_CARDS = [
  {
    icon: "🛋️",
    title: "Furnish with Deusizi Home",
    text: "Import-quality Italian furniture at our Rhema Mall showroom",
  },
  { icon: "→", isArrow: true },
  {
    icon: "🧹",
    title: "Clean with Deusizi Sparkle",
    text: "Professional maids to keep your beautiful home spotless",
  },
];

export default function DeusiziGroup() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <span className={styles.heroEyebrow}>A Deusizi Group of Companies</span>
        <h1 className={styles.heroTitle}>Deusizi Group</h1>
        <p className={styles.heroSubtitle}>Beautiful homes. Clean homes.</p>
        <p className={styles.heroDesc}>
          Two companies. One mission — helping Nigerians live better at home.
          From authentic Italian furniture to professional home cleaning,
          Deusizi Group brings world-class quality to everyday life.
        </p>
        <div className={styles.heroDivider}>
          <div className={styles.heroDividerLine} />
          <div className={styles.heroDividerDiamond} />
          <div className={styles.heroDividerLine} />
        </div>
      </div>

      {/* Group intro */}
      <div className={styles.groupIntro}>
        <div className={styles.groupIntroInner}>
          <h2 className={styles.groupIntroTitle}>Who we are</h2>
          <p className={styles.groupIntroText}>
            Deusizi Group is a Nigerian conglomerate with two distinct but
            complementary brands: <strong>Deusizi Home</strong> — a premium
            Italian furniture importer based in Abuja — and{" "}
            <strong>Deusizi Sparkle</strong> — a professional home cleaning
            platform serving Abuja and Lagos.
          </p>
          <p className={styles.groupIntroText}>
            We exist because we believe Nigerians deserve access to world-class
            products and services at home. Not second-rate alternatives, not
            unreliable providers — but genuine quality, delivered with
            professionalism and care.
          </p>
        </div>
      </div>

      {/* Company cards */}
      <div className={styles.companies}>
        <p className={styles.companiesEyebrow}>Our companies</p>
        <h2 className={styles.companiesTitle}>
          Two brands. One standard of excellence.
        </h2>
        <div className={styles.companyCards}>
          {/* Deusizi Home */}
          <div className={`${styles.companyCard} ${styles.furnitureCard}`}>
            <div className={styles.cardHeader}>
              <span className={`${styles.cardBadge} ${styles.goldBadge}`}>
                Premium Italian Furniture
              </span>
              <h3 className={styles.cardName}>Deusizi Home</h3>
              <p className={styles.cardTagline}>
                Authentic Italian design, delivered to your door in Nigeria
              </p>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardDesc}>
                Deusizi Home brings the finest Italian furniture directly from
                the workshops of Milan, Florence, and Veneto to Nigerians who
                want more than mass-produced imitations. Every piece is
                authentic, every finish is crafted, and every delivery is an
                investment in your home.
              </p>
              <div className={styles.cardFeatures}>
                {FURNITURE_FEATURES.map((f, i) => (
                  <div key={i} className={styles.cardFeature}>
                    <div className={`${styles.featureDot} ${styles.goldDot}`}>
                      ✓
                    </div>
                    <span className={styles.featureText}>{f}</span>
                  </div>
                ))}
              </div>
              <div className={`${styles.cardLocation} ${styles.goldLocation}`}>
                <span className={styles.locationIcon}>📍</span>
                <div className={styles.locationText}>
                  <strong>Rhema Mall, Abuja</strong>
                  Plot 1227, Ahmadu Bello Way, Wuse Zone 4, FCT, Abuja
                </div>
              </div>
              <div className={styles.cardCta}>
                <button
                  className={styles.ctaGold}
                  onClick={() => window.open("tel:+2348030588774")}
                >
                  Call Showroom
                </button>
                <button
                  className={styles.ctaGoldOutline}
                  onClick={() =>
                    window.open(
                      "https://maps.google.com/?q=Rhema+Mall+Abuja",
                      "_blank",
                    )
                  }
                >
                  Get Directions
                </button>
              </div>
            </div>
          </div>

          {/* Deusizi Sparkle */}
          <div className={`${styles.companyCard} ${styles.sparkleCard}`}>
            <div className={styles.cardHeader}>
              <span className={`${styles.cardBadge} ${styles.redBadge}`}>
                Professional Home Cleaning
              </span>
              <h3 className={styles.cardName}>Deusizi Sparkle</h3>
              <p className={styles.cardTagline}>
                Vetted maids. Guaranteed results. Abuja & Lagos.
              </p>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardDesc}>
                Deusizi Sparkle connects Nigerian homes with vetted,
                professional cleaning maids — booking in under 2 minutes, secure
                payment via Paystack, and a satisfaction guarantee on every
                clean. The standard your beautiful home deserves.
              </p>
              <div className={styles.cardFeatures}>
                {SPARKLE_FEATURES.map((f, i) => (
                  <div key={i} className={styles.cardFeature}>
                    <div className={`${styles.featureDot} ${styles.redDot}`}>
                      ✓
                    </div>
                    <span className={styles.featureText}>{f}</span>
                  </div>
                ))}
              </div>
              <div className={`${styles.cardLocation} ${styles.redLocation}`}>
                <span className={styles.locationIcon}>📍</span>
                <div className={styles.locationText}>
                  <strong>Serving Abuja & Lagos</strong>
                  Book online — we come to you anywhere in the FCT or Lagos
                </div>
              </div>
              <div className={styles.cardCta}>
                <button
                  className={styles.ctaRed}
                  onClick={() => navigate("/maids")}
                >
                  Browse Maids
                </button>
                <button
                  className={styles.ctaRedOutline}
                  onClick={() => navigate("/request-a-free-estimate")}
                >
                  Free Estimate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Deusizi */}
      <div className={styles.whySection}>
        <p className={styles.whyEyebrow}>Why Deusizi</p>
        <h2 className={styles.whyTitle}>
          What makes the Deusizi Group different
        </h2>
        <div className={styles.whyCards}>
          {WHY_CARDS.map((c) => (
            <div key={c.title} className={styles.whyCard}>
              <div className={styles.whyIcon}>{c.icon}</div>
              <div>
                <p className={styles.whyCardTitle}>{c.title}</p>
                <p className={styles.whyCardText}>{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Synergy */}
      <div className={styles.synergy}>
        <p className={styles.synergyEyebrow}>The Deusizi difference</p>
        <h2 className={styles.synergyTitle}>
          Furnish it beautifully.
          <br />
          Keep it spotlessly clean.
        </h2>
        <p className={styles.synergyText}>
          Our two brands exist to serve you at every stage of your home journey.
          Fill your space with authentic Italian furniture from Deusizi Home —
          then let Deusizi Sparkle keep it in perfect condition, week after
          week.
        </p>
        <div className={styles.synergyCards}>
          {SYNERGY_CARDS.map((c, i) =>
            c.isArrow ? (
              <div key={i} className={styles.synergyArrow}>
                →
              </div>
            ) : (
              <div key={c.title} className={styles.synergyCard}>
                <div className={styles.synergyIcon}>{c.icon}</div>
                <div>
                  <p className={styles.synergyCardTitle}>{c.title}</p>
                  <p className={styles.synergyCardText}>{c.text}</p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Experience the Deusizi standard</h2>
        <p className={styles.ctaText}>
          Visit our showroom in Rhema Mall for Italian furniture, or book a
          professional clean online today. Two brands. One group. One commitment
          to quality.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/maids")}
          >
            Book a Clean
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() =>
              window.open(
                "https://maps.google.com/?q=Rhema+Mall+Abuja",
                "_blank",
              )
            }
          >
            Visit Showroom
          </button>
        </div>
      </div>
    </div>
  );
}
