import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LocalShelterSupport.module.css";
import FixedHeader from "../FixedHeader";

const PROGRAMMES = [
  {
    icon: "🏠",
    title: "Shelter Partnership Clean",
    desc: "We provide free monthly professional cleaning services to registered women's shelters, youth shelters, and homeless support centres across Abuja and Lagos. A clean, dignified space supports recovery.",
    badge: "Free service",
  },
  {
    icon: "👩‍💼",
    title: "Agency Employment Pathway",
    desc: "We partner with job placement agencies and social welfare organisations to fast-track women from vulnerable backgrounds into paid maid roles on our platform. Skills training and placement included.",
    badge: "Paid employment",
  },
  {
    icon: "🧹",
    title: "Transitional Housing Support",
    desc: "We support women transitioning out of shelters into their own accommodation with a free deep clean of their new home — helping them start their next chapter with dignity.",
    badge: "One-off deep clean",
  },
  {
    icon: "🤝",
    title: "NGO & Welfare Agency Network",
    desc: "We work directly with NGOs, government welfare agencies, and community organisations to identify families and individuals who need cleaning support but cannot access it alone.",
    badge: "Referral network",
  },
];

const PARTNER_TYPES = [
  {
    icon: "🏛️",
    title: "Women's shelters",
    text: "Safe houses, domestic violence refuges, and women's crisis centres. We provide regular cleaning to maintain a safe and dignified environment for residents.",
  },
  {
    icon: "👦",
    title: "Youth & children's homes",
    text: "Registered children's homes, youth centres, and orphanages. We ensure the spaces where children grow up are clean, healthy, and well-maintained.",
  },
  {
    icon: "🧓",
    title: "Elderly care facilities",
    text: "Small residential care homes and supported living facilities for elderly Nigerians who are no longer able to care for their own spaces.",
  },
  {
    icon: "🏥",
    title: "Community health centres",
    text: "Clinic waiting areas, community health posts, and maternal health facilities in underserved areas where hygiene directly impacts patient outcomes.",
  },
  {
    icon: "📋",
    title: "Social welfare agencies",
    text: "Government and NGO welfare offices that refer vulnerable families to us for support cleaning — coordinated through our foundation referral network.",
  },
  {
    icon: "🏗️",
    title: "Transitional housing projects",
    text: "Housing projects supporting individuals moving from homelessness or shelters into independent living — we clean the new home before move-in.",
  },
];

const IMPACT = [
  { num: "12", label: "Partner organisations" },
  { num: "300+", label: "Residents supported" },
  { num: "45", label: "Women placed in work" },
  { num: "₦1M+", label: "Services donated" },
];

const HOW_IT_WORKS = [
  {
    title: "Organisation registers",
    text: "Your shelter, agency, or NGO submits a partnership application below. We review all applications within 5 working days.",
  },
  {
    title: "Eligibility assessment",
    text: "Our foundation team assesses the organisation's needs, resident numbers, and the type of support most appropriate — cleaning, employment placement, or both.",
  },
  {
    title: "Partnership agreement",
    text: "We agree a tailored support plan — frequency of cleans, number of residents for employment placement, and any specific requirements — and formalise the arrangement.",
  },
  {
    title: "Support begins",
    text: "Cleaning teams are deployed, or employment placement begins. A named foundation coordinator is assigned to your organisation for ongoing liaison.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sister Mary T.",
    org: "Grace Women's Shelter, Abuja",
    text: "Before Deusizi Sparkle came, our residents were living in a space that didn't reflect their worth. Now our shelter is spotless every month. It has changed the way our residents see themselves.",
    initials: "SM",
  },
  {
    name: "Director Balogun",
    org: "Lagos Youth Rehabilitation Centre",
    text: "We referred five young women to the Deusizi employment pathway. All five are now earning regular income. That is the kind of partnership that changes communities.",
    initials: "DB",
  },
  {
    name: "Coordinator Amaka",
    org: "Hopeful Hands NGO, Lagos",
    text: "The transitional housing clean they provided for our clients was more than a service. It was a message: you matter, and your new home matters too. Deeply grateful.",
    initials: "CA",
  },
];

const FAQS = [
  {
    q: "Does our organisation need to pay for support?",
    a: "No. All cleaning services, employment placement support, and foundation partnerships provided under this programme are free of charge to registered shelters, NGOs, and welfare agencies. This is funded entirely by the Deusizi Foundation.",
  },
  {
    q: "How do we qualify for support?",
    a: "Your organisation must be a registered shelter, NGO, welfare agency, or government welfare body operating in Abuja or Lagos. We review all applications individually and assess need, capacity, and impact potential.",
  },
  {
    q: "Can we refer individual families rather than an organisation?",
    a: "Yes — welfare agencies and social workers can refer individual families or persons for one-off cleaning support through our referral network. Use the form below and select 'Individual Family Referral' as the support type.",
  },
  {
    q: "How often will our shelter be cleaned?",
    a: "This depends on the size and needs of your organisation. Most shelter partners receive a monthly full clean. Larger facilities or those with higher need may qualify for fortnightly visits. We agree a schedule at the start of the partnership.",
  },
  {
    q: "Can we refer residents for employment on the Deusizi platform?",
    a: "Yes. This is one of our most impactful programmes. Residents who are interested in joining the platform as maids can be referred directly by your organisation. We handle skills assessment, training, and placement.",
  },
];

const SUPPORT_TYPES = [
  "Shelter cleaning support",
  "Youth / children's home cleaning",
  "Elderly care facility cleaning",
  "Employment placement referral",
  "Transitional housing clean",
  "Individual family referral",
  "General partnership enquiry",
];

export default function LocalShelterSupport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    orgType: "",
    supportType: "",
    residents: "",
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
    if (!form.orgName.trim()) e.orgName = "Please enter your organisation name";
    if (!form.contactName.trim()) e.contactName = "Please enter a contact name";
    if (!form.email.trim()) e.email = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.phone.trim()) e.phone = "Please enter a phone number";
    if (!form.city) e.city = "Please select your city";
    if (!form.supportType) e.supportType = "Please select a support type";
    if (!form.message.trim()) e.message = "Please describe your needs";
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
    await new Promise((r) => setTimeout(r, 1300));
    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Community partnership</p>
        <h1 className={styles.heroTitle}>
          Local shelter &
          <br />
          <em>agency support.</em>
        </h1>
        <p className={styles.heroDesc}>
          Deusizi Sparkle partners with shelters, NGOs, and welfare agencies
          across Abuja and Lagos to provide free professional cleaning,
          dignified living spaces, and employment pathways for the people who
          need them most.
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
            Apply for Support
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("programmes")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Our Programmes
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

      {/* Programmes */}
      <div className={styles.section} id="programmes">
        <p className={styles.sectionEyebrow}>What we offer</p>
        <h2 className={styles.sectionTitle}>Four programmes. One mission.</h2>
        <div className={styles.programmeGrid}>
          {PROGRAMMES.map((p) => (
            <div key={p.title} className={styles.programmeCard}>
              <div className={styles.programmeTop}>
                <div className={styles.programmeIcon}>{p.icon}</div>
                <span className={styles.programmeBadge}>{p.badge}</span>
              </div>
              <p className={styles.programmeTitle}>{p.title}</p>
              <p className={styles.programmeDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partner types */}
      <div className={styles.partners}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Who we support
        </p>
        <h2 className={styles.partnersTitle}>Organisations we work with</h2>
        <p className={styles.partnersSub}>
          If your organisation supports vulnerable people in Abuja or Lagos, we
          want to hear from you.
        </p>
        <div className={styles.partnerGrid}>
          {PARTNER_TYPES.map((p) => (
            <div key={p.title} className={styles.partnerCard}>
              <div className={styles.partnerIcon}>{p.icon}</div>
              <div>
                <p className={styles.partnerTitle}>{p.title}</p>
                <p className={styles.partnerText}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>The process</p>
        <h2 className={styles.sectionTitle}>How a partnership works</h2>
        <div className={styles.steps}>
          {HOW_IT_WORKS.map((s, i) => (
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

      {/* Testimonials */}
      <div className={styles.testimonials}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Partner voices
        </p>
        <h2 className={styles.testimonialsTitle}>What our partners say</h2>
        <div className={styles.testimonialList}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <p className={styles.testimonialText}>"{t.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>{t.initials}</div>
                <div>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialOrg}>{t.org}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application form */}
      <div className={styles.formSection} id="apply">
        <div className={styles.formInner}>
          <p className={styles.sectionEyebrow}>Apply for support</p>
          <h2 className={styles.sectionTitle}>Register your organisation</h2>
          <p className={styles.sectionSub}>
            Fill in the form below and our foundation team will be in touch
            within 5 working days.
          </p>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>🤝</div>
              <h3 className={styles.successTitle}>Application received!</h3>
              <p className={styles.successText}>
                Thank you for reaching out. Our foundation team will review your
                application and contact you within 5 working days.
              </p>
              <button
                className={styles.heroPrimary}
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    orgName: "",
                    contactName: "",
                    email: "",
                    phone: "",
                    city: "",
                    orgType: "",
                    supportType: "",
                    residents: "",
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
                    Organisation Name <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.orgName ? styles.inputError : ""}`}
                    name="orgName"
                    value={form.orgName}
                    onChange={handleChange}
                    placeholder="e.g. Grace Women's Shelter"
                  />
                  {errors.orgName && (
                    <p className={styles.error}>{errors.orgName}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Contact Person <span className={styles.req}>*</span>
                  </label>
                  <input
                    className={`${styles.input} ${errors.contactName ? styles.inputError : ""}`}
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder="e.g. Sister Mary Thomas"
                  />
                  {errors.contactName && (
                    <p className={styles.error}>{errors.contactName}</p>
                  )}
                </div>
              </div>

              <div className={styles.row}>
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
                    placeholder="e.g. contact@shelter.org.ng"
                  />
                  {errors.email && (
                    <p className={styles.error}>{errors.email}</p>
                  )}
                </div>
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
              </div>

              <div className={styles.row}>
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
                <div className={styles.field}>
                  <label className={styles.label}>
                    Organisation Type{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <select
                    className={`${styles.input} ${styles.select}`}
                    name="orgType"
                    value={form.orgType}
                    onChange={handleChange}
                  >
                    <option value="">Select type…</option>
                    <option>Women's shelter</option>
                    <option>Youth / children's home</option>
                    <option>Elderly care facility</option>
                    <option>Community health centre</option>
                    <option>NGO / welfare agency</option>
                    <option>Government welfare body</option>
                    <option>Transitional housing project</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Support Type Needed <span className={styles.req}>*</span>
                  </label>
                  <select
                    className={`${styles.input} ${styles.select} ${errors.supportType ? styles.inputError : ""}`}
                    name="supportType"
                    value={form.supportType}
                    onChange={handleChange}
                  >
                    <option value="">Select support type…</option>
                    {SUPPORT_TYPES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {errors.supportType && (
                    <p className={styles.error}>{errors.supportType}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Number of Residents / Beneficiaries{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    className={styles.input}
                    name="residents"
                    type="number"
                    min="1"
                    value={form.residents}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Describe your needs <span className={styles.req}>*</span>
                </label>
                <textarea
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your organisation, the people you serve, and what support would make the biggest difference…"
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
                    <span className={styles.spinner} /> Submitting…
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
        <h2 className={styles.sectionTitle}>Partnership questions answered</h2>
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
        <h2 className={styles.ctaTitle}>Every dignified space matters.</h2>
        <p className={styles.ctaText}>
          If your organisation supports vulnerable people, we want to be your
          cleaning partner. Apply today — no cost, no obligation.
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
            Apply for Support
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/foundation")}
          >
            Our Foundation
          </button>
        </div>
      </div>
    </div>
  );
}
