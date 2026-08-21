// src/components/OAuthRedirectCustomer.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthRedirectCustomer() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    console.log("[OAuth Redirect Customer] Hash:", hash);

    if (hash && hash.includes("access_token")) {
      // Extract token info for logging
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const state = params.get("state") || "customer";

      console.log(
        "[OAuth Redirect Customer] Access token found:",
        !!accessToken,
      );
      console.log("[OAuth Redirect Customer] State:", state);

      // Redirect to customer app with the token
      const redirectUrl = "deusizicustomer://oauth2redirect" + hash;
      console.log("[OAuth Redirect Customer] Redirecting to:", redirectUrl);

      // Use setTimeout to ensure the page renders before redirect
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } else {
      console.log("[OAuth Redirect Customer] No access token found");
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, [location]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f4f0",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #1a1a2e",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        />
        <h2 style={{ color: "#1a1a2e", marginBottom: "8px" }}>
          Deusizi Sparkle
        </h2>
        <p style={{ color: "#888" }}>Signing you in...</p>
        <p style={{ fontSize: "14px", color: "#aaa", marginTop: "20px" }}>
          Please wait while we redirect you to the app
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
