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

function UserEditModal({ user, onClose, onUpdate }) {
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (role === user.role && isActive === user.is_active) {
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
        body: JSON.stringify({ role, is_active: isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update user");
        return;
      }
      onUpdate(data.user);
      onClose();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const rows = [
    ["Email", user.email],
    ["Role", user.role],
    ["Status", user.is_active ? "Active" : "Inactive"],
    ["Joined", formatDate(user.created_at)],
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
  const LIMIT = 50;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filter !== "all") params.set("role", filter);
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
  }, [filter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  useEffect(() => {
    setPage(1);
  }, [filter]);

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

  function handleUpdate(updated) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>Users</h1>
          <span className={styles.headerBadge}>{total}</span>
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
                  <p className={styles.userName}>{user.name}</p>
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
        />
      )}
    </div>
  );
}
