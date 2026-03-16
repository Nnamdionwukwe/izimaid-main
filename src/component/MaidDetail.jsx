import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./MaidDetail.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MaidDetail() {
  const { maidId } = useParams();
  const navigate = useNavigate();

  const [maid, setMaid] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const REVIEWS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchMaidDetails() {
      try {
        const res = await fetch(`${API_URL}/api/maids/${maidId}`);
        const data = await res.json();
        setMaid(data.maid || {});
      } catch (err) {
        console.error("Error fetching maid details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMaidDetails();
  }, [maidId]);

  useEffect(() => {
    async function fetchReviews() {
      if (!maid) return;
      setReviewsLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/api/maids/${maidId}/reviews?page=${page}&limit=${REVIEWS_PER_PAGE}`,
        );
        const data = await res.json();
        setReviews(data.reviews || []);
        setTotalReviews(data.total || 0);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    }

    fetchReviews();
  }, [maidId, page, maid]);

  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

  if (loading) {
    return (
      <div className={styles.page}>
        <div
          style={{ textAlign: "center", padding: "40px 20px", color: "gray" }}
        >
          Loading maid details...
        </div>
      </div>
    );
  }

  if (!maid || !maid.id) {
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
  }

  return (
    <div className={styles.page}>
      {/* Back button */}
      <button className={styles.backBtn} onClick={() => navigate("/maids")}>
        ← Back to maids
      </button>

      {/* Header with avatar and basic info */}
      <div className={styles.header}>
        {maid.avatar ? (
          <img src={maid.avatar} alt={maid.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{initials(maid.name)}</div>
        )}

        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{maid.name}</h1>
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
          </div>

          <p className={styles.hourlyRate}>
            ₦{Number(maid.hourly_rate || 0).toLocaleString()} per hour
          </p>
        </div>

        <button
          className={styles.bookBtn}
          onClick={() => navigate(`/book/${maid.id}`, { state: { maid } })}
        >
          Book Now
        </button>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        {/* Left section - Profile info */}
        <div className={styles.left}>
          {/* Bio */}
          {maid.bio && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>About</h2>
              <p className={styles.bio}>{maid.bio}</p>
            </div>
          )}

          {/* Experience */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <div className={styles.experienceBox}>
              <div className={styles.experienceItem}>
                <span className={styles.experienceLabel}>Years</span>
                <span className={styles.experienceValue}>
                  {Number(maid.years_exp || 0)} years
                </span>
              </div>
              <div className={styles.experienceItem}>
                <span className={styles.experienceLabel}>Status</span>
                <span
                  className={`${styles.experienceValue} ${
                    maid.is_available ? styles.available : styles.unavailable
                  }`}
                >
                  {maid.is_available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          {maid.services && maid.services.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Services Offered</h2>
              <div className={styles.services}>
                {maid.services.map((service) => (
                  <span key={service} className={styles.serviceTag}>
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right section - Reviews */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
