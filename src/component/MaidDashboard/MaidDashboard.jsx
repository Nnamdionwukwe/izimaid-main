import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MaidDashboard.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const SERVICES_LIST = [
  "Cleaning",
  "Laundry",
  "Cooking",
  "Ironing",
  "Organizing",
  "Window Cleaning",
  "Carpet Cleaning",
  "Deep Cleaning",
];

const STATUS_CLASS = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

// ─── Profile Tab ──────────────────────────────────────────────
function ProfileTab({ token, user }) {
  const [profile, setProfile] = useState({
    bio: "",
    hourly_rate: "",
    years_exp: "",
    services: [],
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/maids/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.maid) {
          setProfile({
            bio: data.maid.bio || "",
            hourly_rate: data.maid.hourly_rate || "",
            years_exp: data.maid.years_exp || "",
            services: data.maid.services || [],
            location: data.maid.location || "",
          });
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  function toggleService(s) {
    setProfile((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
  }

  async function handleSave() {
    if (!profile.hourly_rate || Number(profile.hourly_rate) <= 0) {
      setMsg({ type: "error", text: "Please enter a valid hourly rate" });
      return;
    }
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API_URL}/api/maids/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: profile.bio,
          hourly_rate: Number(profile.hourly_rate),
          years_exp: Number(profile.years_exp) || 0,
          services: profile.services,
          location: profile.location,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "Profile saved successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to save" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}>Loading profile...</div>;

  return (
    <div>
      <p className={styles.sectionTitle}>My Profile</p>
      {msg.text && (
        <p
          className={
            msg.type === "success" ? styles.successMsg : styles.errorMsg
          }
          style={{ marginBottom: 16 }}
        >
          {msg.text}
        </p>
      )}
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Bio</label>
          <textarea
            className={styles.textarea}
            placeholder="Tell customers about yourself, your experience and what makes you great..."
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Hourly Rate (₦)*</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 3000"
              value={profile.hourly_rate}
              onChange={(e) =>
                setProfile((p) => ({ ...p, hourly_rate: e.target.value }))
              }
              min="0"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Years Experience</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 3"
              value={profile.years_exp}
              onChange={(e) =>
                setProfile((p) => ({ ...p, years_exp: e.target.value }))
              }
              min="0"
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Location</label>
          <input
            className={styles.input}
            type="text"
            placeholder="e.g. Lekki, Lagos"
            value={profile.location}
            onChange={(e) =>
              setProfile((p) => ({ ...p, location: e.target.value }))
            }
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Services Offered</label>
          <div className={styles.serviceGrid}>
            {SERVICES_LIST.map((s) => (
              <div
                key={s}
                className={`${styles.serviceItem} ${profile.services.includes(s) ? styles.serviceItemActive : ""}`}
                onClick={() => toggleService(s)}
              >
                <div
                  className={`${styles.serviceCheck} ${profile.services.includes(s) ? styles.serviceCheckActive : ""}`}
                >
                  {profile.services.includes(s) && "✓"}
                </div>
                {s}
              </div>
            ))}
          </div>
        </div>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────
function BookingsTab({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`${API_URL}/api/bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {}
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchBookings();
    } catch {}
  }

  const FILTERS = [
    "all",
    "pending",
    "confirmed",
    "in_progress",
    "completed",
    "cancelled",
  ];

  return (
    <div>
      <p className={styles.sectionTitle}>My Bookings</p>
      <div
        className={styles.tabs}
        style={{
          marginBottom: 16,
          border: "none",
          borderBottom: "1px solid rgb(228,228,228)",
        }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.tab} ${filter === f ? styles.tabActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "in_progress"
              ? "In Progress"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          No {filter !== "all" ? filter : ""} bookings
        </div>
      ) : (
        <div className={styles.bookingList}>
          {bookings.map((b) => (
            <div key={b.id} className={styles.bookingCard}>
              <div className={styles.bookingTop}>
                <div>
                  <p className={styles.bookingCustomer}>{b.customer_name}</p>
                  <p className={styles.bookingDate}>
                    {formatDate(b.service_date)}
                  </p>
                </div>
                <span
                  className={`${styles.statusBadge} ${STATUS_CLASS[b.status] || styles.statusPending}`}
                >
                  {b.status?.replace("_", " ")}
                </span>
              </div>
              <div className={styles.bookingMeta}>
                <div className={styles.metaItem}>
                  Duration:{" "}
                  <span className={styles.metaValue}>{b.duration_hours}h</span>
                </div>
                <div className={styles.metaItem}>
                  Earning:{" "}
                  <span className={styles.metaValue}>
                    ₦{Number(b.total_amount).toLocaleString()}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  Address:{" "}
                  <span className={styles.metaValue}>
                    {b.address?.split(",")[0]}
                  </span>
                </div>
              </div>
              <div className={styles.bookingActions}>
                {b.status === "pending" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => updateStatus(b.id, "confirmed")}
                  >
                    Accept
                  </button>
                )}
                {b.status === "confirmed" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => updateStatus(b.id, "in_progress")}
                  >
                    Start Cleaning
                  </button>
                )}
                {b.status === "in_progress" && (
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => updateStatus(b.id, "completed")}
                  >
                    Mark Complete
                  </button>
                )}
                {b.status === "pending" && (
                  <button
                    className={styles.actionBtn}
                    onClick={() => updateStatus(b.id, "cancelled")}
                  >
                    Decline
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────
function ReviewsTab({ token, user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/maids/${user.id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div>
      <p className={styles.sectionTitle}>My Reviews</p>
      {reviews.length > 0 && (
        <div className={styles.statsGrid} style={{ marginBottom: 16 }}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Average Rating</p>
            <p className={styles.statValue}>★ {avg}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Reviews</p>
            <p className={styles.statValue}>{reviews.length}</p>
          </div>
        </div>
      )}
      {loading ? (
        <div className={styles.loading}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.empty}>
          No reviews yet. Complete bookings to receive reviews.
        </div>
      ) : (
        <div className={styles.reviewList}>
          {reviews.map((r, i) => (
            <div key={i} className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <span className={styles.reviewCustomer}>{r.customer_name}</span>
                <span className={styles.reviewStars}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
              </div>
              {r.comment && (
                <p className={styles.reviewComment}>"{r.comment}"</p>
              )}
              <p className={styles.reviewDate}>{formatDate(r.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function MaidDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("bookings");
  const [available, setAvailable] = useState(true);
  const [savingAvail, setSavingAvail] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    earnings: 0,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user.role !== "maid") {
      navigate("/login");
      return;
    }
    async function loadProfile() {
      try {
        const res = await fetch(`${API_URL}/api/maids/${user.id}`);
        const data = await res.json();
        if (res.ok && data.maid) setAvailable(data.maid.is_available);
      } catch {}
    }
    async function loadStats() {
      try {
        const res = await fetch(`${API_URL}/api/bookings?limit=200`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const b = data.bookings || [];
        setStats({
          total: b.length,
          pending: b.filter((x) => x.status === "pending").length,
          completed: b.filter((x) => x.status === "completed").length,
          earnings: b
            .filter((x) => x.status === "completed")
            .reduce((s, x) => s + Number(x.total_amount), 0),
        });
      } catch {}
    }
    loadProfile();
    loadStats();
  }, []);

  async function toggleAvailability() {
    setSavingAvail(true);
    try {
      const res = await fetch(`${API_URL}/api/maids/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_available: !available }),
      });
      if (res.ok) setAvailable((v) => !v);
    } catch {}
    setSavingAvail(false);
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className={styles.headerAvatar}
            />
          ) : (
            <div className={styles.headerAvatarPlaceholder}>
              {initials(user.name)}
            </div>
          )}
          <div>
            <p className={styles.headerName}>{user.name}</p>
            <p className={styles.headerRole}>Maid · IziMaid</p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Availability toggle */}
      <div className={styles.availBar}>
        <div>
          <p className={styles.availLabel}>Availability</p>
          <p className={styles.availStatus}>
            {available
              ? "You are visible to customers"
              : "You are hidden from search"}
          </p>
        </div>
        <button
          className={`${styles.toggle} ${available ? styles.toggleOn : ""}`}
          onClick={toggleAvailability}
          disabled={savingAvail}
        >
          <div
            className={`${styles.toggleKnob} ${available ? styles.toggleKnobOn : ""}`}
          />
        </button>
      </div>

      {/* Stats */}
      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Bookings</p>
            <p className={styles.statValue}>{stats.total}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Pending</p>
            <p className={styles.statValue}>{stats.pending}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Completed</p>
            <p className={styles.statValue}>{stats.completed}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Earnings</p>
            <p className={styles.statValue} style={{ fontSize: 18 }}>
              ₦{stats.earnings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {[
          ["bookings", "Bookings"],
          ["profile", "My Profile"],
          ["reviews", "Reviews"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`${styles.tab} ${tab === key ? styles.tabActive : ""}`}
            onClick={() => setTab(key)}
          >
            {label}
            {key === "bookings" && stats.pending > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  background: "rgb(187,19,47)",
                  color: "white",
                  fontSize: 10,
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontWeight: "bold",
                }}
              >
                {stats.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === "bookings" && <BookingsTab token={token} />}
        {tab === "profile" && <ProfileTab token={token} user={user} />}
        {tab === "reviews" && <ReviewsTab token={token} user={user} />}
      </div>
    </div>
  );
}
