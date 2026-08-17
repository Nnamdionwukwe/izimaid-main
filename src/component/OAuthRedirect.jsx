// OAuthRedirect.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthRedirect() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.includes("access_token")) {
      // Redirect to app with the token
      window.location.href = "deusizimaid://oauth2redirect" + hash;
    } else {
      // Redirect to login
      window.location.href = "/login";
    }
  }, [location]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div className="spinner" />
        <h2>Signing you in...</h2>
      </div>
    </div>
  );
}
