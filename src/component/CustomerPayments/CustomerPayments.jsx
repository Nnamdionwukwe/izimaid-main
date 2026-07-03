// src/component/Payment/CustomerPayments.jsx – Flutterwave label updates
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CustomerPayments.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CURRENCY_SYMBOLS = {
  /* ... same ... */
};
function sym(c) {
  /* ... same ... */
}
function fmt(n, c) {
  /* ... same ... */
}
function fmtDate(d) {
  /* ... same ... */
}

// ── Updated gateway helpers ──────────────────────────────────────────
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
      flutterwave: "💳",
      bank_transfer: "🏦",
      crypto: "🪙",
    }[g] || "💳"
  );
}

const STATUS_STYLE = {
  /* ... same ... */
};
function initials(name) {
  /* ... same ... */
}
function downloadReceipt(payment, user) {
  /* ... same ... */
}
function PaymentDetail({ payment, user, onClose }) {
  /* ... same ... */
}

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
          ← Back
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
            ✕ Clear
          </button>
        )}
      </div>

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
