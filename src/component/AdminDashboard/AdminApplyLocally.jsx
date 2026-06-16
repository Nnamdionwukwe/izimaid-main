// AdminApplyLocally.jsx
import { useState, useEffect, useCallback } from "react";
import styles from "./AdminApplyLocally.module.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#f0ad4e", icon: "⏳" },
  { value: "reviewed", label: "Reviewed", color: "#5bc0de", icon: "👁️" },
  { value: "approved", label: "Approved", color: "#5cb85c", icon: "✅" },
  { value: "rejected", label: "Rejected", color: "#d9534f", icon: "❌" },
  { value: "onboarded", label: "Onboarded", color: "#c9a84c", icon: "🎓" },
];

const CITIES = ["Abuja", "Lagos"];

const EXPERIENCE_LEVELS = ["0", "1", "2", "3", "5+"];

const SERVICES = [
  "General home cleaning",
  "Deep cleaning",
  "Kitchen cleaning",
  "Bathroom cleaning",
  "Laundry & ironing",
  "Home organisation",
  "Window cleaning",
  "Carpet cleaning",
];

export default function AdminApplyLocally({ onBack }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [cityStats, setCityStats] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    city: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.city) params.append("city", filters.city);
      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const response = await axios.get(
        `${API_BASE_URL}/api/maid-application/applications?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setApplications(response.data.applications);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: Math.ceil(response.data.total / response.data.limit),
        });
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.response?.data?.error || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/maid-application/applications/stats`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setStats(response.data.stats);
        setCityStats(response.data.cityStats || []);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [fetchApplications, fetchStats]);

  // Update application status
  const updateStatus = async (id, status, notes = null) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/maid-application/applications/${id}/status`,
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchApplications();
        fetchStats();
        setShowModal(false);
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.error || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // Update admin notes
  const updateNotes = async (id, notes) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/maid-application/applications/${id}/notes`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchApplications();
        setShowModal(false);
        setSelectedApplication(null);
        setNotesInput("");
      }
    } catch (err) {
      console.error("Error updating notes:", err);
      alert(err.response?.data?.error || "Failed to update notes");
    } finally {
      setUpdating(false);
    }
  };

  // Delete application
  const deleteApplication = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/api/maid-application/applications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchApplications();
        fetchStats();
        setShowModal(false);
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error("Error deleting application:", err);
      alert(err.response?.data?.error || "Failed to delete application");
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async () => {
    if (!bulkAction || selectedApps.length === 0) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/maid-application/applications/bulk/status`,
        { applicationIds: selectedApps, status: bulkAction },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        alert(`Updated ${response.data.summary.successCount} applications`);
        setSelectedApps([]);
        setBulkAction("");
        setShowBulkModal(false);
        fetchApplications();
        fetchStats();
      }
    } catch (err) {
      console.error("Error bulk updating:", err);
      alert(err.response?.data?.error || "Failed to bulk update");
    } finally {
      setUpdating(false);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Reference",
      "Full Name",
      "Email",
      "Phone",
      "City",
      "Experience",
      "Services",
      "Status",
      "Application Date",
    ];

    const rows = applications.map((app) => [
      app.id,
      app.reference_number,
      app.full_name,
      app.email,
      app.phone,
      app.city,
      app.experience_level || "N/A",
      app.services?.join(", ") || "None",
      app.status,
      new Date(app.application_date || app.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maid-applications-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedApps((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedApps.length === applications.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(applications.map((app) => app.id));
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.color || "#666";
  };

  const getStatusIcon = (status) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === status);
    return option?.icon || "📋";
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter applications by search term
  const filteredApplications = applications.filter((app) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      app.full_name.toLowerCase().includes(search) ||
      app.email.toLowerCase().includes(search) ||
      app.phone.includes(search) ||
      app.reference_number.toLowerCase().includes(search)
    );
  });

  // Mobile card view
  const MobileCardView = () => (
    <div className={styles.mobileCards}>
      {filteredApplications.map((app) => (
        <div key={app.id} className={styles.mobileCard}>
          <div className={styles.mobileCardHeader}>
            <input
              type="checkbox"
              checked={selectedApps.includes(app.id)}
              onChange={() => toggleSelect(app.id)}
              className={styles.mobileCheckbox}
            />
            <span className={styles.mobileRef}>{app.reference_number}</span>
            <span
              className={styles.mobileStatus}
              style={{ backgroundColor: getStatusColor(app.status) }}
            >
              {getStatusIcon(app.status)} {app.status}
            </span>
          </div>
          <div className={styles.mobileCardBody}>
            <div className={styles.mobileCardName}>{app.full_name}</div>
            <div className={styles.mobileCardDetails}>
              <div>📧 {app.email}</div>
              <div>📞 {app.phone}</div>
              <div>📍 {app.city}</div>
              <div>📅 {formatDate(app.application_date || app.created_at)}</div>
            </div>
            <div className={styles.mobileCardExperience}>
              ⭐ {app.experience_level || "0"} years experience
            </div>
            {app.services && app.services.length > 0 && (
              <div className={styles.mobileCardServices}>
                {app.services.map((service, i) => (
                  <span key={i} className={styles.serviceTag}>
                    {service}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.mobileCardActions}>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedApplication(app);
                setModalMode("view");
                setShowModal(true);
              }}
            >
              👁️ View
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedApplication(app);
                setStatusUpdate(app.status);
                setModalMode("edit");
                setShowModal(true);
              }}
            >
              📝 Status
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedApplication(app);
                setNotesInput(app.admin_notes || "");
                setModalMode("notes");
                setShowModal(true);
              }}
            >
              📋 Notes
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <div className={styles.header1}>
          <div className={styles.headerTop}>
            {onBack && (
              <button className={styles.backBtn} onClick={onBack}>
                ← Back
              </button>
            )}
          </div>
        </div>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Maid Applications</h1>
            <p className={styles.subtitle}>
              Manage and review all maid applications
            </p>
          </div>
          <div className={styles.headerRight}>
            <button
              className={styles.viewToggleBtn}
              onClick={() =>
                setViewMode(viewMode === "table" ? "cards" : "table")
              }
            >
              {viewMode === "table" ? "📱 Card View" : "📊 Table View"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stats.total || 0}</div>
                  <div className={styles.statLabel}>Total</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏳</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#f0ad4e" }}
                  >
                    {stats.pending || 0}
                  </div>
                  <div className={styles.statLabel}>Pending</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👁️</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5bc0de" }}
                  >
                    {stats.reviewed || 0}
                  </div>
                  <div className={styles.statLabel}>Reviewed</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5cb85c" }}
                  >
                    {stats.approved || 0}
                  </div>
                  <div className={styles.statLabel}>Approved</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎓</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#c9a84c" }}
                  >
                    {stats.onboarded || 0}
                  </div>
                  <div className={styles.statLabel}>Onboarded</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>❌</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#d9534f" }}
                  >
                    {stats.rejected || 0}
                  </div>
                  <div className={styles.statLabel}>Rejected</div>
                </div>
              </div>
            </div>

            {/* City Stats */}
            {cityStats.length > 0 && (
              <div className={styles.cityStats}>
                <p className={styles.cityStatsTitle}>By City</p>
                <div className={styles.cityStatsGrid}>
                  {cityStats.map((item, i) => (
                    <div key={i} className={styles.cityStatItem}>
                      <span className={styles.cityStatLabel}>{item.city}</span>
                      <span className={styles.cityStatCount}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Search and Filters */}
        <div className={styles.filtersBar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, email, phone or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              className={styles.filterSelect}
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>

            <select
              className={styles.filterSelect}
              value={filters.city}
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value, page: 1 })
              }
            >
              <option value="">All Cities</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actionButtons}>
            {selectedApps.length > 0 && (
              <button
                className={styles.bulkButton}
                onClick={() => setShowBulkModal(true)}
              >
                Bulk ({selectedApps.length})
              </button>
            )}
            <button className={styles.exportButton} onClick={exportToCSV}>
              Export
            </button>
            <button
              className={styles.refreshButton}
              onClick={fetchApplications}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className={styles.resultsInfo}>
          <span>
            Showing {filteredApplications.length} of {pagination.total}{" "}
            applications
          </span>
          {selectedApps.length > 0 && (
            <span className={styles.selectedCount}>
              {selectedApps.length} selected
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading applications...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchApplications}>Try Again</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredApplications.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <p>No applications found</p>
            {(filters.status || filters.city || searchTerm) && (
              <button
                className={styles.clearFiltersBtn}
                onClick={() => {
                  setFilters({ status: "", city: "", page: 1, limit: 20 });
                  setSearchTerm("");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Table View (Desktop) */}
        {!loading &&
          !error &&
          filteredApplications.length > 0 &&
          viewMode === "table" && (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          checked={
                            selectedApps.length === applications.length &&
                            applications.length > 0
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Ref</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>City</th>
                      <th>Experience</th>
                      <th>Services</th>
                      <th>Status</th>
                      <th>Applied</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className={styles.tableRow}>
                        <td className={styles.checkboxCell}>
                          <input
                            type="checkbox"
                            checked={selectedApps.includes(app.id)}
                            onChange={() => toggleSelect(app.id)}
                          />
                        </td>
                        <td className={styles.reference}>
                          {app.reference_number}
                        </td>
                        <td className={styles.name}>{app.full_name}</td>
                        <td>
                          <div className={styles.contactInfo}>
                            <div>{app.email}</div>
                            <div className={styles.phone}>{app.phone}</div>
                          </div>
                        </td>
                        <td>{app.city}</td>
                        <td>{app.experience_level || "0"} yrs</td>
                        <td className={styles.services}>
                          {app.services && app.services.length > 0 ? (
                            <div className={styles.serviceTags}>
                              {app.services.slice(0, 2).map((service, i) => (
                                <span key={i} className={styles.serviceTag}>
                                  {service}
                                </span>
                              ))}
                              {app.services.length > 2 && (
                                <span className={styles.serviceTag}>
                                  +{app.services.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            "None"
                          )}
                        </td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: getStatusColor(app.status),
                            }}
                          >
                            {getStatusIcon(app.status)} {app.status}
                          </span>
                        </td>
                        <td>
                          {formatDate(app.application_date || app.created_at)}
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.viewButton}
                              onClick={() => {
                                setSelectedApplication(app);
                                setModalMode("view");
                                setShowModal(true);
                              }}
                              title="View Details"
                            >
                              👁️
                            </button>
                            <button
                              className={styles.editButton}
                              onClick={() => {
                                setSelectedApplication(app);
                                setStatusUpdate(app.status);
                                setModalMode("edit");
                                setShowModal(true);
                              }}
                              title="Update Status"
                            >
                              📝
                            </button>
                            <button
                              className={styles.notesButton}
                              onClick={() => {
                                setSelectedApplication(app);
                                setNotesInput(app.admin_notes || "");
                                setModalMode("notes");
                                setShowModal(true);
                              }}
                              title="Admin Notes"
                            >
                              📋
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => deleteApplication(app.id)}
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageButton}
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setFilters({ ...filters, page: pagination.page - 1 })
                    }
                  >
                    ← Previous
                  </button>
                  <div className={styles.pageNumbers}>
                    {[...Array(Math.min(5, pagination.totalPages))].map(
                      (_, i) => {
                        let pageNum = i + 1;
                        if (pagination.totalPages > 5 && pagination.page > 3) {
                          pageNum = pagination.page - 2 + i;
                          if (pageNum > pagination.totalPages) return null;
                        }
                        return (
                          <button
                            key={pageNum}
                            className={`${styles.pageNumber} ${pagination.page === pageNum ? styles.pageNumberActive : ""}`}
                            onClick={() =>
                              setFilters({ ...filters, page: pageNum })
                            }
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>
                  <button
                    className={styles.pageButton}
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() =>
                      setFilters({ ...filters, page: pagination.page + 1 })
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

        {/* Mobile Card View */}
        {!loading &&
          !error &&
          filteredApplications.length > 0 &&
          viewMode === "cards" && (
            <>
              <MobileCardView />

              {/* Pagination for mobile */}
              {pagination.totalPages > 1 && (
                <div className={styles.mobilePagination}>
                  <button
                    className={styles.mobilePageButton}
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setFilters({ ...filters, page: pagination.page - 1 })
                    }
                  >
                    ← Prev
                  </button>
                  <span className={styles.mobilePageInfo}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    className={styles.mobilePageButton}
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() =>
                      setFilters({ ...filters, page: pagination.page + 1 })
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
      </div>

      {/* View/Edit Modal */}
      {showModal && selectedApplication && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {modalMode === "view" && "Application Details"}
                {modalMode === "edit" && "Update Status"}
                {modalMode === "notes" && "Admin Notes"}
              </h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              {modalMode === "view" && (
                <div className={styles.detailsSection}>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <label>Reference</label>
                      <p>{selectedApplication.reference_number}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Full Name</label>
                      <p>{selectedApplication.full_name}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Email</label>
                      <p>{selectedApplication.email}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Phone</label>
                      <p>{selectedApplication.phone}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>City</label>
                      <p>{selectedApplication.city}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Experience Level</label>
                      <p>{selectedApplication.experience_level || "0"} years</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Status</label>
                      <p>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: getStatusColor(
                              selectedApplication.status,
                            ),
                          }}
                        >
                          {getStatusIcon(selectedApplication.status)}{" "}
                          {selectedApplication.status}
                        </span>
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Application Date</label>
                      <p>
                        {new Date(
                          selectedApplication.application_date ||
                            selectedApplication.created_at,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className={styles.detailItemFull}>
                      <label>Services</label>
                      <div className={styles.serviceTags}>
                        {selectedApplication.services &&
                        selectedApplication.services.length > 0
                          ? selectedApplication.services.map((service, i) => (
                              <span key={i} className={styles.serviceTag}>
                                {service}
                              </span>
                            ))
                          : "None specified"}
                      </div>
                    </div>
                    <div className={styles.detailItemFull}>
                      <label>About the Applicant</label>
                      <p className={styles.messageText}>
                        {selectedApplication.message}
                      </p>
                    </div>
                    {selectedApplication.admin_notes && (
                      <div className={styles.detailItemFull}>
                        <label>Admin Notes</label>
                        <p className={styles.notesText}>
                          {selectedApplication.admin_notes}
                        </p>
                      </div>
                    )}
                    {selectedApplication.reviewed_at && (
                      <div className={styles.detailItem}>
                        <label>Reviewed At</label>
                        <p>
                          {new Date(
                            selectedApplication.reviewed_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {modalMode === "edit" && (
                <div className={styles.editSection}>
                  <div className={styles.formGroup}>
                    <label>Update Status</label>
                    <select
                      className={styles.select}
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Add Note (Optional)</label>
                    <textarea
                      className={styles.textarea}
                      rows={4}
                      placeholder="Add any notes about this decision..."
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {modalMode === "notes" && (
                <div className={styles.notesSection}>
                  <div className={styles.formGroup}>
                    <label>Admin Notes</label>
                    <textarea
                      className={styles.textarea}
                      rows={6}
                      placeholder="Add internal notes about this applicant..."
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              {modalMode === "edit" && (
                <button
                  className={styles.saveButton}
                  onClick={() =>
                    updateStatus(
                      selectedApplication.id,
                      statusUpdate,
                      notesInput,
                    )
                  }
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              )}
              {modalMode === "notes" && (
                <button
                  className={styles.saveButton}
                  onClick={() =>
                    updateNotes(selectedApplication.id, notesInput)
                  }
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Notes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showBulkModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowBulkModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Bulk Update Status</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowBulkModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.bulkInfo}>
                Update status for {selectedApps.length} selected applications
              </p>
              <div className={styles.formGroup}>
                <label>New Status</label>
                <select
                  className={styles.select}
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                >
                  <option value="">Select status...</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowBulkModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                onClick={bulkUpdateStatus}
                disabled={!bulkAction || updating}
              >
                {updating ? "Updating..." : "Apply to All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
