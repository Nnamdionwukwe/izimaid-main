import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./BookingDetail.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const STATUS_CLASS = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(state?.booking || null);
  const [loading, setLoading] = useState(!state?.booking);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isMaid = user.role === "maid";
  const isCustomer = user.role === "customer";

  useEffect(() => {
    if (booking) return;
    async function fetchBooking() {
      try {
        const res = await fetch(`${API_URL}/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setBooking(data.booking);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  async function updateStatus(status) {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooking((prev) => ({ ...prev, status: data.booking.status }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitReview() {
    if (!rating) return setError("Please select a rating");
    setReviewLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviewed(true);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewLoading(false);
    }
  }

  if (loading) return <div className={styles.loading}>Loading booking...</div>;
  if (!booking)
    return <div className={styles.loading}>{error || "Booking not found"}</div>;

  return (
    <div className={styles.page}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/my-bookings")}
      >
        ← My Bookings
      </button>

      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Booking Details</h1>
        <span
          className={`${styles.statusBadge} ${STATUS_CLASS[booking.status] || styles.statusPending}`}
        >
          {booking.status?.replace("_", " ")}
        </span>
      </div>

      {/* People */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>{isMaid ? "Customer" : "Maid"}</p>
        <div className={styles.row}>
          <span className={styles.rowKey}>Name</span>
          <span className={styles.rowVal}>
            {isMaid ? booking.customer_name : booking.maid_name}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Booking Info</p>
        <div className={styles.row}>
          <span className={styles.rowKey}>Date & Time</span>
          <span className={styles.rowVal}>
            {formatDate(booking.service_date)}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowKey}>Duration</span>
          <span className={styles.rowVal}>
            {booking.duration_hours} hour(s)
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowKey}>Address</span>
          <span className={styles.rowVal}>{booking.address}</span>
        </div>
        {booking.notes && (
          <div className={styles.row}>
            <span className={styles.rowKey}>Notes</span>
            <span className={styles.rowVal}>{booking.notes}</span>
          </div>
        )}
        <div className={styles.total}>
          <span>Total</span>
          <span>₦{Number(booking.total_amount).toLocaleString()}</span>
        </div>
      </div>

      {/* Payment */}
      {booking.payment_status && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Payment</p>
          <div className={styles.row}>
            <span className={styles.rowKey}>Status</span>
            <span className={styles.rowVal}>{booking.payment_status}</span>
          </div>
          {booking.paystack_reference && (
            <div className={styles.row}>
              <span className={styles.rowKey}>Reference</span>
              <span className={styles.rowVal}>
                {booking.paystack_reference}
              </span>
            </div>
          )}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {/* Actions */}
      <div className={styles.actions}>
        {isCustomer && booking.status === "pending" && (
          <button
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
            onClick={() => updateStatus("cancelled")}
          >
            Cancel Booking
          </button>
        )}
        {isMaid && booking.status === "pending" && (
          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={() => updateStatus("confirmed")}
          >
            Confirm Booking
          </button>
        )}
        {isMaid && booking.status === "confirmed" && (
          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={() => updateStatus("in_progress")}
          >
            Start Cleaning
          </button>
        )}
        {isMaid && booking.status === "in_progress" && (
          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={() => updateStatus("completed")}
          >
            Mark Complete
          </button>
        )}
      </div>

      {/* Review section */}
      {isCustomer && booking.status === "completed" && !reviewed && (
        <div className={styles.section} style={{ marginTop: 20 }}>
          <p className={styles.sectionTitle}>Leave a Review</p>
          <div className={styles.reviewForm}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`${styles.star} ${n <= rating ? styles.starActive : ""}`}
                  onClick={() => setRating(n)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className={styles.reviewTextarea}
              placeholder="Share your experience (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              onClick={submitReview}
              disabled={reviewLoading}
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      {reviewed && (
        <div
          className={styles.section}
          style={{ marginTop: 20, textAlign: "center" }}
        >
          <p
            style={{
              color: "rgb(10, 107, 46)",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            ✓ Review submitted. Thank you!
          </p>
        </div>
      )}
    </div>
  );
}
