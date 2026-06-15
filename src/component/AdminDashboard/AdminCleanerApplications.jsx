// AdminCleanerApplications.jsx
import { useState, useEffect } from "react";
import styles from "./AdminCleanerApplications.module.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#f0ad4e" },
  { value: "reviewed", label: "Reviewed", color: "#5bc0de" },
  { value: "accepted", label: "Accepted", color: "#5cb85c" },
  { value: "rejected", label: "Rejected", color: "#d9534f" },
  { value: "enrolled", label: "Enrolled", color: "#c9a84c" },
];

const TRACK_OPTIONS = [
  "Home Cleaning Professional",
  "Commercial & Office Cleaning",
  "Deep Cleaning Specialist",
  "Post-Construction Cleaning",
  "Kitchen & Hospitality Cleaning",
  "Childcare & Elderly Home Cleaning",
  "Not sure — recommend one for me",
];

const CITIES = ["Abuja", "Lagos"];

export default function AdminCleanerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedApps, setSelectedApps] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    city: "",
    track: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view, edit, notes
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.city) params.append("city", filters.city);
      if (filters.track) params.append("track", filters.track);
      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const response = await axios.get(
        `${API_BASE_URL}/api/cleaner-training/applications?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setApplications(response.data.applications);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        });
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.response?.data?.error || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/cleaner-training/applications/stats`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filters]);

  // Update application status
  const updateStatus = async (id, status, notes = null) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/cleaner-training/applications/${id}/status`,
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
        `${API_BASE_URL}/api/cleaner-training/applications/${id}/notes`,
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
        `${API_BASE_URL}/api/cleaner-training/applications/${id}`,
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
        `${API_BASE_URL}/api/cleaner-training/applications/bulk/status`,
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
      "Full Name",
      "Email",
      "Phone",
      "City",
      "Track",
      "Experience",
      "Status",
      "Application Date",
      "Reference",
    ];

    const rows = applications.map((app) => [
      app.id,
      app.full_name,
      app.email,
      app.phone,
      app.city,
      app.preferred_track,
      app.experience_level || "N/A",
      app.status,
      new Date(app.application_date).toLocaleDateString(),
      app.reference_number,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cleaner-applications-${new Date().toISOString().split("T")[0]}.csv`;
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

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Cleaner Training Applications</h1>
          <p className={styles.subtitle}>Manage and review all applications</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.total || 0}</div>
              <div className={styles.statLabel}>Total Applications</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: "#f0ad4e" }}>
                {stats.pending || 0}
              </div>
              <div className={styles.statLabel}>Pending</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: "#5bc0de" }}>
                {stats.reviewed || 0}
              </div>
              <div className={styles.statLabel}>Reviewed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: "#5cb85c" }}>
                {stats.accepted || 0}
              </div>
              <div className={styles.statLabel}>Accepted</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: "#c9a84c" }}>
                {stats.enrolled || 0}
              </div>
              <div className={styles.statLabel}>Enrolled</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: "#d9534f" }}>
                {stats.rejected || 0}
              </div>
              <div className={styles.statLabel}>Rejected</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filtersBar}>
          <div className={styles.filtersLeft}>
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
                  {opt.label}
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

            <select
              className={styles.filterSelect}
              value={filters.track}
              onChange={(e) =>
                setFilters({ ...filters, track: e.target.value, page: 1 })
              }
            >
              <option value="">All Tracks</option>
              {TRACK_OPTIONS.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filtersRight}>
            {selectedApps.length > 0 && (
              <button
                className={styles.bulkButton}
                onClick={() => setShowBulkModal(true)}
              >
                Bulk Actions ({selectedApps.length})
              </button>
            )}
            <button className={styles.exportButton} onClick={exportToCSV}>
              Export CSV
            </button>
            <button
              className={styles.refreshButton}
              onClick={fetchApplications}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading applications...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchApplications}>Try Again</button>
          </div>
        ) : applications.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No applications found</p>
          </div>
        ) : (
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
                    <th>Ref #</th>
                    <th>Full Name</th>
                    <th>Contact</th>
                    <th>City</th>
                    <th>Track</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
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
                      <td className={styles.track}>{app.preferred_track}</td>
                      <td>{app.experience_level || "N/A"}</td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: getStatusColor(app.status),
                          }}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>{formatDate(app.application_date)}</td>
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
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                disabled={pagination.page === 1}
                onClick={() =>
                  setFilters({ ...filters, page: pagination.page - 1 })
                }
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {pagination.page} of{" "}
                {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                className={styles.pageButton}
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.limit)
                }
                onClick={() =>
                  setFilters({ ...filters, page: pagination.page + 1 })
                }
              >
                Next
              </button>
            </div>
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
                      <label>Reference Number</label>
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
                      <label>Preferred Track</label>
                      <p>{selectedApplication.preferred_track}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Experience Level</label>
                      <p>
                        {selectedApplication.experience_level ||
                          "Not specified"}
                      </p>
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
                          {selectedApplication.status}
                        </span>
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Application Date</label>
                      <p>
                        {new Date(
                          selectedApplication.application_date,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Availability</label>
                      <div className={styles.availabilityTags}>
                        {selectedApplication.availability?.map((slot, i) => (
                          <span key={i} className={styles.availabilityTag}>
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.detailItemFull}>
                      <label>Motivation</label>
                      <p className={styles.motivationText}>
                        {selectedApplication.motivation}
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
                          {opt.label}
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
              <p>
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
                      {opt.label}
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
