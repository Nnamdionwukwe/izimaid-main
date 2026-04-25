import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Edit2,
  Eye,
  Star,
  MapPin,
  Clock,
  Trash2,
  AlertTriangle,
  Check,
  X,
  UserCheck,
  UserX,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
  Calendar,
  FileText,
  ExternalLink,
} from "lucide-react";
import s from "./Adminmaiddashboard.module.css";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DOC_TYPE_LABELS = {
  national_id: "National ID",
  passport: "Passport",
  drivers_license: "Driver's License",
  utility_bill: "Utility Bill",
};

const toNum = (v, d = 0) => {
  const n = Number(v);
  return isNaN(n) ? d : n;
};
const fmtRate = (r) => toNum(r, 0).toFixed(1);
const authHdr = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return { toasts, push };
}

// ── NEW: Document Review Modal (dark theme) ───────────────────────────────────
function DocReviewModal({ doc, onClose, onReviewed, push }) {
  const [decision, setDecision] = useState("approved");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  async function handleSubmit() {
    if (decision === "rejected" && !notes.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/documents/${doc.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHdr() },
        body: JSON.stringify({
          status: decision,
          admin_notes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onReviewed(data.document);
      push(decision === "approved" ? "Document approved" : "Document rejected");
      onClose();
    } catch (e) {
      push(e.message || "Review failed", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={s.overlay} onClick={onClose}>
      <div
        className={s.modal}
        style={{ maxWidth: 480, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Doc type */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          <div
            className={s.modalIcon}
            style={{
              background: "rgba(99,102,241,0.12)",
              borderColor: "rgba(99,102,241,0.3)",
              color: "var(--c-accent)",
            }}
          >
            <FileText size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>
              {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
            </h3>
            <p
              style={{ margin: 0, fontSize: "0.8rem", color: "var(--c-muted)" }}
            >
              Review submitted document
            </p>
          </div>
        </div>

        {/* Image */}
        <div
          style={{
            background: "var(--c-raised)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            marginBottom: "1rem",
            minHeight: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--c-border)",
          }}
        >
          {imgError ? (
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                color: "var(--c-muted)",
              }}
            >
              <FileText size={36} style={{ marginBottom: 8, opacity: 0.5 }} />
              <p style={{ margin: "0 0 8px", fontSize: "0.85rem" }}>
                PDF or non-displayable file
              </p>
              <a
                href={doc.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--c-accent)",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  justifyContent: "center",
                }}
              >
                Open document <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <img
              src={doc.doc_url}
              alt="Document"
              onError={() => setImgError(true)}
              style={{ width: "100%", maxHeight: 260, objectFit: "contain" }}
            />
          )}
        </div>

        <a
          href={doc.doc_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--c-accent)",
            fontSize: "0.82rem",
            marginBottom: "1.25rem",
            textDecoration: "none",
          }}
        >
          <ExternalLink size={13} /> Open full document
        </a>

        {/* Decision buttons */}
        <p
          style={{
            fontFamily: "var(--ff-mono)",
            fontSize: "0.7rem",
            color: "var(--c-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            margin: "0 0 0.625rem",
          }}
        >
          Decision
        </p>
        <div style={{ display: "flex", gap: "0.625rem", marginBottom: "1rem" }}>
          {["approved", "rejected"].map((d) => (
            <button
              key={d}
              onClick={() => setDecision(d)}
              style={{
                flex: 1,
                padding: "0.625rem",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontFamily: "var(--ff-body)",
                fontSize: "0.875rem",
                fontWeight: 600,
                border:
                  decision === d
                    ? `1px solid ${d === "approved" ? "var(--c-green)" : "var(--c-red)"}`
                    : "1px solid var(--c-border)",
                background:
                  decision === d
                    ? d === "approved"
                      ? "var(--c-green-lo)"
                      : "var(--c-red-lo)"
                    : "transparent",
                color:
                  decision === d
                    ? d === "approved"
                      ? "var(--c-green)"
                      : "var(--c-red)"
                    : "var(--c-muted)",
                transition: "var(--transition)",
              }}
            >
              {d === "approved" ? "✅ Approve" : "❌ Reject"}
            </button>
          ))}
        </div>

        <p
          style={{
            fontFamily: "var(--ff-mono)",
            fontSize: "0.7rem",
            color: "var(--c-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            margin: "0 0 0.5rem",
          }}
        >
          Notes {decision === "rejected" ? "(required)" : "(optional)"}
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            decision === "rejected"
              ? "Explain why the document is rejected..."
              : "Add notes for the maid..."
          }
          style={{
            width: "100%",
            background: "var(--c-raised)",
            border: "1px solid var(--c-border)",
            color: "var(--c-ink)",
            padding: "0.7rem 0.875rem",
            borderRadius: "var(--radius)",
            fontFamily: "var(--ff-body)",
            fontSize: "0.9rem",
            outline: "none",
            resize: "vertical",
            minHeight: 80,
            marginBottom: "1.25rem",
            boxSizing: "border-box",
          }}
        />

        <div className={s.modalActions}>
          <button
            className={`${s.btn} ${s.btnGhost}`}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || (decision === "rejected" && !notes.trim())}
            style={{
              flex: 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.65rem 1.125rem",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontFamily: "var(--ff-body)",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              opacity:
                saving || (decision === "rejected" && !notes.trim()) ? 0.5 : 1,
              background:
                decision === "approved" ? "var(--c-green)" : "var(--c-red)",
              color: decision === "approved" ? "#09090f" : "#fff",
              transition: "var(--transition)",
            }}
          >
            {saving
              ? "Submitting..."
              : `Confirm ${decision === "approved" ? "Approval" : "Rejection"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMaidDashboard() {
  const [maids, setMaids] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const [svcFilter, setSvcFilter] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const PAGE_SIZE = 10;

  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  // ── NEW state ──────────────────────────────────────────────
  const [availability, setAvailability] = useState([]);
  const [availLoading, setAvailLoading] = useState(false);
  const [maidDocs, setMaidDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [reviewingDoc, setReviewingDoc] = useState(null);

  const { toasts, push } = useToast();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // ── Fetch list ─────────────────────────────────────────────
  const fetchMaids = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (locFilter) p.append("location", locFilter);
      if (svcFilter) p.append("service", svcFilter);
      const res = await fetch(`${API}/api/maids/admin/list?${p}`, {
        headers: authHdr(),
      });
      const data = await res.json();
      const seen = new Set();
      const unique = (data.maids || []).map(normalise).filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
      setMaids(unique);
      setTotal(data.total || 0);
    } catch {
      push("Failed to load maids", "error");
    } finally {
      setLoading(false);
    }
  }, [page, locFilter, svcFilter]);

  useEffect(() => {
    fetchMaids();
  }, [fetchMaids]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const id = setInterval(async () => {
      try {
        const p = new URLSearchParams({ page, limit: PAGE_SIZE });
        if (locFilter) p.append("location", locFilter);
        if (svcFilter) p.append("service", svcFilter);
        const res = await fetch(`${API}/api/maids/admin/list?${p}`, {
          headers: authHdr(),
        });
        const data = await res.json();
        const seen = new Set();
        const unique = (data.maids || []).map(normalise).filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
        setMaids(unique);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Background refresh error:", err);
      }
    }, 30000);
    return () => clearInterval(id);
  }, [page, locFilter, svcFilter]);

  // ── Fetch detail ───────────────────────────────────────────
  const openDetail = async (id) => {
    try {
      const res = await fetch(`${API}/api/maids/${id}`, { headers: authHdr() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelected(normalise(data.maid));
      setView("detail");
      fetchReviews(id);
      fetchAvailability(id); // ← NEW
      fetchMaidDocs(id); // ← NEW
    } catch (e) {
      push(e.message || "Could not load maid", "error");
    }
  };

  // ── Fetch reviews ──────────────────────────────────────────
  const fetchReviews = async (id) => {
    setRevLoading(true);
    try {
      const res = await fetch(`${API}/api/maids/${id}/reviews`, {
        headers: authHdr(),
      });
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      push("Could not load reviews", "error");
    } finally {
      setRevLoading(false);
    }
  };

  // ── NEW: Fetch availability ────────────────────────────────
  const fetchAvailability = async (id) => {
    setAvailLoading(true);
    try {
      const res = await fetch(`${API}/api/maids/${id}/availability`, {
        headers: authHdr(),
      });
      const data = await res.json();
      setAvailability(data.availability || []);
    } catch {
      setAvailability([]);
    } finally {
      setAvailLoading(false);
    }
  };

  // ── NEW: Fetch maid documents (via admin documents endpoint) ─
  const fetchMaidDocs = async (maidId) => {
    setDocsLoading(true);
    try {
      // Fetch all statuses and filter client-side by maid
      // The /api/admin/documents endpoint returns docs filtered by status;
      // we'll fetch pending + approved + rejected and merge
      const statuses = ["pending", "approved", "rejected"];
      const results = await Promise.all(
        statuses.map((st) =>
          fetch(`${API}/api/admin/documents?status=${st}&limit=50`, {
            headers: authHdr(),
          })
            .then((r) => r.json())
            .then((d) => d.documents || []),
        ),
      );
      const all = results.flat().filter((d) => d.maid_id === maidId);
      setMaidDocs(all);
    } catch {
      setMaidDocs([]);
    } finally {
      setDocsLoading(false);
    }
  };

  // ── Admin: update maid profile ─────────────────────────────
  const handleSaveEdit = async () => {
    try {
      const body = {
        bio: editing.bio,
        hourly_rate: toNum(editing.hourly_rate),
        years_exp: toNum(editing.years_exp),
        services: editing.services,
        location: editing.location,
        is_available: editing.is_available,
      };
      const res = await fetch(`${API}/api/maids/admin/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHdr() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = normalise({ ...selected, ...data.profile });
      setSelected(updated);
      setMaids((ms) => ms.map((m) => (m.id === updated.id ? updated : m)));
      setEditing(null);
      setView("detail");
      push("Profile updated");
    } catch (e) {
      push(e.message || "Update failed", "error");
    }
  };

  // ── Admin: activate / deactivate ──────────────────────────
  const toggleActive = (maid, activate) => {
    setConfirm({
      title: activate ? "Activate maid?" : "Deactivate maid?",
      body: activate
        ? `${maid.name} will be visible to customers again.`
        : `${maid.name} will be hidden from all listings.`,
      isDanger: !activate,
      onConfirm: async () => {
        const endpoint = activate ? "activate" : "deactivate";
        try {
          const res = await fetch(
            `${API}/api/maids/admin/${maid.id}/${endpoint}`,
            {
              method: "PATCH",
              headers: authHdr(),
            },
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setMaids((ms) =>
            ms.map((m) =>
              m.id === maid.id ? { ...m, is_active: activate } : m,
            ),
          );
          if (selected?.id === maid.id)
            setSelected({ ...maid, is_active: activate });
          push(activate ? "Maid activated" : "Maid deactivated");
        } catch (e) {
          push(e.message || "Action failed", "error");
        }
        setConfirm(null);
      },
    });
  };

  // ── Admin: delete review ───────────────────────────────────
  const deleteReview = (review, idx) => {
    setConfirm({
      title: "Delete review?",
      body: "This review will be permanently removed.",
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(
            `${API}/api/maids/admin/${selected.id}/reviews/${review.id}`,
            {
              method: "DELETE",
              headers: authHdr(),
            },
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setReviews((rv) => rv.filter((_, i) => i !== idx));
          push("Review deleted");
        } catch (e) {
          push(e.message || "Delete failed", "error");
        }
        setConfirm(null);
      },
    });
  };

  // ── NEW: handle doc reviewed ───────────────────────────────
  function handleDocReviewed(updatedDoc) {
    setMaidDocs((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? { ...d, ...updatedDoc } : d)),
    );
    // If approved, update id_verified on selected
    if (updatedDoc.status === "approved") {
      setSelected((s) => (s ? { ...s, id_verified: true } : s));
    }
  }

  function normalise(m) {
    return {
      ...m,
      rating: toNum(m.rating, 0),
      hourly_rate: toNum(m.hourly_rate, 0),
      years_exp: toNum(m.years_exp, 0),
      total_reviews: toNum(m.total_reviews, 0),
    };
  }

  const filtered = maids
    .filter((m) => m.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "rating"
        ? toNum(b.rating) - toNum(a.rating)
        : toNum(b.hourly_rate) - toNum(a.hourly_rate),
    );
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const activeCount = maids.filter((m) => m.is_available).length;

  // ── NEW: helpers for doc/availability display ─────────────
  function docStatusColor(status) {
    if (status === "approved")
      return {
        bg: "var(--c-green-lo)",
        color: "var(--c-green)",
        border: "rgba(52,211,153,0.3)",
      };
    if (status === "rejected")
      return {
        bg: "var(--c-red-lo)",
        color: "var(--c-red)",
        border: "rgba(248,113,113,0.3)",
      };
    return {
      bg: "var(--c-amber-lo)",
      color: "var(--c-amber)",
      border: "rgba(251,191,36,0.3)",
    };
  }

  function docStatusLabel(status) {
    if (status === "approved") return "✅ Approved";
    if (status === "rejected") return "❌ Rejected";
    return "⏳ Pending";
  }

  return (
    <div className={s.root}>
      {/* Top bar */}
      <nav className={s.topbar}>
        <div className={s.topbarInner}>
          <div className={s.brand}>
            <span className={s.brandDot} />
            Admin Console
          </div>
          <div className={s.topbarStats}>
            <span className={s.topbarStat}>
              Total&nbsp;<strong>{total}</strong>
            </span>
            <span className={s.divider} />
            <span className={s.topbarStat}>
              Available&nbsp;<strong>{activeCount}</strong>
            </span>
          </div>
        </div>
      </nav>

      <div className={s.container}>
        <div className={s.pageHeader}>
          <button className={s.backBtn} onClick={() => navigate("/admin")}>
            <ChevronLeft size={15} /> Back
          </button>
          <h1 className={s.pageTitle}>
            Maid <span>Management</span>
          </h1>
          <p className={s.pageSub}>
            Review, edit, and manage all maid profiles
          </p>
        </div>

        {/* ─── LIST VIEW ──────────────────────────────────── */}
        {view === "list" && (
          <>
            <div className={s.toolbar}>
              <div className={s.searchWrap}>
                <Search size={15} />
                <input
                  ref={searchRef}
                  className={s.searchInput}
                  placeholder="Search by name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className={s.select}
                value={locFilter}
                onChange={(e) => {
                  setLocFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Locations</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>
              <select
                className={s.select}
                value={svcFilter}
                onChange={(e) => {
                  setSvcFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Services</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="deep_clean">Deep Clean</option>
              </select>
              <select
                className={s.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">By Rating</option>
                <option value="rate">By Rate</option>
              </select>
              <button
                className={`${s.btn} ${s.btnGhost}`}
                onClick={fetchMaids}
                title="Refresh"
              >
                <RefreshCw size={15} />
              </button>
            </div>

            <div className={s.card}>
              {loading ? (
                <div className={s.loading}>
                  <div className={s.spinner} />
                  Loading maids…
                </div>
              ) : filtered.length === 0 ? (
                <div className={s.empty}>No maids found</div>
              ) : (
                <>
                  <div className={s.tableWrap}>
                    <table>
                      <thead>
                        <tr>
                          <th>Maid</th>
                          <th>Location</th>
                          <th>Rating</th>
                          <th>Rate / hr</th>
                          <th>Exp</th>
                          <th>Verified</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((maid) => (
                          <tr key={maid.id}>
                            <td>
                              <div className={s.nameCell}>
                                <img
                                  className={s.avatar}
                                  src={maid.avatar || "/avatar-placeholder.png"}
                                  alt={maid.name}
                                  onError={(e) => {
                                    e.target.src = "/avatar-placeholder.png";
                                  }}
                                />
                                <p className={s.maidName}>{maid.name || "—"}</p>
                              </div>
                            </td>
                            <td>
                              <div className={s.locCell}>
                                <MapPin size={13} />
                                {maid.location || "—"}
                              </div>
                            </td>
                            <td>
                              <div className={s.ratingCell}>
                                <Star size={13} className={s.starIcon} />
                                <span className={s.ratingVal}>
                                  {fmtRate(maid.rating)}
                                </span>
                                <span className={s.reviewCount}>
                                  ({maid.total_reviews})
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className={s.rate}>
                                ₦{toNum(maid.hourly_rate).toLocaleString()}
                              </span>
                            </td>
                            <td>
                              <span className={s.expText}>
                                {maid.years_exp} yrs
                              </span>
                            </td>
                            {/* ── NEW: id_verified column ── */}
                            <td>
                              {maid.id_verified ? (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    color: "var(--c-green)",
                                    fontSize: "0.78rem",
                                  }}
                                >
                                  <ShieldCheck size={13} /> Verified
                                </span>
                              ) : (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    color: "var(--c-muted)",
                                    fontSize: "0.78rem",
                                  }}
                                >
                                  <ShieldOff size={13} /> Unverified
                                </span>
                              )}
                            </td>
                            <td>
                              <StatusBadge maid={maid} />
                            </td>
                            <td>
                              <div className={s.actions}>
                                <button
                                  className={s.iconBtn}
                                  title="View"
                                  onClick={() => openDetail(maid.id)}
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  className={s.iconBtn}
                                  title="Edit"
                                  onClick={() => {
                                    setEditing({ ...maid });
                                    setView("edit");
                                  }}
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  className={`${s.iconBtn} ${maid.is_active === false ? "" : s.danger}`}
                                  title={
                                    maid.is_active === false
                                      ? "Activate"
                                      : "Deactivate"
                                  }
                                  onClick={() =>
                                    toggleActive(maid, maid.is_active === false)
                                  }
                                >
                                  {maid.is_active === false ? (
                                    <UserCheck size={14} />
                                  ) : (
                                    <UserX size={14} />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={s.pagination}>
                    <span className={s.pageInfo}>
                      Page {page} of {totalPages} &nbsp;·&nbsp; {total} total
                    </span>
                    <div className={s.pageButtons}>
                      <button
                        className={s.pageBtn}
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        <ChevronLeft size={14} /> Prev
                      </button>
                      <button
                        className={s.pageBtn}
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ─── DETAIL VIEW ────────────────────────────────── */}
        {view === "detail" && selected && (
          <div className={s.detailView}>
            <button className={s.backBtn} onClick={() => setView("list")}>
              <ChevronLeft size={15} /> Back to list
            </button>

            <div className={s.detailHero}>
              <div className={s.heroLeft}>
                <img
                  className={s.heroAvatar}
                  src={selected.avatar || "/avatar-placeholder.png"}
                  alt={selected.name}
                  onError={(e) => {
                    e.target.src = "/avatar-placeholder.png";
                  }}
                />
                <div className={s.heroInfo}>
                  <h2>{selected.name || "—"}</h2>
                  <div className={s.heroMeta}>
                    <span className={s.metaItem}>
                      <MapPin />
                      {selected.location || "—"}
                    </span>
                    {selected.member_since && (
                      <span className={s.metaItem}>
                        <Clock />
                        Member since{" "}
                        {new Date(selected.member_since).toLocaleDateString()}
                      </span>
                    )}
                    {/* ── NEW: verification badges ── */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.78rem",
                        fontFamily: "var(--ff-mono)",
                        color: selected.id_verified
                          ? "var(--c-green)"
                          : "var(--c-muted)",
                      }}
                    >
                      <ShieldCheck size={13} />
                      {selected.id_verified ? "ID Verified" : "ID Unverified"}
                    </span>
                    {selected.background_checked && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "0.78rem",
                          fontFamily: "var(--ff-mono)",
                          color: "var(--c-accent)",
                        }}
                      >
                        <ShieldCheck size={13} /> BG Checked
                      </span>
                    )}
                    <StatusBadge maid={selected} />
                  </div>
                </div>
              </div>
              <div className={s.heroActions}>
                <button
                  className={`${s.btn} ${selected.is_active === false ? s.btnGreen : s.btnRed}`}
                  onClick={() =>
                    toggleActive(selected, selected.is_active === false)
                  }
                >
                  {selected.is_active === false ? (
                    <>
                      <UserCheck size={15} /> Activate
                    </>
                  ) : (
                    <>
                      <UserX size={15} /> Deactivate
                    </>
                  )}
                </button>
                <button
                  className={`${s.btn} ${s.btnAmber}`}
                  onClick={() => {
                    setEditing({ ...selected });
                    setView("edit");
                  }}
                >
                  <Edit2 size={15} /> Edit Profile
                </button>
              </div>
            </div>

            <div className={s.statsStrip}>
              <div className={s.statTile}>
                <p className={s.statTileLabel}>Rating</p>
                <p className={`${s.statTileValue} ${s.amber}`}>
                  {fmtRate(selected.rating)}
                </p>
              </div>
              <div className={s.statTile}>
                <p className={s.statTileLabel}>Reviews</p>
                <p className={s.statTileValue}>{selected.total_reviews}</p>
              </div>
              <div className={s.statTile}>
                <p className={s.statTileLabel}>Hourly Rate</p>
                <p className={`${s.statTileValue} ${s.green}`}>
                  ₦{toNum(selected.hourly_rate).toLocaleString()}
                </p>
              </div>
              <div className={s.statTile}>
                <p className={s.statTileLabel}>Experience</p>
                <p className={`${s.statTileValue} ${s.accent}`}>
                  {selected.years_exp} yrs
                </p>
              </div>
            </div>

            <div className={s.detailGrid}>
              <div className={`${s.detailCard} ${s.fullWidth}`}>
                <p className={s.detailCardLabel}>Bio</p>
                <p className={s.bioText}>
                  {selected.bio || "No bio provided."}
                </p>
              </div>
              <div className={`${s.detailCard} ${s.fullWidth}`}>
                <p className={s.detailCardLabel}>Services</p>
                <div className={s.services}>
                  {selected.services?.length ? (
                    selected.services.map((sv, i) => (
                      <span key={i} className={s.serviceTag}>
                        {sv}
                      </span>
                    ))
                  ) : (
                    <span className={s.bioText}>None listed</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── NEW: Availability section ──────────────────── */}
            <div className={s.reviewsSection} style={{ marginBottom: "1rem" }}>
              <div className={s.reviewsHeader}>
                <h3 className={s.reviewsTitle}>
                  <Calendar
                    size={16}
                    style={{ verticalAlign: "middle", marginRight: 6 }}
                  />
                  Weekly Availability
                </h3>
              </div>
              {availLoading ? (
                <div className={s.loading}>
                  <div className={s.spinner} />
                  Loading…
                </div>
              ) : availability.length === 0 ? (
                <div className={s.empty}>No availability set</div>
              ) : (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {DAYS.map((day, i) => {
                    const slot = availability.find((a) => a.day_of_week === i);
                    return (
                      <div
                        key={i}
                        style={{
                          padding: "0.5rem 0.875rem",
                          borderRadius: "var(--radius)",
                          border: `1px solid ${slot ? "rgba(99,102,241,0.35)" : "var(--c-border)"}`,
                          background: slot
                            ? "var(--c-accent-lo)"
                            : "transparent",
                          fontSize: "0.8rem",
                          fontFamily: "var(--ff-mono)",
                          color: slot ? "var(--c-accent)" : "var(--c-muted)",
                          minWidth: 100,
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>
                          {day}
                        </div>
                        {slot ? (
                          <div style={{ fontSize: "0.72rem" }}>
                            {slot.start_time} – {slot.end_time}
                          </div>
                        ) : (
                          <div style={{ fontSize: "0.72rem", opacity: 0.5 }}>
                            Off
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── NEW: Identity Documents section ───────────── */}
            <div className={s.reviewsSection} style={{ marginBottom: "1rem" }}>
              <div className={s.reviewsHeader}>
                <h3 className={s.reviewsTitle}>
                  <FileText
                    size={16}
                    style={{ verticalAlign: "middle", marginRight: 6 }}
                  />
                  Identity Documents
                  {maidDocs.filter((d) => d.status === "pending").length >
                    0 && (
                    <span
                      style={{
                        marginLeft: 8,
                        background: "var(--c-amber-lo)",
                        color: "var(--c-amber)",
                        border: "1px solid rgba(251,191,36,0.3)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: 20,
                        fontSize: "0.7rem",
                        fontWeight: 500,
                      }}
                    >
                      {maidDocs.filter((d) => d.status === "pending").length}{" "}
                      pending
                    </span>
                  )}
                </h3>
              </div>
              {docsLoading ? (
                <div className={s.loading}>
                  <div className={s.spinner} />
                  Loading documents…
                </div>
              ) : maidDocs.length === 0 ? (
                <div className={s.empty}>No documents submitted</div>
              ) : (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.625rem",
                  }}
                >
                  {maidDocs.map((doc) => {
                    const sc = docStatusColor(doc.status);
                    return (
                      <div
                        key={doc.id}
                        style={{
                          background: "var(--c-raised)",
                          border: "1px solid var(--c-border)",
                          borderRadius: "var(--radius)",
                          padding: "0.875rem 1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.875rem",
                          borderLeft: `3px solid ${sc.color}`,
                        }}
                      >
                        <FileText
                          size={16}
                          style={{ color: sc.color, flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              fontSize: "0.875rem",
                            }}
                          >
                            {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                          </p>
                          {doc.admin_notes && (
                            <p
                              style={{
                                margin: "2px 0 0",
                                fontSize: "0.75rem",
                                color: "var(--c-muted)",
                              }}
                            >
                              Notes: {doc.admin_notes}
                            </p>
                          )}
                        </div>
                        <span
                          style={{
                            padding: "0.25rem 0.625rem",
                            borderRadius: 20,
                            fontSize: "0.72rem",
                            fontFamily: "var(--ff-mono)",
                            fontWeight: 500,
                            background: sc.bg,
                            color: sc.color,
                            border: `1px solid ${sc.border}`,
                            flexShrink: 0,
                          }}
                        >
                          {docStatusLabel(doc.status)}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.375rem",
                            flexShrink: 0,
                          }}
                        >
                          <a
                            href={doc.doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={s.iconBtn}
                            title="View document"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ExternalLink size={13} />
                          </a>
                          <button
                            className={s.iconBtn}
                            title="Review document"
                            onClick={() => setReviewingDoc(doc)}
                          >
                            <Check size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reviews section (unchanged) */}
            <div className={s.reviewsSection}>
              <div className={s.reviewsHeader}>
                <h3 className={s.reviewsTitle}>
                  Reviews&nbsp;
                  <span
                    style={{
                      color: "var(--c-muted)",
                      fontFamily: "var(--ff-mono)",
                      fontWeight: 400,
                    }}
                  >
                    ({reviews.length})
                  </span>
                </h3>
              </div>
              {revLoading ? (
                <div className={s.loading}>
                  <div className={s.spinner} />
                  Loading reviews…
                </div>
              ) : reviews.length === 0 ? (
                <div className={s.empty}>No reviews yet</div>
              ) : (
                <div className={s.reviewsList}>
                  {reviews.map((r, i) => (
                    <div key={r.id ?? i} className={s.reviewCard}>
                      <div>
                        <div className={s.reviewMeta}>
                          <span className={s.reviewerName}>
                            {r.customer_name || "Anonymous"}
                          </span>
                          <span className={s.reviewStars}>
                            {"⭐".repeat(toNum(r.rating, 0))}
                          </span>
                          <span className={s.reviewDate}>
                            {r.created_at
                              ? new Date(r.created_at).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                        <p className={s.reviewComment}>
                          {r.comment || "No comment"}
                        </p>
                      </div>
                      <button
                        className={s.deleteReviewBtn}
                        title="Delete review"
                        onClick={() => deleteReview(r, i)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── EDIT VIEW ──────────────────────────────────── */}
        {view === "edit" && editing && (
          <div className={s.editView}>
            <button
              className={s.backBtn}
              onClick={() => setView(selected ? "detail" : "list")}
            >
              <ChevronLeft size={15} /> Cancel
            </button>
            <div className={s.editCard}>
              <div className={s.editCardHeader}>
                <h2>Edit Profile</h2>
                <p>
                  Changes are saved directly to the maid's profile via the admin
                  API
                </p>
              </div>
              <div className={s.editCardBody}>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Bio</label>
                  <textarea
                    className={s.formTextarea}
                    value={editing.bio || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, bio: e.target.value })
                    }
                    placeholder="Maid's professional bio…"
                  />
                </div>
                <div className={s.formRow}>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Hourly Rate (₦)</label>
                    <input
                      className={s.formInput}
                      type="number"
                      min={0}
                      value={toNum(editing.hourly_rate)}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          hourly_rate: toNum(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className={s.formGroup}>
                    <label className={s.formLabel}>Years of Experience</label>
                    <input
                      className={s.formInput}
                      type="number"
                      min={0}
                      value={toNum(editing.years_exp)}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          years_exp: toNum(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>Location</label>
                  <input
                    className={s.formInput}
                    type="text"
                    value={editing.location || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, location: e.target.value })
                    }
                    placeholder="e.g. Lagos"
                  />
                </div>
                <div className={s.formGroup}>
                  <label className={s.formLabel}>
                    Services (comma-separated)
                  </label>
                  <input
                    className={s.formInput}
                    type="text"
                    value={
                      Array.isArray(editing.services)
                        ? editing.services.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        services: e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="e.g. residential, deep_clean"
                  />
                </div>
                <div className={s.formGroup}>
                  <label className={s.checkRow} htmlFor="availCheck">
                    <input
                      id="availCheck"
                      type="checkbox"
                      checked={editing.is_available || false}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          is_available: e.target.checked,
                        })
                      }
                    />
                    <span className={s.checkLabel}>Mark as Available</span>
                  </label>
                </div>
                <div className={s.formFooter}>
                  <button
                    className={`${s.btn} ${s.btnGhost}`}
                    onClick={() => setView(selected ? "detail" : "list")}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${s.btn} ${s.btnPrimary}`}
                    onClick={handleSaveEdit}
                  >
                    <Check size={15} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {confirm && (
        <div className={s.overlay} onClick={() => setConfirm(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalIcon}>
              <AlertTriangle size={20} />
            </div>
            <h3>{confirm.title}</h3>
            <p>{confirm.body}</p>
            <div className={s.modalActions}>
              <button
                className={`${s.btn} ${s.btnGhost}`}
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button
                className={`${s.btn} ${confirm.isDanger ? s.btnRed : s.btnPrimary}`}
                onClick={confirm.onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW: Document review modal ── */}
      {reviewingDoc && (
        <DocReviewModal
          doc={reviewingDoc}
          onClose={() => setReviewingDoc(null)}
          onReviewed={handleDocReviewed}
          push={push}
        />
      )}

      {/* Toast stack */}
      <div className={s.toastWrap}>
        {toasts.map((t) => (
          <div key={t.id} className={`${s.toast} ${s[t.type]}`}>
            {t.type === "success" ? <Check size={14} /> : <X size={14} />}
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ maid }) {
  if (maid.is_active === false)
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.3rem 0.65rem",
          borderRadius: "20px",
          fontSize: "0.72rem",
          fontFamily: "'DM Mono',monospace",
          fontWeight: 500,
          letterSpacing: "0.3px",
          background: "rgba(255,255,255,0.06)",
          color: "#7878a0",
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
            display: "inline-block",
          }}
        />
        Inactive
      </span>
    );
  if (maid.is_available)
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.3rem 0.65rem",
          borderRadius: "20px",
          fontSize: "0.72rem",
          fontFamily: "'DM Mono',monospace",
          fontWeight: 500,
          letterSpacing: "0.3px",
          background: "rgba(52,211,153,0.12)",
          color: "#34d399",
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
            display: "inline-block",
          }}
        />
        Available
      </span>
    );
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.3rem 0.65rem",
        borderRadius: "20px",
        fontSize: "0.72rem",
        fontFamily: "'DM Mono',monospace",
        fontWeight: 500,
        letterSpacing: "0.3px",
        background: "rgba(248,113,113,0.12)",
        color: "#f87171",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "currentColor",
          display: "inline-block",
        }}
      />
      Unavailable
    </span>
  );
}
