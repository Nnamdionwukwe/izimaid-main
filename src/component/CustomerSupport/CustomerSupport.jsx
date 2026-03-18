import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./CustomerSupport.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const SUPPORT_URL = `${API_URL}/api/customer-support`;
const POLL_INTERVAL = 30000; // 30s background refresh

const CATEGORIES = [
  { value: "booking", label: "Booking Issue", icon: "📅" },
  { value: "payment", label: "Payment", icon: "💳" },
  { value: "maid", label: "Maid / Service", icon: "🧹" },
  { value: "account", label: "Account", icon: "👤" },
  { value: "technical", label: "Technical", icon: "⚙️" },
  { value: "other", label: "Other", icon: "💬" },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "#4caf50" },
  { value: "normal", label: "Normal", color: "#2196f3" },
  { value: "high", label: "High", color: "#ff9800" },
  { value: "urgent", label: "Urgent", color: "#f44336" },
];

const STATUS_STYLES = {
  open: { bg: "#fff8e1", color: "#f59e0b", label: "Open" },
  in_progress: { bg: "#e3f2fd", color: "#1976d2", label: "In Progress" },
  resolved: { bg: "#e8f5e9", color: "#388e3c", label: "Resolved" },
  closed: { bg: "#f5f5f5", color: "#757575", label: "Closed" },
};

const MAX_FILES = 5;
const ACCEPTED = "image/*,video/*";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(d) {
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getToken() {
  return localStorage.getItem("token");
}
function authH() {
  return { Authorization: `Bearer ${getToken()}` };
}

// ─── Unread store (persisted in sessionStorage per ticket) ──────────
function getSeenCount(ticketId) {
  return parseInt(sessionStorage.getItem(`seen_${ticketId}`) || "0", 10);
}
function setSeenCount(ticketId, n) {
  sessionStorage.setItem(`seen_${ticketId}`, String(n));
}

// ─── Media Preview Grid ─────────────────────────────────────────────
function MediaPreviewGrid({ files, onRemove }) {
  if (!files.length) return null;
  return (
    <div className={styles.previewGrid}>
      {files.map((f, i) => {
        const isVideo = f.file.type.startsWith("video/");
        return (
          <div key={i} className={styles.previewItem}>
            {isVideo ? (
              <video src={f.preview} className={styles.previewMedia} muted />
            ) : (
              <img
                src={f.preview}
                alt={f.file.name}
                className={styles.previewMedia}
              />
            )}
            <button
              type="button"
              className={styles.previewRemove}
              onClick={() => onRemove(i)}
            >
              ×
            </button>
            <span className={styles.previewType}>{isVideo ? "🎥" : "🖼️"}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Attachment Gallery ─────────────────────────────────────────────
function AttachmentGallery({ attachments, ticketId, canDelete, onDeleted }) {
  const [deleting, setDeleting] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  async function handleDelete(att) {
    if (!window.confirm("Remove this attachment?")) return;
    setDeleting(att.id);
    try {
      await fetch(`${SUPPORT_URL}/${ticketId}/media/${att.id}`, {
        method: "DELETE",
        headers: authH(),
      });
      onDeleted(att.id);
    } catch {
    } finally {
      setDeleting(null);
    }
  }

  if (!attachments.length) return null;
  return (
    <>
      <div className={styles.attSection}>
        <p className={styles.attTitle}>📎 Attachments ({attachments.length})</p>
        <div className={styles.attGrid}>
          {attachments.map((a) => {
            const isVideo = a.media_type === "video";
            return (
              <div key={a.id} className={styles.attItem}>
                <button
                  type="button"
                  className={styles.attThumb}
                  onClick={() => setLightbox(a)}
                >
                  {isVideo ? (
                    <div className={styles.attVideoThumb}>
                      <span className={styles.attPlayIcon}>▶</span>
                    </div>
                  ) : (
                    <img
                      src={a.media_url}
                      alt={a.file_name}
                      className={styles.attImg}
                    />
                  )}
                </button>
                <p className={styles.attName}>{a.file_name?.slice(0, 18)}</p>
                {canDelete && (
                  <button
                    className={styles.attDelete}
                    onClick={() => handleDelete(a)}
                    disabled={deleting === a.id}
                  >
                    {deleting === a.id ? "…" : "✕"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {lightbox && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightbox(null)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.lightboxClose}
              onClick={() => setLightbox(null)}
            >
              ×
            </button>
            {lightbox.media_type === "video" ? (
              <video
                src={lightbox.media_url}
                controls
                className={styles.lightboxMedia}
                autoPlay
              />
            ) : (
              <img
                src={lightbox.media_url}
                alt={lightbox.file_name}
                className={styles.lightboxMedia}
              />
            )}
            <p className={styles.lightboxName}>{lightbox.file_name}</p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── New Ticket Form ────────────────────────────────────────────────
function NewTicketForm({ prefillBooking, onSuccess, onCancel }) {
  const [subject, setSubject] = useState(
    prefillBooking
      ? `Issue with booking #${prefillBooking.id?.slice(0, 8)}`
      : "",
  );
  const [message, setMessage] = useState(
    prefillBooking
      ? `Hi, I have an issue with my booking on ${prefillBooking.service_date ? new Date(prefillBooking.service_date).toLocaleDateString("en-NG") : ""} with ${prefillBooking.maid_name || ""}.\n\n`
      : "",
  );
  const [category, setCategory] = useState(prefillBooking ? "booking" : "");
  const [priority, setPriority] = useState("normal");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState("");

  function handleFileChange(e) {
    const picked = Array.from(e.target.files || []);
    const toAdd = picked
      .slice(0, MAX_FILES - mediaFiles.length)
      .map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setMediaFiles((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removeFile(i) {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  async function uploadFiles(ticketId) {
    for (let i = 0; i < mediaFiles.length; i++) {
      setUploadProgress(`Uploading file ${i + 1} of ${mediaFiles.length}…`);
      const form = new FormData();
      form.append("media", mediaFiles[i].file);
      await fetch(`${SUPPORT_URL}/${ticketId}/media`, {
        method: "POST",
        headers: authH(),
        body: form,
      });
    }
    setUploadProgress("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !category) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(SUPPORT_URL, {
        method: "POST",
        headers: { ...authH(), "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, category, priority }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      if (mediaFiles.length) await uploadFiles(data.ticket.id);
      // seed seen count so new ticket shows 0 unread
      setSeenCount(data.ticket.id, 0);
      onSuccess(data.ticket);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.formWrap}>
      <div className={styles.formHeader}>
        <button className={styles.backBtn} onClick={onCancel}>
          ← Back
        </button>
        <div>
          <h2 className={styles.formTitle}>New Support Ticket</h2>
          <p className={styles.formSub}>We typically reply within 24 hours</p>
        </div>
      </div>

      {prefillBooking && (
        <div className={styles.bookingTag}>
          <span className={styles.bookingTagIcon}>📅</span>
          <span>
            Linked to booking with <strong>{prefillBooking.maid_name}</strong>
            {prefillBooking.service_date &&
              ` on ${new Date(prefillBooking.service_date).toLocaleDateString("en-NG")}`}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>
            Category <span className={styles.req}>*</span>
          </label>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.value}
                className={`${styles.catBtn} ${category === c.value ? styles.catBtnActive : ""}`}
                onClick={() => setCategory(c.value)}
              >
                <span className={styles.catIcon}>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Priority</label>
          <div className={styles.priorityRow}>
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p.value}
                className={`${styles.priBtn} ${priority === p.value ? styles.priBtnActive : ""}`}
                style={
                  priority === p.value
                    ? { borderColor: p.color, color: p.color }
                    : {}
                }
                onClick={() => setPriority(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Subject <span className={styles.req}>*</span>
          </label>
          <input
            className={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            maxLength={120}
          />
          <span className={styles.charCount}>{subject.length}/120</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Message <span className={styles.req}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue in detail..."
            rows={5}
            maxLength={2000}
          />
          <span className={styles.charCount}>{message.length}/2000</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Attachments{" "}
            <span className={styles.labelHint}>
              (photos/videos, up to {MAX_FILES})
            </span>
          </label>
          <MediaPreviewGrid files={mediaFiles} onRemove={removeFile} />
          {mediaFiles.length < MAX_FILES && (
            <label className={styles.uploadZone}>
              <input
                type="file"
                accept={ACCEPTED}
                multiple
                className={styles.hiddenInput}
                onChange={handleFileChange}
              />
              <span className={styles.uploadIcon}>📎</span>
              <span className={styles.uploadText}>
                Tap to attach photos or videos
              </span>
              <span className={styles.uploadHint}>
                {mediaFiles.length}/{MAX_FILES} attached
              </span>
            </label>
          )}
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? (
            <span className={styles.spinnerRow}>
              <span className={styles.spinner} />
              {uploadProgress || "Submitting…"}
            </span>
          ) : (
            `Submit Ticket${mediaFiles.length ? ` (+${mediaFiles.length} file${mediaFiles.length > 1 ? "s" : ""})` : ""}`
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Ticket Detail View ─────────────────────────────────────────────
function TicketDetail({ ticket, onBack, onRepliesLoaded }) {
  const [replies, setReplies] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);
  const threadRef = useRef(null);

  const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
  const isOwner = ticket.user_id === userId;
  const isOpen = ticket.status !== "closed" && ticket.status !== "resolved";

  const fetchDetail = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`${SUPPORT_URL}/${ticket.id}`, {
          headers: authH(),
        });
        const data = await res.json();
        setReplies(data.replies || []);
        setAttachments(data.attachments || []);
        setLastRefresh(new Date());
        // mark all current replies as seen
        setSeenCount(ticket.id, (data.replies || []).length);
        if (onRepliesLoaded)
          onRepliesLoaded(ticket.id, (data.replies || []).length);
      } catch {
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [ticket.id, onRepliesLoaded],
  );

  // Initial load
  useEffect(() => {
    fetchDetail(false);
  }, [ticket.id]);

  // Auto-scroll thread to bottom when new replies arrive
  useEffect(() => {
    if (threadRef.current)
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [replies.length]);

  // Background poll every 30s
  useEffect(() => {
    const id = setInterval(() => fetchDetail(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchDetail]);

  async function sendReply() {
    if (!replyMsg.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${SUPPORT_URL}/${ticket.id}/reply`, {
        method: "POST",
        headers: { ...authH(), "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMsg }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = [...replies, data.reply];
        setReplies(updated);
        setSeenCount(ticket.id, updated.length);
        if (onRepliesLoaded) onRepliesLoaded(ticket.id, updated.length);
        setReplyMsg("");
      }
    } catch {
    } finally {
      setSending(false);
    }
  }

  async function handleMediaUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const toUpload = files.slice(0, MAX_FILES - attachments.length);
    setUploadingMedia(true);
    setUploadError("");
    try {
      for (const file of toUpload) {
        const form = new FormData();
        form.append("media", file);
        const res = await fetch(`${SUPPORT_URL}/${ticket.id}/media`, {
          method: "POST",
          headers: authH(),
          body: form,
        });
        const data = await res.json();
        if (res.ok) setAttachments((prev) => [...prev, data.attachment]);
        else setUploadError(data.error || "Upload failed");
      }
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploadingMedia(false);
      e.target.value = "";
    }
  }

  const st = STATUS_STYLES[ticket.status] || STATUS_STYLES.open;
  const cat = CATEGORIES.find((c) => c.value === ticket.category);

  return (
    <div className={styles.detailWrap}>
      <div className={styles.detailNav}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Back to Tickets
        </button>
        <div className={styles.refreshRow}>
          {lastRefresh && (
            <span className={styles.lastRefresh}>
              Updated {timeAgo(lastRefresh)}
            </span>
          )}
          <button
            className={styles.refreshBtn}
            onClick={() => fetchDetail(false)}
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.detailTop}>
          <div className={styles.detailMeta}>
            <span className={styles.catPill}>
              {cat?.icon} {cat?.label || ticket.category}
            </span>
            <span
              className={styles.statusPill}
              style={{ background: st.bg, color: st.color }}
            >
              {st.label}
            </span>
          </div>
          <h2 className={styles.detailTitle}>{ticket.subject}</h2>
          <p className={styles.detailDate}>
            Opened {formatDate(ticket.created_at)}
          </p>
        </div>

        <AttachmentGallery
          attachments={attachments}
          ticketId={ticket.id}
          canDelete={isOwner && isOpen}
          onDeleted={(id) =>
            setAttachments((prev) => prev.filter((a) => a.id !== id))
          }
        />

        <div className={styles.thread} ref={threadRef}>
          <div className={`${styles.bubble} ${styles.bubbleUser}`}>
            <p className={styles.bubbleText}>{ticket.message}</p>
            <span className={styles.bubbleTime}>
              {formatDate(ticket.created_at)}
            </span>
          </div>

          {loading && <p className={styles.loadingReplies}>Loading replies…</p>}

          {replies.map((r) => {
            const isAdmin = r.is_admin || r.role === "admin";
            return (
              <div
                key={r.id}
                className={`${styles.bubble} ${isAdmin ? styles.bubbleAdmin : styles.bubbleUser}`}
              >
                {isAdmin && (
                  <span className={styles.adminLabel}>Support Team</span>
                )}
                <p className={styles.bubbleText}>{r.message}</p>
                <span className={styles.bubbleTime}>
                  {formatDate(r.created_at)}
                </span>
              </div>
            );
          })}
        </div>

        {isOpen && (
          <div className={styles.replyBox}>
            <div className={styles.replyInputWrap}>
              <textarea
                className={styles.replyInput}
                value={replyMsg}
                onChange={(e) => setReplyMsg(e.target.value)}
                placeholder="Add a reply…"
                rows={3}
              />
              {uploadError && (
                <p className={styles.uploadErrInline}>{uploadError}</p>
              )}
              <div className={styles.replyToolbar}>
                {attachments.length < MAX_FILES && (
                  <label
                    className={styles.attachBtn}
                    title="Attach photo/video"
                  >
                    <input
                      type="file"
                      accept={ACCEPTED}
                      multiple
                      className={styles.hiddenInput}
                      onChange={handleMediaUpload}
                      disabled={uploadingMedia}
                    />
                    {uploadingMedia ? (
                      <span className={styles.spinnerDark} />
                    ) : (
                      <>
                        📎 <span className={styles.attachLabel}>Attach</span>
                      </>
                    )}
                  </label>
                )}
                <span className={styles.attCount}>
                  {attachments.length}/{MAX_FILES} files
                </span>
              </div>
            </div>
            <button
              className={styles.replyBtn}
              onClick={sendReply}
              disabled={sending || !replyMsg.trim()}
            >
              {sending ? <span className={styles.spinner} /> : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Ticket Card with unread badge + live refresh ───────────────────
function TicketCard({ ticket: initialTicket, unread, onClick }) {
  const [ticket, setTicket] = useState(initialTicket);

  // Sync if parent updates the ticket (e.g. after list refresh)
  useEffect(() => {
    setTicket(initialTicket);
  }, [initialTicket]);

  const st = STATUS_STYLES[ticket.status] || STATUS_STYLES.open;
  const cat = CATEGORIES.find((c) => c.value === ticket.category);

  return (
    <div
      className={`${styles.ticketCard} ${unread > 0 ? styles.ticketCardUnread : ""}`}
      onClick={onClick}
    >
      <div className={styles.tcTop}>
        <span className={styles.tcCat}>
          {cat?.icon} {cat?.label || ticket.category}
        </span>
        <div className={styles.tcRight}>
          {unread > 0 && (
            <span
              className={styles.unreadBadge}
              title={`${unread} new message${unread > 1 ? "s" : ""}`}
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
          <span
            className={styles.tcStatus}
            style={{ background: st.bg, color: st.color }}
          >
            {st.label}
          </span>
        </div>
      </div>
      <p className={styles.tcSubject}>{ticket.subject}</p>
      <p className={styles.tcSnippet}>{ticket.message?.slice(0, 80)}…</p>
      <div className={styles.tcFooter}>
        <span className={styles.tcDate}>
          {timeAgo(ticket.updated_at || ticket.created_at)}
        </span>
        {unread > 0 && (
          <span className={styles.newMsgPill}>
            🔔 {unread} new message{unread > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Tickets List ───────────────────────────────────────────────────
function TicketsList({ onNew, onOpen }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [unreadMap, setUnreadMap] = useState({}); // { [ticketId]: unreadCount }
  const [lastSync, setLastSync] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const fetchTickets = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setSyncing(true);
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${SUPPORT_URL}?${params}`, {
          headers: authH(),
        });
        const data = await res.json();
        const list = data.tickets || [];
        setTickets(list);
        setLastSync(new Date());
        // Calculate unread: compare reply_count (or use stored seen count)
        setUnreadMap((prev) => {
          const next = { ...prev };
          list.forEach((t) => {
            const replyCount = t.reply_count ?? 0;
            const seen = getSeenCount(t.id);
            next[t.id] = Math.max(0, replyCount - seen);
          });
          return next;
        });
      } catch {
      } finally {
        if (!silent) setLoading(false);
        else setSyncing(false);
      }
    },
    [filter],
  );

  useEffect(() => {
    fetchTickets(false);
  }, [filter]);

  // Background poll
  useEffect(() => {
    const id = setInterval(() => fetchTickets(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchTickets]);

  // Called from TicketDetail when replies are seen — clears unread for that ticket
  function handleRepliesLoaded(ticketId, totalReplies) {
    setSeenCount(ticketId, totalReplies);
    setUnreadMap((prev) => ({ ...prev, [ticketId]: 0 }));
  }

  const totalUnread = Object.values(unreadMap).reduce((s, n) => s + n, 0);
  const filters = ["all", "open", "in_progress", "resolved", "closed"];

  return (
    <div className={styles.listWrap}>
      <div className={styles.listHeader}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Support</h1>
            {totalUnread > 0 && (
              <span className={styles.totalUnreadBadge}>
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
          <p className={styles.pageSub}>
            Get help with your bookings and account
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.syncBtn} ${syncing ? styles.syncBtnSyncing : ""}`}
            onClick={() => fetchTickets(false)}
            title="Refresh tickets"
          >
            ↻
          </button>
          <button className={styles.newBtn} onClick={onNew}>
            + New Ticket
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

      <div className={styles.filterRow}>
        {filters.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "in_progress"
              ? "In Progress"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.skeletonList}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={styles.skeletonCard}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎫</div>
          <p className={styles.emptyTitle}>No tickets yet</p>
          <p className={styles.emptySub}>Have an issue? We're here to help.</p>
          <button className={styles.newBtn} onClick={onNew}>
            Open a Ticket
          </button>
        </div>
      ) : (
        <div className={styles.ticketList}>
          {tickets.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              unread={unreadMap[t.id] || 0}
              onClick={() => onOpen(t, handleRepliesLoaded)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────
export default function CustomerSupport() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillBooking = location.state?.booking || null;

  const [view, setView] = useState(prefillBooking ? "new" : "list");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [successTicket, setSuccessTicket] = useState(null);
  const [onRepliesLoaded, setOnRepliesLoaded] = useState(null);

  function handleSuccess(ticket) {
    setSuccessTicket(ticket);
    setView("success");
  }

  if (view === "new") {
    return (
      <div className={styles.page}>
        <NewTicketForm
          prefillBooking={prefillBooking}
          onSuccess={handleSuccess}
          onCancel={() => setView("list")}
        />
      </div>
    );
  }

  if (view === "success") {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>Ticket Submitted!</h2>
          <p className={styles.successSub}>
            Your ticket <strong>#{successTicket?.id?.slice(0, 8)}</strong> has
            been created. We'll get back to you within 24 hours.
          </p>
          <div className={styles.successActions}>
            <button className={styles.newBtn} onClick={() => setView("list")}>
              View My Tickets
            </button>
            <button
              className={styles.ghostBtn}
              onClick={() => navigate("/my-bookings")}
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "detail" && selectedTicket) {
    return (
      <div className={styles.page}>
        <TicketDetail
          ticket={selectedTicket}
          onBack={() => setView("list")}
          onRepliesLoaded={onRepliesLoaded}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <TicketsList
        onNew={() => setView("new")}
        onOpen={(t, repliesLoadedCb) => {
          setSelectedTicket(t);
          setOnRepliesLoaded(() => repliesLoadedCb);
          setView("detail");
        }}
      />
    </div>
  );
}
