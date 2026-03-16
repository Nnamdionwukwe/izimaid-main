import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Edit2,
  Eye,
  Star,
  MapPin,
  Clock,
  Zap,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import "./AdminMaidDashboard.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminMaidDashboard() {
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaid, setSelectedMaid] = useState(null);
  const [editingMaid, setEditingMaid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterService, setFilterService] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [view, setView] = useState("list"); // "list", "detail", "edit"
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Helper function to safely convert to number
  const toNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Helper function to format rating
  const formatRating = (rating) => {
    return toNumber(rating, 0).toFixed(1);
  };

  // Fetch maids list
  useEffect(() => {
    fetchMaids();
  }, [page, filterLocation, filterService, sortBy]);

  const fetchMaids = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: pageSize,
      });

      if (filterLocation) params.append("location", filterLocation);
      if (filterService) params.append("service", filterService);

      const response = await fetch(`${API_BASE}/api/maids?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      // Ensure numeric fields are numbers
      const processedMaids = (data.maids || []).map((maid) => ({
        ...maid,
        rating: toNumber(maid.rating, 0),
        hourly_rate: toNumber(maid.hourly_rate, 0),
        years_exp: toNumber(maid.years_exp, 0),
        total_reviews: toNumber(maid.total_reviews, 0),
      }));
      setMaids(processedMaids);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching maids:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaidDetails = async (maidId) => {
    try {
      const response = await fetch(`${API_BASE}/api/maids/${maidId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      const maid = {
        ...data.maid,
        rating: toNumber(data.maid.rating, 0),
        hourly_rate: toNumber(data.maid.hourly_rate, 0),
        years_exp: toNumber(data.maid.years_exp, 0),
        total_reviews: toNumber(data.maid.total_reviews, 0),
      };
      setSelectedMaid(maid);
      setView("detail");
      fetchMaidReviews(maidId);
    } catch (error) {
      console.error("Error fetching maid details:", error);
    }
  };

  const fetchMaidReviews = async (maidId) => {
    setLoadingReviews(true);
    try {
      const response = await fetch(`${API_BASE}/api/maids/${maidId}/reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleEditClick = (maid) => {
    setEditingMaid({ ...maid });
    setView("edit");
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/maids/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...editingMaid,
          hourly_rate: toNumber(editingMaid.hourly_rate),
          years_exp: toNumber(editingMaid.years_exp),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const updatedMaid = {
          ...data.profile,
          rating: toNumber(data.profile.rating, 0),
          hourly_rate: toNumber(data.profile.hourly_rate, 0),
          years_exp: toNumber(data.profile.years_exp, 0),
          total_reviews: toNumber(data.profile.total_reviews, 0),
        };
        setSelectedMaid(updatedMaid);
        setEditingMaid(null);
        setView("detail");
        fetchMaids();
      } else {
        alert("Error updating profile: " + data.error);
      }
    } catch (error) {
      console.error("Error saving edit:", error);
      alert("Error saving changes");
    }
  };

  const toggleAvailability = async (maidId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/maids/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ is_available: !currentStatus }),
      });

      if (response.ok) {
        fetchMaids();
        if (selectedMaid?.id === maidId) {
          fetchMaidDetails(maidId);
        }
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const filteredMaids = maids.filter((maid) =>
    maid.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedMaids = [...filteredMaids].sort((a, b) => {
    if (sortBy === "rating") return toNumber(b.rating) - toNumber(a.rating);
    if (sortBy === "rate")
      return toNumber(b.hourly_rate) - toNumber(a.hourly_rate);
    return 0;
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Maid Management</h1>
            <p>Manage and monitor all maid profiles and performance</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <p className="stat-label">Total Maids</p>
              <p className="stat-value">{total}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Active Today</p>
              <p className="stat-value">
                {maids.filter((m) => m.is_available).length}
              </p>
            </div>
          </div>
        </div>

        {view === "list" && (
          <>
            {/* Filters */}
            <div className="filters-section">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={filterLocation}
                onChange={(e) => {
                  setFilterLocation(e.target.value);
                  setPage(1);
                }}
                className="filter-select"
              >
                <option value="">All Locations</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
              </select>

              <select
                value={filterService}
                onChange={(e) => {
                  setFilterService(e.target.value);
                  setPage(1);
                }}
                className="filter-select"
              >
                <option value="">All Services</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="deep_clean">Deep Clean</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="rating">Sort by Rating</option>
                <option value="rate">Sort by Rate</option>
              </select>
            </div>

            {/* Maids Table */}
            <div className="maids-section">
              {loading ? (
                <div className="loading">Loading maids...</div>
              ) : sortedMaids.length === 0 ? (
                <div className="no-data">No maids found</div>
              ) : (
                <>
                  <div className="table-wrapper">
                    <table className="maids-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Location</th>
                          <th>Rating</th>
                          <th>Rate/hr</th>
                          <th>Experience</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedMaids.map((maid) => (
                          <tr key={maid.id} className="maid-row">
                            <td className="name-cell">
                              <img
                                src={maid.avatar || "/avatar-placeholder.png"}
                                alt={maid.name}
                              />
                              <div>
                                <p className="maid-name">
                                  {maid.name || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td>
                              <div className="location-cell">
                                <MapPin size={16} />
                                {maid.location || "N/A"}
                              </div>
                            </td>
                            <td>
                              <div className="rating-cell">
                                <Star size={16} className="star" />
                                <span>{formatRating(maid.rating)}</span>
                                <span className="review-count">
                                  ({toNumber(maid.total_reviews)})
                                </span>
                              </div>
                            </td>
                            <td>
                              <p className="rate">
                                ₦{toNumber(maid.hourly_rate).toLocaleString()}
                                /hr
                              </p>
                            </td>
                            <td>
                              <p className="experience">
                                {toNumber(maid.years_exp)} yrs
                              </p>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${maid.is_available ? "available" : "unavailable"}`}
                              >
                                {maid.is_available
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <button
                                className="btn-icon view-btn"
                                onClick={() => fetchMaidDetails(maid.id)}
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                className="btn-icon edit-btn"
                                onClick={() => handleEditClick(maid)}
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="pagination">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="pagination-btn"
                    >
                      <ArrowUp size={16} /> Previous
                    </button>
                    <span className="page-info">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="pagination-btn"
                    >
                      Next <ArrowDown size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {view === "detail" && selectedMaid && (
          <div className="detail-view">
            <button className="back-btn" onClick={() => setView("list")}>
              ← Back to List
            </button>

            <div className="detail-container">
              <div className="detail-header">
                <div className="detail-profile">
                  <img
                    src={selectedMaid.avatar || "/avatar-placeholder.png"}
                    alt={selectedMaid.name}
                  />
                  <div className="profile-info">
                    <h2>{selectedMaid.name || "N/A"}</h2>
                    <p className="location-text">
                      <MapPin size={16} /> {selectedMaid.location || "N/A"}
                    </p>
                    <p className="member-since">
                      Member since{" "}
                      {selectedMaid.member_since
                        ? new Date(
                            selectedMaid.member_since,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="detail-actions">
                  <button
                    className={`btn-availability ${selectedMaid.is_available ? "available" : "unavailable"}`}
                    onClick={() =>
                      toggleAvailability(
                        selectedMaid.id,
                        selectedMaid.is_available,
                      )
                    }
                  >
                    <Zap size={18} />
                    {selectedMaid.is_available
                      ? "Mark Unavailable"
                      : "Mark Available"}
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => handleEditClick(selectedMaid)}
                  >
                    <Edit2 size={18} /> Edit Profile
                  </button>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <h3>Performance</h3>
                  <div className="performance-metrics">
                    <div className="metric">
                      <p className="metric-label">Rating</p>
                      <p className="metric-value">
                        <Star className="star" size={20} />
                        {formatRating(selectedMaid.rating)}
                      </p>
                    </div>
                    <div className="metric">
                      <p className="metric-label">Reviews</p>
                      <p className="metric-value">
                        {toNumber(selectedMaid.total_reviews)}
                      </p>
                    </div>
                    <div className="metric">
                      <p className="metric-label">Hourly Rate</p>
                      <p className="metric-value">
                        ₦{toNumber(selectedMaid.hourly_rate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="detail-card">
                  <h3>Experience</h3>
                  <div className="experience-info">
                    <p className="years">
                      <Clock size={20} />
                      <span>{toNumber(selectedMaid.years_exp)} Years</span>
                    </p>
                  </div>
                </div>

                <div className="detail-card full-width">
                  <h3>Bio</h3>
                  <p className="bio-text">
                    {selectedMaid.bio || "No bio provided"}
                  </p>
                </div>

                <div className="detail-card full-width">
                  <h3>Services</h3>
                  <div className="services-list">
                    {selectedMaid.services &&
                    Array.isArray(selectedMaid.services) &&
                    selectedMaid.services.length > 0 ? (
                      selectedMaid.services.map((service, idx) => (
                        <span key={idx} className="service-tag">
                          {service}
                        </span>
                      ))
                    ) : (
                      <p>No services listed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="reviews-section">
                <h3>Customer Reviews ({reviews.length})</h3>
                {loadingReviews ? (
                  <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="no-reviews">No reviews yet</p>
                ) : (
                  <div className="reviews-list">
                    {reviews.map((review, idx) => (
                      <div key={idx} className="review-card">
                        <div className="review-header">
                          <p className="reviewer-name">
                            {review.customer_name || "Anonymous"}
                          </p>
                          <div className="rating-stars">
                            {"⭐".repeat(toNumber(review.rating, 0))}
                          </div>
                        </div>
                        <p className="review-comment">
                          {review.comment || "No comment"}
                        </p>
                        <p className="review-date">
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "edit" && editingMaid && (
          <div className="edit-view">
            <button className="back-btn" onClick={() => setView("detail")}>
              ← Cancel
            </button>

            <div className="edit-form">
              <h2>Edit Maid Profile</h2>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={editingMaid.bio || ""}
                  onChange={(e) =>
                    setEditingMaid({ ...editingMaid, bio: e.target.value })
                  }
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hourly Rate (₦)</label>
                  <input
                    type="number"
                    value={toNumber(editingMaid.hourly_rate)}
                    onChange={(e) =>
                      setEditingMaid({
                        ...editingMaid,
                        hourly_rate: toNumber(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    value={toNumber(editingMaid.years_exp)}
                    onChange={(e) =>
                      setEditingMaid({
                        ...editingMaid,
                        years_exp: toNumber(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={editingMaid.location || ""}
                  onChange={(e) =>
                    setEditingMaid({ ...editingMaid, location: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Services (comma-separated)</label>
                <input
                  type="text"
                  value={
                    Array.isArray(editingMaid.services)
                      ? editingMaid.services.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setEditingMaid({
                      ...editingMaid,
                      services: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={editingMaid.is_available || false}
                    onChange={(e) =>
                      setEditingMaid({
                        ...editingMaid,
                        is_available: e.target.checked,
                      })
                    }
                  />
                  Available
                </label>
              </div>

              <div className="form-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setView("detail")}
                >
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
