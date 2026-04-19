// src/component/Payment/Payment.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "./Payment.module.css";

const CLOUDINARY_CLOUD =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dlh6z8ygd";
const CLOUDINARY_PRESET =
  import.meta.env.VITE_CLOUDINARY_PRESET || "deusizi_unsigned";

// REMOVE the old uploadToCloudinary function and Cloudinary constants entirely.
// REPLACE with:
async function uploadProof(file, token) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/api/maids/upload-proof`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const PLATFORM_FEE_PCT = 10; // Must match backend PLATFORM_FEE_PERCENT

// Paystack handles these natively — all others go to Stripe
const PAYSTACK_CURRENCIES = new Set(["NGN", "GHS", "ZAR", "KES"]);

const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  KES: "KSh",
  GHS: "₵",
  ZAR: "R",
  UGX: "USh",
  CAD: "CA$",
  AUD: "A$",
  JPY: "¥",
  CNY: "¥",
  SGD: "S$",
  MYR: "RM",
};
function sym(c) {
  return CURRENCY_SYMBOLS[c] || (c ? c + " " : "₦");
}

function fmt(amount, currency) {
  const c = currency || "NGN";
  const n = Number(amount || 0);
  return `${sym(c)}${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Fee: platform adds 10% ON TOP of the maid's service cost ─────────
// Maid charges ₦10,000 → Customer pays ₦11,000 → Maid gets ₦10,000
function calcFees(serviceAmount) {
  const platformFee =
    Math.round(((serviceAmount * PLATFORM_FEE_PCT) / 100) * 100) / 100;
  const customerPays = Math.round((serviceAmount + platformFee) * 100) / 100;
  return { platformFee, customerPays };
}

function autoGateway(currency) {
  return PAYSTACK_CURRENCIES.has(currency) ? "paystack" : "stripe";
}

// ── Alternative payment methods (bank + crypto always available) ──────
const ALT_METHODS = [
  {
    id: "bank",
    label: "Bank Transfer",
    sublabel: "Manual — upload proof after transfer",
    icon: "🏦",
    color: "#1a2466",
  },
  {
    id: "crypto",
    label: "Cryptocurrency",
    sublabel: "BTC · ETH · USDT · USDC via Coinbase",
    icon: "₿",
    color: "#F7931A",
  },
];

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  const [booking, setBooking] = useState(state?.booking || null);
  const [altMethod, setAltMethod] = useState(null); // null | "bank" | "crypto"
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [payStatus, setPayStatus] = useState(null);
  const [error, setError] = useState("");
  const [bankDetails, setBankDetails] = useState(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofRef, setProofRef] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);

  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofPreview, setProofPreview] = useState(null);

  const token = localStorage.getItem("token");

  // ── Derive currency + amounts early so ALL branches can use them ────
  const currency = booking?.maid_currency || booking?.currency || "NGN";
  const serviceAmt = Number(booking?.total_amount || 0); // maid's price
  const { platformFee, customerPays } = calcFees(serviceAmt);
  const gateway = autoGateway(currency); // "paystack" | "stripe"

  // ── Detect callback from payment gateways ────────────────────────
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const session_id = searchParams.get("session_id");
  const gwParam = searchParams.get("gateway");

  useEffect(() => {
    if (!reference && !session_id) return;
    setVerifying(true);
    const q = new URLSearchParams();
    if (gwParam) q.set("gateway", gwParam);
    if (reference) q.set("reference", reference);
    if (session_id) q.set("session_id", session_id);

    fetch(`${API_URL}/api/payments/verify?${q}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) {
          setPayStatus("success");
          if (d.booking_id) {
            fetch(`${API_URL}/api/bookings/${d.booking_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((r) => r.json())
              .then((bd) => {
                if (bd.booking) setBooking(bd.booking);
              });
          }
        } else {
          setPayStatus("failed");
          setError(d.error || "Payment verification failed");
        }
      })
      .catch(() => {
        setPayStatus("failed");
        setError("Network error during verification");
      })
      .finally(() => setVerifying(false));
  }, [reference, session_id]);

  // ── Pay ───────────────────────────────────────────────────────────
  async function handlePay() {
    if (!booking) return;
    setLoading(true);
    setError("");

    const method = altMethod || gateway; // use alt if chosen, else auto

    const endpoints = {
      paystack: "/api/payments/initialize",
      stripe: "/api/payments/initialize/stripe",
      bank: "/api/payments/initialize/bank",
      crypto: "/api/payments/initialize/crypto",
    };

    try {
      const body = { booking_id: booking.id };
      if (method === "stripe") {
        body.currency = currency.toLowerCase();
      }

      const res = await fetch(`${API_URL}${endpoints[method]}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Payment initialization failed");

      if (method === "paystack") {
        window.location.href = data.authorization_url;
        return;
      }
      if (method === "stripe") {
        window.location.href = data.url;
        return;
      }
      if (method === "crypto") {
        window.location.href = data.hosted_url;
        return;
      }
      if (method === "bank") {
        setBankDetails(data);
        setPayStatus("pending_bank");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitProof() {
    if (!proofUrl) {
      setError("Paste an image URL or receipt link");
      return;
    }
    setSubmittingProof(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/payments/confirm/bank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: booking.id,
          proof_url: proofUrl,
          reference: proofRef,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayStatus("success_bank");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingProof(false);
    }
  }

  // ── VERIFYING ─────────────────────────────────────────────────────
  if (verifying)
    return (
      <div className={styles.page}>
        <div
          className={styles.statusCard}
          style={{ background: "white", border: "1px solid rgb(228,228,228)" }}
        >
          <div className={styles.spinner} />
          <p className={styles.statusTitle} style={{ marginTop: 16 }}>
            Verifying your payment…
          </p>
          <p className={styles.statusText}>Please don't close this page.</p>
        </div>
      </div>
    );

  // ── SUCCESS ───────────────────────────────────────────────────────
  if (payStatus === "success" || payStatus === "success_bank")
    return (
      <div className={styles.page}>
        <div className={`${styles.statusCard} ${styles.statusSuccess}`}>
          <div className={styles.statusIcon}>✅</div>
          <p className={styles.statusTitle}>
            {payStatus === "success_bank"
              ? "Proof Submitted!"
              : "Payment Successful!"}
          </p>
          <p className={styles.statusText}>
            {payStatus === "success_bank"
              ? "Your proof has been submitted. Admin will verify within 24 hours."
              : "Payment received. Admin will review and confirm your booking shortly."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className={styles.actionBtn}
              onClick={() => navigate("/my-bookings")}
            >
              View My Bookings
            </button>
            <button className={styles.ghostBtn} onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );

  // ── FAILED ────────────────────────────────────────────────────────
  if (payStatus === "failed")
    return (
      <div className={styles.page}>
        <div className={`${styles.statusCard} ${styles.statusFailed}`}>
          <div className={styles.statusIcon}>❌</div>
          <p className={styles.statusTitle}>Payment Failed</p>
          <p className={styles.statusText}>
            {error || "Could not process payment. Please try again."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className={styles.actionBtn}
              onClick={() => setPayStatus(null)}
            >
              Try Again
            </button>
            <button
              className={styles.ghostBtn}
              onClick={() => navigate("/my-bookings")}
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>
    );

  // ── BANK TRANSFER INSTRUCTIONS ────────────────────────────────────
  // NOTE: currency / customerPays are declared at top of component so they're always available
  if (payStatus === "pending_bank" && bankDetails)
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Bank Transfer Details</p>
          <div className={styles.bankInstructions}>
            <div className={styles.bankRow}>
              <span>Bank</span>
              <strong>{bankDetails.bank_details?.bank_name || "—"}</strong>
            </div>
            <div className={styles.bankRow}>
              <span>Account Number</span>
              <strong className={styles.acctNo}>
                {bankDetails.bank_details?.account_number}
              </strong>
            </div>
            <div className={styles.bankRow}>
              <span>Account Name</span>
              <strong>{bankDetails.bank_details?.account_name}</strong>
            </div>
            <div className={styles.bankRow}>
              <span>Amount to Transfer</span>
              <strong className={styles.bankAmount}>
                {fmt(customerPays, currency)}
              </strong>
            </div>
            <div className={styles.bankRow}>
              <span>Narration / Reference</span>
              <strong className={styles.bankRef}>
                {bankDetails.bank_details?.narration}
              </strong>
            </div>
          </div>
          <p className={styles.bankNote}>
            ⚠️ Transfer exactly <strong>{fmt(customerPays, currency)}</strong>{" "}
            and include the narration so we can match your payment.
          </p>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Upload Payment Proof</p>

          {/* File picker */}
          <div className={styles.proofField}>
            <label>Receipt / Screenshot</label>
            <div className={styles.proofUploadBox}>
              {proofPreview ? (
                <div className={styles.proofPreviewWrap}>
                  <img
                    src={proofPreview}
                    alt="Proof"
                    className={styles.proofPreviewImg}
                  />
                  <button
                    className={styles.proofRemoveBtn}
                    onClick={() => {
                      setProofPreview(null);
                      setProofUrl("");
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              ) : (
                <label
                  className={styles.proofUploadLabel}
                  style={{ opacity: uploadingProof ? 0.5 : 1 }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    disabled={uploadingProof}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingProof(true);
                      setError("");
                      try {
                        const url = await uploadProof(file, token); // ← pass token
                        setProofUrl(url);
                        setProofPreview(url);
                      } catch (err) {
                        setError("Upload failed: " + err.message);
                      } finally {
                        setUploadingProof(false);
                      }
                    }}
                  />
                  <span className={styles.proofUploadIcon}>📎</span>
                  <span>
                    {uploadingProof ? "Uploading…" : "Tap to upload receipt"}
                  </span>
                  <span className={styles.proofUploadHint}>
                    JPG, PNG or PDF · max 10MB
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Optional reference */}
          <div className={styles.proofField}>
            <label>
              Bank Reference / Transaction ID{" "}
              <span style={{ fontWeight: 400, color: "gray" }}>(optional)</span>
            </label>
            <input
              className={styles.proofInput}
              type="text"
              placeholder="e.g. TXN12345678"
              value={proofRef}
              onChange={(e) => setProofRef(e.target.value)}
            />
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button
            className={styles.payBtn}
            style={{ background: "#1a2466" }}
            onClick={handleSubmitProof}
            disabled={submittingProof || !proofUrl || uploadingProof}
          >
            {submittingProof
              ? "Submitting…"
              : uploadingProof
                ? "Uploading…"
                : "Submit Payment Proof"}
          </button>
        </div>
      </div>
    );

  // ── NO BOOKING ────────────────────────────────────────────────────
  if (!booking)
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: "center" }}>
          <p style={{ color: "gray", fontSize: 14 }}>No booking found.</p>
          <button
            className={styles.actionBtn}
            style={{ marginTop: 16 }}
            onClick={() => navigate("/my-bookings")}
          >
            View My Bookings
          </button>
        </div>
      </div>
    );

  // ── MAIN PAYMENT PAGE ──────────────────────────────────────────────
  const activeMethod = altMethod || gateway;
  const gatewayLabel = gateway === "paystack" ? "Paystack" : "Stripe";
  const gatewayIcon = gateway === "paystack" ? "💳" : "🌍";
  const gatewayColor = gateway === "paystack" ? "#00C3F7" : "#635BFF";
  const gatewayDesc =
    gateway === "paystack"
      ? `Cards, bank transfer & mobile money — recommended for ${currency}`
      : `International cards — recommended for ${currency}`;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* ── Fee breakdown ──────────────────────────────────── */}
      <div className={styles.card}>
        <p className={styles.cardTitle}>Booking Summary</p>

        <div className={styles.row}>
          <span className={styles.rowKey}>Maid</span>
          <span className={styles.rowVal}>{booking.maid_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowKey}>Date</span>
          <span className={styles.rowVal}>
            {formatDate(booking.service_date)}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowKey}>Duration</span>
          <span className={styles.rowVal}>{booking.duration_hours} hr(s)</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowKey}>Address</span>
          <span className={styles.rowVal}>{booking.address}</span>
        </div>
        {booking.notes && (
          <div className={styles.row}>
            <span className={styles.rowKey}>Notes</span>
            <span
              className={styles.rowVal}
              style={{ fontStyle: "italic", fontWeight: "normal" }}
            >
              {booking.notes}
            </span>
          </div>
        )}

        {/* Fee breakdown — additive model */}
        <div className={styles.feeDivider} />
        <div className={styles.row}>
          <span className={styles.rowKey}>
            Service cost
            <span className={styles.feeTip}>Maid's rate × duration</span>
          </span>
          <span className={styles.rowVal}>{fmt(serviceAmt, currency)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowKey}>
            + Platform fee ({PLATFORM_FEE_PCT}%)
            <span className={styles.feeTip}>
              Insurance, support & secure payments
            </span>
          </span>
          <span className={styles.rowVal}>{fmt(platformFee, currency)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Total you pay</span>
          <span>{fmt(customerPays, currency)}</span>
        </div>
      </div>

      {/* ── Auto-selected gateway banner ─────────────────── */}
      <div className={styles.autoBanner} style={{ borderColor: gatewayColor }}>
        <div className={styles.autoBannerLeft}>
          <span className={styles.autoBannerIcon}>{gatewayIcon}</span>
          <div>
            <p className={styles.autoBannerTitle}>
              Paying via <strong>{gatewayLabel}</strong>
              <span
                className={styles.autoBadge}
                style={{ background: gatewayColor }}
              >
                Auto-selected
              </span>
            </p>
            <p className={styles.autoBannerDesc}>{gatewayDesc}</p>
          </div>
        </div>
      </div>

      {/* ── Alternative methods ───────────────────────────── */}
      <div className={styles.card}>
        <p className={styles.cardTitle}>Or pay differently</p>
        <div className={styles.methodList}>
          {ALT_METHODS.map((m) => (
            <button
              key={m.id}
              className={`${styles.methodCard} ${altMethod === m.id ? styles.methodCardActive : ""}`}
              onClick={() => setAltMethod(altMethod === m.id ? null : m.id)}
              style={{ "--method-color": m.color }}
            >
              <span className={styles.methodIcon}>{m.icon}</span>
              <div className={styles.methodInfo}>
                <p className={styles.methodLabel}>{m.label}</p>
                <p className={styles.methodSub}>{m.sublabel}</p>
              </div>
              {altMethod === m.id && (
                <span className={styles.methodCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
        {altMethod && (
          <button
            className={styles.clearAltBtn}
            onClick={() => setAltMethod(null)}
          >
            ← Use {gatewayLabel} instead
          </button>
        )}
      </div>

      {/* ── Context note ─────────────────────────────────── */}
      {!altMethod && (
        <div
          className={styles.methodNote}
          style={{ borderColor: gatewayColor }}
        >
          {gatewayIcon} You'll be redirected to <strong>{gatewayLabel}</strong>{" "}
          to complete payment securely. You'll return here automatically after
          payment.
        </div>
      )}
      {altMethod === "bank" && (
        <div className={styles.methodNote} style={{ borderColor: "#1a2466" }}>
          🏦 Make a direct bank transfer and upload your receipt. Admin verifies
          within
          <strong> 24 hours</strong> and confirms your booking.
        </div>
      )}
      {altMethod === "crypto" && (
        <div className={styles.methodNote} style={{ borderColor: "#F7931A" }}>
          ₿ Pay with <strong>Bitcoin, Ethereum, USDT or USDC</strong> via
          Coinbase Commerce. You'll be redirected to a secure hosted payment
          page.
        </div>
      )}

      {/* ── Steps ────────────────────────────────────────── */}
      <div className={styles.card}>
        <p className={styles.cardTitle}>How it works</p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span>1️⃣</span>
            <span>
              Pay via{" "}
              {altMethod
                ? ALT_METHODS.find((m) => m.id === altMethod)?.label
                : gatewayLabel}
            </span>
          </div>
          <div className={styles.step}>
            <span>2️⃣</span>
            <span>Admin reviews and approves your booking</span>
          </div>
          <div className={styles.step}>
            <span>3️⃣</span>
            <span>Maid is notified and confirms</span>
          </div>
          <div className={styles.step}>
            <span>4️⃣</span>
            <span>Maid is paid after the job is done</span>
          </div>
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* ── Pay button ────────────────────────────────────── */}
      <button
        className={styles.payBtn}
        onClick={handlePay}
        disabled={loading}
        style={{
          background:
            activeMethod === "paystack"
              ? "#00C3F7"
              : activeMethod === "stripe"
                ? "#635BFF"
                : activeMethod === "crypto"
                  ? "#F7931A"
                  : "#1a2466",
        }}
      >
        {loading ? (
          "Redirecting…"
        ) : (
          <>
            {activeMethod === "paystack" &&
              `💳 Pay ${fmt(customerPays, currency)} via Paystack`}
            {activeMethod === "stripe" &&
              `🌍 Pay ${fmt(customerPays, currency)} via Stripe`}
            {activeMethod === "bank" && `🏦 Get Bank Transfer Details`}
            {activeMethod === "crypto" &&
              `₿ Pay ${fmt(customerPays, currency)} in Crypto`}
          </>
        )}
      </button>

      <p className={styles.secureNote}>
        🔐 All payments are encrypted · Your money is held safely until the job
        is done
      </p>
    </div>
  );
}
