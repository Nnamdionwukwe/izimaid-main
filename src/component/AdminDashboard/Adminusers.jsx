import { useState, useEffect, useCallback } from "react";
import styles from "./Adminusers.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const ROLE_FILTERS = ["all", "customer", "maid", "admin"];

const ROLE_COLORS = {
  customer: styles.roleCustomer,
  maid: styles.roleMaid,
  admin: styles.roleAdmin,
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
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

// ── Confirmation Modal ────────────────────────────────────────────────────────
function ConfirmDeleteModal({ user, onConfirm, onCancel, isDeleting }) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />
        <div style={{ textAlign: "center", paddingTop: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Delete user?
          </h2>
          <p
            style={{
              color: "rgb(100, 100, 100)",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Are you sure you want to permanently delete{" "}
            <strong>{user.name}</strong>?
          </p>
          <p
            style={{
              color: "rgb(150, 100, 100)",
              fontSize: 12,
              marginBottom: 24,
            }}
          >
            This action cannot be undone. Related data will be handled
            appropriately.
          </p>
        </div>
        <div className={styles.modalActions}>
          <button
            className={styles.modalBtn}
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnDanger}`}
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              background: isDeleting
                ? "rgb(200, 100, 100)"
                : "rgb(187, 19, 47)",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Ban Modal ─────────────────────────────────────────────────────────────────
function BanModal({ user, onConfirm, onCancel, isBanning }) {
  const [reason, setReason] = useState("");
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />
        <div style={{ textAlign: "center", paddingTop: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Ban {user.name}?
          </h2>
          <p
            style={{
              color: "rgb(100,100,100)",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            This will deactivate their account and cancel all active bookings.
          </p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: "bold",
              marginBottom: 6,
            }}
          >
            Ban reason (required)
          </label>
          <textarea
            style={{
              width: "100%",
              border: "1px solid rgb(228,228,228)",
              borderRadius: 8,
              padding: 10,
              fontSize: 13,
              fontFamily: "inherit",
              minHeight: 80,
              boxSizing: "border-box",
              resize: "vertical",
            }}
            placeholder="Explain why this account is being banned..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isBanning}
          />
        </div>
        <div className={styles.modalActions}>
          <button
            className={styles.modalBtn}
            onClick={onCancel}
            disabled={isBanning}
          >
            Cancel
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnDanger}`}
            onClick={() => reason.trim() && onConfirm(reason)}
            disabled={isBanning || !reason.trim()}
            style={{
              background: "rgb(187,19,47)",
              opacity: reason.trim() ? 1 : 0.5,
            }}
          >
            {isBanning ? "Banning..." : "Ban User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Impersonate Result Modal ──────────────────────────────────────────────────
function ImpersonateModal({ result, onClose }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(result.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />
        <div style={{ textAlign: "center", paddingTop: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔑</div>
          <h2 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>
            Impersonation Token
          </h2>
          <p style={{ color: "rgb(100,100,100)", fontSize: 12 }}>
            Expires in 1 hour. Use with caution — admin only.
          </p>
        </div>
        <div
          style={{
            background: "rgb(245,245,248)",
            borderRadius: 8,
            padding: 12,
            fontSize: 11,
            wordBreak: "break-all",
            marginBottom: 16,
            border: "1px solid rgb(220,220,230)",
            fontFamily: "monospace",
            maxHeight: 100,
            overflow: "auto",
          }}
        >
          {result.token}
        </div>
        <p
          style={{ fontSize: 12, color: "rgb(100,100,100)", marginBottom: 16 }}
        >
          User: <strong>{result.user?.name}</strong> ({result.user?.role})
        </p>
        <div className={styles.modalActions}>
          <button className={styles.modalBtn} onClick={onClose}>
            Close
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
            onClick={copy}
          >
            {copied ? "✅ Copied!" : "Copy Token"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── User Edit Modal ────────────────────────────────────────────────────────────
function UserEditModal({ user, onClose, onUpdate, onDelete }) {
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);
  const [flagged, setFlagged] = useState(user.flagged || false);
  const [flagReason, setFlagReason] = useState(user.flag_reason || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // ── NEW STATE ─────────────────────────────────────────────────────────
  const [showBanModal, setShowBanModal] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonateResult, setImpersonateResult] = useState(null);

  async function handleSave() {
    if (
      role === user.role &&
      isActive === user.is_active &&
      flagged === (user.flagged || false) &&
      flagReason === (user.flag_reason || "")
    ) {
      onClose();
      return;
    }
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role,
          is_active: isActive,
          flagged,
          flag_reason: flagReason || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update user");
        return;
      }
      onUpdate(data.user);
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete user");
        setIsDeleting(false);
        return;
      }
      onDelete(user.id);
      onClose();
    } catch {
      setError("Something went wrong");
      setIsDeleting(false);
    }
  }

  // ── NEW: Ban ──────────────────────────────────────────────────────────
  async function handleBan(reason) {
    setIsBanning(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/users/${user.id}/ban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to ban user");
        return;
      }
      onUpdate({
        ...user,
        is_active: false,
        flagged: true,
        ban_reason: reason,
      });
      setShowBanModal(false);
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsBanning(false);
    }
  }

  // ── NEW: Unban ────────────────────────────────────────────────────────
  async function handleUnban() {
    setIsUnbanning(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/users/${user.id}/unban`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to unban user");
        return;
      }
      onUpdate({ ...user, is_active: true, flagged: false, ban_reason: null });
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setIsUnbanning(false);
    }
  }

  // ── NEW: Impersonate ──────────────────────────────────────────────────
  async function handleImpersonate() {
    setIsImpersonating(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/admin/users/${user.id}/impersonate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to impersonate");
        return;
      }
      setImpersonateResult(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setIsImpersonating(false);
    }
  }

  if (showDeleteConfirm) {
    return (
      <ConfirmDeleteModal
        user={user}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDeleting={isDeleting}
      />
    );
  }

  if (showBanModal) {
    return (
      <BanModal
        user={user}
        onConfirm={handleBan}
        onCancel={() => setShowBanModal(false)}
        isBanning={isBanning}
      />
    );
  }

  if (impersonateResult) {
    return (
      <ImpersonateModal
        result={impersonateResult}
        onClose={() => {
          setImpersonateResult(null);
          onClose();
        }}
      />
    );
  }

  const isBanned = !user.is_active && user.flagged;

  const rows = [
    ["Email", user.email],
    ["Role", user.role],
    ["Status", user.is_active ? "Active" : "Inactive"],
    ["Joined", formatDate(user.created_at)],
    user.flagged && ["Flagged", user.flag_reason || "Yes"],
    user.ban_reason && ["Ban reason", user.ban_reason],
    user.google_id && ["Google ID", user.google_id.slice(0, 12) + "..."],
  ].filter(Boolean);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />

        <div className={styles.modalAvatarWrap}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className={styles.modalAvatar}
            />
          ) : (
            <div className={styles.modalAvatarPlaceholder}>
              {initials(user.name)}
            </div>
          )}
          <div>
            <p className={styles.modalName}>{user.name}</p>
            <p className={styles.modalEmail}>{user.email}</p>
            {/* ── NEW: Ban badge ── */}
            {isBanned && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 4,
                  padding: "2px 8px",
                  background: "rgb(254,226,226)",
                  color: "rgb(187,19,47)",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: "bold",
                }}
              >
                🚫 Banned
              </span>
            )}
            {user.flagged && !isBanned && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 4,
                  padding: "2px 8px",
                  background: "rgb(255,243,205)",
                  color: "rgb(133,100,4)",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: "bold",
                }}
              >
                🚩 Flagged
              </span>
            )}
          </div>
        </div>

        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Account info</p>
          {rows.map(([k, v]) => (
            <div key={k} className={styles.detailRow}>
              <span className={styles.detailKey}>{k}</span>
              <span className={styles.detailVal}>{v}</span>
            </div>
          ))}
        </div>

        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Manage</p>

          <div className={styles.toggleWrap}>
            <span className={styles.toggleLabel}>Account active</span>
            <button
              className={`${styles.toggle} ${isActive ? styles.toggleOn : ""}`}
              onClick={() => setIsActive((v) => !v)}
            >
              <div
                className={`${styles.toggleKnob} ${isActive ? styles.toggleKnobOn : ""}`}
              />
            </button>
          </div>

          {/* ── NEW: Flag toggle ── */}
          <div className={styles.toggleWrap} style={{ marginTop: 12 }}>
            <span className={styles.toggleLabel}>Flag account</span>
            <button
              className={`${styles.toggle} ${flagged ? styles.toggleOn : ""}`}
              onClick={() => setFlagged((v) => !v)}
              style={flagged ? { background: "rgb(245,158,11)" } : {}}
            >
              <div
                className={`${styles.toggleKnob} ${flagged ? styles.toggleKnobOn : ""}`}
              />
            </button>
          </div>

          {flagged && (
            <div style={{ marginTop: 8 }}>
              <input
                style={{
                  width: "100%",
                  border: "1px solid rgb(228,228,228)",
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontSize: 13,
                  boxSizing: "border-box",
                }}
                placeholder="Flag reason (optional)"
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <p className={styles.detailSectionTitle}>Change role</p>
            <select
              className={styles.selectField}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="maid">Maid</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <p style={{ color: "rgb(187,19,47)", fontSize: 13, marginTop: 8 }}>
              {error}
            </p>
          )}
        </div>

        {/* ── NEW: Quick actions ─────────────────────────────────────────── */}
        <div
          className={styles.detailSection}
          style={{ borderTop: "1px solid rgb(228,228,228)" }}
        >
          <p className={styles.detailSectionTitle}>Quick actions</p>

          {/* Ban / Unban */}
          {isBanned ? (
            <button
              className={styles.modalBtn}
              onClick={handleUnban}
              disabled={isUnbanning}
              style={{
                width: "100%",
                marginBottom: 8,
                background: "rgb(22,163,74)",
                color: "white",
                border: "none",
              }}
            >
              {isUnbanning ? "Unbanning..." : "✅ Unban User"}
            </button>
          ) : (
            <button
              className={styles.modalBtn}
              onClick={() => setShowBanModal(true)}
              style={{
                width: "100%",
                marginBottom: 8,
                background: "rgb(239,68,68)",
                color: "white",
                border: "none",
              }}
            >
              🚫 Ban User
            </button>
          )}

          {/* Impersonate */}
          <button
            className={styles.modalBtn}
            onClick={handleImpersonate}
            disabled={isImpersonating}
            style={{
              width: "100%",
              background: "rgb(30,58,138)",
              color: "white",
              border: "none",
            }}
          >
            {isImpersonating ? "Generating token..." : "🔑 Impersonate (Debug)"}
          </button>
        </div>

        {/* Danger zone */}
        <div
          className={styles.detailSection}
          style={{ borderTop: "1px solid rgb(228,228,228)" }}
        >
          <p
            className={styles.detailSectionTitle}
            style={{ color: "rgb(187, 19, 47)" }}
          >
            Danger zone
          </p>
          <button
            className={styles.modalBtn}
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              background: "rgb(187, 19, 47)",
              color: "white",
              width: "100%",
            }}
          >
            Delete user permanently
          </button>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.modalBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnPrimary}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  // ── NEW: flagged filter ───────────────────────────────────────────────
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const LIMIT = 50;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filter !== "all") params.set("role", filter);
      if (showFlaggedOnly) params.set("flagged", "true");
      const res = await fetch(`${API_URL}/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.users?.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, page, showFlaggedOnly]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  useEffect(() => {
    setPage(1);
  }, [filter, showFlaggedOnly]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const refreshInterval = setInterval(async () => {
      try {
        const params = new URLSearchParams({ page, limit: LIMIT });
        if (filter !== "all") params.set("role", filter);
        if (showFlaggedOnly) params.set("flagged", "true");
        const res = await fetch(`${API_URL}/api/admin/users?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data.users || []);
        setTotal(data.users?.length || 0);
      } catch (err) {
        console.error("Background refresh error:", err);
      }
    }, 30000);
    return () => clearInterval(refreshInterval);
  }, [filter, page, showFlaggedOnly]);

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  });

  const counts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  // ── NEW: flagged count ────────────────────────────────────────────────
  const flaggedCount = users.filter((u) => u.flagged).length;

  function handleUpdate(updated) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
    );
  }

  function handleDelete(userId) {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setTotal((prev) => Math.max(0, prev - 1));
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>Users</h1>
          <span className={styles.headerBadge}>{total}</span>
          {/* ── NEW: Flagged badge ── */}
          {flaggedCount > 0 && (
            <span
              onClick={() => setShowFlaggedOnly((v) => !v)}
              style={{
                cursor: "pointer",
                marginLeft: 8,
                padding: "2px 10px",
                background: showFlaggedOnly
                  ? "rgb(245,158,11)"
                  : "rgb(255,243,205)",
                color: showFlaggedOnly ? "white" : "rgb(133,100,4)",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: "bold",
                border: "1px solid rgb(245,158,11)",
              }}
            >
              🚩 {flaggedCount} flagged
            </span>
          )}
        </div>
        <button className={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsBar}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Customers</p>
          <p className={styles.statValue}>{counts.customer || 0}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Maids</p>
          <p className={styles.statValue}>{counts.maid || 0}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Admins</p>
          <p className={styles.statValue}>{counts.admin || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        {ROLE_FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <svg
          className={styles.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users */}
      {loading ? (
        <div className={styles.loading}>Loading users...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👥</div>
          <p className={styles.emptyText}>No users found</p>
        </div>
      ) : (
        <div className={styles.userList}>
          {filtered.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userCardTop}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {initials(user.name)}
                  </div>
                )}
                <div className={styles.userInfo}>
                  <p className={styles.userName}>
                    {user.name}
                    {/* ── NEW: inline flag/ban indicators ── */}
                    {user.flagged && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 11,
                          color: "rgb(245,158,11)",
                        }}
                      >
                        🚩
                      </span>
                    )}
                    {!user.is_active && user.flagged && (
                      <span
                        style={{
                          marginLeft: 4,
                          fontSize: 11,
                          color: "rgb(187,19,47)",
                        }}
                      >
                        🚫
                      </span>
                    )}
                  </p>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>
                <span
                  className={`${styles.roleBadge} ${ROLE_COLORS[user.role] || styles.roleCustomer}`}
                >
                  {user.role}
                </span>
              </div>

              <div className={styles.userCardMeta}>
                <span className={styles.metaTag}>
                  Joined {formatDate(user.created_at)}
                </span>
                {!user.is_active && (
                  <span className={`${styles.metaTag} ${styles.inactiveTag}`}>
                    Inactive
                  </span>
                )}
                {/* ── NEW: flagged/banned tags ── */}
                {user.flagged && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      background: "rgb(255,243,205)",
                      color: "rgb(133,100,4)",
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: "bold",
                    }}
                  >
                    Flagged
                  </span>
                )}
                {!user.is_active && user.flagged && (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      background: "rgb(254,226,226)",
                      color: "rgb(187,19,47)",
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: "bold",
                    }}
                  >
                    Banned
                  </span>
                )}
              </div>

              <div className={styles.userCardActions}>
                <button
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={() => setSelectedUser(user)}
                >
                  Manage
                </button>
                <button
                  className={`${styles.actionBtn} ${user.is_active ? styles.actionBtnDanger : styles.actionBtnSuccess}`}
                  onClick={() => setSelectedUser(user)}
                >
                  {user.is_active ? "Deactivate" : "Activate"}
                </button>
                <span className={styles.userDate}>
                  {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
