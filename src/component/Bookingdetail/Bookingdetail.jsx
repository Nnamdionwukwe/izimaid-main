// src/component/Bookingdetail/Bookingdetail.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Bookingdetail.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  KES: "KSh",
  GHS: "₵",
  ZAR: "R",
  UGX: "USh",
  CAD: "CA$",
  AUD: "A$",
  JPY: "¥",
  SGD: "S$",
  MYR: "RM",
};
function sym(c) {
  return CURRENCY_SYMBOLS[c] || (c ? c + " " : "₦");
}
function fmtAmt(n, c) {
  return `${sym(c)}${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const STATUS_CLASS = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
  declined: styles.statusDeclined,
  awaiting_payment: styles.statusPending,
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

// Replace the LiveMap component:
function LiveMap({ lat, lng, updatedAt }) {
  if (!lat || !lng) return null;

  // Google Maps embed — no API key needed for basic embed
  const googleEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  const googleDirectUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className={styles.mapWrap}>
      <iframe
        title="Maid Live Location"
        src={googleEmbedUrl}
        className={styles.mapIframe}
        frameBorder="0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className={styles.mapOverlay}>
        <span className={styles.mapLiveTag}>📍 LIVE</span>
        <a
          href={googleDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapGoogleLink}
        >
          Open in Google Maps ↗
        </a>
      </div>
      {updatedAt && (
        <p className={styles.mapUpdatedAt}>
          🕐 Last updated: {new Date(updatedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

export default function BookingDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(state?.booking || null);
  const [payment, setPayment] = useState(null);
  const [location, setLocation] = useState(null);
  const [emergency, setEmergency] = useState([]);
  const [activeSOS, setActiveSOS] = useState([]);
  const [loading, setLoading] = useState(!state?.booking);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [sosMsg, setSosMsg] = useState("");
  const [sosSending, setSosSending] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  const pollRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const isMaid = user.role === "maid";
  const isCustomer = user.role === "customer";
  const isAdmin = user.role === "admin";

  useEffect(() => {
    async function fetchAll() {
      // Don't show full-page spinner if we already have booking from state
      if (!booking) setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setBooking(data.booking);
        setEmergency(data.emergency_contacts || []);
        setActiveSOS(data.active_sos || []);
        if (data.latest_location) setLocation(data.latest_location);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll(); // ← always call, not just when booking is null

    async function fetchPayment() {
      try {
        const r = await fetch(`${API_URL}/api/payments/booking/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await r.json();
        if (r.ok && d.payment) setPayment(d.payment);
      } catch {}
    }
    fetchPayment();
  }, [id]);

  // Replace the location polling useEffect:
  useEffect(() => {
    // Poll when confirmed or in_progress (covers checkin → checkout window)
    if (!["confirmed", "in_progress"].includes(booking?.status)) return;

    async function pollLocation() {
      try {
        const res = await fetch(`${API_URL}/api/bookings/${id}/location`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.location) setLocation(data.location);
      } catch {}
    }
    pollLocation();
    pollRef.current = setInterval(pollLocation, 15000); // every 15s
    return () => clearInterval(pollRef.current);
  }, [booking?.status, id]);

  const currency = payment?.currency || booking?.maid_currency || "NGN";

  async function updateStatus(status, extra = {}) {
    setActionLoading(status);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooking((prev) => ({ ...prev, status: data.booking.status }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading("");
    }
  }

  async function handleCheckIn() {
    setActionLoading("checkin");
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setActionLoading("");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`${API_URL}/api/bookings/${id}/checkin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              lat: coords.latitude,
              lng: coords.longitude,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setBooking((prev) => ({ ...prev, ...data.booking }));
          setLocation({
            lat: coords.latitude,
            lng: coords.longitude,
            recorded_at: new Date().toISOString(),
          });
        } catch (err) {
          setError(err.message);
        }
        setActionLoading("");
      },
      () => {
        setError("Could not get location for check-in");
        setActionLoading("");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  async function handleCheckOut() {
    setActionLoading("checkout");
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setActionLoading("");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`${API_URL}/api/bookings/${id}/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              lat: coords.latitude,
              lng: coords.longitude,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setBooking((prev) => ({ ...prev, ...data.booking }));
          setLocation((prev) => ({
            ...prev,
            recorded_at: new Date().toISOString(),
          }));
          clearInterval(pollRef.current);
        } catch (err) {
          setError(err.message);
        }
        setActionLoading("");
      },
      () => {
        setError("Could not get location for check-out");
        setActionLoading("");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  async function handleSOS() {
    setSosSending(true);
    const send = async (lat, lng) => {
      try {
        const res = await fetch(`${API_URL}/api/bookings/${id}/sos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lat,
            lng,
            message: sosMsg || "SOS triggered",
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setSosSent(true);
          setActiveSOS((prev) => [...prev, data.sos]);
        } else throw new Error(data.error);
      } catch (err) {
        setError(err.message);
      }
      setSosSending(false);
    };
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => send(coords.latitude, coords.longitude),
      () => send(null, null),
    );
  }

  async function handleVideoCall() {
    setVideoLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/video-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.open(`https://meet.jit.si/deusizi-${data.room}`, "_blank");
    } catch (err) {
      setError(err.message);
    } finally {
      setVideoLoading(false);
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

  if (loading)
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading booking…</p>
      </div>
    );
  if (!booking)
    return <div className={styles.loading}>{error || "Booking not found"}</div>;

  const canSOS = ["confirmed", "in_progress"].includes(booking.status);
  const canVideo = ["confirmed", "in_progress"].includes(booking.status);
  const showMap = booking.status === "in_progress" && location;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>
      {activeSOS.length > 0 && (
        <div className={styles.sosBanner}>
          🚨 <strong>SOS ACTIVE</strong> — Emergency services notified.
          Triggered by: {activeSOS[0]?.triggered_by_name}
        </div>
      )}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Booking Details</h1>
        <span
          className={`${styles.statusBadge} ${STATUS_CLASS[booking.status] || styles.statusPending}`}
        >
          {booking.status === "in_progress"
            ? "In Progress"
            : booking.status?.replace(/_/g, " ")}
        </span>
      </div>

      {showMap && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            📍{" "}
            {booking.status === "in_progress"
              ? "Live Location"
              : booking.status === "completed"
                ? "Final Check-Out Location"
                : "Check-In Location"}
          </p>
          <LiveMap
            lat={location.lat}
            lng={location.lng}
            updatedAt={location.recorded_at}
          />
          <div className={styles.locationMeta}>
            <span
              className={`${styles.locationStatus} ${
                booking.status === "in_progress"
                  ? styles.locationLive
                  : styles.locationStatic
              }`}
            >
              {booking.status === "in_progress"
                ? "🟢 Tracking active"
                : "⚪ Last known location"}
            </span>
            {!isMaid && booking.status === "in_progress" && (
              <span className={styles.locationHint}>
                🧹 {booking.maid_name} is currently on your job
              </span>
            )}
            {isMaid && booking.status === "in_progress" && (
              <span className={styles.locationHint}>
                Your location is visible to the customer
              </span>
            )}
          </div>
        </div>
      )}
      {(canSOS || canVideo) && (
        <div className={styles.quickActions}>
          {canVideo && (
            <button
              className={styles.videoBtn}
              onClick={handleVideoCall}
              disabled={videoLoading}
            >
              {videoLoading ? "Connecting…" : "📹 Video Call"}
            </button>
          )}
          {canSOS && !sosSent && (
            <button
              className={styles.sosBtn}
              onClick={handleSOS}
              disabled={sosSending}
            >
              {sosSending ? "Sending…" : "🆘 SOS"}
            </button>
          )}
          {sosSent && (
            <span className={styles.sosSentTag}>
              ✅ SOS Sent — Help is coming
            </span>
          )}
        </div>
      )}
      {canSOS && !sosSent && (
        <div className={styles.sosInputWrap}>
          <input
            className={styles.sosInput}
            type="text"
            placeholder="Optional SOS message (e.g. I need help now)"
            value={sosMsg}
            onChange={(e) => setSosMsg(e.target.value)}
          />
        </div>
      )}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>{isMaid ? "Customer" : "Maid"}</p>
        <div className={styles.row}>
          <span className={styles.rowKey}>Name</span>
          <span className={styles.rowVal}>
            {isMaid ? booking.customer_name : booking.maid_name}
          </span>
        </div>
      </div>
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
        {booking.checkin_at && (
          <div className={styles.row}>
            <span className={styles.rowKey}>Checked In</span>
            <span className={styles.rowVal} style={{ color: "rgb(10,107,46)" }}>
              ✅ {new Date(booking.checkin_at).toLocaleTimeString()}
            </span>
          </div>
        )}
        {booking.checkout_at && (
          <div className={styles.row}>
            <span className={styles.rowKey}>Checked Out</span>
            <span className={styles.rowVal}>
              {new Date(booking.checkout_at).toLocaleTimeString()}
            </span>
          </div>
        )}
        <div className={styles.total}>
          <span>Total</span>
          <span>{fmtAmt(booking.total_amount, currency)}</span>
        </div>
      </div>
      {(booking.payment_status || payment) && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Payment</p>
          <div className={styles.row}>
            <span className={styles.rowKey}>Status</span>
            <span className={styles.rowVal}>
              {payment?.status || booking.payment_status}
            </span>
          </div>
          {payment?.gateway && (
            <div className={styles.row}>
              <span className={styles.rowKey}>Method</span>
              <span
                className={styles.rowVal}
                style={{ textTransform: "capitalize" }}
              >
                {payment.gateway.replace(/_/g, " ")}
              </span>
            </div>
          )}
          {payment?.currency && (
            <div className={styles.row}>
              <span className={styles.rowKey}>Currency</span>
              <span className={styles.rowVal}>{payment.currency}</span>
            </div>
          )}
          {payment?.amount && (
            <div className={styles.row}>
              <span className={styles.rowKey}>Amount charged</span>
              <span className={styles.rowVal}>
                {fmtAmt(payment.amount, currency)}
              </span>
            </div>
          )}
          {payment?.platform_fee && (
            <div className={styles.row}>
              <span className={styles.rowKey}>Platform fee (10%)</span>
              <span className={styles.rowVal}>
                {fmtAmt(payment.platform_fee, currency)}
              </span>
            </div>
          )}
        </div>
      )}
      {emergency.length > 0 && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            🆘 {isMaid ? "Customer's" : "Maid's"} Emergency Contacts
          </p>

          {emergency.map((c, i) => (
            <div key={i} className={styles.emergencyCard}>
              <div>
                <p className={styles.emergencyName}>{c.name}</p>
                <p className={styles.emergencyMeta}>{c.relationship}</p>
                {c.email && <p className={styles.emergencyEmail}>{c.email}</p>}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <a href={`tel:${c.phone}`} className={styles.callBtn}>
                  📞 {c.phone}
                </a>
                {c.email && (
                  <a href={`mailto:${c.email}`} className={styles.emailBtn}>
                    ✉️ Email
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        {isCustomer && booking.status === "awaiting_payment" && (
          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={() => navigate("/payment", { state: { booking } })}
          >
            🔒 Pay Now — {fmtAmt(booking.total_amount, currency)}
          </button>
        )}
        {isCustomer &&
          ["pending", "confirmed", "awaiting_payment"].includes(
            booking.status,
          ) && (
            <button
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              disabled={!!actionLoading}
              onClick={() => updateStatus("cancelled")}
            >
              {actionLoading === "cancelled" ? "Cancelling…" : "Cancel Booking"}
            </button>
          )}
        {isMaid && booking.status === "pending" && (
          <>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              disabled={!!actionLoading}
              onClick={() => updateStatus("confirmed")}
            >
              {actionLoading === "confirmed" ? "Accepting…" : "✅ Accept"}
            </button>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              disabled={!!actionLoading}
              onClick={() => updateStatus("declined")}
            >
              Decline
            </button>
          </>
        )}
        {isMaid && booking.status === "confirmed" && !booking.checkin_at && (
          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            disabled={actionLoading === "checkin"}
            onClick={handleCheckIn}
          >
            {actionLoading === "checkin"
              ? "Checking in…"
              : "📍 Check In & Start Job"}
          </button>
        )}
        {isMaid && booking.status === "in_progress" && (
          <>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              disabled={actionLoading === "checkout"}
              onClick={handleCheckOut}
            >
              {actionLoading === "checkout" ? "Checking out…" : "📍 Check Out"}
            </button>
            <button
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              disabled={actionLoading === "completed"}
              onClick={() => updateStatus("completed")}
            >
              {actionLoading === "completed"
                ? "Completing…"
                : "✅ Mark Complete"}
            </button>
          </>
        )}
      </div>
      {isCustomer && booking.status === "completed" && !reviewed && (
        <div className={styles.section} style={{ marginTop: 16 }}>
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
              placeholder="Share your experience (optional)…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              onClick={submitReview}
              disabled={reviewLoading}
            >
              {reviewLoading ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </div>
      )}
      {reviewed && (
        <div
          className={styles.section}
          style={{ textAlign: "center", marginTop: 16 }}
        >
          <p
            style={{
              color: "rgb(10,107,46)",
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
