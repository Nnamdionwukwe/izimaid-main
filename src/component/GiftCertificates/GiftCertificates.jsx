import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GiftCertificates.module.css";

const PACKAGES = [
  {
    emoji: "✨",
    name: "Standard Clean Gift",
    desc: "A thorough home clean for any size apartment",
    price: "₦9,000",
    sub: "1 standard clean session",
  },
  {
    emoji: "🌟",
    name: "Deep Clean Gift",
    desc: "A full deep clean — the perfect reset gift",
    price: "₦15,000",
    sub: "1 deep clean session",
  },
  {
    emoji: "💎",
    name: "Premium Bundle",
    desc: "Three cleans — the gift that keeps giving",
    price: "₦25,000",
    sub: "3 standard clean sessions",
  },
  {
    emoji: "👑",
    name: "Luxury Package",
    desc: "Deep clean + 2 standard cleans",
    price: "₦35,000",
    sub: "1 deep + 2 standard cleans",
  },
  {
    emoji: "🎁",
    name: "Monthly Plan Gift",
    desc: "One month of recurring weekly cleans",
    price: "₦40,000",
    sub: "4 standard cleans, 1 month",
  },
  {
    emoji: "💝",
    name: "Custom Amount",
    desc: "Choose your own gift value",
    price: "Custom",
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
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedPkg = PACKAGES[selected];
  const displayAmount =
    selected === 5
      ? customAmount
        ? `₦${Number(customAmount).toLocaleString()}`
        : "₦—"
      : selectedPkg.price;

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <div className={styles.page}>
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
            <span className={styles.giftCardCode}>DSPK-XXXX-XXXX</span>
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
                    <p className={styles.packagePrice}>{p.price}</p>
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
            <p className={styles.successTitle}>Gift certificate sent!</p>
            <p className={styles.successText}>
              Your gift certificate has been sent to{" "}
              <strong>{form.email}</strong>. They'll receive a unique code they
              can use to book any clean on Deusizi Sparkle.
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Your Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Emeka"
                  required
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Recipient's Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Amaka"
                  required
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Recipient's Email</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="their@email.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Delivery Date</label>
                <input
                  className={styles.input}
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
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
              {loading
                ? "Processing..."
                : `Purchase ${displayAmount} Gift Certificate →`}
            </button>
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
            Browse Maids
          </button>
        </div>
      </div>
    </div>
  );
}
