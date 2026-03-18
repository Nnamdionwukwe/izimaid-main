import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./CustomerSupport.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !category) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message, category, priority }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
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
        {/* Category */}
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

        {/* Priority */}
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

        {/* Subject */}
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

        {/* Message */}
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

        {error && <div className={styles.errorBox}>{error}</div>}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? <span className={styles.spinner} /> : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
}

// ─── Ticket Detail View ─────────────────────────────────────────────
function TicketDetail({ ticket, onBack }) {
  const [replies, setReplies] = useState([]);
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/support/${ticket.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReplies(data.replies || []);
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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/support/${ticket.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: replyMsg }),
      });
      const data = await res.json();
      if (res.ok) {
        setReplies((prev) => [...prev, data.reply]);
        setReplyMsg("");
      }
    } catch {
      /* ignore */
    } finally {
      setSending(false);
    }
  }

  const st = STATUS_STYLES[ticket.status] || STATUS_STYLES.open;
  const cat = CATEGORIES.find((c) => c.value === ticket.category);

  return (
    <div className={styles.detailWrap}>
      <button className={styles.backBtn} onClick={onBack}>
        ← Back to Tickets
      </button>

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

        <div className={styles.thread}>
          {/* Original message */}
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

        {ticket.status !== "closed" && ticket.status !== "resolved" && (
          <div className={styles.replyBox}>
            <textarea
              className={styles.replyInput}
              value={replyMsg}
              onChange={(e) => setReplyMsg(e.target.value)}
              placeholder="Add a reply…"
              rows={3}
            />
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

// ─── Tickets List ───────────────────────────────────────────────────
function TicketsList({ onNew, onOpen }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({ limit: 50 });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/support?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filter]);

  const filters = ["all", "open", "in_progress", "resolved", "closed"];

  return (
    <div className={styles.listWrap}>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.pageTitle}>Support</h1>
          <p className={styles.pageSub}>
            Get help with your bookings and account
          </p>
        </div>
        <button className={styles.newBtn} onClick={onNew}>
          + New Ticket
        </button>
      </div>

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
        <div className={styles.center}>Loading tickets…</div>
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
          {tickets.map((t) => {
            const st = STATUS_STYLES[t.status] || STATUS_STYLES.open;
            const cat = CATEGORIES.find((c) => c.value === t.category);
            return (
              <div
                key={t.id}
                className={styles.ticketCard}
                onClick={() => onOpen(t)}
              >
                <div className={styles.tcTop}>
                  <span className={styles.tcCat}>
                    {cat?.icon} {cat?.label || t.category}
                  </span>
                  <span
                    className={styles.tcStatus}
                    style={{ background: st.bg, color: st.color }}
                  >
                    {st.label}
                  </span>
                </div>
                <p className={styles.tcSubject}>{t.subject}</p>
                <p className={styles.tcSnippet}>{t.message?.slice(0, 80)}…</p>
                <p className={styles.tcDate}>{formatDate(t.created_at)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Support Page ──────────────────────────────────────────────
export default function CustomerSupport() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillBooking = location.state?.booking || null;

  const [view, setView] = useState(prefillBooking ? "new" : "list");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [successTicket, setSuccessTicket] = useState(null);

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
              onClick={() => navigate("/bookings")}
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
        <TicketDetail ticket={selectedTicket} onBack={() => setView("list")} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <TicketsList
        onNew={() => setView("new")}
        onOpen={(t) => {
          setSelectedTicket(t);
          setView("detail");
        }}
      />
    </div>
  );
}
