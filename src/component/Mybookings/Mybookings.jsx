// src/component/Mybookings/Mybookings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Mybookings.module.css";
import Chat from "../Chat/Chat";
import NotificationBell from "../Notifications/NotificationBell";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const FILTERS = [
  "all",
  "awaiting_payment",
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "declined",
  "cancelled",
];

const STATUS_CLASS = {
  awaiting_payment: styles.statusPending,
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusCancelled,
  declined: styles.statusDeclined,
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

const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  KES: "KSh",
  GHS: "₵",
  ZAR: "R",
  UGX: "USh",
  CAD: "CA$",
  AUD: "A$",
};
function fmtBookingAmt(b) {
  const c = b.payment_currency || b.maid_currency || "NGN";
  return `${CURRENCY_SYMBOLS[c] || c + " "}${Number(b.total_amount || 0).toLocaleString()}`;
}

function statusLabel(s) {
  if (s === "in_progress") return "In Progress";
  if (s === "awaiting_payment") return "⏳ Awaiting Payment";
  return s?.charAt(0).toUpperCase() + s?.slice(1);
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

const CHAT_STATUSES = ["confirmed", "in_progress", "completed", "pending"];

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth(); // ← token + logout from context

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [chatBooking, setChatBooking] = useState(null);

  const isMaid = user?.role === "maid";

  // ── Fetch bookings ──────────────────────────────────────────────────
  useEffect(() => {
    async function fetchBookings() {
      if (!token) return navigate("/login");
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/bookings?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [filter, token]);

  // ── Background refresh every 30s ────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    const id = setInterval(async () => {
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/bookings?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch {}
    }, 30000);
    return () => clearInterval(id);
  }, [filter, token]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleGetSupport(e, booking) {
    e.stopPropagation();
    navigate("/customersupport", { state: { booking } });
  }

  function handleOpenChat(e, booking) {
    e.stopPropagation();
    setChatBooking(booking);
  }

  // ── Chat view ────────────────────────────────────────────────────────
  if (chatBooking) {
    const otherName = isMaid
      ? chatBooking.customer_name
      : chatBooking.maid_name;
    const otherAvatar = isMaid
      ? chatBooking.customer_avatar
      : chatBooking.maid_avatar;
    return (
      <Chat
        bookingId={chatBooking.id}
        otherName={otherName}
        otherAvatar={otherAvatar}
        onClose={() => setChatBooking(null)}
      />
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Top bar ────────────────────────────────────────────── */}
      <div className={styles.topBar}>
        <button className={styles.backLink} onClick={() => navigate("/")}>
          ← Home
        </button>
        <div className={styles.topBarRight}>
          <NotificationBell token={token} />
          {/* <div className={styles.userChip}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className={styles.userAvatar}
              />
            ) : (
              <div className={styles.userAvatarPlaceholder}>
                {initials(user?.name)}
              </div>
            )}
            <span className={styles.userName}>{user?.name?.split(" ")[0]}</span>
          </div> */}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ── Page heading ───────────────────────────────────────── */}
      <div className={styles.heading}>
        <div>
          <h1 className={styles.pageTitle}>My Bookings</h1>
          <p className={styles.pageSubtitle}>
            {isMaid ? "Bookings assigned to you" : "Your cleaning bookings"}
          </p>
        </div>
        {!isMaid && (
          <div className={styles.headingActions}>
            <button
              className={styles.ghostBtn}
              onClick={() => navigate("/customersupport")}
            >
              🎫 Support
            </button>
            <button
              className={styles.newBookingBtn}
              onClick={() => navigate("/maids")}
            >
              + New Booking
            </button>
          </div>
        )}
      </div>

      {/* ── Filter chips ───────────────────────────────────────── */}
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "awaiting_payment" ? "Unpaid" : statusLabel(f)}
          </button>
        ))}
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading bookings…</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyTitle}>
            No {filter !== "all" ? filter.replace(/_/g, " ") : ""} bookings
            found
          </p>
          {!isMaid && (
            <button
              className={styles.newBookingBtn}
              onClick={() => navigate("/maids")}
            >
              Browse Maids
            </button>
          )}
        </div>
      ) : (
        <div className={styles.list}>
          {bookings.map((b) => (
            <div
              key={b.id}
              className={styles.card}
              onClick={() =>
                navigate(`/bookings/${b.id}`, { state: { booking: b } })
              }
            >
              {/* Card header */}
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.cardName}>
                    {isMaid ? b.customer_name : b.maid_name}
                  </p>
                  <p className={styles.cardDate}>
                    {formatDate(b.service_date)}
                  </p>
                </div>
                <span
                  className={`${styles.statusBadge} ${STATUS_CLASS[b.status] || styles.statusPending}`}
                >
                  {statusLabel(b.status)}
                </span>
              </div>

              {/* Declined alert */}
              {b.status === "declined" && b.declined_reason && (
                <div className={styles.declinedAlert}>
                  <span className={styles.declinedIcon}>⚠️</span>
                  <p className={styles.declinedReason}>
                    <span className={styles.reasonLabel}>Reason: </span>
                    {b.declined_reason}
                  </p>
                </div>
              )}

              {/* Meta row */}
              <div className={styles.cardMeta}>
                <div className={styles.metaItem}>
                  Duration{" "}
                  <span className={styles.metaValue}>{b.duration_hours}h</span>
                </div>
                <div className={styles.metaItem}>
                  Total{" "}
                  <span className={styles.metaValue}>{fmtBookingAmt(b)}</span>
                </div>
                <div className={styles.metaItem}>
                  Address{" "}
                  <span className={styles.metaValue}>
                    {b.address?.split(",")[0]}
                  </span>
                </div>
              </div>

              {/* Pay now */}
              {!isMaid && b.status === "awaiting_payment" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginTop: 10 }}
                >
                  <button
                    className={styles.payBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/payment", { state: { booking: b } });
                    }}
                  >
                    🔒 Pay Now — {fmtBookingAmt(b)}
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className={styles.cardActions}>
                {CHAT_STATUSES.includes(b.status) && (
                  <button
                    className={styles.chatBtn}
                    onClick={(e) => handleOpenChat(e, b)}
                  >
                    💬 {isMaid ? "Chat Customer" : "Chat Maid"}
                  </button>
                )}
                {!isMaid && (
                  <button
                    className={styles.supportBtn}
                    onClick={(e) => handleGetSupport(e, b)}
                  >
                    🎫 Support
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
