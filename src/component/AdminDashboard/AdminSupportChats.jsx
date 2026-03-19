import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AdminSupportChats.module.css";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const SUPPORT_URL = `${API_URL}/api/support-chat/admin`;
const POLL_INTERVAL = 15000; // faster poll — support needs quicker response

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
      }. Admin view is unaffected.`,
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
  const isAdmin = msg.sender_role === "admin";

  const bubbleClass = isCustomer
    ? styles.bubbleCustomer
    : isAdmin
      ? styles.bubbleAdmin
      : styles.bubbleOther;

  const label = isCustomer
    ? `👤 ${conversation.customer_name}`
    : `🛡️ ${msg.sender_name || "Support Team"}`;

  const hasMedia =
    msg.media_url &&
    (msg.message_type === "image" || msg.message_type === "video");

  return (
    <div
      className={`${styles.bubbleWrap} ${
        isCustomer ? styles.bubbleWrapLeft : styles.bubbleWrapRight
      }`}
    >
      {isCustomer && (
        <div className={styles.bubbleAvatar}>
          <Avatar
            name={conversation.customer_name}
            src={msg.sender_avatar}
            size={28}
          />
        </div>
      )}
      <div className={`${styles.bubble} ${bubbleClass}`}>
        <span className={styles.senderLabel}>{label}</span>

        {/* Admin sees full deleted message content + notice */}
        {msg.deleted_at && (
          <div className={styles.adminDeletedBanner}>
            <span>
              🗑 Deleted by {msg.deleted_by_name || "sender"} ·{" "}
              {formatDate(msg.deleted_at)}
            </span>
          </div>
        )}

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
          {!isCustomer && (
            <span
              className={styles.readTick}
              title={msg.is_read ? "Seen" : "Sent"}
            >
              {msg.is_read ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
      {!isCustomer && (
        <div className={styles.bubbleAvatar}>
          <Avatar
            name={msg.sender_name || "Support"}
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

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProg, setUploadProg] = useState("");

  const threadRef = useRef(null);
  const fileRef = useRef(null);
  const lastMsgId = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const REPLY_URL = `${API_BASE}/api/support-chat`;

  const fetchConversation = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      try {
        const res = await fetch(`${SUPPORT_URL}/${conversationId}`, {
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

  // Scroll to bottom on new messages
  useEffect(() => {
    const msgs = data?.messages || [];
    const last = msgs[msgs.length - 1];
    if (last && last.id !== lastMsgId.current) {
      lastMsgId.current = last.id;
      requestAnimationFrame(() => {
        if (threadRef.current) {
          threadRef.current.scrollTop = threadRef.current.scrollHeight;
        }
      });
    }
  }, [data?.messages?.length]);

  // Auto-refresh
  useEffect(() => {
    const id = setInterval(() => fetchConversation(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchConversation]);

  // ── Send reply ──
  async function handleSend() {
    const trimmed = replyText.trim();
    if (!trimmed && !files.length) return;
    if (!data?.conversation?.id) return;
    const convId = data.conversation.id;

    // Send media files first
    if (files.length) {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        setUploadProg(`Sending file ${i + 1} of ${files.length}…`);
        const form = new FormData();
        form.append("media", files[i].file);
        try {
          const res = await fetch(`${REPLY_URL}/${convId}/messages/media`, {
            method: "POST",
            headers: authH(),
            body: form,
          });
          const d = await res.json();
          if (res.ok) {
            setData((prev) => ({
              ...prev,
              messages: [...(prev?.messages || []), d.message],
            }));
          }
        } catch {}
      }
      setFiles([]);
      setUploadProg("");
      setUploading(false);
    }

    // Send text
    if (trimmed) {
      setSending(true);
      setSendError("");
      try {
        const res = await fetch(`${REPLY_URL}/${convId}/messages`, {
          method: "POST",
          headers: { ...authH(), "Content-Type": "application/json" },
          body: JSON.stringify({ content: trimmed }),
        });
        const d = await res.json();
        if (res.ok) {
          setData((prev) => ({
            ...prev,
            messages: [...(prev?.messages || []), d.message],
          }));
          setReplyText("");
        } else {
          setSendError(d.error || "Failed to send");
        }
      } catch {
        setSendError("Network error");
      } finally {
        setSending(false);
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleFileChange(e) {
    const picked = Array.from(e.target.files || []);
    const toAdd = picked.slice(0, 5 - files.length).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removeFile(i) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  const conv = data?.conversation;
  const messages = data?.messages || [];
  const isBusy = sending || uploading;

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
          {/* Deletion banner */}
          <DeletionBanner conv={conv} />

          {/* Participant header */}
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
                <span className={styles.supportLabel}>🛡️ Support Thread</span>
                {conv.unread_admin > 0 && (
                  <span className={styles.unreadBadge}>
                    {conv.unread_admin} unread
                  </span>
                )}
              </div>
              <span className={styles.arrowLine} />
            </div>

            <div className={`${styles.participant} ${styles.participantRight}`}>
              <div className={styles.adminAvatarWrap}>
                <div className={styles.adminAvatarCircle}>S</div>
              </div>
              <div>
                <p className={styles.participantName}>Support Team</p>
                <p className={styles.participantRole}>🛡️ Admin</p>
                <p className={styles.participantEmail}>Deusizi Sparkle</p>
              </div>
            </div>
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

          {/* ── Reply input ── */}
          <div className={styles.replyArea}>
            {/* Media preview strip */}
            {files.length > 0 && (
              <div className={styles.mediaStrip}>
                {files.map((f, i) => (
                  <div key={i} className={styles.mediaStripItem}>
                    {f.file.type.startsWith("video/") ? (
                      <div className={styles.stripVideo}>
                        <span>🎥</span>
                      </div>
                    ) : (
                      <img src={f.preview} alt="" className={styles.stripImg} />
                    )}
                    <button
                      className={styles.stripRemove}
                      onClick={() => removeFile(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploading && (
              <div className={styles.uploadProgress}>
                <span className={styles.spinnerDark} /> {uploadProg}
              </div>
            )}

            {sendError && <p className={styles.sendError}>{sendError}</p>}

            <div className={styles.replyRow}>
              <label className={styles.attachLabel} title="Attach photo/video">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className={styles.hiddenInput}
                  onChange={handleFileChange}
                  disabled={files.length >= 5}
                />
                <span className={styles.attachIcon}>📎</span>
              </label>

              <textarea
                className={styles.replyInput}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Reply as Support Team… (Enter to send)"
                rows={1}
                disabled={isBusy}
              />

              <button
                className={`${styles.sendBtn} ${replyText.trim() || files.length ? styles.sendBtnActive : ""}`}
                onClick={handleSend}
                disabled={isBusy || (!replyText.trim() && !files.length)}
              >
                {isBusy ? <span className={styles.spinner} /> : <span>➤</span>}
              </button>
            </div>

            <p className={styles.replyHint}>
              🛡️ Replying as Support Team · Customer will see your message
              immediately
            </p>
          </div>

          {/* Footer */}
          <div className={styles.threadFooter}>
            <span className={styles.threadFooterNote}>
              Conversation started {formatDate(conv.created_at)}
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
  const isDeleted = conv.deletion_status && conv.deletion_status !== "active";
  const hasUnread = conv.unread_admin > 0;

  return (
    <div
      className={`${styles.convRow} ${isDeleted ? styles.convRowDeleted : ""} ${hasUnread ? styles.convRowUnread : ""}`}
      onClick={onClick}
    >
      <div className={styles.convRowAvatar}>
        <Avatar
          name={conv.customer_name}
          src={conv.customer_avatar}
          size={42}
        />
        {hasUnread && <span className={styles.unreadDot} />}
      </div>

      <div className={styles.convRowBody}>
        <div className={styles.convRowTop}>
          <span className={styles.convNames}>{conv.customer_name}</span>
          <span className={styles.convTime}>
            {timeAgo(conv.last_message_at || conv.updated_at)}
          </span>
        </div>

        {conv.customer_email && (
          <p className={styles.convEmail}>{conv.customer_email}</p>
        )}

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
          {hasUnread && (
            <span className={styles.unreadCount}>
              {conv.unread_admin} unread
            </span>
          )}
          {isDeleted && <DeletionBadge status={conv.deletion_status} />}
        </div>
      </div>

      <span className={styles.convChevron}>›</span>
    </div>
  );
}

// ─── Main AdminSupportChats ──────────────────────────────────────────
export default function AdminSupportChats() {
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
        const res = await fetch(`${SUPPORT_URL}?${params}`, {
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

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const displayed = showDeleted
    ? conversations.filter(
        (c) => c.deletion_status && c.deletion_status !== "active",
      )
    : conversations;

  const deletedCount = conversations.filter(
    (c) => c.deletion_status && c.deletion_status !== "active",
  ).length;

  const totalUnread = conversations.reduce(
    (s, c) => s + (c.unread_admin || 0),
    0,
  );

  if (selectedId) {
    return (
      <div className={styles.page}>
        <ConversationDetail
          conversationId={selectedId}
          onBack={() => {
            setSelectedId(null);
            fetchConversations(true, page, search);
          }}
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
          <h1 className={styles.pageTitle}>
            🛎️ Customer Support
            {totalUnread > 0 && (
              <span className={styles.totalUnreadBadge}>
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </h1>
          <p className={styles.pageSub}>
            Reply to customer support messages as Support Team
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

      {/* Search */}
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="🔍  Search by customer name or email…"
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

      {/* Deleted filter */}
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

      {/* List */}
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
          <div className={styles.emptyIcon}>🛎️</div>
          <p className={styles.emptyTitle}>
            {showDeleted
              ? "No deleted conversations"
              : search
                ? "No matching conversations"
                : "No support conversations yet"}
          </p>
          <p className={styles.emptySub}>
            {showDeleted
              ? "No customers have deleted any chats yet."
              : search
                ? "Try searching by name or email."
                : "Customer support conversations will appear here."}
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
