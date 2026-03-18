import { useState } from "react";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsers from "./Adminusers.jsx";
import AdminBookings from "./AdminBookings.jsx";
import AdminMaidDashboard from "./Adminmaiddashboard.jsx";
import AdminCustomerSupport from "./Admincustomersupport.jsx";
import AdminMaidSupport from "./AdminMaidSupport.jsx";
import AdminChats from "./AdminChats.jsx";

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
    return <AdminMaidSupport onBack={() => setView("maid-support")} />;
  }

  if (view === "chats") {
    return <AdminChats onBack={() => setView("chats")} />;
  }

  return <AdminDashboard onLogout={onLogout} onNavigate={setView} />;
}
