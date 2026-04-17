// src/component/Notifications/NotificationsPanel.jsx
// Shared between maid and customer dashboards
// Usage: <NotificationsPanel token={token} onClose={() => setOpen(false)} />

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./NotificationsPanel.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API = API_URL.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

// ── Notification type config ─────────────────────────────────────────
const TYPE_CONFIG = {
  booking_created: { icon: "📋", color: "#3b82f6", label: "New Booking" },
  booking_confirmed: {
    icon: "✅",
    color: "#22c55e",
    label: "Booking Confirmed",
  },
  booking_cancelled: {
    icon: "❌",
    color: "#ef4444",
    label: "Booking Cancelled",
  },
  booking_completed: {
    icon: "🎉",
    color: "#8b5cf6",
    label: "Booking Completed",
  },
  booking_declined: { icon: "🚫", color: "#f97316", label: "Booking Declined" },
  payment_received: { icon: "💰", color: "#22c55e", label: "Payment Received" },
  payment_failed: { icon: "💳", color: "#ef4444", label: "Payment Failed" },
  payment_refunded: { icon: "↩️", color: "#6366f1", label: "Refund Issued" },
  withdrawal_success: {
    icon: "🏦",
    color: "#22c55e",
    label: "Withdrawal Sent",
  },
  withdrawal_failed: {
    icon: "⚠️",
    color: "#ef4444",
    label: "Withdrawal Failed",
  },
  review_received: { icon: "⭐", color: "#f59e0b", label: "New Review" },
  message_received: { icon: "💬", color: "#3b82f6", label: "New Message" },
  support_reply: { icon: "🎫", color: "#8b5cf6", label: "Support Reply" },
  system_announcement: { icon: "📢", color: "#1a2466", label: "Announcement" },
  account_verified: { icon: "🪪", color: "#22c55e", label: "Account Verified" },
  document_reviewed: {
    icon: "📄",
    color: "#f59e0b",
    label: "Document Reviewed",
  },
};

const PRIORITY_DOT = {
  urgent: "#ef4444",
  high: "#f97316",
  normal: "#6b7280",
  low: "#9ca3af",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

// ── Single notification item ─────────────────────────────────────────
function NotifItem({ notif, onRead, onDelete }) {
  const cfg = TYPE_CONFIG[notif.type] || {
    icon: "🔔",
    color: "#1a2466",
    label: notif.type,
  };
  const isUnread = !notif.is_read;

  return (
    <div
      className={`${styles.item} ${isUnread ? styles.itemUnread : ""}`}
      onClick={() => !notif.is_read && onRead(notif.id)}
    >
      {/* Unread indicator */}
      {isUnread && <div className={styles.unreadDot} />}

      {/* Icon */}
      <div
        className={styles.itemIcon}
        style={{ background: cfg.color + "18", borderColor: cfg.color + "30" }}
      >
        <span>{cfg.icon}</span>
      </div>

      {/* Content */}
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span className={styles.itemTitle}>{notif.title}</span>
          <span className={styles.itemTime}>{timeAgo(notif.created_at)}</span>
        </div>
        <p className={styles.itemBody}>{notif.body}</p>
        <div className={styles.itemMeta}>
          <span className={styles.itemType} style={{ color: cfg.color }}>
            {cfg.label}
          </span>
          {notif.priority !== "normal" && (
            <span
              className={styles.itemPriority}
              style={{ color: PRIORITY_DOT[notif.priority] }}
            >
              ● {notif.priority}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notif.id);
        }}
        title="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────────
export default function NotificationsPanel({ token, onClose }) {
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [clearing, setClearing] = useState(false);
  const panelRef = useRef(null);
  const LIMIT = 20;

  const fetchNotifs = useCallback(
    async (p = 1, append = false) => {
      if (p === 1) setLoading(true);
      try {
        const params = new URLSearchParams({ page: p, limit: LIMIT });
        if (filter === "unread") params.set("unread", "true");

        const res = await fetch(`${API}/notifications?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setNotifs((prev) =>
            append
              ? [...prev, ...(data.notifications || [])]
              : data.notifications || [],
          );
          setUnread(data.unread || 0);
          setTotal(data.total || 0);
          setHasMore((data.notifications || []).length === LIMIT);
        }
      } catch (err) {
        console.error("Notifications fetch error:", err);
      }
      setLoading(false);
    },
    [token, filter],
  );

  useEffect(() => {
    setPage(1);
    fetchNotifs(1, false);
  }, [fetchNotifs]);

  // Poll for new notifications every 30s
  useEffect(() => {
    const id = setInterval(() => fetchNotifs(1, false), 30000);
    return () => clearInterval(id);
  }, [fetchNotifs]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  async function handleRead(id) {
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n,
        ),
      );
      setUnread((n) => Math.max(0, n - 1));
    } catch {}
  }

  async function handleReadAll() {
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {}
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs((prev) => prev.filter((n) => n.id !== id));
      setTotal((t) => t - 1);
    } catch {}
  }

  async function handleClearRead() {
    setClearing(true);
    try {
      await fetch(`${API}/notifications/clear/read`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs((prev) => prev.filter((n) => !n.is_read));
    } catch {}
    setClearing(false);
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    fetchNotifs(next, true);
  }

  const readCount = notifs.filter((n) => n.is_read).length;

  return (
    <div className={styles.overlay}>
      <div className={styles.panel} ref={panelRef}>
        {/* ── Header ─────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Notifications</h2>
            {unread > 0 && (
              <span className={styles.unreadBadge}>
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
          <div className={styles.headerActions}>
            {unread > 0 && (
              <button className={styles.actionLink} onClick={handleReadAll}>
                Mark all read
              </button>
            )}
            {readCount > 0 && (
              <button
                className={styles.actionLink}
                onClick={handleClearRead}
                disabled={clearing}
              >
                {clearing ? "Clearing…" : "Clear read"}
              </button>
            )}
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* ── Filter tabs ─────────────────────────────────────── */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === "all" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("all")}
          >
            All
            {total > 0 && <span className={styles.filterCount}>{total}</span>}
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "unread" ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread
            {unread > 0 && (
              <span className={styles.filterCountUnread}>{unread}</span>
            )}
          </button>
        </div>

        {/* ── Notification list ───────────────────────────────── */}
        <div className={styles.list}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.spinner} />
              <p>Loading notifications…</p>
            </div>
          ) : notifs.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔔</div>
              <p className={styles.emptyTitle}>
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </p>
              <p className={styles.emptySubtitle}>
                {filter === "unread"
                  ? "You're all caught up!"
                  : "Booking updates, payments, and messages will appear here."}
              </p>
            </div>
          ) : (
            <>
              {notifs.map((n) => (
                <NotifItem
                  key={n.id}
                  notif={n}
                  onRead={handleRead}
                  onDelete={handleDelete}
                />
              ))}

              {hasMore && (
                <button className={styles.loadMoreBtn} onClick={loadMore}>
                  Load more
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
