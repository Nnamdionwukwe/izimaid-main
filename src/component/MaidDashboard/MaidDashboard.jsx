import { useState, useEffect, useCallback } from "react";
import styles from "./MaidDashboard.module.css";

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

// Status badge colors
const STATUS_CLASS = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
  declined: styles.statusDeclined,
};

// ── Decline Confirmation Modal ────────────────────────────────────────────
function DeclineConfirmModal({ booking, onConfirm, onCancel, isLoading }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(booking.id, reason);
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />

        <div style={{ textAlign: "center", paddingTop: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Decline Booking?
          </h2>
          <p
            style={{
              color: "rgb(100, 100, 100)",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Customer: <strong>{booking.customer_name}</strong>
          </p>
          <p
            style={{
              color: "rgb(100, 100, 100)",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {formatDate(booking.service_date)}
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: "bold",
              marginBottom: 6,
              color: "rgb(47, 47, 47)",
            }}
          >
            Reason for declining (optional)
          </label>
          <textarea
            style={{
              width: "100%",
              border: "1px solid rgb(228, 228, 228)",
              borderRadius: "8px",
              padding: "10px",
              fontSize: 13,
              fontFamily: "inherit",
              minHeight: "80px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
            placeholder="Let the customer know why you're declining..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.modalBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            Keep Booking
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnDanger}`}
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              background: isLoading ? "rgb(200, 100, 100)" : "rgb(187, 19, 47)",
            }}
          >
            {isLoading ? "Declining..." : "Decline Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingsTab({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [declineModal, setDeclineModal] = useState(null);
  const [isDeclining, setIsDeclining] = useState(false);

  const fetchBookings = useCallback(async () => {
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
      console.error("Error fetching bookings:", err);
    }
    setLoading(false);
  }, [filter, token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  }

  async function handleDecline(bookingId, reason) {
    setIsDeclining(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "declined",
          declined_reason: reason || undefined,
          declined_by: "maid",
        }),
      });

      if (res.ok) {
        setDeclineModal(null);
        fetchBookings();

        // Show success message
        alert("Booking declined. Customer has been notified.");
      } else {
        alert("Failed to decline booking. Please try again.");
      }
    } catch (err) {
      console.error("Error declining booking:", err);
      alert("Error declining booking. Please try again.");
    } finally {
      setIsDeclining(false);
    }
  }

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
    <div>
      <p className={styles.sectionTitle}>My Bookings</p>
      <div
        className={styles.tabs}
        style={{
          marginBottom: 16,
          border: "none",
          borderBottom: "1px solid rgb(228,228,228)",
        }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.tab} ${filter === f ? styles.tabActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "in_progress"
              ? "In Progress"
              : f === "declined"
                ? "Declined"
                : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          No {filter !== "all" ? filter : ""} bookings
        </div>
      ) : (
        <div className={styles.bookingList}>
          {bookings.map((b) => (
            <div key={b.id} className={styles.bookingCard}>
              <div className={styles.bookingTop}>
                <div>
                  <p className={styles.bookingCustomer}>{b.customer_name}</p>
                  <p className={styles.bookingDate}>
                    {formatDate(b.service_date)}
                  </p>
                </div>
                <span
                  className={`${styles.statusBadge} ${STATUS_CLASS[b.status] || styles.statusPending}`}
                >
                  {b.status === "declined"
                    ? "Declined"
                    : b.status === "in_progress"
                      ? "In Progress"
                      : b.status?.replace("_", " ")}
                </span>
              </div>

              <div className={styles.bookingMeta}>
                <div className={styles.metaItem}>
                  Duration:{" "}
                  <span className={styles.metaValue}>{b.duration_hours}h</span>
                </div>
                <div className={styles.metaItem}>
                  Earning:{" "}
                  <span className={styles.metaValue}>
                    ₦{Number(b.total_amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  Address: <span className={styles.metaValue}>{b.address}</span>
                </div>
              </div>

              {/* Show decline reason if exists */}
              {b.status === "declined" && b.declined_reason && (
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(255, 243, 205)",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    fontSize: "12px",
                    color: "rgb(100, 80, 0)",
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontWeight: "bold" }}>
                    Decline reason:
                  </p>
                  <p style={{ margin: 0 }}>{b.declined_reason}</p>
                </div>
              )}

              <div className={styles.bookingActions}>
                {b.status === "pending" && (
                  <>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      onClick={() => updateStatus(b.id, "confirmed")}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => setDeclineModal(b)}
                    >
                      Decline
                    </button>
                  </>
                )}
                {b.status === "confirmed" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => updateStatus(b.id, "in_progress")}
                  >
                    Start Cleaning
                  </button>
                )}
                {b.status === "in_progress" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => updateStatus(b.id, "completed")}
                  >
                    Mark Complete
                  </button>
                )}
                {b.status === "declined" && (
                  <p style={{ fontSize: 12, color: "gray", margin: 0 }}>
                    Declined on {formatDate(b.updated_at)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decline confirmation modal */}
      {declineModal && (
        <DeclineConfirmModal
          booking={declineModal}
          onConfirm={handleDecline}
          onCancel={() => setDeclineModal(null)}
          isLoading={isDeclining}
        />
      )}
    </div>
  );
}
