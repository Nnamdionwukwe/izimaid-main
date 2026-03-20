import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OwnAFranchise.module.css";
import FixedHeader from "../FixedHeader";

const BENEFITS = [
  {
    icon: "🏷️",
    title: "Proven brand & system",
    text: "Launch under the Deusizi Sparkle name — a trusted brand already operating across Abuja and Lagos. You get the playbook, the processes, and the reputation from day one.",
  },
  {
    icon: "📱",
    title: "Full tech platform",
    text: "Your franchise comes with access to our booking platform, maid management system, customer app, and admin dashboard. No tech build required.",
  },
  {
    icon: "🎓",
    title: "Training & onboarding",
    text: "We train you and your team on operations, quality standards, customer service, and maid management. Ongoing support included.",
  },
  {
    icon: "📣",
    title: "Marketing support",
    text: "We handle national brand awareness while you focus on local growth. You get templates, social content, and campaign support from our team.",
  },
  {
    icon: "💰",
    title: "Strong unit economics",
    text: "Home cleaning is a recurring revenue business. Customers book monthly or weekly — meaning predictable income and a compounding customer base.",
  },
  {
    icon: "🤝",
    title: "Dedicated franchise manager",
    text: "Every franchisee gets a named contact at HQ. Questions, escalations, or growth planning — your manager is one message away.",
  },
];

const STEPS = [
  {
    title: "Submit your enquiry",
    text: "Fill in the form below with your details and target city. Our franchise team will review your application within 48 hours.",
  },
  {
    title: "Discovery call",
    text: "We schedule a 30-minute call to walk you through the model, answer your questions, and assess fit. No pressure — just a conversation.",
  },
  {
    title: "Franchise agreement",
    text: "If both sides are happy, we move to the formal agreement. Our team guides you through every clause before you sign.",
  },
  {
    title: "Training & setup",
    text: "You complete our onboarding programme — operations, platform, standards. We help you hire your first maids and set up your territory.",
  },
  {
    title: "Launch & grow",
    text: "Go live in your city. Our team supports your launch campaign, your first bookings, and your ramp-up to profitability.",
  },
];

const FAQS = [
  {
    q: "How much does a Deusizi Sparkle franchise cost?",
    a: "Franchise fees vary by territory size and city. We'll share full financials — setup cost, royalty structure, and projected returns — on your discovery call. We believe in full transparency before you commit.",
  },
  {
    q: "Do I need experience in cleaning or domestic services?",
    a: "No prior industry experience is required. We're looking for people with strong local networks, management ability, and a commitment to quality. We provide all the technical and operational training.",
  },
  {
    q: "What cities are available for franchising?",
    a: "We're currently expanding beyond Abuja and Lagos. Port Harcourt, Enugu, Kano, and Ibadan are priority territories. If your city isn't listed, apply anyway — we assess each location on its merits.",
  },
  {
    q: "Will I be competing with other Deusizi Sparkle franchisees?",
    a: "No. Each franchisee receives an exclusive territory. We define clear geographic boundaries in the agreement so there's no overlap or internal competition.",
  },
  {
    q: "How long before I become profitable?",
    a: "Most franchisees reach break-even within 3–6 months, depending on their local marketing effort and team size. We provide a financial model based on your territory during the discovery call.",
  },
  {
    q: "What ongoing support do I receive after launch?",
    a: "You get a dedicated franchise manager, access to our operations playbook, quarterly business reviews, platform updates, and national marketing support. You're in business for yourself, not by yourself.",
  },
];

const TERRITORIES = [
  { city: "Port Harcourt", status: "Available", flag: "🟢" },
  { city: "Enugu", status: "Available", flag: "🟢" },
  { city: "Kano", status: "Available", flag: "🟢" },
  { city: "Ibadan", status: "Available", flag: "🟢" },
  { city: "Abuja", status: "Active", flag: "🔵" },
  { city: "Lagos", status: "Active", flag: "🔵" },
];

const SUBJECT_OPTIONS = [
  "General Franchise Enquiry",
  "Specific Territory Interest",
  "Investment / Financial Questions",
  "Partnership Proposal",
  "Other",
];

export default function OwnAFranchise() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.email.trim()) e.email = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.phone.trim()) e.phone = "Please enter your phone number";
    if (!form.city.trim()) e.city = "Please enter your target city";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Please tell us about yourself";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Franchise opportunity</p>
        <h1 className={styles.heroTitle}>
          Own a Deusizi Sparkle
          <br />
          <em>franchise in your city.</em>
        </h1>
        <p className={styles.heroDesc}>
          Join Nigeria's fastest-growing home cleaning brand. Run your own
          territory, build a recurring revenue business, and benefit from a
          proven system — with full support from our team.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() =>
              document
                .getElementById("apply")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Apply Now
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("how-it-works")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            How It Works
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        {[
          ["2", "Active cities"],
          ["50+", "Maids on platform"],
          ["100+", "Homes cleaned"],
          ["5★", "Average rating"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Why franchise with us</p>
        <h2 className={styles.sectionTitle}>
          Everything you need to launch and scale
        </h2>
        <div className={styles.benefitCards}>
          {BENEFITS.map((b) => (
            <div key={b.title} className={styles.benefitCard}>
              <div className={styles.benefitIcon}>{b.icon}</div>
              <div>
                <p className={styles.benefitTitle}>{b.title}</p>
                <p className={styles.benefitText}>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available territories */}
      <div className={styles.territories}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Territory map
        </p>
        <h2 className={styles.territoriesTitle}>Available territories</h2>
        <p className={styles.territoriesSub}>
          🟢 Available &nbsp;·&nbsp; 🔵 Active (not available)
        </p>
        <div className={styles.territoryGrid}>
          {TERRITORIES.map((t) => (
            <div
              key={t.city}
              className={`${styles.territoryCard} ${t.status === "Active" ? styles.territoryActive : ""}`}
            >
              <span className={styles.territoryFlag}>{t.flag}</span>
              <div>
                <p className={styles.territoryCity}>{t.city}</p>
                <p className={styles.territoryStatus}>{t.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.process} id="how-it-works">
        <p className={styles.sectionEyebrow}>The process</p>
        <h2 className={styles.sectionTitle}>How to become a franchisee</h2>
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

      {/* Application form */}
      <div className={styles.formSection} id="apply">
        <div className={styles.formInner}>
          <p className={styles.sectionEyebrow}>Apply today</p>
          <h2 className={styles.sectionTitle}>Start your franchise enquiry</h2>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✅</div>
              <h3 className={styles.successTitle}>Application received!</h3>
              <p className={styles.successText}>
                Thanks for your interest. Our franchise team will be in touch
                within 48 hours to schedule your discovery call.
              </p>
              <button
                className={styles.heroPrimary}
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    city: "",
                    subject: "",
                    message: "",
                  });
                }}
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Full Name <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
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
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. emeka@email.com"
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Phone Number <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0803 0588 774"
                  />
                  {errors.phone && (
                    <p className={styles.error}>{errors.phone}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Target City <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.city ? styles.inputError : ""}`}
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Port Harcourt"
                  />
                  {errors.city && <p className={styles.error}>{errors.city}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Subject <span className={styles.req}>*</span>
                </label>
                <select
                  className={`${styles.input} ${styles.select} ${errors.subject ? styles.inputError : ""}`}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Select a subject…</option>
                  {SUBJECT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className={styles.error}>{errors.subject}</p>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Tell us about yourself <span className={styles.req}>*</span>
                </label>
                <textarea
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your background, why you're interested, and what you'd bring to the franchise…"
                  rows={5}
                />
                {errors.message && (
                  <p className={styles.error}>{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={sending}
              >
                {sending ? (
                  <span className={styles.spinnerRow}>
                    <span className={styles.spinner} /> Sending…
                  </span>
                ) : (
                  "Submit Franchise Enquiry"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Franchise questions answered</h2>
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
        <h2 className={styles.ctaTitle}>Ready to own your territory?</h2>
        <p className={styles.ctaText}>
          Applications take less than 5 minutes. Our team responds within 48
          hours.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() =>
              document
                .getElementById("apply")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Apply Now
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/contact")}
          >
            Contact Us First
          </button>
        </div>
      </div>
    </div>
  );
}
