// AdminFoundation.jsx
import { useState, useEffect, useCallback } from "react";
import styles from "./AdminFoundation.module.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#f0ad4e", icon: "⏳" },
  { value: "completed", label: "Completed", color: "#5cb85c", icon: "✅" },
  { value: "failed", label: "Failed", color: "#d9534f", icon: "❌" },
  { value: "refunded", label: "Refunded", color: "#8b8a9c", icon: "↩️" },
];

const DONATION_TYPE_OPTIONS = [
  { value: "once", label: "One-time" },
  { value: "monthly", label: "Monthly" },
];

export default function AdminFoundation() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [selectedDonations, setSelectedDonations] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    donationType: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Fetch donations
  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.donationType)
        params.append("donationType", filters.donationType);
      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const response = await axios.get(
        `${API_BASE_URL}/api/foundation/donations?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setDonations(response.data.donations);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: Math.ceil(response.data.total / response.data.limit),
        });
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
      setError(err.response?.data?.error || "Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/foundation/donations/stats`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setStats(response.data.stats);
        setMonthlyStats(response.data.monthlyStats || []);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, [fetchDonations, fetchStats]);

  // Update donation status
  const updateStatus = async (id, status, notes = null) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/foundation/donations/${id}/status`,
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchDonations();
        fetchStats();
        setShowModal(false);
        setSelectedDonation(null);
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
        `${API_BASE_URL}/api/foundation/donations/${id}/notes`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchDonations();
        setShowModal(false);
        setSelectedDonation(null);
        setNotesInput("");
      }
    } catch (err) {
      console.error("Error updating notes:", err);
      alert(err.response?.data?.error || "Failed to update notes");
    } finally {
      setUpdating(false);
    }
  };

  // Delete donation
  const deleteDonation = async (id) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/api/foundation/donations/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchDonations();
        fetchStats();
        setShowModal(false);
        setSelectedDonation(null);
      }
    } catch (err) {
      console.error("Error deleting donation:", err);
      alert(err.response?.data?.error || "Failed to delete donation");
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async () => {
    if (!bulkAction || selectedDonations.length === 0) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/foundation/donations/bulk/status`,
        { donationIds: selectedDonations, status: bulkAction },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        alert(`Updated ${response.data.summary.successCount} donations`);
        setSelectedDonations([]);
        setBulkAction("");
        setShowBulkModal(false);
        fetchDonations();
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
      "Donor Name",
      "Donor Email",
      "Amount",
      "Type",
      "Status",
      "Payment Method",
      "Created At",
    ];

    const rows = donations.map((d) => [
      d.id,
      d.payment_reference || "N/A",
      d.donor_name,
      d.donor_email,
      Number(d.amount).toLocaleString(),
      d.donation_type || "once",
      d.status,
      d.payment_method || "N/A",
      new Date(d.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foundation-donations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedDonations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedDonations.length === donations.length) {
      setSelectedDonations([]);
    } else {
      setSelectedDonations(donations.map((d) => d.id));
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

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString()}`;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter donations by search term
  const filteredDonations = donations.filter((d) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      d.donor_name.toLowerCase().includes(search) ||
      d.donor_email.toLowerCase().includes(search) ||
      d.payment_reference?.toLowerCase().includes(search)
    );
  });

  // Mobile card view
  const MobileCardView = () => (
    <div className={styles.mobileCards}>
      {filteredDonations.map((d) => (
        <div key={d.id} className={styles.mobileCard}>
          <div className={styles.mobileCardHeader}>
            <input
              type="checkbox"
              checked={selectedDonations.includes(d.id)}
              onChange={() => toggleSelect(d.id)}
              className={styles.mobileCheckbox}
            />
            <span className={styles.mobileRef}>
              {d.payment_reference || "N/A"}
            </span>
            <span
              className={styles.mobileStatus}
              style={{ backgroundColor: getStatusColor(d.status) }}
            >
              {getStatusIcon(d.status)} {d.status}
            </span>
          </div>
          <div className={styles.mobileCardBody}>
            <div className={styles.mobileCardName}>{d.donor_name}</div>
            <div className={styles.mobileCardDetails}>
              <div>📧 {d.donor_email}</div>
              <div>💰 {formatCurrency(d.amount)}</div>
              <div>📋 {d.donation_type || "once"}</div>
              <div>📅 {formatDate(d.created_at)}</div>
            </div>
            {d.donor_message && (
              <div className={styles.mobileCardMessage}>
                💬 {d.donor_message}
              </div>
            )}
          </div>
          <div className={styles.mobileCardActions}>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedDonation(d);
                setModalMode("view");
                setShowModal(true);
              }}
            >
              👁️ View
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedDonation(d);
                setStatusUpdate(d.status);
                setModalMode("edit");
                setShowModal(true);
              }}
            >
              📝 Status
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedDonation(d);
                setNotesInput(d.admin_notes || "");
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
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Foundation Donations</h1>
            <p className={styles.subtitle}>
              Manage and review all foundation donations
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
                  <div className={styles.statLabel}>Total Donations</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5cb85c" }}
                  >
                    {formatCurrency(stats.total_raised || 0)}
                  </div>
                  <div className={styles.statLabel}>Total Raised</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📈</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5bc0de" }}
                  >
                    {formatCurrency(stats.avg_donation || 0)}
                  </div>
                  <div className={styles.statLabel}>Average Donation</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔄</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#c9a84c" }}
                  >
                    {stats.monthly_donors || 0}
                  </div>
                  <div className={styles.statLabel}>Monthly Donors</div>
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
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5cb85c" }}
                  >
                    {stats.completed || 0}
                  </div>
                  <div className={styles.statLabel}>Completed</div>
                </div>
              </div>
            </div>

            {/* Monthly Stats */}
            {monthlyStats.length > 0 && (
              <div className={styles.monthlyStats}>
                <p className={styles.monthlyStatsTitle}>Monthly Donations</p>
                <div className={styles.monthlyStatsGrid}>
                  {monthlyStats.slice(0, 6).map((item, i) => (
                    <div key={i} className={styles.monthlyStatItem}>
                      <span className={styles.monthlyStatMonth}>
                        {new Date(item.month).toLocaleDateString("en-NG", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className={styles.monthlyStatCount}>
                        {item.count} donations
                      </span>
                      <span className={styles.monthlyStatTotal}>
                        {formatCurrency(item.total)}
                      </span>
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
              placeholder="Search by donor name, email or reference..."
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
              value={filters.donationType}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  donationType: e.target.value,
                  page: 1,
                })
              }
            >
              <option value="">All Types</option>
              {DONATION_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actionButtons}>
            {selectedDonations.length > 0 && (
              <button
                className={styles.bulkButton}
                onClick={() => setShowBulkModal(true)}
              >
                Bulk ({selectedDonations.length})
              </button>
            )}
            <button className={styles.exportButton} onClick={exportToCSV}>
              Export
            </button>
            <button className={styles.refreshButton} onClick={fetchDonations}>
              Refresh
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className={styles.resultsInfo}>
          <span>
            Showing {filteredDonations.length} of {pagination.total} donations
          </span>
          {selectedDonations.length > 0 && (
            <span className={styles.selectedCount}>
              {selectedDonations.length} selected
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading donations...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchDonations}>Try Again</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredDonations.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💚</div>
            <p>No donations found</p>
            {(filters.status || filters.donationType || searchTerm) && (
              <button
                className={styles.clearFiltersBtn}
                onClick={() => {
                  setFilters({
                    status: "",
                    donationType: "",
                    page: 1,
                    limit: 20,
                  });
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
          filteredDonations.length > 0 &&
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
                            selectedDonations.length === donations.length &&
                            donations.length > 0
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Ref</th>
                      <th>Donor</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((d) => (
                      <tr key={d.id} className={styles.tableRow}>
                        <td className={styles.checkboxCell}>
                          <input
                            type="checkbox"
                            checked={selectedDonations.includes(d.id)}
                            onChange={() => toggleSelect(d.id)}
                          />
                        </td>
                        <td className={styles.reference}>
                          {d.payment_reference || "N/A"}
                        </td>
                        <td>
                          <div className={styles.contactInfo}>
                            <div className={styles.name}>{d.donor_name}</div>
                            <div className={styles.email}>{d.donor_email}</div>
                          </div>
                        </td>
                        <td className={styles.amount}>
                          {formatCurrency(d.amount)}
                        </td>
                        <td>{d.donation_type || "once"}</td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: getStatusColor(d.status),
                            }}
                          >
                            {getStatusIcon(d.status)} {d.status}
                          </span>
                        </td>
                        <td>{formatDate(d.created_at)}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.viewButton}
                              onClick={() => {
                                setSelectedDonation(d);
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
                                setSelectedDonation(d);
                                setStatusUpdate(d.status);
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
                                setSelectedDonation(d);
                                setNotesInput(d.admin_notes || "");
                                setModalMode("notes");
                                setShowModal(true);
                              }}
                              title="Admin Notes"
                            >
                              📋
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => deleteDonation(d.id)}
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
          filteredDonations.length > 0 &&
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
      {showModal && selectedDonation && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {modalMode === "view" && "Donation Details"}
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
                      <p>{selectedDonation.payment_reference || "N/A"}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Donor Name</label>
                      <p>{selectedDonation.donor_name}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Donor Email</label>
                      <p>{selectedDonation.donor_email}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Amount</label>
                      <p className={styles.amountHighlight}>
                        {formatCurrency(selectedDonation.amount)}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Donation Type</label>
                      <p>{selectedDonation.donation_type || "once"}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Payment Method</label>
                      <p>{selectedDonation.payment_method || "N/A"}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Status</label>
                      <p>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: getStatusColor(
                              selectedDonation.status,
                            ),
                          }}
                        >
                          {getStatusIcon(selectedDonation.status)}{" "}
                          {selectedDonation.status}
                        </span>
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Transaction ID</label>
                      <p>{selectedDonation.transaction_id || "N/A"}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Created</label>
                      <p>
                        {new Date(selectedDonation.created_at).toLocaleString()}
                      </p>
                    </div>
                    {selectedDonation.completed_at && (
                      <div className={styles.detailItem}>
                        <label>Completed</label>
                        <p>
                          {new Date(
                            selectedDonation.completed_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedDonation.donor_message && (
                      <div className={styles.detailItemFull}>
                        <label>Donor Message</label>
                        <p className={styles.messageText}>
                          {selectedDonation.donor_message}
                        </p>
                      </div>
                    )}
                    {selectedDonation.admin_notes && (
                      <div className={styles.detailItemFull}>
                        <label>Admin Notes</label>
                        <p className={styles.notesText}>
                          {selectedDonation.admin_notes}
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
                      placeholder="Add internal notes about this donation..."
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
                    updateStatus(selectedDonation.id, statusUpdate, notesInput)
                  }
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              )}
              {modalMode === "notes" && (
                <button
                  className={styles.saveButton}
                  onClick={() => updateNotes(selectedDonation.id, notesInput)}
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
                Update status for {selectedDonations.length} selected donations
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
