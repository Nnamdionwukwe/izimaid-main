import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Locations.module.css";
import FixedHeader from "../FixedHeader";

const CITIES = {
  Abuja: {
    emoji: "🏛️",
    tagline: "Our home city — serving every district of the FCT",
    stats: [
      { num: "60+", label: "Bookings done" },
      { num: "30+", label: "Active maids" },
      { num: "4.9★", label: "Avg rating" },
    ],
    mapsUrl: "https://maps.google.com/?q=Abuja+FCT+Nigeria",
    areas: [
      {
        name: "Maitama",
        desc: "Diplomatic zone & luxury estates",
        badge: "High demand",
      },
      { name: "Asokoro", desc: "Ministerial & residential", badge: "Popular" },
      {
        name: "Wuse II",
        desc: "Commercial & residential hub",
        badge: "Popular",
      },
      { name: "Garki", desc: "Area 1, 2, 7, 8, 10, 11", badge: "Popular" },
      {
        name: "Gwarinpa",
        desc: "Largest housing estate in Nigeria",
        badge: "High demand",
      },
      { name: "Jabi", desc: "Lakeside estates & apartments", badge: "Growing" },
      { name: "Utako", desc: "Residential & commercial", badge: "Active" },
      {
        name: "Wuse Zone 4",
        desc: "Business district & hotels",
        badge: "Active",
      },
      { name: "Katampe", desc: "Extension & main estates", badge: "Active" },
      { name: "Apo", desc: "Resettlement & Dutse-Alhaji", badge: "Growing" },
      { name: "Kado", desc: "Fish market & residential", badge: "Active" },
      { name: "Life Camp", desc: "Gwarinpa extension", badge: "Popular" },
      { name: "Lugbe", desc: "Airport road corridor", badge: "Active" },
      { name: "Kubwa", desc: "Satellite town & estates", badge: "Growing" },
      { name: "Lokogoma", desc: "New residential estates", badge: "Growing" },
    ],
    services: [
      { emoji: "🏠", text: "Home Cleaning" },
      { emoji: "✨", text: "Deep Clean" },
      { emoji: "📦", text: "Move-In/Out" },
      { emoji: "🔄", text: "Recurring Plans" },
      { emoji: "🎉", text: "Event Cleaning" },
      { emoji: "🏢", text: "Light Commercial" },
      { emoji: "🌿", text: "Eco Cleaning" },
      { emoji: "🛋️", text: "Furniture Polish" },
    ],
    showroom: true,
  },
  Lagos: {
    emoji: "🌊",
    tagline: "Serving Lagos Island, Mainland, and the corridors beyond",
    stats: [
      { num: "40+", label: "Bookings done" },
      { num: "20+", label: "Active maids" },
      { num: "4.8★", label: "Avg rating" },
    ],
    mapsUrl: "https://maps.google.com/?q=Lagos+Nigeria",
    areas: [
      {
        name: "Lekki Phase 1",
        desc: "Upscale residential estates",
        badge: "High demand",
      },
      {
        name: "Victoria Island",
        desc: "Premium commercial & residential",
        badge: "High demand",
      },
      { name: "Ikoyi", desc: "Old money, luxury homes", badge: "Popular" },
      { name: "Ajah", desc: "Lekki axis expansion zone", badge: "Growing" },
      { name: "Ikeja", desc: "GRA & commercial hub", badge: "Popular" },
      { name: "Surulere", desc: "Mid-range residential", badge: "Active" },
      { name: "Maryland", desc: "Ikeja axis residential", badge: "Active" },
      { name: "Gbagada", desc: "Phase 1 & 2 estates", badge: "Active" },
      { name: "Yaba", desc: "Tech hub & residential", badge: "Growing" },
      { name: "Oniru", desc: "VI extension estates", badge: "Popular" },
      { name: "Chevron", desc: "Lekki corridor estates", badge: "Active" },
      { name: "Sangotedo", desc: "Ajah corridor", badge: "Growing" },
      { name: "Magodo", desc: "Phase 1 & 2 estates", badge: "Active" },
      { name: "Anthony Village", desc: "Maryland axis", badge: "Active" },
      { name: "Festac", desc: "Workers estate & environs", badge: "Growing" },
    ],
    services: [
      { emoji: "🏠", text: "Home Cleaning" },
      { emoji: "✨", text: "Deep Clean" },
      { emoji: "📦", text: "Move-In/Out" },
      { emoji: "🔄", text: "Recurring Plans" },
      { emoji: "🎉", text: "Event Cleaning" },
      { emoji: "🏢", text: "Light Commercial" },
      { emoji: "🌿", text: "Eco Cleaning" },
      { emoji: "🏙️", text: "Apartment Clean" },
    ],
    showroom: false,
  },
};

const BOOK_STEPS = [
  {
    title: "Enter your location",
    text: "Type your area or use GPS to find available maids near you.",
  },
  {
    title: "Browse local maids",
    text: "See vetted professionals in your area with ratings and rates.",
  },
  {
    title: "Pick your date & service",
    text: "Choose when you need cleaning and what type of clean.",
  },
  {
    title: "Pay & confirm",
    text: "Pay securely via Paystack. Admin reviews and confirms your booking.",
  },
];

const COMING_SOON = [
  { emoji: "🌴", name: "Port Harcourt", tag: "Rivers State" },
  { emoji: "🌆", name: "Kano", tag: "Kano State" },
  { emoji: "🏙️", name: "Ibadan", tag: "Oyo State" },
  { emoji: "🌊", name: "Benin City", tag: "Edo State" },
];

export default function Locations() {
  const navigate = useNavigate();
  const [activeCity, setActiveCity] = useState("Abuja");
  const city = CITIES[activeCity];

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Service locations</p>
        <h1 className={styles.heroTitle}>
          We clean
          <br />
          <em>where you live.</em>
        </h1>
        <p className={styles.heroDesc}>
          Professional home cleaning across Abuja and Lagos. Browse areas we
          serve, find maids near you, and book in under 2 minutes.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* City tabs */}
      <div className={styles.cityTabs}>
        {Object.entries(CITIES).map(([name, data]) => (
          <button
            key={name}
            className={`${styles.cityTab} ${activeCity === name ? styles.cityTabActive : ""}`}
            onClick={() => setActiveCity(name)}
          >
            <span className={styles.cityTabEmoji}>{data.emoji}</span>
            {name}
          </button>
        ))}
      </div>

      {/* City panel */}
      <div className={styles.cityPanel} key={activeCity}>
        {/* City hero */}
        <div className={styles.cityHero}>
          <div className={styles.cityHeroInner}>
            <div style={{ flex: 1 }}>
              <h2 className={styles.cityName}>
                {city.emoji} {activeCity}
              </h2>
              <p className={styles.cityTagline}>{city.tagline}</p>
              <div className={styles.cityStats}>
                {city.stats.map((s) => (
                  <div key={s.label} className={styles.cityStat}>
                    <p className={styles.cityStatNum}>{s.num}</p>
                    <p className={styles.cityStatLabel}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              className={styles.cityMapBtn}
              onClick={() => window.open(city.mapsUrl, "_blank")}
            >
              🗺️ View on Map
            </button>
          </div>
        </div>

        {/* Showroom (Abuja only) */}
        {city.showroom && (
          <div className={styles.showroomCard}>
            <span className={styles.showroomBadge}>
              Deusizi Home — Italian Furniture Showroom
            </span>
            <h3 className={styles.showroomTitle}>
              Visit us at Rhema Mall, Abuja
            </h3>
            <p className={styles.showroomDesc}>
              While you're here for cleaning services, discover our Italian
              furniture showroom — Deusizi Home — located at Rhema Mall.
              Authentic Italian sofas, dining sets, bedroom suites and more,
              imported directly from Italy.
            </p>
            <div className={styles.showroomDetails}>
              <div className={styles.showroomDetail}>
                <span className={styles.showroomDetailIcon}>📍</span>
                <span>
                  Rhema Mall, Plot 1227, Ahmadu Bello Way, Wuse Zone 4, FCT
                  Abuja
                </span>
              </div>
              <div className={styles.showroomDetail}>
                <span className={styles.showroomDetailIcon}>🕐</span>
                <span>Mon – Sat: 9am – 7pm · Sunday: 12pm – 6pm</span>
              </div>
              <div className={styles.showroomDetail}>
                <span className={styles.showroomDetailIcon}>📞</span>
                <span>+234 803 058 8774</span>
              </div>
            </div>
            <button
              className={styles.showroomBtn}
              onClick={() =>
                window.open(
                  "https://maps.google.com/?q=Rhema+Mall+Abuja",
                  "_blank",
                )
              }
            >
              Get Directions →
            </button>
          </div>
        )}

        {/* Areas we serve */}
        <div className={styles.areasSection}>
          <p className={styles.sectionEyebrow}>Areas we serve</p>
          <h2 className={styles.sectionTitle}>Is your area covered?</h2>
          <div className={styles.areasGrid}>
            {city.areas.map((a) => (
              <div
                key={a.name}
                className={styles.areaCard}
                onClick={() => navigate("/maids")}
              >
                <p className={styles.areaName}>{a.name}</p>
                <p className={styles.areaDesc}>{a.desc}</p>
                <span className={styles.areaBadge}>{a.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services in this city */}
        <div className={styles.servicesSection}>
          <p
            className={styles.sectionEyebrow}
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Available in {activeCity}
          </p>
          <h2 className={styles.servicesTitle}>All services offered here</h2>
          <p className={styles.servicesSub}>
            Every service below is available across {activeCity}. Book online —
            we come to you.
          </p>
          <div className={styles.servicesList}>
            {city.services.map((s) => (
              <div key={s.text} className={styles.serviceItem}>
                <span className={styles.serviceEmoji}>{s.emoji}</span>
                <span className={styles.serviceItemText}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to book */}
        <div className={styles.howToBook}>
          <p className={styles.sectionEyebrow}>Getting started</p>
          <h2 className={styles.sectionTitle}>How to book in {activeCity}</h2>
          <div className={styles.bookSteps}>
            {BOOK_STEPS.map((s, i) => (
              <div key={s.title} className={styles.bookStep}>
                <div className={styles.bookStepNum}>{i + 1}</div>
                <div className={styles.bookStepBody}>
                  <p className={styles.bookStepTitle}>{s.title}</p>
                  <p className={styles.bookStepText}>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coming soon */}
      <div className={styles.comingSoon}>
        <p className={styles.sectionEyebrow}>Expanding soon</p>
        <h2 className={styles.comingSoonTitle}>Coming to more cities</h2>
        <p className={styles.comingSoonSub}>
          We're growing across Nigeria. These cities are next on our list.
        </p>
        <div className={styles.comingSoonGrid}>
          {COMING_SOON.map((c) => (
            <div key={c.name} className={styles.comingSoonCity}>
              <div className={styles.comingSoonCityEmoji}>{c.emoji}</div>
              <p className={styles.comingSoonCityName}>{c.name}</p>
              <p className={styles.comingSoonCityTag}>{c.tag}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Find a maid near you today</h2>
        <p className={styles.ctaText}>
          Professional cleaning wherever you are in Abuja or Lagos. Book in
          under 2 minutes.
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
