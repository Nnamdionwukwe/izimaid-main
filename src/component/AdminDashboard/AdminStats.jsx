import { useState, useEffect, useCallback } from "react";
import styles from "./AdminSettings.module.css";

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

function sym(c) {
  return CURRENCY_SYMBOLS[c] || (c ? `${c} ` : "₦");
}
function fmt(amount, cur) {
  return `${sym(cur)}${Number(amount || 0).toLocaleString()}`;
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}
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

// ── Reusable: table where every row has a currency column ─────────────
function CurrencyTable({ rows, columns }) {
  if (!rows?.length)
    return (
      <p style={{ color: "#aaa", fontSize: 13, padding: "12px 0" }}>No data</p>
    );
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>
            <th>Currency</th>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>
                <span
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1a1a2e",
                  }}
                >
                  {r.currency}
                </span>
                <span style={{ marginLeft: 4, fontSize: 11, color: "#aaa" }}>
                  {sym(r.currency)}
                </span>
              </td>
              {columns.map((c) => (
                <td key={c.key} className={c.bold ? styles.tdBold : ""}>
                  {c.fmt ? c.fmt(r[c.key], r.currency) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading stats...</div>;
  if (!stats) return <div className={styles.loading}>No data</div>;

  const {
    users,
    bookings,
    revenue,
    withdrawals,
    pending_approvals,
    active_sos,
    pending_docs,
    recent_bookings,
    top_maids,
  } = stats;

  const bookingStatuses = [
    "pending",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
    "declined",
  ];
  const maxBookings = Math.max(
    ...bookingStatuses.map((s) => Number(bookings[s] || 0)),
    1,
  );

  // Group withdrawals { currency → { status → { count, total } } }
  const wdByCurrency = {};
  for (const w of withdrawals || []) {
    if (!wdByCurrency[w.currency]) wdByCurrency[w.currency] = {};
    wdByCurrency[w.currency][w.status] = { count: w.count, total: w.total };
  }

  return (
    <>
      {/* Alert tiles */}
      {(Number(pending_approvals) > 0 ||
        Number(active_sos) > 0 ||
        Number(pending_docs) > 0) && (
        <div className={styles.statGrid} style={{ marginBottom: 20 }}>
          {Number(pending_approvals) > 0 && (
            <div className={`${styles.statCard} ${styles.dark}`}>
              <p className={styles.statLabel}>⏳ Pending Approvals</p>
              <p className={styles.statValue}>{pending_approvals}</p>
              <p
                className={styles.statSub}
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Awaiting review
              </p>
            </div>
          )}
          {Number(active_sos) > 0 && (
            <div
              className={styles.statCard}
              style={{ borderLeft: "3px solid rgb(187,19,47)" }}
            >
              <p className={styles.statLabel}>🚨 Active SOS</p>
              <p className={`${styles.statValue} ${styles.red}`}>
                {active_sos}
              </p>
            </div>
          )}
          {Number(pending_docs) > 0 && (
            <div className={styles.statCard}>
              <p className={styles.statLabel}>📄 Pending Docs</p>
              <p className={`${styles.statValue} ${styles.amber}`}>
                {pending_docs}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Revenue per currency */}
      <p className={styles.sectionTitle}>Revenue by Currency</p>
      <CurrencyTable
        rows={revenue}
        columns={[
          { key: "total_gross", label: "Gross Revenue", fmt: fmt, bold: true },
          { key: "total_platform_fee", label: "Platform Fees", fmt: fmt },
          { key: "total_maid_payout", label: "Maid Payouts", fmt: fmt },
          { key: "paid_count", label: "Paid Txns" },
          { key: "refunded_count", label: "Refunded" },
        ]}
      />

      {/* Users */}
      <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
        Users
      </p>
      <div className={styles.statGrid}>
        {["customer", "maid", "admin"].map((role) => (
          <div key={role} className={styles.statCard}>
            <p className={styles.statLabel}>
              {role.charAt(0).toUpperCase() + role.slice(1)}s
            </p>
            <p className={styles.statValue}>{users?.[role]?.total || 0}</p>
            <p className={styles.statSub}>
              {users?.[role]?.active || 0} active
            </p>
          </div>
        ))}
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Users</p>
          <p className={styles.statValue}>
            {Object.values(users || {})
              .reduce((a, v) => a + (v.total || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bookings bar chart */}
      <p className={styles.sectionTitle}>Bookings by Status</p>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.barChart}>
            {bookingStatuses.map((s) => {
              const count = Number(bookings[s] || 0);
              const pct = (count / maxBookings) * 100;
              const colorMap = {
                pending: "amber",
                confirmed: "blue",
                in_progress: "purple",
                completed: "green",
              };
              return (
                <div key={s} className={styles.barRow}>
                  <span className={styles.barLabel}>{s.replace("_", " ")}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${styles[colorMap[s]] || ""}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={styles.barVal}>
                    {count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7-day activity */}
      {recent_bookings?.length > 0 && (
        <>
          <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
            Last 7 Days
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bookings</th>
                  <th>Revenue (base currency)</th>
                </tr>
              </thead>
              <tbody>
                {recent_bookings.map((r) => (
                  <tr key={r.date}>
                    <td className={styles.tdBold}>{fmtDate(r.date)}</td>
                    <td>{Number(r.count).toLocaleString()}</td>
                    <td>{Number(r.revenue).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Top maids — earnings per currency */}
      {top_maids?.length > 0 && (
        <>
          <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
            Top 5 Maids
          </p>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {top_maids.map((m, i) => {
                // Deduplicate by currency (safety net for any backend duplicates)
                const earningMap = {};
                for (const e of m.earnings || []) {
                  if (e.currency && Number(e.total_earned) > 0) {
                    earningMap[e.currency] = Number(e.total_earned);
                  }
                }
                const earningsList = Object.entries(earningMap);
                return (
                  <div key={m.id} className={styles.maidRow}>
                    <span
                      className={`${styles.maidRank} ${i < 3 ? styles.top : ""}`}
                    >
                      {i + 1}
                    </span>
                    {m.avatar ? (
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className={styles.maidAvatar}
                      />
                    ) : (
                      <div className={styles.maidAvatarPlaceholder}>
                        {initials(m.name)}
                      </div>
                    )}
                    <div className={styles.maidInfo}>
                      <p className={styles.maidName}>{m.name}</p>
                      <p className={styles.maidSub}>
                        ⭐ {Number(m.rating || 0).toFixed(1)} ·{" "}
                        {m.completed_bookings} jobs
                      </p>
                      {/* Earnings pills inline under name */}
                      {earningsList.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                            marginTop: 5,
                          }}
                        >
                          {earningsList.map(([cur, total]) => (
                            <span
                              key={cur}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                                background: "rgb(209,247,224)",
                                color: "rgb(10,107,46)",
                                borderRadius: 20,
                                padding: "2px 8px",
                                fontSize: 11,
                                fontWeight: 600,
                                fontFamily: "DM Sans,sans-serif",
                              }}
                            >
                              <span style={{ opacity: 0.7, fontSize: 10 }}>
                                {cur}
                              </span>
                              {fmt(total, cur)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Withdrawals per currency */}
      {Object.keys(wdByCurrency).length > 0 && (
        <>
          <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
            Withdrawals by Currency
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Count</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(wdByCurrency).flatMap(([cur, statuses]) =>
                  Object.entries(statuses).map(([status, d]) => (
                    <tr key={`${cur}-${status}`}>
                      <td className={styles.tdBold}>
                        {cur}{" "}
                        <span style={{ color: "#aaa", fontWeight: 400 }}>
                          {sym(cur)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${status === "paid" ? styles.badgeGreen : status === "pending" ? styles.badgeAmber : styles.badgeGray}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>{Number(d.count).toLocaleString()}</td>
                      <td className={styles.tdBold}>{fmt(d.total, cur)}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

// ── Revenue Tab ───────────────────────────────────────────────────────
function RevenueTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [curFilter, setCurFilter] = useState("");

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ period });
      if (from) params.set("date_from", from);
      if (to) params.set("date_to", to);
      const res = await fetch(`${API_URL}/api/admin/revenue?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [period, from, to]);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const allCurrencies = [...new Set((data?.data || []).map((r) => r.currency))];
  const filtered = curFilter
    ? (data?.data || []).filter((r) => r.currency === curFilter)
    : data?.data || [];
  const totals = curFilter
    ? (data?.totals || []).filter((t) => t.currency === curFilter)
    : data?.totals || [];

  return (
    <>
      <div className={styles.dateBar}>
        {["daily", "weekly", "monthly"].map((p) => (
          <button
            key={p}
            style={{
              height: 38,
              padding: "0 14px",
              background: period === p ? "#1a1a2e" : "#fff",
              color: period === p ? "#fff" : "#444",
              border: "1px solid #e0ddd6",
              borderRadius: 8,
              fontFamily: "DM Sans,sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
        <input
          className={styles.dateInput}
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          className={styles.dateInput}
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button className={styles.applyBtn} onClick={fetchRevenue}>
          Apply
        </button>
        <select
          className={styles.selectFilter}
          value={curFilter}
          onChange={(e) => setCurFilter(e.target.value)}
        >
          <option value="">All currencies</option>
          {allCurrencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {totals.length > 0 && (
        <>
          <p className={styles.sectionTitle}>Totals</p>
          <CurrencyTable
            rows={totals}
            columns={[
              { key: "gross", label: "Gross Revenue", fmt: fmt, bold: true },
              { key: "fee", label: "Platform Fees", fmt: fmt },
              { key: "payouts", label: "Maid Payouts", fmt: fmt },
            ]}
          />
        </>
      )}

      {loading ? (
        <div className={styles.loading}>Loading revenue...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📊</div>
          <p className={styles.emptyText}>No revenue data</p>
        </div>
      ) : (
        <>
          <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
            Period Breakdown
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Currency</th>
                  <th>Txns</th>
                  <th>Gross</th>
                  <th>Fee</th>
                  <th>Payouts</th>
                  <th>Paystack</th>
                  <th>Stripe</th>
                  <th>Bank</th>
                  <th>Crypto</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i}>
                    <td className={styles.tdBold}>
                      {new Date(r.period).toLocaleDateString("en-NG", {
                        day: period === "daily" ? "numeric" : undefined,
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#1a1a2e" }}>
                        {r.currency}
                      </span>
                      <span
                        style={{ marginLeft: 4, color: "#aaa", fontSize: 11 }}
                      >
                        {sym(r.currency)}
                      </span>
                    </td>
                    <td>{Number(r.transactions).toLocaleString()}</td>
                    <td className={styles.tdBold}>
                      {fmt(r.gross_revenue, r.currency)}
                    </td>
                    <td>{fmt(r.platform_fee, r.currency)}</td>
                    <td>{fmt(r.maid_payouts, r.currency)}</td>
                    <td>{r.paystack_count}</td>
                    <td>{r.stripe_count}</td>
                    <td>{r.bank_count}</td>
                    <td>{r.crypto_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

// ── Financial Tab ─────────────────────────────────────────────────────
function FinancialTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/admin/financial`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!data) return <div className={styles.loading}>No data</div>;

  return (
    <>
      <p className={styles.sectionTitle}>Wallet Totals by Currency</p>
      <CurrencyTable
        rows={data.wallet_totals}
        columns={[
          { key: "total_available", label: "Available", fmt: fmt, bold: true },
          { key: "total_pending", label: "Pending", fmt: fmt },
          { key: "total_earned", label: "Total Earned", fmt: fmt },
          { key: "total_withdrawn", label: "Withdrawn", fmt: fmt },
          { key: "maid_count", label: "Maids" },
        ]}
      />

      <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
        Payments by Currency & Gateway
      </p>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Gateway</th>
              <th>Status</th>
              <th>Count</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.payments?.map((r, i) => (
              <tr key={i}>
                <td className={styles.tdBold}>
                  {r.currency}{" "}
                  <span
                    style={{ color: "#aaa", fontWeight: 400, fontSize: 11 }}
                  >
                    {sym(r.currency)}
                  </span>
                </td>
                <td>{r.gateway}</td>
                <td>
                  <span
                    className={`${styles.badge} ${r.status === "success" ? styles.badgeGreen : r.status === "refunded" ? styles.badgePurple : styles.badgeGray}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{Number(r.count).toLocaleString()}</td>
                <td className={styles.tdBold}>{fmt(r.total, r.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
        Maid Payouts by Currency
      </p>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Status</th>
              <th>Count</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.payouts?.map((r, i) => (
              <tr key={i}>
                <td className={styles.tdBold}>
                  {r.currency}{" "}
                  <span
                    style={{ color: "#aaa", fontWeight: 400, fontSize: 11 }}
                  >
                    {sym(r.currency)}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${r.status === "paid" ? styles.badgeGreen : r.status === "escrow" ? styles.badgeAmber : styles.badgeGray}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{Number(r.count).toLocaleString()}</td>
                <td className={styles.tdBold}>{fmt(r.total, r.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
        Withdrawals by Currency & Method
      </p>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Method</th>
              <th>Status</th>
              <th>Count</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.withdrawals?.map((r, i) => (
              <tr key={i}>
                <td className={styles.tdBold}>
                  {r.currency}{" "}
                  <span
                    style={{ color: "#aaa", fontWeight: 400, fontSize: 11 }}
                  >
                    {sym(r.currency)}
                  </span>
                </td>
                <td>{r.method?.replace(/_/g, " ")}</td>
                <td>
                  <span
                    className={`${styles.badge} ${r.status === "paid" ? styles.badgeGreen : r.status === "pending" ? styles.badgeAmber : styles.badgeGray}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{Number(r.count).toLocaleString()}</td>
                <td>{fmt(r.total, r.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function AdminStats({ onBack }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Analytics</h1>
          </div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
        <div className={styles.tabBar}>
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "revenue", label: "💰 Revenue" },
            { id: "financial", label: "🏦 Financial" },
          ].map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "revenue" && <RevenueTab />}
        {activeTab === "financial" && <FinancialTab />}
      </div>
    </div>
  );
}
