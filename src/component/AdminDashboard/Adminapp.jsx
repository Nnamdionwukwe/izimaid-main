import { useState } from "react";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsers from "./Adminusers.jsx";
import AdminBookings from "./AdminBookings.jsx";
import AdminMaidDashboard from "./Adminmaiddashboard.jsx";
import AdminCustomerSupport from "./Admincustomersupport.jsx";
import AdminMaidSupport from "./AdminMaidSupport.jsx";
import AdminChats from "./AdminChats.jsx";
import AdminSupportChats from "./AdminSupportChats.jsx";
import AdminMaidSupportChats from "./AdminMaidSupportChats.jsx";
import AdminPayments from "./Adminpayments.jsx";
import AdminDocuments from "./AdminDocuments.jsx";
import AdminWallet from "./AdminMaidWallet.jsx";
import AdminWithdrawals from "./AdminWithdrawals.jsx";
import AdminNotifications from "./AdminNotifications.jsx";
import AdminStats from "./AdminStats.jsx";
import AdminSettings from "./AdminSettings.jsx";
import AdminAuditLog from "./AdminAuditLog.jsx";
import AdminSubscriptions from "./AdminSubscriptions.jsx";
import AdminCleanerApplications from "./AdminCleanerApplications.jsx";
import AdminHousekeeperApplications from "./AdminHousekeeperApplications.jsx";
import AdminCaregiverApplications from "./AdminCaregiverApplications.jsx";
import AdminDomesticCertification from "./AdminDomesticCertification.jsx";
import AdminContactUs from "./AdminContactUs.jsx";
import AdminApplyLocally from "./AdminApplyLocally.jsx";
import AdminFoundation from "./AdminFoundation.jsx";
import AdminGiftCertificates from "./AdminGiftCertificates.jsx";
import AdminShelter from "./AdminShelter.jsx";

export default function AdminApp({ onLogout }) {
  const [view, setView] = useState("leads");

  if (view === "users") {
    return <AdminUsers onBack={() => setView("leads")} />;
  }

  if (view === "bookings") {
    return <AdminBookings onNavigate={setView} />;
  }

  if (view === "maids") {
    return <AdminMaidDashboard onNavigate={setView} />;
  }

  if (view === "support") {
    return <AdminCustomerSupport onBack={() => setView("leads")} />;
  }

  if (view === "maid-support") {
    return <AdminMaidSupport onBack={() => setView("leads")} />;
  }

  if (view === "chats") {
    return <AdminChats onBack={() => setView("leads")} />;
  }

  if (view === "support-chat") {
    return <AdminSupportChats onBack={() => setView("leads")} />;
  }

  if (view === "maid-support-chat") {
    return <AdminMaidSupportChats onBack={() => setView("leads")} />;
  }

  if (view === "payments") {
    return <AdminPayments onBack={() => setView("leads")} />;
  }
  if (view === "admin-wallets") {
    return <AdminWallet onBack={() => setView("leads")} />;
  }

  if (view === "withdrawals")
    return <AdminWithdrawals onBack={() => setView("leads")} />;

  // ── NEW ────────────────────────────────────────────────────────────────────
  if (view === "documents") {
    return <AdminDocuments onBack={() => setView("leads")} />;
  }

  if (view === "stats") return <AdminStats onBack={() => setView("leads")} />;

  if (view === "settings")
    return <AdminSettings onBack={() => setView("leads")} />;

  if (view === "audit")
    return <AdminAuditLog onBack={() => setView("leads")} />;

  if (view === "notifications")
    return <AdminNotifications onBack={() => setView("leads")} />;

  if (view === "contact-us")
    return <AdminContactUs onBack={() => setView("leads")} />;

  if (view === "donations")
    return <AdminFoundation onBack={() => setView("leads")} />;

  if (view === "gift-certificates")
    return <AdminGiftCertificates onBack={() => setView("leads")} />;

  if (view === "shelter")
    return <AdminShelter onBack={() => setView("leads")} />;

  if (view === "apply-locally")
    return <AdminApplyLocally onBack={() => setView("leads")} />;

  if (view === "cleaner-applications")
    return <AdminCleanerApplications onBack={() => setView("leads")} />;

  if (view === "housekeeper-applications")
    return <AdminHousekeeperApplications onBack={() => setView("leads")} />;

  if (view === "caregiver-applications")
    return <AdminCaregiverApplications onBack={() => setView("leads")} />;

  if (view === "domestic-certification-applications")
    return <AdminDomesticCertification onBack={() => setView("leads")} />;

  if (view === "subscriptions")
    return <AdminSubscriptions onBack={() => setView("leads")} />;

  return <AdminDashboard onLogout={onLogout} onNavigate={setView} />;
}
