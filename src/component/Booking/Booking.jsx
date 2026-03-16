import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Booking.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

export default function Booking() {
  const { maidId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const maid = state?.maid || {};

  const [form, setForm] = useState({
    service_date: "",
    duration_hours: "2",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const total =
    Number(maid.hourly_rate || 0) * Number(form.duration_hours || 0);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit() {
    if (!form.service_date) return setError("Please select a service date");
    if (!form.address) return setError("Please enter your address");
    if (!form.duration_hours || Number(form.duration_hours) < 1)
      return setError("Minimum 1 hour");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          maid_id: maidId,
          service_date: form.service_date,
          duration_hours: Number(form.duration_hours),
          address: form.address,
          notes: form.notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setSuccess(data.booking);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <p className={styles.successTitle}>✓ Booking Confirmed!</p>
          <p className={styles.successText}>
            Your booking with {maid.name} has been submitted. You will receive a
            confirmation once the maid accepts.
          </p>
          <button
            className={styles.successBtn}
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
      <button className={styles.backBtn} onClick={() => navigate("/maids")}>
        ← Back to maids
      </button>

      {/* Maid summary */}
      <div className={styles.maidCard}>
        {maid.avatar ? (
          <img src={maid.avatar} alt={maid.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{initials(maid.name)}</div>
        )}
        <div>
          <p className={styles.maidName}>{maid.name || "Selected Maid"}</p>
          <p className={styles.maidRate}>
            ₦{Number(maid.hourly_rate || 0).toLocaleString()} / hour
          </p>
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Service Date & Time*</label>
          <input
            className={styles.input}
            type="datetime-local"
            name="service_date"
            value={form.service_date}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Duration (hours)*</label>
            <input
              className={styles.input}
              type="number"
              name="duration_hours"
              value={form.duration_hours}
              onChange={handleChange}
              min="1"
              max="12"
              step="0.5"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Total Cost</label>
            <input
              className={styles.input}
              type="text"
              value={`₦${total.toLocaleString()}`}
              readOnly
              style={{
                background: "rgb(248, 248, 248)",
                color: "rgb(19, 19, 103)",
                fontWeight: "bold",
              }}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Service Address*</label>
          <input
            className={styles.input}
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. 12 Banana Street, Lekki, Lagos"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notes (optional)</label>
          <textarea
            className={styles.textarea}
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any special instructions for the maid..."
          />
        </div>

        <div className={styles.summary}>
          <p className={styles.summaryTitle}>Booking Summary</p>
          <div className={styles.summaryRow}>
            <span>Maid</span>
            <span>{maid.name || "—"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Rate</span>
            <span>₦{Number(maid.hourly_rate || 0).toLocaleString()}/hr</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Duration</span>
            <span>{form.duration_hours} hour(s)</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
