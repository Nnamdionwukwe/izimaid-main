import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Maids.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const SERVICES = [
  "All",
  "Cleaning",
  "Laundry",
  "Cooking",
  "Ironing",
  "Organizing",
];

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

export default function Maids() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("location") || "");
  const [service, setService] = useState("All");

  useEffect(() => {
    async function fetchMaids() {
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (service !== "All") params.set("service", service.toLowerCase());
        const res = await fetch(`${API_URL}/api/maids?${params}`);
        const data = await res.json();
        setMaids(data.maids || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMaids();
  }, [service]);

  const filtered = maids.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) || m.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Find a Maid</h1>
      <p className={styles.pageSubtitle}>
        Browse verified cleaning professionals near you
      </p>

      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          {SERVICES.map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${service === s ? styles.filterBtnActive : ""}`}
              onClick={() => setService(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading maids...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          No maids found. Try a different search.
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((maid) => (
            <div key={maid.id} className={styles.card}>
              {maid.avatar ? (
                <img
                  src={maid.avatar}
                  alt={maid.name}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {initials(maid.name)}
                </div>
              )}
              <div className={styles.cardInfo}>
                <p className={styles.cardName}>{maid.name}</p>
                {maid.location && (
                  <p className={styles.cardLocation}>📍 {maid.location}</p>
                )}
                {maid.services?.length > 0 && (
                  <div className={styles.cardTags}>
                    {maid.services.slice(0, 3).map((s) => (
                      <span key={s} className={styles.tag}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <div className={styles.cardMeta}>
                  <div>
                    <span className={styles.cardRating}>
                      ★ {Number(maid.rating || 0).toFixed(1)}
                    </span>
                    <span
                      style={{ fontSize: 11, color: "gray", marginLeft: 4 }}
                    >
                      ({maid.total_reviews || 0} reviews)
                    </span>
                  </div>
                  <span className={styles.cardRate}>
                    ₦{Number(maid.hourly_rate || 0).toLocaleString()}/hr
                  </span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <button
                    className={styles.bookBtn}
                    onClick={() =>
                      navigate(`/book/${maid.id}`, { state: { maid } })
                    }
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
