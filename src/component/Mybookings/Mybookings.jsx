import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Mybookings.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const FILTERS = [
  "all",
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "declined",
  "cancelled",
];

const STATUS_CLASS = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
  declined: styles.statusDeclined,
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/bookings?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [filter]);

  // Silent background refresh every 30 seconds
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/bookings?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Background refresh error:", err);
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [filter]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isMaid = user.role === "maid";

  // Navigate to support page with booking pre-filled
  function handleGetSupport(e, booking) {
    e.stopPropagation(); // Prevent card click from firing
    navigate("/customersupport", { state: { booking } });
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>My Bookings</h1>
      <p className={styles.pageSubtitle}>
        {isMaid ? "Bookings assigned to you" : "Your cleaning bookings"}
      </p>

      {!isMaid && (
        <button
          className={styles.newBookingBtn}
          onClick={() => navigate("/maids")}
        >
          + New Booking
        </button>
      )}

      <div className={styles.filters}>
        {FILTERS.map((f) => (
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

      {loading ? (
        <div className={styles.loading}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          No {filter !== "all" ? filter : ""} bookings found.
          {!isMaid && (
            <>
              <br />
              <br />
              <button
                className={styles.newBookingBtn}
                style={{
                  display: "inline-flex",
                  width: "auto",
                  padding: "0 24px",
                }}
                onClick={() => navigate("/maids")}
              >
                Browse Maids
              </button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {bookings.map((b) => (
            <div
              key={b.id}
              className={styles.card}
              onClick={() =>
                navigate(`/bookings/${b.id}`, { state: { booking: b } })
              }
            >
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.cardName}>
                    {isMaid ? b.customer_name : b.maid_name}
                  </p>
                  <p className={styles.cardDate}>
                    {formatDate(b.service_date)}
                  </p>
                </div>
                <span
                  className={`${styles.statusBadge} ${STATUS_CLASS[b.status] || styles.statusPending}`}
                >
                  {b.status === "in_progress"
                    ? "In Progress"
                    : b.status === "declined"
                      ? "Declined"
                      : b.status?.replace("_", " ")}
                </span>
              </div>

              {/* Declined Alert */}
              {b.status === "declined" && b.declined_reason && (
                <div className={styles.declinedAlert}>
                  <div className={styles.declinedIcon}>❌</div>
                  <div className={styles.declinedContent}>
                    <p className={styles.declinedReason}>
                      <span className={styles.reasonLabel}>Reason:</span>
                      {b.declined_reason}
                    </p>
                  </div>
                </div>
              )}

              <div className={styles.cardMeta}>
                <div className={styles.metaItem}>
                  Duration:{" "}
                  <span className={styles.metaValue}>{b.duration_hours}h</span>
                </div>
                <div className={styles.metaItem}>
                  Total:{" "}
                  <span className={styles.metaValue}>
                    ₦{Number(b.total_amount).toLocaleString()}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  Address:{" "}
                  <span className={styles.metaValue}>
                    {b.address?.split(",")[0]}
                  </span>
                </div>
              </div>

              {/* Support button — visible for non-maid users on relevant statuses */}
              {!isMaid && (
                <div className={styles.cardActions}>
                  <button
                    className={styles.supportBtn}
                    onClick={(e) => handleGetSupport(e, b)}
                  >
                    🎫 Get Support
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
