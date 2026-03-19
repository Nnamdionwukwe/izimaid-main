import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AdminChats.module.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const CONVERSATIONS_URL = `${API_URL}/api/chat/admin`;
const POLL_INTERVAL = 30000;

const BOOKING_STATUS_STYLES = {
  pending: { bg: "#fff8e1", color: "#f59e0b" },
  confirmed: { bg: "#e3f2fd", color: "#1976d2" },
  completed: { bg: "#e8f5e9", color: "#388e3c" },
  cancelled: { bg: "#fce4ec", color: "#c62828" },
  in_progress: { bg: "#ede7f6", color: "#6a1b9a" },
  declined: { bg: "#fff3e0", color: "#e65100" },
};

// Deletion status → human-readable label + colours
const DELETION_META = {
  deleted_by_customer: {
    label: "🗑 Deleted by customer",
    bg: "#fff3e0",
    color: "#e65100",
    detail: (conv) =>
      `Customer deleted this chat${
        conv.deleted_at_customer
          ? " on " + formatDate(conv.deleted_at_customer)
          : ""
      }. The maid's view is unaffected.`,
  },
  deleted_by_maid: {
    label: "🗑 Deleted by maid",
    bg: "#fff3e0",
    color: "#e65100",
    detail: (conv) =>
      `Maid deleted this chat${
        conv.deleted_at_maid ? " on " + formatDate(conv.deleted_at_maid) : ""
      }. The customer's view is unaffected.`,
  },
  deleted_by_both: {
    label: "🗑 Deleted by both parties",
    bg: "#fce4ec",
    color: "#c62828",
    detail: (conv) => {
      const parts = [];
      if (conv.deleted_at_customer)
        parts.push(`Customer: ${formatDate(conv.deleted_at_customer)}`);
      if (conv.deleted_at_maid)
        parts.push(`Maid: ${formatDate(conv.deleted_at_maid)}`);
      return `Both parties have deleted this chat. ${parts.join(" · ")}`;
    },
  },
};

function getToken() {
  return localStorage.getItem("token");
}
function authH() {
  return { Authorization: `Bearer ${getToken()}` };
}

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
  if (!d) return "—";
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Avatar({ name, src, size = 36 }) {
  const [err, setErr] = useState(false);
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";
  if (src && !err) {
    return (
      <img
        src={src}
        alt={name}
        className={styles.avatar}
        style={{ width: size, height: size }}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div
      className={styles.avatarFallback}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

// ─── Deletion badge (small, used in list rows) ───────────────────────
function DeletionBadge({ status }) {
  const meta = DELETION_META[status];
  if (!meta) return null;
  return (
    <span
      className={styles.deletionBadge}
      style={{ background: meta.bg, color: meta.color }}
      title={status.replace(/_/g, " ")}
    >
      {meta.label}
    </span>
  );
}

// ─── Deletion banner (full-width, used in detail view) ───────────────
function DeletionBanner({ conv }) {
  const meta = DELETION_META[conv.deletion_status];
  if (!meta) return null;
  return (
    <div
      className={styles.deletionBanner}
      style={{
        background: meta.bg,
        borderColor: meta.color,
        color: meta.color,
      }}
    >
      <span className={styles.deletionBannerIcon}>⚠️</span>
      <div>
        <strong>{meta.label}</strong>
        <p className={styles.deletionBannerDetail}>{meta.detail(conv)}</p>
      </div>
      <span className={styles.deletionBannerNote}>
        Admin view is always preserved
      </span>
    </div>
  );
}

// ─── Lightbox ────────────────────────────────────────────────────────
function Lightbox({ item, onClose }) {
  if (!item) return null;
  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <div
        className={styles.lightboxContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.lightboxClose} onClick={onClose}>
          ×
        </button>
        {item.media_type === "video" ? (
          <video
            src={item.media_url}
            controls
            autoPlay
            className={styles.lightboxMedia}
          />
        ) : (
          <img
            src={item.media_url}
            alt={item.content}
            className={styles.lightboxMedia}
          />
        )}
        {item.content && <p className={styles.lightboxName}>{item.content}</p>}
      </div>
    </div>
  );
}

// ─── Single message bubble ───────────────────────────────────────────
function MessageBubble({ msg, conversation, onMediaClick }) {
  const isCustomer = msg.sender_id === conversation.customer_id;
  const isMaid = msg.sender_id === conversation.maid_id;

  const bubbleClass = isCustomer
    ? styles.bubbleCustomer
    : isMaid
      ? styles.bubbleMaid
      : styles.bubbleOther;

  const label = isCustomer
    ? `👤 ${conversation.customer_name}`
    : isMaid
      ? `🧹 ${conversation.maid_name}`
      : msg.sender_name || "Unknown";

  const hasMedia =
    msg.media_url &&
    (msg.message_type === "image" || msg.message_type === "video");

  return (
    <div
      className={`${styles.bubbleWrap} ${
        isCustomer ? styles.bubbleWrapRight : styles.bubbleWrapLeft
      }`}
    >
      {!isCustomer && (
        <div className={styles.bubbleAvatar}>
          <Avatar
            name={isMaid ? conversation.maid_name : msg.sender_name}
            src={msg.sender_avatar}
            size={28}
          />
        </div>
      )}
      <div className={`${styles.bubble} ${bubbleClass}`}>
        <span className={styles.senderLabel}>{label}</span>
        {/* Admin sees FULL content even for deleted messages, plus a deletion notice */}
        {msg.deleted_at && (
          <div className={styles.adminDeletedBanner}>
            <span>
              🗑 Deleted by {msg.deleted_by_name || "sender"} ·{" "}
              {formatDate(msg.deleted_at)}
            </span>
          </div>
        )}

        {/* Always render media and text — admin can read everything */}
        {hasMedia && (
          <button
            className={styles.mediaBubble}
            onClick={() => onMediaClick(msg)}
            type="button"
          >
            {msg.message_type === "video" ? (
              <div className={styles.videoThumb}>
                <span className={styles.playIcon}>▶</span>
                <span className={styles.mediaCaption}>Video</span>
              </div>
            ) : (
              <img
                src={msg.media_url}
                alt={msg.content || "image"}
                className={styles.mediaImg}
              />
            )}
          </button>
        )}
        {msg.content && !hasMedia && (
          <p
            className={`${styles.bubbleText} ${msg.deleted_at ? styles.bubbleTextDeleted : ""}`}
          >
            {msg.content}
          </p>
        )}
        {msg.content && hasMedia && (
          <p className={styles.mediaCaption}>{msg.content}</p>
        )}
        <div className={styles.bubbleMeta}>
          <span className={styles.bubbleTime}>
            {formatDate(msg.created_at)}
          </span>
          {msg.is_read && isCustomer && (
            <span className={styles.readTick} title="Read">
              ✓✓
            </span>
          )}
        </div>
      </div>
      {isCustomer && (
        <div className={styles.bubbleAvatar}>
          <Avatar
            name={conversation.customer_name}
            src={msg.sender_avatar}
            size={28}
          />
        </div>
      )}
    </div>
  );
}

// ─── Conversation Detail ─────────────────────────────────────────────
function ConversationDetail({ conversationId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [lightboxMsg, setLightboxMsg] = useState(null);
  const [error, setError] = useState("");
  const threadRef = useRef(null);

  const fetchConversation = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      try {
        const res = await fetch(`${CONVERSATIONS_URL}/${conversationId}`, {
          headers: authH(),
        });
        if (!res.ok) throw new Error("Failed to load conversation");
        const json = await res.json();
        setData(json);
        setLastRefresh(new Date());
      } catch (err) {
        setError(err.message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [conversationId],
  );

  useEffect(() => {
    fetchConversation(false);
  }, [conversationId]);

  useEffect(() => {
    if (data && threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [data?.messages?.length]);

  useEffect(() => {
    const id = setInterval(() => fetchConversation(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchConversation]);

  const conv = data?.conversation;
  const messages = data?.messages || [];
  const bkStatus = conv ? BOOKING_STATUS_STYLES[conv.booking_status] || {} : {};

  return (
    <div className={styles.detailWrap}>
      {/* Nav bar */}
      <div className={styles.detailNav}>
        <button className={styles.backBtn} onClick={onBack}>
          ← All Conversations
        </button>
        <div className={styles.refreshRow}>
          {lastRefresh && (
            <span className={styles.lastRefresh}>
              Updated {timeAgo(lastRefresh)}
            </span>
          )}
          <button
            className={styles.refreshBtn}
            onClick={() => fetchConversation(false)}
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.skeletonDetail}>
          <div className={styles.skeletonHeader} />
          <div className={styles.skeletonThread} />
        </div>
      )}

      {error && !loading && <div className={styles.errorBox}>{error}</div>}

      {!loading && conv && (
        <div className={styles.detailCard}>
          {/* ── Deletion banner — shown prominently if any party deleted ── */}
          <DeletionBanner conv={conv} />

          {/* Participants header */}
          <div className={styles.participantsBar}>
            <div className={styles.participant}>
              <Avatar
                name={conv.customer_name}
                src={conv.customer_avatar}
                size={44}
              />
              <div>
                <p className={styles.participantName}>{conv.customer_name}</p>
                <p className={styles.participantRole}>👤 Customer</p>
                {conv.customer_email && (
                  <p className={styles.participantEmail}>
                    {conv.customer_email}
                  </p>
                )}
                {/* Show if customer deleted their view */}
                {conv.deleted_by_customer && (
                  <p className={styles.participantDeleted}>
                    🗑 Deleted{" "}
                    {conv.deleted_at_customer
                      ? timeAgo(conv.deleted_at_customer)
                      : ""}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.convArrow}>
              <span className={styles.arrowLine} />
              <div className={styles.convMeta}>
                <span className={styles.msgCount}>
                  💬 {messages.length} messages
                </span>
                {conv.service_date && (
                  <span className={styles.serviceDate}>
                    📅{" "}
                    {new Date(conv.service_date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                {conv.booking_status && (
                  <span
                    className={styles.bookingBadge}
                    style={{ background: bkStatus.bg, color: bkStatus.color }}
                  >
                    {conv.booking_status.replace("_", " ")}
                  </span>
                )}
                {conv.total_amount && (
                  <span className={styles.amount}>
                    ₦{Number(conv.total_amount).toLocaleString()}
                  </span>
                )}
              </div>
              <span className={styles.arrowLine} />
            </div>

            <div className={`${styles.participant} ${styles.participantRight}`}>
              <Avatar name={conv.maid_name} src={conv.maid_avatar} size={44} />
              <div>
                <p className={styles.participantName}>{conv.maid_name}</p>
                <p className={styles.participantRole}>🧹 Maid</p>
                {conv.maid_email && (
                  <p className={styles.participantEmail}>{conv.maid_email}</p>
                )}
                {/* Show if maid deleted their view */}
                {conv.deleted_by_maid && (
                  <p className={styles.participantDeleted}>
                    🗑 Deleted{" "}
                    {conv.deleted_at_maid ? timeAgo(conv.deleted_at_maid) : ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Admin read-only badge */}
          <div className={styles.adminViewBanner}>
            🛡️ Admin read-only view · Messages are not marked as read by this
            action
          </div>

          {/* Thread */}
          <div className={styles.thread} ref={threadRef}>
            {messages.length === 0 && (
              <p className={styles.noMessages}>
                No messages in this conversation yet.
              </p>
            )}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                conversation={conv}
                onMediaClick={setLightboxMsg}
              />
            ))}
          </div>

          {/* Footer */}
          <div className={styles.threadFooter}>
            <span className={styles.threadFooterNote}>
              Conversation started {formatDate(conv.created_at)}
              {conv.address && ` · ${conv.address}`}
            </span>
          </div>
        </div>
      )}

      <Lightbox item={lightboxMsg} onClose={() => setLightboxMsg(null)} />
    </div>
  );
}

// ─── Conversation Row ────────────────────────────────────────────────
function ConversationRow({ conv, onClick }) {
  const bkStyle = BOOKING_STATUS_STYLES[conv.booking_status] || {};
  const isDeleted = conv.deletion_status && conv.deletion_status !== "active";

  return (
    <div
      className={`${styles.convRow} ${isDeleted ? styles.convRowDeleted : ""}`}
      onClick={onClick}
    >
      <div className={styles.convRowAvatars}>
        <Avatar
          name={conv.customer_name}
          src={conv.customer_avatar}
          size={38}
        />
        <Avatar name={conv.maid_name} src={conv.maid_avatar} size={38} />
      </div>
      <div className={styles.convRowBody}>
        <div className={styles.convRowTop}>
          <span className={styles.convNames}>
            {conv.customer_name} <span className={styles.convVs}>↔</span>{" "}
            {conv.maid_name}
          </span>
          <span className={styles.convTime}>
            {timeAgo(conv.last_message_at || conv.updated_at)}
          </span>
        </div>

        <p className={styles.convLastMsg}>
          {conv.last_message ? (
            conv.last_message.length > 80 ? (
              conv.last_message.slice(0, 80) + "…"
            ) : (
              conv.last_message
            )
          ) : (
            <em className={styles.noMsg}>No messages yet</em>
          )}
        </p>

        <div className={styles.convRowMeta}>
          <span className={styles.convMsgCount}>
            💬 {conv.message_count ?? 0}
          </span>
          {conv.service_date && (
            <span className={styles.convServiceDate}>
              📅{" "}
              {new Date(conv.service_date).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
          {conv.booking_status && (
            <span
              className={styles.convBookingBadge}
              style={{ background: bkStyle.bg, color: bkStyle.color }}
            >
              {conv.booking_status.replace("_", " ")}
            </span>
          )}
          {/* ── Deletion badge ── */}
          {isDeleted && <DeletionBadge status={conv.deletion_status} />}
          <span className={styles.convId}>
            #{conv.booking_id?.toString().slice(0, 8)}
          </span>
        </div>
      </div>
      <span className={styles.convChevron}>›</span>
    </div>
  );
}

// ─── Main AdminChats ─────────────────────────────────────────────────
export default function AdminChats() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  // Filter to show only deleted conversations
  const [showDeleted, setShowDeleted] = useState(false);
  const LIMIT = 20;
  const navigate = useNavigate();

  const fetchConversations = useCallback(
    async (silent = false, pg = page, q = search) => {
      if (!silent) setLoading(true);
      else setSyncing(true);
      try {
        const params = new URLSearchParams({ page: pg, limit: LIMIT });
        if (q.trim()) params.set("search", q.trim());
        const res = await fetch(`${CONVERSATIONS_URL}?${params}`, {
          headers: authH(),
        });
        const data = await res.json();
        setConversations(data.conversations || []);
        setTotal(data.total || 0);
        setTotalPages(data.pages || 1);
        setLastSync(new Date());
      } catch {
      } finally {
        if (!silent) setLoading(false);
        else setSyncing(false);
      }
    },
    [page, search],
  );

  useEffect(() => {
    fetchConversations(false, page, search);
  }, [page, search]);

  useEffect(() => {
    if (selectedId) return;
    const id = setInterval(
      () => fetchConversations(true, page, search),
      POLL_INTERVAL,
    );
    return () => clearInterval(id);
  }, [fetchConversations, selectedId, page, search]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Client-side deletion filter
  const displayed = showDeleted
    ? conversations.filter(
        (c) => c.deletion_status && c.deletion_status !== "active",
      )
    : conversations;

  const deletedCount = conversations.filter(
    (c) => c.deletion_status && c.deletion_status !== "active",
  ).length;

  if (selectedId) {
    return (
      <div className={styles.page}>
        <ConversationDetail
          conversationId={selectedId}
          onBack={() => setSelectedId(null)}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.listHeader}>
        <div>
          <button className={styles.backBtn} onClick={() => navigate("/admin")}>
            ← Dashboard
          </button>
          <h1 className={styles.pageTitle}>💬 Chats</h1>
          <p className={styles.pageSub}>
            Read-only view of all customer ↔ maid conversations
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.syncBtn} ${syncing ? styles.syncBtnSyncing : ""}`}
            onClick={() => fetchConversations(false, page, search)}
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {lastSync && (
        <p className={styles.syncStatus}>
          {syncing
            ? "Checking for updates…"
            : `Last updated ${timeAgo(lastSync)}`}
        </p>
      )}

      {/* Search + deleted filter row */}
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="🔍  Search by customer name, maid name or booking ID…"
        />
        {searchInput && (
          <button
            className={styles.clearSearch}
            onClick={() => setSearchInput("")}
          >
            ×
          </button>
        )}
      </div>

      {/* Deleted filter toggle */}
      {deletedCount > 0 && (
        <button
          className={`${styles.deletedFilterBtn} ${showDeleted ? styles.deletedFilterBtnActive : ""}`}
          onClick={() => setShowDeleted((v) => !v)}
        >
          🗑 {showDeleted ? "Show all" : `Show deleted (${deletedCount})`}
        </button>
      )}

      {!loading && (
        <p className={styles.resultCount}>
          {showDeleted ? deletedCount : total} conversation
          {(showDeleted ? deletedCount : total) !== 1 ? "s" : ""}
          {search ? ` matching "${search}"` : ""}
          {showDeleted ? " · deleted view" : ""}
        </p>
      )}

      {loading ? (
        <div className={styles.skeletonList}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={styles.skeletonRow}
              style={{ animationDelay: `${i * 0.07}s` }}
            />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💬</div>
          <p className={styles.emptyTitle}>
            {showDeleted
              ? "No deleted conversations"
              : search
                ? "No matching conversations"
                : "No conversations yet"}
          </p>
          <p className={styles.emptySub}>
            {showDeleted
              ? "No parties have deleted any chats yet."
              : search
                ? "Try searching by name or booking ID."
                : "Conversations between customers and maids will appear here."}
          </p>
        </div>
      ) : (
        <>
          <div className={styles.convList}>
            {displayed.map((c) => (
              <ConversationRow
                key={c.id}
                conv={c}
                onClick={() => setSelectedId(c.id)}
              />
            ))}
          </div>

          {totalPages > 1 && !showDeleted && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                className={styles.pageBtn}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
