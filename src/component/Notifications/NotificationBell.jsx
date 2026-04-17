// src/component/Notifications/NotificationBell.jsx
// Drop into any header — maid or customer.
// Usage: <NotificationBell token={token} />

import { useState, useEffect } from "react";
import NotificationsPanel from "./NotificationsPanel.jsx";
import styles from "./NotificationsPanel.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API = API_URL.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

export default function NotificationBell({ token }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  async function fetchCount() {
    if (!token) return;
    try {
      const res = await fetch(`${API}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUnread(data.count || 0);
    } catch {}
  }

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 30000);
    return () => clearInterval(id);
  }, [token]);

  function handleClose() {
    setOpen(false);
    // Refresh count after closing panel
    fetchCount();
  }

  return (
    <>
      <button
        className={styles.bellBtn}
        onClick={() => setOpen((o) => !o)}
        title="Notifications"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
      >
        🔔
        {unread > 0 && (
          <span className={styles.bellBadge}>
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && <NotificationsPanel token={token} onClose={handleClose} />}
    </>
  );
}
