import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import HomePage from "./component/HomePage";
import RequestEstimate from "./component/RequestEstimate";
import LearnMore from "./component/LearnMore/LearnMore";
import Login from "./component/Login.jsx";
import AdminApp from "./component/AdminDashboard/AdminApp.jsx";

function RequireAuth({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginRedirect />} />

          <Route
            path="/request-a-free-estimate"
            element={<RequestEstimate />}
          />

          <Route path="/why-hire-us" element={<LearnMore />} />

          <Route
            path="/admin"
            element={
              <RequireAuth adminOnly>
                <AdminApp
                  onLogout={() => {
                    localStorage.clear();
                    window.location.replace("/login");
                  }}
                />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

function LoginRedirect() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (token) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  }

  function handleSuccess(data) {
    // data is already saved to localStorage by Login component
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    window.location.replace(u.role === "admin" ? "/admin" : "/");
  }

  return <Login onSuccess={handleSuccess} />;
}

export default App;
