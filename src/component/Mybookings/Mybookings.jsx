import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Mybookings.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

// Status badge colors
const STATUS_CLASS = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
  declined: styles.statusDeclined,
};

export default function MyBookings({ token }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Get token from prop or localStorage
  const finalToken = token || localStorage.getItem("token");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check if token exists
    if (!finalToken) {
      setError("No authentication token found. Please login.");
      setLoading(false);
      console.error("[MyBookings] No token available");
      return;
    }

    try {
      console.log(`[MyBookings] Fetching bookings with filter: ${filter}`);
      console.log(`[MyBookings] API URL: ${API_URL}`);
      console.log(`[MyBookings] Token exists: ${!!finalToken}`);

      const params = new URLSearchParams({ limit: 50 });
      if (filter !== "all") params.set("status", filter);

      const url = `${API_URL}/api/bookings?${params}`;
      console.log(`[MyBookings] Request URL: ${url}`);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${finalToken}`,
        },
      });

      console.log(`[MyBookings] Response status: ${res.status}`);

      // Check if response is ok
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg =
          errorData.error || `HTTP ${res.status}: ${res.statusText}`;
        throw new Error(errorMsg);
      }

      const data = await res.json();
      console.log(
        `[MyBookings] Received ${data.bookings?.length || 0} bookings`,
      );
      console.log("[MyBookings] Bookings:", data.bookings);

      setBookings(data.bookings || []);
    } catch (err) {
      console.error("[MyBookings] Error fetching bookings:", err);
      setError(
        err.message || "Failed to load bookings. Please try again later.",
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filter, finalToken]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const FILTERS = [
    "all",
    "pending",
    "confirmed",
    "in_progress",
    "completed",
    "declined",
    "cancelled",
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>My Bookings</h1>
      <p className={styles.pageSubtitle}>
        View and manage your cleaning service bookings
      </p>

      {/* Filter tabs */}
      <div className={styles.filterTabs}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "in_progress"
              ? "In Progress"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            padding: "14px",
            background: "rgb(255, 243, 205)",
            border: "1px solid rgb(255, 200, 0)",
            borderRadius: "8px",
            marginBottom: "16px",
            color: "rgb(100, 80, 0)",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: "0 0 8px" }}>
            <strong>⚠️ Error loading bookings:</strong>
          </p>
          <p style={{ margin: 0 }}>{error}</p>
          <button
            onClick={() => fetchBookings()}
            style={{
              marginTop: "8px",
              padding: "8px 12px",
              background: "rgb(19, 19, 103)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className={styles.loading}>Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          <p>
            No {filter !== "all" ? filter : ""} bookings
            {error && " (Error loading bookings)"}
          </p>
          <button className={styles.cta} onClick={() => navigate("/maids")}>
            Find a Maid
          </button>
        </div>
      ) : (
        <div className={styles.bookingsList}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              {/* Card header with maid info and status */}
              <div className={styles.cardHeader}>
                <div className={styles.maidInfo}>
                  {booking.maid_avatar ? (
                    <img
                      src={booking.maid_avatar}
                      alt={booking.maid_name}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {initials(booking.maid_name)}
                    </div>
                  )}
                  <div>
                    <p className={styles.maidName}>{booking.maid_name}</p>
                    <p className={styles.bookingDate}>
                      {formatDate(booking.service_date)}
                    </p>
                  </div>
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    STATUS_CLASS[booking.status] || styles.statusPending
                  }`}
                >
                  {booking.status === "in_progress"
                    ? "In Progress"
                    : booking.status === "declined"
                      ? "Declined"
                      : booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                </span>
              </div>

              {/* Booking details */}
              <div className={styles.bookingDetails}>
                <div className={styles.detail}>
                  <span className={styles.label}>Duration:</span>
                  <span className={styles.value}>
                    {booking.duration_hours}h
                  </span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Cost:</span>
                  <span className={styles.value}>
                    ₦{Number(booking.total_amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Address:</span>
                  <span className={styles.value}>
                    {booking.address?.split(",")[0]}
                  </span>
                </div>
              </div>

              {/* ── DECLINED STATUS ALERT (NEW) ──────────────────────────────────── */}
              {booking.status === "declined" && (
                <div className={styles.declinedAlert}>
                  <div className={styles.declinedIcon}>❌</div>
                  <div className={styles.declinedContent}>
                    <h3 className={styles.declinedTitle}>Maid Declined</h3>
                    {booking.declined_reason && (
                      <p className={styles.declinedReason}>
                        <span className={styles.reasonLabel}>Reason:</span>
                        {booking.declined_reason}
                      </p>
                    )}
                    <p className={styles.declinedHint}>
                      You can book with another maid for the same time or choose
                      a different time.
                    </p>
                  </div>
                </div>
              )}

              {/* ── CANCELLED STATUS ALERT ────────────────────────────────────────── */}
              {booking.status === "cancelled" && (
                <div className={styles.cancelledAlert}>
                  <div className={styles.cancelledIcon}>⏸️</div>
                  <div className={styles.cancelledContent}>
                    <h3 className={styles.cancelledTitle}>Booking Cancelled</h3>
                    <p className={styles.cancelledHint}>
                      You can book with a maid again anytime.
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className={styles.cardActions}>
                {booking.status === "pending" && (
                  <>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                      onClick={() => navigate(`/maid/${booking.maid_id}`)}
                    >
                      View Maid Profile
                    </button>
                  </>
                )}

                {booking.status === "confirmed" && (
                  <>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                    >
                      View Details
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to cancel this booking?",
                          )
                        ) {
                          // Handle cancellation
                        }
                      }}
                    >
                      Cancel Booking
                    </button>
                  </>
                )}

                {booking.status === "in_progress" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                  >
                    In Progress...
                  </button>
                )}

                {booking.status === "completed" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => navigate(`/bookings/${booking.id}/review`)}
                  >
                    Leave Review
                  </button>
                )}

                {/* ── DECLINED: REBOOK BUTTON (NEW) ─────────────────────────────────── */}
                {booking.status === "declined" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => navigate("/maids")}
                  >
                    Find Another Maid
                  </button>
                )}

                {booking.status === "cancelled" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => navigate("/maids")}
                  >
                    Book a Maid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
