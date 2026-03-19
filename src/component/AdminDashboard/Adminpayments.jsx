import { useState, useEffect, useCallback } from "react";
import styles from "./AdminDashboard.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPayments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [msg, setMsg] = useState({});

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/payments/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  async function handleAction(booking_id, action) {
    setProcessing((p) => ({ ...p, [booking_id]: action }));
    setMsg((m) => ({ ...m, [booking_id]: null }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/payments/${action}/${booking_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body:
            action === "reject"
              ? JSON.stringify({ reason: "Admin rejected" })
              : undefined,
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg((m) => ({
        ...m,
        [booking_id]: {
          type: "success",
          text:
            action === "approve"
              ? "✓ Approved — maid notified"
              : "✗ Rejected — refund required",
        },
      }));
      // Remove from list after 2s
      setTimeout(() => {
        setBookings((b) => b.filter((x) => x.booking_id !== booking_id));
      }, 2000);
    } catch (err) {
      setMsg((m) => ({
        ...m,
        [booking_id]: { type: "error", text: err.message },
      }));
    } finally {
      setProcessing((p) => ({ ...p, [booking_id]: null }));
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <p
          className={styles.sectionTitle || ""}
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "rgb(19,19,103)",
            margin: 0,
          }}
        >
          Pending Payment Approvals
        </p>
        <span
          style={{
            background: "rgb(255,243,205)",
            color: "rgb(133,100,4)",
            fontSize: 11,
            fontWeight: "bold",
            padding: "3px 10px",
            borderRadius: 20,
          }}
        >
          {bookings.length} pending
        </span>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "gray",
            fontSize: 14,
          }}
        >
          Loading...
        </div>
      ) : bookings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "gray",
            fontSize: 14,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
          No pending bookings to review
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bookings.map((b) => (
            <div
              key={b.booking_id}
              style={{
                background: "white",
                border: "1px solid rgb(228,228,228)",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "rgb(30,30,30)",
                      margin: "0 0 2px",
                    }}
                  >
                    {b.customer_name}
                  </p>
                  <p style={{ fontSize: 12, color: "gray", margin: 0 }}>
                    {b.customer_email}
                  </p>
                </div>
                <span
                  style={{
                    background: "rgb(209,247,224)",
                    color: "rgb(10,107,46)",
                    fontSize: 11,
                    fontWeight: "bold",
                    padding: "4px 10px",
                    borderRadius: 20,
                  }}
                >
                  Paid ✓
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  marginBottom: 10,
                }}
              >
                {[
                  ["Maid", b.maid_name],
                  ["Date", formatDate(b.service_date)],
                  ["Duration", `${b.duration_hours}h`],
                  ["Amount", `₦${Number(b.total_amount).toLocaleString()}`],
                  ["Paid at", b.paid_at ? formatDate(b.paid_at) : "—"],
                  ["Ref", b.paystack_reference?.slice(-8)],
                ].map(([k, v]) => (
                  <div key={k} style={{ fontSize: 12, color: "gray" }}>
                    {k}:{" "}
                    <span
                      style={{ fontWeight: "bold", color: "rgb(47,47,47)" }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, color: "gray", marginBottom: 12 }}>
                📍 {b.address}
              </div>

              {msg[b.booking_id] && (
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    marginBottom: 10,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background:
                      msg[b.booking_id].type === "success"
                        ? "rgb(209,247,224)"
                        : "rgb(255,228,228)",
                    color:
                      msg[b.booking_id].type === "success"
                        ? "rgb(10,107,46)"
                        : "rgb(168,28,28)",
                  }}
                >
                  {msg[b.booking_id].text}
                </p>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleAction(b.booking_id, "approve")}
                  disabled={!!processing[b.booking_id]}
                  style={{
                    flex: 1,
                    height: 38,
                    background: "rgb(10,107,46)",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    opacity: processing[b.booking_id] ? 0.6 : 1,
                  }}
                >
                  {processing[b.booking_id] === "approve"
                    ? "Approving..."
                    : "✓ Approve"}
                </button>
                <button
                  onClick={() => handleAction(b.booking_id, "reject")}
                  disabled={!!processing[b.booking_id]}
                  style={{
                    flex: 1,
                    height: 38,
                    background: "white",
                    color: "rgb(187,19,47)",
                    border: "1px solid rgb(255,200,200)",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    opacity: processing[b.booking_id] ? 0.6 : 1,
                  }}
                >
                  {processing[b.booking_id] === "reject"
                    ? "Rejecting..."
                    : "✗ Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
