import { useState, useEffect, useCallback } from "react";
import styles from "./AdminDashboard.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const STATUS_FILTERS = ["all", "new", "contacted", "converted", "lost"];

const STATUS_COLORS = {
  new: styles.statusNew,
  contacted: styles.statusContacted,
  converted: styles.statusConverted,
  lost: styles.statusLost,
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({ label, value, color }) {
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>
        {color && (
          <span className={styles.statDot} style={{ background: color }} />
        )}
        {label}
      </p>
      <p className={styles.statValue}>{value}</p>
    </div>
  );
}

function LeadDetailModal({ lead, onClose, onStatusUpdate }) {
  const [status, setStatus] = useState(lead.status);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (status === lead.status) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        onStatusUpdate(data.lead);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const rows = [
    ["Email", lead.email],
    ["Phone", lead.phone_number],
    ["Address", lead.service_address],
    ["ZIP", lead.zip_code],
    lead.apartment_suite && ["Apartment", lead.apartment_suite],
    ["Cleaning type", lead.cleaning_type?.replace("_", " ")],
    ["Frequency", lead.frequency?.replace("_", " ")],
    lead.residential_sqft && ["Sq ft (home)", lead.residential_sqft],
    lead.bedrooms !== null &&
      lead.bedrooms !== undefined && ["Bedrooms", lead.bedrooms],
    lead.bathrooms !== null &&
      lead.bathrooms !== undefined && ["Bathrooms", lead.bathrooms],
    lead.commercial_sqft && ["Sq ft (office)", lead.commercial_sqft],
    lead.offices !== null &&
      lead.offices !== undefined && ["Offices", lead.offices],
    lead.commercial_bathrooms !== null &&
      lead.commercial_bathrooms !== undefined && [
        "Office bathrooms",
        lead.commercial_bathrooms,
      ],
    lead.recurring_plan && ["Recurring plan", lead.recurring_plan],
    ["SMS opt-in", lead.text_me_messages ? "Yes" : "No"],
    ["Submitted", formatDate(lead.created_at)],
  ].filter(Boolean);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />
        <p className={styles.modalName}>
          {lead.first_name} {lead.last_name}
        </p>
        <p className={styles.modalSubtitle}>{lead.email}</p>

        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Lead details</p>
          {rows.map(([k, v]) => (
            <div key={k} className={styles.detailRow}>
              <span className={styles.detailKey}>{k}</span>
              <span className={styles.detailVal}>{v}</span>
            </div>
          ))}
        </div>

        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Update status</p>
          <select
            className={styles.statusSelect}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
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

export default function AdminDashboard({ onLogout, onNavigate }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLead, setSelectedLead] = useState(null);
  const LIMIT = 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`${API_URL}/api/leads?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  // ✅ Silent background refresh every 30 seconds
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      try {
        const params = new URLSearchParams({ page, limit: LIMIT });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/leads?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Background refresh error:", err);
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [filter, page]);

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.first_name?.toLowerCase().includes(q) ||
      l.last_name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.phone_number?.includes(q) ||
      l.service_address?.toLowerCase().includes(q)
    );
  });

  const counts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  function handleStatusUpdate(updated) {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>Deusizi Sparkle Admin</h1>
          <span className={styles.headerBadge}>{total} leads</span>
        </div>
        <div className={styles.headerNav}>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("maids")}
          >
            👩‍🔧 Maids
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("bookings")}
          >
            📅 Bookings
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("users")}
          >
            👥 Users
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("support")}
          >
            🎫 Customer Support
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("maid-support")}
          >
            🧹 Maid Support
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("chats")}
          >
            🎫 Customer and Maid Chat
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("support-chat")}
          >
            🛎️ Customer Support Chat
          </button>
          <button
            className={styles.logoutBtn}
            onClick={() => onNavigate("maid-support-chat")}
          >
            🧹 Maid Support Chat
          </button>
          <button className={styles.logoutBtn} onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsBar}>
        <StatCard label="Total" value={total} />
        <StatCard label="New" value={counts.new || 0} color="#1a56c4" />
        <StatCard
          label="Contacted"
          value={counts.contacted || 0}
          color="#856404"
        />
        <StatCard
          label="Converted"
          value={counts.converted || 0}
          color="#0a6b2e"
        />
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        {STATUS_FILTERS.map((f) => (
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
          placeholder="Search by name, email, phone, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Leads */}
      {loading ? (
        <div className={styles.loading}>Loading leads...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyText}>No leads found</p>
        </div>
      ) : (
        <div className={styles.leadsList}>
          {filtered.map((lead) => (
            <div key={lead.id} className={styles.leadCard}>
              <div className={styles.leadCardTop}>
                <div>
                  <p className={styles.leadName}>
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className={styles.leadEmail}>{lead.email}</p>
                </div>
                <span
                  className={`${styles.statusBadge} ${STATUS_COLORS[lead.status] || styles.statusNew}`}
                >
                  {lead.status}
                </span>
              </div>
              <div className={styles.leadCardMeta}>
                <span className={styles.metaTag}>
                  {lead.cleaning_type?.replace("_", " ")}
                </span>
                <span className={styles.metaTag}>
                  {lead.frequency?.replace("_", " ")}
                </span>
                {lead.service_address && (
                  <span className={styles.metaTag}>
                    {lead.service_address.split(",")[0]}
                  </span>
                )}
              </div>
              <div className={styles.leadCardActions}>
                <button
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={() => setSelectedLead(lead)}
                >
                  View details
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => {
                    setSelectedLead(lead);
                  }}
                >
                  Update
                </button>
                <span className={styles.leadDate}>
                  {formatDate(lead.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
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

      {/* Detail modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
