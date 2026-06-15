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

const NAV_GROUPS = [
  {
    label: "People",
    items: [
      { key: "maids", icon: "👩‍🔧", label: "Maids" },
      { key: "users", icon: "👥", label: "Users" },
    ],
  },
  {
    label: "Operations",
    items: [
      { key: "bookings", icon: "📅", label: "Bookings" },
      { key: "documents", icon: "📄", label: "Document Review" },
    ],
  },
  {
    label: "Finance",
    items: [
      { key: "payments", icon: "💳", label: "Payments" },
      { key: "admin-wallets", icon: "👛", label: "Maid Wallets" },
      { key: "withdrawals", icon: "🏦", label: "Withdrawals" },
      { key: "subscriptions", icon: "⭐", label: "Subscriptions" },
    ],
  },
  {
    label: "Support & Chat",
    items: [
      { key: "support", icon: "🎫", label: "Customer Support" },
      { key: "maid-support", icon: "🧹", label: "Maid Support" },
      { key: "chats", icon: "💬", label: "All Live Chats" },
      { key: "support-chat", icon: "🛎️", label: "Customer Live Chat" },
      { key: "maid-support-chat", icon: "🫧", label: "Maid Live Chat" },
    ],
  },
  {
    label: "Deusizi Academy Forms",
    items: [
      {
        key: "cleaner-applications",
        icon: "🧹",
        label: "Cleaner Training Forms",
      },
      {
        key: "housekeeper-applications",
        icon: "🧼",
        label: "Housekeeper Training Forms",
      },
      {
        key: "caregiver-applications",
        icon: "👩‍⚕️",
        label: "Caregiver Training Forms",
      },
      {
        key: "domestic-certification-applications",
        icon: "📜",
        label: "Domestic Certification Forms",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      { key: "stats", icon: "📊", label: "Analytics" },
      { key: "notifications", icon: "🔔", label: "Notifications" },
      { key: "audit", icon: "🔍", label: "Audit Log" },
    ],
  },
  {
    label: "System",
    items: [{ key: "settings", icon: "⚙️", label: "Settings" }],
  },
];

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
    lead.bedrooms != null && ["Bedrooms", lead.bedrooms],
    lead.bathrooms != null && ["Bathrooms", lead.bathrooms],
    lead.commercial_sqft && ["Sq ft (office)", lead.commercial_sqft],
    lead.offices != null && ["Offices", lead.offices],
    lead.commercial_bathrooms != null && [
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

// ── Sidebar ────────────────────────────────────────────────────────────
function Sidebar({ activeView, onNavigate, onLogout, mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className={styles.sidebarBackdrop} onClick={onClose} />
      )}

      <aside
        className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ""}`}
      >
        {/* Logo / brand */}
        <div className={styles.sidebarBrand}>
          <span className={styles.sidebarBrandTitle}>Deusizi</span>
          <span className={styles.sidebarBrandSub}>Admin</span>
        </div>

        {/* Nav groups */}
        <nav className={styles.sidebarNav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className={styles.navGroup}>
              <span className={styles.navGroupLabel}>{group.label}</span>
              {group.items.map(({ key, icon, label }) => (
                <button
                  key={key}
                  className={`${styles.navBtn} ${activeView === key ? styles.navBtnActive : ""}`}
                  onClick={() => {
                    onNavigate(key);
                    onClose();
                  }}
                >
                  <span className={styles.navIcon}>{icon}</span>
                  <span className={styles.navLabel}>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout pinned to bottom */}
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={onLogout}>
            <span className={styles.navIcon}>🚪</span>
            <span className={styles.navLabel}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────
export default function AdminDashboard({
  onLogout,
  onNavigate,
  activeView = "dashboard",
}) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLead, setSelectedLead] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Background refresh every 30s
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const id = setInterval(async () => {
      try {
        const params = new URLSearchParams({ page, limit: LIMIT });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/leads?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      } catch {}
    }, 30000);
    return () => clearInterval(id);
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

  // Find active nav label for topbar breadcrumb
  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const activeItem = allItems.find((i) => i.key === activeView);
  const pageTitle = activeItem
    ? `${activeItem.icon} ${activeItem.label}`
    : "Dashboard";

  return (
    <div className={styles.shell}>
      <Sidebar
        activeView={activeView}
        onNavigate={onNavigate}
        onLogout={onLogout}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.mainArea}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            {/* Hamburger — mobile only */}
            <button
              className={styles.hamburger}
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
            <h1 className={styles.topBarTitle}>{pageTitle}</h1>
          </div>
          <span className={styles.headerBadge}>{total} leads</span>
        </div>

        {/* Dashboard content */}
        <div className={styles.dashboard}>
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
                      onClick={() => setSelectedLead(lead)}
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
        </div>
      </div>

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
