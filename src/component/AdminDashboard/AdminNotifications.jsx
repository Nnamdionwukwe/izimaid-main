import { useState, useEffect, useCallback } from "react";
import styles from "./AdminNotifications.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(d) {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const PRIORITY_BADGE = {
  normal: styles.badgeNormal,
  high: styles.badgeHigh,
  urgent: styles.badgeUrgent,
};

// ── Notifications Tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const [notifs, setNotifs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const LIMIT = 50;

  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (typeFilter) params.set("type", typeFilter);
      if (readFilter) params.set("is_read", readFilter);
      if (priorityFilter) params.set("priority", priorityFilter);
      const res = await fetch(`${API_URL}/api/notifications/admin?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifs(data.notifications || []);
      setStats(data.stats || null);
      setHasMore((data.notifications || []).length === LIMIT);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, readFilter, priorityFilter]);

  useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);
  useEffect(() => {
    setPage(1);
  }, [typeFilter, readFilter, priorityFilter]);

  // Client-side search on user name / title / body
  const filtered = notifs.filter((n) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.body?.toLowerCase().includes(q) ||
      n.user_name?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Stats */}
      {stats && (
        <div className={styles.statsStrip}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total</p>
            <p className={styles.statValue}>
              {Number(stats.total).toLocaleString()}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Unread</p>
            <p className={`${styles.statValue} ${styles.amber}`}>
              {Number(stats.unread).toLocaleString()}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Urgent</p>
            <p className={`${styles.statValue} ${styles.red}`}>
              {Number(stats.urgent).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search by user, title or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.selectFilter}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          {[
            "booking_confirmed",
            "booking_cancelled",
            "booking_completed",
            "payment_received",
            "booking_approved",
            "withdrawal_requested",
            "withdrawal_paid",
            "withdrawal_rejected",
            "sos_triggered",
            "sos_resolved",
            "review_received",
            "document_approved",
            "document_rejected",
            "system_announcement",
            "account_deactivated",
          ].map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          className={styles.selectFilter}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All priorities</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <select
          className={styles.selectFilter}
          value={readFilter}
          onChange={(e) => setReadFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      <p className={styles.sectionTitle}>
        Notifications
        <span className={styles.sectionCount}>{filtered.length}</span>
      </p>

      {loading ? (
        <div className={styles.loading}>Loading notifications...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔔</div>
          <p className={styles.emptyText}>No notifications found</p>
        </div>
      ) : (
        <>
          <div className={styles.notifList}>
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`
                ${styles.notifCard}
                ${!n.is_read ? styles.notifCardUnread : ""}
                ${n.priority === "urgent" ? styles.notifCardUrgent : ""}
              `}
              >
                <div className={styles.notifCardTop}>
                  <div
                    className={`
                    ${styles.notifDot}
                    ${n.is_read ? styles.notifDotRead : ""}
                    ${n.priority === "urgent" ? styles.notifDotUrgent : ""}
                  `}
                  />
                  <div className={styles.notifBody}>
                    {n.user_name && (
                      <p className={styles.notifUser}>
                        {n.user_name} · {n.user_role}
                      </p>
                    )}
                    <p className={styles.notifTitle}>{n.title}</p>
                    <p className={styles.notifText}>{n.body}</p>
                  </div>
                </div>

                <div className={styles.notifMeta}>
                  <span className={`${styles.badge} ${styles.badgeType}`}>
                    {n.type?.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`${styles.badge} ${PRIORITY_BADGE[n.priority] || styles.badgeNormal}`}
                  >
                    {n.priority}
                  </span>
                  {!n.is_read && (
                    <span className={`${styles.badge} ${styles.badgeHigh}`}>
                      unread
                    </span>
                  )}
                  <span className={styles.metaDate}>
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {(page > 1 || hasMore) && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className={styles.pageInfo}>Page {page}</span>
              <button
                className={styles.pageBtn}
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

// ── Announce Tab ──────────────────────────────────────────────────────────────
function AnnounceTab() {
  // Broadcast form
  const [broadcast, setBroadcast] = useState({
    title: "",
    body: "",
    role: "",
    priority: "normal",
    action_url: "",
  });
  const [sending, setSending] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState(null);

  // Direct form
  const [direct, setDirect] = useState({
    user_id: "",
    title: "",
    body: "",
    type: "system_announcement",
    priority: "normal",
    action_url: "",
  });
  const [sendingDirect, setSendingDirect] = useState(false);
  const [directMsg, setDirectMsg] = useState(null);

  async function handleBroadcast() {
    if (!broadcast.title || !broadcast.body) {
      setBroadcastMsg({
        type: "error",
        text: "Title and message are required",
      });
      return;
    }
    setSending(true);
    setBroadcastMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications/admin/announce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(broadcast),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBroadcastMsg({
        type: "success",
        text: `✓ Sent to ${data.count} user${data.count !== 1 ? "s" : ""}`,
      });
      setBroadcast((f) => ({ ...f, title: "", body: "", action_url: "" }));
    } catch (err) {
      setBroadcastMsg({ type: "error", text: err.message });
    } finally {
      setSending(false);
    }
  }

  async function handleDirect() {
    if (!direct.user_id || !direct.title || !direct.body) {
      setDirectMsg({
        type: "error",
        text: "User ID, title and message are required",
      });
      return;
    }
    setSendingDirect(true);
    setDirectMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications/admin/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(direct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDirectMsg({ type: "success", text: "✓ Notification sent" });
      setDirect((f) => ({
        ...f,
        user_id: "",
        title: "",
        body: "",
        action_url: "",
      }));
    } catch (err) {
      setDirectMsg({ type: "error", text: err.message });
    } finally {
      setSendingDirect(false);
    }
  }

  function setB(field, val) {
    setBroadcast((f) => ({ ...f, [field]: val }));
  }
  function setD(field, val) {
    setDirect((f) => ({ ...f, [field]: val }));
  }

  return (
    <>
      {/* Broadcast */}
      <div className={styles.formCard}>
        <div className={styles.formCardHead}>
          <p className={styles.formCardTitle}>📢 Broadcast Announcement</p>
          <p className={styles.formCardSub}>
            Send to all users, all customers, or all maids
          </p>
        </div>
        <div className={styles.formBody}>
          {broadcastMsg && (
            <div
              className={`${styles.feedback} ${broadcastMsg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
            >
              {broadcastMsg.text}
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Audience</label>
              <select
                className={styles.formSelect}
                value={broadcast.role}
                onChange={(e) => setB("role", e.target.value)}
              >
                <option value="">Everyone</option>
                <option value="customer">Customers only</option>
                <option value="maid">Maids only</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Priority</label>
              <select
                className={styles.formSelect}
                value={broadcast.priority}
                onChange={(e) => setB("priority", e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="Announcement title..."
              value={broadcast.title}
              onChange={(e) => setB("title", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Message</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Write the announcement message..."
              value={broadcast.body}
              onChange={(e) => setB("body", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Action URL (optional)</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="/dashboard or https://..."
              value={broadcast.action_url}
              onChange={(e) => setB("action_url", e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formFooter}>
          <button
            className={styles.submitBtn}
            onClick={handleBroadcast}
            disabled={sending}
          >
            {sending
              ? "Sending..."
              : `📢 Send to ${broadcast.role ? broadcast.role + "s" : "Everyone"}`}
          </button>
        </div>
      </div>

      {/* Direct */}
      <div className={styles.formCard}>
        <div className={styles.formCardHead}>
          <p className={styles.formCardTitle}>📩 Direct Notification</p>
          <p className={styles.formCardSub}>
            Send to a specific user by their ID
          </p>
        </div>
        <div className={styles.formBody}>
          {directMsg && (
            <div
              className={`${styles.feedback} ${directMsg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
            >
              {directMsg.text}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>User ID</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="Paste user UUID..."
              value={direct.user_id}
              onChange={(e) => setD("user_id", e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Type</label>
              <select
                className={styles.formSelect}
                value={direct.type}
                onChange={(e) => setD("type", e.target.value)}
              >
                {[
                  "system_announcement",
                  "booking_confirmed",
                  "booking_cancelled",
                  "payment_received",
                  "booking_approved",
                  "withdrawal_requested",
                  "withdrawal_paid",
                  "account_deactivated",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Priority</label>
              <select
                className={styles.formSelect}
                value={direct.priority}
                onChange={(e) => setD("priority", e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="Notification title..."
              value={direct.title}
              onChange={(e) => setD("title", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Message</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Notification message..."
              value={direct.body}
              onChange={(e) => setD("body", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Action URL (optional)</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="/bookings/123 or external URL..."
              value={direct.action_url}
              onChange={(e) => setD("action_url", e.target.value)}
            />
          </div>
        </div>
        <div className={styles.formFooter}>
          <button
            className={styles.submitBtn}
            onClick={handleDirect}
            disabled={sendingDirect}
          >
            {sendingDirect ? "Sending..." : "📩 Send Notification"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Cleanup Tab ───────────────────────────────────────────────────────────────
function CleanupTab() {
  const [daysOld, setDaysOld] = useState(90);
  const [cleaning, setCleaning] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleCleanup() {
    setCleaning(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications/admin/cleanup`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days_old: daysOld }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({
        type: "success",
        text: `✓ Deleted ${data.deleted} old read notifications`,
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setCleaning(false);
    }
  }

  return (
    <>
      <div className={styles.cleanupCard}>
        <p className={styles.cleanupTitle}>⚠️ Database Cleanup</p>
        <p className={styles.cleanupSub}>
          Delete old read notifications to keep the database clean. Only read
          notifications older than the specified number of days will be deleted.
          Unread notifications are never deleted.
        </p>

        {msg && (
          <div
            className={`${styles.feedback} ${msg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
          >
            {msg.text}
          </div>
        )}
      </div>

      <div className={styles.formCard}>
        <div className={styles.formCardHead}>
          <p className={styles.formCardTitle}>Cleanup Old Notifications</p>
          <p className={styles.formCardSub}>
            Removes read notifications older than N days
          </p>
        </div>
        <div className={styles.formBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Delete read notifications older than
            </label>
            <select
              className={styles.formSelect}
              value={daysOld}
              onChange={(e) => setDaysOld(Number(e.target.value))}
            >
              {[30, 60, 90, 180, 365].map((d) => (
                <option key={d} value={d}>
                  {d} days
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.formFooter}>
          <button
            className={`${styles.submitBtn} ${styles.submitBtnDanger}`}
            onClick={handleCleanup}
            disabled={cleaning}
          >
            {cleaning
              ? "Deleting..."
              : `🗑 Delete Read Notifications Older Than ${daysOld} Days`}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main AdminNotifications ───────────────────────────────────────────────────
export default function AdminNotifications({ onBack }) {
  const [activeTab, setActiveTab] = useState("notifications");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/notifications/admin?limit=1&is_read=false`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setUnreadCount(Number(d.stats?.unread || 0)))
      .catch(console.error);
  }, []);

  const tabs = [
    { id: "notifications", label: "🔔 All Notifications" },
    { id: "announce", label: "📢 Send" },
    { id: "cleanup", label: "🗑 Cleanup" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Notifications</h1>
            {unreadCount > 0 && (
              <span className={styles.headerBadge}>{unreadCount} unread</span>
            )}
          </div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
        </div>

        <div className={styles.tabBar}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "announce" && <AnnounceTab />}
        {activeTab === "cleanup" && <CleanupTab />}
      </div>
    </div>
  );
}
