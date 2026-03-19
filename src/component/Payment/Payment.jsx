import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import styles from "./Payment.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  const [booking, setBooking] = useState(state?.booking || null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'failed'
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  // If Paystack redirected back with a reference, verify it
  useEffect(() => {
    if (!reference) return;
    setVerifying(true);
    fetch(`${API_URL}/api/payments/verify/${reference}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          // Fetch updated booking
          if (data.booking_id) {
            fetch(`${API_URL}/api/bookings/${data.booking_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((r) => r.json())
              .then((d) => {
                if (d.booking) setBooking(d.booking);
              });
          }
        } else {
          setStatus("failed");
          setError(data.error || "Payment verification failed");
        }
      })
      .catch(() => {
        setStatus("failed");
        setError("Network error during verification");
      })
      .finally(() => setVerifying(false));
  }, [reference]);

  async function handlePay() {
    if (!booking) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/payments/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ booking_id: booking.id }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to initialize payment");
      // Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (verifying) {
    return (
      <div className={styles.page}>
        <div
          className={styles.card}
          style={{ textAlign: "center", padding: 40 }}
        >
          <p style={{ fontSize: 14, color: "gray" }}>
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={styles.page}>
        <div className={`${styles.statusCard} ${styles.statusSuccess}`}>
          <div className={styles.statusIcon}>✅</div>
          <p className={styles.statusTitle}>Payment Successful!</p>
          <p className={styles.statusText}>
            Your payment has been received. Our admin team will review and
            confirm your booking shortly. The maid will be notified once
            approved — usually within a few minutes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className={styles.actionBtn}
              onClick={() => navigate("/my-bookings")}
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "none",
                color: "rgb(10,107,46)",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                textDecoration: "underline",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={styles.page}>
        <div className={`${styles.statusCard} ${styles.statusFailed}`}>
          <div className={styles.statusIcon}>❌</div>
          <p className={styles.statusTitle}>Payment Failed</p>
          <p className={styles.statusText}>
            {error || "Your payment could not be processed. Please try again."}
          </p>
          <button
            className={styles.actionBtn}
            onClick={() => navigate("/my-bookings")}
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: "center" }}>
          <p style={{ color: "gray", fontSize: 14 }}>No booking found.</p>
          <button
            className={styles.actionBtn}
            style={{ marginTop: 16 }}
            onClick={() => navigate("/my-bookings")}
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/my-bookings")}
      >
        ← My Bookings
      </button>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Booking Summary</p>
        <div className={styles.row}>
          <span className={styles.rowKey}>Maid</span>
          <span className={styles.rowVal}>{booking.maid_name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowKey}>Date</span>
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
        <div className={styles.totalRow}>
          <span>Total</span>
          <span>₦{Number(booking.total_amount).toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>How it works</p>
        <div style={{ fontSize: 13, color: "gray", lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 6px" }}>
            1️⃣ &nbsp;Pay securely via Paystack
          </p>
          <p style={{ margin: "0 0 6px" }}>
            2️⃣ &nbsp;Admin reviews and approves your booking
          </p>
          <p style={{ margin: 0 }}>
            3️⃣ &nbsp;Maid is notified and confirms the schedule
          </p>
        </div>
      </div>

      {error && (
        <p
          style={{
            color: "red",
            fontSize: 13,
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          {error}
        </p>
      )}

      <button className={styles.payBtn} onClick={handlePay} disabled={loading}>
        {loading ? (
          "Redirecting to Paystack..."
        ) : (
          <>
            🔒 Pay ₦{Number(booking.total_amount).toLocaleString()} securely
            <span className={styles.paystackLogo}>• Paystack</span>
          </>
        )}
      </button>

      <div className={styles.secureNote}>
        🔐 Secured by Paystack · Your card details are never stored
      </div>
    </div>
  );
}
