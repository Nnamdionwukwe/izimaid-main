import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import HomePage from "./component/HomePage";
import RequestEstimate from "./component/RequestEstimate";
import LearnMore from "./component/LearnMore/LearnMore";
import Login from "./component/Login.jsx";

function App() {
  const token = localStorage.getItem("token");

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login
                  onSuccess={() => (window.location.href = "/dashboard")}
                />
              )
            }
          />

          <Route
            path="/request-a-free-estimate"
            element={<RequestEstimate />}
          />

          <Route path="/why-hire-us" element={<LearnMore />} />

          {/* Placeholder — replace with your real dashboard */}
          <Route
            path="/dashboard"
            element={
              token ? (
                <div style={{ padding: 32, fontFamily: "sans-serif" }}>
                  Welcome! Dashboard coming soon.{" "}
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
