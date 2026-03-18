import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Admincustomersupport.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const SUPPORT_URL = `${API_URL}/api/customer-support`;

const STATUS_CONFIG = {
  open: { label: "Open", color: "#f59e0b", bg: "#fff8e1" },
  in_progress: { label: "In Progress", color: "#1976d2", bg: "#e3f2fd" },
  resolved: { label: "Resolved", color: "#388e3c", bg: "#e8f5e9" },
  closed: { label: "Closed", color: "#9e9e9e", bg: "#f5f5f5" },
};

const PRIORITY_CONFIG = {
  low: { label: "Low", dot: "#4caf50" },
  normal: { label: "Normal", dot: "#2196f3" },
  high: { label: "High", dot: "#ff9800" },
  urgent: { label: "Urgent", dot: "#f44336" },
};

const CATEGORIES = {
  booking: { label: "Booking Issue", icon: "📅" },
  payment: { label: "Payment", icon: "💳" },
  maid: { label: "Maid / Service", icon: "🧹" },
  account: { label: "Account", icon: "👤" },
  technical: { label: "Technical", icon: "⚙️" },
  other: { label: "Other", icon: "💬" },
};

function fmtDate(d) {
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

function auth() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

// ─── Stat Card ──────────────────────────────────────────────────────
function StatCard({ label, value, bg, color }) {
  return (
    <div className={styles.statCard} style={{ background: bg }}>
      <span className={styles.statNum} style={{ color }}>
        {value}
      </span>
      <span className={styles.statLbl}>{label}</span>
    </div>
  );
}

// ─── Ticket Row ─────────────────────────────────────────────────────
function TicketRow({ ticket, isActive, onClick }) {
  const st = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
  const pri = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.normal;
  const cat = CATEGORIES[ticket.category] || {
    icon: "💬",
    label: ticket.category,
  };

  return (
    <button
      className={`${styles.row} ${isActive ? styles.rowActive : ""}`}
      onClick={onClick}
    >
      <div className={styles.rowHeader}>
        <span className={styles.rowIcon}>{cat.icon}</span>
        <div className={styles.rowInfo}>
          <p className={styles.rowSubject}>{ticket.subject}</p>
          <p className={styles.rowMeta}>
            <span className={styles.rowId}>#{ticket.id.slice(0, 8)}</span>
            <span className={styles.rowDot}>·</span>
            <span>{timeAgo(ticket.created_at)}</span>
            {ticket.attachment_count > 0 && (
              <>
                <span className={styles.rowDot}>·</span>
                <span>📎{ticket.attachment_count}</span>
              </>
            )}
          </p>
        </div>
        <div className={styles.rowBadges}>
          <span
            className={styles.rowStatus}
            style={{ background: st.bg, color: st.color }}
          >
            {st.label}
          </span>
          <span className={styles.rowPri} style={{ color: pri.dot }}>
            ● {pri.label}
          </span>
        </div>
      </div>
      <p className={styles.rowSnippet}>{ticket.message?.slice(0, 100)}…</p>
    </button>
  );
}

// ─── Ticket Panel (detail + reply) ──────────────────────────────────
function TicketPanel({ ticket, onClose, onUpdated, isMobile }) {
  const [replies, setReplies] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const [notes, setNotes] = useState(ticket.admin_notes || "");
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [tab, setTab] = useState("thread"); // "thread" | "manage"
  const threadRef = useRef(null);

  useEffect(() => {
    setStatus(ticket.status);
    setNotes(ticket.admin_notes || "");
    setReplies([]);
    setAttachments([]);
    setLoading(true);
    fetch(`${SUPPORT_URL}/${ticket.id}`, { headers: auth() })
      .then((r) => r.json())
      .then((d) => {
        setReplies(d.replies || []);
        setAttachments(d.attachments || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ticket.id]);

  // Scroll thread to bottom when replies load
  useEffect(() => {
    if (!loading && threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [loading, replies.length]);

  async function sendReply() {
    if (!replyMsg.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${SUPPORT_URL}/${ticket.id}/reply`, {
        method: "POST",
        headers: { ...auth(), "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMsg }),
      });
      const d = await res.json();
      if (res.ok) {
        setReplies((p) => [...p, d.reply]);
        setReplyMsg("");
      }
    } catch {
    } finally {
      setSending(false);
    }
  }

  async function saveChanges() {
    setSaving(true);
    try {
      const res = await fetch(`${SUPPORT_URL}/${ticket.id}`, {
        method: "PATCH",
        headers: { ...auth(), "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const d = await res.json();
      if (res.ok) {
        onUpdated(d.ticket);
        setSaveOk(true);
        setTimeout(() => setSaveOk(false), 2000);
      }
    } catch {
    } finally {
      setSaving(false);
    }
  }

  const cat = CATEGORIES[ticket.category] || {
    icon: "💬",
    label: ticket.category,
  };
  const pri = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.normal;
  const st = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
  const isOpen = ticket.status !== "closed";

  return (
    <div className={`${styles.panel} ${isMobile ? styles.panelMobile : ""}`}>
      {/* Panel top bar */}
      <div className={styles.panelTop}>
        <button className={styles.panelBack} onClick={onClose}>
          {isMobile ? "← Back" : "✕"}
        </button>
        <div className={styles.panelTopInfo}>
          <span>
            {cat.icon} {cat.label}
          </span>
          <span style={{ color: pri.dot }}>● {pri.label}</span>
        </div>
        <span
          className={styles.panelTopStatus}
          style={{ background: st.bg, color: st.color }}
        >
          {st.label}
        </span>
      </div>

      {/* Subject + ID */}
      <div className={styles.panelTitleBar}>
        <h2 className={styles.panelSubject}>{ticket.subject}</h2>
        <p className={styles.panelId}>
          #{ticket.id.slice(0, 8)} · {fmtDate(ticket.created_at)}
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "thread" ? styles.tabActive : ""}`}
          onClick={() => setTab("thread")}
        >
          💬 Thread
        </button>
        <button
          className={`${styles.tab} ${tab === "manage" ? styles.tabActive : ""}`}
          onClick={() => setTab("manage")}
        >
          ⚙️ Manage
        </button>
        {attachments.length > 0 && (
          <button
            className={`${styles.tab} ${tab === "files" ? styles.tabActive : ""}`}
            onClick={() => setTab("files")}
          >
            📎 Files ({attachments.length})
          </button>
        )}
      </div>

      {/* Thread tab */}
      {tab === "thread" && (
        <>
          <div className={styles.thread} ref={threadRef}>
            {/* Original message */}
            <div
              className={styles.bubbleWrap}
              style={{ alignItems: "flex-end" }}
            >
              <div className={`${styles.bubble} ${styles.bubbleCustomer}`}>
                <p className={styles.bubbleText}>{ticket.message}</p>
                <span className={styles.bubbleTime}>
                  {fmtDate(ticket.created_at)}
                </span>
              </div>
            </div>

            {loading && (
              <div className={styles.threadLoading}>
                <span className={styles.spinnerDark} /> Loading…
              </div>
            )}

            {replies.map((r) => {
              const isAdm = r.is_admin || r.role === "admin";
              return (
                <div
                  key={r.id}
                  className={styles.bubbleWrap}
                  style={{ alignItems: isAdm ? "flex-start" : "flex-end" }}
                >
                  {isAdm && <span className={styles.adminTag}>You</span>}
                  <div
                    className={`${styles.bubble} ${isAdm ? styles.bubbleAdmin : styles.bubbleCustomer}`}
                  >
                    <p className={styles.bubbleText}>{r.message}</p>
                    <span className={styles.bubbleTime}>
                      {fmtDate(r.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply input */}
          {isOpen ? (
            <div className={styles.replyArea}>
              <textarea
                className={styles.replyInput}
                value={replyMsg}
                onChange={(e) => setReplyMsg(e.target.value)}
                placeholder="Type your reply…"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                    sendReply();
                }}
              />
              <div className={styles.replyActions}>
                <span className={styles.replyHint}>⌘↵ to send</span>
                <button
                  className={styles.sendBtn}
                  onClick={sendReply}
                  disabled={sending || !replyMsg.trim()}
                >
                  {sending ? (
                    <span className={styles.spinner} />
                  ) : (
                    "Send Reply →"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.closedNote}>
              🔒 This ticket is {ticket.status}. Switch to Manage tab to reopen
              it.
            </div>
          )}
        </>
      )}

      {/* Manage tab */}
      {tab === "manage" && (
        <div className={styles.manageTab}>
          <div className={styles.manageField}>
            <label className={styles.manageLabel}>Status</label>
            <div className={styles.statusGrid}>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <button
                  key={k}
                  className={`${styles.statusChip} ${status === k ? styles.statusChipActive : ""}`}
                  style={
                    status === k
                      ? {
                          background: v.bg,
                          color: v.color,
                          borderColor: v.color,
                        }
                      : {}
                  }
                  onClick={() => setStatus(k)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.manageField}>
            <label className={styles.manageLabel}>
              Internal Notes{" "}
              <span className={styles.manageHint}>(not shown to user)</span>
            </label>
            <textarea
              className={styles.notesInput}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this ticket…"
              rows={4}
            />
          </div>

          <button
            className={`${styles.saveBtn} ${saveOk ? styles.saveBtnOk : ""}`}
            onClick={saveChanges}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className={styles.spinner} /> Saving…
              </>
            ) : saveOk ? (
              "✓ Saved!"
            ) : (
              "Save Changes"
            )}
          </button>

          {/* Ticket info summary */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Category</span>
              <span className={styles.infoVal}>
                {cat.icon} {cat.label}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Priority</span>
              <span className={styles.infoVal} style={{ color: pri.dot }}>
                ● {pri.label}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Opened</span>
              <span className={styles.infoVal}>
                {fmtDate(ticket.created_at)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Updated</span>
              <span className={styles.infoVal}>
                {fmtDate(ticket.updated_at)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Replies</span>
              <span className={styles.infoVal}>{replies.length}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Attachments</span>
              <span className={styles.infoVal}>{attachments.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Files tab */}
      {tab === "files" && (
        <div className={styles.filesTab}>
          {attachments.length === 0 ? (
            <p className={styles.noFiles}>No attachments on this ticket.</p>
          ) : (
            <div className={styles.filesGrid}>
              {attachments.map((a) => (
                <button
                  key={a.id}
                  className={styles.fileCard}
                  onClick={() => setLightbox(a)}
                >
                  {a.media_type === "video" ? (
                    <div className={styles.fileVideoThumb}>
                      <span className={styles.playIcon}>▶</span>
                    </div>
                  ) : (
                    <img
                      src={a.media_url}
                      alt={a.file_name}
                      className={styles.fileImg}
                    />
                  )}
                  <p className={styles.fileName}>
                    {a.file_name?.slice(0, 20) || "file"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <div
            className={styles.lightboxInner}
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

// ─── Main ───────────────────────────────────────────────────────────
export default function AdminCustomerSupport({ onBack }) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatus] = useState("all");
  const [catFilter, setCat] = useState("all");
  const [sort, setSort] = useState("desc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);
  // Detect mobile: panel becomes full-screen sheet
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: 20, sort });
      if (statusFilter !== "all") p.set("status", statusFilter);
      if (catFilter !== "all") p.set("category", catFilter);
      const [tr, sr] = await Promise.all([
        fetch(`${SUPPORT_URL}?${p}`, { headers: auth() }),
        fetch(`${SUPPORT_URL}/stats`, { headers: auth() }),
      ]);
      const td = await tr.json();
      const sd = await sr.json();
      setTickets(td.tickets || []);
      setTotal(td.pages || 1);
      setStats(sd);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [page, sort, statusFilter, catFilter]);

  useEffect(() => {
    load();
  }, [load]);

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

  const statusTabs = [
    { key: "all", label: "All" },
    { key: "open", label: "Open", count: stats.open_count },
    {
      key: "in_progress",
      label: "In Progress",
      count: stats.in_progress_count,
    },
    { key: "resolved", label: "Resolved", count: stats.resolved_count },
    { key: "closed", label: "Closed", count: stats.closed_count },
  ];

  const showPanel = selected !== null;

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onBack}>
            ←
          </button>
          <div>
            <h1 className={styles.pageTitle}>Support Tickets</h1>
            <p className={styles.pageSub}>
              Manage &amp; respond to customer issues
            </p>
          </div>
        </div>
        <button className={styles.refreshBtn} onClick={load} title="Refresh">
          ↻
        </button>
      </div>

      {/* ── Stats ── */}
      <div className={styles.stats}>
        <StatCard
          label="Total"
          value={stats.total || 0}
          bg="rgb(235,235,255)"
          color="rgb(19,19,103)"
        />
        <StatCard
          label="Open"
          value={stats.open_count || 0}
          bg="#fff8e1"
          color="#f59e0b"
        />
        <StatCard
          label="In Progress"
          value={stats.in_progress_count || 0}
          bg="#e3f2fd"
          color="#1976d2"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved_count || 0}
          bg="#e8f5e9"
          color="#388e3c"
        />
      </div>

      {/* ── Search + filters ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject or ID…"
          />
          {search && (
            <button
              className={styles.searchClear}
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>
        <select
          className={styles.sel}
          value={catFilter}
          onChange={(e) => {
            setCat(e.target.value);
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
          className={styles.sel}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>

      {/* ── Status tabs ── */}
      <div className={styles.statusTabs}>
        {statusTabs.map((t) => (
          <button
            key={t.key}
            className={`${styles.stab} ${statusFilter === t.key ? styles.stabActive : ""}`}
            onClick={() => {
              setStatus(t.key);
              setPage(1);
            }}
          >
            {t.label}
            {t.count > 0 && <span className={styles.stabCount}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div
        className={`${styles.body} ${showPanel && !isMobile ? styles.bodySplit : ""}`}
      >
        {/* Ticket list — hidden on mobile when panel open */}
        {(!showPanel || !isMobile) && (
          <div className={styles.listCol}>
            {loading ? (
              <div className={styles.placeholder}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.skeleton}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyEmoji}>🎫</span>
                <p className={styles.emptyTitle}>No tickets found</p>
                <p className={styles.emptySub}>Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className={styles.listCount}>
                  {filtered.length} ticket{filtered.length !== 1 ? "s" : ""}
                </div>
                {filtered.map((t) => (
                  <TicketRow
                    key={t.id}
                    ticket={t}
                    isActive={selected?.id === t.id}
                    onClick={() => setSelected(t)}
                  />
                ))}
                {totalPages > 1 && (
                  <div className={styles.pager}>
                    <button
                      className={styles.pageBtn}
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ← Prev
                    </button>
                    <span className={styles.pageNum}>
                      {page} / {totalPages}
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
              </>
            )}
          </div>
        )}

        {/* Detail panel */}
        {showPanel && (
          <TicketPanel
            ticket={selected}
            onClose={() => setSelected(null)}
            onUpdated={handleUpdated}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}
