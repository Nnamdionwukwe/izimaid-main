// src/pages/settings/components/SecuritySettings.jsx
import { useState } from "react";
import { changePassword } from "../../../hooks/useSettings";
import {
  Section,
  Field,
  Input,
  SaveButton,
  Toast,
  DangerButton,
} from "./SettingsUI";

export default function SecuritySettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  function validate() {
    const e = {};
    if (!form.currentPassword)
      e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    if (form.newPassword.length < 8)
      e.newPassword = "Password must be at least 8 characters";
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (form.currentPassword === form.newPassword)
      e.newPassword = "New password must be different";
    return e;
  }

  // Password strength checker
  function strength(pwd) {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }

  const pwdStrength = strength(form.newPassword);
  const strengthLabel = [
    "",
    "Very weak",
    "Weak",
    "Fair",
    "Strong",
    "Very strong",
  ][pwdStrength];
  const strengthColor = [
    "",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#16a34a",
  ][pwdStrength];

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setToast({ message: "Password changed successfully", type: "success" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setToast({
        message: err.message || "Incorrect current password",
        type: "error",
      });
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

      {/* Change password */}
      <Section
        title="Change password"
        description="Use a strong password with a mix of letters, numbers, and symbols."
      >
        <form onSubmit={handleSubmit} className="ds-form">
          <Field label="Current password" error={errors.currentPassword}>
            <div className="ds-input-icon-wrap">
              <Input
                type={showPwd ? "text" : "password"}
                value={form.currentPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, currentPassword: e.target.value }))
                }
                placeholder="Enter current password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="ds-input-icon-btn"
                onClick={() => setShowPwd((s) => !s)}
                tabIndex={-1}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </Field>

          <Field label="New password" error={errors.newPassword}>
            <Input
              type={showPwd ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, newPassword: e.target.value }))
              }
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            {form.newPassword && (
              <div className="ds-strength-bar">
                <div
                  className="ds-strength-fill"
                  style={{
                    width: `${(pwdStrength / 5) * 100}%`,
                    background: strengthColor,
                  }}
                />
                <span
                  className="ds-strength-label"
                  style={{ color: strengthColor }}
                >
                  {strengthLabel}
                </span>
              </div>
            )}
          </Field>

          <Field label="Confirm new password" error={errors.confirmPassword}>
            <Input
              type={showPwd ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </Field>

          <div className="ds-pwd-tips">
            <p>Your password should:</p>
            <ul>
              {[
                [form.newPassword.length >= 8, "Be at least 8 characters"],
                [/[A-Z]/.test(form.newPassword), "Contain an uppercase letter"],
                [/[0-9]/.test(form.newPassword), "Contain a number"],
                [
                  /[^A-Za-z0-9]/.test(form.newPassword),
                  "Contain a special character",
                ],
              ].map(([met, text], i) => (
                <li key={i} style={{ color: met ? "#16a34a" : "#94a3b8" }}>
                  {met ? "✓" : "○"} {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="ds-form-footer">
            <SaveButton loading={saving}>Change password</SaveButton>
          </div>
        </form>
      </Section>

      {/* Active sessions info */}
      <Section
        title="Account security"
        description="Tips to keep your account safe."
      >
        <div className="ds-security-tips">
          {[
            {
              icon: "🔑",
              title: "Strong password",
              text: "Use a unique password not used on other sites.",
            },
            {
              icon: "📧",
              title: "Verify your email",
              text: "Keep your email verified for account recovery.",
            },
            {
              icon: "🔔",
              title: "Login alerts",
              text: "We'll email you when a new device signs in.",
            },
            {
              icon: "🚫",
              title: "Suspicious activity",
              text: "Contact support immediately if you notice unusual activity.",
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

      {/* Danger zone */}
      <Section title="Danger zone">
        <div className="ds-danger-zone">
          <div className="ds-danger-item">
            <div>
              <div className="ds-danger-title">Delete account</div>
              <div className="ds-danger-desc">
                Permanently delete your account and all data. This cannot be
                undone.
              </div>
            </div>
            <DangerButton
              onClick={() => {
                if (
                  window.confirm(
                    "Are you absolutely sure? This will permanently delete your account.",
                  )
                ) {
                  setToast({
                    message: "Please contact support to delete your account.",
                    type: "error",
                  });
                }
              }}
            >
              Delete account
            </DangerButton>
          </div>
        </div>
      </Section>
    </div>
  );
}
