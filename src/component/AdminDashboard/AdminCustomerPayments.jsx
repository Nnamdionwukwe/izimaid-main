import { useState, useEffect, useCallback } from "react";
import styles from "./Payments.module.css";

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
  JPY: "¥",
};

function fmt(amount, currency) {
  const s = CURRENCY_SYMBOLS[currency] || (currency ? `${currency} ` : "");
  return `${s}${Number(amount || 0).toLocaleString()}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const GATEWAY_LABELS = {
  paystack: "Paystack",
  stripe: "Stripe",
  bank_transfer: "Bank Transfer",
  crypto: "Crypto",
};

const STATUS_BADGE = {
  success: styles.badgeSuccess,
  pending: styles.badgePending,
  failed: styles.badgeFailed,
  refunded: styles.badgeRefunded,
};

export default function AdminCustomerPayments({ onBack }) {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [gateway, setGateway] = useState("");
  const [status, setStatus] = useState("");
  const [currency, setCurrency] = useState("");

  const LIMIT = 20;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (gateway) params.set("gateway", gateway);
      if (status) params.set("status", status);
      if (currency) params.set("currency", currency);

      const res = await fetch(`${API_URL}/api/payments/my?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPayments(data.payments || []);
      setSummary(data.summary || []);
      setHasMore((data.payments || []).length === LIMIT);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, gateway, status, currency]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);
  useEffect(() => {
    setPage(1);
  }, [gateway, status, currency]);

  // All unique currencies from payments for the currency filter
  const allCurrencies = [
    ...new Set(payments.map((p) => p.currency).filter(Boolean)),
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>My Payments</h1>
          </div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* Multi-currency summary cards */}
        {summary.length > 0 && (
          <>
            <p className={styles.sectionTitle}>
              Total Spent
              <span className={styles.sectionCount}>
                {summary.length}{" "}
                {summary.length === 1 ? "currency" : "currencies"}
              </span>
            </p>
            <div className={styles.summaryGrid}>
              {summary.map((s) => (
                <div key={s.currency} className={styles.summaryCard}>
                  <p className={styles.summaryLabel}>
                    {s.currency}{" "}
                    <span className={styles.summaryCurrency}>
                      {CURRENCY_SYMBOLS[s.currency] || ""}
                    </span>
                  </p>
                  <p className={styles.summaryValue}>
                    {fmt(s.total_paid, s.currency)}
                  </p>
                  <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>
                    {s.count} payment{Number(s.count) !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Filters */}
        <div className={styles.filterBar}>
          <button
            className={`${styles.filterBtn} ${!gateway && !status && !currency ? styles.filterBtnActive : ""}`}
            onClick={() => {
              setGateway("");
              setStatus("");
              setCurrency("");
            }}
          >
            All
          </button>
          {["paystack", "stripe", "bank_transfer", "crypto"].map((g) => (
            <button
              key={g}
              className={`${styles.filterBtn} ${gateway === g ? styles.filterBtnActive : ""}`}
              onClick={() => setGateway(gateway === g ? "" : g)}
            >
              {GATEWAY_LABELS[g]}
            </button>
          ))}
          {["success", "pending", "failed", "refunded"].map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${status === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatus(status === s ? "" : s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          {allCurrencies.map((c) => (
            <button
              key={c}
              className={`${styles.filterBtn} ${currency === c ? styles.filterBtnActive : ""}`}
              onClick={() => setCurrency(currency === c ? "" : c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* List */}
        <p className={styles.sectionTitle}>
          Payment History
          <span className={styles.sectionCount}>{payments.length}</span>
        </p>

        {loading ? (
          <div className={styles.loading}>Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>💳</div>
            <p className={styles.emptyText}>No payments found</p>
          </div>
        ) : (
          <>
            <div className={styles.payList}>
              {payments.map((p) => (
                <div key={p.id} className={styles.payItem}>
                  <div className={styles.payItemTop}>
                    <div>
                      <p className={styles.payItemMaid}>{p.maid_name}</p>
                      <p className={styles.payItemDate}>
                        {p.paid_at
                          ? formatDate(p.paid_at)
                          : formatDate(p.created_at)}
                      </p>
                    </div>
                    <div className={styles.payItemRight}>
                      <p className={styles.payItemAmount}>
                        {fmt(p.amount, p.currency)}
                      </p>
                      <p className={styles.payItemCurrency}>{p.currency}</p>
                    </div>
                  </div>

                  <div className={styles.payItemMeta}>
                    {/* Status badge */}
                    <span
                      className={`${styles.badge} ${STATUS_BADGE[p.status] || styles.badgePending}`}
                    >
                      {p.status}
                    </span>
                    {/* Gateway badge */}
                    {p.gateway && (
                      <span
                        className={`${styles.badge} ${styles.badgeGateway}`}
                      >
                        {GATEWAY_LABELS[p.gateway] || p.gateway}
                      </span>
                    )}
                    {/* Service date */}
                    {p.service_date && (
                      <span className={styles.metaTag}>
                        📅 {formatDate(p.service_date)}
                      </span>
                    )}
                    {/* Duration */}
                    {p.duration_hours && (
                      <span className={styles.metaTag}>
                        ⏱ {p.duration_hours}h
                      </span>
                    )}
                    {/* Address snippet */}
                    {p.address && (
                      <span className={styles.metaTag}>
                        📍 {p.address.split(",")[0]}
                      </span>
                    )}
                    {/* Reference */}
                    {(p.paystack_reference ||
                      p.stripe_payment_id ||
                      p.bank_transfer_ref) && (
                      <span className={styles.metaTag}>
                        #
                        {(
                          p.paystack_reference ||
                          p.stripe_payment_id ||
                          p.bank_transfer_ref
                        ).slice(-8)}
                      </span>
                    )}
                  </div>

                  {/* Booking status */}
                  {p.booking_status && p.booking_status !== "completed" && (
                    <div
                      style={{
                        padding: "6px 16px 12px",
                        fontSize: 12,
                        color: "#888",
                      }}
                    >
                      Booking:{" "}
                      <strong style={{ color: "#1a1a2e" }}>
                        {p.booking_status.replace("_", " ")}
                      </strong>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {(page > 1 || hasMore) && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className={styles.pageInfo}>Page {page}</span>
                <button
                  className={styles.pageBtn}
                  disabled={!hasMore}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
