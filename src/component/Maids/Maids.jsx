// src/component/Maids/Maids.jsx
import { useState, useEffect, useRef } from "react";
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

export default function Maids() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [maids, setMaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("location") || "");
  const [service, setService] = useState("All");
  const [sortBy, setSortBy] = useState("rating"); // "rating"|"rate_asc"|"distance"
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [geoStatus, setGeoStatus] = useState("idle"); // "idle"|"loading"|"ok"|"denied"
  const [geoError, setGeoError] = useState("");

  // ── Fetch whenever service or coords change ──────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchMaids() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (service !== "All") params.set("service", service);
        if (coords) {
          params.set("lat", String(coords.lat));
          params.set("lng", String(coords.lng));
          params.set("radius_km", "150");
        }
        const res = await fetch(`${API_URL}/api/maids?${params}`);
        const data = await res.json();
        if (!cancelled) setMaids(data.maids || []);
      } catch (err) {
        console.error("fetchMaids error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMaids();
    return () => {
      cancelled = true;
    };
  }, [service, coords]);

  // ── Geolocation ──────────────────────────────────────────────────
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
            ? "Location denied. Please allow location access in your browser."
            : "Could not get location. Try again or search manually.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  function clearLocation() {
    setCoords(null);
    setSortBy("rating");
    setGeoStatus("idle");
    setGeoError("");
  }

  // ── Filter ───────────────────────────────────────────────────────
  const filtered = maids.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) || m.location?.toLowerCase().includes(q)
    );
  });

  // ── Sort ─────────────────────────────────────────────────────────
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "distance") {
      // Both have distance from backend when coords are sent
      const da = Number(a.distance_km ?? 9999);
      const db = Number(b.distance_km ?? 9999);
      return da - db;
    }
    if (sortBy === "rate_asc") {
      return (
        Number(a.hourly_rate || a.rate_hourly || 0) -
        Number(b.hourly_rate || b.rate_hourly || 0)
      );
    }
    // Default: rating DESC
    return Number(b.rating || 0) - Number(a.rating || 0);
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

      {/* ── Search + location ─────────────────────────────────── */}
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

      {/* Geo error */}
      {geoError && <p className={styles.geoError}>⚠️ {geoError}</p>}

      {/* ── Service chips ─────────────────────────────────────── */}
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

      {/* ── Sort row ──────────────────────────────────────────── */}
      <div className={styles.sortRow}>
        <span className={styles.sortLabel}>Sort:</span>
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
          className={`${styles.sortBtn} ${sortBy === "distance" ? styles.sortBtnActive : ""} ${!coords ? styles.sortBtnDisabled : ""}`}
          onClick={() => (coords ? setSortBy("distance") : handleUseLocation())}
          title={!coords ? "Enable location first" : "Sort by distance"}
        >
          📍 {coords ? "Nearest" : "Nearest (enable location)"}
        </button>
      </div>

      {/* ── Results count ─────────────────────────────────────── */}
      {!loading && (
        <p className={styles.resultsCount}>
          {sorted.length} maid{sorted.length !== 1 ? "s" : ""} found
          {coords ? " near you" : ""}
        </p>
      )}

      {/* ── Maid grid ─────────────────────────────────────────── */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Finding maids{coords ? " near you" : ""}…</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className={styles.empty}>
          No maids found.
          {search && <> Try removing the search filter.</>}
          {coords && <> Try increasing the search radius.</>}
        </div>
      ) : (
        <div className={styles.grid}>
          {sorted.map((maid) => {
            const currency = maid.currency || "NGN";
            const s = sym(currency);
            const rate = Number(maid.hourly_rate || maid.rate_hourly || 0);
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

                {/* Info */}
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

                  {/* Distance — only shown when coords are active */}
                  {coords && maid.distance_km != null && (
                    <p className={styles.cardDistance}>
                      🗺 {Number(maid.distance_km).toFixed(1)} km away
                    </p>
                  )}

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
                          {" "}
                          · {s}
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
