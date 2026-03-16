import { useState } from "react";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsers from "./Adminusers.jsx";
import AdminBookings from "./AdminBookings.jsx";

export default function AdminApp({ onLogout }) {
  const [view, setView] = useState("leads"); // "leads" | "users" | "bookings"

  if (view === "users") {
    return <AdminUsers onBack={() => setView("leads")} />;
  }

  if (view === "bookings") {
    return <AdminBookings onNavigate={setView} />;
  }

  return <AdminDashboard onLogout={onLogout} onNavigate={setView} />;
}
