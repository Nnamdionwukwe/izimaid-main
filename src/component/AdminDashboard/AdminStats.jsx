import { useState, useEffect, useCallback } from "react";
import styles from "./AdminPages.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const SYM = { NGN: "₦", USD: "$", GBP: "£", EUR: "€", GHS: "₵", KES: "KSh" };
function fmt(n, cur) {
  const s = SYM[cur] || "₦";
  return `${s}${Number(n || 0).toLocaleString()}`;
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
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
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

  // Booking bar chart
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

  // Withdrawal summary
  const withdrawalMap = Object.fromEntries(
    (withdrawals || []).map((w) => [
      w.status,
      { count: w.count, total: w.total },
    ]),
  );

  // Recent 7-day sparkline text
  const maxRev = Math.max(
    ...(recent_bookings || []).map((r) => Number(r.revenue)),
    1,
  );

  return (
    <>
      {/* Alert tiles */}
      {(pending_approvals > 0 || active_sos > 0 || pending_docs > 0) && (
        <div className={styles.statGrid} style={{ marginBottom: 20 }}>
          {pending_approvals > 0 && (
            <div className={`${styles.statCard} ${styles.dark}`}>
              <p className={styles.statLabel}>⏳ Pending Approvals</p>
              <p className={`${styles.statValue}`}>{pending_approvals}</p>
              <p
                className={styles.statSub}
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Bookings awaiting you
              </p>
            </div>
          )}
          {active_sos > 0 && (
            <div
              className={`${styles.statCard}`}
              style={{ borderLeft: "3px solid rgb(187,19,47)" }}
            >
              <p className={styles.statLabel}>🚨 Active SOS</p>
              <p className={`${styles.statValue} ${styles.red}`}>
                {active_sos}
              </p>
              <p className={styles.statSub}>Needs immediate attention</p>
            </div>
          )}
          {pending_docs > 0 && (
            <div className={styles.statCard}>
              <p className={styles.statLabel}>📄 Pending Docs</p>
              <p className={`${styles.statValue} ${styles.amber}`}>
                {pending_docs}
              </p>
              <p className={styles.statSub}>Maid documents to review</p>
            </div>
          )}
        </div>
      )}

      {/* Revenue */}
      <p className={styles.sectionTitle}>Revenue</p>
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Gross Revenue</p>
          <p className={`${styles.statValue} ${styles.green}`}>
            {fmt(revenue?.total_gross)}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Platform Fees</p>
          <p className={`${styles.statValue} ${styles.blue}`}>
            {fmt(revenue?.total_platform_fee)}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Maid Payouts</p>
          <p className={styles.statValue}>{fmt(revenue?.total_maid_payout)}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Paid Transactions</p>
          <p className={styles.statValue}>
            {Number(revenue?.paid_count || 0).toLocaleString()}
          </p>
          <p className={styles.statSub}>
            {Number(revenue?.refunded_count || 0)} refunded
          </p>
        </div>
      </div>

      {/* Users */}
      <p className={styles.sectionTitle}>Users</p>
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Customers</p>
          <p className={styles.statValue}>{users?.customer?.total || 0}</p>
          <p className={styles.statSub}>
            {users?.customer?.active || 0} active
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Maids</p>
          <p className={`${styles.statValue} ${styles.blue}`}>
            {users?.maid?.total || 0}
          </p>
          <p className={styles.statSub}>{users?.maid?.active || 0} active</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Admins</p>
          <p className={styles.statValue}>{users?.admin?.total || 0}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Users</p>
          <p className={styles.statValue}>
            {(
              (users?.customer?.total || 0) +
              (users?.maid?.total || 0) +
              (users?.admin?.total || 0)
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bookings by status */}
      <p className={styles.sectionTitle}>Bookings by Status</p>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.barChart}>
            {bookingStatuses.map((s) => {
              const count = Number(bookings[s] || 0);
              const pct = maxBookings > 0 ? (count / maxBookings) * 100 : 0;
              const colorMap = {
                pending: "amber",
                confirmed: "blue",
                in_progress: "purple",
                completed: "green",
                cancelled: "",
                declined: "",
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
          <p className={styles.sectionTitle}>Last 7 Days</p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                  <th>Bar</th>
                </tr>
              </thead>
              <tbody>
                {recent_bookings.map((r) => (
                  <tr key={r.date}>
                    <td className={styles.tdBold}>{fmtDate(r.date)}</td>
                    <td>{Number(r.count).toLocaleString()}</td>
                    <td className={styles.tdBold}>{fmt(r.revenue)}</td>
                    <td>
                      <div
                        className={styles.barTrack}
                        style={{ height: 10, width: 80 }}
                      >
                        <div
                          className={`${styles.barFill} ${styles.green}`}
                          style={{
                            width: `${(Number(r.revenue) / maxRev) * 100}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Top maids */}
      {top_maids?.length > 0 && (
        <>
          <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
            Top 5 Maids by Earnings
          </p>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {top_maids.map((m, i) => (
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
                  </div>
                  <span className={styles.maidEarning}>
                    {fmt(m.total_earned)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Withdrawals */}
      <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
        Withdrawals
      </p>
      <div className={styles.statGrid}>
        {["pending", "processing", "paid", "rejected", "failed"].map((s) => (
          <div key={s} className={styles.statCard}>
            <p className={styles.statLabel}>{s}</p>
            <p className={styles.statValue}>
              {Number(withdrawalMap[s]?.count || 0)}
            </p>
            <p className={styles.statSub}>
              {fmt(withdrawalMap[s]?.total || 0)}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Revenue Tab ───────────────────────────────────────────────────────────────
function RevenueTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

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

  const maxGross = Math.max(
    ...(data?.data || []).map((r) => Number(r.gross_revenue)),
    1,
  );

  return (
    <>
      <div className={styles.dateBar}>
        {["daily", "weekly", "monthly"].map((p) => (
          <button
            key={p}
            className={styles.applyBtn}
            style={{
              background: period === p ? "#1a1a2e" : "#fff",
              color: period === p ? "#fff" : "#444",
              border: "1px solid #e0ddd6",
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
          placeholder="From"
        />
        <input
          className={styles.dateInput}
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
        />
        <button className={styles.applyBtn} onClick={fetchRevenue}>
          Apply
        </button>
      </div>

      {data?.totals && (
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Gross Revenue</p>
            <p className={`${styles.statValue} ${styles.green}`}>
              {fmt(data.totals.gross)}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Platform Fees</p>
            <p className={`${styles.statValue} ${styles.blue}`}>
              {fmt(data.totals.fee)}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Maid Payouts</p>
            <p className={styles.statValue}>{fmt(data.totals.payouts)}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Periods</p>
            <p className={styles.statValue}>{data.data?.length || 0}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading revenue...</div>
      ) : !data?.data?.length ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📊</div>
          <p className={styles.emptyText}>No revenue data for this period</p>
        </div>
      ) : (
        <>
          {/* Bar chart */}
          <p className={styles.sectionTitle}>Revenue by Period</p>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.barChart}>
                {data.data.map((r, i) => {
                  const pct = (Number(r.gross_revenue) / maxGross) * 100;
                  const label =
                    period === "daily"
                      ? fmtDate(r.period)
                      : new Date(r.period).toLocaleDateString("en-NG", {
                          month: "short",
                          year: period === "monthly" ? "numeric" : undefined,
                        });
                  return (
                    <div key={i} className={styles.barRow}>
                      <span className={styles.barLabel}>{label}</span>
                      <div className={styles.barTrack}>
                        <div
                          className={`${styles.barFill} ${styles.green}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={styles.barVal}>
                        {fmt(r.gross_revenue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableWrap} style={{ marginTop: 16 }}>
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Transactions</th>
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
                {data.data.map((r, i) => (
                  <tr key={i}>
                    <td className={styles.tdBold}>
                      {new Date(r.period).toLocaleDateString("en-NG", {
                        day: period === "daily" ? "numeric" : undefined,
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>{Number(r.transactions).toLocaleString()}</td>
                    <td className={styles.tdBold}>{fmt(r.gross_revenue)}</td>
                    <td>{fmt(r.platform_fee)}</td>
                    <td>{fmt(r.maid_payouts)}</td>
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

// ── Financial Tab ─────────────────────────────────────────────────────────────
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

  if (loading)
    return <div className={styles.loading}>Loading financial overview...</div>;
  if (!data) return <div className={styles.loading}>No data</div>;

  return (
    <>
      {/* Wallet totals */}
      <p className={styles.sectionTitle}>Platform Wallet Totals</p>
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Available Balance</p>
          <p className={`${styles.statValue} ${styles.green}`}>
            {fmt(data.wallet_totals?.total_available)}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Pending Balance</p>
          <p className={`${styles.statValue} ${styles.amber}`}>
            {fmt(data.wallet_totals?.total_pending)}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Earned (all maids)</p>
          <p className={`${styles.statValue} ${styles.blue}`}>
            {fmt(data.wallet_totals?.total_earned)}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Withdrawn</p>
          <p className={styles.statValue}>
            {fmt(data.wallet_totals?.total_withdrawn)}
          </p>
        </div>
      </div>

      {/* Payments by gateway */}
      <p className={styles.sectionTitle}>Payments by Gateway & Status</p>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Gateway</th>
              <th>Status</th>
              <th>Count</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.payments?.map((r, i) => (
              <tr key={i}>
                <td className={styles.tdBold}>{r.gateway}</td>
                <td>
                  <span
                    className={`${styles.badge} ${r.status === "success" ? styles.badgeGreen : r.status === "refunded" ? styles.badgePurple : styles.badgeGray}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{Number(r.count).toLocaleString()}</td>
                <td className={styles.tdBold}>{fmt(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payouts */}
      <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
        Maid Payouts
      </p>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.payouts?.map((r, i) => (
              <tr key={i}>
                <td>
                  <span
                    className={`${styles.badge} ${r.status === "paid" ? styles.badgeGreen : r.status === "escrow" ? styles.badgeAmber : styles.badgeGray}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{Number(r.count).toLocaleString()}</td>
                <td className={styles.tdBold}>{fmt(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Withdrawals */}
      <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
        Withdrawals by Method
      </p>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
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
                  {r.method?.replace(/_/g, " ")}
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${r.status === "paid" ? styles.badgeGreen : r.status === "pending" ? styles.badgeAmber : styles.badgeGray}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{Number(r.count).toLocaleString()}</td>
                <td>{fmt(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Main AdminStats ───────────────────────────────────────────────────────────
export default function AdminStats({ onBack }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "revenue", label: "💰 Revenue" },
    { id: "financial", label: "🏦 Financial" },
  ];

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
          {tabs.map((t) => (
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
