import { useState, useEffect } from "react";
import SupportChat from "./SupportChat";
import styles from "./FloatingSupportChat.module.css";

// Only show for logged-in customers
export default function FloatingSupportChat() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [visible, setVisible] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Check if user is a logged-in customer
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (token && user.role === "customer") {
      setVisible(true);
    }
  }, []);

  // Poll unread count when chat is closed
  useEffect(() => {
    if (!visible || open) return;

    async function fetchUnread() {
      try {
        const res = await fetch(`${API_URL}/api/support-chat/unread`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUnread(data.unread || 0);
        }
      } catch {}
    }

    fetchUnread();
    const id = setInterval(fetchUnread, 15000);
    return () => clearInterval(id);
  }, [visible, open, API_URL]);

  // Clear unread badge when chat is opened
  function handleOpen() {
    setOpen(true);
    setUnread(0);
  }

  if (!visible) return null;

  return (
    <>
      {/* ── Floating chat window ── */}
      {open && (
        <div className={styles.chatWindow}>
          <SupportChat onClose={() => setOpen(false)} />
        </div>
      )}

      {/* ── Floating trigger button ── */}
      {!open && (
        <button
          className={styles.fab}
          onClick={handleOpen}
          aria-label="Open support chat"
        >
          <span className={styles.fabIcon}>💬</span>
          <span className={styles.fabLabel}>Support</span>
          {unread > 0 && (
            <span className={styles.badge}>{unread > 99 ? "99+" : unread}</span>
          )}
          <span className={styles.pulse} />
        </button>
      )}
    </>
  );
}
