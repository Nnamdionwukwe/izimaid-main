// DomesticStaffCertification.jsx
import { useState, useEffect } from "react";
import styles from "./DomesticStaffCertification.module.css";
import FixedHeader from "../FixedHeader";

const CERTIFICATION_PROGRAMS = [
  {
    id: "household-management",
    icon: "🏠",
    title: "Household Management",
    level: "Professional",
    duration: "6 weeks",
    hours: "60 hours",
    price: "Free",
    description:
      "Comprehensive training in managing modern households efficiently. Learn to coordinate schedules, manage inventories, and oversee household operations like a true professional.",
    longDescription:
      "This program transforms you into a household management expert. You'll master everything from creating efficient cleaning schedules to managing household budgets, supervising other staff, and maintaining household records. Graduates are prepared for senior domestic positions in executive households.",
    topics: [
      "Household budgeting & inventory",
      "Schedule coordination",
      "Staff supervision basics",
      "Record keeping systems",
      "Event preparation",
      "Vendor management",
    ],
    learningOutcomes: [
      "Create and manage household budgets",
      "Coordinate multiple staff schedules",
      "Implement inventory tracking systems",
      "Plan and execute household events",
      "Manage vendor relationships professionally",
    ],
    careerPaths: [
      "Household Manager",
      "Estate Manager",
      "Executive Housekeeper",
    ],
    badge: "Most Popular",
    color: "#c9a84c",
  },
  {
    id: "cooking-culinary",
    icon: "🍳",
    title: "Professional Cooking & Culinary",
    level: "Professional",
    duration: "8 weeks",
    hours: "80 hours",
    price: "Free",
    description:
      "Master the art of professional home cooking. Learn Nigerian and international cuisines, dietary specializations, and kitchen management skills.",
    longDescription:
      "Become a culinary expert capable of preparing anything from daily family meals to elaborate dinner parties. This program covers Nigerian classics, continental dishes, baking, meal planning, dietary restrictions, and professional kitchen hygiene standards.",
    topics: [
      "Nigerian & continental cuisine",
      "Meal planning & prep",
      "Dietary specializations",
      "Kitchen hygiene & safety",
      "Food presentation",
      "Pantry management",
    ],
    learningOutcomes: [
      "Prepare 50+ professional dishes",
      "Plan weekly menus for families",
      "Accommodate dietary restrictions",
      "Present food like a professional",
      "Manage kitchen inventory efficiently",
    ],
    careerPaths: ["Private Chef", "Family Cook", "Catering Assistant"],
    badge: "New",
    color: "#c9a84c",
  },
  {
    id: "childcare",
    icon: "👶",
    title: "Professional Childcare",
    level: "Specialist",
    duration: "5 weeks",
    hours: "50 hours",
    price: "Free",
    description:
      "Advanced training in child development, safety, education, and nurturing care for children of all ages.",
    longDescription:
      "This comprehensive program prepares you to be a trusted childcare professional. You'll learn about child development stages, age-appropriate activities, first aid, positive discipline techniques, and how to create safe, stimulating environments for children to thrive.",
    topics: [
      "Child development stages",
      "Age-appropriate activities",
      "Child safety & first aid",
      "Positive discipline",
      "Educational play",
      "Nutrition for children",
    ],
    learningOutcomes: [
      "Understand developmental milestones",
      "Create educational activity plans",
      "Respond to childhood emergencies",
      "Implement positive guidance techniques",
      "Prepare healthy children's meals",
    ],
    careerPaths: ["Nanny", "Childcare Specialist", "Au Pair"],
    badge: null,
    color: "#c9a84c",
  },
  {
    id: "elderly-care",
    icon: "👴",
    title: "Elderly Companion Care",
    level: "Specialist",
    duration: "4 weeks",
    hours: "40 hours",
    price: "Free",
    description:
      "Specialized training in senior care, companionship, mobility assistance, and creating comfortable environments for elderly individuals.",
    longDescription:
      "Learn to provide compassionate, dignified care for elderly individuals. This program covers understanding age-related conditions, assisting with daily activities, medication reminders, fall prevention, and creating engaging activities that promote mental and emotional wellbeing.",
    topics: [
      "Age-related conditions",
      "Mobility assistance",
      "Medication reminders",
      "Fall prevention",
      "Memory care activities",
      "Companionship skills",
    ],
    learningOutcomes: [
      "Assist with daily living activities",
      "Recognize signs of common conditions",
      "Implement fall prevention strategies",
      "Engage seniors in meaningful activities",
      "Provide emotional support professionally",
    ],
    careerPaths: [
      "Elderly Companion",
      "Senior Care Assistant",
      "In-Home Caregiver",
    ],
    badge: "Limited",
    color: "#c9a84c",
  },
  {
    id: "laundry-textile",
    icon: "👕",
    title: "Laundry & Textile Care",
    level: "Professional",
    duration: "3 weeks",
    hours: "30 hours",
    price: "Free",
    description:
      "Expert training in fabric care, stain removal, garment maintenance, and professional laundry operations for high-end households.",
    longDescription:
      "Become a textile care specialist capable of handling delicate fabrics, luxury garments, and household linens. This program covers fabric identification, stain removal techniques, proper washing and drying methods, ironing, folding, and basic clothing repairs.",
    topics: [
      "Fabric identification",
      "Stain removal techniques",
      "Washing & drying methods",
      "Ironing & folding",
      "Garment storage",
      "Basic clothing repairs",
    ],
    learningOutcomes: [
      "Identify and care for all fabric types",
      "Remove 20+ common stains",
      "Properly iron formal wear",
      "Implement clothing rotation systems",
      "Perform basic mending repairs",
    ],
    careerPaths: [
      "Laundry Specialist",
      "Textile Care Professional",
      "Household Laundress",
    ],
    badge: null,
    color: "#c9a84c",
  },
  {
    id: "hospitality-service",
    icon: "🍽️",
    title: "Hospitality & Service",
    level: "Professional",
    duration: "4 weeks",
    hours: "40 hours",
    price: "Free",
    description:
      "Master the art of professional service including formal dining, event hosting, guest relations, and household etiquette.",
    longDescription:
      "Learn to provide five-star service in private households. This program covers formal table setting, serving etiquette, guest reception, communication skills, handling special requests, and maintaining professional composure in all situations.",
    topics: [
      "Formal table setting",
      "Serving etiquette",
      "Guest reception",
      "Communication skills",
      "Handling special requests",
      "Professional composure",
    ],
    learningOutcomes: [
      "Set formal and informal tables",
      "Serve meals professionally",
      "Welcome guests with confidence",
      "Handle difficult situations gracefully",
      "Maintain professional appearance",
    ],
    careerPaths: ["Butler", "Service Staff", "Event Assistant"],
    badge: "New",
    color: "#c9a84c",
  },
];

const WHY_CHOOSE_US = [
  {
    icon: "🎓",
    title: "Industry-Recognized Certification",
    desc: "Receive a Deusizi Academy certificate valued by top households, agencies, and employers across Nigeria.",
  },
  {
    icon: "💼",
    title: "100% Job Placement Support",
    desc: "We connect certified graduates with our network of premium households, agencies, and corporate clients.",
  },
  {
    icon: "💰",
    title: "Higher Earning Potential",
    desc: "Certified domestic staff earn 50-70% more than non-certified counterparts in similar positions.",
  },
  {
    icon: "⭐",
    title: "Practical Hands-on Training",
    desc: "Learn through real-world scenarios, supervised practice, and simulated household environments.",
  },
  {
    icon: "🔄",
    title: "Lifetime Updates & Refreshers",
    desc: "Free access to course updates, new techniques, and refresher sessions after certification.",
  },
  {
    icon: "📱",
    title: "Digital Profile & Badging",
    desc: "Get a verified digital profile on the Deusizi platform that showcases your skills and certification.",
  },
];

const STATS = [
  { value: "2,500+", label: "Certified Graduates" },
  { value: "96%", label: "Employment Rate" },
  { value: "₦250k+", label: "Average Monthly Earnings" },
  { value: "150+", label: "Partner Households" },
  { value: "4.9", label: "Graduate Satisfaction" },
  { value: "6", label: "Specializations" },
];

const TESTIMONIALS = [
  {
    name: "Ngozi Eze",
    role: "Household Manager",
    text: "The Household Management program changed everything. Within two weeks of certification, I was placed with a family paying triple my previous salary. The training was practical and thorough.",
    image: "👩‍💼",
    rating: 5,
  },
  {
    name: "Emeka Okafor",
    role: "Private Chef",
    text: "I've been cooking for years but the culinary program refined my skills completely. Learning proper presentation, meal planning, and kitchen management made me a true professional.",
    image: "👨‍🍳",
    rating: 5,
  },
  {
    name: "Fatima Bello",
    role: "Childcare Specialist",
    text: "The childcare certification gave me confidence and knowledge I never had. Understanding child development and safety protocols helped me secure a wonderful position.",
    image: "👩‍👧",
    rating: 5,
  },
];

const SCHEDULE_OPTIONS = [
  { value: "full-time-day", label: "Full-time (Mon-Thu 9AM-3PM) - 4 weeks" },
  {
    value: "part-time-evening",
    label: "Part-time (Mon-Wed 6PM-9PM) - 8 weeks",
  },
  { value: "weekend", label: "Weekend (Sat-Sun 10AM-4PM) - 8 weeks" },
  {
    value: "flexible",
    label: "Flexible (Self-paced with labs) - Up to 12 weeks",
  },
];

const CITIES = [
  "Lagos (Ikoyi, VI, Lekki)",
  "Lagos (Ikeja, GRA)",
  "Lagos (Surulere, Yaba)",
  "Abuja (Maitama, Asokoro)",
  "Abuja (Wuse, Garki)",
  "Port Harcourt (GRA)",
  "Ibadan (Jericho, Bodija)",
  "Kano (Nassarawa GRA)",
  "Enugu (Independence Layout)",
];

const LEARNING_FORMATS = [
  "In-person hands-on labs",
  "Live online sessions",
  "Self-paced video modules",
  "Practical assessments",
  "Real household simulations",
  "One-on-one mentoring",
];

const FAQS = [
  {
    q: "What is the eligibility for certification?",
    a: "Anyone 18 years or older with a passion for domestic service can apply. No prior formal experience is required for basic certifications. Advanced specializations may recommend foundational knowledge.",
  },
  {
    q: "How long does certification take?",
    a: "Program duration ranges from 3 to 8 weeks depending on the specialization. Full-time options are accelerated (3-5 weeks), while part-time and weekend options take 6-8 weeks.",
  },
  {
    q: "Is the training completely free?",
    a: "Yes! All Deusizi Academy certification programs are 100% free. We're sponsored by our partner network of households and agencies who are committed to raising professional standards in domestic service.",
  },
  {
    q: "What certification will I receive?",
    a: "You'll receive a Deusizi Academy Professional Certification in your chosen specialization. The certificate includes a QR code for employers to verify your credentials and view your skills profile.",
  },
  {
    q: "How does job placement work?",
    a: "Our placement team actively matches certified graduates with our partner network of premium households, agencies, and corporate clients. We maintain a 96% placement rate within 4 weeks of certification.",
  },
  {
    q: "Can I take multiple certifications?",
    a: "Absolutely! Many of our graduates hold 2-3 specializations. We recommend completing one certification first, gaining experience, then returning for additional specializations.",
  },
  {
    q: "Is there ongoing support after certification?",
    a: "Yes, you'll have lifetime access to our alumni network, refresher sessions, and continuing education opportunities. We also provide job placement support for the duration of your career.",
  },
  {
    q: "What's the difference between programs?",
    a: "Each specialization focuses on specific skills for particular roles. Household Management is broadest (coordinator role). Others like Cooking, Childcare, and Laundry are specialized for specific positions.",
  },
];

export default function DomesticStaffCertification() {
  const [activeProgram, setActiveProgram] = useState("household-management");
  const [openFaq, setOpenFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showReferralCode, setShowReferralCode] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: "",
    email: "",
    phone: "",
    city: "",
    // Step 2: Background
    experience: "",
    education: "",
    previousTraining: "",
    // Step 3: Program
    programChoice: "",
    schedulePreference: "",
    startMonth: "",
    // Step 4: Additional
    motivation: "",
    referralCode: "",
    hearAbout: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState({});

  const currentProgram = CERTIFICATION_PROGRAMS.find(
    (p) => p.id === activeProgram,
  );
  const totalSteps = 4;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.city) newErrors.city = "Please select your city";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.experience)
      newErrors.experience = "Please select experience level";
    if (!formData.education)
      newErrors.education = "Please select education level";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.programChoice)
      newErrors.programChoice = "Please select a certification program";
    if (!formData.schedulePreference)
      newErrors.schedulePreference = "Please select schedule preference";
    if (!formData.startMonth)
      newErrors.startMonth = "Please select start month";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.motivation.trim())
      newErrors.motivation = "Please share your motivation";
    if (!formData.emergencyContact.trim())
      newErrors.emergencyContact = "Emergency contact name required";
    if (!formData.emergencyPhone.trim())
      newErrors.emergencyPhone = "Emergency phone required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();

    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep4()) return;

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSending(false);
    setFormSubmitted(true);
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setCurrentStep(1);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      experience: "",
      education: "",
      previousTraining: "",
      programChoice: "",
      schedulePreference: "",
      startMonth: "",
      motivation: "",
      referralCode: "",
      hearAbout: "",
      emergencyContact: "",
      emergencyPhone: "",
    });
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
            Professional Certification
            <br />
            <em>For Domestic Staff</em>
          </h1>
          <p className={styles.heroDesc}>
            Become a certified professional in household management, culinary
            arts, childcare, elderly care, laundry services, or hospitality.
            Free training with guaranteed job placement.
          </p>
          <div className={styles.heroDivider} />
          <div className={styles.heroButtons}>
            <button className={styles.heroPrimary} onClick={scrollToForm}>
              Apply for Free Certification →
            </button>
            <button
              className={styles.heroSecondary}
              onClick={() => setShowReferralCode(!showReferralCode)}
            >
              Refer a Friend
            </button>
          </div>
          {showReferralCode && (
            <div className={styles.referralBox}>
              <p>
                Share this code with friends:{" "}
                <strong>DEUSIZI-DOMESTIC-2026</strong>
              </p>
              <p className={styles.referralText}>
                They get priority review, you get ₦20,000 referral bonus!
              </p>
            </div>
          )}
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

      {/* Why Choose Us Section */}
      <div className={styles.whyUs}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Why Choose Deusizi Academy</p>
          <h2 className={styles.sectionTitle}>
            Elevate Your Career in Domestic Service
          </h2>
          <div className={styles.whyUsGrid}>
            {WHY_CHOOSE_US.map((item, i) => (
              <div key={i} className={styles.whyUsCard}>
                <div className={styles.whyUsIcon}>{item.icon}</div>
                <h3 className={styles.whyUsTitle}>{item.title}</h3>
                <p className={styles.whyUsDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certification Programs Section */}
      <div className={styles.programs} id="programs">
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Certification Programs</p>
          <h2 className={styles.sectionTitle}>Choose Your Specialization</h2>
          <p className={styles.sectionSub}>
            Each program includes comprehensive training, practical assessments,
            and professional certification. All programs are 100% free.
          </p>

          {/* Program Tabs */}
          <div className={styles.programTabs}>
            {CERTIFICATION_PROGRAMS.map((program) => (
              <button
                key={program.id}
                className={`${styles.programTab} ${activeProgram === program.id ? styles.programTabActive : ""}`}
                onClick={() => setActiveProgram(program.id)}
              >
                <span className={styles.programTabIcon}>{program.icon}</span>
                <span className={styles.programTabTitle}>{program.title}</span>
              </button>
            ))}
          </div>

          {/* Active Program Card */}
          <div className={styles.programCard}>
            {currentProgram.badge && (
              <div
                className={styles.programBadge}
                style={{ background: currentProgram.color }}
              >
                {currentProgram.badge}
              </div>
            )}

            <div className={styles.programHeader}>
              <div className={styles.programLevel}>{currentProgram.level}</div>
              <div className={styles.programDuration}>
                <span>⏱ {currentProgram.duration}</span>
                <span>📚 {currentProgram.hours}</span>
                <span className={styles.programPrice}>
                  {currentProgram.price}
                </span>
              </div>
            </div>

            <h3 className={styles.programTitle}>{currentProgram.title}</h3>
            <p className={styles.programDesc}>{currentProgram.description}</p>
            <p className={styles.programLongDesc}>
              {currentProgram.longDescription}
            </p>

            <div className={styles.programSections}>
              <div className={styles.programSection}>
                <h4>📖 What You'll Learn</h4>
                <div className={styles.topicsGrid}>
                  {currentProgram.topics.map((topic, i) => (
                    <span key={i} className={styles.topicTag}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.programSection}>
                <h4>🎯 Learning Outcomes</h4>
                <ul className={styles.outcomesList}>
                  {currentProgram.learningOutcomes.map((outcome, i) => (
                    <li key={i}>{outcome}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.programSection}>
                <h4>💼 Career Paths</h4>
                <div className={styles.careerPaths}>
                  {currentProgram.careerPaths.map((path, i) => (
                    <span key={i} className={styles.careerPath}>
                      {path}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button className={styles.programApplyBtn} onClick={scrollToForm}>
              Apply for {currentProgram.title} →
            </button>
          </div>
        </div>
      </div>

      {/* Learning Format Section */}
      <div className={styles.format}>
        <div className={styles.container}>
          <div className={styles.formatGrid}>
            <div className={styles.formatContent}>
              <p className={styles.formatEyebrow}>Flexible Learning</p>
              <h2 className={styles.formatTitle}>Designed for Your Success</h2>
              <p className={styles.formatDesc}>
                Our certification programs combine expert instruction with
                practical, hands-on experience. Learn at your own pace with
                support from industry professionals.
              </p>
              <div className={styles.formatList}>
                {LEARNING_FORMATS.map((format, i) => (
                  <div key={i} className={styles.formatItem}>
                    <span className={styles.formatCheck}>✓</span>
                    <span>{format}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.formatVisual}>
              <div className={styles.formatCard}>
                <div className={styles.formatCardIcon}>🎓</div>
                <p>Industry-Recognized Certification</p>
              </div>
              <div className={styles.formatCard}>
                <div className={styles.formatCardIcon}>💼</div>
                <p>Guaranteed Job Placement</p>
              </div>
              <div className={styles.formatCard}>
                <div className={styles.formatCardIcon}>⭐</div>
                <p>Lifetime Alumni Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className={styles.testimonials}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Success Stories</p>
          <h2 className={styles.sectionTitle}>What Our Graduates Say</h2>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialImage}>{t.image}</div>
                <div className={styles.testimonialRating}>
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
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
            <p className={styles.sectionEyebrow}>Start Your Journey</p>
            <h2 className={styles.sectionTitle}>Apply for Certification</h2>
            <p className={styles.formIntro}>
              Complete this detailed application. Our admissions team will
              review and contact you within 48 hours. All fields marked with *
              are required.
            </p>

            {formSubmitted ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>🎉</div>
                <h3 className={styles.successTitle}>
                  Application Submitted Successfully!
                </h3>
                <p className={styles.successText}>
                  Thank you, {formData.fullName.split(" ")[0]}! You're one step
                  closer to becoming a certified professional.
                </p>
                <div className={styles.successDetails}>
                  <p>
                    <strong>Application ID:</strong> DSA-
                    {Math.floor(Math.random() * 100000)}-
                    {formData.programChoice.substring(0, 3).toUpperCase()}
                  </p>
                  <p>
                    <strong>Program:</strong>{" "}
                    {formData.programChoice || "Selected"}
                  </p>
                  <p>
                    <strong>Next Steps:</strong> Our admissions team will
                    contact you within 2 business days to schedule an interview
                    and discuss your training pathway.
                  </p>
                  <p>
                    <strong>What to Expect:</strong> You'll receive a welcome
                    email with program details, schedule confirmation, and
                    preparation materials.
                  </p>
                </div>
                <button className={styles.resetButton} onClick={resetForm}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {/* Progress Steps */}
                <div className={styles.progressSteps}>
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={styles.stepWrapper}>
                      <div
                        className={`${styles.stepCircle} 
                          ${currentStep > step ? styles.stepCompleted : ""} 
                          ${currentStep === step ? styles.stepActive : ""}`}
                      >
                        {currentStep > step ? "✓" : step}
                      </div>
                      <span className={styles.stepLabel}>
                        {step === 1 && "Personal"}
                        {step === 2 && "Background"}
                        {step === 3 && "Program"}
                        {step === 4 && "Final"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className={styles.stepContent}>
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
                        <span className={styles.errorMsg}>
                          {errors.fullName}
                        </span>
                      )}
                    </div>

                    <div className={styles.formRow}>
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
                          <span className={styles.errorMsg}>
                            {errors.email}
                          </span>
                        )}
                      </div>

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
                          <span className={styles.errorMsg}>
                            {errors.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>City / Location *</label>
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
                )}

                {/* Step 2: Background Information */}
                {currentStep === 2 && (
                  <div className={styles.stepContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Previous Domestic Experience *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`${styles.select} ${errors.experience ? styles.inputError : ""}`}
                      >
                        <option value="">Select experience level</option>
                        <option value="none">
                          No experience (starting fresh)
                        </option>
                        <option value="less1">Less than 1 year</option>
                        <option value="1-2">1 - 2 years</option>
                        <option value="3-5">3 - 5 years</option>
                        <option value="5+">5+ years</option>
                      </select>
                      {errors.experience && (
                        <span className={styles.errorMsg}>
                          {errors.experience}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Highest Education Level *
                      </label>
                      <select
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className={`${styles.select} ${errors.education ? styles.inputError : ""}`}
                      >
                        <option value="">Select education level</option>
                        <option value="primary">Primary School</option>
                        <option value="secondary">
                          Secondary School / WAEC
                        </option>
                        <option value="diploma">Diploma / NCE</option>
                        <option value="degree">Bachelor's Degree</option>
                        <option value="postgraduate">
                          Postgraduate Degree
                        </option>
                      </select>
                      {errors.education && (
                        <span className={styles.errorMsg}>
                          {errors.education}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Previous Training (if any)
                      </label>
                      <textarea
                        name="previousTraining"
                        value={formData.previousTraining}
                        onChange={handleChange}
                        placeholder="List any relevant training, workshops, or certificates you've completed..."
                        rows={3}
                        className={styles.textarea}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Program & Schedule Preferences */}
                {currentStep === 3 && (
                  <div className={styles.stepContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Preferred Certification Program *
                      </label>
                      <select
                        name="programChoice"
                        value={formData.programChoice}
                        onChange={handleChange}
                        className={`${styles.select} ${errors.programChoice ? styles.inputError : ""}`}
                      >
                        <option value="">Select a certification program</option>
                        {CERTIFICATION_PROGRAMS.map((program) => (
                          <option key={program.id} value={program.title}>
                            {program.title} — {program.duration} (
                            {program.hours})
                          </option>
                        ))}
                      </select>
                      {errors.programChoice && (
                        <span className={styles.errorMsg}>
                          {errors.programChoice}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Schedule Preference *
                      </label>
                      <div className={styles.scheduleOptions}>
                        {SCHEDULE_OPTIONS.map((option) => (
                          <label
                            key={option.value}
                            className={styles.radioLabel}
                          >
                            <input
                              type="radio"
                              name="schedulePreference"
                              value={option.label}
                              checked={
                                formData.schedulePreference === option.label
                              }
                              onChange={handleChange}
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {errors.schedulePreference && (
                        <span className={styles.errorMsg}>
                          {errors.schedulePreference}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Preferred Start Month *
                      </label>
                      <select
                        name="startMonth"
                        value={formData.startMonth}
                        onChange={handleChange}
                        className={`${styles.select} ${errors.startMonth ? styles.inputError : ""}`}
                      >
                        <option value="">Select preferred start month</option>
                        <option value="January">
                          January Cohort (Limited seats)
                        </option>
                        <option value="March">March Cohort</option>
                        <option value="May">May Cohort</option>
                        <option value="July">July Cohort</option>
                        <option value="September">
                          September Cohort (Most popular)
                        </option>
                        <option value="November">November Cohort</option>
                      </select>
                      {errors.startMonth && (
                        <span className={styles.errorMsg}>
                          {errors.startMonth}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Final Details */}
                {currentStep === 4 && (
                  <div className={styles.stepContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Why do you want to get certified? *
                      </label>
                      <textarea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleChange}
                        placeholder="Share your passion for domestic service, your career goals, and why you want to join Deusizi Academy..."
                        rows={4}
                        className={`${styles.textarea} ${errors.motivation ? styles.inputError : ""}`}
                      />
                      {errors.motivation && (
                        <span className={styles.errorMsg}>
                          {errors.motivation}
                        </span>
                      )}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Emergency Contact Name *
                        </label>
                        <input
                          type="text"
                          name="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          placeholder="Full name of emergency contact"
                          className={`${styles.input} ${errors.emergencyContact ? styles.inputError : ""}`}
                        />
                        {errors.emergencyContact && (
                          <span className={styles.errorMsg}>
                            {errors.emergencyContact}
                          </span>
                        )}
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          Emergency Contact Phone *
                        </label>
                        <input
                          type="tel"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleChange}
                          placeholder="Emergency phone number"
                          className={`${styles.input} ${errors.emergencyPhone ? styles.inputError : ""}`}
                        />
                        {errors.emergencyPhone && (
                          <span className={styles.errorMsg}>
                            {errors.emergencyPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        How did you hear about us?
                      </label>
                      <select
                        name="hearAbout"
                        value={formData.hearAbout}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="">Select an option</option>
                        <option value="social">
                          Social Media (Instagram, Facebook, TikTok)
                        </option>
                        <option value="friend">
                          Friend or Family Referral
                        </option>
                        <option value="search">
                          Search Engine (Google, Bing)
                        </option>
                        <option value="ad">Online Advertisement</option>
                        <option value="event">
                          Community Event / Outreach
                        </option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        Referral Code (if any)
                      </label>
                      <input
                        type="text"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                        placeholder="Enter referral code for priority review"
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formDisclaimer}>
                      <span className={styles.disclaimerIcon}>🔒</span>
                      <div>
                        <strong>Privacy Guarantee:</strong> Your information is
                        kept strictly confidential and used only for admissions
                        review. We never share your data with third parties
                        without your explicit consent.
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.formActions}>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className={styles.backButton}
                    >
                      ← Back
                    </button>
                  )}
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className={styles.nextButton}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={sending}
                      className={styles.submitButton}
                    >
                      {sending ? (
                        <span className={styles.spinnerRow}>
                          <span className={styles.spinner} /> Submitting
                          Application...
                        </span>
                      ) : (
                        "Submit Certification Application →"
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faq}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>Common Questions</p>
          <h2 className={styles.sectionTitle}>Everything You Need to Know</h2>
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
              Start Your Journey to Professional Excellence
            </h2>
            <p className={styles.ctaDesc}>
              Join over 2,500 certified professionals who have transformed their
              careers through Deusizi Academy. Free training, recognized
              certification, and lifetime career support.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.ctaPrimary} onClick={scrollToForm}>
                Apply for Free Certification
              </button>
              <button className={styles.ctaSecondary}>
                Download Program Brochure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>
            Deusizi Academy — Professional Certification for Domestic Staff
          </p>
        </div>
      </div>
    </div>
  );
}
