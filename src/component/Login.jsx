// src/component/Login.jsx
// Views: "signin" | "register" | "forgot" | "forgot_sent" | "phone_prompt"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
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
  const isPwd = type === "password";
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.fieldWrap}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          type={isPwd && show ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
        />
        {isPwd && (
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

export default function Login({ onSuccess }) {
  const [view, setView] = useState("signin");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Sign-in
  const [siEmail, setSiEmail] = useState("");
  const [siPass, setSiPass] = useState("");
  const [siErrors, setSiErrors] = useState({});

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regErrors, setRegErrors] = useState({});

  // Forgot password
  const [fpEmail, setFpEmail] = useState("");
  const [fpErrors, setFpErrors] = useState({});

  // Phone prompt (after Google register)
  const [phoneVal, setPhoneVal] = useState("");
  const [phoneError, setPhoneError] = useState(null);
  const [googleToken, setGoogleToken] = useState(null); // token from Google login, needed for /complete-profile
  const [googleUser, setGoogleUser] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ── Google OAuth callback ──────────────────────────────────────────
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

    // Clear any stale session
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

        // Store token first so completeProfile request is authenticated
        setLoading(false);

        if (data.needsPhone) {
          // Don't call login() yet — it would trigger loginRedirect() in App.jsx
          // and navigate away before the phone prompt renders
          setGoogleToken(data.token);
          setGoogleUser(data.user); // store user in state (add this state var)
          setView("phone_prompt");
          return;
        }

        // No phone needed — safe to login now
        login(data.user, data.token);
        onSuccess?.(data);
        const path =
          data.user.role === "admin"
            ? "/admin"
            : data.user.role === "maid"
              ? "/maid"
              : "/my-bookings";
        navigate(path, { replace: true });

        // Existing user or new user who already has phone
        onSuccess?.(data);
        const paths =
          data.user.role === "admin"
            ? "/admin"
            : data.user.role === "maid"
              ? "/maid"
              : "/my-bookings";
        navigate(paths, { replace: true });
      })
      .catch((err) => {
        setError(err.message || "Something went wrong.");
        setLoading(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  }, [onSuccess, navigate, login]);

  const handleGoogleLogin = () => {
    setError(null);
    window.location.href = buildGoogleOAuthURL(role);
  };

  // ── Phone prompt submit (after Google register) ────────────────────
  async function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!phoneVal.trim()) {
      setPhoneError("Phone number is required");
      return;
    }
    if (!/^\+?[\d\s\-()]{7,15}$/.test(phoneVal)) {
      setPhoneError("Enter a valid phone number with country code");
      return;
    }
    setPhoneError(null);
    setLoading(true);

    try {
      const token = googleToken || localStorage.getItem("token");
      const res = await fetch(`${API}/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: phoneVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save phone");

      // NOW call login — after phone is saved
      login(data.user, token);
      onSuccess?.({ user: data.user, token });
      const path =
        data.user.role === "admin"
          ? "/admin"
          : data.user.role === "maid"
            ? "/maid"
            : "/my-bookings";
      navigate(path, { replace: true });
    } catch (err) {
      setPhoneError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Email sign in ──────────────────────────────────────────────────
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
            "Your email isn't verified yet. Check your inbox for the verification link.",
          );
          setLoading(false);
          return;
        }
        if (data.code === "NO_PASSWORD_SET") {
          setError(
            'This account was created with Google. Use "Continue with Google" or click "Forgot password" to set a password.',
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

  // ── Register ───────────────────────────────────────────────────────
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

      if (!res.ok) {
        if (data.code === "GOOGLE_ACCOUNT_LINKED") {
          setSuccess(
            "Your Google account now has a password set. You can sign in with either method.",
          );
          setView("signin");
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(
        "Account created! Check your email to verify before signing in.",
      );
      setView("signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Forgot password ────────────────────────────────────────────────
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

  // ── Left panel ─────────────────────────────────────────────────────
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
          {[
            ["50+", "Verified maids"],
            ["98%", "Satisfaction"],
            ["100+", "Homes cleaned"],
          ].map(([n, l]) => (
            <div key={l} className={styles.stat}>
              <div className={styles.statNumber}>{n}</div>
              <div className={styles.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.leftFooter}>
        © {new Date().getFullYear()} Deusizi Sparkle · Abuja, Lagos, Nigeria
      </div>
    </div>
  );

  // ── Loading screen (Google OAuth processing) ───────────────────────
  if (
    window.location.hash.includes("access_token") ||
    (loading && view === "signin" && !siEmail)
  ) {
    return (
      <div className={styles.page}>
        <div className={styles.right} style={{ width: "100%" }}>
          <div className={styles.formWrap} style={{ textAlign: "center" }}>
            <Spinner />
            <p style={{ color: "#8a7b6a", fontSize: 14, marginTop: 16 }}>
              Signing you in…
            </p>
            {error && (
              <p style={{ color: "#d9534f", fontSize: 12, marginTop: 8 }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PHONE PROMPT (after Google register) ───────────────────────────
  if (view === "phone_prompt") {
    return (
      <div className={styles.page}>
        <LeftPanel />
        <div className={styles.right}>
          <div className={styles.formWrap}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>One last step</h2>
              <p className={styles.formSubtitle}>
                Add your phone number so maids and customers can reach you.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit} noValidate>
              <InputField
                label="Phone number"
                type="tel"
                value={phoneVal}
                onChange={(e) => setPhoneVal(e.target.value)}
                placeholder="+234 800 000 0000"
                hint="Include country code — e.g. +234 for Nigeria"
                error={phoneError}
                disabled={loading}
                autoFocus
              />

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
                style={{ marginTop: 8 }}
              >
                {loading ? <Spinner /> : "Continue →"}
              </button>
            </form>

            <p className={styles.switchPrompt}>
              {/* <button
                className={styles.switchLink}
                onClick={() => {
                  const token = googleToken;
                  const user = googleUser;
                  if (token && user) {
                    login(user, token); // ← call login on skip too
                    onSuccess?.({ user, token });
                  }
                  const role = googleUser?.role;
                  const path =
                    role === "admin"
                      ? "/admin"
                      : role === "maid"
                        ? "/maid"
                        : "/my-bookings";
                  navigate(path, { replace: true });
                }}
              >
                Skip for now
              </button> */}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── FORGOT SENT ────────────────────────────────────────────────────
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

  // ── FORGOT PASSWORD ────────────────────────────────────────────────
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
                style={{ marginTop: 20 }}
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

  // ── REGISTER ───────────────────────────────────────────────────────
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

            <p className={styles.terms}>
              Choose if you want a maid or you want to register as a
              maid/cleaner
            </p>

            <button
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
              type="button"
            >
              <GoogleIcon /> Sign up with Google
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

  // ── SIGN IN (default) ──────────────────────────────────────────────
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

          <p className={styles.terms}>
            Choose if you want a maid or you want to sign in or register as a
            maid/cleaner
          </p>

          <button
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            type="button"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or with email</span>
            <div className={styles.dividerLine} />
          </div>

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

// Google G icon — extracted to avoid repetition
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
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
  );
}
