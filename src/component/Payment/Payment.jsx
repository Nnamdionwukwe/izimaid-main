// src/component/Payment/Payment.jsx – Flutterwave + Bank Transfer + Crypto (Trust Wallet)
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  FaCopy,
  FaPaperclip,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaSync,
  FaExclamationTriangle,
  FaLock,
  FaUniversity,
  FaCreditCard,
} from "react-icons/fa";
import { IoLogoBitcoin } from "react-icons/io5";
import styles from "./Payment.module.css";
import CryptoPaymentOptions from "./CryptoPaymentOptions";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const PLATFORM_FEE_PCT = 10;

// ── Helper for uploading bank/crypto proof ──────────────────────
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

// ── Currency helpers ──────────────────────────────────────────────
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

// ── Fee: platform adds 10% on top ────────────────────────────────
function calcFees(serviceAmount) {
  const platformFee =
    Math.round(((serviceAmount * PLATFORM_FEE_PCT) / 100) * 100) / 100;
  const customerPays = Math.round((serviceAmount + platformFee) * 100) / 100;
  return { platformFee, customerPays };
}

// ── Alternative methods (bank + crypto) ───────────────────────────
const ALT_METHODS = [
  {
    id: "bank",
    label: "Bank Transfer",
    sublabel: "Manual — upload proof after transfer",
    icon: <FaUniversity />,
    color: "#1a2466",
  },
  {
    id: "crypto",
    label: "Cryptocurrency",
    sublabel: "BTC · ETH · USDT · USDC – send and submit proof",
    icon: <IoLogoBitcoin />,
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
  const [cryptoDetails, setCryptoDetails] = useState(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofRef, setProofRef] = useState("");
  const [txHash, setTxHash] = useState("");
  const [cryptoAmountSent, setCryptoAmountSent] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofPreview, setProofPreview] = useState(null);
  const token = localStorage.getItem("token");

  const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState("USDT");
  const [selectedCryptoData, setSelectedCryptoData] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  // ── Modal helpers ──────────────────────────────────────────────────
  const showModal = (msg) => setModalMessage(msg);
  const hideModal = () => setModalMessage(null);

  // ── Copy function ──────────────────────────────────────────────────
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showModal("Copied to clipboard!");
      })
      .catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showModal("Copied to clipboard!");
      });
  };

  const currency = booking?.maid_currency || booking?.currency || "NGN";
  const serviceAmt = Number(booking?.total_amount || 0);
  const { platformFee, customerPays } = calcFees(serviceAmt);

  // ── Detect callback from Flutterwave ─────────────────────────────
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const gwParam = searchParams.get("gateway");

  useEffect(() => {
    if (!reference) return;
    setVerifying(true);
    const q = new URLSearchParams();
    if (gwParam) q.set("gateway", gwParam);
    if (reference) q.set("reference", reference);

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
  }, [reference, gwParam]);

  // ── Pay with Flutterwave or initialize alt method ──────────────
  async function handlePay(currencyOverride) {
    if (!booking) return;
    setLoading(true);
    setError("");

    const method = altMethod || "flutterwave";
    const endpoints = {
      flutterwave: "/api/payments/initialize",
      bank: "/api/payments/initialize/bank",
      crypto: "/api/payments/initialize/crypto",
    };

    try {
      const body = { booking_id: booking.id };
      if (method === "crypto") {
        body.currency = currencyOverride || "USDT";
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

      if (method === "flutterwave") {
        window.location.href = data.link;
        return;
      }
      if (method === "bank") {
        setBankDetails(data);
        setPayStatus("pending_bank");
        setLoading(false);
        return;
      }
      if (method === "crypto") {
        setCryptoDetails(data);
        setPayStatus("pending_crypto");
        setLoading(false);
        return;
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  // ── Submit bank proof ────────────────────────────────────────────
  async function handleSubmitBankProof() {
    if (!proofUrl) {
      setError("Please upload an image or provide a receipt URL");
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

  // ── Submit crypto proof ──────────────────────────────────────────
  async function handleSubmitCryptoProof() {
    if (!txHash || !proofUrl) {
      setError("Transaction hash and proof image are required.");
      return;
    }
    setSubmittingProof(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/payments/confirm/crypto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: booking.id,
          tx_hash: txHash,
          amount_sent: cryptoAmountSent || null,
          proof_url: proofUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayStatus("success_crypto");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingProof(false);
    }
  }

  // ── State views ────────────────────────────────────────────────────
  if (verifying) {
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
  }

  if (
    payStatus === "success" ||
    payStatus === "success_bank" ||
    payStatus === "success_crypto"
  ) {
    const message =
      payStatus === "success_bank"
        ? "Your bank transfer proof has been submitted. Admin will verify within 24 hours."
        : payStatus === "success_crypto"
          ? "Your crypto payment proof has been submitted. Admin will verify the transaction on‑chain shortly."
          : "Payment received. Admin will review and confirm your booking shortly.";

    return (
      <div className={styles.page}>
        <div className={`${styles.statusCard} ${styles.statusSuccess}`}>
          <div className={styles.statusIcon}>
            <FaCheck />
          </div>
          <p className={styles.statusTitle}>
            {payStatus === "success_bank"
              ? "Proof Submitted!"
              : payStatus === "success_crypto"
                ? "Crypto Proof Submitted!"
                : "Payment Successful!"}
          </p>
          <p className={styles.statusText}>{message}</p>
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
  }

  if (payStatus === "failed") {
    return (
      <div className={styles.page}>
        <div className={`${styles.statusCard} ${styles.statusFailed}`}>
          <div className={styles.statusIcon}>
            <FaTimes />
          </div>
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
  }

  // ── Bank transfer instructions ────────────────────────────────────
  if (payStatus === "pending_bank" && bankDetails) {
    return (
      <div className={styles.page}>
        <button
          className={styles.backBtn}
          onClick={() => {
            setPayStatus(null);
            setBankDetails(null);
            setAltMethod(null);
            setProofPreview(null);
            setProofUrl("");
          }}
        >
          <FaArrowLeft /> Back to payment options
        </button>

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
            <FaExclamationTriangle /> Transfer exactly{" "}
            <strong>{fmt(customerPays, currency)}</strong> and include the
            narration so we can match your payment.
          </p>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Upload Payment Proof</p>
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
                    <FaTimes /> Remove
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
                        const url = await uploadProof(file, token);
                        setProofUrl(url);
                        setProofPreview(url);
                      } catch (err) {
                        setError("Upload failed: " + err.message);
                      } finally {
                        setUploadingProof(false);
                      }
                    }}
                  />
                  <FaPaperclip className={styles.proofUploadIcon} />
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
            onClick={handleSubmitBankProof}
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
  }

  // ── Crypto instructions ──────────────────────────────────────────
  if (payStatus === "pending_crypto" && cryptoDetails) {
    const cryptoSymbol =
      selectedCryptoData?.symbol || cryptoDetails.currency || "USDT";
    const cryptoAmount = selectedCryptoData?.amount || 0;
    const cryptoRate = selectedCryptoData?.rate;

    return (
      <div className={styles.page}>
        <button
          className={styles.backBtn}
          onClick={() => {
            setPayStatus(null);
            setCryptoDetails(null);
            setAltMethod(null);
            setSelectedCryptoData(null);
          }}
        >
          <FaArrowLeft /> Back to payment options
        </button>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Crypto Payment Details</p>
          <div className={styles.bankInstructions}>
            <div className={styles.bankRow}>
              <span>Currency</span>
              <strong>{cryptoDetails.currency}</strong>
            </div>
            <div className={styles.bankRow}>
              <span>Network</span>
              <strong>{cryptoDetails.network}</strong>
            </div>
            <div className={styles.bankRow}>
              <span>Wallet Address</span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <strong
                  className={styles.acctNo}
                  style={{ wordBreak: "break-all" }}
                >
                  {cryptoDetails.address}
                </strong>
                <button
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(cryptoDetails.address)}
                  aria-label="Copy address"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
            <div className={styles.bankRow}>
              <span>Amount to Send (fiat)</span>
              <strong className={styles.bankAmount}>
                {fmt(customerPays, currency)}
              </strong>
            </div>
            {cryptoAmount > 0 && (
              <div className={styles.bankRow}>
                <span>Amount to Send (crypto)</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <strong
                    className={styles.bankAmount}
                    style={{ color: "#F7931A" }}
                  >
                    {cryptoAmount.toFixed(6)} {cryptoSymbol}
                  </strong>
                  <button
                    className={styles.copyBtn}
                    onClick={() =>
                      copyToClipboard(
                        `${cryptoAmount.toFixed(6)} ${cryptoSymbol}`,
                      )
                    }
                    aria-label="Copy crypto amount"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            )}
            {cryptoRate && (
              <div className={styles.bankRow}>
                <span>Exchange Rate</span>
                <strong>
                  1 {cryptoSymbol} = {fmt(cryptoRate, currency)}
                </strong>
              </div>
            )}
          </div>
          <p className={styles.bankNote}>
            <FaExclamationTriangle /> Send the exact crypto amount to the
            address above. Then submit the transaction hash and a proof
            screenshot.
          </p>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Submit Crypto Proof</p>

          <div className={styles.proofField}>
            <label>Transaction Hash (TXID) *</label>
            <input
              className={styles.proofInput}
              type="text"
              placeholder="0x... or 123abc..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value.trim())}
            />
          </div>

          <div className={styles.proofField}>
            <label>Amount Sent (optional)</label>
            <input
              className={styles.proofInput}
              type="number"
              step="0.01"
              placeholder="e.g. 12.5"
              value={cryptoAmountSent}
              onChange={(e) => setCryptoAmountSent(e.target.value)}
            />
          </div>

          <div className={styles.proofField}>
            <label>Proof Screenshot *</label>
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
                    <FaTimes /> Remove
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
                        const url = await uploadProof(file, token);
                        setProofUrl(url);
                        setProofPreview(url);
                      } catch (err) {
                        setError("Upload failed: " + err.message);
                      } finally {
                        setUploadingProof(false);
                      }
                    }}
                  />
                  <FaPaperclip className={styles.proofUploadIcon} />
                  <span>
                    {uploadingProof ? "Uploading…" : "Tap to upload proof"}
                  </span>
                  <span className={styles.proofUploadHint}>
                    JPG, PNG · max 10MB
                  </span>
                </label>
              )}
            </div>
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button
            className={styles.payBtn}
            style={{ background: "#F7931A" }}
            onClick={handleSubmitCryptoProof}
            disabled={submittingProof || !txHash || !proofUrl || uploadingProof}
          >
            {submittingProof
              ? "Submitting…"
              : uploadingProof
                ? "Uploading…"
                : "Submit Crypto Proof"}
          </button>
        </div>

        {/* ── MODAL ── */}
        {modalMessage && (
          <div className={styles.modalOverlay} onClick={hideModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={hideModal}>
                <FaTimes />
              </button>
              <p className={styles.modalMessage}>{modalMessage}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── No booking ────────────────────────────────────────────────────
  if (!booking) {
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
  }

  // ── MAIN PAYMENT PAGE (Flutterwave) ──────────────────────────────
  const activeMethod = altMethod || "flutterwave";
  const gatewayLabel = "Flutterwave";
  const gatewayIcon = <FaCreditCard />;
  const gatewayColor = "#1a73e8";
  const gatewayDesc =
    "Secure card payments, bank transfers & mobile money – accepted worldwide.";

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

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
                Secure
              </span>
            </p>
            <p className={styles.autoBannerDesc}>{gatewayDesc}</p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Or pay differently</p>
        <div className={styles.methodList}>
          {ALT_METHODS.map((m) => (
            <button
              key={m.id}
              className={`${styles.methodCard} ${
                altMethod === m.id ? styles.methodCardActive : ""
              }`}
              onClick={() => setAltMethod(altMethod === m.id ? null : m.id)}
              style={{ "--method-color": m.color }}
            >
              <span className={styles.methodIcon}>{m.icon}</span>
              <div className={styles.methodInfo}>
                <p className={styles.methodLabel}>{m.label}</p>
                <p className={styles.methodSub}>{m.sublabel}</p>
              </div>
              {altMethod === m.id && (
                <span className={styles.methodCheck}>
                  <FaCheck />
                </span>
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

      {!altMethod && (
        <div
          className={styles.methodNote}
          style={{ borderColor: gatewayColor }}
        >
          {gatewayIcon} You'll be redirected to <strong>Flutterwave</strong> to
          complete payment securely.
        </div>
      )}
      {altMethod === "bank" && (
        <div className={styles.methodNote} style={{ borderColor: "#1a2466" }}>
          <FaUniversity /> Make a direct bank transfer and upload your receipt.
          Admin verifies within <strong>24 hours</strong>.
        </div>
      )}
      {altMethod === "crypto" && !payStatus && (
        <CryptoPaymentOptions
          amount={customerPays}
          currency={currency}
          onSelect={(cryptoData) => {
            setSelectedCryptoData(cryptoData);
            handlePay(cryptoData.symbol);
          }}
          onBack={() => setAltMethod(null)}
        />
      )}

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

      <button
        className={styles.payBtn}
        onClick={handlePay}
        disabled={loading}
        style={{
          background:
            activeMethod === "crypto"
              ? "#F7931A"
              : activeMethod === "bank"
                ? "#1a2466"
                : gatewayColor,
        }}
      >
        {loading ? (
          "Processing…"
        ) : (
          <>
            {activeMethod === "flutterwave" &&
              `${gatewayIcon} Pay ${fmt(customerPays, currency)} via Flutterwave`}
            {activeMethod === "bank" && (
              <>
                <FaUniversity /> Get Bank Transfer Details
              </>
            )}
            {activeMethod === "crypto" && (
              <>
                <IoLogoBitcoin /> Pay {fmt(customerPays, currency)} in Crypto
              </>
            )}
          </>
        )}
      </button>

      <p className={styles.secureNote}>
        <FaLock /> All payments are encrypted · Your money is held safely until
        the job is done
      </p>

      {modalMessage && (
        <div className={styles.modalOverlay} onClick={hideModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={hideModal}>
              <FaTimes />
            </button>
            <p className={styles.modalMessage}>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
