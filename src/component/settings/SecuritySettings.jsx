// src/pages/settings/components/SecuritySettings.jsx
import { useState } from "react";
import styles from "../../pages/settings/Settings.module.css";
import {
  Section,
  Field,
  Input,
  SaveButton,
  Toast,
  DangerButton,
  SecondaryButton,
} from "./SettingsUI";
import { changePassword } from "../../pages/hooks/useSettings";
import {
  FaEye,
  FaEyeSlash,
  FaKey,
  FaEnvelope,
  FaBell,
  FaBan,
  FaCheck,
  FaCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  function strength(pwd) {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (pwd.length >= 12) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
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

  function openDeleteModal() {
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
  }

  function confirmDelete() {
    closeDeleteModal();
    setToast({
      message: "Please contact support to delete your account.",
      type: "error",
    });
  }

  return (
    <div>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* ─── Delete Account Modal ─── */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={closeDeleteModal}
        >
          <div
            style={{
              background: "var(--ds-bg-card, #fff)",
              borderRadius: "16px",
              maxWidth: "460px",
              width: "100%",
              padding: "32px 28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDeleteModal}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "1.4rem",
                color: "var(--ds-text-muted, #6a6a7a)",
                cursor: "pointer",
                padding: "4px",
                lineHeight: 1,
              }}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <FaExclamationTriangle
                  style={{ fontSize: "2rem", color: "#dc2626" }}
                />
                <h2
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    margin: 0,
                    color: "var(--ds-text, #1a1a2e)",
                  }}
                >
                  Delete Account
                </h2>
              </div>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--ds-text-secondary, #4a4a5a)",
                  margin: "0 0 8px",
                  lineHeight: 1.6,
                }}
              >
                Are you absolutely sure? This action will permanently delete:
              </p>
              <ul
                style={{
                  fontSize: "0.9rem",
                  color: "var(--ds-text-secondary, #4a4a5a)",
                  margin: "8px 0 0 20px",
                  lineHeight: 1.8,
                }}
              >
                <li>Your account and all profile data</li>
                <li>All bookings and history</li>
                <li>Any earnings and payout records</li>
                <li>This cannot be undone</li>
              </ul>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                marginTop: "8px",
              }}
            >
              <SecondaryButton onClick={closeDeleteModal}>
                Cancel
              </SecondaryButton>
              <DangerButton onClick={confirmDelete}>
                Yes, delete my account
              </DangerButton>
            </div>
          </div>
        </div>
      )}

      <Section
        title="Change password"
        description="Use a strong password with a mix of letters, numbers, and symbols."
      >
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <Field label="Current password" error={errors.currentPassword}>
              <div className={styles.inputGroup}>
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
                  className={styles.inputSuffix}
                  onClick={() => setShowPwd((s) => !s)}
                  tabIndex={-1}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
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
                <div className={styles.strengthBar}>
                  <div
                    className={styles.strengthFill}
                    style={{
                      width: `${(pwdStrength / 5) * 100}%`,
                      background: strengthColor,
                    }}
                  />
                  <span
                    className={styles.strengthLabel}
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
          </div>

          <div className={styles.pwdTips}>
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
                <li key={i} style={{ color: met ? "#16a34a" : "#9fa4bf" }}>
                  {met ? (
                    <FaCheck style={{ marginRight: 6 }} />
                  ) : (
                    <FaCircle style={{ marginRight: 6 }} />
                  )}
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.formFooter}>
            <SaveButton loading={saving}>
              {saving ? (
                <>
                  <FaSpinner className={styles.spinner} /> Changing…
                </>
              ) : (
                "Change password"
              )}
            </SaveButton>
          </div>
        </form>
      </Section>

      <Section
        title="Account security"
        description="Tips to keep your account safe."
      >
        <div className={styles.securityTips}>
          {[
            {
              icon: <FaKey style={{ fontSize: 20 }} />,
              title: "Strong password",
              text: "Use a unique password not used on other sites.",
            },
            {
              icon: <FaEnvelope style={{ fontSize: 20 }} />,
              title: "Verify your email",
              text: "Keep your email verified for account recovery.",
            },
            {
              icon: <FaBell style={{ fontSize: 20 }} />,
              title: "Login alerts",
              text: "We'll email you when a new device signs in.",
            },
            {
              icon: <FaBan style={{ fontSize: 20 }} />,
              title: "Suspicious activity",
              text: "Contact support immediately if you notice unusual activity.",
            },
          ].map((tip, i) => (
            <div key={i} className={styles.securityTip}>
              <span className={styles.securityTipIcon}>{tip.icon}</span>
              <div>
                <div className={styles.securityTipTitle}>{tip.title}</div>
                <div className={styles.securityTipText}>{tip.text}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Danger zone">
        <div className={styles.dangerZone}>
          <div className={styles.dangerItem}>
            <div>
              <div className={styles.dangerTitle}>Delete account</div>
              <div className={styles.dangerDesc}>
                Permanently delete your account and all data. This cannot be
                undone.
              </div>
            </div>
            <DangerButton onClick={openDeleteModal}>
              Delete account
            </DangerButton>
          </div>
        </div>
      </Section>
    </div>
  );
}
