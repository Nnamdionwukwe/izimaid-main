import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import HomePage from "./component/HomePage";
import RequestEstimate from "./component/RequestEstimate";
import LearnMore from "./component/LearnMore/LearnMore";
import Login from "./component/Login.jsx";
import AdminApp from "./component/AdminDashboard/Adminapp.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  function getToken() {
    return localStorage.getItem("token");
  }
  function getUser() {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }

  function handleLoginSuccess() {
    const user = getUser();
    navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  function ProtectedRoute({ children, adminOnly = false }) {
    const token = getToken();
    const user = getUser();
    if (!token) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
    return children;
  }

  const token = getToken();
  const user = getUser();

  // After Google redirect, the URL is /login#access_token=...
  // We must let Login render so its useEffect can process the hash.
  // Only redirect away if token exists AND there's no access_token hash.
  const hasGoogleHash = window.location.hash.includes("access_token");

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/login"
        element={
          token && !hasGoogleHash ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />
          ) : (
            <Login onSuccess={handleLoginSuccess} />
          )
        }
      />

      <Route path="/request-a-free-estimate" element={<RequestEstimate />} />
      <Route path="/why-hire-us" element={<LearnMore />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminApp onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
