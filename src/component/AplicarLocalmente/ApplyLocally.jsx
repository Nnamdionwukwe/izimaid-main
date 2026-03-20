import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ApplyLocally.module.css";
import FixedHeader from "../FixedHeader";

const BENEFITS = [
  {
    icon: "💰",
    title: "Flexible earnings",
    text: "Set your own hourly rate and work the hours you choose. You control your schedule — full-time, part-time, or weekends only.",
  },
  {
    icon: "📱",
    title: "Bookings through the app",
    text: "Receive job requests directly on your phone. Accept, decline, or manage your bookings with one tap — no calls, no paperwork.",
  },
  {
    icon: "🏠",
    title: "Work close to home",
    text: "We match customers with maids in their local area. You'll work in homes near you — less travel time, more productive hours.",
  },
  {
    icon: "🛡️",
    title: "Secure, guaranteed payments",
    text: "Customers pay online via Paystack before you arrive. You'll never chase a payment — funds land in your account on time, every time.",
  },
  {
    icon: "⭐",
    title: "Build your reputation",
    text: "Every great job earns five-star reviews. A strong profile means more bookings, better clients, and growing income over time.",
  },
  {
    icon: "🎓",
    title: "Training & ongoing support",
    text: "You'll get access to our cleaning standards and quality guides. Our support team is always available if you need help with anything.",
  },
];

const STEPS = [
  {
    title: "Complete your application",
    text: "Fill in the form below with your details, location, and experience. It takes just a few minutes.",
  },
  {
    title: "Review & verification",
    text: "Our team reviews your application and runs a basic background check. We typically respond within 48 hours.",
  },
  {
    title: "Set up your profile",
    text: "Once approved, set up your profile with your photo, services offered, hourly rate, and availability.",
  },
  {
    title: "Receive your first booking",
    text: "Customers in your area will find your profile. Accept your first booking and start earning.",
  },
];

const FAQS = [
  {
    q: "Do I need previous cleaning experience?",
    a: "Experience is an advantage but not required. What matters most is your commitment to quality, punctuality, and attention to detail. We provide cleaning standards and quality guides for all new members.",
  },
  {
    q: "How much can I earn?",
    a: "Earnings depend on your hourly rate, hours worked, and review rating. Active maids in Abuja and Lagos earn between ₦30,000 and ₦120,000 per month working regular hours.",
  },
  {
    q: "Do I need to bring my own cleaning supplies?",
    a: "Most customers provide cleaning supplies or agree on them in advance. If you bring your own products, you can charge an additional fee — this is entirely at your discretion.",
  },
  {
    q: "How does payment work?",
    a: "Customers pay online before the service via Paystack. Once the job is completed, payment is released directly to your registered bank account.",
  },
  {
    q: "Can I decline bookings that don't work for me?",
    a: "Yes. You have full control over which bookings you accept. You can review the job details — location, duration, cleaning type — before confirming.",
  },
  {
    q: "Which cities do you currently operate in?",
    a: "We currently operate in Abuja and Lagos, with plans to expand to more Nigerian cities soon. If you're not in either city, apply anyway — we'll notify you when we reach your area.",
  },
];

const REQUIREMENTS = [
  "Be 18 years of age or older",
  "Own a smartphone with internet access",
  "Hold a valid government-issued ID",
  "Live in Abuja or Lagos",
  "Be able to communicate with customers",
  "Commit to Deusizi Sparkle quality standards",
];

const SERVICES = [
  "General home cleaning",
  "Deep cleaning",
  "Kitchen cleaning",
  "Bathroom cleaning",
  "Laundry & ironing",
  "Home organisation",
  "Window cleaning",
  "Carpet cleaning",
];

export default function ApplyLocally() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    experience: "",
    services: [],
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

  function toggleService(s) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.email.trim()) e.email = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.phone.trim()) e.phone = "Please enter your phone number";
    if (!form.city) e.city = "Please select your city";
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
        <p className={styles.heroEyebrow}>Apply locally</p>
        <h1 className={styles.heroTitle}>
          Work as a maid with
          <br />
          <em>Deusizi Sparkle.</em>
        </h1>
        <p className={styles.heroDesc}>
          Join our network of cleaning professionals in Abuja and Lagos. Set
          your own schedule, name your rate, and earn money doing what you do
          best.
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
          ["50+", "Active maids"],
          ["₦80k", "Avg. monthly earnings"],
          ["2", "Active cities"],
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
        <p className={styles.sectionEyebrow}>Why join us</p>
        <h2 className={styles.sectionTitle}>
          Everything you need to start earning
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

      {/* Requirements */}
      <div className={styles.requirements}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Requirements
        </p>
        <h2 className={styles.requirementsTitle}>What you need to apply</h2>
        <p className={styles.requirementsSub}>
          We're looking for committed, punctual people who take pride in their
          work.
        </p>
        <div className={styles.requirementGrid}>
          {REQUIREMENTS.map((r) => (
            <div key={r} className={styles.requirementItem}>
              <div className={styles.requirementCheck}>✓</div>
              <span className={styles.requirementText}>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.process} id="how-it-works">
        <p className={styles.sectionEyebrow}>The process</p>
        <h2 className={styles.sectionTitle}>
          From application to your first job
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

      {/* Application form */}
      <div className={styles.formSection} id="apply">
        <div className={styles.formInner}>
          <p className={styles.sectionEyebrow}>Your application</p>
          <h2 className={styles.sectionTitle}>Apply to join our team</h2>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✅</div>
              <h3 className={styles.successTitle}>Application received!</h3>
              <p className={styles.successText}>
                Thanks for your interest. Our team will review your application
                and be in touch within 48 hours.
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
                    experience: "",
                    services: [],
                    message: "",
                  });
                }}
              >
                Submit another application
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
                    placeholder="e.g. Ngozi Adeyemi"
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
                    placeholder="e.g. ngozi@email.com"
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
                    City <span className={styles.req}>*</span>
                  </label>
                  <select
                    className={`${styles.input} ${styles.select} ${errors.city ? styles.inputError : ""}`}
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                  >
                    <option value="">Select your city…</option>
                    <option value="Abuja">Abuja</option>
                    <option value="Lagos">Lagos</option>
                  </select>
                  {errors.city && <p className={styles.error}>{errors.city}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Years of experience{" "}
                  <span className={styles.optional}>(optional)</span>
                </label>
                <select
                  className={`${styles.input} ${styles.select}`}
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                >
                  <option value="">Select an option…</option>
                  <option value="0">No previous experience</option>
                  <option value="1">Less than 1 year</option>
                  <option value="2">1 – 2 years</option>
                  <option value="3">3 – 5 years</option>
                  <option value="5+">More than 5 years</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Services you can offer{" "}
                  <span className={styles.optional}>(optional)</span>
                </label>
                <div className={styles.serviceGrid}>
                  {SERVICES.map((s) => {
                    const selected = form.services.includes(s);
                    return (
                      <div
                        key={s}
                        className={`${styles.serviceItem} ${selected ? styles.serviceItemActive : ""}`}
                        onClick={() => toggleService(s)}
                      >
                        <div
                          className={`${styles.serviceCheck} ${selected ? styles.serviceCheckActive : ""}`}
                        >
                          {selected && "✓"}
                        </div>
                        <span>{s}</span>
                      </div>
                    );
                  })}
                </div>
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
                  placeholder="Your background, why you're interested, and your availability…"
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
                  "Submit Application"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Everything you need to know</h2>
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
        <h2 className={styles.ctaTitle}>Ready to start earning?</h2>
        <p className={styles.ctaText}>
          Join our network of professionals and receive your first booking this
          week.
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
            Contact Our Team
          </button>
        </div>
      </div>
    </div>
  );
}
