import { useState, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import styles from "./Login.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Login({ onSuccess }) {
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSuccess = useCallback(
    async (tokenResponse) => {
      setLoading(true);
      setError(null);

      try {
        // Exchange access token for ID token via Google userinfo
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        const userInfo = await userInfoRes.json();

        // Send to our backend
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: tokenResponse.access_token,
            role,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Authentication failed");
        }

        // Store token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onSuccess?.(data);
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [role, onSuccess],
  );

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setError("Google sign-in was cancelled or failed.");
      setLoading(false);
    },
  });

  const handleLogin = () => {
    setError(null);
    setLoading(true);
    login();
  };

  return (
    <div className={styles.page}>
      {/* ─── Left panel ─── */}
      <div className={styles.left}>
        <div className={styles.leftPattern} />
        <div className={styles.leftGrid} />

        <div className={styles.brand}>
          <h1 className={styles.brandName}>Deusizi Sparkle</h1>
          <p className={styles.brandTagline}>Home services, simplified</p>
        </div>

        <div className={styles.leftContent}>
          <h2 className={styles.leftHeading}>
            Your home,
            <br />
            <span className={styles.leftHeadingAccent}>perfectly</span>
            <br />
            taken care of.
          </h2>
          <p className={styles.leftDesc}>
            Connect with trusted, vetted cleaning professionals in your area.
            Book in minutes, enjoy a spotless home.
          </p>
          <div className={styles.leftStats}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>Verified maids</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>98%</div>
              <div className={styles.statLabel}>Satisfaction</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>100+</div>
              <div className={styles.statLabel}>Homes cleaned</div>
            </div>
          </div>
        </div>

        <div className={styles.leftFooter}>
          © {new Date().getFullYear()} Deusizi Sparkle · Abuja, Lagos, Nigeria
        </div>
      </div>

      {/* ─── Right panel ─── */}
      <div className={styles.right}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>
              Sign in to continue to your account
            </p>
          </div>

          {/* Role toggle */}
          <div className={styles.roleToggle}>
            <button
              className={`${styles.roleBtn} ${role === "customer" ? styles.roleBtnActive : ""}`}
              onClick={() => setRole("customer")}
              type="button"
            >
              I need a maid
            </button>
            <button
              className={`${styles.roleBtn} ${role === "maid" ? styles.roleBtnActive : ""}`}
              onClick={() => setRole("maid")}
              type="button"
            >
              I am a maid
            </button>
          </div>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>Continue with</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Google button */}
          <button
            className={styles.googleBtn}
            onClick={handleLogin}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <div className={styles.loadingSpinner} />
            ) : (
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          {/* Error */}
          {error && (
            <div className={styles.error}>
              <div className={styles.errorDot} />
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

          <p className={styles.terms}>
            By continuing, you agree to our{" "}
            <span className={styles.termsLink}>Terms of Service</span> and{" "}
            <span className={styles.termsLink}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
