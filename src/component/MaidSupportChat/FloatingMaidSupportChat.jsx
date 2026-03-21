import { useState, useEffect } from "react";
import MaidSupportChat from "./MaidSupportChat";
import styles from "./FloatingMaidSupportChat.module.css";

// Only renders for logged-in maids
export default function FloatingMaidSupportChat() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [visible, setVisible] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Check if user is a logged-in maid
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (token && user.role === "maid") {
      setVisible(true);
    }
  }, []);

  // Poll unread count when chat is closed
  useEffect(() => {
    if (!visible || open) return;

    async function fetchUnread() {
      try {
        const res = await fetch(`${API_URL}/api/maid-support-chat/unread`, {
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
          <MaidSupportChat onClose={() => setOpen(false)} />
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
          <span className={styles.fabLabel}>Chat Admin</span>
          {unread > 0 && (
            <span className={styles.badge}>{unread > 99 ? "99+" : unread}</span>
          )}
          <span className={styles.pulse} />
        </button>
      )}
    </>
  );
}
