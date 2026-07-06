// src/component/Payment/CustomerPayments.jsx – Flutterwave label updates
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerPayments.module.css";

// ─── React Icons ──────────────────────────────────────────────
import {
  FaArrowLeft,
  FaCreditCard,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
  FaUniversity,
  FaCoins,
  FaDownload,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaIdCard,
  FaCheckCircle,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "₵",
  KES: "KSh",
  ZAR: "R",
  UGX: "USh",
  TZS: "TSh",
  RWF: "FRw",
  ETB: "Br",
  XOF: "CFA",
  MAD: "MAD",
  EGP: "E£",
  CAD: "CA$",
  AUD: "A$",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
  QAR: "QR",
  SGD: "S$",
  MYR: "RM",
  BRL: "R$",
  MXN: "MX$",
  JPY: "¥",
  CNY: "¥",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  NZD: "NZ$",
  HKD: "HK$",
  PHP: "₱",
  THB: "฿",
  IDR: "Rp",
  PKR: "₨",
  BDT: "৳",
  VND: "₫",
  CZK: "Kč",
  PLN: "zł",
  HUF: "Ft",
  RON: "lei",
  TRY: "₺",
  ILS: "₪",
};

function sym(c) {
  return CURRENCY_SYMBOLS[c] || c + " ";
}
function fmt(n, c) {
  return `${sym(c)}${Number(n || 0).toLocaleString()}`;
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Gateway helpers ────────────────────────────────────────────────
function gatewayLabel(g) {
  return (
    {
      flutterwave: "Flutterwave",
      bank_transfer: "Bank Transfer",
      crypto: "Crypto",
    }[g] || g
  );
}
function gatewayIcon(g) {
  return (
    {
      flutterwave: <FaCreditCard />,
      bank_transfer: <FaUniversity />,
      crypto: <FaCoins />,
    }[g] || <FaCreditCard />
  );
}

// ─── Payment status styles ───────────────────────────────────────────
const STATUS_STYLE = {
  success: { bg: "#e6f7e6", color: "#2e7d32" },
  failed: { bg: "#fdecea", color: "#c62828" },
  refunded: { bg: "#fff3e0", color: "#e65100" },
  pending: { bg: "#e3f2fd", color: "#0d47a1" },
};

function initials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

function downloadReceipt(payment) {
  const statusLabel = payment.status === "success" ? "Paid" : payment.status;
  const dateStr = fmtDate(payment.paid_at || payment.created_at);
  const amountStr = fmt(payment.amount, payment.currency);
  const gatewayStr = gatewayLabel(payment.gateway);
  const refStr = payment.reference || "N/A";
  const bookingStr = payment.booking_id || "N/A";
  const addressStr = payment.address || "N/A";

  // Map status to modern colors
  const statusColors = {
    success: "#2e7d32",
    pending: "#e65100",
    failed: "#c62828",
    refunded: "#0d47a1",
  };
  const statusBg = {
    success: "#e6f7e6",
    pending: "#fff3e0",
    failed: "#fdecea",
    refunded: "#e3f2fd",
  };
  const statusColor = statusColors[payment.status] || "#333";
  const statusBgColor = statusBg[payment.status] || "#eee";

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Receipt #${payment.id.slice(0, 8)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f4f6f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 24px;
      margin: 0;
    }
    .receipt {
      max-width: 500px;
      width: 100%;
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.06);
      padding: 40px 32px;
      transition: all 0.2s;
    }
    .receipt-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f2f5;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #ff6f00, #ffab00);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .brand-logo i {
      font-size: 20px;
    }
    .brand-name {
      font-size: 18px;
      font-weight: 700;
      color: #0b1a33;
      letter-spacing: -0.02em;
    }
    .brand-name span {
      color: #ff6f00;
    }
    .receipt-title {
      font-size: 14px;
      font-weight: 500;
      color: #6a7a9e;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      background: ${statusBgColor};
      color: ${statusColor};
      text-transform: capitalize;
    }
    .amount-section {
      text-align: center;
      padding: 16px 0 24px;
    }
    .amount-label {
      font-size: 13px;
      font-weight: 500;
      color: #6a7a9e;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 4px;
    }
    .amount-value {
      font-size: 40px;
      font-weight: 700;
      color: #0b1a33;
      letter-spacing: -0.02em;
    }
    .amount-currency {
      font-size: 16px;
      font-weight: 500;
      color: #6a7a9e;
      margin-top: 2px;
    }
    .details-grid {
      display: flex;
      flex-direction: column;
      gap: 0;
      border-top: 1px solid #f0f2f5;
      padding-top: 20px;
      margin-top: 4px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f8f9fb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-size: 13px;
      font-weight: 500;
      color: #6a7a9e;
    }
    .detail-value {
      font-size: 13px;
      font-weight: 600;
      color: #0b1a33;
      text-align: right;
      max-width: 60%;
      word-break: break-word;
    }
    .detail-value .ref {
      font-weight: 400;
      font-size: 12px;
      color: #6a7a9e;
      word-break: break-all;
    }
    .receipt-footer {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #f0f2f5;
      text-align: center;
    }
    .receipt-footer p {
      font-size: 14px;
      font-weight: 500;
      color: #0b1a33;
    }
    .receipt-footer small {
      display: block;
      margin-top: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #6a7a9e;
    }
    .receipt-footer i {
      color: #ff6f00;
    }
    .powered {
      margin-top: 12px;
      font-size: 11px;
      color: #a0b4d6;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-weight: 500;
    }
    .powered span {
      color: #ff6f00;
      font-weight: 600;
    }
    @media (max-width: 480px) {
      .receipt {
        padding: 24px 18px;
      }
      .amount-value {
        font-size: 32px;
      }
      .receipt-header {
        flex-direction: column;
        gap: 12px;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <!-- Header -->
    <div class="receipt-header">
      <div class="brand">
        <div class="brand-logo">
          <img src="deusizi.jpg" alt="Deusizi Sparkle" style="width: 20px; height: 20px;" />
        </div>
        <span class="brand-name">Deusizi <span>Sparkle</span></span>
      </div>
      <span class="receipt-title">Payment Receipt</span>
    </div>

    <!-- Status -->
    <div style="text-align: center; margin-bottom: 4px;">
      <span class="status-badge">${statusLabel}</span>
    </div>

    <!-- Amount -->
    <div class="amount-section">
      <div class="amount-label">Total Amount</div>
      <div class="amount-value">${amountStr}</div>
      <div class="amount-currency">${payment.currency}</div>
    </div>

    <!-- Details -->
    <div class="details-grid">
      <div class="detail-row">
        <span class="detail-label"><i class="fas fa-hashtag" style="margin-right: 6px; color: #a0b4d6;"></i>Payment ID</span>
        <span class="detail-value" style="font-weight: 400; font-size: 12px; color: #6a7a9e;">${payment.id}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label"><i class="fas fa-user" style="margin-right: 6px; color: #a0b4d6;"></i>Maid</span>
        <span class="detail-value">${payment.maid_name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label"><i class="fas fa-calendar-alt" style="margin-right: 6px; color: #a0b4d6;"></i>Date</span>
        <span class="detail-value">${dateStr}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label"><i class="fas fa-credit-card" style="margin-right: 6px; color: #a0b4d6;"></i>Gateway</span>
        <span class="detail-value">${gatewayStr}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label"><i class="fas fa-receipt" style="margin-right: 6px; color: #a0b4d6;"></i>Reference</span>
        <span class="detail-value"><span class="ref">${refStr}</span></span>
      </div>
      <div class="detail-row">
        <span class="detail-label"><i class="fas fa-bookmark" style="margin-right: 6px; color: #a0b4d6;"></i>Booking ID</span>
        <span class="detail-value"><span class="ref">${bookingStr}</span></span>
      </div>
      <div class="detail-row">
        <span class="detail-label"><i class="fas fa-map-pin" style="margin-right: 6px; color: #a0b4d6;"></i>Address</span>
        <span class="detail-value" style="font-weight: 400; font-size: 12px; color: #4a5a72; max-width: 65%;">${addressStr}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="receipt-footer">
      <p><i class="fas fa-check-circle" style="color: #2e7d32; margin-right: 6px;"></i> Thank you for your payment!</p>
      <small>This is a system-generated receipt. No signature required.</small>
      <div class="powered">Powered by <span>Deusizi Sparkle MarketPlace</span> <i class="fas fa-star" style="font-size: 10px;"></i></div>
    </div>
  </div>
</body>
</html>
  `;

  // Create a Blob and download as .html
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${payment.id.slice(0, 8)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── PaymentDetail Modal Component ──────────────────────────────────
function PaymentDetail({ payment, user, onClose }) {
  const st = STATUS_STYLE[payment.status] ||
    STATUS_STYLE.pending || { bg: "#eee", color: "#333" };
  const [downloadStatus, setDownloadStatus] = useState(null); // null | "loading" | "done"

  const handleDownload = () => {
    setDownloadStatus("loading");
    // Simulate a tiny delay so the user sees the spinner/feedback
    setTimeout(() => {
      downloadReceipt(payment);
      setDownloadStatus("done");
      // Reset after 3 seconds
      setTimeout(() => setDownloadStatus(null), 3000);
    }, 300);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalTitle}>Payment Details</p>
            <p className={styles.modalSub}>#{payment.id}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailStatusRow}>
            <span
              className={styles.detailBadge}
              style={{ background: st.bg, color: st.color }}
            >
              {payment.status === "success" ? "Paid" : payment.status}
            </span>
            <span className={styles.detailGateway}>
              {gatewayIcon(payment.gateway)} {gatewayLabel(payment.gateway)}
            </span>
          </div>

          <div className={styles.detailAmountHero}>
            <p className={styles.detailAmountLabel}>Total Amount</p>
            <p className={styles.detailAmount}>
              {fmt(payment.amount, payment.currency)}
            </p>
            <p className={styles.detailCurrency}>{payment.currency}</p>
          </div>

          <div className={styles.detailRows}>
            <div className={styles.detailRow}>
              <span>Maid</span>
              <span>{payment.maid_name}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Date</span>
              <span>{fmtDate(payment.paid_at || payment.created_at)}</span>
            </div>
            {payment.address && (
              <div className={styles.detailRow}>
                <span>Address</span>
                <span className={styles.detailRowVal}>{payment.address}</span>
              </div>
            )}
            {payment.reference && (
              <div className={styles.detailRow}>
                <span>Reference</span>
                <span className={styles.detailRef}>{payment.reference}</span>
              </div>
            )}
            {payment.booking_id && (
              <div className={styles.detailRow}>
                <span>Booking</span>
                <span>#{payment.booking_id}</span>
              </div>
            )}
          </div>

          {/* Download feedback */}
          {downloadStatus === "done" && (
            <div className={styles.downloadFeedback}>
              <FaCheckCircle className={styles.feedbackIcon} /> Receipt
              downloaded!
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.downloadBtn}
            onClick={handleDownload}
            disabled={downloadStatus === "loading"}
          >
            {downloadStatus === "loading" ? (
              <>⏳ Downloading…</>
            ) : (
              <>
                <FaDownload /> Download Receipt
              </>
            )}
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function CustomerPayments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [currency, setCurrency] = useState("all");
  const [gateway, setGateway] = useState("all");
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    if (!token) return navigate("/login");
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currency !== "all") params.set("currency", currency);
      if (gateway !== "all") params.set("gateway", gateway);
      if (status !== "all") params.set("status", status);
      params.set("limit", "100");

      const res = await fetch(`${API_URL}/api/payments/my?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPayments(data.payments || []);
      setSummary(data.summary || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, currency, gateway, status]);

  useEffect(() => {
    load();
  }, [load]);

  const currencies = summary.map((s) => s.currency);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h1 className={styles.title}>My Payments</h1>
      </div>

      {summary.length > 0 && (
        <div className={styles.summaryRow}>
          {summary.map((s) => (
            <div
              key={s.currency}
              className={styles.summaryCard}
              onClick={() =>
                setCurrency(currency === s.currency ? "all" : s.currency)
              }
              style={{
                borderColor:
                  currency === s.currency ? "rgb(19,19,103)" : undefined,
                background:
                  currency === s.currency ? "rgb(240,240,255)" : undefined,
              }}
            >
              <p className={styles.summaryCur}>{s.currency}</p>
              <p className={styles.summaryAmt}>
                {fmt(s.total_paid, s.currency)}
              </p>
              <p className={styles.summaryCount}>
                {s.count} payment{s.count !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.filters}>
        <select
          className={styles.filter}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="all">All Currencies</option>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className={styles.filter}
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
        >
          <option value="all">All Methods</option>
          <option value="flutterwave">Flutterwave</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="crypto">Crypto</option>
        </select>
        <select
          className={styles.filter}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="success">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        {(currency !== "all" || gateway !== "all" || status !== "all") && (
          <button
            className={styles.clearBtn}
            onClick={() => {
              setCurrency("all");
              setGateway("all");
              setStatus("all");
            }}
          >
            <FaTimes /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}>
            <FaSpinner className={styles.spinIcon} />
          </div>
          <p>Loading payments…</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <FaExclamationTriangle /> {error}
        </div>
      ) : payments.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>
            <FaCreditCard />
          </p>
          <p className={styles.emptyTitle}>No payments found</p>
          <p className={styles.emptyHint}>Try changing the filters above</p>
        </div>
      ) : (
        <div className={styles.list}>
          {payments.map((p) => {
            const st = STATUS_STYLE[p.status] ||
              STATUS_STYLE.pending || { bg: "#eee", color: "#333" };
            return (
              <div
                key={p.id}
                className={styles.card}
                onClick={() => setSelected(p)}
              >
                <div className={styles.cardLeft}>
                  <div className={styles.cardAvatar}>
                    {p.maid_avatar ? (
                      <img
                        src={p.maid_avatar}
                        alt={p.maid_name}
                        className={styles.cardAvatarImg}
                      />
                    ) : (
                      <span>{initials(p.maid_name)}</span>
                    )}
                  </div>
                  <div>
                    <p className={styles.cardMaid}>{p.maid_name}</p>
                    <p className={styles.cardDate}>
                      {fmtDate(p.paid_at || p.created_at)}
                    </p>
                    <p className={styles.cardAddress}>
                      {p.address?.split(",")[0]}
                    </p>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <p className={styles.cardAmount}>
                    {fmt(p.amount, p.currency)}
                  </p>
                  <span
                    className={styles.cardStatus}
                    style={{ background: st.bg, color: st.color }}
                  >
                    {p.status === "success" ? "Paid" : p.status}
                  </span>
                  <p className={styles.cardGateway}>
                    {gatewayIcon(p.gateway)} {gatewayLabel(p.gateway)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <PaymentDetail
          payment={selected}
          user={user}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
