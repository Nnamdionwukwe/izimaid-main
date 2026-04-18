// src/component/EarningsTab/EarningsTab.jsx
// Add to MaidDashboard:
//   import EarningsTab from "../EarningsTab/EarningsTab";
//   ["earnings", "Earnings 📈"]
//   {tab === "earnings" && <EarningsTab token={token} />}

import { useState, useEffect, useCallback } from "react";
import styles from "./EarningsTab.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API = API_URL.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

// ── Currency symbols ──────────────────────────────────────────────────
const SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  KES: "KSh",
  GHS: "₵",
  ZAR: "R",
  UGX: "USh",
  TZS: "TSh",
  RWF: "FRw",
  CAD: "CA$",
  AUD: "A$",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
  SGD: "S$",
};
function sym(c) {
  return SYMBOLS[c] || c + " ";
}

function fmt(n, c) {
  const num = Number(n || 0);
  return (
    sym(c) +
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
function fmtShort(n, c) {
  const num = Number(n || 0);
  if (num >= 1_000_000) return sym(c) + (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return sym(c) + (num / 1_000).toFixed(1) + "K";
  return sym(c) + num.toFixed(0);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_CFG = {
  completed: { label: "Completed", color: "#1b5e20", bg: "#e8f5e9" },
  confirmed: { label: "Confirmed", color: "#1565c0", bg: "#e3f2fd" },
  pending: { label: "Pending", color: "#b57b00", bg: "#fff8e1" },
  in_progress: { label: "In Progress", color: "#6a1b9a", bg: "#f3e5f5" },
  cancelled: { label: "Cancelled", color: "#555", bg: "#f5f5f5" },
  declined: { label: "Declined", color: "#b71c1c", bg: "#ffebee" },
};

const PERIODS = [
  { value: "all", label: "All Time" },
  { value: "this_year", label: "This Year" },
  { value: "this_month", label: "This Month" },
  { value: "this_week", label: "This Week" },
];

// ── Mini bar chart (pure CSS + inline styles) ─────────────────────────
function BarChart({ data, currency }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => Number(d.earned || 0)), 1);
  return (
    <div className={styles.chart}>
      <div className={styles.chartBars}>
        {data.map((d, i) => {
          const pct = (Number(d.earned || 0) / max) * 100;
          return (
            <div key={i} className={styles.chartBarWrap}>
              <div className={styles.chartBarTooltip}>
                {fmtShort(d.earned, currency)}
                <br />
                <span>
                  {d.bookings} booking{d.bookings !== "1" ? "s" : ""}
                </span>
              </div>
              <div
                className={styles.chartBar}
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
              <p className={styles.chartLabel}>{d.month}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Summary cards ─────────────────────────────────────────────────────
function SummaryCards({ summary, currency }) {
  const row = summary.find((s) => s.currency === currency) || summary[0];
  if (!row) return null;
  const c = row.currency;
  return (
    <div className={styles.summaryGrid}>
      <div className={styles.statCard}>
        <span className={styles.statIcon}>💰</span>
        <p className={styles.statLabel}>Total Earned</p>
        <p className={styles.statValue}>{fmtShort(row.total_earned, c)}</p>
        <p className={styles.statFull}>{fmt(row.total_earned, c)}</p>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statIcon}>📋</span>
        <p className={styles.statLabel}>Bookings</p>
        <p className={styles.statValue}>
          {Number(row.booking_count).toLocaleString()}
        </p>
        <p className={styles.statFull}>
          {Number(row.total_hours || 0).toFixed(1)} hrs total
        </p>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statIcon}>📊</span>
        <p className={styles.statLabel}>Avg / Booking</p>
        <p className={styles.statValue}>{fmtShort(row.avg_per_booking, c)}</p>
        <p className={styles.statFull}>{fmt(row.avg_per_booking, c)}</p>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statIcon}>🏆</span>
        <p className={styles.statLabel}>Highest</p>
        <p className={styles.statValue}>{fmtShort(row.highest_booking, c)}</p>
        <p className={styles.statFull}>{fmt(row.highest_booking, c)}</p>
      </div>
    </div>
  );
}

// ── Main EarningsTab ──────────────────────────────────────────────────
export default function EarningsTab({ token }) {
  const [data, setData] = useState({
    bookings: [],
    summary: [],
    monthly: [],
    currencies: [],
    total: 0,
    page: 1,
    limit: 15,
  });
  const activeCurrency = data?.summary?.[0]?.currency || "NGN";
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(""); // "" = all
  const [period, setPeriod] = useState("all");
  const [status, setStatus] = useState("completed");
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  const load = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          period,
          status,
          page: p,
          limit: LIMIT,
        });
        if (currency) params.set("currency", currency);

        const res = await fetch(`${API}/earnings?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok) {
          setData((prev) =>
            p === 1
              ? json
              : {
                  ...json,
                  bookings: [...(prev?.bookings || []), ...json.bookings],
                },
          );
          setPage(p);
        }
      } catch (err) {
        console.error("EarningsTab load error:", err);
      }
      setLoading(false);
    },
    [token, currency, period, status],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const hasMore = data?.bookings ? data.bookings.length < data.total : false;

  // ── Multi-currency switcher pills ────────────────────────────────
  const allCurrencies = data?.currencies || [];

  return (
    <div className={styles.wrap}>
      {/* ── Page title ────────────────────────────────────────── */}
      <div className={styles.titleRow}>
        <p className={styles.title}>Earnings</p>
        {data && (
          <p className={styles.titleSub}>
            {data.total.toLocaleString()} booking{data.total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ── Currency filter chips ─────────────────────────────── */}
      {allCurrencies.length > 1 && (
        <div className={styles.chipRow}>
          <button
            className={`${styles.chip} ${!currency ? styles.chipActive : ""}`}
            onClick={() => {
              setCurrency("");
              setPage(1);
            }}
          >
            All
          </button>
          {allCurrencies.map((c) => (
            <button
              key={c}
              className={`${styles.chip} ${currency === c ? styles.chipActive : ""}`}
              onClick={() => {
                setCurrency(c);
                setPage(1);
              }}
            >
              {sym(c)}
              {c}
            </button>
          ))}
        </div>
      )}

      {/* ── Period + status filters ───────────────────────────── */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`${styles.filterBtn} ${period === p.value ? styles.filterBtnActive : ""}`}
              onClick={() => {
                setPeriod(p.value);
                setPage(1);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <select
          className={styles.statusSelect}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="completed">Completed only</option>
          <option value="all">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
        </select>
      </div>

      {/* ── Summary cards ─────────────────────────────────────── */}
      {data?.summary?.length > 0 && (
        <SummaryCards summary={data.summary} currency={activeCurrency} />
      )}

      {/* ── Bar chart ─────────────────────────────────────────── */}
      {data?.monthly?.length > 0 && (
        <div className={styles.chartSection}>
          <p className={styles.sectionLabel}>Last 6 months</p>
          <BarChart data={data.monthly} currency={activeCurrency} />
        </div>
      )}

      {/* ── Multi-currency breakdown ──────────────────────────── */}
      {!currency && data?.summary?.length > 1 && (
        <div className={styles.breakdownSection}>
          <p className={styles.sectionLabel}>By currency</p>
          {data.summary.map((s) => (
            <div key={s.currency} className={styles.breakdownRow}>
              <div className={styles.breakdownLeft}>
                <span className={styles.breakdownCurrency}>{s.currency}</span>
                <span className={styles.breakdownCount}>
                  {s.booking_count} bookings
                </span>
              </div>
              <div className={styles.breakdownRight}>
                <span className={styles.breakdownTotal}>
                  {fmt(s.total_earned, s.currency)}
                </span>
                <span className={styles.breakdownHours}>
                  {Number(s.total_hours || 0).toFixed(0)} hrs
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Bookings list ─────────────────────────────────────── */}
      <div className={styles.listSection}>
        <p className={styles.sectionLabel}>Booking history</p>

        {loading && page === 1 ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading earnings…</p>
          </div>
        ) : data?.bookings?.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📭</span>
            <p>No earnings found for this filter.</p>
            <p className={styles.emptyHint}>
              Try changing the period or currency filter.
            </p>
          </div>
        ) : (
          <>
            {data.bookings.map((b) => {
              const cfg = STATUS_CFG[b.status] || STATUS_CFG.pending;
              return (
                <div key={b.id} className={styles.bookingCard}>
                  <div className={styles.bookingTop}>
                    <div className={styles.bookingCustomer}>
                      {b.customer_avatar ? (
                        <img
                          src={b.customer_avatar}
                          alt={b.customer_name}
                          className={styles.customerAvatar}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={styles.customerAvatarPlaceholder}
                        style={{ display: b.customer_avatar ? "none" : "flex" }}
                      >
                        {b.customer_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "?"}
                      </div>

                      <div>
                        <p className={styles.customerName}>{b.customer_name}</p>
                        <p className={styles.bookingDate}>
                          {formatDate(b.service_date)}
                        </p>
                      </div>
                    </div>
                    <div className={styles.bookingRight}>
                      <p className={styles.bookingAmount}>
                        {fmt(b.total_amount, activeCurrency)}
                      </p>
                      <span
                        className={styles.statusBadge}
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <div className={styles.bookingMeta}>
                    <span>⏱ {b.duration_hours}h</span>
                    {b.address && <span>📍 {b.address.split(",")[0]}</span>}
                    {b.notes && (
                      <span>
                        📝 {b.notes.slice(0, 40)}
                        {b.notes.length > 40 ? "…" : ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <button
                className={styles.loadMoreBtn}
                onClick={() => load(page + 1)}
                disabled={loading}
              >
                {loading ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
