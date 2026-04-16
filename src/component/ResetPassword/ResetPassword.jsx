// src/component/ResetPassword/ResetPassword.jsx
// Handles /reset-password/:token route
// Shows new password form, submits to API

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API = API_URL.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

function strengthScore(pwd) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

const STRENGTH_LABEL = [
  "",
  "Very weak",
  "Weak",
  "Fair",
  "Strong",
  "Very strong",
];
const STRENGTH_COLOR = [
  "",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#16a34a",
];

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const score = strengthScore(password);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>Deusizi Sparkle</div>

        {done ? (
          <>
            <div className={styles.icon}>🎉</div>
            <h2 className={styles.title}>Password reset!</h2>
            <p className={styles.subtitle}>
              Your password has been updated. You can now sign in with your new
              password.
            </p>
            <button
              className={styles.btn}
              onClick={() => navigate("/login", { replace: true })}
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            <div className={styles.icon}>🔐</div>
            <h2 className={styles.title}>Set new password</h2>
            <p className={styles.subtitle}>
              Choose a strong password for your account.
            </p>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>New password</label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.eye}
                    onClick={() => setShowPwd((s) => !s)}
                    tabIndex={-1}
                  >
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>

                {password && (
                  <div className={styles.strengthWrap}>
                    <div className={styles.strengthTrack}>
                      <div
                        className={styles.strengthFill}
                        style={{
                          width: `${(score / 5) * 100}%`,
                          background: STRENGTH_COLOR[score],
                        }}
                      />
                    </div>
                    <span
                      className={styles.strengthLabel}
                      style={{ color: STRENGTH_COLOR[score] }}
                    >
                      {STRENGTH_LABEL[score]}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Confirm password</label>
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${confirm && confirm !== password ? styles.inputError : ""}`}
                    type={showPwd ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat new password"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
                {confirm && confirm !== password && (
                  <p className={styles.fieldError}>Passwords do not match</p>
                )}
              </div>

              <ul className={styles.tips}>
                {[
                  [password.length >= 8, "At least 8 characters"],
                  [/[A-Z]/.test(password), "One uppercase letter"],
                  [/[0-9]/.test(password), "One number"],
                  [/[^A-Za-z0-9]/.test(password), "One special character"],
                ].map(([met, text], i) => (
                  <li key={i} style={{ color: met ? "#16a34a" : "#9ca3af" }}>
                    {met ? "✓" : "○"} {text}
                  </li>
                ))}
              </ul>

              {error && (
                <div className={styles.errorBox}>
                  <span className={styles.errorDot} />
                  <p>{error}</p>
                </div>
              )}

              <button type="submit" className={styles.btn} disabled={loading}>
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
