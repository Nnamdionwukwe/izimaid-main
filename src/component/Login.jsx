// src/component/Login.jsx
// Supports: Google OAuth, email/password login, register, forgot password
// Styling: Login.module.css (unchanged) + platform CSS variables from index.css

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Normalize API base — works whether VITE_API_URL has /api or not
const API = API_URL.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

function buildGoogleOAuthURL(role) {
  const redirectUri = window.location.origin + "/login";
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: "openid email profile",
    state: role,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// ── Small shared sub-components ────────────────────────────────────────
function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
  error,
  disabled,
  ...rest
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.fieldWrap}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.inputEye}
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
          >
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
      {hint && !error && <p className={styles.fieldHint}>{hint}</p>}
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

function Spinner() {
  return <span className={styles.loadingSpinner} />;
}

// ── VIEWS ──────────────────────────────────────────────────────────────
// "signin" | "register" | "forgot" | "forgot_sent"

export default function Login({ onSuccess }) {
  const [view, setView] = useState("signin");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Sign-in form
  const [siEmail, setSiEmail] = useState("");
  const [siPass, setSiPass] = useState("");
  const [siErrors, setSiErrors] = useState({});

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regErrors, setRegErrors] = useState({});

  // Forgot password
  const [fpEmail, setFpEmail] = useState("");
  const [fpErrors, setFpErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  // ── Google OAuth callback handling ──────────────────────────────────
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token")) return;

    const params = new URLSearchParams(hash.replace("#", ""));
    const access_token = params.get("access_token");
    const state = params.get("state") || "customer";

    if (!access_token) return;

    window.history.replaceState(null, "", window.location.pathname);
    setLoading(true);
    setError(null);

    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      fetch(`${API}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch(() => {});
    }

    fetch(`${API}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token, role: state }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Authentication failed");
        if (!data.token) throw new Error("No token in response");
        login(data.user, data.token);
        setLoading(false);
        onSuccess?.(data);
        const path =
          data.user.role === "admin"
            ? "/admin"
            : data.user.role === "maid"
              ? "/maid"
              : "/my-bookings";
        navigate(path, { replace: true });
      })
      .catch((err) => {
        setError(err.message || "Something went wrong. Please try again.");
        setLoading(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  }, [onSuccess, navigate, login]);

  const handleGoogleLogin = () => {
    setError(null);
    window.location.href = buildGoogleOAuthURL(role);
  };

  // ── Email / password sign in ─────────────────────────────────────────
  async function handleSignIn(e) {
    e.preventDefault();
    const errs = {};
    if (!siEmail) errs.email = "Email is required";
    if (!siPass) errs.password = "Password is required";
    if (Object.keys(errs).length) {
      setSiErrors(errs);
      return;
    }
    setSiErrors({});
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: siEmail, password: siPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED") {
          setError(null);
          setSuccess(
            "Please verify your email before logging in. Check your inbox.",
          );
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Login failed");
      }
      login(data.user, data.token);
      onSuccess?.(data);
      const path =
        data.user.role === "admin"
          ? "/admin"
          : data.user.role === "maid"
            ? "/maid"
            : "/my-bookings";
      navigate(path, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Register ─────────────────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    const errs = {};
    if (!regName.trim()) errs.name = "Name is required";
    if (!regEmail) errs.email = "Email is required";
    if (!regPass) errs.password = "Password is required";
    if (regPass.length < 8) errs.password = "At least 8 characters";
    if (regPass !== regConfirm) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length) {
      setRegErrors(errs);
      return;
    }
    setRegErrors({});
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPass,
          phone: regPhone || undefined,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess(
        "Account created! Check your email to verify before logging in.",
      );
      setView("signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Forgot password ───────────────────────────────────────────────────
  async function handleForgotPassword(e) {
    e.preventDefault();
    if (!fpEmail) {
      setFpErrors({ email: "Email is required" });
      return;
    }
    setFpErrors({});
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setView("forgot_sent");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Loading screen (Google OAuth processing) ──────────────────────
  if (
    window.location.hash.includes("access_token") ||
    (loading && view === "signin" && !siEmail)
  ) {
    return (
      <div className={styles.page}>
        <div className={styles.right} style={{ width: "100%" }}>
          <div className={styles.formWrap} style={{ textAlign: "center" }}>
            <Spinner />
            <p style={{ color: "#8a7b6a", fontSize: "14px", marginTop: 16 }}>
              Signing you in…
            </p>
            {error && (
              <p style={{ color: "#d9534f", fontSize: "12px", marginTop: 8 }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Left panel (shared) ────────────────────────────────────────────
  const LeftPanel = () => (
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
          Connect with trusted, vetted cleaning professionals in your area. Book
          in minutes, enjoy a spotless home.
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
  );

  // ── FORGOT PASSWORD SENT ────────────────────────────────────────────
  if (view === "forgot_sent") {
    return (
      <div className={styles.page}>
        <LeftPanel />
        <div className={styles.right}>
          <div className={styles.formWrap}>
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 className={styles.formTitle}>Check your inbox</h2>
              <p className={styles.formSubtitle} style={{ marginTop: 8 }}>
                If that email exists in our system, a password reset link has
                been sent. It expires in 1 hour.
              </p>
              <button
                className={styles.googleBtn}
                style={{ marginTop: 32 }}
                onClick={() => {
                  setView("signin");
                  setError(null);
                }}
              >
                ← Back to sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── FORGOT PASSWORD FORM ────────────────────────────────────────────
  if (view === "forgot") {
    return (
      <div className={styles.page}>
        <LeftPanel />
        <div className={styles.right}>
          <div className={styles.formWrap}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Reset password</h2>
              <p className={styles.formSubtitle}>
                Enter your email and we'll send a reset link
              </p>
            </div>

            <form onSubmit={handleForgotPassword} noValidate>
              <InputField
                label="Email address"
                type="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                placeholder="you@example.com"
                error={fpErrors.email}
                disabled={loading}
              />

              {error && (
                <div className={styles.error}>
                  <div className={styles.errorDot} />
                  <p className={styles.errorText}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
                style={{ marginTop: 24 }}
              >
                {loading ? <Spinner /> : "Send reset link"}
              </button>
            </form>

            <p className={styles.switchPrompt}>
              Remember your password?{" "}
              <button
                className={styles.switchLink}
                onClick={() => {
                  setView("signin");
                  setError(null);
                }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── REGISTER VIEW ───────────────────────────────────────────────────
  if (view === "register") {
    return (
      <div className={styles.page}>
        <LeftPanel />
        <div className={styles.right}>
          <div className={styles.formWrap}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Create account</h2>
              <p className={styles.formSubtitle}>Join Deusizi Sparkle today</p>
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

            {/* Google signup */}
            <button
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
              type="button"
            >
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
              Sign up with Google
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>or with email</span>
              <div className={styles.dividerLine} />
            </div>

            <form onSubmit={handleRegister} noValidate>
              <InputField
                label="Full name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Your full name"
                error={regErrors.name}
                disabled={loading}
              />
              <InputField
                label="Email address"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@example.com"
                error={regErrors.email}
                disabled={loading}
              />
              <InputField
                label="Phone number"
                type="tel"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                hint="Optional — include country code"
                disabled={loading}
              />
              <InputField
                label="Password"
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                placeholder="At least 8 characters"
                error={regErrors.password}
                disabled={loading}
              />
              <InputField
                label="Confirm password"
                type="password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                placeholder="Repeat password"
                error={regErrors.confirm}
                disabled={loading}
              />

              {error && (
                <div className={styles.error}>
                  <div className={styles.errorDot} />
                  <p className={styles.errorText}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? <Spinner /> : "Create account"}
              </button>
            </form>

            <p className={styles.switchPrompt}>
              Already have an account?{" "}
              <button
                className={styles.switchLink}
                onClick={() => {
                  setView("signin");
                  setError(null);
                  setRegErrors({});
                }}
              >
                Sign in
              </button>
            </p>

            <p className={styles.terms}>
              By creating an account, you agree to our{" "}
              <span
                onClick={() => navigate("/terms-of-service")}
                className={styles.termsLink}
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                onClick={() => navigate("/privacy-policy")}
                className={styles.termsLink}
              >
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── SIGN IN VIEW (default) ──────────────────────────────────────────
  return (
    <div className={styles.page}>
      <LeftPanel />
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

          {/* Google sign in */}
          <button
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            type="button"
          >
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
            Continue with Google
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or with email</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Success banner (after register / email check) */}
          {success && (
            <div className={styles.successBanner}>
              <span>✅</span>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSignIn} noValidate>
            <InputField
              label="Email address"
              type="email"
              value={siEmail}
              onChange={(e) => setSiEmail(e.target.value)}
              placeholder="you@example.com"
              error={siErrors.email}
              disabled={loading}
            />
            <InputField
              label="Password"
              type="password"
              value={siPass}
              onChange={(e) => setSiPass(e.target.value)}
              placeholder="Your password"
              error={siErrors.password}
              disabled={loading}
            />

            <div className={styles.forgotRow}>
              <button
                type="button"
                className={styles.forgotLink}
                onClick={() => {
                  setView("forgot");
                  setError(null);
                  setSiErrors({});
                }}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className={styles.error}>
                <div className={styles.errorDot} />
                <p className={styles.errorText}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Sign in"}
            </button>
          </form>

          <p className={styles.switchPrompt}>
            Don't have an account?{" "}
            <button
              className={styles.switchLink}
              onClick={() => {
                setView("register");
                setError(null);
                setSuccess(null);
                setSiErrors({});
              }}
            >
              Create one
            </button>
          </p>

          <p className={styles.terms}>
            By continuing, you agree to our{" "}
            <span
              onClick={() => navigate("/terms-of-service")}
              className={styles.termsLink}
            >
              Terms of Service
            </span>{" "}
            and{" "}
            <span
              onClick={() => navigate("/privacy-policy")}
              className={styles.termsLink}
            >
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
