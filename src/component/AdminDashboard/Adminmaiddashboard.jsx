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
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Check,
  X,
  UserCheck,
  UserX,
  RefreshCw,
} from "lucide-react";
import s from "./AdminMaidDashboard.module.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── helpers ────────────────────────────────────────────────
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

// ─── Component ───────────────────────────────────────────────
export default function AdminMaidDashboard() {
  // list state
  const [maids, setMaids] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const [svcFilter, setSvcFilter] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const PAGE_SIZE = 10;

  // detail / edit state
  const [view, setView] = useState("list"); // list | detail | edit
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);

  // confirm dialog
  const [confirm, setConfirm] = useState(null); // { title, body, onConfirm }

  const { toasts, push } = useToast();
  const searchRef = useRef(null);

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
    } catch (e) {
      push("Failed to load maids", "error");
    } finally {
      setLoading(false);
    }
  }, [page, locFilter, svcFilter]);

  useEffect(() => {
    fetchMaids();
  }, [fetchMaids]);

  // ── Fetch detail ───────────────────────────────────────────
  const openDetail = async (id) => {
    try {
      const res = await fetch(`${API}/api/maids/${id}`, { headers: authHdr() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelected(normalise(data.maid));
      setView("detail");
      fetchReviews(id);
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

      const res = await fetch(`${API}/api/maids/${editing.id}`, {
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
          const res = await fetch(`${API}/api/maids/${maid.id}/${endpoint}`, {
            method: "PATCH",
            headers: authHdr(),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          const updated = { ...maid, is_active: activate };
          setMaids((ms) =>
            ms.map((m) =>
              m.id === maid.id ? { ...m, is_active: activate } : m,
            ),
          );
          if (selected?.id === maid.id) setSelected(updated);
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
            `${API}/api/maids/${selected.id}/reviews/${review.id}`,
            { method: "DELETE", headers: authHdr() },
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

  // ── Helpers ────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────
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
        {/* Page header */}
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>
            Maid <span>Management</span>
          </h1>
          <p className={s.pageSub}>
            Review, edit, and manage all maid profiles
          </p>
        </div>

        {/* ─── LIST VIEW ────────────────────────────────────── */}
        {view === "list" && (
          <>
            {/* Toolbar */}
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

            {/* Table */}
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

                  {/* Pagination */}
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

        {/* ─── DETAIL VIEW ──────────────────────────────────── */}
        {view === "detail" && selected && (
          <div className={s.detailView}>
            <button className={s.backBtn} onClick={() => setView("list")}>
              <ChevronLeft size={15} /> Back to list
            </button>

            {/* Hero */}
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

            {/* Stats strip */}
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

            {/* Detail cards */}
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

            {/* Reviews */}
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

        {/* ─── EDIT VIEW ────────────────────────────────────── */}
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
                {/* Bio */}
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

                {/* Rate + Exp */}
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

                {/* Location */}
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

                {/* Services */}
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

                {/* Availability toggle */}
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

      {/* ── Confirm modal ─────────────────────────────────── */}
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

      {/* ── Toast stack ───────────────────────────────────── */}
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

// ─── Sub-component ───────────────────────────────────────────
function StatusBadge({ maid }) {
  const s_mod = { root: "root" }; // reference to module
  if (maid.is_active === false)
    return (
      <span
        className="badge inactive"
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
