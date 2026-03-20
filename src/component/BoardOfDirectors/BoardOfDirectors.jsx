import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BoardOfDirectors.module.css";
import FixedHeader from "../FixedHeader";

const DIRECTORS = [
  {
    name: "Adaeze Okafor",
    title: "Chairperson & Co-Founder",
    initials: "AO",
    color: "rgb(32, 32, 65)",
    bio: "A seasoned entrepreneur with over 18 years of experience building service businesses across West Africa. Adaeze co-founded Deusizi Sparkle with a vision to professionalise domestic work and create dignified employment for skilled home service providers across Nigeria.",
    expertise: ["Strategic Leadership", "Business Development", "Operations"],
    linkedin: "#",
  },
  {
    name: "Chukwuemeka Nwosu",
    title: "Chief Executive Officer",
    initials: "CN",
    color: "rgb(187, 19, 47)",
    bio: "Emeka brings deep expertise in marketplace platforms and workforce management. Before joining Deusizi Sparkle he led growth at two Lagos-based tech startups, scaling both to profitability. He holds an MBA from Lagos Business School and a BSc in Computer Science from the University of Nigeria.",
    expertise: ["Tech Strategy", "Growth & Scale", "Marketplace Platforms"],
    linkedin: "#",
  },
  {
    name: "Funmilayo Adeyemi",
    title: "Chief Financial Officer",
    initials: "FA",
    color: "rgb(32, 32, 65)",
    bio: "A chartered accountant with 14 years spanning financial services and consumer technology. Funmilayo oversees financial planning, investor relations, and the payment infrastructure that powers every transaction on the platform — including our Paystack integration.",
    expertise: ["Financial Planning", "Investor Relations", "FinTech"],
    linkedin: "#",
  },
  {
    name: "Olumide Balogun",
    title: "Non-Executive Director",
    initials: "OB",
    color: "rgb(187, 19, 47)",
    bio: "Olumide is a partner at a leading pan-African private equity firm and brings institutional capital-raising experience to the board. He has sat on the boards of seven consumer-facing businesses and provides governance oversight and strategic counsel to the executive team.",
    expertise: ["Corporate Governance", "Private Equity", "Board Advisory"],
    linkedin: "#",
  },
  {
    name: "Dr. Ngozi Eze",
    title: "Non-Executive Director",
    initials: "NE",
    color: "rgb(32, 32, 65)",
    bio: "Dr. Eze is a public health physician and advocate for fair labour standards in the informal economy. She chairs our worker welfare committee, ensuring that every professional on the Deusizi Sparkle platform is treated with dignity, paid fairly, and supported in their career growth.",
    expertise: ["Worker Welfare", "Public Health", "Labour Standards"],
    linkedin: "#",
  },
  {
    name: "Tunde Fashola",
    title: "Independent Director",
    initials: "TF",
    color: "rgb(187, 19, 47)",
    bio: "With a 20-year career in Nigerian commercial law, Tunde serves as our independent legal director. He provides guidance on regulatory compliance, data protection, and the evolving legal landscape for digital platforms operating in Nigeria and across Anglophone West Africa.",
    expertise: ["Commercial Law", "Regulatory Compliance", "Data Protection"],
    linkedin: "#",
  },
];

const VALUES = [
  {
    icon: "🤝",
    title: "Dignity in every home",
    text: "We believe domestic professionals deserve respect, fair pay, and career progression. Our board is committed to standards that honour the people who make homes shine.",
  },
  {
    icon: "🏛️",
    title: "Strong governance",
    text: "Independent directors, clear accountability structures, and regular board reviews ensure Deusizi Sparkle is run with integrity and in the long-term interest of all stakeholders.",
  },
  {
    icon: "🌍",
    title: "Building for Africa",
    text: "Our board reflects the diversity and ambition of modern Nigeria. Every decision is made with an eye on the continent — expanding access to quality home services beyond our current cities.",
  },
  {
    icon: "📈",
    title: "Sustainable growth",
    text: "We grow only when our professionals and our customers are ready. The board holds the executive team accountable to metrics that matter: retention, satisfaction, and fair earnings.",
  },
];

const COMMITTEES = [
  {
    name: "Audit & Risk",
    chair: "Funmilayo Adeyemi",
    members: ["Olumide Balogun", "Tunde Fashola"],
    desc: "Oversees financial reporting, internal controls, and enterprise risk management.",
  },
  {
    name: "Worker Welfare",
    chair: "Dr. Ngozi Eze",
    members: ["Adaeze Okafor", "Funmilayo Adeyemi"],
    desc: "Sets and monitors standards for professional pay, safety, and career development.",
  },
  {
    name: "Nominations & Governance",
    chair: "Olumide Balogun",
    members: ["Tunde Fashola", "Dr. Ngozi Eze"],
    desc: "Manages board composition, succession planning, and governance best practice.",
  },
  {
    name: "Technology & Security",
    chair: "Chukwuemeka Nwosu",
    members: ["Tunde Fashola", "Olumide Balogun"],
    desc: "Provides oversight on platform security, data protection, and technology strategy.",
  },
];

export default function BoardOfDirectors() {
  const navigate = useNavigate();
  const [activeDirector, setActiveDirector] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Leadership & Governance</p>
        <h1 className={styles.heroTitle}>
          Board of
          <br />
          <em>Directors</em>
        </h1>
        <p className={styles.heroDesc}>
          The experienced leaders guiding Deusizi Sparkle's mission to
          professionalise home services and create opportunity across Nigeria.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          ["🏛️", "Strong governance"],
          ["👥", "6 board members"],
          ["🌍", "Pan-African vision"],
          ["⚖️", "Independent oversight"],
          ["💼", "150+ years combined experience"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Directors grid */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Our directors</p>
        <h2 className={styles.sectionTitle}>Meet the board</h2>
        <div className={styles.directorGrid}>
          {DIRECTORS.map((d, i) => (
            <div
              key={d.name}
              className={`${styles.directorCard} ${activeDirector === i ? styles.directorCardActive : ""}`}
              style={{ animationDelay: `${i * 0.07}s` }}
              onClick={() => setActiveDirector(activeDirector === i ? null : i)}
            >
              <div className={styles.directorCardTop}>
                <div
                  className={styles.directorAvatar}
                  style={{ background: d.color }}
                >
                  {d.initials}
                </div>
                <div className={styles.directorInfo}>
                  <p className={styles.directorName}>{d.name}</p>
                  <p className={styles.directorTitle}>{d.title}</p>
                </div>
                <span
                  className={`${styles.expandChevron} ${activeDirector === i ? styles.expandChevronOpen : ""}`}
                >
                  ▾
                </span>
              </div>

              <div className={styles.expertiseTags}>
                {d.expertise.map((tag) => (
                  <span key={tag} className={styles.expertiseTag}>
                    {tag}
                  </span>
                ))}
              </div>

              {activeDirector === i && (
                <div className={styles.directorBio}>
                  <div className={styles.bioDivider} />
                  <p className={styles.bioText}>{d.bio}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className={styles.valuesSection}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          What guides us
        </p>
        <h2 className={styles.valuesSectionTitle}>
          Principles of our governance
        </h2>
        <div className={styles.valueCards}>
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className={styles.valueCard}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={styles.valueIcon}>{v.icon}</div>
              <p className={styles.valueTitle}>{v.title}</p>
              <p className={styles.valueText}>{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Committees */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Board committees</p>
        <h2 className={styles.sectionTitle}>How we structure oversight</h2>
        <div className={styles.committeeList}>
          {COMMITTEES.map((c, i) => (
            <div
              key={c.name}
              className={styles.committeeCard}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={styles.committeeHeader}>
                <div className={styles.committeeNum}>{i + 1}</div>
                <div>
                  <p className={styles.committeeName}>{c.name}</p>
                  <p className={styles.committeeChair}>Chair: {c.chair}</p>
                </div>
              </div>
              <p className={styles.committeeDesc}>{c.desc}</p>
              <div className={styles.committeeMembers}>
                <span className={styles.committeeMembersLabel}>Members: </span>
                {c.members.join(" · ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Have a governance enquiry?</h2>
        <p className={styles.ctaText}>
          For investor relations, partnership proposals, or governance
          correspondence, reach our board secretariat directly.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/contact")}
          >
            Contact the Board
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/deusizi-group")}
          >
            About Deusizi Group
          </button>
        </div>
      </div>
    </div>
  );
}
