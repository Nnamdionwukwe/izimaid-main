// GiftCertificates.jsx - Updated with backend API integration and Paystack
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GiftCertificates.module.css";
import FixedHeader from "../FixedHeader";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PACKAGES = [
  {
    emoji: "✨",
    name: "Standard Clean Gift",
    desc: "A thorough home clean for any size apartment",
    price: 9000,
    formattedPrice: "₦9,000",
    sub: "1 standard clean session",
  },
  {
    emoji: "🌟",
    name: "Deep Clean Gift",
    desc: "A full deep clean — the perfect reset gift",
    price: 15000,
    formattedPrice: "₦15,000",
    sub: "1 deep clean session",
  },
  {
    emoji: "💎",
    name: "Premium Bundle",
    desc: "Three cleans — the gift that keeps giving",
    price: 25000,
    formattedPrice: "₦25,000",
    sub: "3 standard clean sessions",
  },
  {
    emoji: "👑",
    name: "Luxury Package",
    desc: "Deep clean + 2 standard cleans",
    price: 35000,
    formattedPrice: "₦35,000",
    sub: "1 deep + 2 standard cleans",
  },
  {
    emoji: "🎁",
    name: "Monthly Plan Gift",
    desc: "One month of recurring weekly cleans",
    price: 40000,
    formattedPrice: "₦40,000",
    sub: "4 standard cleans, 1 month",
  },
  {
    emoji: "💝",
    name: "Custom Amount",
    desc: "Choose your own gift value",
    price: null,
    formattedPrice: "Custom",
    sub: "You decide the amount",
  },
];

const OCCASIONS = [
  { emoji: "🎂", name: "Birthday", desc: "The gift they actually need" },
  { emoji: "💍", name: "Wedding", desc: "Perfect newlywed present" },
  { emoji: "🏠", name: "New Home", desc: "Housewarming done right" },
  { emoji: "👶", name: "New Baby", desc: "Help a new parent relax" },
  { emoji: "💼", name: "Work Milestone", desc: "Reward a colleague" },
  { emoji: "🎄", name: "Christmas", desc: "Thoughtful festive gift" },
  { emoji: "💕", name: "Valentine's", desc: "Romantic & practical" },
  { emoji: "👩", name: "Mother's Day", desc: "She deserves a break" },
  { emoji: "🎓", name: "Graduation", desc: "New chapter, clean start" },
  { emoji: "🤒", name: "Get Well", desc: "Support during recovery" },
];

const HOW_STEPS = [
  {
    num: "1",
    title: "Choose a package",
    text: "Pick a preset amount or enter a custom value that suits your budget.",
  },
  {
    num: "2",
    title: "Personalise it",
    text: "Add the recipient's name, your message, and choose a delivery date.",
  },
  {
    num: "3",
    title: "Pay securely",
    text: "Complete payment via Paystack. Your gift certificate is generated instantly.",
  },
  {
    num: "4",
    title: "Recipient books their clean",
    text: "They receive a unique code they can use to book any available maid on our platform.",
  },
];

const TERMS = [
  "Gift certificates are valid for 12 months from the date of purchase.",
  "Certificates can be used for any cleaning service available on the Deusizi Sparkle platform.",
  "If the clean costs less than the certificate value, the remaining balance stays on the certificate.",
  "If the clean costs more, the recipient can pay the difference via Paystack.",
  "Gift certificates are non-refundable once redeemed but can be transferred to another recipient.",
  "One certificate can be used per booking. Multiple certificates cannot be combined in a single booking.",
  "Deusizi Sparkle reserves the right to cancel fraudulently obtained certificates.",
];

export default function GiftCertificates() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({
    from: "",
    to: "",
    email: "",
    date: "",
    message: "",
    occasion: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const selectedPkg = PACKAGES[selected];
  const finalAmount = selected === 5 ? Number(customAmount) : selectedPkg.price;
  const displayAmount =
    selected === 5
      ? customAmount
        ? `₦${Number(customAmount).toLocaleString()}`
        : "₦—"
      : selectedPkg.formattedPrice;

  // Check for payment verification on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get("reference");
    const status = urlParams.get("status");

    if (reference && status === "success") {
      // Payment was successful, show success message
      setSubmitted(true);
      setLoading(false);
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (reference && status === "cancelled") {
      setApiError("Payment was cancelled. Please try again.");
      setLoading(false);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  function validate() {
    const e = {};
    if (!form.from.trim()) e.from = "Please enter your name";
    if (!form.to.trim()) e.to = "Please enter recipient's name";
    if (!form.email.trim()) e.email = "Please enter recipient's email";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.date) e.date = "Please select a delivery date";
    if (!finalAmount) e.amount = "Please select or enter an amount";
    else if (finalAmount < 1000) e.amount = "Minimum amount is ₦1,000";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      // Prepare data for API
      const certificateData = {
        from: form.from,
        to: form.to,
        email: form.email,
        date: form.date,
        message: form.message || "",
        amount: finalAmount,
        occasion: form.occasion || null,
      };

      // Make API call to backend
      const response = await axios.post(
        `${API_BASE_URL}/api/gift-certificates/certificates`,
        certificateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success && response.data.payment) {
        const { authorization_url, reference } = response.data.payment;

        // Store certificate data for success page
        setSubmittedData({
          ...response.data.certificate,
          paymentReference: reference,
        });

        // Redirect to Paystack payment page
        window.location.href = authorization_url;
      } else {
        throw new Error(
          response.data.error || "Failed to create gift certificate",
        );
      }
    } catch (error) {
      console.error("Gift certificate submission error:", error);

      if (error.response) {
        const serverError = error.response.data;
        setApiError(
          serverError.error || "Failed to process. Please try again.",
        );
      } else if (error.request) {
        setApiError(
          "Network error. Please check your connection and try again.",
        );
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setSubmittedData(null);
    setApiError(null);
    setForm({
      from: "",
      to: "",
      email: "",
      date: "",
      message: "",
      occasion: "",
    });
    setCustomAmount("");
    setSelected(0);
    setErrors({});
  }

  return (
    <div className={styles.page}>
      <FixedHeader />
      {/* Hero */}
      <div className={styles.hero}>
        <span className={styles.heroEmoji}>🎁</span>
        <p className={styles.heroEyebrow}>Gift certificates</p>
        <h1 className={styles.heroTitle}>
          Give the gift of
          <br />
          <em>a spotless home.</em>
        </h1>
        <p className={styles.heroDesc}>
          The most thoughtful gift you can give — a professionally cleaned home.
          Perfect for any occasion, delivered instantly to their inbox.
        </p>
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() =>
              document
                .getElementById("choose")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Buy a Gift Certificate
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("how")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            How It Works
          </button>
        </div>
      </div>

      {/* Gift card visual */}
      <div className={styles.giftCardVisual}>
        <div className={styles.giftCard}>
          <div className={styles.giftCardTop}>
            <div>
              <p className={styles.giftCardBrand}>Deusizi Sparkle</p>
              <p className={styles.giftCardType}>Gift Certificate</p>
            </div>
            <span style={{ fontSize: 28 }}>✨</span>
          </div>
          <p className={styles.giftCardAmount}>{displayAmount}</p>
          <p className={styles.giftCardLabel}>
            Professional Home Cleaning · Abuja & Lagos
          </p>
          {form.to && (
            <>
              <p className={styles.giftCardTo}>For</p>
              <p className={styles.giftCardRecipient}>{form.to}</p>
            </>
          )}
          <div className={styles.giftCardBar} />
          <div className={styles.giftCardBottom}>
            <span className={styles.giftCardCode}>
              {submittedData?.code || "DSPK-XXXX-XXXX"}
            </span>
            <span className={styles.giftCardLogo}>🏠</span>
          </div>
        </div>
      </div>

      {/* Choose package */}
      <div className={styles.section} id="choose">
        <p className={styles.sectionEyebrow}>Step 1</p>
        <h2 className={styles.sectionTitle}>Choose your gift amount</h2>
        <div className={styles.packages}>
          {PACKAGES.map((p, i) => (
            <div
              key={p.name}
              className={`${styles.packageCard} ${selected === i ? styles.packageCardSelected : ""}`}
              onClick={() => setSelected(i)}
            >
              <div className={styles.packageBanner} />
              <div className={styles.packageBody}>
                <div className={styles.packageLeft}>
                  <span className={styles.packageEmoji}>{p.emoji}</span>
                  <div>
                    <p className={styles.packageName}>{p.name}</p>
                    <p className={styles.packageDesc}>{p.desc}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className={styles.packageRight}>
                    <p className={styles.packagePrice}>{p.formattedPrice}</p>
                    <p className={styles.packageSub}>{p.sub}</p>
                  </div>
                  <div
                    className={`${styles.packageRadio} ${selected === i ? styles.packageRadioSelected : ""}`}
                  >
                    {selected === i && (
                      <div className={styles.packageRadioDot} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected === 5 && (
          <div className={styles.customCard} style={{ marginTop: 14 }}>
            <p className={styles.customLabel}>Enter custom amount (₦)</p>
            <input
              className={styles.customInput}
              type="number"
              min="1000"
              step="500"
              placeholder="e.g. 20000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
            {errors.amount && (
              <p className={styles.errorMsg}>{errors.amount}</p>
            )}
          </div>
        )}
      </div>

      {/* Personalise */}
      <div className={styles.personalise}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Step 2
        </p>
        <h2 className={styles.personaliseTitle}>Personalise your gift</h2>
        <p className={styles.personaliseSub}>
          Add a personal message and tell us who this is for — we'll deliver it
          straight to their inbox.
        </p>

        {submitted ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>🎉</div>
            <p className={styles.successTitle}>Gift certificate purchased!</p>
            <p className={styles.successText}>
              Your gift certificate has been created and payment confirmed. It
              has been sent to <strong>{form.email}</strong>. They'll receive a
              unique code they can use to book any clean on Deusizi Sparkle.
            </p>
            {submittedData && (
              <div className={styles.certificateDetails}>
                <p>
                  <strong>Certificate Code:</strong> {submittedData.code}
                </p>
                <p>
                  <strong>Amount:</strong> ₦
                  {submittedData.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Expires:</strong>{" "}
                  {new Date(submittedData.expiresAt).toLocaleDateString()}
                </p>
              </div>
            )}
            <button className={styles.resetBtn} onClick={resetForm}>
              Purchase Another Certificate
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* API Error Display */}
            {apiError && (
              <div className={styles.apiErrorBox}>
                <span className={styles.apiErrorIcon}>⚠️</span>
                <p className={styles.apiErrorMessage}>{apiError}</p>
              </div>
            )}

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Your Name *</label>
                <input
                  className={`${styles.input} ${errors.from ? styles.inputError : ""}`}
                  type="text"
                  placeholder="e.g. Emeka"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                />
                {errors.from && (
                  <p className={styles.errorMsg}>{errors.from}</p>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Recipient's Name *</label>
                <input
                  className={`${styles.input} ${errors.to ? styles.inputError : ""}`}
                  type="text"
                  placeholder="e.g. Amaka"
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                />
                {errors.to && <p className={styles.errorMsg}>{errors.to}</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Recipient's Email *</label>
                <input
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  type="email"
                  placeholder="their@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && (
                  <p className={styles.errorMsg}>{errors.email}</p>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Delivery Date *</label>
                <input
                  className={`${styles.input} ${errors.date ? styles.inputError : ""}`}
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                {errors.date && (
                  <p className={styles.errorMsg}>{errors.date}</p>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Occasion (optional)</label>
              <select
                className={styles.select}
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
              >
                <option value="">Select an occasion...</option>
                {OCCASIONS.map((o) => (
                  <option key={o.name} value={o.name}>
                    {o.emoji} {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Personal Message (optional)
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Write a personal message to accompany the gift..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinnerRow}>
                  <span className={styles.spinner} /> Processing...
                </span>
              ) : (
                `Purchase ${displayAmount} Gift Certificate →`
              )}
            </button>

            <p className={styles.secureNote}>
              🔒 Payments processed securely via Paystack
            </p>
          </form>
        )}
      </div>

      {/* Occasions */}
      <div className={styles.occasions}>
        <p className={styles.sectionEyebrow}>Perfect for</p>
        <h2 className={styles.sectionTitle}>
          Every occasion worth celebrating
        </h2>
        <div className={styles.occasionGrid}>
          {OCCASIONS.map((o) => (
            <div key={o.name} className={styles.occasionCard}>
              <div className={styles.occasionEmoji}>{o.emoji}</div>
              <p className={styles.occasionName}>{o.name}</p>
              <p className={styles.occasionDesc}>{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className={styles.howSection} id="how">
        <p className={styles.sectionEyebrow}>How it works</p>
        <h2 className={styles.sectionTitle}>
          From gift to clean home — 4 simple steps
        </h2>
        <div className={styles.howCards}>
          {HOW_STEPS.map((s) => (
            <div key={s.title} className={styles.howCard}>
              <div className={styles.howNum}>{s.num}</div>
              <div>
                <p className={styles.howTitle}>{s.title}</p>
                <p className={styles.howText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className={styles.terms}>
        <p className={styles.sectionEyebrow}>Terms & conditions</p>
        <h2 className={styles.sectionTitle}>Gift certificate terms</h2>
        <div className={styles.termsList}>
          {TERMS.map((t, i) => (
            <div key={i} className={styles.termItem}>
              <div className={styles.termDot}>{i + 1}</div>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Give the gift of a clean home today</h2>
        <p className={styles.ctaText}>
          Thoughtful, practical, and delivered instantly. The perfect gift for
          anyone who deserves a break.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() =>
              document
                .getElementById("choose")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Buy a Certificate
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/maids")}
          >
            Browse Professionals
          </button>
        </div>
      </div>
    </div>
  );
}
