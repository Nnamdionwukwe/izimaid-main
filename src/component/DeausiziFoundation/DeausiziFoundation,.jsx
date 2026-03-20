import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DeausiziFoundation.module.css";
import FixedHeader from "../FixedHeader";

const PILLARS = [
  {
    icon: "🧹",
    title: "Clean homes for vulnerable families",
    text: "We provide free professional cleaning services to elderly, disabled, and low-income families across Abuja and Lagos who cannot afford or physically manage home cleaning.",
  },
  {
    icon: "👩‍🎓",
    title: "Maid training & skills development",
    text: "We fund vocational training programmes for unemployed women, equipping them with professional cleaning skills, certifications, and placement support on our platform.",
  },
  {
    icon: "🌿",
    title: "Eco-clean community outreach",
    text: "We run community cleaning drives in underserved neighbourhoods, promoting hygiene awareness and providing safe, eco-friendly cleaning products to households in need.",
  },
  {
    icon: "📚",
    title: "Hygiene education in schools",
    text: "We partner with public primary schools to deliver hygiene education workshops — teaching children the habits that prevent illness and build healthier communities.",
  },
];

const IMPACT = [
  { num: "200+", label: "Families helped" },
  { num: "80+", label: "Women trained" },
  { num: "15", label: "Schools reached" },
  { num: "₦2M+", label: "Value donated" },
];

const DONATION_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

const HOW_USED = [
  {
    percent: "40%",
    color: "rgb(187, 19, 47)",
    title: "Free home cleans",
    text: "Covers the cost of professional cleans for vulnerable families on our waitlist.",
  },
  {
    percent: "30%",
    color: "rgb(32, 32, 65)",
    title: "Maid training programme",
    text: "Funds training materials, certification fees, and placement support.",
  },
  {
    percent: "20%",
    color: "rgb(73, 221, 73)",
    title: "Community outreach",
    text: "Supplies cleaning products and funds hygiene drives in underserved areas.",
  },
  {
    percent: "10%",
    color: "rgb(150, 107, 7)",
    title: "Programme operations",
    text: "Administration, reporting, and coordination of all foundation activities.",
  },
];

const STORIES = [
  {
    name: "Mama Chidinma",
    location: "Gwarinpa, Abuja",
    text: "I am 74 years old and I live alone. My knees make it impossible to clean my home properly. When Deusizi Foundation sent a maid to help me, I cried. My home has never felt so clean. I feel human again.",
    initials: "MC",
  },
  {
    name: "Aisha K.",
    location: "Ikeja, Lagos",
    text: "I was unemployed for 14 months after losing my job. The foundation's training programme gave me a skill and placed me on the Deusizi Sparkle platform. I now earn ₦85,000 a month and support my three children.",
    initials: "AK",
  },
  {
    name: "Mrs. Okonkwo",
    location: "Maitama, Abuja",
    text: "My husband had a stroke and I became his full-time carer. I couldn't keep up with the house. The foundation cleaned our home every month for six months. That support meant more than I can put into words.",
    initials: "MO",
  },
];

const FAQS = [
  {
    q: "Is my donation tax-deductible?",
    a: "The Deusizi Foundation is in the process of registering as a formal charitable organisation. Once registered, all donations will qualify for tax relief. We will notify all donors when this is confirmed.",
  },
  {
    q: "How do I know my donation is being used properly?",
    a: "We publish an annual impact report detailing how every naira was spent, how many families were helped, and the outcomes achieved. Transparency is a core value of the foundation.",
  },
  {
    q: "Can I donate in someone else's name?",
    a: "Yes — when completing the donation form, simply add the name you'd like the gift to be made in. We'll send a personalised acknowledgement certificate to you or directly to the recipient.",
  },
  {
    q: "Can businesses or organisations donate?",
    a: "Absolutely. We welcome corporate donations and partnerships. Contact our foundation team at foundation@deusizisparkle.com to discuss a tailored arrangement.",
  },
  {
    q: "Can I volunteer instead of donating money?",
    a: "Yes. We welcome volunteers for community cleaning drives, school workshops, and maid training sessions. Use the form below and select 'Volunteer' as your preference.",
  },
];

export default function DeausiziFoundation() {
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState(2500);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [donateType, setDonateType] = useState("once");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount;

  function validate() {
    const e = {};
    if (!donorName.trim()) e.name = "Please enter your name";
    if (!donorEmail.trim()) e.email = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(donorEmail))
      e.email = "Please enter a valid email";
    if (!finalAmount || finalAmount < 100)
      e.amount = "Minimum donation is ₦100";
    return e;
  }

  async function handleDonate(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSending(true);
    // Replace with real Paystack or payment integration
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Deusizi Foundation</p>
        <h1 className={styles.heroTitle}>
          Cleaning with purpose.
          <br />
          <em>Giving with heart.</em>
        </h1>
        <p className={styles.heroDesc}>
          The Deusizi Foundation is the charitable arm of Deusizi Sparkle. We
          use the power of professional cleaning to transform lives — serving
          vulnerable families, training unemployed women, and building healthier
          communities across Nigeria.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() =>
              document
                .getElementById("donate")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Donate Now
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("mission")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Our Mission
          </button>
        </div>
      </div>

      {/* Impact stats */}
      <div className={styles.statsBar}>
        {IMPACT.map(({ num, label }) => (
          <div key={label} className={styles.statItem}>
            <p className={styles.statNum}>{num}</p>
            <p className={styles.statLabel}>{label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className={styles.section} id="mission">
        <p className={styles.sectionEyebrow}>Our mission</p>
        <h2 className={styles.sectionTitle}>
          A clean home is not a luxury — it's a right.
        </h2>
        <p className={styles.missionText}>
          Millions of Nigerian families live in homes they cannot properly
          maintain — due to age, disability, poverty, or circumstance. At the
          same time, thousands of women lack the skills and pathways to earn a
          reliable income. The Deusizi Foundation bridges both gaps. We put
          trained maids into the homes of those who need them most, and we fund
          the training that gives women the skills to earn their own way.
        </p>
      </div>

      {/* Four pillars */}
      <div className={styles.pillars}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          What we do
        </p>
        <h2 className={styles.pillarsTitle}>Our four programme pillars</h2>
        <div className={styles.pillarGrid}>
          {PILLARS.map((p) => (
            <div key={p.title} className={styles.pillarCard}>
              <div className={styles.pillarIcon}>{p.icon}</div>
              <p className={styles.pillarTitle}>{p.title}</p>
              <p className={styles.pillarText}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How donations are used */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Full transparency</p>
        <h2 className={styles.sectionTitle}>How your donation is used</h2>
        <p className={styles.sectionSub}>
          Every naira is accounted for. Here's exactly where your money goes.
        </p>
        <div className={styles.allocationGrid}>
          {HOW_USED.map((h) => (
            <div key={h.title} className={styles.allocationCard}>
              <div className={styles.allocationBar}>
                <div
                  className={styles.allocationFill}
                  style={{ width: h.percent, background: h.color }}
                />
              </div>
              <div className={styles.allocationMeta}>
                <span
                  className={styles.allocationPercent}
                  style={{ color: h.color }}
                >
                  {h.percent}
                </span>
                <span className={styles.allocationTitle}>{h.title}</span>
              </div>
              <p className={styles.allocationText}>{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stories */}
      <div className={styles.stories}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Real lives changed
        </p>
        <h2 className={styles.storiesTitle}>Their stories</h2>
        <p className={styles.storiesSub}>
          Behind every donation is a real family, a real woman, a real life made
          better.
        </p>
        <div className={styles.storyList}>
          {STORIES.map((s) => (
            <div key={s.name} className={styles.storyCard}>
              <p className={styles.storyText}>"{s.text}"</p>
              <div className={styles.storyAuthor}>
                <div className={styles.storyAvatar}>{s.initials}</div>
                <div>
                  <p className={styles.storyName}>{s.name}</p>
                  <p className={styles.storyLocation}>{s.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donation form */}
      <div className={styles.donateSection} id="donate">
        <div className={styles.donateInner}>
          <p className={styles.sectionEyebrow}>Make a difference</p>
          <h2 className={styles.sectionTitle}>
            Donate to the Deusizi Foundation
          </h2>
          <p className={styles.sectionSub}>
            Every amount matters. ₦500 helps clean a single room. ₦10,000 funds
            a family's monthly clean. ₦25,000 covers one week of maid training.
          </p>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>💚</div>
              <h3 className={styles.successTitle}>Thank you, {donorName}!</h3>
              <p className={styles.successText}>
                Your donation of{" "}
                <strong>₦{finalAmount.toLocaleString()}</strong> has been
                received. A confirmation will be sent to {donorEmail}. You are
                making a real difference.
              </p>
              <button
                className={styles.heroPrimary}
                onClick={() => {
                  setSubmitted(false);
                  setDonorName("");
                  setDonorEmail("");
                  setDonorMessage("");
                  setCustomAmount("");
                  setSelectedAmount(2500);
                }}
              >
                Donate again
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleDonate} noValidate>
              {/* Frequency toggle */}
              <div className={styles.freqRow}>
                {[
                  ["once", "Give once"],
                  ["monthly", "Give monthly"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.freqBtn} ${donateType === key ? styles.freqBtnActive : ""}`}
                    onClick={() => setDonateType(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Amount selector */}
              <div className={styles.field}>
                <label className={styles.label}>
                  Choose an amount <span className={styles.req}>*</span>
                </label>
                <div className={styles.amountGrid}>
                  {DONATION_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`${styles.amountBtn} ${selectedAmount === amt && !customAmount ? styles.amountBtnActive : ""}`}
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                        if (errors.amount)
                          setErrors((p) => ({ ...p, amount: "" }));
                      }}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  className={`${styles.input} ${errors.amount ? styles.inputError : ""}`}
                  type="number"
                  placeholder="Or enter a custom amount (₦)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                    if (errors.amount) setErrors((p) => ({ ...p, amount: "" }));
                  }}
                  min="100"
                />
                {errors.amount && (
                  <p className={styles.error}>{errors.amount}</p>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Full Name <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    value={donorName}
                    onChange={(e) => {
                      setDonorName(e.target.value);
                      if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                    }}
                    placeholder="e.g. Emeka Okonkwo"
                  />
                  {errors.name && <p className={styles.error}>{errors.name}</p>}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Email Address <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    type="email"
                    value={donorEmail}
                    onChange={(e) => {
                      setDonorEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                    }}
                    placeholder="e.g. emeka@email.com"
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Leave a message{" "}
                  <span className={styles.optional}>(optional)</span>
                </label>
                <textarea
                  className={styles.textarea}
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  placeholder="Why you're giving, or a message for the families we serve…"
                  rows={3}
                />
              </div>

              {/* Summary */}
              {finalAmount >= 100 && (
                <div className={styles.summary}>
                  <span className={styles.summaryLabel}>
                    {donateType === "monthly"
                      ? "Monthly donation"
                      : "One-time donation"}
                  </span>
                  <span className={styles.summaryAmount}>
                    ₦{finalAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className={styles.donateBtn}
                disabled={sending}
              >
                {sending ? (
                  <span className={styles.spinnerRow}>
                    <span className={styles.spinner} /> Processing…
                  </span>
                ) : (
                  `Donate ₦${finalAmount >= 100 ? finalAmount.toLocaleString() : "—"} ${donateType === "monthly" ? "/ month" : "now"}`
                )}
              </button>

              <p className={styles.secureNote}>
                🔒 Payments processed securely via Paystack
              </p>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Donation questions answered</h2>
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
        <h2 className={styles.ctaTitle}>A clean home changes everything.</h2>
        <p className={styles.ctaText}>
          Help us reach more families, train more women, and build cleaner
          communities across Nigeria.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() =>
              document
                .getElementById("donate")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Donate Now
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/contact")}
          >
            Partner With Us
          </button>
        </div>
      </div>
    </div>
  );
}
