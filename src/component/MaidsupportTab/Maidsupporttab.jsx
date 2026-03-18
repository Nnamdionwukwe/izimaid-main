import { useState, useEffect, useCallback } from "react";
import styles from "./Maidsupporttab.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const SUPPORT_CATEGORIES = [
  "Payment Issue",
  "Booking Problem",
  "Technical Issue",
  "Safety Concern",
  "Other",
];

const PRIORITY_LEVELS = ["low", "normal", "high", "urgent"];

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Create Support Ticket Modal ──────────────────────────────────
function CreateTicketModal({ onClose, onCreate, token }) {
  const [form, setForm] = useState({
    subject: "",
    message: "",
    category: SUPPORT_CATEGORIES[0],
    priority: "normal",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleFileSelect(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError("❌ File must be less than 100MB");
      return;
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-ms-wmv",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError("❌ Invalid file type. Only images and videos allowed.");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result);
    reader.readAsDataURL(selectedFile);
  }

  async function handleSubmit() {
    if (!form.subject.trim() || !form.message.trim()) {
      setError("❌ Subject and message are required");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create ticket
      const ticketRes = await fetch(`${API_URL}/api/maid-support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: form.subject,
          message: form.message,
          category: form.category,
          priority: form.priority,
        }),
      });

      if (!ticketRes.ok) throw new Error("Failed to create ticket");

      const ticketData = await ticketRes.json();
      const ticketId = ticketData.ticket.id;

      // 2. Upload media if selected
      if (file) {
        const formData = new FormData();
        formData.append("media", file);

        await fetch(`${API_URL}/api/maid-support/${ticketId}/media`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      // Close and refresh
      onCreate();
      onClose();
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />

        <h2 className={styles.modalTitle}>Create Support Ticket</h2>

        {error && (
          <div className={styles.errorBox}>
            <p>{error}</p>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.label}>Subject *</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Brief description of issue"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category *</label>
          <select
            className={styles.select}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            disabled={isSubmitting}
          >
            {SUPPORT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Priority</label>
          <div className={styles.priorityGroup}>
            {PRIORITY_LEVELS.map((p) => (
              <button
                key={p}
                className={`${styles.priorityBtn} ${
                  form.priority === p ? styles.priorityBtnActive : ""
                }`}
                onClick={() => setForm({ ...form, priority: p })}
                disabled={isSubmitting}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Message *</label>
          <textarea
            className={styles.textarea}
            placeholder="Describe your issue in detail..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            disabled={isSubmitting}
            rows={5}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>📎 Attach Photo or Video</label>
          <label className={styles.fileInput}>
            {file ? (
              <div className={styles.fileSelected}>✓ {file.name}</div>
            ) : (
              <>📁 Choose File</>
            )}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              disabled={isSubmitting}
              style={{ display: "none" }}
            />
          </label>
          <p className={styles.fileHint}>
            Images: JPG, PNG, GIF, WebP (max 5MB)
            <br />
            Videos: MP4, MOV, AVI, WMV (max 100MB)
          </p>
        </div>

        {previewUrl && (
          <div className={styles.preview}>
            {file?.type.startsWith("image/") ? (
              <img src={previewUrl} alt="Preview" />
            ) : (
              <video controls style={{ width: "100%" }}>
                <source src={previewUrl} />
              </video>
            )}
          </div>
        )}

        <div className={styles.modalActions}>
          <button
            className={styles.btnCancel}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className={styles.btnSubmit}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Support Ticket Detail Modal ──────────────────────────────────
function TicketDetailModal({ ticket, onClose, onReplyAdded, token }) {
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ SAFETY CHECK: If ticket is null or missing critical fields, don't render
  if (!ticket || !ticket.id) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHandle} />
          <p style={{ textAlign: "center", color: "gray" }}>
            Loading ticket...
          </p>
        </div>
      </div>
    );
  }

  // ✅ Provide safe defaults for all properties
  const ticketId = ticket.id || "";
  const subject = ticket.subject || "Untitled";
  const message = ticket.message || "No message";
  const status = ticket.status || "open";
  const priority = ticket.priority || "normal";
  const category = ticket.category || "Other";
  const created_at = ticket.created_at || new Date().toISOString();
  const admin_notes = ticket.admin_notes || null;
  const attachments = ticket.attachments || [];
  const replies = ticket.replies || [];

  async function handleReply() {
    if (!reply.trim()) {
      setError("❌ Message cannot be empty");
      return;
    }

    setIsReplying(true);

    try {
      const res = await fetch(`${API_URL}/api/maid-support/${ticketId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: reply }),
      });

      if (!res.ok) throw new Error("Failed to add reply");

      setReply("");
      setError("");
      onReplyAdded();
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setIsReplying(false);
    }
  }

  const getPriorityColor = (p) => {
    const colors = {
      low: "rgb(100, 150, 255)",
      normal: "rgb(100, 150, 255)",
      high: "rgb(255, 150, 0)",
      urgent: "rgb(255, 60, 60)",
    };
    return colors[p] || colors.normal;
  };

  const getStatusColor = (s) => {
    const colors = {
      open: "rgb(255, 150, 0)",
      in_progress: "rgb(100, 150, 255)",
      resolved: "rgb(100, 200, 100)",
      closed: "rgb(150, 150, 150)",
    };
    return colors[s] || colors.open;
  };

  // ✅ Safe status display
  const displayStatus =
    status === "in_progress"
      ? "In Progress"
      : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalSheet}
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "95vh" }}
      >
        <div className={styles.modalHandle} />

        <div className={styles.ticketHeader}>
          <div>
            <h2 className={styles.ticketSubject}>{subject}</h2>
            <p className={styles.ticketDate}>{formatDate(created_at)}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <div className={styles.badgeGroup}>
          <span
            className={styles.badge}
            style={{ background: getPriorityColor(priority) }}
          >
            {priority.toUpperCase()}
          </span>
          <span
            className={styles.badge}
            style={{ background: getStatusColor(status) }}
          >
            {displayStatus}
          </span>
          <span
            className={styles.badge}
            style={{ background: "rgb(150, 150, 150)" }}
          >
            {category}
          </span>
        </div>

        <div className={styles.messageBox}>
          <p className={styles.messageText}>{message}</p>
        </div>

        {attachments && attachments.length > 0 && (
          <div className={styles.attachmentsBox}>
            <p className={styles.attachmentTitle}>
              📎 Attachments ({attachments.length})
            </p>
            <div className={styles.attachmentsList}>
              {attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attachmentItem}
                >
                  <span className={styles.attachmentIcon}>
                    {att.media_type === "video" ? "🎬" : "🖼️"}
                  </span>
                  <div>
                    <p className={styles.attachmentName}>{att.file_name}</p>
                    <p className={styles.attachmentSize}>
                      {(att.file_size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {admin_notes && (
          <div className={styles.notesBox}>
            <p className={styles.notesTitle}>📝 Admin Notes</p>
            <p className={styles.notesText}>{admin_notes}</p>
          </div>
        )}

        {replies && replies.length > 0 && (
          <div className={styles.repliesBox}>
            <p className={styles.repliesTitle}>💬 Conversation</p>
            <div className={styles.repliesList}>
              {replies.map((r) => (
                <div key={r.id} className={styles.replyItem}>
                  <p className={styles.replyDate}>{formatDate(r.created_at)}</p>
                  <p className={styles.replyText}>{r.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {status !== "closed" && (
          <div className={styles.replyFormBox}>
            {error && (
              <div className={styles.errorBox}>
                <p>{error}</p>
              </div>
            )}
            <textarea
              className={styles.replyInput}
              placeholder="Add a reply to your support ticket..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              disabled={isReplying}
              rows={4}
            />
            <button
              className={styles.btnReply}
              onClick={handleReply}
              disabled={isReplying}
            >
              {isReplying ? "Sending..." : "Send Reply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Support Tab ──────────────────────────────────────────────
export default function MaidSupportTab({ token }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
  });

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (filter !== "all") params.set("status", filter);

      const res = await fetch(`${API_URL}/api/maid-support?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTickets(data.tickets || []);

      // Calculate stats
      const allRes = await fetch(`${API_URL}/api/maid-support?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allData = await allRes.json();
      const allTickets = allData.tickets || [];

      setStats({
        total: allTickets.length,
        open: allTickets.filter((t) => t.status === "open").length,
        in_progress: allTickets.filter((t) => t.status === "in_progress")
          .length,
        resolved: allTickets.filter(
          (t) => t.status === "resolved" || t.status === "closed",
        ).length,
      });
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
    setLoading(false);
  }, [filter, token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  async function handleSelectTicket(ticketId) {
    try {
      const res = await fetch(`${API_URL}/api/maid-support/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch ticket");
        return;
      }

      const data = await res.json();
      // ✅ Ensure ticket has required properties before setting
      if (data && data.ticket) {
        setSelectedTicket({
          ...data.ticket,
          replies: data.replies || [],
          attachments: data.attachments || [],
        });
      }
    } catch (err) {
      console.error("Error fetching ticket details:", err);
    }
  }

  const FILTERS = ["all", "open", "in_progress", "resolved", "closed"];

  return (
    <div>
      <p className={styles.sectionTitle}>Support Tickets</p>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total</p>
          <p className={styles.statValue}>{stats.total}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Open</p>
          <p className={styles.statValue} style={{ color: "rgb(255, 150, 0)" }}>
            {stats.open}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>In Progress</p>
          <p
            className={styles.statValue}
            style={{ color: "rgb(100, 150, 255)" }}
          >
            {stats.in_progress}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Resolved</p>
          <p
            className={styles.statValue}
            style={{ color: "rgb(100, 200, 100)" }}
          >
            {stats.resolved}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterTab} ${
              filter === f ? styles.filterTabActive : ""
            }`}
            onClick={() => setFilter(f)}
          >
            {f === "in_progress"
              ? "In Progress"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Create Button */}
      <button
        className={styles.createBtn}
        onClick={() => setShowCreateModal(true)}
      >
        ➕ New Support Ticket
      </button>

      {/* Tickets List */}
      {loading ? (
        <div className={styles.loading}>Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className={styles.empty}>
          No {filter !== "all" ? filter : ""} support tickets
        </div>
      ) : (
        <div className={styles.ticketsList}>
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={styles.ticketCard}
              onClick={() => handleSelectTicket(ticket.id)}
            >
              <div className={styles.ticketCardTop}>
                <div>
                  <h3 className={styles.ticketCardTitle}>{ticket.subject}</h3>
                  <p className={styles.ticketCardDate}>
                    {formatDate(ticket.created_at)}
                  </p>
                </div>
                <div className={styles.ticketCardBadges}>
                  <span
                    className={styles.priorityBadge}
                    style={{
                      background:
                        ticket.priority === "urgent"
                          ? "rgb(255, 60, 60)"
                          : ticket.priority === "high"
                            ? "rgb(255, 150, 0)"
                            : "rgb(150, 150, 150)",
                    }}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={styles.statusBadge}
                    style={{
                      background:
                        ticket.status === "open"
                          ? "rgb(255, 150, 0)"
                          : ticket.status === "in_progress"
                            ? "rgb(100, 150, 255)"
                            : ticket.status === "resolved"
                              ? "rgb(100, 200, 100)"
                              : "rgb(150, 150, 150)",
                    }}
                  >
                    {ticket.status === "in_progress"
                      ? "In Progress"
                      : ticket.status}
                  </span>
                </div>
              </div>

              <p className={styles.ticketCardMessage}>
                {ticket.message.substring(0, 100)}
                {ticket.message.length > 100 ? "..." : ""}
              </p>

              <div className={styles.ticketCardMeta}>
                <span>{ticket.category}</span>
                {ticket.attachment_count > 0 && (
                  <span>📎 {ticket.attachment_count} file(s)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onCreate={fetchTickets}
          token={token}
        />
      )}

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onReplyAdded={() => {
            fetchTickets();
            handleSelectTicket(selectedTicket.id);
          }}
          token={token}
        />
      )}
    </div>
  );
}
