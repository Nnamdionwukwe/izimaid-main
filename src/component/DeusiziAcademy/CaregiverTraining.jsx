// CaregiverTraining.jsx - Updated with backend API integration
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CaregiverTraining.module.css";
import FixedHeader from "../FixedHeader";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PROGRAM_BENEFITS = [
  {
    icon: "🎓",
    title: "Certified Training",
    desc: "Internationally recognized caregiver certification upon completion of your program.",
  },
  {
    icon: "💼",
    title: "Job Guarantee",
    desc: "We connect you with reputable healthcare facilities and private clients after graduation.",
  },
  {
    icon: "❤️",
    title: "Compassion First",
    desc: "Learn person-centered care that prioritizes dignity, respect, and emotional wellbeing.",
  },
  {
    icon: "🌙",
    title: "Flexible Schedules",
    desc: "Evening, weekend, and self-paced options designed for working professionals and parents.",
  },
];

const COURSES = [
  {
    id: "foundation",
    title: "Foundation in Caregiving",
    level: "Beginner",
    duration: "4 weeks",
    hours: "40 hours",
    price: "Free",
    description:
      "Master essential caregiving skills including personal care, mobility assistance, and safety protocols.",
    topics: [
      "Personal Care & Hygiene",
      "Safe Transfer Techniques",
      "Vital Signs Monitoring",
      "Emergency Response",
      "Infection Control",
    ],
    badge: "Most Popular",
  },
  {
    id: "senior",
    title: "Senior Care Specialist",
    level: "Advanced",
    duration: "6 weeks",
    hours: "60 hours",
    price: "Free",
    description:
      "Specialized training for dementia care, palliative support, and age-related condition management.",
    topics: [
      "Dementia & Alzheimer's Care",
      "Palliative Support",
      "Medication Management",
      "Fall Prevention",
      "Nutrition for Seniors",
    ],
    badge: "New",
  },
  {
    id: "pediatric",
    title: "Pediatric Care",
    level: "Advanced",
    duration: "5 weeks",
    hours: "50 hours",
    price: "Free",
    description:
      "Focus on child development, special needs care, and family-centered support strategies.",
    topics: [
      "Child Development",
      "Special Needs Care",
      "Pediatric First Aid",
      "Family Communication",
      "Play Therapy Basics",
    ],
    badge: null,
  },
  {
    id: "mental",
    title: "Mental Health Support",
    level: "Specialist",
    duration: "4 weeks",
    hours: "35 hours",
    price: "Free",
    description:
      "Training in mental health first aid, crisis de-escalation, and therapeutic communication.",
    topics: [
      "Mental Health First Aid",
      "Crisis Intervention",
      "Active Listening",
      "Self-Care Strategies",
      "Boundary Setting",
    ],
    badge: "Limited Seats",
  },
];

const STATS = [
  { value: "1,200+", label: "Active Caregivers" },
  { value: "94%", label: "Employment Rate" },
  { value: "₦150k+", label: "Avg Monthly Starting" },
  { value: "25+", label: "Partner Facilities" },
];

const TESTIMONIALS = [
  {
    name: "Grace Okonkwo",
    role: "Senior Care Specialist",
    text: "The training changed my life. Within two weeks of graduating, I had three job offers. The instructors really care about your success.",
    image: "👩‍⚕️",
  },
  {
    name: "Michael Adebayo",
    role: "Pediatric Caregiver",
    text: "I had no prior experience. The foundation course gave me confidence and real skills. Now I'm working with a wonderful family full-time.",
    image: "👨‍⚕️",
  },
  {
    name: "Fatima Bello",
    role: "Mental Health Support Worker",
    text: "The mental health module was exceptional. The practical scenarios prepared me for real-world situations I face every day.",
    image: "👩‍🎓",
  },
];

const SCHEDULE_OPTIONS = [
  "Weekdays (Mon-Thu 9AM-1PM)",
  "Weekdays (Mon-Thu 6PM-10PM)",
  "Weekends (Sat-Sun 10AM-4PM)",
  "Flexible (Self-paced + Labs)",
];

const CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
  "Abeokuta",
  "Benin City",
];

const FAQS = [
  {
    q: "Do I need prior healthcare experience?",
    a: "No prior experience required for foundation courses. Our Foundation in Caregiving program starts from basics and builds progressively. Advanced courses require completion of foundation level or relevant experience.",
  },
  {
    q: "Is the training really free?",
    a: "Yes! All courses are fully sponsored by our partner healthcare network. There are no application fees, tuition costs, or hidden charges. You only need to commit to completing the program.",
  },
  {
    q: "How does job placement work?",
    a: "We maintain a dedicated placement team that connects graduates with our partner network including hospitals, home care agencies, and private clients. 94% of our graduates receive placement offers within 2 weeks of completion.",
  },
  {
    q: "What certification will I receive?",
    a: "You'll receive a Caregiver Certification recognized by major healthcare employers nationwide. The certification includes practical skills verification and is valid for 2 years, renewable with continuing education.",
  },
  {
    q: "Can I take multiple courses?",
    a: "Absolutely! Many caregivers start with Foundation and then specialize. There's no additional cost for advanced certifications. We encourage continuous learning and skill development.",
  },
  {
    q: "Where are classes held?",
    a: "We use a hybrid model — interactive online sessions combined with hands-on labs at our training centers in Lagos and Abuja. Clinical rotations at partner facilities provide real-world experience.",
  },
];

export default function CaregiverTraining() {
  const navigate = useNavigate();
  const [activeCourse, setActiveCourse] = useState("foundation");
  const [openFaq, setOpenFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    course: "",
    experience: "",
    schedule: "",
    motivation: "",
  });

  const [errors, setErrors] = useState({});

  const currentCourse = COURSES.find((c) => c.id === activeCourse);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.city) newErrors.city = "Please select your city";
    if (!formData.course) newErrors.course = "Please select a course";
    if (!formData.schedule)
      newErrors.schedule = "Please select a schedule preference";
    if (!formData.motivation.trim())
      newErrors.motivation = "Please share your motivation";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSending(true);
    setApiError(null);

    try {
      // Prepare data for API
      const applicationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        course: formData.course,
        experience: formData.experience || "none",
        motivation: formData.motivation,
        schedule: formData.schedule,
      };

      // Make API call to backend
      const response = await axios.post(
        `${API_BASE_URL}/api/caregiver-training/applications`,
        applicationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setSubmittedData(response.data.application);
        setFormSubmitted(true);
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
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setSubmittedData(null);
    setApiError(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      course: "",
      experience: "",
      schedule: "",
      motivation: "",
    });
    setErrors({});
  };

  const scrollToForm = () => {
    document
      .getElementById("application-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Deusizi Academy</p>
          <h1 className={styles.heroTitle}>
            Become a Certified
            <br />
            <em>Professional Caregiver</em>
          </h1>
          <p className={styles.heroDesc}>
            Free comprehensive training program designed to equip you with
            skills, confidence, and certification for a meaningful caregiving
            career.
          </p>
          <div className={styles.heroDivider} />
          <div className={styles.heroButtons}>
            <button className={styles.heroPrimary} onClick={scrollToForm}>
              Apply for Free Training
            </button>
            <button
              className={styles.heroSecondary}
              onClick={() => navigate("/contact")}
            >
              Talk to an Advisor
            </button>
          </div>
        </div>
        <div className={styles.heroStats}>
          {STATS.map((stat, i) => (
            <div key={i} className={styles.heroStat}>
              <span className={styles.heroStatValue}>{stat.value}</span>
              <span className={styles.heroStatLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className={styles.benefits}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Why choose us</p>
          <h2 className={styles.sectionTitle}>
            Training that transforms lives
          </h2>
          <div className={styles.benefitsGrid}>
            {PROGRAM_BENEFITS.map((benefit, i) => (
              <div key={i} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitDesc}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className={styles.courses} id="courses">
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Training programs</p>
          <h2 className={styles.sectionTitle}>Choose your caregiving path</h2>

          {/* Course Tabs */}
          <div className={styles.courseTabs}>
            {COURSES.map((course) => (
              <button
                key={course.id}
                className={`${styles.courseTab} ${activeCourse === course.id ? styles.courseTabActive : ""}`}
                onClick={() => setActiveCourse(course.id)}
              >
                <span className={styles.courseTabIcon}>
                  {course.id === "foundation" && "📘"}
                  {course.id === "senior" && "👴"}
                  {course.id === "pediatric" && "👶"}
                  {course.id === "mental" && "🧠"}
                </span>
                <span>{course.title}</span>
              </button>
            ))}
          </div>

          {/* Active Course Card */}
          <div className={styles.courseCard}>
            {currentCourse.badge && (
              <div className={styles.courseBadge}>{currentCourse.badge}</div>
            )}
            <div className={styles.courseHeader}>
              <div className={styles.courseLevel}>{currentCourse.level}</div>
              <div className={styles.courseMeta}>
                <span>⏱ {currentCourse.duration}</span>
                <span>📚 {currentCourse.hours}</span>
                <span className={styles.coursePrice}>
                  {currentCourse.price}
                </span>
              </div>
            </div>
            <h3 className={styles.courseTitle}>{currentCourse.title}</h3>
            <p className={styles.courseDesc}>{currentCourse.description}</p>
            <div className={styles.courseTopics}>
              {currentCourse.topics.map((topic, i) => (
                <span key={i} className={styles.topicTag}>
                  {topic}
                </span>
              ))}
            </div>
            <button className={styles.courseApplyBtn} onClick={scrollToForm}>
              Apply for This Course →
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className={styles.testimonials}>
        <div className={styles.container}>
          <p
            className={styles.sectionEyebrow}
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Success stories
          </p>
          <h2 className={styles.testimonialsTitle}>What our graduates say</h2>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialImage}>{t.image}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <p className={styles.testimonialName}>{t.name}</p>
                <p className={styles.testimonialRole}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className={styles.formSection} id="application-form">
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <p className={styles.sectionEyebrow}>Start your journey</p>
            <h2 className={styles.sectionTitle}>
              Apply for Caregiver Training
            </h2>
            <p className={styles.formIntro}>
              Complete this short application. Our admissions team will review
              and contact you within 48 hours. All fields marked with * are
              required.
            </p>

            {formSubmitted ? (
              <div className={styles.successCard} id="success-message">
                <div className={styles.successIcon}>🎉</div>
                <h3 className={styles.successTitle}>Application Received!</h3>
                <p className={styles.successText}>
                  Thank you, {formData.fullName.split(" ")[0]}! We're excited to
                  have you join our caregiving community.
                </p>
                <div className={styles.successDetails}>
                  {submittedData && (
                    <p>
                      <strong>Reference ID:</strong>{" "}
                      {submittedData.referenceNumber}
                    </p>
                  )}
                  <p>
                    <strong>Next Steps:</strong> Our team will contact you
                    within 2 business days to schedule an interview and discuss
                    your training pathway.
                  </p>
                </div>
                <button className={styles.resetButton} onClick={resetForm}>
                  Submit Another Application
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

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g., Adebayo Olamide"
                      className={`${styles.input} ${errors.fullName ? styles.inputError : ""}`}
                    />
                    {errors.fullName && (
                      <span className={styles.errorMsg}>{errors.fullName}</span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="olamide@example.com"
                      className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    />
                    {errors.email && (
                      <span className={styles.errorMsg}>{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 80X XXX XXXX"
                      className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                    />
                    {errors.phone && (
                      <span className={styles.errorMsg}>{errors.phone}</span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>City *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`${styles.select} ${errors.city ? styles.inputError : ""}`}
                    >
                      <option value="">Select your city</option>
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <span className={styles.errorMsg}>{errors.city}</span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Preferred Course *</label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className={`${styles.select} ${errors.course ? styles.inputError : ""}`}
                    >
                      <option value="">Select a training program</option>
                      {COURSES.map((course) => (
                        <option key={course.id} value={course.title}>
                          {course.title} — {course.duration}
                        </option>
                      ))}
                    </select>
                    {errors.course && (
                      <span className={styles.errorMsg}>{errors.course}</span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Previous Caregiving Experience
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="">Select experience level</option>
                      <option value="none">
                        No experience (starting fresh)
                      </option>
                      <option value="family">
                        Family caregiving experience
                      </option>
                      <option value="volunteer">
                        Volunteer or informal experience
                      </option>
                      <option value="professional">
                        1-2 years professional
                      </option>
                      <option value="experienced">3+ years professional</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Schedule Preference *</label>
                  <div className={styles.scheduleOptions}>
                    {SCHEDULE_OPTIONS.map((option) => (
                      <label key={option} className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="schedule"
                          value={option}
                          checked={formData.schedule === option}
                          onChange={handleChange}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.schedule && (
                    <span className={styles.errorMsg}>{errors.schedule}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Why do you want to become a caregiver? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    placeholder="Share your passion for caregiving, what draws you to this profession, and your career aspirations..."
                    rows={4}
                    className={`${styles.textarea} ${errors.motivation ? styles.inputError : ""}`}
                  />
                  {errors.motivation && (
                    <span className={styles.errorMsg}>{errors.motivation}</span>
                  )}
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
                      <span className={styles.spinner} /> Submitting
                      Application...
                    </span>
                  ) : (
                    "Submit Application →"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faq}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Common questions</p>
          <h2 className={styles.sectionTitle}>Everything you need to know</h2>
          <div className={styles.faqGrid}>
            {FAQS.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`${styles.faqIcon} ${openFaq === i ? styles.faqIconOpen : ""}`}
                  >
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to start your caregiving journey?
            </h2>
            <p className={styles.ctaDesc}>
              Join hundreds of caregivers who have transformed their lives
              through our training.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.ctaPrimary} onClick={scrollToForm}>
                Apply for Free Training
              </button>
              <button
                className={styles.ctaSecondary}
                onClick={() => navigate("/contact")}
              >
                Contact Admissions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}
