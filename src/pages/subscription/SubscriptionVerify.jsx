import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function SubscriptionVerify() {
  const { token, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        navigate("/login");
        return;
      }

      const ref = params.get("reference") || params.get("trxref");
      const sessionId = params.get("session_id");
      const gateway = params.get("gateway") || "paystack";

      if (!ref && !sessionId) {
        setStatus("error");
        setError("No payment reference found in URL.");
        return;
      }

      try {
        const query = new URLSearchParams({ gateway });
        if (ref) query.set("reference", ref);
        if (sessionId) query.set("session_id", sessionId);

        const res = await fetch(`${API}/api/subscriptions/verify?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Verification failed");

        setPlan(data.plan);
        setStatus("success");

        // Update user context so subscription_plan reflects on all pages
        if (data.plan?.name) {
          updateUser({ ...user, subscription_plan: data.plan.name });
        }

        // Redirect to settings after 4 seconds
        setTimeout(
          () => navigate("/settings", { state: { tab: "subscription" } }),
          4000,
        );
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    }
    verify();
  }, [token]);

  const style = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgb(245,245,248)",
      fontFamily: "Arial, Helvetica, sans-serif",
      padding: 24,
    },
    card: {
      background: "white",
      borderRadius: 16,
      padding: "40px 32px",
      border: "1px solid rgb(228,228,228)",
      maxWidth: 480,
      width: "100%",
      textAlign: "center",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    },
  };

  if (status === "verifying")
    return (
      <div style={style.page}>
        <div style={style.card}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "rgb(19,19,103)",
              margin: "0 0 8px",
            }}
          >
            Verifying payment…
          </p>
          <p style={{ fontSize: 13, color: "gray", margin: 0 }}>
            Please wait, do not close this page.
          </p>
          <div
            style={{
              width: 40,
              height: 40,
              margin: "24px auto 0",
              border: "3px solid rgb(228,228,228)",
              borderTopColor: "rgb(19,19,103)",
              borderRadius: "50%",
              animation: "spin 0.65s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );

  if (status === "error")
    return (
      <div style={style.page}>
        <div style={style.card}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "rgb(168,28,28)",
              margin: "0 0 8px",
            }}
          >
            Verification failed
          </p>
          <p
            style={{
              fontSize: 13,
              color: "gray",
              margin: "0 0 24px",
              lineHeight: 1.5,
            }}
          >
            {error ||
              "Something went wrong. Please contact support if you were charged."}
          </p>
          <button
            onClick={() =>
              navigate("/settings", { state: { tab: "subscription" } })
            }
            style={{
              padding: "10px 24px",
              background: "rgb(19,19,103)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to Settings
          </button>
        </div>
      </div>
    );

  return (
    <div style={style.page}>
      <div style={style.card}>
        {/* Success animation */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgb(209,247,224)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            margin: "0 auto 20px",
            animation: "pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
          }}
        >
          ✅
        </div>
        <style>{`@keyframes pop { from { transform: scale(0); opacity:0; } to { transform: scale(1); opacity:1; } }`}</style>

        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "rgb(19,19,103)",
            margin: "0 0 8px",
          }}
        >
          You're subscribed!
        </p>
        <p
          style={{
            fontSize: 14,
            color: "gray",
            margin: "0 0 24px",
            lineHeight: 1.6,
          }}
        >
          Welcome to{" "}
          <strong>{plan?.display_name || plan?.name || "Premium"}</strong>. A
          receipt has been sent to your email address.
        </p>

        {/* Plan features */}
        {plan?.features?.length > 0 && (
          <div
            style={{
              background: "rgb(245,245,248)",
              borderRadius: 10,
              padding: "16px 18px",
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgb(100,100,100)",
                margin: "0 0 10px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Your benefits
            </p>
            {plan.features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "rgb(47,47,47)",
                  padding: "4px 0",
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "rgb(209,247,224)",
                    color: "rgb(10,107,46)",
                    fontSize: 10,
                    fontWeight: 900,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                {f}
              </div>
            ))}
          </div>
        )}

        <p
          style={{ fontSize: 12, color: "rgb(150,150,150)", marginBottom: 20 }}
        >
          Redirecting to settings in 4 seconds…
        </p>

        <button
          onClick={() =>
            navigate("/settings", { state: { tab: "subscription" } })
          }
          style={{
            padding: "11px 28px",
            background: "rgb(19,19,103)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Go to Settings →
        </button>
      </div>
    </div>
  );
}
