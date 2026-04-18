// src/component/Maids/Maids.jsx
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
  "Window Cleaning",
  "Carpet Cleaning",
  "Deep Cleaning",
];

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

// ── Haversine distance (km) — works entirely client-side ─────────────
function haversine(lat1, lon1, lat2, lon2) {
  if (lat2 == null || lon2 == null || isNaN(lat2) || isNaN(lon2)) return null;
  const R = 6371;
  const dL = ((lat2 - lat1) * Math.PI) / 180;
  const dG = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dL / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dG / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Maids() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [allMaids, setAllMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("location") || "");
  const [service, setService] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle"); // idle | loading | ok | denied
  const [geoError, setGeoError] = useState("");

  // ── Fetch ALL maids — NO radius filter — we sort distance client-side
  // This guarantees we never show "No maids found" just because
  // the maid hasn't saved GPS coordinates in their profile yet.
  useEffect(() => {
    let cancelled = false;
    async function fetchMaids() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: 200 });
        if (service !== "All") params.set("service", service);
        // ⚠️ Do NOT pass lat/lng to backend — backend radius filter would
        //    exclude maids with no coordinates set. We compute distance here.
        const res = await fetch(`${API_URL}/api/maids?${params}`);
        const data = await res.json();
        if (!cancelled) setAllMaids(data.maids || []);
      } catch (err) {
        console.error("fetchMaids:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchMaids();
    return () => {
      cancelled = true;
    };
  }, [service]);

  // ── Request location ─────────────────────────────────────────────────
  function handleUseLocation() {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      setGeoError("Geolocation not supported in this browser.");
      return;
    }
    setGeoStatus("loading");
    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        setCoords({ lat: c.latitude, lng: c.longitude });
        setSortBy("distance");
        setGeoStatus("ok");
      },
      (err) => {
        setGeoStatus("denied");
        setGeoError(
          err.code === 1
            ? "Location permission denied. Please allow access in your browser settings then try again."
            : "Could not get your location. Try again.",
        );
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 },
    );
  }

  function clearLocation() {
    setCoords(null);
    setSortBy("rating");
    setGeoStatus("idle");
    setGeoError("");
  }

  // ── Attach client-side distance to every maid ────────────────────────
  const maidsWithDist = allMaids.map((m) => ({
    ...m,
    _dist: coords
      ? haversine(
          coords.lat,
          coords.lng,
          Number(m.latitude),
          Number(m.longitude),
        )
      : null,
  }));

  // ── Text filter ──────────────────────────────────────────────────────
  const filtered = maidsWithDist.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) || m.location?.toLowerCase().includes(q)
    );
  });

  // ── Sort ─────────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "distance") {
      // Maids with no GPS coordinates sort to end — never excluded
      return (a._dist ?? 99999) - (b._dist ?? 99999);
    }
    if (sortBy === "rate_asc") {
      return (
        Number(a.hourly_rate || a.rate_hourly || 0) -
        Number(b.hourly_rate || b.rate_hourly || 0)
      );
    }
    return Number(b.rating || 0) - Number(a.rating || 0); // rating DESC
  });

  return (
    <div className={styles.page}>
      <button className={styles.backLink} onClick={() => navigate("/")}>
        ← Back to Home
      </button>
      <h1 className={styles.pageTitle}>Find a Maid</h1>
      <p className={styles.pageSubtitle}>
        Browse verified cleaning professionals near you
      </p>

      {/* ── Search row ─────────────────────────────────────────── */}
      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {geoStatus !== "ok" ? (
          <button
            className={styles.geoBtn}
            onClick={handleUseLocation}
            disabled={geoStatus === "loading"}
          >
            {geoStatus === "loading"
              ? "📍 Getting location…"
              : "📍 Use my location"}
          </button>
        ) : (
          <button
            className={`${styles.geoBtn} ${styles.geoBtnActive}`}
            onClick={clearLocation}
          >
            📍 Near me ✕
          </button>
        )}
      </div>

      {geoError && <p className={styles.geoError}>⚠️ {geoError}</p>}

      {/* ── Service chips ───────────────────────────────────────── */}
      <div className={styles.filters}>
        {SERVICES.map((sv) => (
          <button
            key={sv}
            className={`${styles.filterBtn} ${service === sv ? styles.filterBtnActive : ""}`}
            onClick={() => setService(sv)}
          >
            {sv}
          </button>
        ))}
      </div>

      {/* ── Sort ────────────────────────────────────────────────── */}
      <div className={styles.sortRow}>
        <span className={styles.sortLabel}>Sort by:</span>

        <button
          className={`${styles.sortBtn} ${sortBy === "rating" ? styles.sortBtnActive : ""}`}
          onClick={() => setSortBy("rating")}
        >
          ⭐ Top Rated
        </button>

        <button
          className={`${styles.sortBtn} ${sortBy === "rate_asc" ? styles.sortBtnActive : ""}`}
          onClick={() => setSortBy("rate_asc")}
        >
          💰 Lowest Rate
        </button>

        <button
          className={`${styles.sortBtn} ${sortBy === "distance" ? styles.sortBtnActive : ""}`}
          onClick={() =>
            geoStatus === "ok" ? setSortBy("distance") : handleUseLocation()
          }
        >
          {geoStatus === "loading" ? "📍 Getting…" : "📍 Nearest First"}
        </button>
      </div>

      {/* ── Results count ───────────────────────────────────────── */}
      {!loading && (
        <p className={styles.resultsCount}>
          {sorted.length} maid{sorted.length !== 1 ? "s" : ""}
          {geoStatus === "ok" ? " — sorted nearest to you" : ""}
        </p>
      )}

      {/* ── Grid ────────────────────────────────────────────────── */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Finding maids…</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className={styles.empty}>
          <p>No maids match{search ? ` "${search}"` : ""}.</p>
          {search && (
            <button
              className={styles.clearSearchBtn}
              onClick={() => setSearch("")}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {sorted.map((maid) => {
            const currency = maid.currency || "NGN";
            const s = sym(currency);
            const rate = Number(maid.hourly_rate || maid.rate_hourly || 0);
            const dist = maid._dist;

            return (
              <div
                key={maid.id}
                className={styles.card}
                onClick={() => navigate(`/maid/${maid.id}`)}
              >
                {/* Avatar */}
                <div className={styles.cardAvatarWrap}>
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
                  {maid.id_verified && (
                    <span className={styles.verifiedDot} title="ID Verified">
                      ✓
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className={styles.cardInfo}>
                  <div className={styles.cardNameRow}>
                    <p className={styles.cardName}>{maid.name}</p>
                    {maid.id_verified && (
                      <span className={styles.verifiedTag}>✓ Verified</span>
                    )}
                  </div>

                  {maid.location && (
                    <p className={styles.cardLocation}>📍 {maid.location}</p>
                  )}

                  {/* Distance — shown when location is active */}
                  {geoStatus === "ok" &&
                    (dist != null ? (
                      <p className={styles.cardDistance}>
                        🗺{" "}
                        {dist < 1
                          ? `${(dist * 1000).toFixed(0)} m away`
                          : `${dist.toFixed(1)} km away`}
                      </p>
                    ) : (
                      <p className={styles.cardDistanceUnknown}>
                        📍 Location not set by maid
                      </p>
                    ))}

                  {/* Services */}
                  {maid.services?.length > 0 && (
                    <div className={styles.cardTags}>
                      {maid.services.slice(0, 3).map((sv) => (
                        <span key={sv} className={styles.tag}>
                          {sv}
                        </span>
                      ))}
                      {maid.services.length > 3 && (
                        <span className={styles.tagMore}>
                          +{maid.services.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Rating + rate */}
                  <div className={styles.cardMeta}>
                    <div>
                      <span className={styles.cardRating}>
                        ★ {Number(maid.rating || 0).toFixed(1)}
                      </span>
                      <span className={styles.cardReviews}>
                        ({maid.total_reviews || 0})
                      </span>
                    </div>
                    <div>
                      <span className={styles.cardRate}>
                        {s}
                        {rate.toLocaleString()}/hr
                      </span>
                      {maid.rate_daily && (
                        <span className={styles.cardRateAlt}>
                          {" · "}
                          {s}
                          {Number(maid.rate_daily).toLocaleString()}/day
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className={styles.bookBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${maid.id}`, { state: { maid } });
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
