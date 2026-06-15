// HousekeeperTraining.jsx
import { useState } from "react";
import styles from "./HousekeeperTraining.module.css";
import FixedHeader from "../FixedHeader";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─── SVG icon set (no emoji) ─────────────────────────────────────────── */
const Icons = {
  Home: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  Star: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Shirt: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
    </svg>
  ),
  Box: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  ),
  Chef: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 13.87A4 4 0 017.41 6a5.11 5.11 0 0115.1 4.61 5.11 5.11 0 01-5.83 5.83A4 4 0 006 13.87z" />
      <line x1="6" y1="14" x2="18" y2="14" />
      <rect x="8" y="14" width="8" height="7" rx="1" />
    </svg>
  ),
  Shield: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Award: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  Briefcase: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
  TrendUp: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Phone: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  Lock: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  Check: () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  GradCap: () => (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Clock: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  BarChart: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
};

/* ─── Data ────────────────────────────────────────────────────────────── */
const TRACKS = [
  {
    Icon: Icons.Home,
    title: "Household Management",
    duration: "2 weeks",
    level: "Beginner",
    desc: "Full-scope residential housekeeping — daily routines, household organisation, priority scheduling, and property care.",
    topics: [
      "Daily routines",
      "Property care",
      "Time management",
      "Client communication",
    ],
    popular: true,
  },
  {
    Icon: Icons.Shirt,
    title: "Laundry & Linen Care",
    duration: "1 week",
    level: "Beginner",
    desc: "Fabric identification, stain removal, ironing techniques, and wardrobe organisation for high-standard households.",
    topics: [
      "Fabric care",
      "Stain removal",
      "Ironing & pressing",
      "Wardrobe systems",
    ],
    popular: false,
  },
  {
    Icon: Icons.Box,
    title: "Home Organisation",
    duration: "1 week",
    level: "Beginner – Intermediate",
    desc: "Professional-grade decluttering, storage systems, and room-by-room organisation principles for modern homes.",
    topics: [
      "Decluttering method",
      "Storage systems",
      "Room planning",
      "Client goals",
    ],
    popular: false,
  },
  {
    Icon: Icons.Chef,
    title: "Meal Prep & Kitchen Support",
    duration: "2 weeks",
    level: "Beginner – Intermediate",
    desc: "Food safety, pantry management, light meal preparation, and kitchen upkeep for family and executive households.",
    topics: [
      "Food safety",
      "Pantry systems",
      "Light cooking",
      "Allergy awareness",
    ],
    popular: false,
  },
  {
    Icon: Icons.Star,
    title: "Luxury & Estate Housekeeping",
    duration: "3 weeks",
    level: "Intermediate – Advanced",
    desc: "White-glove service standards for high-net-worth households. Includes fine surfaces, art care, and staff coordination.",
    topics: [
      "White-glove service",
      "Fine surface care",
      "Discretion protocols",
      "Staff liaison",
    ],
    popular: false,
  },
  {
    Icon: Icons.Shield,
    title: "Childcare-Safe Housekeeping",
    duration: "1 week",
    level: "Beginner",
    desc: "Non-toxic product selection, allergen management, toy and nursery hygiene for homes with young children or elderly relatives.",
    topics: [
      "Non-toxic products",
      "Nursery hygiene",
      "Allergen control",
      "Safe storage",
    ],
    popular: false,
  },
];

const OUTCOMES = [
  {
    Icon: Icons.Award,
    title: "Certified by Deusizi",
    text: "Receive a Deusizi Academy certificate recognised by premium households and top staffing agencies across Nigeria.",
  },
  {
    Icon: Icons.Briefcase,
    title: "Immediate placement",
    text: "Graduates are matched to households on the Deusizi Sparkle platform — often before their cohort ends.",
  },
  {
    Icon: Icons.TrendUp,
    title: "Higher earning power",
    text: "Certified housekeepers earn up to 45% more per engagement than uncertified applicants on our platform.",
  },
  {
    Icon: Icons.Phone,
    title: "Your own dashboard",
    text: "Set availability, review household briefs, and manage all your bookings from the Deusizi Sparkle app.",
  },
];

const SCHEDULE = [
  {
    day: "Day 1 – 2",
    title: "Orientation & Standards",
    text: "Platform introduction, professional conduct, household safety, and the Deusizi housekeeping code.",
  },
  {
    day: "Day 3 – 6",
    title: "Core Skills Practice",
    text: "Supervised hands-on training in real or simulated homes — room care, laundry, and organisation.",
  },
  {
    day: "Day 7 – 9",
    title: "Client Excellence",
    text: "Communication, discretion, managing household instructions, and handling complex or sensitive requests.",
  },
  {
    day: "Day 10 – 13",
    title: "Specialist Track",
    text: "Your chosen specialisation — luxury service, meal prep, childcare-safe methods, or estate management.",
  },
  {
    day: "Day 14",
    title: "Assessment & Graduation",
    text: "Practical and written assessment followed by your certificate award and Sparkle profile activation.",
  },
];

const FAQS = [
  {
    q: "Is the training completely free?",
    a: "Yes. Deusizi Academy training costs nothing. There are no registration fees, deposits, or material charges.",
  },
  {
    q: "Do I need housekeeping experience?",
    a: "Beginner tracks welcome zero-experience applicants. Intermediate and advanced tracks ask for at least 6 months of relevant background.",
  },
  {
    q: "Where are the training centres?",
    a: "We run in-person sessions in Abuja and Lagos. Theory modules are also available as guided remote learning.",
  },
  {
    q: "Can I train while working another job?",
    a: "Yes. Most tracks are designed for working adults. We offer morning, afternoon, and weekend cohorts.",
  },
  {
    q: "What happens the day I pass?",
    a: "Your Deusizi Sparkle profile goes live, your certificate is issued, and our placement team begins matching you to households.",
  },
  {
    q: "Can I hold more than one certification?",
    a: "Absolutely. Many of our graduates complete two or three tracks and list each on their Sparkle profile.",
  },
];

const CITIES = ["Abuja", "Lagos"];

const AVAIL_OPTIONS = [
  "Weekday mornings",
  "Weekday afternoons",
  "Weekday evenings",
  "Saturday",
  "Sunday",
];

/* ─── Component ───────────────────────────────────────────────────────── */
export default function HousekeeperTraining() {
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
  const [apiError, setApiError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (apiError) setApiError(null);
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
    setApiError(null);

    try {
      // Prepare data for API
      const applicationData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        track: form.track,
        experience: form.experience || "none",
        motivation: form.motivation,
        availability: form.availability,
      };

      // Make API call to backend
      const response = await axios.post(
        `${API_BASE_URL}/api/housekeeper-training/applications`,
        applicationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setSubmittedData(response.data.application);
        setSubmitted(true);
        // Scroll to success message
        document
          .getElementById("success-message")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        throw new Error(response.data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Application submission error:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error
        const serverError = error.response.data;
        if (
          serverError.error ===
          "An application from this email was submitted recently"
        ) {
          setApiError(
            `You've already submitted an application recently. Reference: ${serverError.existingReference || "Check your email"}`,
          );
        } else {
          setApiError(
            serverError.error ||
              "Failed to submit application. Please try again.",
          );
        }
      } else if (error.request) {
        // Request was made but no response
        setApiError(
          "Network error. Please check your connection and try again.",
        );
      } else {
        // Something else happened
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSending(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setSubmittedData(null);
    setApiError(null);
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
    setErrors({});
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Deusizi Academy</p>
        <h1 className={styles.heroTitle}>
          Elite housekeeping
          <br />
          <em>trained, certified, placed.</em>
        </h1>
        <p className={styles.heroDesc}>
          Free professional training for aspiring housekeepers across Nigeria.
          Master household management, earn your certificate, and start working
          with premium households — in as little as two weeks.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => scrollTo("apply")}
          >
            Apply for Free
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() => scrollTo("tracks")}
          >
            View Tracks
          </button>
        </div>
        <div className={styles.heroPills}>
          <span className={styles.pill}>100% Free</span>
          <span className={styles.pill}>Certified</span>
          <span className={styles.pill}>Job Placement</span>
          <span className={styles.pill}>Abuja &amp; Lagos</span>
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        {[
          ["300+", "Graduates"],
          ["N0", "Tuition fee"],
          ["14 days", "Avg. programme"],
          ["93%", "Placement rate"],
        ].map(([n, l]) => (
          <div key={l} className={styles.statItem}>
            <p className={styles.statNum}>{n}</p>
            <p className={styles.statLabel}>{l}</p>
          </div>
        ))}
      </div>

      {/* ── Outcomes ──────────────────────────────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>What you gain</p>
        <h2 className={styles.sectionTitle}>
          Training that elevates your career
        </h2>
        <div className={styles.outcomeGrid}>
          {OUTCOMES.map((o) => (
            <div key={o.title} className={styles.outcomeCard}>
              <div className={styles.outcomeIcon}>
                <o.Icon />
              </div>
              <p className={styles.outcomeTitle}>{o.title}</p>
              <p className={styles.outcomeText}>{o.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tracks ────────────────────────────────────────────────────── */}
      <div className={styles.tracksSection} id="tracks">
        <p className={styles.sectionEyebrow}>Programmes</p>
        <h2 className={styles.sectionTitle}>Choose your training track</h2>
        <p className={styles.sectionSub}>
          All tracks are free. Pick the specialisation that fits your goals — or
          apply and let us recommend the right one.
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
                <span className={styles.trackIcon}>
                  <t.Icon />
                </span>
              </div>
              <p className={styles.trackTitle}>{t.title}</p>
              <div className={styles.trackMeta}>
                <span className={styles.trackMetaItem}>
                  <Icons.Clock /> {t.duration}
                </span>
                <span className={styles.trackMetaItem}>
                  <Icons.BarChart /> {t.level}
                </span>
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

      {/* ── Schedule ──────────────────────────────────────────────────── */}
      <div className={styles.scheduleSection}>
        <p className={styles.scheduleEyebrow}>Programme structure</p>
        <h2 className={styles.scheduleTitle}>Your two weeks, step by step</h2>
        <p className={styles.scheduleSub}>
          A practical, structured programme. By day 6 you will be working inside
          a real household with full confidence.
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

      {/* ── Application Form ──────────────────────────────────────────── */}
      <div className={styles.formSection} id="apply">
        <div className={styles.formInner}>
          <p className={styles.sectionEyebrow}>Apply now</p>
          <h2 className={styles.sectionTitle}>Join Deusizi Academy</h2>
          <p className={styles.formIntro}>
            Applications are reviewed on a rolling basis. Spaces are limited per
            cohort. The form takes under 5 minutes to complete.
          </p>

          {submitted ? (
            <div className={styles.successBox} id="success-message">
              <div className={styles.successIcon}>
                <Icons.GradCap />
              </div>
              <h3 className={styles.successTitle}>Application submitted!</h3>
              <p className={styles.successText}>
                Thank you, {form.name.split(" ")[0]}. Our admissions team will
                review your application and contact you within 48 hours by email
                or phone.
              </p>
              {submittedData && (
                <p className={styles.successRef}>
                  Reference: {submittedData.referenceNumber}
                </p>
              )}
              <button className={styles.heroPrimary} onClick={resetForm}>
                Submit another application
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* API Error Display */}
              {apiError && (
                <div className={styles.apiErrorBox}>
                  <span className={styles.apiErrorIcon}>⚠️</span>
                  <p className={styles.apiErrorMessage}>{apiError}</p>
                </div>
              )}

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
                      placeholder="e.g. Ngozi Adeyemi"
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
                      placeholder="e.g. ngozi@email.com"
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
                      <option value="">Select your city...</option>
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
                    <option value="">Select a training track...</option>
                    {TRACKS.map((t) => (
                      <option key={t.title} value={t.title}>
                        {t.title} ({t.duration})
                      </option>
                    ))}
                    <option value="Not sure - recommend one for me">
                      Not sure - recommend one for me
                    </option>
                  </select>
                  {errors.track && (
                    <p className={styles.errorMsg}>{errors.track}</p>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Housekeeping experience{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <select
                    className={`${styles.input} ${styles.select}`}
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                  >
                    <option value="">Select an option...</option>
                    <option value="none">No previous experience</option>
                    <option value="under1">Less than 1 year</option>
                    <option value="1-2">1 - 2 years</option>
                    <option value="3-5">3 - 5 years</option>
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
                            {active && <Icons.Check />}
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
                    placeholder="Tell us about your goals, what drew you to professional housekeeping, and what you hope to achieve after certification..."
                    rows={5}
                  />
                  {errors.motivation && (
                    <p className={styles.errorMsg}>{errors.motivation}</p>
                  )}
                </div>
              </div>

              <div className={styles.formDisclaimer}>
                <span className={styles.disclaimerIcon}>
                  <Icons.Lock />
                </span>
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
                    <span className={styles.spinner} /> Submitting
                    application...
                  </span>
                ) : (
                  "Submit My Application"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
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
                  <Icons.ChevronDown />
                </span>
              </button>
              {openFaq === i && <p className={styles.faqAnswer}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Your housekeeping career starts with one application.
        </h2>
        <p className={styles.ctaText}>
          Free training. Real certification. Premium placements. Join Deusizi
          Academy today.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => scrollTo("apply")}
          >
            Apply for Free
          </button>
          <button className={styles.ctaSecondary}>Contact Admissions</button>
        </div>
      </div>
    </div>
  );
}
