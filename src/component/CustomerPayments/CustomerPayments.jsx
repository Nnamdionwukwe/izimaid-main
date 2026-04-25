import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerPayments.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
};
function sym(c) {
  return CURRENCY_SYMBOLS[c] || (c ? c + " " : "₦");
}
function fmt(n, c) {
  return `${sym(c)}${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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
function gatewayLabel(g) {
  return (
    {
      paystack: "Paystack",
      stripe: "Stripe Card",
      bank_transfer: "Bank Transfer",
      crypto: "Crypto",
    }[g] || g
  );
}
function gatewayIcon(g) {
  return (
    { paystack: "💳", stripe: "💳", bank_transfer: "🏦", crypto: "🪙" }[g] ||
    "💳"
  );
}

const STATUS_STYLE = {
  success: { bg: "rgb(209,247,224)", color: "rgb(10,107,46)" },
  failed: { bg: "rgb(255,228,228)", color: "rgb(168,28,28)" },
  refunded: { bg: "rgb(255,243,205)", color: "rgb(133,100,4)" },
  pending: { bg: "rgb(255,243,205)", color: "rgb(133,100,4)" },
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

// ── Receipt generator ────────────────────────────────────────────────
function downloadReceipt(payment, user) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Payment Receipt — Deusizi Sparkle</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #1a1a1a; }
    .header { background: rgb(19,19,103); color: white; padding: 28px 32px; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0 0 4px; font-size: 22px; }
    .header p  { margin: 0; opacity: 0.75; font-size: 13px; }
    .body  { border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; padding: 28px 32px; }
    .badge { display: inline-block; background: rgb(209,247,224); color: rgb(10,107,46);
             font-weight: bold; font-size: 12px; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; }
    .row   { display: flex; justify-content: space-between; padding: 9px 0;
             border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .key   { color: #666; }
    .val   { font-weight: bold; }
    .total { font-size: 18px; font-weight: bold; color: rgb(19,19,103);
             display: flex; justify-content: space-between; padding-top: 16px;
             border-top: 2px solid rgb(19,19,103); margin-top: 8px; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #aaa; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧹 Deusizi Sparkle</h1>
    <p>Official Payment Receipt</p>
  </div>
  <div class="body">
    <div class="badge">✅ Payment Confirmed</div>
    <div class="row"><span class="key">Receipt No.</span><span class="val">${payment.id.slice(0, 8).toUpperCase()}</span></div>
    <div class="row"><span class="key">Customer</span><span class="val">${user?.name || "Customer"}</span></div>
    <div class="row"><span class="key">Maid</span><span class="val">${payment.maid_name}</span></div>
    <div class="row"><span class="key">Service Address</span><span class="val">${payment.address}</span></div>
    <div class="row"><span class="key">Service Date</span><span class="val">${fmtDate(payment.service_date)}</span></div>
    <div class="row"><span class="key">Duration</span><span class="val">${payment.duration_hours} hour(s)</span></div>
    <div class="row"><span class="key">Payment Method</span><span class="val">${gatewayLabel(payment.gateway)}</span></div>
    <div class="row"><span class="key">Reference</span><span class="val">${payment.paystack_reference || payment.stripe_payment_id || payment.bank_transfer_ref || "N/A"}</span></div>
    <div class="row"><span class="key">Paid On</span><span class="val">${fmtDate(payment.paid_at || payment.created_at)}</span></div>
    ${payment.platform_fee ? `<div class="row"><span class="key">Platform Fee (10%)</span><span class="val">${fmt(payment.platform_fee, payment.currency)}</span></div>` : ""}
    <div class="total"><span>Amount Paid</span><span>${fmt(payment.amount, payment.currency)}</span></div>
  </div>
  <div class="footer">Deusizi Sparkle · Thank you for your business · ${new Date().getFullYear()}</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${payment.id.slice(0, 8)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Payment detail modal ─────────────────────────────────────────────
function PaymentDetail({ payment, user, onClose }) {
  const st = STATUS_STYLE[payment.status] || STATUS_STYLE.pending;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.modalTitle}>Payment Details</p>
            <p className={styles.modalSub}>
              #{payment.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Status */}
          <div className={styles.detailStatusRow}>
            <span
              className={styles.detailBadge}
              style={{ background: st.bg, color: st.color }}
            >
              {payment.status === "success" ? "✅ Paid" : payment.status}
            </span>
            <span className={styles.detailGateway}>
              {gatewayIcon(payment.gateway)} {gatewayLabel(payment.gateway)}
            </span>
          </div>

          {/* Amount hero */}
          <div className={styles.detailAmountHero}>
            <p className={styles.detailAmountLabel}>Amount Paid</p>
            <p className={styles.detailAmount}>
              {fmt(payment.amount, payment.currency)}
            </p>
            <p className={styles.detailCurrency}>{payment.currency}</p>
          </div>

          {/* Rows */}
          <div className={styles.detailRows}>
            <div className={styles.detailRow}>
              <span>Maid</span>
              <span>{payment.maid_name}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Service Date</span>
              <span>{fmtDate(payment.service_date)}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Address</span>
              <span className={styles.detailRowVal}>{payment.address}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Duration</span>
              <span>{payment.duration_hours}h</span>
            </div>
            <div className={styles.detailRow}>
              <span>Booking Status</span>
              <span style={{ textTransform: "capitalize" }}>
                {payment.booking_status?.replace(/_/g, " ")}
              </span>
            </div>
            {payment.platform_fee > 0 && (
              <div className={styles.detailRow}>
                <span>Platform Fee</span>
                <span>{fmt(payment.platform_fee, payment.currency)}</span>
              </div>
            )}
            {(payment.paystack_reference ||
              payment.stripe_payment_id ||
              payment.bank_transfer_ref) && (
              <div className={styles.detailRow}>
                <span>Reference</span>
                <span className={styles.detailRef}>
                  {payment.paystack_reference ||
                    payment.stripe_payment_id ||
                    payment.bank_transfer_ref}
                </span>
              </div>
            )}
            <div className={styles.detailRow}>
              <span>Paid On</span>
              <span>{fmtDate(payment.paid_at || payment.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.modalFooter}>
          {payment.status === "success" && (
            <button
              className={styles.downloadBtn}
              onClick={() => downloadReceipt(payment, user)}
            >
              ⬇ Download Receipt
            </button>
          )}
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────
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

  // All currencies from summary
  const currencies = summary.map((s) => s.currency);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className={styles.title}>My Payments</h1>
      </div>

      {/* Summary cards */}
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

      {/* Filters */}
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
          <option value="paystack">Paystack</option>
          <option value="stripe">Stripe</option>
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
            ✕ Clear
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading payments…</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>⚠️ {error}</div>
      ) : payments.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>💳</p>
          <p className={styles.emptyTitle}>No payments found</p>
          <p className={styles.emptyHint}>Try changing the filters above</p>
        </div>
      ) : (
        <div className={styles.list}>
          {payments.map((p) => {
            const st = STATUS_STYLE[p.status] || STATUS_STYLE.pending;
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

      {/* Detail modal */}
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
