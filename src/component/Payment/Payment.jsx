// src/component/Payment/Payment.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "./Payment.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const PLATFORM_FEE_PCT = 10; // Must match backend PLATFORM_FEE_PERCENT

// ── Currencies Paystack handles natively ───────────────────────────────
const PAYSTACK_CURRENCIES = new Set(["NGN", "GHS", "ZAR", "KES", "USD"]);

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
  return `${sym(currency)}${Number(amount || 0).toLocaleString("en-US", {
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

// ── Fee calculator (mirrors backend) ─────────────────────────────────
function calcFees(total) {
  const platformFee =
    Math.round(((total * PLATFORM_FEE_PCT) / 100) * 100) / 100;
  const maidPayout = Math.round((total - platformFee) * 100) / 100;
  return { platformFee, maidPayout };
}

// ── Determine available payment methods for a currency ────────────────
function getPaymentMethods(currency) {
  const methods = [];

  if (PAYSTACK_CURRENCIES.has(currency)) {
    methods.push({
      id: "paystack",
      label: "Card / Mobile Money",
      sublabel: "Powered by Paystack",
      icon: "💳",
      currencies: "NGN · GHS · KES · ZAR",
      color: "#00C3F7",
      recommended: currency === "NGN",
    });
  }

  // Stripe for all other currencies + alternative for Paystack ones
  methods.push({
    id: "stripe",
    label: "International Card",
    sublabel: "Powered by Stripe",
    icon: "🌍",
    currencies: "USD · GBP · EUR · CAD · AUD · 135+ currencies",
    color: "#635BFF",
    recommended: !PAYSTACK_CURRENCIES.has(currency),
  });

  methods.push({
    id: "bank",
    label: "Bank Transfer",
    sublabel: "Manual — upload proof",
    icon: "🏦",
    currencies: "Any currency",
    color: "#1a2466",
  });

  methods.push({
    id: "crypto",
    label: "Cryptocurrency",
    sublabel: "BTC · ETH · USDT · USDC",
    icon: "₿",
    currencies: "Any crypto",
    color: "#F7931A",
  });

  return methods;
}

// ═══════════════════════════════════════════════════════════════════════
// Main Payment component
// ═══════════════════════════════════════════════════════════════════════
export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  const [booking, setBooking] = useState(state?.booking || null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [payStatus, setPayStatus] = useState(null); // null | success | failed | pending_bank
  const [error, setError] = useState("");

  // Bank transfer state
  const [bankDetails, setBankDetails] = useState(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofRef, setProofRef] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);

  const token = localStorage.getItem("token");

  // ── Detect Paystack / Stripe callback ───────────────────────────────
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const session_id = searchParams.get("session_id");
  const gateway = searchParams.get("gateway");

  useEffect(() => {
    if (!reference && !session_id) return;
    setVerifying(true);

    const query = new URLSearchParams();
    if (gateway) query.set("gateway", gateway);
    if (reference) query.set("reference", reference);
    if (session_id) query.set("session_id", session_id);

    fetch(`${API_URL}/api/payments/verify?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) {
          setPayStatus("success");
          // Refresh booking data
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

  // ── Auto-select recommended method when booking loads ───────────────
  useEffect(() => {
    if (!booking) return;
    const currency = booking.maid_currency || booking.currency || "NGN";
    const methods = getPaymentMethods(currency);
    const recommended = methods.find((m) => m.recommended) || methods[0];
    setSelectedMethod(recommended.id);
  }, [booking]);

  // ── Pay handlers ─────────────────────────────────────────────────────
  async function handlePay() {
    if (!booking || !selectedMethod) return;
    setLoading(true);
    setError("");

    const endpoints = {
      paystack: "/api/payments/initialize",
      stripe: "/api/payments/initialize/stripe",
      bank: "/api/payments/initialize/bank",
      crypto: "/api/payments/initialize/crypto",
    };

    try {
      const body = { booking_id: booking.id };
      if (selectedMethod === "stripe") {
        const c = (
          booking.maid_currency ||
          booking.currency ||
          "ngn"
        ).toLowerCase();
        body.currency = c;
      }

      const res = await fetch(`${API_URL}${endpoints[selectedMethod]}`, {
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

      // Redirect gateways
      if (selectedMethod === "paystack") {
        window.location.href = data.authorization_url;
        return;
      }
      if (selectedMethod === "stripe") {
        window.location.href = data.url;
        return;
      }
      if (selectedMethod === "crypto") {
        window.location.href = data.hosted_url;
        return;
      }
      // Bank transfer — show instructions
      if (selectedMethod === "bank") {
        setBankDetails(data);
        setPayStatus("pending_bank");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Submit bank proof ────────────────────────────────────────────────
  async function handleSubmitProof() {
    if (!proofUrl) {
      setError("Please enter the proof URL or reference");
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

  // ─────────────────────────────────────────────────────────────────────
  // ── VERIFYING ────────────────────────────────────────────────────────
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

  // ── SUCCESS ───────────────────────────────────────────────────────────
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
              ? "Your payment proof has been submitted. Our admin team will verify and confirm your booking within 24 hours."
              : "Your payment has been received. Our admin team will review and confirm your booking shortly — usually within a few minutes."}
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

  // ── FAILED ────────────────────────────────────────────────────────────
  if (payStatus === "failed")
    return (
      <div className={styles.page}>
        <div className={`${styles.statusCard} ${styles.statusFailed}`}>
          <div className={styles.statusIcon}>❌</div>
          <p className={styles.statusTitle}>Payment Failed</p>
          <p className={styles.statusText}>
            {error || "Your payment could not be processed. Please try again."}
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

  // ── BANK TRANSFER INSTRUCTIONS ───────────────────────────────────────
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
              <span>Amount</span>
              <strong className={styles.bankAmount}>
                {fmt(booking.total_amount, booking.maid_currency || "NGN")}
              </strong>
            </div>
            <div className={styles.bankRow}>
              <span>Narration</span>
              <strong className={styles.bankRef}>
                {bankDetails.bank_details?.narration}
              </strong>
            </div>
          </div>
          <p className={styles.bankNote}>
            ⚠️ Transfer the <strong>exact amount</strong> and use the narration
            above. Then upload your proof below.
          </p>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Upload Payment Proof</p>
          <div className={styles.proofField}>
            <label>Screenshot / Receipt URL</label>
            <input
              className={styles.proofInput}
              type="text"
              placeholder="Paste image URL or Cloudinary link"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
            />
          </div>
          <div className={styles.proofField}>
            <label>Bank Reference / Transaction ID</label>
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
            onClick={handleSubmitProof}
            disabled={submittingProof || !proofUrl}
          >
            {submittingProof ? "Submitting…" : "Submit Payment Proof"}
          </button>
        </div>
      </div>
    );

  // ── NO BOOKING ────────────────────────────────────────────────────────
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

  // ── MAIN PAYMENT PAGE ─────────────────────────────────────────────────
  const currency = booking.maid_currency || booking.currency || "NGN";
  const total = Number(booking.total_amount || 0);
  const { platformFee, maidPayout } = calcFees(total);
  const methods = getPaymentMethods(currency);
  const usePaystack = PAYSTACK_CURRENCIES.has(currency);

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* ── Booking summary ──────────────────────────────────── */}
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
          <span className={styles.rowVal}>
            {booking.duration_hours} hour(s)
          </span>
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

        {/* Fee breakdown */}
        <div className={styles.feeDivider} />
        <div className={styles.row}>
          <span className={styles.rowKey}>Service cost</span>
          <span className={styles.rowVal}>{fmt(maidPayout, currency)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowKey}>
            Platform fee ({PLATFORM_FEE_PCT}%)
            <span className={styles.feeTip}>
              covers insurance, support & secure payments
            </span>
          </span>
          <span className={styles.rowVal}>{fmt(platformFee, currency)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>Total you pay</span>
          <span>{fmt(total, currency)}</span>
        </div>
      </div>

      {/* ── Payment method selector ──────────────────────────── */}
      <div className={styles.card}>
        <p className={styles.cardTitle}>Choose Payment Method</p>
        <div className={styles.methodList}>
          {methods.map((m) => (
            <button
              key={m.id}
              className={`${styles.methodCard} ${selectedMethod === m.id ? styles.methodCardActive : ""}`}
              onClick={() => {
                setSelectedMethod(m.id);
                setError("");
              }}
              style={{ "--method-color": m.color }}
            >
              <span className={styles.methodIcon}>{m.icon}</span>
              <div className={styles.methodInfo}>
                <p className={styles.methodLabel}>
                  {m.label}
                  {m.recommended && (
                    <span className={styles.methodBadge}>Recommended</span>
                  )}
                </p>
                <p className={styles.methodSub}>{m.sublabel}</p>
                <p className={styles.methodCurrencies}>{m.currencies}</p>
              </div>
              {selectedMethod === m.id && (
                <span className={styles.methodCheck}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Context note per method ───────────────────────────── */}
      {selectedMethod === "paystack" && (
        <div className={styles.methodNote} style={{ borderColor: "#00C3F7" }}>
          💳 You'll be redirected to <strong>Paystack</strong> to complete
          payment securely. Supports cards, bank transfer, USSD, and mobile
          money in {currency}.
        </div>
      )}
      {selectedMethod === "stripe" && (
        <div className={styles.methodNote} style={{ borderColor: "#635BFF" }}>
          🌍 You'll be redirected to <strong>Stripe</strong> — accepts 135+
          currencies worldwide. Great for USD, GBP, EUR, CAD, AUD and all
          international cards.
        </div>
      )}
      {selectedMethod === "bank" && (
        <div className={styles.methodNote} style={{ borderColor: "#1a2466" }}>
          🏦 Make a direct bank transfer and upload your receipt. Admin verifies
          within
          <strong> 24 hours</strong> and confirms your booking.
        </div>
      )}
      {selectedMethod === "crypto" && (
        <div className={styles.methodNote} style={{ borderColor: "#F7931A" }}>
          ₿ Pay with <strong>Bitcoin, Ethereum, USDT, USDC</strong> and more via
          Coinbase Commerce. You'll be redirected to complete payment securely.
        </div>
      )}

      {/* ── How it works ─────────────────────────────────────── */}
      <div className={styles.card}>
        <p className={styles.cardTitle}>How it works</p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <span>1️⃣</span>
            <span>Pay securely via your chosen method</span>
          </div>
          <div className={styles.step}>
            <span>2️⃣</span>
            <span>Admin reviews and approves your booking</span>
          </div>
          <div className={styles.step}>
            <span>3️⃣</span>
            <span>Maid is notified and confirms the schedule</span>
          </div>
          <div className={styles.step}>
            <span>4️⃣</span>
            <span>Maid is paid after job completion</span>
          </div>
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {/* ── Pay button ───────────────────────────────────────── */}
      <button
        className={styles.payBtn}
        onClick={handlePay}
        disabled={loading || !selectedMethod}
        style={{
          background:
            selectedMethod === "paystack"
              ? "#00C3F7"
              : selectedMethod === "stripe"
                ? "#635BFF"
                : selectedMethod === "crypto"
                  ? "#F7931A"
                  : "rgb(19,19,103)",
        }}
      >
        {loading ? (
          "Redirecting…"
        ) : (
          <>
            {selectedMethod === "paystack" &&
              `💳 Pay ${fmt(total, currency)} via Paystack`}
            {selectedMethod === "stripe" &&
              `🌍 Pay ${fmt(total, currency)} via Stripe`}
            {selectedMethod === "bank" && `🏦 Get Bank Transfer Details`}
            {selectedMethod === "crypto" &&
              `₿ Pay ${fmt(total, currency)} in Crypto`}
            {!selectedMethod && "Select a payment method"}
          </>
        )}
      </button>

      <p className={styles.secureNote}>
        🔐 All payments are encrypted and secured · Your money is held safely
        until the job is done
      </p>
    </div>
  );
}
