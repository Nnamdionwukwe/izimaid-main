import { useState, useEffect, useCallback } from "react";
import styles from "./Admincustomersupport.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const SUPPORT_URL = `${API_URL}/api/customer-support`;

const STATUS_CONFIG = {
  open: { label: "Open", color: "#f59e0b", bg: "#fff8e1" },
  in_progress: { label: "In Progress", color: "#1976d2", bg: "#e3f2fd" },
  resolved: { label: "Resolved", color: "#388e3c", bg: "#e8f5e9" },
  closed: { label: "Closed", color: "#757575", bg: "#f5f5f5" },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "#4caf50" },
  normal: { label: "Normal", color: "#2196f3" },
  high: { label: "High", color: "#ff9800" },
  urgent: { label: "Urgent", color: "#f44336" },
};

const CATEGORIES = {
  booking: { label: "Booking Issue", icon: "📅" },
  payment: { label: "Payment", icon: "💳" },
  maid: { label: "Maid / Service", icon: "🧹" },
  account: { label: "Account", icon: "👤" },
  technical: { label: "Technical", icon: "⚙️" },
  other: { label: "Other", icon: "💬" },
};

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
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

// ─── Stats Bar ──────────────────────────────────────────────────────
function StatsBar({ stats }) {
  const items = [
    { label: "Total", value: stats.total || 0, color: "#13136733" },
    {
      label: "Open",
      value: stats.open_count || 0,
      color: "#fff8e1",
      text: "#f59e0b",
    },
    {
      label: "In Progress",
      value: stats.in_progress_count || 0,
      color: "#e3f2fd",
      text: "#1976d2",
    },
    {
      label: "Resolved",
      value: stats.resolved_count || 0,
      color: "#e8f5e9",
      text: "#388e3c",
    },
    {
      label: "Closed",
      value: stats.closed_count || 0,
      color: "#f5f5f5",
      text: "#757575",
    },
  ];
  return (
    <div className={styles.statsBar}>
      {items.map((s) => (
        <div
          key={s.label}
          className={styles.statCard}
          style={{ background: s.color }}
        >
          <span
            className={styles.statValue}
            style={{ color: s.text || "rgb(19,19,103)" }}
          >
            {s.value}
          </span>
          <span className={styles.statLabel}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Ticket Detail / Reply Panel ────────────────────────────────────
function TicketPanel({ ticket, onClose, onUpdated }) {
  const [replies, setReplies] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const [notes, setNotes] = useState(ticket.admin_notes || "");
  const [saving, setSaving] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${SUPPORT_URL}/${ticket.id}`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        setReplies(data.replies || []);
        setAttachments(data.attachments || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ticket.id]);

  async function sendReply() {
    if (!replyMsg.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${SUPPORT_URL}/${ticket.id}/reply`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMsg }),
      });
      const data = await res.json();
      if (res.ok) {
        setReplies((p) => [...p, data.reply]);
        setReplyMsg("");
      }
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  }

  async function saveStatus() {
    setSaving(true);
    try {
      const res = await fetch(`${SUPPORT_URL}/${ticket.id}`, {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const data = await res.json();
      if (res.ok) onUpdated(data.ticket);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  }

  const cat = CATEGORIES[ticket.category] || {
    icon: "💬",
    label: ticket.category,
  };
  const pri = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.normal;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelMeta}>
          <span className={styles.panelCat}>
            {cat.icon} {cat.label}
          </span>
          <span
            className={styles.panelPri}
            style={{ color: pri.color, borderColor: pri.color + "44" }}
          >
            {pri.label}
          </span>
        </div>
        <button className={styles.panelClose} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.panelBody}>
        <h3 className={styles.panelTitle}>{ticket.subject}</h3>
        <p className={styles.panelSub}>
          Ticket #{ticket.id.slice(0, 8)} · Opened{" "}
          {formatDate(ticket.created_at)}
        </p>

        {/* Status control */}
        <div className={styles.controlBox}>
          <div className={styles.controlRow}>
            <label className={styles.controlLabel}>Status</label>
            <select
              className={styles.statusSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.controlRow}>
            <label className={styles.controlLabel}>Admin Notes</label>
            <textarea
              className={styles.notesInput}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes (not shown to user)…"
              rows={2}
            />
          </div>
          <button
            className={styles.saveBtn}
            onClick={saveStatus}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className={styles.attSection}>
            <p className={styles.attTitle}>
              📎 Attachments ({attachments.length})
            </p>
            <div className={styles.attGrid}>
              {attachments.map((a) => (
                <button
                  key={a.id}
                  className={styles.attThumb}
                  onClick={() => setLightbox(a)}
                >
                  {a.media_type === "video" ? (
                    <div className={styles.attVideo}>
                      <span>▶</span>
                    </div>
                  ) : (
                    <img
                      src={a.media_url}
                      alt={a.file_name}
                      className={styles.attImg}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Thread */}
        <div className={styles.thread}>
          <div className={`${styles.bubble} ${styles.bubbleUser}`}>
            <p className={styles.bubbleText}>{ticket.message}</p>
            <span className={styles.bubbleTime}>
              {formatDate(ticket.created_at)}
            </span>
          </div>

          {loading && <p className={styles.loadingMsg}>Loading thread…</p>}

          {replies.map((r) => {
            const isAdmin = r.is_admin || r.role === "admin";
            return (
              <div
                key={r.id}
                className={`${styles.bubble} ${isAdmin ? styles.bubbleAdmin : styles.bubbleUser}`}
              >
                {isAdmin && (
                  <span className={styles.adminLabel}>You (Support)</span>
                )}
                <p className={styles.bubbleText}>{r.message}</p>
                <span className={styles.bubbleTime}>
                  {formatDate(r.created_at)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Reply box */}
        {status !== "closed" && (
          <div className={styles.replyBox}>
            <textarea
              className={styles.replyInput}
              value={replyMsg}
              onChange={(e) => setReplyMsg(e.target.value)}
              placeholder="Reply to customer…"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply();
              }}
            />
            <div className={styles.replyFooter}>
              <span className={styles.replyHint}>⌘↵ to send</span>
              <button
                className={styles.replyBtn}
                onClick={sendReply}
                disabled={sending || !replyMsg.trim()}
              >
                {sending ? <span className={styles.spinner} /> : "Send Reply"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setLightbox(null)}
        >
          <div
            className={styles.lightboxBox}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.lightboxClose}
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            {lightbox.media_type === "video" ? (
              <video
                src={lightbox.media_url}
                controls
                autoPlay
                className={styles.lightboxMedia}
              />
            ) : (
              <img
                src={lightbox.media_url}
                alt=""
                className={styles.lightboxMedia}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Support Component ──────────────────────────────────
export default function AdminCustomerSupport({ onBack }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, sort });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);

      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`${SUPPORT_URL}?${params}`, { headers: authHeaders() }),
        fetch(`${SUPPORT_URL}/stats`, { headers: authHeaders() }),
      ]);
      const ticketsData = await ticketsRes.json();
      const statsData = await statsRes.json();

      setTickets(ticketsData.tickets || []);
      setTotalPages(ticketsData.pages || 1);
      setStats(statsData);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [page, sort, statusFilter, categoryFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  function handleUpdated(updated) {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
    );
    setSelected((prev) =>
      prev?.id === updated.id ? { ...prev, ...updated } : prev,
    );
  }

  const filtered = tickets.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.subject?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q)
    );
  });

  const statusFilters = ["all", "open", "in_progress", "resolved", "closed"];

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
          <div>
            <h1 className={styles.title}>Customer Support</h1>
            <p className={styles.subtitle}>
              Manage tickets and respond to customers
            </p>
          </div>
        </div>
        <button className={styles.refreshBtn} onClick={loadTickets}>
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by subject or ticket ID…"
        />
        <select
          className={styles.selectFilter}
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>
              {v.icon} {v.label}
            </option>
          ))}
        </select>
        <select
          className={styles.selectFilter}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Status filter pills */}
      <div className={styles.pillRow}>
        {statusFilters.map((f) => (
          <button
            key={f}
            className={`${styles.pill} ${statusFilter === f ? styles.pillActive : ""}`}
            onClick={() => {
              setStatusFilter(f);
              setPage(1);
            }}
          >
            {f === "in_progress"
              ? "In Progress"
              : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" &&
            stats[`${f === "in_progress" ? "in_progress" : f}_count`]
              ? ` (${stats[`${f === "in_progress" ? "in_progress" : f}_count`]})`
              : ""}
          </button>
        ))}
      </div>

      {/* Main layout: list + panel */}
      <div className={`${styles.layout} ${selected ? styles.layoutSplit : ""}`}>
        {/* Ticket list */}
        <div className={styles.list}>
          {loading ? (
            <div className={styles.center}>Loading tickets…</div>
          ) : filtered.length === 0 ? (
            <div className={styles.center}>
              <div className={styles.emptyIcon}>🎫</div>
              <p>No tickets found</p>
            </div>
          ) : (
            filtered.map((t) => {
              const st = STATUS_CONFIG[t.status] || STATUS_CONFIG.open;
              const pri = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.normal;
              const cat = CATEGORIES[t.category] || { icon: "💬" };
              const isSelected = selected?.id === t.id;

              return (
                <div
                  key={t.id}
                  className={`${styles.ticketRow} ${isSelected ? styles.ticketRowActive : ""}`}
                  onClick={() => setSelected(t)}
                >
                  <div className={styles.rowTop}>
                    <div className={styles.rowLeft}>
                      <span className={styles.rowCat}>{cat.icon}</span>
                      <div>
                        <p className={styles.rowSubject}>{t.subject}</p>
                        <p className={styles.rowId}>#{t.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className={styles.rowRight}>
                      <span
                        className={styles.rowStatus}
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                      <span
                        className={styles.rowPri}
                        style={{ color: pri.color }}
                      >
                        ● {pri.label}
                      </span>
                    </div>
                  </div>
                  <p className={styles.rowSnippet}>
                    {t.message?.slice(0, 90)}…
                  </p>
                  <div className={styles.rowMeta}>
                    <span>{timeAgo(t.created_at)}</span>
                    {t.attachment_count > 0 && (
                      <span>📎 {t.attachment_count}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
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
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <TicketPanel
            ticket={selected}
            onClose={() => setSelected(null)}
            onUpdated={handleUpdated}
          />
        )}
      </div>
    </div>
  );
}
