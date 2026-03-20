import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DeausiziAwards.module.css";
import FixedHeader from "../FixedHeader";

const AWARD_CATEGORIES = [
  {
    icon: "🏆",
    title: "Maid of the Year",
    desc: "Awarded to the maid with the highest combined score across quality, punctuality, customer satisfaction, and total bookings completed over the calendar year.",
    prize: "₦250,000 + Trophy + Feature",
  },
  {
    icon: "⭐",
    title: "5-Star Excellence Award",
    desc: "Recognising maids who have maintained a perfect 5.0 rating across a minimum of 50 verified bookings. Consistency and dedication to quality.",
    prize: "₦100,000 + Certificate",
  },
  {
    icon: "🚀",
    title: "Rising Star Award",
    desc: "Celebrating a maid who joined within the last 12 months and has shown exceptional growth, customer feedback, and commitment to the Deusizi standard.",
    prize: "₦75,000 + Spotlight Feature",
  },
  {
    icon: "❤️",
    title: "Customer Favourite Award",
    desc: "Voted by customers — the maid whose name appears most in positive reviews, return bookings, and customer referrals throughout the year.",
    prize: "₦75,000 + Wall of Fame",
  },
  {
    icon: "🌍",
    title: "Community Impact Award",
    desc: "Given to the maid who has gone beyond the clean — volunteering with the Deusizi Foundation, mentoring new maids, or contributing to community outreach.",
    prize: "₦50,000 + Foundation Feature",
  },
  {
    icon: "🎓",
    title: "Most Improved Award",
    desc: "Honouring the maid who has shown the greatest improvement in ratings, bookings, and customer satisfaction over the previous year.",
    prize: "₦50,000 + Certificate",
  },
];

const PAST_WINNERS = [
  {
    year: "2024",
    award: "Maid of the Year",
    name: "Adaeze O.",
    location: "Maitama, Abuja",
    quote:
      "This award means everything to me. I clean every home like it is my own.",
    initials: "AO",
  },
  {
    year: "2024",
    award: "5-Star Excellence",
    name: "Fatima K.",
    location: "Lekki, Lagos",
    quote:
      "Consistency is my superpower. I show up the same way every single time.",
    initials: "FK",
  },
  {
    year: "2024",
    award: "Rising Star",
    name: "Blessing E.",
    location: "Wuse II, Abuja",
    quote:
      "I only joined 8 months ago. This proves hard work is always noticed.",
    initials: "BE",
  },
  {
    year: "2023",
    award: "Maid of the Year",
    name: "Ngozi A.",
    location: "Victoria Island, Lagos",
    quote:
      "Two years running. I dedicate this to every family that trusted me.",
    initials: "NA",
  },
  {
    year: "2023",
    award: "Customer Favourite",
    name: "Chioma E.",
    location: "Jabi, Abuja",
    quote:
      "My customers keep coming back. That loyalty means more than any prize.",
    initials: "CE",
  },
];

const CRITERIA = [
  {
    icon: "📊",
    title: "Customer rating",
    weight: "35%",
    text: "Average star rating across all completed bookings in the award period.",
  },
  {
    icon: "📅",
    title: "Bookings completed",
    weight: "25%",
    text: "Total verified bookings completed — consistency and volume both count.",
  },
  {
    icon: "⏰",
    title: "Punctuality score",
    weight: "20%",
    text: "On-time arrival percentage based on booking records and customer reports.",
  },
  {
    icon: "💬",
    title: "Customer reviews",
    weight: "15%",
    text: "Qualitative sentiment from written reviews — specific mentions of excellence.",
  },
  {
    icon: "🔁",
    title: "Repeat booking rate",
    weight: "5%",
    text: "Percentage of customers who re-booked the same maid within 90 days.",
  },
];

const TIMELINE = [
  {
    date: "1 Jan",
    event: "Award period opens — all eligible maids automatically entered",
  },
  {
    date: "30 Nov",
    event: "Award period closes — final data collected and verified",
  },
  { date: "1-15 Dec", event: "Panel review and shortlist announced publicly" },
  {
    date: "20 Dec",
    event: "Winners notified privately before public announcement",
  },
  {
    date: "31 Dec",
    event: "Deusizi Sparkle Awards Night — winners celebrated",
  },
];

const NOMINEES_2025 = [
  {
    name: "Adaeze O.",
    location: "Abuja",
    rating: "5.0",
    bookings: 148,
    award: "Maid of the Year",
    initials: "AO",
  },
  {
    name: "Chiamaka B.",
    location: "Lagos",
    rating: "4.9",
    bookings: 132,
    award: "5-Star Excellence",
    initials: "CB",
  },
  {
    name: "Rukayat M.",
    location: "Abuja",
    rating: "5.0",
    bookings: 89,
    award: "Rising Star",
    initials: "RM",
  },
  {
    name: "Grace N.",
    location: "Lagos",
    rating: "4.8",
    bookings: 121,
    award: "Customer Favourite",
    initials: "GN",
  },
  {
    name: "Amina S.",
    location: "Abuja",
    rating: "4.9",
    bookings: 76,
    award: "Community Impact",
    initials: "AS",
  },
  {
    name: "Titi O.",
    location: "Lagos",
    rating: "4.7",
    bookings: 64,
    award: "Most Improved",
    initials: "TO",
  },
];

const FAQS = [
  {
    q: "Do I need to apply to be considered for an award?",
    a: "No. All active maids on the Deusizi Sparkle platform are automatically considered for all relevant award categories. There is no application — your work throughout the year is your entry.",
  },
  {
    q: "How are winners selected?",
    a: "A panel of Deusizi Sparkle staff reviews the scoring criteria above. The Customer Favourite Award is the only category determined by direct customer vote — others are data-driven.",
  },
  {
    q: "Can a maid win more than one award?",
    a: "Yes. A maid can be shortlisted across multiple categories, but no maid may win more than two awards in the same year so recognition is spread across our team.",
  },
  {
    q: "How are prizes paid?",
    a: "Cash prizes are paid directly to the maid registered bank account within 5 working days of the Awards Night. Physical trophies and certificates are presented at the ceremony.",
  },
  {
    q: "Can customers nominate a maid for an award?",
    a: "Yes — for the Customer Favourite Award, customers can cast a vote via the app during November. For other categories, customer reviews and ratings feed directly into the scoring.",
  },
];

export default function DeausiziAwards() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeYear, setActiveYear] = useState("2024");

  const filteredWinners = PAST_WINNERS.filter((w) => w.year === activeYear);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroTrophy}>🏆</div>
        <p className={styles.heroEyebrow}>Annual recognition</p>
        <h1 className={styles.heroTitle}>
          Deusizi Sparkle
          <br />
          <em>Awards.</em>
        </h1>
        <p className={styles.heroDesc}>
          Every year, we celebrate the maids who go above and beyond — the
          professionals who raise the standard, delight customers, and make
          Deusizi Sparkle what it is. This is their moment.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() =>
              document
                .getElementById("nominees")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            2025 Nominees
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("categories")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Award Categories
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {[
          ["6", "Award categories"],
          ["600k", "Total prize pool (₦)"],
          ["2", "Years running"],
          ["50+", "Eligible maids"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* Award categories */}
      <div className={styles.section} id="categories">
        <p className={styles.sectionEyebrow}>2025 categories</p>
        <h2 className={styles.sectionTitle}>Six awards. Six ways to shine.</h2>
        <div className={styles.categoryGrid}>
          {AWARD_CATEGORIES.map((a) => (
            <div key={a.title} className={styles.categoryCard}>
              <div className={styles.categoryIcon}>{a.icon}</div>
              <p className={styles.categoryTitle}>{a.title}</p>
              <p className={styles.categoryDesc}>{a.desc}</p>
              <div className={styles.categoryPrize}>
                <span className={styles.prizeLabel}>Prize</span>
                <span className={styles.prizeValue}>{a.prize}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2025 nominees */}
      <div className={styles.nominees} id="nominees">
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          2025 shortlist
        </p>
        <h2 className={styles.nomineesTitle}>This year's nominees</h2>
        <p className={styles.nomineesSub}>
          Winners announced at the Awards Night on 31 December 2025.
        </p>
        <div className={styles.nomineeGrid}>
          {NOMINEES_2025.map((n) => (
            <div key={n.name} className={styles.nomineeCard}>
              <div className={styles.nomineeAvatar}>{n.initials}</div>
              <div className={styles.nomineeInfo}>
                <p className={styles.nomineeName}>{n.name}</p>
                <p className={styles.nomineeLocation}>📍 {n.location}</p>
                <p className={styles.nomineeAward}>🏅 {n.award}</p>
              </div>
              <div className={styles.nomineeMeta}>
                <p className={styles.nomineeRating}>★ {n.rating}</p>
                <p className={styles.nomineeBookings}>{n.bookings} cleans</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring criteria */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>How it works</p>
        <h2 className={styles.sectionTitle}>How winners are chosen</h2>
        <p className={styles.sectionSub}>
          Awards are data-driven, transparent, and independently reviewed by our
          panel.
        </p>
        <div className={styles.criteriaList}>
          {CRITERIA.map((c) => (
            <div key={c.title} className={styles.criteriaItem}>
              <div className={styles.criteriaLeft}>
                <span className={styles.criteriaIcon}>{c.icon}</span>
                <span className={styles.criteriaTitle}>{c.title}</span>
              </div>
              <div className={styles.criteriaBarWrap}>
                <div className={styles.criteriaBar}>
                  <div
                    className={styles.criteriaFill}
                    style={{ width: c.weight }}
                  />
                </div>
                <span className={styles.criteriaWeight}>{c.weight}</span>
              </div>
              <p className={styles.criteriaText}>{c.text}</p>
            </div>
          ))}
        </div>
        <p className={styles.criteriaNote}>
          * Customer Favourite is determined solely by customer vote via the app
          in November.
        </p>
      </div>

      {/* Past winners — hall of fame */}
      <div className={styles.winners}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Hall of fame
        </p>
        <h2 className={styles.winnersTitle}>Past winners</h2>

        <div className={styles.yearTabs}>
          {["2024", "2023"].map((y) => (
            <button
              key={y}
              className={`${styles.yearTab} ${activeYear === y ? styles.yearTabActive : ""}`}
              onClick={() => setActiveYear(y)}
            >
              {y}
            </button>
          ))}
        </div>

        <div className={styles.winnerGrid}>
          {filteredWinners.map((w) => (
            <div key={w.name + w.award} className={styles.winnerCard}>
              <div className={styles.winnerAwardBadge}>{w.award}</div>
              <div className={styles.winnerAvatar}>{w.initials}</div>
              <p className={styles.winnerName}>{w.name}</p>
              <p className={styles.winnerLocation}>{w.location}</p>
              <p className={styles.winnerQuote}>"{w.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Key dates</p>
        <h2 className={styles.sectionTitle}>2025 Awards timeline</h2>
        <div className={styles.timeline}>
          {TIMELINE.map((t, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <p className={styles.timelineDate}>{t.date}</p>
                <p className={styles.timelineEvent}>{t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Awards questions answered</h2>
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
        <div className={styles.ctaTrophy}>🏆</div>
        <h2 className={styles.ctaTitle}>Are you our next award winner?</h2>
        <p className={styles.ctaText}>
          Every booking you complete is a step closer to the stage. Join our
          platform and start building your record today.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/apply-locally")}
          >
            Join as a Maid
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
