// AdminContactUs.jsx
import { useState, useEffect, useCallback } from "react";
import styles from "./AdminContactUs.module.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "#f0ad4e", icon: "🆕" },
  { value: "read", label: "Read", color: "#5bc0de", icon: "👁️" },
  { value: "replied", label: "Replied", color: "#5cb85c", icon: "✉️" },
  { value: "resolved", label: "Resolved", color: "#c9a84c", icon: "✅" },
  { value: "archived", label: "Archived", color: "#8b8a9c", icon: "📦" },
];

const SUBJECT_OPTIONS = [
  "General Enquiry",
  "Request a Quote",
  "Complaint",
  "Partnership",
  "Other",
];

export default function AdminContactUs({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [subjectStats, setSubjectStats] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    subject: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [bulkAction, setBulkAction] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.subject) params.append("subject", filters.subject);
      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const response = await axios.get(
        `${API_BASE_URL}/api/contact/messages?${params}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setMessages(response.data.messages);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: Math.ceil(response.data.total / response.data.limit),
        });
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.response?.data?.error || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/contact/messages/stats`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setStats(response.data.stats);
        setSubjectStats(response.data.subjectStats || []);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  // Update message status
  const updateStatus = async (id, status, notes = null) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/api/contact/messages/${id}/status`,
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchMessages();
        fetchStats();
        setShowModal(false);
        setSelectedMessage(null);
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
        `${API_BASE_URL}/api/contact/messages/${id}/notes`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchMessages();
        setShowModal(false);
        setSelectedMessage(null);
        setNotesInput("");
      }
    } catch (err) {
      console.error("Error updating notes:", err);
      alert(err.response?.data?.error || "Failed to update notes");
    } finally {
      setUpdating(false);
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/api/contact/messages/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        fetchMessages();
        fetchStats();
        setShowModal(false);
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      alert(err.response?.data?.error || "Failed to delete message");
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async () => {
    if (!bulkAction || selectedMessages.length === 0) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/api/contact/messages/bulk/status`,
        { messageIds: selectedMessages, status: bulkAction },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        alert(`Updated ${response.data.summary.successCount} messages`);
        setSelectedMessages([]);
        setBulkAction("");
        setShowBulkModal(false);
        fetchMessages();
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
      "Subject",
      "Message",
      "Status",
      "Admin Notes",
      "Created At",
    ];

    const rows = messages.map((msg) => [
      msg.id,
      msg.reference_number,
      msg.full_name,
      msg.email,
      msg.phone || "N/A",
      msg.subject,
      msg.message,
      msg.status,
      msg.admin_notes || "N/A",
      new Date(msg.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-messages-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map((msg) => msg.id));
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

  // Filter messages by search term
  const filteredMessages = messages.filter((msg) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      msg.full_name.toLowerCase().includes(search) ||
      msg.email.toLowerCase().includes(search) ||
      msg.phone?.includes(search) ||
      msg.reference_number.toLowerCase().includes(search) ||
      msg.subject.toLowerCase().includes(search)
    );
  });

  // Mobile card view
  const MobileCardView = () => (
    <div className={styles.mobileCards}>
      {filteredMessages.map((msg) => (
        <div key={msg.id} className={styles.mobileCard}>
          <div className={styles.mobileCardHeader}>
            <input
              type="checkbox"
              checked={selectedMessages.includes(msg.id)}
              onChange={() => toggleSelect(msg.id)}
              className={styles.mobileCheckbox}
            />
            <span className={styles.mobileRef}>{msg.reference_number}</span>
            <span
              className={styles.mobileStatus}
              style={{ backgroundColor: getStatusColor(msg.status) }}
            >
              {getStatusIcon(msg.status)} {msg.status}
            </span>
          </div>
          <div className={styles.mobileCardBody}>
            <div className={styles.mobileCardName}>{msg.full_name}</div>
            <div className={styles.mobileCardDetails}>
              <div>📧 {msg.email}</div>
              {msg.phone && <div>📞 {msg.phone}</div>}
              <div>📋 {msg.subject}</div>
              <div>📅 {formatDate(msg.created_at)}</div>
            </div>
            <div className={styles.mobileCardMessage}>{msg.message}</div>
          </div>
          <div className={styles.mobileCardActions}>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedMessage(msg);
                setModalMode("view");
                setShowModal(true);
              }}
            >
              👁️ View
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedMessage(msg);
                setStatusUpdate(msg.status);
                setModalMode("edit");
                setShowModal(true);
              }}
            >
              📝 Status
            </button>
            <button
              className={styles.mobileActionBtn}
              onClick={() => {
                setSelectedMessage(msg);
                setNotesInput(msg.admin_notes || "");
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
            <h1 className={styles.title}>Contact Messages</h1>
            <p className={styles.subtitle}>
              Manage and review all contact form submissions
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
                <div className={styles.statIcon}>🆕</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#f0ad4e" }}
                  >
                    {stats.new || 0}
                  </div>
                  <div className={styles.statLabel}>New</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👁️</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5bc0de" }}
                  >
                    {stats.read || 0}
                  </div>
                  <div className={styles.statLabel}>Read</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✉️</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#5cb85c" }}
                  >
                    {stats.replied || 0}
                  </div>
                  <div className={styles.statLabel}>Replied</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#c9a84c" }}
                  >
                    {stats.resolved || 0}
                  </div>
                  <div className={styles.statLabel}>Resolved</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📦</div>
                <div className={styles.statInfo}>
                  <div
                    className={styles.statValue}
                    style={{ color: "#8b8a9c" }}
                  >
                    {stats.archived || 0}
                  </div>
                  <div className={styles.statLabel}>Archived</div>
                </div>
              </div>
            </div>

            {/* Subject Stats */}
            {subjectStats.length > 0 && (
              <div className={styles.subjectStats}>
                <p className={styles.subjectStatsTitle}>By Subject</p>
                <div className={styles.subjectStatsGrid}>
                  {subjectStats.map((item, i) => (
                    <div key={i} className={styles.subjectStatItem}>
                      <span className={styles.subjectStatLabel}>
                        {item.subject}
                      </span>
                      <span className={styles.subjectStatCount}>
                        {item.count}
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
              placeholder="Search by name, email, phone, subject or reference..."
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
              value={filters.subject}
              onChange={(e) =>
                setFilters({ ...filters, subject: e.target.value, page: 1 })
              }
            >
              <option value="">All Subjects</option>
              {SUBJECT_OPTIONS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actionButtons}>
            {selectedMessages.length > 0 && (
              <button
                className={styles.bulkButton}
                onClick={() => setShowBulkModal(true)}
              >
                Bulk ({selectedMessages.length})
              </button>
            )}
            <button className={styles.exportButton} onClick={exportToCSV}>
              Export
            </button>
            <button className={styles.refreshButton} onClick={fetchMessages}>
              Refresh
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className={styles.resultsInfo}>
          <span>
            Showing {filteredMessages.length} of {pagination.total} messages
          </span>
          {selectedMessages.length > 0 && (
            <span className={styles.selectedCount}>
              {selectedMessages.length} selected
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading messages...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchMessages}>Try Again</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMessages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <p>No messages found</p>
            {(filters.status || filters.subject || searchTerm) && (
              <button
                className={styles.clearFiltersBtn}
                onClick={() => {
                  setFilters({ status: "", subject: "", page: 1, limit: 20 });
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
          filteredMessages.length > 0 &&
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
                            selectedMessages.length === messages.length &&
                            messages.length > 0
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Ref</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Received</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((msg) => (
                      <tr key={msg.id} className={styles.tableRow}>
                        <td className={styles.checkboxCell}>
                          <input
                            type="checkbox"
                            checked={selectedMessages.includes(msg.id)}
                            onChange={() => toggleSelect(msg.id)}
                          />
                        </td>
                        <td className={styles.reference}>
                          {msg.reference_number}
                        </td>
                        <td className={styles.name}>{msg.full_name}</td>
                        <td>
                          <div className={styles.contactInfo}>
                            <div>{msg.email}</div>
                            {msg.phone && (
                              <div className={styles.phone}>{msg.phone}</div>
                            )}
                          </div>
                        </td>
                        <td className={styles.subject}>{msg.subject}</td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: getStatusColor(msg.status),
                            }}
                          >
                            {getStatusIcon(msg.status)} {msg.status}
                          </span>
                        </td>
                        <td>{formatDate(msg.created_at)}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.viewButton}
                              onClick={() => {
                                setSelectedMessage(msg);
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
                                setSelectedMessage(msg);
                                setStatusUpdate(msg.status);
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
                                setSelectedMessage(msg);
                                setNotesInput(msg.admin_notes || "");
                                setModalMode("notes");
                                setShowModal(true);
                              }}
                              title="Admin Notes"
                            >
                              📋
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => deleteMessage(msg.id)}
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
          filteredMessages.length > 0 &&
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
      {showModal && selectedMessage && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {modalMode === "view" && "Message Details"}
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
                      <p>{selectedMessage.reference_number}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Full Name</label>
                      <p>{selectedMessage.full_name}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Email</label>
                      <p>{selectedMessage.email}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Phone</label>
                      <p>{selectedMessage.phone || "Not provided"}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Subject</label>
                      <p>{selectedMessage.subject}</p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Status</label>
                      <p>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: getStatusColor(
                              selectedMessage.status,
                            ),
                          }}
                        >
                          {getStatusIcon(selectedMessage.status)}{" "}
                          {selectedMessage.status}
                        </span>
                      </p>
                    </div>
                    <div className={styles.detailItem}>
                      <label>Received</label>
                      <p>
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                    {selectedMessage.replied_at && (
                      <div className={styles.detailItem}>
                        <label>Replied At</label>
                        <p>
                          {new Date(
                            selectedMessage.replied_at,
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div className={styles.detailItemFull}>
                      <label>Message</label>
                      <p className={styles.messageText}>
                        {selectedMessage.message}
                      </p>
                    </div>
                    {selectedMessage.admin_notes && (
                      <div className={styles.detailItemFull}>
                        <label>Admin Notes</label>
                        <p className={styles.notesText}>
                          {selectedMessage.admin_notes}
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
                      placeholder="Add any notes about this message..."
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
                      placeholder="Add internal notes about this message..."
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
                    updateStatus(selectedMessage.id, statusUpdate, notesInput)
                  }
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              )}
              {modalMode === "notes" && (
                <button
                  className={styles.saveButton}
                  onClick={() => updateNotes(selectedMessage.id, notesInput)}
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
                Update status for {selectedMessages.length} selected messages
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
