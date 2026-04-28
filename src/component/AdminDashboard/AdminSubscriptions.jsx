import { useState, useEffect, useCallback } from "react";
import styles from "./AdminSubscriptions.module.css";

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
  return CURRENCY_SYMBOLS[c] || (c ? `${c} ` : "$");
}
function fmt(amount, cur) {
  return `${sym(cur)}${Number(amount || 0).toLocaleString()}`;
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_BADGE = {
  active: styles.badgeActive,
  trialing: styles.badgeTrialing,
  past_due: styles.badgePastDue,
  cancelled: styles.badgeCancelled,
  paused: styles.badgePaused,
};

const GATEWAY_BADGE = {
  stripe: styles.badgeStripe,
  paystack: styles.badgePaystack,
  manual: styles.badgeManual,
};

// ── Analytics Tab ─────────────────────────────────────────────────────────────
function AnalyticsTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/subscriptions/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className={styles.loading}>Loading analytics...</div>;
  if (!data) return <div className={styles.loading}>No data</div>;

  const { mrr, plan_breakdown, churn_rate_30d, recent_signups, invoice_stats } =
    data;

  const maxCount = Math.max(
    ...(plan_breakdown || []).map((r) => Number(r.count)),
    1,
  );

  return (
    <>
      {/* MRR Stats */}
      <p className={styles.sectionTitle}>Revenue & Subscribers</p>
      <div className={styles.statGrid}>
        <div className={`${styles.statCard} ${styles.dark}`}>
          <p className={styles.statLabel}>Monthly Revenue (MRR)</p>
          <p className={styles.statValue}>{fmt(mrr?.mrr || 0, "USD")}</p>
          <p className={styles.statSub}>
            Trial MRR: {fmt(mrr?.trial_mrr || 0, "USD")}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Active Subscribers</p>
          <p className={`${styles.statValue} ${styles.green}`}>
            {Number(mrr?.active_count || 0).toLocaleString()}
          </p>
          <p className={styles.statSub}>
            {Number(mrr?.trial_count || 0)} in trial
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Churn Rate (30d)</p>
          <p className={`${styles.statValue} ${styles.amber}`}>
            {churn_rate_30d}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Past Due</p>
          <p className={`${styles.statValue} ${styles.red}`}>
            {Number(mrr?.past_due_count || 0)}
          </p>
          <p className={styles.statSub}>
            {Number(mrr?.cancelled_count || 0)} cancelled total
          </p>
        </div>
      </div>

      {/* Plan breakdown */}
      <p className={styles.sectionTitle}>Plans & Status</p>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.barChart}>
            {(plan_breakdown || []).map((r, i) => {
              const pct = (Number(r.count) / maxCount) * 100;
              const colorMap = { active: "green", trialing: "blue" };
              return (
                <div key={i} className={styles.barRow}>
                  <span className={styles.barLabel}>
                    {r.display_name} ({r.status})
                  </span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${styles[colorMap[r.status]] || ""}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={styles.barVal}>
                    {Number(r.count).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Invoice stats */}
      {invoice_stats?.length > 0 && (
        <>
          <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
            Invoices (Last 30 Days)
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
                {invoice_stats.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <span
                        className={`${styles.badge} ${r.status === "paid" ? styles.badgeActive : styles.badgePastDue}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>{Number(r.count).toLocaleString()}</td>
                    <td className={styles.tdBold}>{fmt(r.total, "USD")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Recent signups */}
      {recent_signups?.length > 0 && (
        <>
          <p className={styles.sectionTitle} style={{ marginTop: 20 }}>
            New Subscribers (30 Days)
          </p>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>New Subs</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {recent_signups.map((r, i) => (
                  <tr key={i}>
                    <td className={styles.tdBold}>{fmtDate(r.date)}</td>
                    <td>{Number(r.count).toLocaleString()}</td>
                    <td>{fmt(r.revenue, "USD")}</td>
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

// ── Subscriptions Tab ─────────────────────────────────────────────────────────
function SubscriptionsTab() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showGrant, setShowGrant] = useState(false);
  const [plans, setPlans] = useState([]);
  const [grantForm, setGrantForm] = useState({
    user_id: "",
    plan_id: "",
    months: "1",
    reason: "",
  });
  const [granting, setGranting] = useState(false);
  const [grantMsg, setGrantMsg] = useState(null);
  const LIMIT = 20;

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (status) params.set("status", status);
      if (planFilter) params.set("plan_name", planFilter);
      const res = await fetch(`${API_URL}/api/subscriptions/admin?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSubs(data.subscriptions || []);
      setHasMore((data.subscriptions || []).length === LIMIT);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, status, planFilter]);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);
  useEffect(() => {
    setPage(1);
  }, [status, planFilter]);

  // Load plans for grant dropdown
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/subscriptions/plans?role=maid`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []))
      .catch(console.error);
  }, []);

  const filtered = subs.filter(
    (s) =>
      !search ||
      s.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user_email?.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleGrant() {
    if (!grantForm.user_id || !grantForm.plan_id) {
      setGrantMsg({ type: "error", text: "User ID and plan are required" });
      return;
    }
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(grantForm.user_id)) {
      setGrantMsg({ type: "error", text: "User ID must be a valid UUID" });
      return;
    }
    setGranting(true);
    setGrantMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/subscriptions/admin/grant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...grantForm,
          months: Number(grantForm.months),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGrantMsg({ type: "success", text: `✓ ${data.message}` });
      setGrantForm({ user_id: "", plan_id: "", months: "1", reason: "" });
      fetchSubs();
    } catch (err) {
      setGrantMsg({ type: "error", text: err.message });
    } finally {
      setGranting(false);
    }
  }

  return (
    <>
      {/* Grant subscription */}
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <p className={styles.cardTitle}>Grant Subscription</p>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ height: 34, fontSize: 12, padding: "0 14px" }}
            onClick={() => setShowGrant((s) => !s)}
          >
            {showGrant ? "Collapse ↑" : "Grant to User ↓"}
          </button>
        </div>
        {showGrant && (
          <div className={styles.cardBody}>
            {grantMsg && (
              <div
                className={`${styles.feedback} ${grantMsg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
              >
                {grantMsg.text}
              </div>
            )}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>User ID (UUID)</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Paste user UUID from Users page..."
                  value={grantForm.user_id}
                  onChange={(e) =>
                    setGrantForm((f) => ({ ...f, user_id: e.target.value }))
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Plan</label>
                <select
                  className={styles.formSelect}
                  value={grantForm.plan_id}
                  onChange={(e) =>
                    setGrantForm((f) => ({ ...f, plan_id: e.target.value }))
                  }
                >
                  <option value="">Select plan...</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.display_name} ({p.name})
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Duration (months)</label>
                <input
                  className={styles.formInput}
                  type="number"
                  min="1"
                  max="24"
                  value={grantForm.months}
                  onChange={(e) =>
                    setGrantForm((f) => ({ ...f, months: e.target.value }))
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Reason (optional)</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="e.g. Partner promo, bug compensation..."
                  value={grantForm.reason}
                  onChange={(e) =>
                    setGrantForm((f) => ({ ...f, reason: e.target.value }))
                  }
                />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={handleGrant}
                disabled={granting}
              >
                {granting ? "Granting..." : "✓ Grant Subscription"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.selectFilter}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {["active", "trialing", "past_due", "paused", "cancelled"].map(
            (s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ),
          )}
        </select>
      </div>

      <p className={styles.sectionTitle}>
        All Subscriptions
        <span className={styles.sectionCount}>{filtered.length}</span>
      </p>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyText}>No subscriptions found</p>
        </div>
      ) : (
        <>
          <div className={styles.subList}>
            {filtered.map((s) => (
              <div key={s.id} className={styles.subCard}>
                <div className={styles.subCardTop}>
                  <div>
                    <p className={styles.subCardName}>{s.user_name}</p>
                    <p className={styles.subCardEmail}>{s.user_email}</p>
                    <p
                      className={styles.subCardEmail}
                      style={{ color: "#bbb", fontSize: 11, marginTop: 2 }}
                    >
                      {s.user_role}
                    </p>
                  </div>
                  <div className={styles.subCardRight}>
                    <p className={styles.subCardPlan}>{s.plan_display_name}</p>
                    <p className={styles.subCardAmount}>
                      {s.amount > 0 ? fmt(s.amount, s.currency) : "Free"} /{" "}
                      {s.interval}
                    </p>
                  </div>
                </div>
                <div className={styles.subCardMeta}>
                  <span
                    className={`${styles.badge} ${STATUS_BADGE[s.status] || styles.badgeCancelled}`}
                  >
                    {s.status.replace("_", " ")}
                  </span>
                  <span
                    className={`${styles.badge} ${GATEWAY_BADGE[s.gateway] || styles.badgeManual}`}
                  >
                    {s.gateway}
                  </span>
                  {s.badge && (
                    <span className={styles.metaTag}>🏅 {s.badge}</span>
                  )}
                  <span className={styles.metaTag}>
                    📅 Ends {fmtDate(s.current_period_end)}
                  </span>
                  {s.cancel_at_period_end && (
                    <span className={`${styles.badge} ${styles.badgePastDue}`}>
                      Cancels at period end
                    </span>
                  )}
                  {s.trial_end && (
                    <span className={styles.metaTag}>
                      Trial until {fmtDate(s.trial_end)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

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
    </>
  );
}

// ── Plans Tab ─────────────────────────────────────────────────────────────────
function PlansTab() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [msg, setMsg] = useState(null);

  const [form, setForm] = useState({
    name: "",
    display_name: "",
    description: "",
    target_role: "customer",
    plan_type: "recurring",
    interval: "monthly",
    prices: '{"NGN":5000,"USD":5}',
    features: '["Feature 1","Feature 2"]',
    bookings_per_month: "",
    discount_percent: "0",
    badge: "",
    trial_days: "0",
    sort_order: "0",
    priority_matching: false,
    dedicated_support: false,
  });
  const [creating, setCreating] = useState(false);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/subscriptions/plans?role=customer`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  async function handleToggle(planId) {
    setToggling(planId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/subscriptions/admin/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "toggle", plan_id: planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPlans((prev) =>
        prev.map((p) =>
          p.id === planId ? { ...p, is_active: data.plan.is_active } : p,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(null);
    }
  }

  async function handleCreate() {
    if (!form.name || !form.display_name) {
      setMsg({ type: "error", text: "Name and display name are required" });
      return;
    }
    let prices, features;
    try {
      prices = JSON.parse(form.prices);
    } catch {
      setMsg({
        type: "error",
        text: 'Prices must be valid JSON e.g. {"NGN":5000,"USD":5}',
      });
      return;
    }
    try {
      features = JSON.parse(form.features);
    } catch {
      setMsg({ type: "error", text: "Features must be valid JSON array" });
      return;
    }

    setCreating(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/subscriptions/admin/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "create",
          ...form,
          prices,
          features,
          bookings_per_month: form.bookings_per_month
            ? Number(form.bookings_per_month)
            : null,
          discount_percent: Number(form.discount_percent),
          trial_days: Number(form.trial_days),
          sort_order: Number(form.sort_order),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({
        type: "success",
        text: `✓ Plan "${data.plan.display_name}" created`,
      });
      setShowCreate(false);
      fetchPlans();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setCreating(false);
    }
  }

  function setF(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const CURRENCIES_SHORT = [
    "NGN",
    "USD",
    "GBP",
    "EUR",
    "GHS",
    "KES",
    "ZAR",
    "CAD",
    "AUD",
  ];

  return (
    <>
      {msg && (
        <div
          className={`${styles.feedback} ${msg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
        >
          {msg.text}
        </div>
      )}

      {/* Create plan */}
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <p className={styles.cardTitle}>Subscription Plans</p>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ height: 34, fontSize: 12, padding: "0 14px" }}
            onClick={() => setShowCreate((s) => !s)}
          >
            {showCreate ? "Cancel" : "+ New Plan"}
          </button>
        </div>

        {showCreate && (
          <div className={styles.cardBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Internal Name (slug)</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="e.g. pro_monthly"
                  value={form.name}
                  onChange={(e) => setF("name", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Display Name</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="e.g. Pro Monthly"
                  value={form.display_name}
                  onChange={(e) => setF("display_name", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Target Role</label>
                <select
                  className={styles.formSelect}
                  value={form.target_role}
                  onChange={(e) => setF("target_role", e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="maid">Maid</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Interval</label>
                <select
                  className={styles.formSelect}
                  value={form.interval}
                  onChange={(e) => setF("interval", e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="one_time">One-time</option>
                </select>
              </div>
              <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.formLabel}>
                  Prices (JSON) — one key per currency
                  <span
                    style={{ marginLeft: 4, color: "#bbb", fontWeight: 400 }}
                  >
                    e.g. {`{"NGN":5000,"USD":5,"GBP":4}`}
                  </span>
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={form.prices}
                  onChange={(e) => setF("prices", e.target.value)}
                />
              </div>
              <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.formLabel}>
                  Features (JSON array)
                  <span
                    style={{ marginLeft: 4, color: "#bbb", fontWeight: 400 }}
                  >
                    e.g. ["Priority matching","Dedicated support"]
                  </span>
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={form.features}
                  onChange={(e) => setF("features", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Bookings/month (blank = unlimited)
                </label>
                <input
                  className={styles.formInput}
                  type="number"
                  min="0"
                  placeholder="e.g. 10"
                  value={form.bookings_per_month}
                  onChange={(e) => setF("bookings_per_month", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Discount % for maids</label>
                <input
                  className={styles.formInput}
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount_percent}
                  onChange={(e) => setF("discount_percent", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Badge text (optional)
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="e.g. ✓ Pro"
                  value={form.badge}
                  onChange={(e) => setF("badge", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Trial days</label>
                <input
                  className={styles.formInput}
                  type="number"
                  min="0"
                  value={form.trial_days}
                  onChange={(e) => setF("trial_days", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Short description..."
                  value={form.description}
                  onChange={(e) => setF("description", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Sort order</label>
                <input
                  className={styles.formInput}
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) => setF("sort_order", e.target.value)}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.priority_matching}
                  onChange={(e) => setF("priority_matching", e.target.checked)}
                />
                Priority Matching
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.dedicated_support}
                  onChange={(e) => setF("dedicated_support", e.target.checked)}
                />
                Dedicated Support
              </label>
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Plan"}
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading plans...</div>
      ) : (
        <div className={styles.planGrid}>
          {plans.map((p) => (
            <div key={p.id} className={styles.planCard}>
              <div className={styles.planCardTop}>
                <div>
                  <p className={styles.planCardName}>{p.display_name}</p>
                  <p className={styles.planCardDesc}>
                    {p.name} · {p.interval} · {p.target_role}
                  </p>
                  {p.description && (
                    <p className={styles.planCardDesc} style={{ marginTop: 4 }}>
                      {p.description}
                    </p>
                  )}
                  {p.trial_days > 0 && (
                    <span
                      className={`${styles.badge} ${styles.badgeTrialing}`}
                      style={{ display: "inline-block", marginTop: 6 }}
                    >
                      {p.trial_days}-day trial
                    </span>
                  )}
                </div>
                <div className={styles.planCardRight}>
                  <span
                    className={`${styles.badge} ${p.is_active ? styles.badgeOn : styles.badgeOff}`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                  {/* Prices per currency */}
                  <div className={styles.planPrices}>
                    {Object.entries(p.prices || {}).map(([cur, price]) => (
                      <span key={cur} className={styles.planPricePill}>
                        {sym(cur)}
                        {Number(price).toLocaleString()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Features */}
              {p.features?.length > 0 && (
                <div
                  style={{
                    padding: "0 16px 10px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                  }}
                >
                  {p.features.slice(0, 4).map((f, i) => (
                    <span key={i} className={styles.metaTag}>
                      ✓ {f}
                    </span>
                  ))}
                  {p.features.length > 4 && (
                    <span className={styles.metaTag}>
                      +{p.features.length - 4} more
                    </span>
                  )}
                </div>
              )}
              <div className={styles.planCardActions}>
                <button
                  className={`${styles.btnSm} ${p.is_active ? styles.btnSmDanger : styles.btnSmGreen}`}
                  disabled={toggling === p.id}
                  onClick={() => handleToggle(p.id)}
                >
                  {toggling === p.id
                    ? "..."
                    : p.is_active
                      ? "Deactivate"
                      : "Activate"}
                </button>
                {p.badge && (
                  <span className={styles.metaTag}>🏅 {p.badge}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Promo Codes Tab ───────────────────────────────────────────────────────────
function PromoCodesTab() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [toggling, setToggling] = useState(null);
  const [msg, setMsg] = useState(null);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: "",
    currency: "",
    max_uses: "",
    valid_until: "",
  });
  const [creating, setCreating] = useState(false);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/subscriptions/admin/promo-codes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "list" }),
        },
      );
      const data = await res.json();
      setPromos(data.promos || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  async function handleToggle(promoId) {
    setToggling(promoId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/subscriptions/admin/promo-codes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action: "toggle", promo_id: promoId }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPromos((prev) =>
        prev.map((p) =>
          p.id === promoId ? { ...p, is_active: data.promo.is_active } : p,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(null);
    }
  }

  async function handleCreate() {
    if (!form.code || !form.discount_value) {
      setMsg({ type: "error", text: "Code and discount value are required" });
      return;
    }
    setCreating(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/subscriptions/admin/promo-codes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: "create",
            ...form,
            discount_value: Number(form.discount_value),
            max_uses: form.max_uses ? Number(form.max_uses) : null,
            currency: form.currency || null,
            valid_until: form.valid_until || null,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({
        type: "success",
        text: `✓ Promo code "${data.promo.code}" created`,
      });
      setShowCreate(false);
      setForm({
        code: "",
        description: "",
        discount_type: "percent",
        discount_value: "",
        currency: "",
        max_uses: "",
        valid_until: "",
      });
      fetchPromos();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setCreating(false);
    }
  }

  function setF(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <>
      {msg && (
        <div
          className={`${styles.feedback} ${msg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
        >
          {msg.text}
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHead}>
          <p className={styles.cardTitle}>Promo Codes</p>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ height: 34, fontSize: 12, padding: "0 14px" }}
            onClick={() => setShowCreate((s) => !s)}
          >
            {showCreate ? "Cancel" : "+ New Code"}
          </button>
        </div>

        {showCreate && (
          <div className={styles.cardBody}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Code (will be uppercased)
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="e.g. WELCOME20"
                  value={form.code}
                  onChange={(e) => setF("code", e.target.value.toUpperCase())}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Discount Type</label>
                <select
                  className={styles.formSelect}
                  value={form.discount_type}
                  onChange={(e) => setF("discount_type", e.target.value)}
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Discount Value (
                  {form.discount_type === "percent" ? "%" : "amount"})
                </label>
                <input
                  className={styles.formInput}
                  type="number"
                  min="0"
                  placeholder={
                    form.discount_type === "percent" ? "e.g. 20" : "e.g. 500"
                  }
                  value={form.discount_value}
                  onChange={(e) => setF("discount_value", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Currency restriction (blank = all)
                </label>
                <select
                  className={styles.formSelect}
                  value={form.currency}
                  onChange={(e) => setF("currency", e.target.value)}
                >
                  <option value="">All currencies</option>
                  {[
                    "NGN",
                    "USD",
                    "GBP",
                    "EUR",
                    "GHS",
                    "KES",
                    "ZAR",
                    "CAD",
                    "AUD",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c} {sym(c)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Max uses (blank = unlimited)
                </label>
                <input
                  className={styles.formInput}
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={form.max_uses}
                  onChange={(e) => setF("max_uses", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Expires (blank = no expiry)
                </label>
                <input
                  className={styles.formInput}
                  type="date"
                  value={form.valid_until}
                  onChange={(e) => setF("valid_until", e.target.value)}
                />
              </div>
              <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.formLabel}>
                  Description (shown to users)
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="e.g. 20% off for new maids"
                  value={form.description}
                  onChange={(e) => setF("description", e.target.value)}
                />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Promo Code"}
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading promo codes...</div>
      ) : promos.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏷️</div>
          <p className={styles.emptyText}>No promo codes yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {promos.map((p) => (
            <div key={p.id} className={styles.promoCard}>
              <div>
                <p className={styles.promoCode}>{p.code}</p>
                <p className={styles.promoDesc}>{p.description || "—"}</p>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 6,
                  }}
                >
                  <span className={styles.metaTag}>
                    {p.discount_type === "percent"
                      ? `${p.discount_value}% off`
                      : `${p.discount_value} off`}
                    {p.currency ? ` (${p.currency} only)` : ""}
                  </span>
                  {p.max_uses && (
                    <span className={styles.metaTag}>
                      {Number(p.uses_count || 0)}/{p.max_uses} uses
                    </span>
                  )}
                  {!p.max_uses && (
                    <span className={styles.metaTag}>
                      Unlimited uses ({p.uses_count || 0} used)
                    </span>
                  )}
                  {p.valid_until && (
                    <span className={styles.metaTag}>
                      Expires {fmtDate(p.valid_until)}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.promoRight}>
                <span
                  className={`${styles.badge} ${p.is_active ? styles.badgeOn : styles.badgeOff}`}
                >
                  {p.is_active ? "Active" : "Inactive"}
                </span>
                <button
                  className={`${styles.btnSm} ${p.is_active ? styles.btnSmDanger : styles.btnSmGreen}`}
                  disabled={toggling === p.id}
                  onClick={() => handleToggle(p.id)}
                >
                  {toggling === p.id
                    ? "..."
                    : p.is_active
                      ? "Disable"
                      : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminSubscriptions({ onBack }) {
  const [activeTab, setActiveTab] = useState("analytics");

  const tabs = [
    { id: "analytics", label: "📊 Analytics" },
    { id: "subscriptions", label: "💳 Subscriptions" },
    { id: "plans", label: "📋 Plans" },
    { id: "promos", label: "🏷️ Promo Codes" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Subscriptions</h1>
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
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "subscriptions" && <SubscriptionsTab />}
        {activeTab === "plans" && <PlansTab />}
        {activeTab === "promos" && <PromoCodesTab />}
      </div>
    </div>
  );
}
