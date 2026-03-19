import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

export default function Login({ onSuccess }) {
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // ✅ login() from context — sets global user state AND writes localStorage
  // replaces the manual localStorage.setItem("token") / localStorage.setItem("user") calls
  const { login } = useAuth();

  useEffect(() => {
    console.log("\n🔐 [LOGIN] Component mounted");
    console.log("🔐 [LOGIN] API_URL:", API_URL);
    console.log("🔐 [LOGIN] GOOGLE_CLIENT_ID set:", !!GOOGLE_CLIENT_ID);

    const hash = window.location.hash;
    console.log("🔐 [LOGIN] URL hash:", hash.slice(0, 50) + "...");

    if (!hash.includes("access_token")) {
      console.log("ℹ️ [LOGIN] No access_token in hash - normal login page");
      return;
    }

    console.log("✅ [LOGIN] Google callback detected - processing...");

    const params = new URLSearchParams(hash.replace("#", ""));
    const access_token = params.get("access_token");
    const state = params.get("state") || "customer";

    console.log(
      "🔑 [LOGIN] access_token received (length:",
      access_token?.length,
      ")",
    );
    console.log("🔑 [LOGIN] state (role):", state);

    if (!access_token) {
      console.error("❌ [LOGIN] No access_token found in URL");
      return;
    }

    // Clean hash immediately to prevent re-processing on refresh
    window.history.replaceState(null, "", window.location.pathname);
    console.log("✅ [LOGIN] URL cleaned");

    setLoading(true);
    setError(null);

    // Clear any stale session before authenticating
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      console.log("🔄 [LOGIN] Existing token found - clearing...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("✅ [LOGIN] Old credentials cleared");

      fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch((err) =>
        console.warn("⚠️ [LOGIN] Previous session logout failed:", err),
      );
    }

    console.log(
      "📡 [LOGIN] Sending auth request to:",
      API_URL + "/api/auth/google",
    );

    fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token, role: state }),
    })
      .then((res) =>
        res.json().then((data) => ({ ok: res.ok, data, status: res.status })),
      )
      .then(({ ok, data, status }) => {
        console.log("📦 [LOGIN] Response data:", data);

        if (!ok)
          throw new Error(data.error || `Authentication failed (${status})`);
        if (!data.token) throw new Error("No token in response");
        if (!data.user) throw new Error("No user in response");

        console.log("✅ [LOGIN] Auth response valid");
        console.log(
          "🔐 [LOGIN] Token preview:",
          data.token.slice(0, 50) + "...",
        );
        console.log("👤 [LOGIN] User:", {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
        });

        // ✅ Single call replaces all the manual localStorage.setItem calls
        // Updates context state globally so every component using useAuth()
        // re-renders immediately with the correct user and avatar
        login(data.user, data.token);

        console.log("✅ [LOGIN] Context updated via login()");

        setLoading(false);
        console.log("🔄 [LOGIN] Calling onSuccess callback...");
        onSuccess?.(data);

        // ✅ Admin redirect added — was missing in the original
        const redirectPath =
          data.user.role === "admin"
            ? "/admin"
            : data.user.role === "maid"
              ? "/maid"
              : "/my-bookings";

        console.log("🔀 [LOGIN] Redirecting to:", redirectPath);
        navigate(redirectPath, { replace: true });

        console.log("\n✅ [LOGIN] LOGIN COMPLETE\n");
      })
      .catch((err) => {
        console.error("❌ [LOGIN] Error:", err.message);
        setError(err.message || "Something went wrong. Please try again.");
        setLoading(false);

        // Clean up on error
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  }, [onSuccess, navigate, login]);

  const handleLogin = () => {
    console.log("🔘 [LOGIN] Login button clicked - Role:", role);
    setError(null);
    const oauthUrl = buildGoogleOAuthURL(role);
    console.log("🔐 [LOGIN] Redirecting to Google OAuth URL");
    window.location.href = oauthUrl;
  };

  if (window.location.hash.includes("access_token") || loading) {
    return (
      <div className={styles.page}>
        <div
          className={styles.right}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className={styles.formWrap} style={{ textAlign: "center" }}>
            <div
              className={styles.loadingSpinner}
              style={{ margin: "0 auto 16px" }}
            />
            <p style={{ color: "#8a7b6a", fontSize: "14px" }}>
              {error ? "Something went wrong..." : "Signing you in..."}
            </p>
            {error && (
              <p
                style={{ color: "#d9534f", fontSize: "12px", marginTop: "8px" }}
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
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

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>Continue with</span>
            <div className={styles.dividerLine} />
          </div>

          <button
            className={styles.googleBtn}
            onClick={handleLogin}
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

          {error && (
            <div className={styles.error}>
              <div className={styles.errorDot} />
              <p className={styles.errorText}>{error}</p>
            </div>
          )}

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
