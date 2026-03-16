import { useState, useEffect, useCallback } from "react";
import styles from "./AdminBookings.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const STATUS_FILTERS = [
  "all",
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const STATUS_COLORS = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

const ADMIN_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ── Stat card (same as AdminDashboard) ───────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>
        {color && (
          <span className={styles.statDot} style={{ background: color }} />
        )}
        {label}
      </p>
      <p className={styles.statValue}>{value}</p>
    </div>
  );
}

// ── Booking detail modal ──────────────────────────────────────────────────────
function BookingDetailModal({ booking, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(booking.status);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (status === booking.status) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        onStatusUpdate(data.booking);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const rows = [
    ["Booking ID", booking.id],
    ["Customer", booking.customer_name || booking.customer_id],
    ["Maid", booking.maid_name || booking.maid_id],
    ["Service date", formatDate(booking.service_date)],
    [
      "Duration",
      booking.duration_hours ? `${booking.duration_hours} hrs` : "—",
    ],
    ["Address", booking.address],
    booking.notes && ["Notes", booking.notes],
    ["Total", formatCurrency(booking.total_amount)],
    ["Payment", booking.payment_status || "unpaid"],
    booking.paystack_reference && ["Paystack ref", booking.paystack_reference],
    ["Created", formatDate(booking.created_at)],
  ].filter(Boolean);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />

        <p className={styles.modalName}>Booking #{booking.id?.slice(0, 8)}</p>
        <p className={styles.modalSubtitle}>
          {booking.customer_name} → {booking.maid_name}
        </p>

        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Booking details</p>
          {rows.map(([k, v]) => (
            <div key={k} className={styles.detailRow}>
              <span className={styles.detailKey}>{k}</span>
              <span className={styles.detailVal}>{v}</span>
            </div>
          ))}
        </div>

        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Update status</p>
          <select
            className={styles.statusSelect}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {ADMIN_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.modalBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main AdminBookings ────────────────────────────────────────────────────────
export default function AdminBookings({ onNavigate }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const LIMIT = 20;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`${API_URL}/api/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
      // backend doesn't return total yet — use length as fallback
      setTotal(data.total || data.bookings?.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);
  useEffect(() => {
    setPage(1);
  }, [filter]);

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.customer_name?.toLowerCase().includes(q) ||
      b.maid_name?.toLowerCase().includes(q) ||
      b.address?.toLowerCase().includes(q) ||
      b.id?.toLowerCase().includes(q)
    );
  });

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  function handleStatusUpdate(updated) {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.dashboard}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>Bookings</h1>
          <span className={styles.headerBadge}>{total} total</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("leads")}
          >
            📋 Leads
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("users")}
          >
            👥 Users
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsBar}>
        <StatCard label="Total" value={total} />
        <StatCard label="Pending" value={counts.pending || 0} color="#856404" />
        <StatCard
          label="Confirmed"
          value={counts.confirmed || 0}
          color="#1a56c4"
        />
        <StatCard
          label="Completed"
          value={counts.completed || 0}
          color="#0a6b2e"
        />
        <StatCard
          label="In Progress"
          value={counts.in_progress || 0}
          color="#6f42c1"
        />
        <StatCard
          label="Cancelled"
          value={counts.cancelled || 0}
          color="#a81c1c"
        />
      </div>

      {/* ── Filters ── */}
      <div className={styles.filterBar}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "in_progress"
              ? "In Progress"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <svg
          className={styles.searchIcon}
          width="16"
          height="16"
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
          placeholder="Search by customer, maid, address or booking ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Bookings list ── */}
      {loading ? (
        <div className={styles.loading}>Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📅</div>
          <p className={styles.emptyText}>No bookings found</p>
        </div>
      ) : (
        <div className={styles.leadsList}>
          {filtered.map((booking) => (
            <div key={booking.id} className={styles.leadCard}>
              <div className={styles.leadCardTop}>
                <div>
                  <p className={styles.leadName}>
                    {booking.customer_name || "Customer"}
                  </p>
                  <p className={styles.leadEmail}>
                    Maid: {booking.maid_name || booking.maid_id}
                  </p>
                </div>
                <span
                  className={`${styles.statusBadge} ${STATUS_COLORS[booking.status] || styles.statusPending}`}
                >
                  {booking.status?.replace("_", " ")}
                </span>
              </div>

              <div className={styles.leadCardMeta}>
                <span className={styles.metaTag}>
                  📅 {formatDate(booking.service_date)}
                </span>
                <span className={styles.metaTag}>
                  ⏱ {booking.duration_hours}h
                </span>
                <span className={styles.metaTag}>
                  💰 {formatCurrency(booking.total_amount)}
                </span>
                {booking.address && (
                  <span className={styles.metaTag}>
                    📍 {booking.address.split(",")[0]}
                  </span>
                )}
              </div>

              <div className={styles.leadCardActions}>
                <button
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  View details
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setSelectedBooking(booking)}
                >
                  Update status
                </button>
                <span className={styles.leadDate}>
                  {formatDate(booking.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className={styles.pageInfo}>
            {page} / {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Detail modal ── */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
