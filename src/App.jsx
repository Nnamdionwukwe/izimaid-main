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
import MoveInCleaning from "./component/MoveInCleaning/MoveInCleaning.jsx";
import EcoFriendlyCleaning from "./component/EcoFriendlyCleaning/EcoFriendlyCleaning.jsx";
import ApartmentCleaning from "./component/ApartmentCleaning/ApartmentCleaning.jsx";
import OccasionalCleaning from "./component/OccasionalCleaning/OccasionalCleaning.jsx";
import MoveOutCleaning from "./component/MoveOutCleaning/MoveOutCleaning.jsx";
import HomeCleaning from "./component/HomeCleaning/HomeCleaning.jsx";
import SpecialEventCleaning from "./component/SpecialEventCleaning/SpecialEventCleaning.jsx";
import TermsOfService from "./component/TermsOfService/TermsOfService.jsx";
import PrivacyPolicy from "./component/PrivacyPolicy/PrivacyPolicy.jsx";
import OurApproach from "./component/OurApproach/OurApproach.jsx";
import OurResults from "./component/OurResults/OurResults.jsx";
import OurCommitment from "./component/OurCommitment/OurCommitment.jsx";
import DeusiziGroup from "./component/DeusiziGroup/DeusiziGroup.jsx";
import ContactUs from "./component/ContactUs/ContactUs.jsx";
import Locations from "./component/Locations/Locations.jsx";
import DeusiziApp from "./component/DeusiziApp/DeusiziApp.jsx";
import OwnAFranchise from "./component/OwnAFranchise/OwnAFranchise.jsx";
import GiftCertificates from "./component/GiftCertificates/GiftCertificates.jsx";
import AplicarLocalmente from "./component/AplicarLocalmente/AplicarLocalmente.jsx";
import ApplyLocally from "./component/AplicarLocalmente/ApplyLocally.jsx";
import WhatsIncluded from "./component/WhatsIncluded/WhatsIncluded.jsx";
import BeforeAfter from "./component/BeforeAfter/BeforeAfter.jsx";
import DeausiziFoundation from "./component/DeausiziFoundation/DeausiziFoundation,.jsx";
import DeausiziAwards from "./component/DeausiziAwards/DeausiziAwards.jsx";
import LocalShelterSupport from "./component/LocalShelterSupport/LocalShelterSupport.jsx";
import FloatingSupportChat from "./component/SupportChat/FloatingSupportChat.jsx";
import BoardOfDirectors from "./component/BoardOfDirectors/BoardOfDirectors.jsx";
import GeneralHousehold from "./component/GeneralHousehold/GeneralHousehold.jsx";
import Kitchens from "./component/CleaningTips/Kitchens.jsx";
import MoveCleaningTips from "./component/CleaningTips/MoveCleaningTips.jsx";
import OfficeCleaningTips from "./component/CleaningTips/OfficeCleaningTips.jsx";
import LivingRooms from "./component/CleaningTips/LivingRooms.jsx";
import Bathrooms from "./component/CleaningTips/Bathrooms.jsx";
import SchedulesChartsChecklists from "./component/CleaningTips/SchedulesChartsChecklists.jsx";
import KidsRooms from "./component/CleaningTips/KidsRooms.jsx";
import Bedrooms from "./component/CleaningTips/Bedrooms.jsx";
import SpringCleaning from "./component/CleaningTips/SpringCleaning.jsx";
import HowToSaveTime from "./component/CleaningTips/HowToSaveTime.jsx";
import LaundryRooms from "./component/CleaningTips/LaundryRooms.jsx";
import KitchenTips from "./component/CleaningTips/KitchenTips.jsx";
import Blog from "./component/Blog/Blog.jsx";
import Seasonal from "./component/Blog/Seasonal.jsx";
import TipsAndTricks from "./component/Blog/TipsAndTricks.jsx";
import BlogPost from "./component/Blog/BlogPost.jsx";
import OtherFooter from "./component/OtherFooter.jsx";
import FixedHeader from "./component/FixedHeader.jsx";
import PoweredByGestech from "./component/PoweredByGestech/PoweredByGestech.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          {/* <FixedHeader />  */}
          {/* Floating support chat — only renders for logged-in customers */}
          <FloatingSupportChat />
          <AppRoutes />
          <PoweredByGestech />
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
      <Route path="/move-in-cleaning" element={<MoveInCleaning />} />
      <Route path="/eco-friendly-cleaning" element={<EcoFriendlyCleaning />} />
      <Route path="/apartment-cleaning" element={<ApartmentCleaning />} />
      <Route path="/occasional-cleaning" element={<OccasionalCleaning />} />
      <Route path="/move-out-cleaning" element={<MoveOutCleaning />} />
      <Route path="/home-cleaning" element={<HomeCleaning />} />
      <Route
        path="/special-event-cleaning"
        element={<SpecialEventCleaning />}
      />
      <Route path="/our-approach" element={<OurApproach />} />
      <Route path="/our-results" element={<OurResults />} />
      <Route path="/our-commitment" element={<OurCommitment />} />
      <Route path="/deusizi-group" element={<DeusiziGroup />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/locations" element={<Locations />} />
      <Route path="/app" element={<DeusiziApp />} />
      <Route path="/franchise" element={<OwnAFranchise />} />
      <Route path="/gift-certificates" element={<GiftCertificates />} />
      <Route path="/aplicar-localmente" element={<AplicarLocalmente />} />
      <Route path="/apply-locally" element={<ApplyLocally />} />
      <Route path="/whats-included" element={<WhatsIncluded />} />
      <Route path="/before-after-cleaning" element={<BeforeAfter />} />
      <Route path="/foundation" element={<DeausiziFoundation />} />
      <Route path="/awards" element={<DeausiziAwards />} />
      <Route path="/local-shelter-support" element={<LocalShelterSupport />} />
      <Route path="/board-of-directors" element={<BoardOfDirectors />} />
      <Route path="/general-household" element={<GeneralHousehold />} />
      {/* <Route path="/kitchens" element={<Kitchens />} /> */}
      <Route path="/move-cleaning-tips" element={<MoveCleaningTips />} />
      <Route path="/office-cleaning-tips" element={<OfficeCleaningTips />} />
      <Route path="/living-rooms" element={<LivingRooms />} />
      <Route path="/bathrooms" element={<Bathrooms />} />
      <Route path="/kids-rooms" element={<KidsRooms />} />
      <Route path="/bedrooms" element={<Bedrooms />} />
      <Route
        path="/schedules-charts-checklists"
        element={<SchedulesChartsChecklists />}
      />
      <Route path="/spring-cleaning" element={<SpringCleaning />} />
      <Route path="/how-to-save-time" element={<HowToSaveTime />} />
      <Route path="/laundry-rooms" element={<LaundryRooms />} />
      <Route path="/kitchens-tips" element={<KitchenTips />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/blog/seasonal" element={<Seasonal />} />
      <Route path="/blog/tips-and-tricks" element={<TipsAndTricks />} />

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

      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
