// src/pages/settings/components/PinSettings.jsx
import { useState, useEffect, useRef } from "react";
import {
  Section,
  Field,
  SaveButton,
  DangerButton,
  Toast,
  Badge,
} from "./SettingsUI";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

// Single 4-6 digit PIN input — splits into boxes
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
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
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
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: "1.4rem",
            fontWeight: 700,
            border: `2px solid ${d ? "var(--ds-navy)" : "var(--ds-border)"}`,
            borderRadius: 10,
            background: "var(--ds-white)",
            color: "var(--ds-text)",
            outline: "none",
            transition: "border-color 150ms",
            fontFamily: "var(--ds-font)",
          }}
        />
      ))}
    </div>
  );
}

export default function PinSettings() {
  const [status, setStatus] = useState(null);
  const [mode, setMode] = useState(null); // 'set' | 'change' | null
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  // Set PIN form
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");

  // Change PIN form
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newConfirm, setNewConfirm] = useState("");

  useEffect(() => {
    fetch(`${API}/settings/pin/status`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setStatus(d));
  }, []);

  function resetForms() {
    setPin("");
    setConfirm("");
    setOldPin("");
    setNewPin("");
    setNewConfirm("");
    setMode(null);
  }

  async function handleSetPin(e) {
    e.preventDefault();
    if (pin.length < 4) {
      setToast({ message: "PIN must be 4–6 digits", type: "error" });
      return;
    }
    if (pin !== confirm) {
      setToast({ message: "PINs do not match", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/settings/pin/set`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ pin, confirm_pin: confirm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast({
        message: "Transaction PIN set successfully 🎉",
        type: "success",
      });
      setStatus((prev) => ({
        ...prev,
        pin_set: true,
        pin_set_at: new Date().toISOString(),
      }));
      resetForms();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePin(e) {
    e.preventDefault();
    if (newPin.length < 4) {
      setToast({ message: "PIN must be 4–6 digits", type: "error" });
      return;
    }
    if (newPin !== newConfirm) {
      setToast({ message: "New PINs do not match", type: "error" });
      return;
    }
    if (oldPin === newPin) {
      setToast({
        message: "New PIN must differ from current PIN",
        type: "error",
      });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/settings/pin/change`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          current_pin: oldPin,
          new_pin: newPin,
          confirm_new_pin: newConfirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast({
        message: "Transaction PIN changed successfully",
        type: "success",
      });
      resetForms();
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleRequestReset() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/settings/pin/reset/request`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast({
        message: "PIN reset link sent to your email",
        type: "success",
      });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Status */}
      <Section
        title="Transaction PIN"
        description="Your PIN is required every time you request a withdrawal. This protects your earnings even if your account is compromised."
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            {status?.pin_set ? (
              <>
                <Badge color="green">PIN active</Badge>
                {status.pin_set_at && (
                  <span className="ds-hint" style={{ marginLeft: 10 }}>
                    Set {new Date(status.pin_set_at).toLocaleDateString()}
                  </span>
                )}
                {status.is_locked && (
                  <div style={{ marginTop: 8 }}>
                    <Badge color="red">Locked</Badge>
                    <span className="ds-hint" style={{ marginLeft: 8 }}>
                      Unlocks{" "}
                      {new Date(status.locked_until).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <Badge color="red">PIN not set</Badge>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {!status?.pin_set ? (
              <button className="ds-btn-primary" onClick={() => setMode("set")}>
                Set PIN
              </button>
            ) : (
              <button
                className="ds-btn-secondary"
                onClick={() => setMode(mode === "change" ? null : "change")}
              >
                Change PIN
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Set PIN form */}
      {mode === "set" && (
        <Section title="Set your transaction PIN">
          <form onSubmit={handleSetPin}>
            <p className="ds-hint" style={{ marginBottom: 8 }}>
              Choose a 4–6 digit PIN. Don't use obvious numbers like 1234 or
              your birthday.
            </p>

            <Field label="Enter PIN">
              <PinInput value={pin} onChange={setPin} disabled={saving} />
            </Field>

            <Field label="Confirm PIN">
              <PinInput
                value={confirm}
                onChange={setConfirm}
                disabled={saving}
              />
            </Field>

            {pin.length >= 4 && confirm.length >= 4 && pin !== confirm && (
              <p className="ds-error" style={{ textAlign: "center" }}>
                PINs do not match
              </p>
            )}
            {pin.length >= 4 && confirm.length >= 4 && pin === confirm && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--ds-green)",
                  fontSize: ".85rem",
                }}
              >
                ✓ PINs match
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                type="button"
                className="ds-btn-secondary"
                onClick={resetForms}
              >
                Cancel
              </button>
              <SaveButton
                loading={saving}
                disabled={pin.length < 4 || pin !== confirm}
              >
                Set PIN
              </SaveButton>
            </div>
          </form>
        </Section>
      )}

      {/* Change PIN form */}
      {mode === "change" && (
        <Section title="Change your transaction PIN">
          <form onSubmit={handleChangePin}>
            <Field label="Current PIN">
              <PinInput value={oldPin} onChange={setOldPin} disabled={saving} />
            </Field>
            <Field label="New PIN">
              <PinInput value={newPin} onChange={setNewPin} disabled={saving} />
            </Field>
            <Field label="Confirm new PIN">
              <PinInput
                value={newConfirm}
                onChange={setNewConfirm}
                disabled={saving}
              />
            </Field>

            {newPin.length >= 4 &&
              newConfirm.length >= 4 &&
              newPin === newConfirm && (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--ds-green)",
                    fontSize: ".85rem",
                  }}
                >
                  ✓ PINs match
                </p>
              )}

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <button
                type="button"
                className="ds-btn-secondary"
                onClick={resetForms}
              >
                Cancel
              </button>
              <SaveButton loading={saving}>Change PIN</SaveButton>
            </div>
          </form>
        </Section>
      )}

      {/* Forgot PIN */}
      {status?.pin_set && (
        <Section title="Forgot your PIN?">
          <p className="ds-hint" style={{ marginBottom: 12 }}>
            We'll send a reset link to your registered email address.
          </p>
          <DangerButton loading={saving} onClick={handleRequestReset}>
            Send PIN reset email
          </DangerButton>
        </Section>
      )}

      {/* Security info */}
      <Section title="How the PIN works">
        <div className="ds-security-tips">
          {[
            {
              icon: "🔐",
              title: "Required on every withdrawal",
              text: "You must enter your PIN each time you request a payout. It can't be skipped.",
            },
            {
              icon: "🔒",
              title: "Auto-lock after 5 wrong attempts",
              text: "After 5 incorrect attempts your PIN locks for 30 minutes to prevent brute-force attacks.",
            },
            {
              icon: "📧",
              title: "Reset via email",
              text: "If you forget your PIN, use the email reset link. No admin can see or override your PIN.",
            },
            {
              icon: "🔑",
              title: "Separate from your login password",
              text: "Your PIN only protects withdrawals — changing your password doesn't change your PIN.",
            },
          ].map((tip, i) => (
            <div key={i} className="ds-security-tip">
              <span className="ds-security-tip-icon">{tip.icon}</span>
              <div>
                <div className="ds-security-tip-title">{tip.title}</div>
                <div className="ds-security-tip-text">{tip.text}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
