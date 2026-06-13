import { useState } from "react";
import styles from "./CleanerTraining.module.css";
import FixedHeader from "../FixedHeader";

const TRACKS = [
  {
    icon: "🧹",
    title: "Home Cleaning Professional",
    duration: "2 weeks",
    level: "Beginner",
    desc: "Master residential cleaning from basics to deep clean. Learn product safety, surface care, and client communication.",
    topics: [
      "Cleaning chemistry",
      "Surface care",
      "Safety protocols",
      "Client etiquette",
    ],
    popular: true,
  },
  {
    icon: "🏢",
    title: "Commercial & Office Cleaning",
    duration: "3 weeks",
    level: "Beginner – Intermediate",
    desc: "Professional techniques for offices, retail spaces, and commercial properties. Includes equipment certification.",
    topics: [
      "Commercial equipment",
      "Sanitisation standards",
      "Scheduling",
      "Large-space management",
    ],
    popular: false,
  },
  {
    icon: "✨",
    title: "Deep Cleaning Specialist",
    duration: "1 week",
    level: "Intermediate",
    desc: "Intensive training in deep cleaning kitchens, bathrooms, and high-traffic areas. Includes oven and tile restoration.",
    topics: [
      "Oven & appliance",
      "Tile & grout",
      "Mould treatment",
      "Carpet care",
    ],
    popular: false,
  },
  {
    icon: "🧴",
    title: "Post-Construction Cleaning",
    duration: "2 weeks",
    level: "Intermediate – Advanced",
    desc: "Specialised training for cleaning after renovation and construction. Dust management, debris removal, and finishing.",
    topics: [
      "Dust management",
      "Window finishing",
      "Debris clearance",
      "Safety gear",
    ],
    popular: false,
  },
  {
    icon: "🍽️",
    title: "Kitchen & Hospitality Cleaning",
    duration: "2 weeks",
    level: "Beginner – Intermediate",
    desc: "Hygiene-focused training for kitchen, catering, and hospitality environments. Meets NAFDAC standards.",
    topics: [
      "Food-safe products",
      "Grease removal",
      "NAFDAC compliance",
      "Odour control",
    ],
    popular: false,
  },
  {
    icon: "👶",
    title: "Childcare & Elderly Home Cleaning",
    duration: "1 week",
    level: "Beginner",
    desc: "Gentle and non-toxic cleaning methods for homes with children, elderly, or people with allergies.",
    topics: [
      "Non-toxic products",
      "Allergen control",
      "Soft surface care",
      "Fragrance-free methods",
    ],
    popular: false,
  },
];

const OUTCOMES = [
  {
    icon: "🎓",
    title: "Certified by Deusizi",
    text: "Receive a Deusizi Academy certificate recognised by top employers and booking platforms.",
  },
  {
    icon: "💼",
    title: "Immediate job placement",
    text: "Graduates are first in line for bookings on the Deusizi Sparkle platform — sometimes before training ends.",
  },
  {
    icon: "💰",
    title: "Higher earning potential",
    text: "Certified cleaners earn up to 40% more per hour than uncertified applicants on our platform.",
  },
  {
    icon: "📱",
    title: "Access to the app",
    text: "Set your schedule, accept bookings, and manage your earnings all from the Deusizi Sparkle app.",
  },
];

const SCHEDULE = [
  {
    day: "Day 1 – 2",
    title: "Orientation & Safety",
    text: "Platform introduction, safety protocols, product knowledge, and code of conduct.",
  },
  {
    day: "Day 3 – 6",
    title: "Hands-on Technique",
    text: "Supervised practical training in real or simulated homes. Surface-by-surface breakdown.",
  },
  {
    day: "Day 7 – 10",
    title: "Client Skills",
    text: "Communication, handling feedback, punctuality, and how to handle difficult situations.",
  },
  {
    day: "Day 11 – 13",
    title: "Specialist Module",
    text: "Deep clean, post-construction, or kitchen sessions based on your chosen track.",
  },
  {
    day: "Day 14",
    title: "Assessment & Certification",
    text: "Practical assessment, written test, and certificate award ceremony.",
  },
];

const FAQS = [
  {
    q: "Is the training free?",
    a: "Yes. All Deusizi Academy training is completely free for accepted applicants. There are no hidden fees or deposits.",
  },
  {
    q: "Do I need prior experience to apply?",
    a: "No experience is needed for beginner tracks. Intermediate and advanced tracks require at least 6 months of relevant experience.",
  },
  {
    q: "Where is training held?",
    a: "Training is held at our Abuja and Lagos centres. Remote learning modules are available for theory components.",
  },
  {
    q: "How long does the programme take?",
    a: "It depends on your track — between 1 and 3 weeks. Most programmes are designed to fit around existing commitments.",
  },
  {
    q: "What happens after I pass?",
    a: "You receive your certificate, your profile is created on Deusizi Sparkle, and you can start accepting bookings immediately.",
  },
  {
    q: "Can I take more than one track?",
    a: "Yes. After completing your first track you can apply for a second specialisation — many of our cleaners hold two or three certifications.",
  },
];

const CITIES = ["Abuja", "Lagos"];

export default function CleanerTraining() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    track: "",
    experience: "",
    motivation: "",
    availability: [],
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const AVAIL_OPTIONS = [
    "Weekday mornings",
    "Weekday afternoons",
    "Weekday evenings",
    "Saturday",
    "Sunday",
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function toggleAvail(opt) {
    setForm((p) => ({
      ...p,
      availability: p.availability.includes(opt)
        ? p.availability.filter((x) => x !== opt)
        : [...p.availability, opt],
    }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your full name";
    if (!form.email.trim()) e.email = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email address";
    if (!form.phone.trim()) e.phone = "Please enter your phone number";
    if (!form.city) e.city = "Please select your city";
    if (!form.track) e.track = "Please select a training track";
    if (!form.motivation.trim())
      e.motivation = "Please tell us why you want to join";
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
    await new Promise((r) => setTimeout(r, 1400));
    setSending(false);
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Deusizi Academy</p>
        <h1 className={styles.heroTitle}>
          Professional cleaning
          <br />
          <em>starts here.</em>
        </h1>
        <p className={styles.heroDesc}>
          Free certified training for aspiring home and commercial cleaners in
          Nigeria. Learn from professionals, earn your certificate, and start
          getting paid — all in two weeks.
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
            Apply for Free
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("tracks")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            View Tracks
          </button>
        </div>
        <div className={styles.heroPills}>
          <span className={styles.pill}>🆓 100% Free</span>
          <span className={styles.pill}>🎓 Certified</span>
          <span className={styles.pill}>💼 Job Placement</span>
          <span className={styles.pill}>📍 Abuja & Lagos</span>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsBar}>
        {[
          ["200+", "Graduates"],
          ["₦0", "Tuition fee"],
          ["14 days", "Avg. programme"],
          ["91%", "Job placement rate"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* ── Outcomes ── */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>What you gain</p>
        <h2 className={styles.sectionTitle}>
          Training that changes your career
        </h2>
        <div className={styles.outcomeGrid}>
          {OUTCOMES.map((o) => (
            <div key={o.title} className={styles.outcomeCard}>
              <div className={styles.outcomeIcon}>{o.icon}</div>
              <p className={styles.outcomeTitle}>{o.title}</p>
              <p className={styles.outcomeText}>{o.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Training Tracks ── */}
      <div className={styles.tracksSection} id="tracks">
        <p className={styles.sectionEyebrow}>Programmes</p>
        <h2 className={styles.sectionTitle}>Choose your training track</h2>
        <p className={styles.sectionSub}>
          All tracks are free. Pick the specialisation that matches your goals —
          or apply and let us recommend one.
        </p>
        <div className={styles.tracksGrid}>
          {TRACKS.map((t) => (
            <div
              key={t.title}
              className={`${styles.trackCard} ${t.popular ? styles.trackCardFeatured : ""}`}
            >
              {t.popular && (
                <div className={styles.trackBadge}>Most popular</div>
              )}
              <div className={styles.trackIconWrap}>
                <span className={styles.trackIcon}>{t.icon}</span>
              </div>
              <p className={styles.trackTitle}>{t.title}</p>
              <div className={styles.trackMeta}>
                <span className={styles.trackMetaItem}>⏱ {t.duration}</span>
                <span className={styles.trackMetaItem}>📊 {t.level}</span>
              </div>
              <p className={styles.trackDesc}>{t.desc}</p>
              <div className={styles.trackTopics}>
                {t.topics.map((tp) => (
                  <span key={tp} className={styles.topicChip}>
                    {tp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Schedule ── */}
      <div className={styles.scheduleSection}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Programme structure
        </p>
        <h2 className={styles.scheduleTitle}>What your two weeks look like</h2>
        <p className={styles.scheduleSub}>
          A structured, practical programme — not just theory. You'll be
          cleaning professionally by day 6.
        </p>
        <div className={styles.scheduleSteps}>
          {SCHEDULE.map((s, i) => (
            <div key={i} className={styles.scheduleStep}>
              <div className={styles.scheduleStepLeft}>
                <div className={styles.scheduleNum}>{i + 1}</div>
                {i < SCHEDULE.length - 1 && (
                  <div className={styles.scheduleLine} />
                )}
              </div>
              <div className={styles.scheduleStepBody}>
                <p className={styles.scheduleDay}>{s.day}</p>
                <p className={styles.scheduleStepTitle}>{s.title}</p>
                <p className={styles.scheduleStepText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Application Form ── */}
      <div className={styles.formSection} id="apply">
        <div className={styles.formInner}>
          <p className={styles.sectionEyebrow}>Apply now</p>
          <h2 className={styles.sectionTitle}>Join Deusizi Academy</h2>
          <p className={styles.formIntro}>
            Applications are reviewed on a rolling basis. Spaces are limited per
            cohort. Fill in the form below — it takes less than 5 minutes.
          </p>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>🎓</div>
              <h3 className={styles.successTitle}>Application submitted!</h3>
              <p className={styles.successText}>
                Thank you, {form.name.split(" ")[0]}. Our admissions team will
                review your application and reach out within 48 hours via email
                or phone.
              </p>
              <p className={styles.successRef}>
                Reference: DSA-{Date.now().toString().slice(-6)}
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
                    track: "",
                    experience: "",
                    motivation: "",
                    availability: [],
                  });
                }}
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Personal details */}
              <div className={styles.formGroup}>
                <p className={styles.groupTitle}>Personal details</p>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Full name <span className={styles.req}>*</span>
                    </label>
                    <input
                      className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Amaka Okoye"
                    />
                    {errors.name && (
                      <p className={styles.errorMsg}>{errors.name}</p>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Phone number <span className={styles.req}>*</span>
                    </label>
                    <input
                      className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="e.g. 0803 055 8774"
                    />
                    {errors.phone && (
                      <p className={styles.errorMsg}>{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      Email address <span className={styles.req}>*</span>
                    </label>
                    <input
                      className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. amaka@email.com"
                    />
                    {errors.email && (
                      <p className={styles.errorMsg}>{errors.email}</p>
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
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className={styles.errorMsg}>{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Training preferences */}
              <div className={styles.formGroup}>
                <p className={styles.groupTitle}>Training preferences</p>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Preferred track <span className={styles.req}>*</span>
                  </label>
                  <select
                    className={`${styles.input} ${styles.select} ${errors.track ? styles.inputError : ""}`}
                    name="track"
                    value={form.track}
                    onChange={handleChange}
                  >
                    <option value="">Select a training track…</option>
                    {TRACKS.map((t) => (
                      <option key={t.title} value={t.title}>
                        {t.title} ({t.duration})
                      </option>
                    ))}
                    <option value="Not sure — recommend one for me">
                      Not sure — recommend one for me
                    </option>
                  </select>
                  {errors.track && (
                    <p className={styles.errorMsg}>{errors.track}</p>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Cleaning experience{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <select
                    className={`${styles.input} ${styles.select}`}
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                  >
                    <option value="">Select an option…</option>
                    <option value="none">No previous experience</option>
                    <option value="under1">Less than 1 year</option>
                    <option value="1-2">1 – 2 years</option>
                    <option value="3-5">3 – 5 years</option>
                    <option value="5+">More than 5 years</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Availability{" "}
                    <span className={styles.optional}>
                      (select all that apply)
                    </span>
                  </label>
                  <div className={styles.availGrid}>
                    {AVAIL_OPTIONS.map((opt) => {
                      const active = form.availability.includes(opt);
                      return (
                        <div
                          key={opt}
                          className={`${styles.availChip} ${active ? styles.availChipActive : ""}`}
                          onClick={() => toggleAvail(opt)}
                        >
                          <div
                            className={`${styles.availCheck} ${active ? styles.availCheckActive : ""}`}
                          >
                            {active && "✓"}
                          </div>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className={styles.formGroup}>
                <p className={styles.groupTitle}>Your motivation</p>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Why do you want to join Deusizi Academy?{" "}
                    <span className={styles.req}>*</span>
                  </label>
                  <textarea
                    className={`${styles.textarea} ${errors.motivation ? styles.inputError : ""}`}
                    name="motivation"
                    value={form.motivation}
                    onChange={handleChange}
                    placeholder="Tell us about your goals, what drew you to professional cleaning, and what you hope to achieve after certification…"
                    rows={5}
                  />
                  {errors.motivation && (
                    <p className={styles.errorMsg}>{errors.motivation}</p>
                  )}
                </div>
              </div>

              <div className={styles.formDisclaimer}>
                <span className={styles.disclaimerIcon}>🔒</span>
                Your information is kept private and used only for admissions
                review. We never share your data with third parties.
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={sending}
              >
                {sending ? (
                  <span className={styles.spinnerRow}>
                    <span className={styles.spinner} /> Submitting application…
                  </span>
                ) : (
                  "Submit My Application"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className={styles.faqSection}>
        <p className={styles.sectionEyebrow}>Common questions</p>
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

      {/* ── CTA ── */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Your cleaning career starts with one application.
        </h2>
        <p className={styles.ctaText}>
          Free training. Real certification. Immediate bookings. Join Deusizi
          Academy today.
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
            Apply for Free
          </button>
          <button className={styles.ctaSecondary}>Contact Admissions</button>
        </div>
      </div>
    </div>
  );
}
