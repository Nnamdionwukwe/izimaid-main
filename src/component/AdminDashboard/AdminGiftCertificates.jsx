// AdminGiftCertificates.jsx
import { useState, useEffect, useCallback } from "react";
import styles from "./AdminGiftCertificates.module.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "#5cb85c", icon: "✅" },
  { value: "redeemed", label: "Redeemed", color: "#5bc0de", icon: "🎯" },
  { value: "expired", label: "Expired", color: "#f0ad4e", icon: "⏰" },
  { value: "cancelled", label: "Cancelled", color: "#d9534f", icon: "❌" },
];

const OCCASION_OPTIONS = [
  "Birthday",
  "Wedding",
  "New Home",
  "New Baby",
  "Work Milestone",
  "Christmas",
  "Valentine's",
  "Mother's Day",
  "Graduation",
  "Get Well",
];

export default function AdminGiftCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [occasionStats, setOccasionStats] = useState([]);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    occasion: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Fetch certificates
  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.occasion) params.append("occasion", filters.occasion);
      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const response = await axios.get(
        `${API_BASE_URL}/api/gift-certificates/certificates?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setCertificates(response.data.certificates);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: Math.ceil(response.data.total / response.data.limit),
        });
      }
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setError(err.response?.data?.error || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/gift-certificates/certificates/stats`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setStats(response.data.stats);
        setOccasionStats(response.data.occasionStats || []);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
    fetchStats();
  }, [fetchCertificates, fetchStats]);

  // Update certificate status
  const updateStatus = async (id, status, notes = null) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/gift-certificates/certificates/${id}/status`,
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchCertificates();
        fetchStats();
        setShowModal(false);
        setSelectedCertificate(null);
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
        `${API_BASE_URL}/api/gift-certificates/certificates/${id}/notes`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchCertificates();
        setShowModal(false);
        setSelectedCertificate(null);
        setNotesInput("");
      }
    } catch (err) {
      console.error("Error updating notes:", err);
      alert(err.response?.data?.error || "Failed to update notes");
    } finally {
      setUpdating(false);
    }
  };

  // Delete certificate
  const deleteCertificate = async (id) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/api/gift-certificates/certificates/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchCertificates();
        fetchStats();
        setShowModal(false);
        setSelectedCertificate(null);
      }
    } catch (err) {
      console.error("Error deleting certificate:", err);
      alert(err.response?.data?.error || "Failed to delete certificate");
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async () => {
    if (!bulkAction || selectedCertificates.length === 0) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/gift-certificates/certificates/bulk/status`,
        { certificateIds: selectedCertificates, status: bulkAction },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        alert(`Updated ${response.data.summary.successCount} certificates`);
        setSelectedCertificates([]);
        setBulkAction("");
        setShowBulkModal(false);
        fetchCertificates();
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
      "Code",
      "Amount",
      "From",
      "To",
      "Email",
      "Occasion",
      "Status",
      "Expires At",
      "Created At",
    ];

    const rows = certificates.map((c) => [
      c.id,
      c.certificate_code,
      Number(c.amount).toLocaleString(),
      c.from_name,
      c.recipient_name,
      c.recipient_email,
      c.occasion || "N/A",
      c.status,
      new Date(c.expires_at).toLocaleDateString(),
      new Date(c.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gift-certificates-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedCertificates((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedCertificates.length === certificates.length) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates(certificates.map((c) => c.id));
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

  // Filter certificates by search term
  const filteredCertificates = certificates.filter((c) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      c.certificate_code.toLowerCase().includes(search) ||
      c.from_name.toLowerCase().includes(search) ||
      c.recipient_name.toLowerCase().includes(search) ||
      c.recipient_email.toLowerCase().includes(search)
    );
  });

  // Mobile card view
  const MobileCardView = () => (
    <div className={styles.mobileCards}>
      {filteredCertificates.map((c) => (
        <div key={c.id} className={styles.mobileCard}>
          <div className={styles.mobileCardHeader}>
            <input
              type="checkbox"
              checked={selectedCertificates.includes(c.id)}
              onChange={() => toggleSelect(c.id)}
              className={styles.mobileCheckbox}
            />
            <span className={styles.mobileCode}>{c.certificate_code}</span>
            <span
              className={styles.mobileStatus}
              style={{ backgroundColor: getStatusColor(c.status) }}
            >
              {getStatusIcon(c.status)} {c.status}
            </span>
          </div>
          <div className={styles.mobileCardBody}>
            <div className={styles.mobileCardAmount}>
              {formatCurrency(c.amount)}
            </div>
            <div className={styles.mobileCardDetails}>
              <div>👤 From: {c.from_name}</div>
              <div>🎯 To: {c.recipient_name}</div>
              <div>📧 {c.recipient_email}</div>
              {c.occasion && <div>🎉 {c.occasion}</div>}
              <div>📅 Expires: {formatDate(c.expires_at)}</div>
            </div>
          </div>
          <div className={styles.mobileCardActions}>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedCertificate(c);
                setModalMode("view");
                setShowModal(true);
              }}
            >
              👁️ View
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedCertificate(c);
                setStatusUpdate(c.status);
                setModalMode("edit");
                setShowModal(true);
              }}
            >
              📝 Status
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedCertificate(c);
                setNotesInput(c.admin_notes || "");
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
            <h1 className={styles.title}>Gift Certificates</h1>
            <p className={styles.subtitle}>
              Manage and review all gift certificates
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
                <div className={styles.statIcon}>🎁</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{stats.total || 0}</div>
                  <div className={styles.statLabel}>Total Certificates</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>💰</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5cb85c" }}
                  >
                    {formatCurrency(stats.active_value || 0)}
                  </div>
                  <div className={styles.statLabel}>Active Value</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📈</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5bc0de" }}
                  >
                    {formatCurrency(stats.avg_value || 0)}
                  </div>
                  <div className={styles.statLabel}>Average Value</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5cb85c" }}
                  >
                    {stats.active || 0}
                  </div>
                  <div className={styles.statLabel}>Active</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5bc0de" }}
                  >
                    {stats.redeemed || 0}
                  </div>
                  <div className={styles.statLabel}>Redeemed</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏰</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#f0ad4e" }}
                  >
                    {stats.expired || 0}
                  </div>
                  <div className={styles.statLabel}>Expired</div>
                </div>
              </div>
            </div>

            {/* Occasion Stats */}
            {occasionStats.length > 0 && (
              <div className={styles.occasionStats}>
                <p className={styles.occasionStatsTitle}>By Occasion</p>
                <div className={styles.occasionStatsGrid}>
                  {occasionStats.slice(0, 6).map((item, i) => (
                    <div key={i} className={styles.occasionStatItem}>
                      <span className={styles.occasionStatLabel}>
                        {item.occasion}
                      </span>
                      <span className={styles.occasionStatCount}>
                        {item.count}
                      </span>
                      <span className={styles.occasionStatTotal}>
                        {formatCurrency(item.total_value)}
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
              placeholder="Search by code, from, to or email..."
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
              value={filters.occasion}
              onChange={(e) =>
                setFilters({ ...filters, occasion: e.target.value, page: 1 })
              }
            >
              <option value="">All Occasions</option>
              {OCCASION_OPTIONS.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actionButtons}>
            {selectedCertificates.length > 0 && (
              <button
                className={styles.bulkButton}
                onClick={() => setShowBulkModal(true)}
              >
                Bulk ({selectedCertificates.length})
              </button>
            )}
            <button className={styles.exportButton} onClick={exportToCSV}>
              Export
            </button>
            <button
              className={styles.refreshButton}
              onClick={fetchCertificates}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className={styles.resultsInfo}>
          <span>
            Showing {filteredCertificates.length} of {pagination.total}{" "}
            certificates
          </span>
          {selectedCertificates.length > 0 && (
            <span className={styles.selectedCount}>
              {selectedCertificates.length} selected
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading certificates...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchCertificates}>Try Again</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCertificates.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎁</div>
            <p>No gift certificates found</p>
            {(filters.status || filters.occasion || searchTerm) && (
              <button
                className={styles.clearFiltersBtn}
                onClick={() => {
                  setFilters({ status: "", occasion: "", page: 1, limit: 20 });
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
          filteredCertificates.length > 0 &&
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
                            selectedCertificates.length ===
                              certificates.length && certificates.length > 0
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Code</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Amount</th>
                      <th>Occasion</th>
                      <th>Status</th>
                      <th>Expires</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCertificates.map((c) => (
                      <tr key={c.id} className={styles.tableRow}>
                        <td className={styles.checkboxCell}>
                          <input
                            type="checkbox"
                            checked={selectedCertificates.includes(c.id)}
                            onChange={() => toggleSelect(c.id)}
                          />
                        </td>
                        <td className={styles.code}>{c.certificate_code}</td>
                        <td>{c.from_name}</td>
                        <td>{c.recipient_name}</td>
                        <td className={styles.amount}>
                          {formatCurrency(c.amount)}
                        </td>
                        <td>{c.occasion || "—"}</td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: getStatusColor(c.status),
                            }}
                          >
                            {getStatusIcon(c.status)} {c.status}
                          </span>
                        </td>
                        <td>{formatDate(c.expires_at)}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.viewButton}
                              onClick={() => {
                                setSelectedCertificate(c);
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
                                setSelectedCertificate(c);
                                setStatusUpdate(c.status);
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
                                setSelectedCertificate(c);
                                setNotesInput(c.admin_notes || "");
                                setModalMode("notes");
                                setShowModal(true);
                              }}
                              title="Admin Notes"
                            >
                              📋
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => deleteCertificate(c.id)}
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
          filteredCertificates.length > 0 &&
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
      {showModal && selectedCertificate && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {modalMode === "view" && "Certificate Details"}
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
                      <label>Certificate Code</label>
                      <p className={styles.codeHighlight}>
                        {selectedCertificate.certificate_code}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Amount</label>
                      <p className={styles.amountHighlight}>
                        {formatCurrency(selectedCertificate.amount)}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>From</label>
                      <p>{selectedCertificate.from_name}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>To</label>
                      <p>{selectedCertificate.recipient_name}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Recipient Email</label>
                      <p>{selectedCertificate.recipient_email}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Occasion</label>
                      <p>{selectedCertificate.occasion || "Not specified"}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Status</label>
                      <p>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: getStatusColor(
                              selectedCertificate.status,
                            ),
                          }}
                        >
                          {getStatusIcon(selectedCertificate.status)}{" "}
                          {selectedCertificate.status}
                        </span>
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Delivery Date</label>
                      <p>
                        {selectedCertificate.delivery_date
                          ? formatDate(selectedCertificate.delivery_date)
                          : "Not set"}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Expires At</label>
                      <p>{formatDate(selectedCertificate.expires_at)}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Created At</label>
                      <p>
                        {new Date(
                          selectedCertificate.created_at,
                        ).toLocaleString()}
                      </p>
                    </div>
                    {selectedCertificate.redeemed_at && (
                      <div className={styles.detailItem}>
                        <label>Redeemed At</label>
                        <p>
                          {new Date(
                            selectedCertificate.redeemed_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                    {selectedCertificate.message && (
                      <div className={styles.detailItemFull}>
                        <label>Message</label>
                        <p className={styles.messageText}>
                          {selectedCertificate.message}
                        </p>
                      </div>
                    )}
                    {selectedCertificate.admin_notes && (
                      <div className={styles.detailItemFull}>
                        <label>Admin Notes</label>
                        <p className={styles.notesText}>
                          {selectedCertificate.admin_notes}
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
                      placeholder="Add internal notes about this certificate..."
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
                      selectedCertificate.id,
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
                    updateNotes(selectedCertificate.id, notesInput)
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
                Update status for {selectedCertificates.length} selected
                certificates
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
