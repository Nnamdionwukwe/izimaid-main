import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OfficeCleaningTips.module.css";
import FixedHeader from "../FixedHeader";

const SERVICES = [
  {
    icon: "🏢",
    name: "Daily Office Clean",
    tagline: "Fresh every morning",
    desc: "A thorough daily clean carried out before your team arrives or after they leave. Desks, floors, kitchen, and bathrooms maintained to a consistent standard every single working day.",
    checklist: [
      "Empty and reline all bins",
      "Wipe all desks and workstations",
      "Vacuum carpets and mop hard floors",
      "Clean and sanitise kitchen area",
      "Scrub toilets, basins, and mirrors",
      "Restock soap and paper supplies",
    ],
    from: "₦12,000",
  },
  {
    icon: "🔬",
    name: "Deep Office Clean",
    tagline: "Top-to-bottom reset",
    desc: "A comprehensive deep clean for offices that need more than daily maintenance. Perfect for quarterly resets, post-event cleans, or new office fit-outs before your team moves in.",
    checklist: [
      "Everything in Daily Clean",
      "Clean inside kitchen appliances",
      "Wipe down all walls and partitions",
      "Clean air vents and ceiling fans",
      "Sanitise all door handles and switches",
      "Deep-clean all bathroom fixtures",
    ],
    from: "₦25,000",
  },
  {
    icon: "🪟",
    name: "Window & Glass Clean",
    tagline: "Crystal-clear all round",
    desc: "Internal window and glass partition cleaning for offices. Streak-free results on all glass surfaces including internal partitions, glass doors, display cases, and office windows.",
    checklist: [
      "Clean all internal window glass",
      "Wipe glass partitions and doors",
      "Clean glass display cases",
      "Polish all mirrors",
      "Wipe window frames and sills",
      "Remove all fingerprints and smears",
    ],
    from: "₦8,000",
  },
];

const CHECKLIST_AREAS = {
  Workstations: [
    "Wipe all desk surfaces",
    "Clean monitor screens with microfibre",
    "Sanitise keyboards and mice",
    "Wipe telephone handsets",
    "Clean desk pedestals and drawers",
    "Remove all rubbish and clutter",
  ],
  Kitchen: [
    "Wipe all countertops and surfaces",
    "Clean sink and descale taps",
    "Wipe microwave inside and out",
    "Clean fridge exterior and handle",
    "Wipe kettle and coffee machine",
    "Mop kitchen floor",
  ],
  Bathrooms: [
    "Scrub and disinfect all toilets",
    "Clean and sanitise basins",
    "Wipe mirrors and glass",
    "Mop and disinfect floor",
    "Restock soap and paper towels",
    "Empty sanitary bins",
  ],
  "Common Areas": [
    "Vacuum all carpeted areas",
    "Mop all hard floors",
    "Dust reception furniture",
    "Wipe skirting boards",
    "Clean entrance glass doors",
    "Empty all bins and reline",
  ],
};

const REASONS = [
  {
    icon: "🧠",
    title: "Productivity rises with cleanliness",
    text: "Studies show employees in clean, well-maintained offices are measurably more productive and report higher job satisfaction. A clean workspace reduces mental clutter and signals that the organisation values its team.",
  },
  {
    icon: "🦠",
    title: "Reduce sick days significantly",
    text: "Office surfaces — keyboards, phones, door handles — harbour bacteria that spread illness rapidly through teams. Regular professional sanitisation of high-touch surfaces significantly reduces workplace illness transmission and absenteeism.",
  },
  {
    icon: "🤝",
    title: "First impressions for clients",
    text: "Your office tells every client and visitor exactly what standard to expect from your business. A clean, fresh-smelling, well-maintained office communicates professionalism before a single word is spoken.",
  },
  {
    icon: "⚖️",
    title: "Workplace health compliance",
    text: "Employers in Nigeria have a legal obligation to provide a safe and clean working environment. Professional cleaning creates and maintains a documented standard of cleanliness that protects both employees and employers.",
  },
];

const STEPS = [
  {
    title: "Tell us about your office",
    text: "Share your office size, cleaning frequency, and any specific requirements. We tailor a cleaning plan to your layout, team size, and schedule.",
  },
  {
    title: "We match you with the right professional",
    text: "Your assigned cleaner is vetted, trained in commercial cleaning standards, and briefed on your specific office requirements before the first visit.",
  },
  {
    title: "Cleaning on your schedule",
    text: "We work before your team arrives, after they leave, or during the day — whatever disrupts your workflow the least. You set the schedule, we keep to it.",
  },
  {
    title: "Consistent quality, every time",
    text: "The same professional cleans your office on each visit so they know your space. Any issues are reported to you same-day and resolved immediately.",
  },
];

const TIPS = [
  "Schedule office cleans for early morning or late evening to avoid disrupting your team's working hours.",
  "Deep-clean your office kitchen weekly — it is the highest-traffic area and the fastest to deteriorate.",
  "Provide a dedicated cleaning cupboard or storage area for your cleaning professional's products and equipment.",
  "Brief your cleaner on any sensitive documents or equipment that should not be moved or touched.",
  "Book a quarterly deep clean in addition to daily or weekly maintenance to reset the entire space.",
];

const FAQS = [
  {
    q: "Can you clean outside of business hours?",
    a: "Yes. The majority of our office cleans take place before 8am or after 6pm so as not to disrupt your team. We can also clean during lunch hours or at weekends. You choose the schedule and we work to it.",
  },
  {
    q: "Do you supply all cleaning products and equipment?",
    a: "Yes. Our professionals arrive with all commercial-grade cleaning products, microfibre cloths, mops, and equipment. You only need to provide access to running water and electricity. If you prefer specific products, let us know and we can accommodate.",
  },
  {
    q: "How do you handle sensitive areas like server rooms or executive offices?",
    a: "We follow your briefing exactly. Areas that should not be entered are marked off. Executive offices can be cleaned only when the occupant is present if preferred. All our professionals are vetted and sign confidentiality agreements on engagement.",
  },
  {
    q: "What is the minimum contract for daily office cleaning?",
    a: "We do not require long-term contracts. You can book on a weekly basis and adjust or cancel with 7 days' notice. We believe the quality of our work should be the only reason you stay with us.",
  },
  {
    q: "Can you provide cleaning for multiple office locations?",
    a: "Yes. We coordinate cleaning across multiple sites and ensure consistent standards at every location. A single point of contact manages all your offices and a unified reporting system tracks quality across sites.",
  },
  {
    q: "Do you carry out post-construction or pre-move-in office cleans?",
    a: "Yes. Post-construction cleans remove dust, debris, and installation residue before your team moves in. Pre-move-in cleans prepare a new office to a fresh, sanitised standard. Both are available as one-off services.",
  },
];

const INDUSTRIES = [
  { icon: "💻", name: "Tech & Startups" },
  { icon: "⚕️", name: "Healthcare Clinics" },
  { icon: "🏦", name: "Finance & Banking" },
  { icon: "⚖️", name: "Law Firms" },
  { icon: "🏗️", name: "Construction Firms" },
  { icon: "📚", name: "Education & Training" },
  { icon: "🛍️", name: "Retail Offices" },
  { icon: "📣", name: "Media & Agencies" },
];

export default function OfficeCleaningTips() {
  const navigate = useNavigate();
  const [activeArea, setActiveArea] = useState("Workstations");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Professional office cleaning</p>
        <h1 className={styles.heroTitle}>
          A workspace your team
          <br />
          <em>is proud of.</em>
        </h1>
        <p className={styles.heroDesc}>
          Daily, weekly, and deep office cleans across Abuja and Lagos.
          Consistent quality, flexible scheduling, no long-term contracts.
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
          ["🕐", "Before or after hours"],
          ["📋", "No long-term contracts"],
          ["⚡", "Same-week start"],
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
        <p className={styles.sectionEyebrow}>Our services</p>
        <h2 className={styles.sectionTitle}>
          Choose the right clean for your office
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
        <h2 className={styles.checklistTitle}>Every area covered</h2>
        <p className={styles.checklistSub}>
          Here's exactly what's included in every office clean — nothing
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

      {/* Industries */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Who we serve</p>
        <h2 className={styles.sectionTitle}>
          Trusted by offices across every industry
        </h2>
        <div className={styles.industriesGrid}>
          {INDUSTRIES.map((ind) => (
            <div key={ind.name} className={styles.industryCard}>
              <span className={styles.industryIcon}>{ind.icon}</span>
              <span className={styles.industryName}>{ind.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why it matters */}
      <div className={styles.reasons}>
        <p className={styles.sectionEyebrow}>Why it matters</p>
        <h2 className={styles.sectionTitle}>Clean offices perform better</h2>
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
          Up and running in 4 simple steps
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
            Tips for a well-run office clean
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
        <h2 className={styles.ctaTitle}>Ready to upgrade your office clean?</h2>
        <p className={styles.ctaText}>
          No long-term contracts. All products supplied. Flexible scheduling
          around your team. Book in under 2 minutes.
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
