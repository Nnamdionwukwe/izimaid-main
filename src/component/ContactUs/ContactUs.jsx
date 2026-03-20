import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ContactUs.module.css";
import FixedHeader from "../FixedHeader";

const CONTACT_METHODS = [
  {
    icon: "📞",
    title: "Call Us",
    detail: "0803 0588 774",
    sub: "Mon – Sat, 8am – 6pm",
    href: "tel:+2348030588774",
  },
  {
    icon: "✉️",
    title: "Email Us",
    detail: "hello@deusizisparkle.com",
    sub: "We reply within 24 hours",
    href: "mailto:hello@deusizisparkle.com",
  },
  {
    icon: "📍",
    title: "Our Locations",
    detail: "Abuja & Lagos",
    sub: "Serving homes across both cities",
    href: null,
  },
  {
    icon: "💬",
    title: "WhatsApp",
    detail: "Chat with us",
    sub: "Quick answers, fast response",
    href: "https://wa.me/2348030588774",
  },
];

const FAQS = [
  {
    q: "How quickly can I get a response?",
    a: "We aim to respond to all enquiries within 24 hours on business days. For urgent requests, calling or WhatsApp is the fastest route.",
  },
  {
    q: "Can I book directly through this form?",
    a: "This form is for general enquiries and quotes. To book a maid, head to our Browse Maids page where you can see availability and book instantly.",
  },
  {
    q: "Do you serve my area?",
    a: "We currently operate across Abuja (Gwarinpa, Maitama, Wuse, Garki, Jabi and more) and Lagos (Lekki, Victoria Island, Ikeja, Ajah and more). Enter your location when booking to confirm coverage.",
  },
  {
    q: "What if I have a complaint?",
    a: "We take feedback very seriously. Use the contact form, select 'Complaint' as the subject, and a manager will follow up within 12 hours to resolve the issue.",
  },
];

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Request a Quote",
  "Complaint",
  "Partnership",
  "Other",
];

export default function ContactUs() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Please enter your message";
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
    // Simulate submission — replace with real API call
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Get in touch</p>
        <h1 className={styles.heroTitle}>
          We're here to <em>help you.</em>
        </h1>
        <p className={styles.heroDesc}>
          Questions, quotes, feedback or complaints — our team is ready. Reach
          us by phone, email, WhatsApp, or fill in the form below.
        </p>
        <div className={styles.heroDivider} />
      </div>

      {/* Contact method cards */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Reach us</p>
        <h2 className={styles.sectionTitle}>Choose how to connect</h2>
        <div className={styles.methodGrid}>
          {CONTACT_METHODS.map((m) => {
            const inner = (
              <>
                <div className={styles.methodIcon}>{m.icon}</div>
                <div>
                  <p className={styles.methodTitle}>{m.title}</p>
                  <p className={styles.methodDetail}>{m.detail}</p>
                  <p className={styles.methodSub}>{m.sub}</p>
                </div>
              </>
            );
            return m.href ? (
              <a
                key={m.title}
                href={m.href}
                className={styles.methodCard}
                target="_blank"
                rel="noreferrer"
              >
                {inner}
              </a>
            ) : (
              <div key={m.title} className={styles.methodCard}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact form */}
      <div className={styles.formSection}>
        <div className={styles.formInner}>
          <p className={styles.sectionEyebrow}>Send a message</p>
          <h2 className={styles.sectionTitle}>Fill in the form below</h2>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✅</div>
              <h3 className={styles.successTitle}>Message sent!</h3>
              <p className={styles.successText}>
                Thanks for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                className={styles.heroPrimary}
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                  });
                }}
              >
                Send another message
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
                    Phone Number{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    className={styles.input}
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0803 0588 774"
                  />
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
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Message <span className={styles.req}>*</span>
                </label>
                <textarea
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help…"
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
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Questions?</p>
        <h2 className={styles.sectionTitle}>Common enquiries answered</h2>
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
        <h2 className={styles.ctaTitle}>Ready to book a clean?</h2>
        <p className={styles.ctaText}>
          Browse available maids near you and book in under 2 minutes.
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
