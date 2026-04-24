// src/component/MaidDetail/MaidDetail.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./MaidDetail.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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
function sym(c) {
  return CURRENCY_SYMBOLS[c] || (c ? c + " " : "₦");
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
function formatDate(d) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function MaidDetail() {
  const { maidId } = useParams();
  const navigate = useNavigate();

  const [maid, setMaid] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const REVIEWS_PER_PAGE = 10;

  // ── Fetch maid + availability ────────────────────────────────────
  useEffect(() => {
    async function fetchAll() {
      try {
        const [maidRes, availRes] = await Promise.all([
          fetch(`${API_URL}/api/maids/${maidId}`),
          fetch(`${API_URL}/api/maids/${maidId}/availability`),
        ]);
        const [maidData, availData] = await Promise.all([
          maidRes.json(),
          availRes.json(),
        ]);
        setMaid(maidData.maid || {});
        setAvailability(availData.availability || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [maidId]);

  // ── Fetch reviews ────────────────────────────────────────────────
  useEffect(() => {
    if (!maid) return;
    setReviewsLoading(true);
    fetch(
      `${API_URL}/api/maids/${maidId}/reviews?page=${page}&limit=${REVIEWS_PER_PAGE}`,
    )
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews || []);
        setTotalReviews(d.total || 0);
      })
      .catch(console.error)
      .finally(() => setReviewsLoading(false));
  }, [maidId, page, maid]);

  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

  // Remove the booking lookup useEffect and latestBookingId state.
  // Replace with just:
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isCustomer = currentUser?.role === "customer";

  if (loading)
    return (
      <div className={styles.page}>
        <div
          style={{ textAlign: "center", padding: "60px 20px", color: "gray" }}
        >
          Loading maid details...
        </div>
      </div>
    );

  if (!maid?.id)
    return (
      <div className={styles.page}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "gray", marginBottom: 16 }}>Maid not found</p>
          <button className={styles.backBtn} onClick={() => navigate("/maids")}>
            ← Back to maids
          </button>
        </div>
      </div>
    );

  const c = maid.currency || "NGN";
  const s = sym(c);
  const hasRates = maid.rate_daily || maid.rate_weekly || maid.rate_monthly;

  // Parse custom rates — stored as JSONB object { "Deep Clean": 5000, ... }
  let customRates = [];
  if (maid.rate_custom) {
    try {
      const parsed =
        typeof maid.rate_custom === "string"
          ? JSON.parse(maid.rate_custom)
          : maid.rate_custom;
      customRates = Object.entries(parsed)
        .filter(([, v]) => Number(v) > 0)
        .map(([label, price]) => ({ label, price }));
    } catch {}
  }

  // Availability — group by day, sort by day_of_week
  const availByDay = {};
  availability.forEach((a) => {
    availByDay[a.day_of_week] = a;
  });
  const activeDays = DAYS.filter((_, i) => availByDay[i]);

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate("/maids")}>
        ← Back to maids
      </button>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        {/* Avatar */}
        <div className={styles.headerAvatarWrap}>
          {maid.avatar ? (
            <img
              src={maid.avatar}
              alt={maid.name}
              className={styles.avatar}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={styles.avatarPlaceholder}
            style={{ display: maid.avatar ? "none" : "flex" }}
          >
            {initials(maid.name)}
          </div>
        </div>

        {/* Info */}
        <div className={styles.headerInfo}>
          <div className={styles.headerNameRow}>
            <h1 className={styles.name}>{maid.name}</h1>
            <div className={styles.badges}>
              {maid.id_verified && (
                <span
                  className={styles.badge}
                  style={{
                    background: "rgb(232,245,233)",
                    color: "rgb(27,94,32)",
                  }}
                >
                  🪪 Verified
                </span>
              )}
              {maid.background_checked && (
                <span
                  className={styles.badge}
                  style={{
                    background: "rgb(227,242,253)",
                    color: "rgb(13,71,161)",
                  }}
                >
                  🔍 Checked
                </span>
              )}
            </div>
          </div>

          {maid.location && (
            <p className={styles.location}>📍 {maid.location}</p>
          )}

          <div className={styles.rating}>
            <span className={styles.ratingNumber}>
              ★ {Number(maid.rating || 0).toFixed(1)}
            </span>
            <span className={styles.ratingCount}>
              ({maid.total_reviews || 0} reviews)
            </span>
            {maid.years_exp > 0 && (
              <span className={styles.expPill}>
                🎓 {maid.years_exp} yr{maid.years_exp !== 1 ? "s" : ""} exp
              </span>
            )}
          </div>

          <div className={styles.headerRate}>
            <span className={styles.primaryRate}>
              {s}
              {Number(
                maid.hourly_rate || maid.rate_hourly || 0,
              ).toLocaleString()}
              <span className={styles.rateUnit}>/hr</span>
            </span>
            {maid.rate_daily && (
              <span className={styles.altRate}>
                {s}
                {Number(maid.rate_daily).toLocaleString()}/day
              </span>
            )}
          </div>

          {maid.pricing_note && (
            <p className={styles.pricingNote}>💬 {maid.pricing_note}</p>
          )}

          {/* ── Contact row ──────────────────────────────────────── */}
          <div className={styles.contactRow}>
            {maid.phone && (
              <a href={`tel:${maid.phone}`} className={styles.contactChip}>
                <span className={styles.contactChipIcon}>📞</span>
                <span className={styles.contactChipText}>{maid.phone}</span>
              </a>
            )}
            {maid.email && (
              <a href={`mailto:${maid.email}`} className={styles.contactChip}>
                <span className={styles.contactChipIcon}>✉️</span>
                <span className={styles.contactChipText}>{maid.email}</span>
              </a>
            )}
          </div>

          {/* ── Action buttons ───────────────────────────────────── */}
          <div className={styles.actionRow}>
            <button
              className={styles.bookBtn}
              onClick={() => navigate(`/book/${maid.id}`, { state: { maid } })}
            >
              Book Now
            </button>

            {token && isCustomer ? (
              <button
                className={styles.chatBtn}
                onClick={() =>
                  navigate(`/chat/inquiry/${maid.id}`, { state: { maid } })
                }
              >
                💬 Message
              </button>
            ) : !token ? (
              <button
                className={styles.chatBtn}
                onClick={() => navigate("/login")}
              >
                💬 Login to Message
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Content grid ───────────────────────────────────────── */}
      <div className={styles.content}>
        {/* ── LEFT ─────────────────────────────────────────────── */}
        <div className={styles.left}>
          {/* Bio */}
          {maid.bio && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.bio}>{maid.bio}</p>
            </div>
          )}

          {/* Pricing */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Pricing ({c})</h2>
            <div className={styles.priceGrid}>
              <div className={styles.priceCard}>
                <span className={styles.priceLabel}>Per Hour</span>
                <span className={styles.priceValue}>
                  {s}
                  {Number(
                    maid.hourly_rate || maid.rate_hourly || 0,
                  ).toLocaleString()}
                </span>
              </div>
              {maid.rate_daily && (
                <div className={styles.priceCard}>
                  <span className={styles.priceLabel}>Per Day</span>
                  <span className={styles.priceValue}>
                    {s}
                    {Number(maid.rate_daily).toLocaleString()}
                  </span>
                </div>
              )}
              {maid.rate_weekly && (
                <div className={styles.priceCard}>
                  <span className={styles.priceLabel}>Per Week</span>
                  <span className={styles.priceValue}>
                    {s}
                    {Number(maid.rate_weekly).toLocaleString()}
                  </span>
                </div>
              )}
              {maid.rate_monthly && (
                <div className={styles.priceCard}>
                  <span className={styles.priceLabel}>Per Month</span>
                  <span className={styles.priceValue}>
                    {s}
                    {Number(maid.rate_monthly).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Custom rates */}
            {customRates.length > 0 && (
              <div className={styles.customRates}>
                <p className={styles.customRatesTitle}>Custom Services</p>
                {customRates.map((r) => (
                  <div key={r.label} className={styles.customRateRow}>
                    <span>{r.label}</span>
                    <span className={styles.customRatePrice}>
                      {s}
                      {Number(r.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          {maid.services?.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Services Offered</h2>
              <div className={styles.services}>
                {maid.services.map((sv) => (
                  <span key={sv} className={styles.serviceTag}>
                    {sv}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {activeDays.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Weekly Availability</h2>
              <div className={styles.availGrid}>
                {DAYS.map((day, i) => {
                  const slot = availByDay[i];
                  return (
                    <div
                      key={i}
                      className={`${styles.availRow} ${slot ? styles.availRowOn : styles.availRowOff}`}
                    >
                      <span className={styles.availDay}>{day.slice(0, 3)}</span>
                      {slot ? (
                        <span className={styles.availTime}>
                          {slot.start_time?.slice(0, 5)} –{" "}
                          {slot.end_time?.slice(0, 5)}
                        </span>
                      ) : (
                        <span className={styles.availOff}>Unavailable</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experience / languages */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Details</h2>
            <div className={styles.experienceBox}>
              <div className={styles.experienceItem}>
                <span className={styles.experienceLabel}>Experience</span>
                <span className={styles.experienceValue}>
                  {Number(maid.years_exp || 0)} years
                </span>
              </div>
              <div className={styles.experienceItem}>
                <span className={styles.experienceLabel}>Status</span>
                <span
                  className={`${styles.experienceValue} ${maid.is_available ? styles.available : styles.unavailable}`}
                >
                  {maid.is_available ? "✅ Available" : "❌ Unavailable"}
                </span>
              </div>
              {maid.languages?.length > 0 && (
                <div
                  className={styles.experienceItem}
                  style={{ gridColumn: "1/-1" }}
                >
                  <span className={styles.experienceLabel}>Languages</span>
                  <span className={styles.experienceValue}>
                    {maid.languages.join(", ")}
                  </span>
                </div>
              )}
              {maid.member_since && (
                <div className={styles.experienceItem}>
                  <span className={styles.experienceLabel}>Member Since</span>
                  <span className={styles.experienceValue}>
                    {formatDate(maid.member_since)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT — Reviews ───────────────────────────────────── */}
        <div className={styles.right}>
          <h2 className={styles.sectionTitle}>Customer Reviews</h2>

          {reviewsLoading ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "gray" }}
            >
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className={styles.noReviews}>
              <p>No reviews yet</p>
              <p style={{ fontSize: 13, color: "gray" }}>
                Be the first to review this maid
              </p>
            </div>
          ) : (
            <>
              <div className={styles.reviewsList}>
                {reviews.map((review) => (
                  <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <div className={styles.reviewerAvatar}>
                          {initials(review.customer_name || "Anonymous")}
                        </div>
                        <div>
                          <p className={styles.reviewerName}>
                            {review.customer_name || "Anonymous"}
                          </p>
                          <p className={styles.reviewDate}>
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className={styles.reviewRating}>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p className={styles.reviewComment}>{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
