import { useState, useEffect, useCallback } from "react";
import styles from "./AdminBookings.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const STATUS_FILTERS = [
  "all",
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "declined",
  "cancelled",
];

const STATUS_COLORS = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  declined: styles.statusDeclined,
  cancelled: styles.statusCancelled,
};

const ADMIN_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "declined",
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

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

// ── SOS Alerts Section ────────────────────────────────────────────────────────
function SOSSection() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("active");
  const [resolving, setResolving] = useState(null);
  const [notes, setNotes] = useState("");
  const [resolvingId, setResolvingId] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/admin/sos?status=${statusFilter}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  async function handleResolve(alertId) {
    setResolvingId(alertId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/sos/${alertId}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: notes || null }),
      });
      if (res.ok) {
        setResolving(null);
        setNotes("");
        fetchAlerts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <div>
      {/* SOS filter tabs */}
      <div className={styles.filterBar}>
        {["active", "resolved"].map((s) => (
          <button
            key={s}
            className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === "active" ? "🚨 Active" : "✅ Resolved"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading SOS alerts...</div>
      ) : alerts.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            {statusFilter === "active" ? "✅" : "📋"}
          </div>
          <p className={styles.emptyText}>
            {statusFilter === "active"
              ? "No active SOS alerts"
              : "No resolved alerts"}
          </p>
        </div>
      ) : (
        <div className={styles.leadsList}>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`${styles.leadCard} ${alert.status === "active" ? styles.sosCard : ""}`}
            >
              <div className={styles.leadCardTop}>
                <div>
                  <p className={styles.leadName}>
                    🚨 SOS — {alert.triggered_by_name}
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        fontWeight: 400,
                        color: "rgb(100,100,100)",
                      }}
                    >
                      ({alert.triggered_by_role})
                    </span>
                  </p>
                  <p className={styles.leadEmail}>
                    {alert.customer_name} ↔ {alert.maid_name}
                  </p>
                </div>
                <span
                  className={
                    alert.status === "active"
                      ? styles.sosActiveBadge
                      : styles.statusCompleted
                  }
                >
                  {alert.status === "active" ? "🔴 Active" : "✅ Resolved"}
                </span>
              </div>

              <div className={styles.leadCardMeta}>
                <span className={styles.metaTag}>
                  📅 {formatDateTime(alert.created_at)}
                </span>
                {alert.booking_address && (
                  <span className={styles.metaTag}>
                    📍 {alert.booking_address.split(",")[0]}
                  </span>
                )}
                {alert.lat && alert.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${alert.lat},${alert.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.metaTag}
                    style={{ color: "rgb(30,58,138)", textDecoration: "none" }}
                  >
                    🗺 View on map
                  </a>
                )}
                {alert.customer_phone && (
                  <span className={styles.metaTag}>
                    📞 {alert.customer_phone}
                  </span>
                )}
                {alert.maid_phone && (
                  <span className={styles.metaTag}>📞 {alert.maid_phone}</span>
                )}
              </div>

              {alert.message && (
                <div className={styles.sosMessage}>
                  <strong>Message:</strong> {alert.message}
                </div>
              )}

              {alert.status === "resolved" && alert.resolved_by_name && (
                <div className={styles.sosResolved}>
                  Resolved by {alert.resolved_by_name} ·{" "}
                  {formatDateTime(alert.resolved_at)}
                </div>
              )}

              {/* Resolve form */}
              {alert.status === "active" && (
                <div className={styles.sosResolveWrap}>
                  {resolving === alert.id ? (
                    <>
                      <input
                        className={styles.sosNotesInput}
                        placeholder="Resolution notes (optional)..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                      <div className={styles.leadCardActions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => {
                            setResolving(null);
                            setNotes("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnSuccess}`}
                          onClick={() => handleResolve(alert.id)}
                          disabled={resolvingId === alert.id}
                        >
                          {resolvingId === alert.id
                            ? "Resolving..."
                            : "✅ Confirm Resolve"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={styles.leadCardActions}>
                      <button
                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                        onClick={() => setResolving(alert.id)}
                      >
                        Resolve Alert
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Booking detail modal ──────────────────────────────────────────────────────
function BookingDetailModal({ booking, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(booking.status);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [approving, setApproving] = useState(false);

  // Fetch rich admin detail
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/admin/bookings/${booking.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setDetail(data);
      } catch {}
      setLoadingDetail(false);
    }
    load();
  }, [booking.id]);

  async function handleSave() {
    if (status === booking.status) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/admin/bookings/${booking.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );
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

  async function handleApprove() {
    setApproving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/payments/bookings/${booking.id}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        onStatusUpdate({ ...booking, status: "confirmed" });
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(false);
    }
  }

  const b = detail?.booking || booking;

  const rows = [
    ["Booking ID", b.id?.slice(0, 12) + "..."],
    ["Customer", b.customer_name || b.customer_id],
    ["Customer 📞", b.customer_phone || "—"],
    ["Maid", b.maid_name || b.maid_id],
    ["Maid 📞", b.maid_phone || "—"],
    ["Service date", formatDate(b.service_date)],
    ["Duration", b.duration_hours ? `${b.duration_hours} hrs` : "—"],
    ["Address", b.address],
    b.notes && ["Notes", b.notes],
    ["Total", formatCurrency(b.total_amount)],
    ["Payment", b.payment_status || "unpaid"],
    ["Gateway", b.gateway || "—"],
    b.paystack_reference && ["Paystack ref", b.paystack_reference],
    b.stripe_payment_id && ["Stripe ref", b.stripe_payment_id],
    b.bank_transfer_ref && ["Bank ref", b.bank_transfer_ref],
    ["Created", formatDate(b.created_at)],
    b.declined_by && ["Declined by", b.declined_by],
    b.declined_reason && ["Decline reason", b.declined_reason],
  ].filter(Boolean);

  const activeSOS =
    detail?.sos_alerts?.filter((s) => s.status === "active") || [];
  const locations = detail?.location_history || [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />

        <p className={styles.modalName}>Booking #{b.id?.slice(0, 8)}</p>
        <p className={styles.modalSubtitle}>
          {b.customer_name} → {b.maid_name}
        </p>

        {/* ── Active SOS banner ── */}
        {activeSOS.length > 0 && (
          <div className={styles.sosBanner}>
            <p className={styles.sosBannerTitle}>🚨 Active SOS Alert</p>
            <p className={styles.sosBannerBody}>
              Triggered by {activeSOS[0].triggered_by_name} ·{" "}
              {formatDateTime(activeSOS[0].created_at)}
            </p>
            {activeSOS[0].lat && activeSOS[0].lng && (
              <a
                href={`https://www.google.com/maps?q=${activeSOS[0].lat},${activeSOS[0].lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sosBannerLink}
              >
                🗺 View location on map →
              </a>
            )}
          </div>
        )}

        {/* ── Decline banner ── */}
        {b.status === "declined" && b.declined_reason && (
          <div className={styles.declineBanner}>
            <p className={styles.declineBannerTitle}>
              ⚠️ Declined by {b.declined_by || "unknown"}
            </p>
            <p className={styles.declineBannerReason}>{b.declined_reason}</p>
          </div>
        )}

        {/* ── Payment approval (pending bookings with successful payment) ── */}
        {b.status === "pending" && b.payment_status === "success" && (
          <div className={styles.approvalBanner}>
            <p className={styles.approvalBannerTitle}>
              💳 Payment received — awaiting approval
            </p>
            <p className={styles.approvalBannerBody}>
              {formatCurrency(b.payment_amount || b.total_amount)} via{" "}
              {b.gateway || "card"}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                className={styles.approveBtn}
                onClick={handleApprove}
                disabled={approving}
              >
                {approving ? "Approving..." : "✅ Approve Booking"}
              </button>
              <button
                className={styles.rejectBtn}
                onClick={() => setStatus("cancelled")}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        )}

        {/* ── Booking details ── */}
        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Booking details</p>
          {rows.map(([k, v]) => (
            <div key={k} className={styles.detailRow}>
              <span className={styles.detailKey}>{k}</span>
              <span className={styles.detailVal}>{v}</span>
            </div>
          ))}
        </div>

        {/* ── Location history ── */}
        {loadingDetail
          ? null
          : locations.length > 0 && (
              <div className={styles.detailSection}>
                <p className={styles.detailSectionTitle}>Last known location</p>
                <div className={styles.locationRow}>
                  <span className={styles.detailKey}>Coordinates</span>
                  <a
                    href={`https://www.google.com/maps?q=${locations[0].lat},${locations[0].lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.locationLink}
                  >
                    {Number(locations[0].lat).toFixed(5)},{" "}
                    {Number(locations[0].lng).toFixed(5)} →
                  </a>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailKey}>Recorded</span>
                  <span className={styles.detailVal}>
                    {formatDateTime(locations[0].recorded_at)}
                  </span>
                </div>
              </div>
            )}

        {/* ── Update status ── */}
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
  // ── NEW: tab state ──
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" | "sos"
  const [activeSOSCount, setActiveSOSCount] = useState(0);
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
      setTotal(data.total || data.bookings?.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  // ── NEW: fetch active SOS count for badge ──
  const fetchSOSCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/admin/sos?status=active&limit=1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setActiveSOSCount(data.alerts?.length || 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);
  useEffect(() => {
    fetchSOSCount();
  }, [fetchSOSCount]);
  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const id = setInterval(async () => {
      try {
        const params = new URLSearchParams({ page, limit: LIMIT });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/bookings?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
        setTotal(data.total || data.bookings?.length || 0);
      } catch (err) {
        console.error("Background refresh error:", err);
      }
    }, 30000);
    return () => clearInterval(id);
  }, [filter, page]);

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
    setBookings((prev) =>
      prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)),
    );
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
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

      {/* ── NEW: Tab switcher ── */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "bookings" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          📅 Bookings
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "sos" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("sos")}
        >
          🚨 SOS Alerts
          {activeSOSCount > 0 && (
            <span className={styles.tabBadge}>{activeSOSCount}</span>
          )}
        </button>
      </div>

      {/* ── SOS tab ── */}
      {activeTab === "sos" ? (
        <SOSSection />
      ) : (
        <>
          {/* Stats */}
          <div className={styles.statsBar}>
            <StatCard label="Total" value={total} />
            <StatCard
              label="Pending"
              value={counts.pending || 0}
              color="#856404"
            />
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
              label="Declined"
              value={counts.declined || 0}
              color="#c47a1a"
            />
            <StatCard
              label="Cancelled"
              value={counts.cancelled || 0}
              color="#a81c1c"
            />
          </div>

          {/* Filters */}
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

          {/* Search */}
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

          {/* Bookings list */}
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
                    {/* ── NEW: payment pending indicator ── */}
                    {booking.status === "pending" &&
                      booking.payment_status === "success" && (
                        <span className={styles.metaTagAlert}>
                          💳 Needs approval
                        </span>
                      )}
                  </div>

                  {booking.status === "declined" && booking.declined_reason && (
                    <div className={styles.declineReason}>
                      <span className={styles.declineReasonLabel}>
                        Declined by {booking.declined_by || "unknown"}:
                      </span>{" "}
                      {booking.declined_reason}
                    </div>
                  )}

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
        </>
      )}

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
