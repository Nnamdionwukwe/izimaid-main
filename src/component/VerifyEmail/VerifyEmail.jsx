// src/component/VerifyEmail/VerifyEmail.jsx
// Handles /verify-email/:token route
// Automatically verifies on mount, shows result

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./VerifyEmail.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API = API_URL.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`${API}/auth/verify-email/${token}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(
            data.error || "Verification failed. The link may have expired.",
          );
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, [token]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {status === "verifying" && (
          <>
            <div className={styles.spinner} />
            <h2 className={styles.title}>Verifying your email…</h2>
            <p className={styles.subtitle}>Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className={styles.icon}>✅</div>
            <h2 className={styles.title}>Email verified!</h2>
            <p className={styles.subtitle}>{message}</p>
            <button
              className={styles.btn}
              onClick={() => navigate("/login", { replace: true })}
            >
              Sign in now
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className={styles.icon}>❌</div>
            <h2 className={styles.title}>Verification failed</h2>
            <p className={styles.subtitle}>{message}</p>
            <div className={styles.actions}>
              <button
                className={styles.btn}
                onClick={() => navigate("/login", { replace: true })}
              >
                Back to login
              </button>
              <button
                className={`${styles.btn} ${styles.btnOutline}`}
                onClick={() => navigate("/resend-verification")}
              >
                Resend link
              </button>
            </div>
          </>
        )}

        <div className={styles.brand}>Deusizi Sparkle</div>
      </div>
    </div>
  );
}
