// src/pages/settings/components/ResetPinPage.jsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaSpinner, FaLock } from "react-icons/fa";
import styles from "../../pages/settings/Settings.module.css";

const API = (() => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  return raw.replace(/\/$/, "").replace(/\/api$/, "") + "/api";
})();

// ── PIN Input (copied from PinSettings) ──
function PinInput({ value, onChange, length = 6, disabled }) {
  const inputs = useRef([]);
  const digits = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  function handleChange(i, e) {
    const val = e.target.value.replace(/\D/, "").slice(-1);
    const next = [...digits];
    next[i] = val;
    onChange(next.join(""));
    if (val && i < length - 1) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      inputs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1)
      inputs.current[i + 1]?.focus();
  }

  function handlePaste(e) {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (pasted) {
      onChange(pasted.padEnd(length, "").slice(0, length));
      e.preventDefault();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "center",
        margin: "16px 0",
      }}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={styles.input}
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: "1.4rem",
            fontWeight: 700,
            borderColor: d ? "var(--ds-navy)" : "var(--ds-border)",
            borderRadius: 10,
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function ResetPinPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setToast({
        message: "Invalid or missing reset token. Please request a new link.",
        type: "error",
      });
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) {
      setToast({
        message: "Invalid token. Please request a new link.",
        type: "error",
      });
      return;
    }
    if (pin.length < 4) {
      setToast({ message: "PIN must be 4–6 digits", type: "error" });
      return;
    }
    if (pin !== confirm) {
      setToast({ message: "PINs do not match", type: "error" });
      return;
    }

    setLoading(true);
    setToast({ message: "", type: "" });

    try {
      const res = await fetch(`${API}/settings/pin/reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_pin: pin, confirm_new_pin: confirm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setSuccess(true);
      setToast({
        message: data.message || "PIN reset successful!",
        type: "success",
      });
      // Redirect to login or settings after a delay
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px" }}>
      <div
        className={styles.section}
        style={{ background: "white", borderRadius: 16, padding: 32 }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <FaLock style={{ color: "#1e3a8a" }} /> Reset Transaction PIN
        </h1>
        <p style={{ color: "gray", marginBottom: 24 }}>
          Enter a new 4–6 digit PIN for your transactions.
        </p>

        {toast.message && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              marginBottom: 16,
              background: toast.type === "error" ? "#fee2e2" : "#dcfce7",
              color: toast.type === "error" ? "#991b1b" : "#166534",
            }}
          >
            {toast.message}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <FaCheckCircle style={{ fontSize: 48, color: "#16a34a" }} />
            <p style={{ fontSize: 18, fontWeight: "bold", marginTop: 12 }}>
              PIN reset successful!
            </p>
            <p style={{ color: "gray" }}>Redirecting to login…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>New PIN</label>
              <PinInput
                value={pin}
                onChange={setPin}
                disabled={loading || !token}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Confirm PIN</label>
              <PinInput
                value={confirm}
                onChange={setConfirm}
                disabled={loading || !token}
              />
            </div>

            {pin.length >= 4 && confirm.length >= 4 && pin !== confirm && (
              <p
                style={{ textAlign: "center", color: "#dc2626", fontSize: 14 }}
              >
                PINs do not match
              </p>
            )}
            {pin.length >= 4 && confirm.length >= 4 && pin === confirm && (
              <p
                style={{ textAlign: "center", color: "#16a34a", fontSize: 14 }}
              >
                <FaCheckCircle style={{ marginRight: 6 }} /> PINs match
              </p>
            )}

            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => navigate("/login")}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={
                  loading || !token || pin.length < 4 || pin !== confirm
                }
                style={{ flex: 2 }}
              >
                {loading ? (
                  <>
                    <FaSpinner className={styles.spinner} /> Resetting…
                  </>
                ) : (
                  "Reset PIN"
                )}
              </button>
            </div>

            {!token && (
              <p
                style={{ textAlign: "center", color: "#dc2626", marginTop: 12 }}
              >
                No token provided. Please use the link from your email.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
