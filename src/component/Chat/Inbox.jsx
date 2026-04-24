import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Inbox.module.css";
import Chat from "./Chat";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function timeAgo(d) {
  if (!d) return "";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  const days = Math.floor(s / 86400);
  if (days < 7) return `${days}d`;
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

function initials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

// ── Avatar ────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 48, unread = 0 }) {
  const [err, setErr] = useState(false);
  return (
    <div className={styles.avatarWrap} style={{ width: size, height: size }}>
      {src && !err ? (
        <img
          src={src}
          alt={name}
          className={styles.avatarImg}
          onError={() => setErr(true)}
        />
      ) : (
        <div
          className={styles.avatarFallback}
          style={{ fontSize: size * 0.35, width: size, height: size }}
        >
          {initials(name)}
        </div>
      )}
      {unread > 0 && (
        <span className={styles.unreadBadge}>
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </div>
  );
}

// ── Conversation row ──────────────────────────────────────────────────
function ConvRow({ conv, currentUserId, currentRole, onClick }) {
  const isCustomer = currentRole === "customer";
  const otherName = isCustomer ? conv.maid_name : conv.customer_name;
  const otherAvatar = isCustomer ? conv.maid_avatar : conv.customer_avatar;
  const myUnread = isCustomer ? conv.unread_customer : conv.unread_maid;
  const isInquiry = conv.type === "inquiry" || !conv.booking_id;
  const hasUnread = myUnread > 0;

  return (
    <button
      className={`${styles.convRow} ${hasUnread ? styles.convRowUnread : ""}`}
      onClick={() => onClick(conv, otherName, otherAvatar)}
    >
      <Avatar src={otherAvatar} name={otherName} size={50} unread={myUnread} />

      <div className={styles.convBody}>
        <div className={styles.convTop}>
          <span
            className={`${styles.convName} ${hasUnread ? styles.convNameBold : ""}`}
          >
            {otherName || "Unknown"}
          </span>
          <span className={styles.convTime}>
            {timeAgo(conv.last_message_at || conv.updated_at)}
          </span>
        </div>
        <div className={styles.convBottom}>
          <span
            className={`${styles.convPreview} ${hasUnread ? styles.convPreviewBold : ""}`}
          >
            {conv.last_message
              ? conv.last_message.length > 50
                ? conv.last_message.slice(0, 50) + "…"
                : conv.last_message
              : "Start the conversation…"}
          </span>
          <div className={styles.convTags}>
            {isInquiry ? (
              <span className={styles.tagInquiry}>inquiry</span>
            ) : (
              <span className={styles.tagBooking}>booking</span>
            )}
            {conv.booking_status && !isInquiry && (
              <span
                className={`${styles.tagStatus} ${styles[`status_${conv.booking_status}`]}`}
              >
                {conv.booking_status.replace("_", " ")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.convArrow}>›</div>
    </button>
  );
}

// ── Main Inbox ────────────────────────────────────────────────────────
export default function Inbox({ embedded = false, onClose }) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | inquiry | booking
  const [search, setSearch] = useState("");
  const [openChat, setOpenChat] = useState(null); // {convId, name, avatar}

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const currentRole = currentUser?.role;
  const currentId = currentUser?.id;

  const load = useCallback(
    async (silent = false) => {
      if (!token) return;
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setConversations(data.conversations || []);
        else setError(data.error || "Failed to load messages");
      } catch {
        setError("Network error");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Poll every 15s for new messages
  useEffect(() => {
    const id = setInterval(() => load(true), 15000);
    return () => clearInterval(id);
  }, [load]);

  function handleOpen(conv, name, avatar) {
    setOpenChat({ convId: conv.id, name, avatar, bookingId: conv.booking_id });
  }

  // If a chat is open, render it full-screen
  if (openChat) {
    return (
      <Chat
        conversationId={openChat.convId}
        bookingId={openChat.bookingId}
        otherName={openChat.name}
        otherAvatar={openChat.avatar}
        onClose={() => {
          setOpenChat(null);
          load(true);
        }}
      />
    );
  }

  // Filter + search
  const filtered = conversations.filter((c) => {
    const isInquiry = c.type === "inquiry" || !c.booking_id;
    if (filter === "inquiry" && !isInquiry) return false;
    if (filter === "booking" && isInquiry) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const name =
        currentRole === "customer"
          ? (c.maid_name || "").toLowerCase()
          : (c.customer_name || "").toLowerCase();
      const preview = (c.last_message || "").toLowerCase();
      if (!name.includes(q) && !preview.includes(q)) return false;
    }
    return true;
  });

  const totalUnread = conversations.reduce((sum, c) => {
    return (
      sum +
      (currentRole === "customer" ? c.unread_customer || 0 : c.unread_maid || 0)
    );
  }, 0);

  return (
    <div className={`${styles.inbox} ${embedded ? styles.inboxEmbedded : ""}`}>
      {/* ── Header ──────────────────────────────────────────── */}
      {!embedded && (
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              ←
            </button>
            <div>
              <h1 className={styles.headerTitle}>Messages</h1>
              {totalUnread > 0 && (
                <p className={styles.headerSub}>{totalUnread} unread</p>
              )}
            </div>
          </div>
        </div>
      )}

      {embedded && (
        <div className={styles.embeddedHeader}>
          <h2 className={styles.embeddedTitle}>
            Messages
            {totalUnread > 0 && (
              <span className={styles.embeddedBadge}>{totalUnread}</span>
            )}
          </h2>
        </div>
      )}

      {/* ── Search ──────────────────────────────────────────── */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search conversations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className={styles.searchClear} onClick={() => setSearch("")}>
            ✕
          </button>
        )}
      </div>

      {/* ── Filter tabs ─────────────────────────────────────── */}
      <div className={styles.filterTabs}>
        {[
          ["all", "All"],
          ["inquiry", "Inquiries"],
          ["booking", "Bookings"],
        ].map(([val, label]) => (
          <button
            key={val}
            className={`${styles.filterTab} ${filter === val ? styles.filterTabActive : ""}`}
            onClick={() => setFilter(val)}
          >
            {label}
            {val === "all" && conversations.length > 0 && (
              <span className={styles.filterCount}>{conversations.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── List ────────────────────────────────────────────── */}
      <div className={styles.list}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Loading messages…</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>⚠️ {error}</p>
            <button className={styles.retryBtn} onClick={() => load()}>
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <p className={styles.emptyTitle}>
              {search
                ? "No results found"
                : filter !== "all"
                  ? `No ${filter} chats yet`
                  : "No messages yet"}
            </p>
            <p className={styles.emptyHint}>
              {!search && filter === "all" && currentRole === "customer"
                ? "Browse maids and tap Message to start a conversation"
                : filter !== "all"
                  ? `Switch to 'All' to see all conversations`
                  : ""}
            </p>
            {!search && filter === "all" && currentRole === "customer" && (
              <button
                className={styles.browsBtn}
                onClick={() => navigate("/maids")}
              >
                Browse Maids
              </button>
            )}
          </div>
        ) : (
          filtered.map((conv) => (
            <ConvRow
              key={conv.id}
              conv={conv}
              currentUserId={currentId}
              currentRole={currentRole}
              onClick={handleOpen}
            />
          ))
        )}
      </div>
    </div>
  );
}
