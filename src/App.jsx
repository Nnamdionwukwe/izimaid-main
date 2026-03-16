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
import Maids from "./component/Maids/Maids.jsx";
import Booking from "./component/Booking/Booking.jsx";
import BookingDetail from "./component/Bookingdetail/Bookingdetail.jsx";
import MyBookings from "./component/Mybookings/Mybookings.jsx";
import MaidDashboard from "./component/MaidDashboard/MaidDashboard.jsx";

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
    if (user.role === "admin") navigate("/admin", { replace: true });
    else if (user.role === "maid") navigate("/maid", { replace: true });
    else navigate("/", { replace: true });
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  function ProtectedRoute({ children, adminOnly = false, maidOnly = false }) {
    const token = getToken();
    const user = getUser();
    if (!token) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
    if (maidOnly && user.role !== "maid") return <Navigate to="/" replace />;
    return children;
  }

  const token = getToken();
  const user = getUser();
  const hasGoogleHash = window.location.hash.includes("access_token");

  // Redirect logged-in users away from /login
  function loginRedirect() {
    if (token && !hasGoogleHash) {
      if (user.role === "admin") return <Navigate to="/admin" replace />;
      if (user.role === "maid") return <Navigate to="/maid" replace />;
      return <Navigate to="/" replace />;
    }
    return <Login onSuccess={handleLoginSuccess} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={loginRedirect()} />
      <Route path="/request-a-free-estimate" element={<RequestEstimate />} />
      <Route path="/why-hire-us" element={<LearnMore />} />
      <Route path="/maids" element={<Maids />} />
      <Route path="/book/:maidId" element={<Booking />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/bookings/:id" element={<BookingDetail />} />

      {/* Admin Dashboard - FIXED: Removed duplicate route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminApp onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* Maid Dashboard */}
      <Route
        path="/maid"
        element={
          <ProtectedRoute maidOnly>
            <MaidDashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
