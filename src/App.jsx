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
import MaidDetail from "./component/MaidDetail.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import CustomerSupport from "./component/CustomerSupport/CustomerSupport.jsx";
import Payment from "./component/Payment/Payment.jsx";
import RecurringCleaning from "./component/RecurringCleaning/RecurringCleaning.jsx";
import OneTimeCleaning from "./component/OneTimeCleaning/OneTimeCleaning.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  // ✅ user, token, and logout all come from context
  // No more reading localStorage directly — context is the single source of truth
  const { user, token, logout } = useAuth();

  function handleLoginSuccess() {
    // Context updates asynchronously so read localStorage for the immediate redirect
    const freshUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (freshUser.role === "admin") navigate("/admin", { replace: true });
    else if (freshUser.role === "maid") navigate("/maid", { replace: true });
    else navigate("/", { replace: true });
  }

  // ✅ context logout clears user state globally — every component using
  // useAuth() re-renders immediately and sees an empty user object
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function ProtectedRoute({ children, adminOnly = false, maidOnly = false }) {
    if (!token) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
    if (maidOnly && user.role !== "maid") return <Navigate to="/" replace />;
    return children;
  }

  const hasGoogleHash = window.location.hash.includes("access_token");

  // Redirect already-logged-in users away from /login
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
      <Route path="/maid/:maidId" element={<MaidDetail />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/bookings/:id" element={<BookingDetail />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/verify" element={<Payment />} />
      <Route path="/recurring-cleaning" element={<RecurringCleaning />} />
      <Route path="/one-time-cleaning" element={<OneTimeCleaning />} />

      {/* Admin Dashboard */}
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

      <Route
        path="/customersupport"
        element={
          <ProtectedRoute>
            <CustomerSupport />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
