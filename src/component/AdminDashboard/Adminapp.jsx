import { useState } from "react";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsers from "./Adminusers.jsx";
import AdminBookings from "./AdminBookings.jsx";
import AdminMaidDashboard from "./Adminmaiddashboard.jsx";

export default function AdminApp({ onLogout }) {
  const [view, setView] = useState("leads"); // "leads" | "users" | "bookings" | "maids"

  if (view === "users") {
    return <AdminUsers onBack={() => setView("leads")} />;
  }

  if (view === "bookings") {
    return <AdminBookings onNavigate={setView} />;
  }

  if (view === "maids") {
    return <AdminMaidDashboard onNavigate={setView} />;
  }

  return <AdminDashboard onLogout={onLogout} onNavigate={setView} />;
}
