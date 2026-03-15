import { useState } from "react";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminUsers from "./AdminUsers.jsx";

export default function AdminApp({ onLogout }) {
  const [view, setView] = useState("leads"); // "leads" | "users"

  if (view === "users") {
    return <AdminUsers onBack={() => setView("leads")} />;
  }

  return <AdminDashboard onLogout={onLogout} onNavigate={setView} />;
}
