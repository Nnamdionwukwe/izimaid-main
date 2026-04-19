import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MaidDashboard.module.css";
import { useAuth } from "../../context/AuthContext";
import MaidSupportTab from "../MaidsupportTab/Maidsupporttab";
import MaidChat from "../MaidChat/MaidChat";
import FloatingMaidSupportChat from "../MaidSupportChat/FloatingMaidSupportChat";
import NotificationBell from "../Notifications/NotificationBell";
import WithdrawTab, { WalletOverview } from "../WithdrawTab/WithdrawPage";
import WithdrawPage from "../WithdrawTab/WithdrawPage";
import EarningsTab from "../EarningsTab/EarningsTab";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// At the top of ProfileTab (or at the top of MaidDashboard.jsx alongside API_URL), add:
const API = (() => {
  const raw = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  return raw.replace(/\/$/, "").replace(/\/api$/, "") + "/api";
})();

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
// ─── Profile Tab ──────────────────────────────────────────────
// Drop-in replacement for the ProfileTab function inside MaidDashboard.jsx
// Uses existing MaidDashboard.module.css classes — no inline style overload

// ─── Profile Tab ──────────────────────────────────────────────
// Full version — covers all controller endpoints:
//   updateProfile  (bio, rates, currency, location, services, availability)
//   getMaidAvailability / setMaidAvailability
//   uploadMaidDocument / getMaidDocuments
// Drop-in replacement inside MaidDashboard.jsx

const WORLD_CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "RWF", name: "Rwandan Franc", symbol: "FRw" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "MAD" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "QAR", name: "Qatari Riyal", symbol: "QR" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DOC_TYPES = [
  { value: "national_id", label: "National ID", icon: "🪪" },
  { value: "passport", label: "Passport", icon: "📘" },
  { value: "drivers_license", label: "Driver's License", icon: "🚗" },
  { value: "utility_bill", label: "Utility Bill", icon: "🏠" },
];

function ProfileTab({ token }) {
  const { user, updateUser } = useAuth();

  // ── Profile fields ──────────────────────────────────────────
  const [profile, setProfile] = useState({
    bio: "",
    hourly_rate: "",
    years_exp: "",
    services: [],
    location: "",
    // Pricing
    rate_hourly: "",
    rate_daily: "",
    rate_weekly: "",
    rate_monthly: "",
    pricing_note: "",
    currency: "NGN",
  });

  // ── Availability ────────────────────────────────────────────
  // { 0: {enabled:false,start:"09:00",end:"17:00"}, 1:..., ... }
  const [avail, setAvail] = useState(
    Object.fromEntries(
      DAYS.map((_, i) => [i, { enabled: false, start: "09:00", end: "17:00" }]),
    ),
  );

  // ── Documents ───────────────────────────────────────────────
  const [docs, setDocs] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(null); // doc_type being uploaded

  // ── UI state ────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingAvail, setSavingAvail] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [availMsg, setAvailMsg] = useState({ type: "", text: "" });
  const [docMsg, setDocMsg] = useState({ type: "", text: "" });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationAttempts, setLocationAttempts] = useState(0);
  const [fullAddress, setFullAddress] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [customServiceInput, setCustomServiceInput] = useState("");
  const [customRates, setCustomRates] = useState([]);

  // ── Load all data on mount ──────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        // 1. Profile
        const r1 = await fetch(`${API}/maids/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d1 = await r1.json();
        if (r1.ok && d1.maid) {
          const m = d1.maid;
          setProfile({
            bio: m.bio || "",
            hourly_rate: m.hourly_rate || "",
            years_exp: m.years_exp || "",
            services: m.services || [],
            location: m.location || "",
            rate_hourly: m.rate_hourly || "",
            rate_daily: m.rate_daily || "",
            rate_weekly: m.rate_weekly || "",
            rate_monthly: m.rate_monthly || "",
            pricing_note: m.pricing_note || "",
            currency: m.currency || "NGN",
          });

          if (m.rate_custom) {
            try {
              const parsed =
                typeof m.rate_custom === "string"
                  ? JSON.parse(m.rate_custom)
                  : m.rate_custom;
              // Expects array of {label, price} or object — normalise both
              if (Array.isArray(parsed)) {
                setCustomRates(parsed);
              } else if (typeof parsed === "object") {
                setCustomRates(
                  Object.entries(parsed).map(([label, price]) => ({
                    label,
                    price: String(price),
                  })),
                );
              }
            } catch {}
          }
        }

        // 2. Availability
        const r2 = await fetch(`${API}/maids/my/availability`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d2 = await r2.json();
        if (r2.ok && d2.availability?.length) {
          const next = { ...avail };
          d2.availability.forEach(({ day_of_week, start_time, end_time }) => {
            next[day_of_week] = {
              enabled: true,
              start: start_time,
              end: end_time,
            };
          });
          setAvail(next);
        }

        // 3. Documents
        const r3 = await fetch(`${API}/maids/my/documents`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d3 = await r3.json();
        if (r3.ok) setDocs(d3.documents || []);
      } catch (err) {
        console.error("ProfileTab load error:", err);
      }
      setLoading(false);
    }
    load();
  }, [user.id, token]);

  useEffect(() => {
    if (user?.avatar) setAvatarPreview(user.avatar);
  }, [user?.avatar]);

  // ── Avatar upload ───────────────────────────────────────────
  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setMsg({ type: "error", text: "Image must be under 5MB" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMsg({ type: "error", text: "Please select an image" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result);
    reader.readAsDataURL(file);

    setUploadingAvatar(true);
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await fetch(`${API}/maids/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAvatarPreview(data.avatar_url);
      updateUser({ ...user, avatar: data.avatar_url });
      setMsg({ type: "success", text: "✅ Profile picture updated!" });
    } catch (err) {
      setAvatarPreview(user?.avatar || null);
      setMsg({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setUploadingAvatar(false);
    }
  }

  // ── Geolocation ─────────────────────────────────────────────
  async function getCurrentLocation() {
    if (!navigator.geolocation) {
      setMsg({
        type: "error",
        text: "Geolocation not supported in this browser",
      });
      return;
    }
    setGettingLocation(true);
    setMsg({ type: "", text: "" });
    setLocationAttempts((n) => n + 1);

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude, accuracy } }) => {
        setCurrentCoords({ latitude, longitude, accuracy });
        setMsg({
          type: "info",
          text: `📍 Found (±${Math.round(accuracy)}m). Looking up address…`,
        });
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );
          const d = await r.json();
          const a = d.address || {};
          const addr = {
            street: a.road || a.house_number || "",
            city: a.city || a.town || a.village || "",
            state: a.state || a.region || a.county || "",
            country: a.country || "",
          };
          const formatted =
            [addr.street, addr.city, addr.state, addr.country]
              .filter(Boolean)
              .join(", ") || d.display_name;
          setFullAddress(addr);
          setProfile((p) => ({ ...p, location: formatted }));
          setMsg({ type: "success", text: `✅ Location: ${formatted}` });
        } catch {
          const c = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setProfile((p) => ({ ...p, location: c }));
          setMsg({
            type: "success",
            text: `✅ Saved coordinates. Try again for street name.`,
          });
        }
        setGettingLocation(false);
      },
      (err) => {
        const msgs = {
          1: "Location denied. Enable it in your browser settings.",
          2: "GPS signal not found. Move outdoors or enable Wi-Fi.",
          3:
            locationAttempts < 3
              ? `Timed out. Retrying (${locationAttempts + 1}/3)…`
              : "Could not get location. Enter manually.",
        };
        setMsg({ type: "error", text: msgs[err.code] || "Location error." });
        if (err.code === 3 && locationAttempts < 3)
          setTimeout(getCurrentLocation, 2000);
        else setLocationAttempts(0);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
    );
  }

  // ── Services toggle ─────────────────────────────────────────
  function toggleService(s) {
    setProfile((p) => ({
      ...p,
      services: p.services.includes(s)
        ? p.services.filter((x) => x !== s)
        : [...p.services, s],
    }));
  }

  // ── Save profile ────────────────────────────────────────────
  async function handleSave() {
    if (!profile.hourly_rate || Number(profile.hourly_rate) <= 0) {
      setMsg({ type: "error", text: "Please enter a valid hourly rate" });
      return;
    }
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API}/maids/profile`, {
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
          rate_hourly: profile.rate_hourly
            ? Number(profile.rate_hourly)
            : undefined,
          rate_daily: profile.rate_daily
            ? Number(profile.rate_daily)
            : undefined,
          rate_weekly: profile.rate_weekly
            ? Number(profile.rate_weekly)
            : undefined,
          rate_monthly: profile.rate_monthly
            ? Number(profile.rate_monthly)
            : undefined,
          pricing_note: profile.pricing_note || undefined,
          currency: profile.currency,

          rate_custom: customRates.length
            ? customRates.reduce((acc, r) => {
                if (r.label.trim()) acc[r.label.trim()] = Number(r.price) || 0;
                return acc;
              }, {})
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "✅ Profile saved!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  function addCustomService() {
    const s = customServiceInput.trim();
    if (!s || profile.services.includes(s)) return;
    setProfile((p) => ({ ...p, services: [...p.services, s] }));
    setCustomServiceInput("");
  }

  function addCustomRate() {
    setCustomRates((r) => [...r, { label: "", price: "" }]);
  }
  function updateCustomRate(i, field, val) {
    setCustomRates((r) =>
      r.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)),
    );
  }
  function removeCustomRate(i) {
    setCustomRates((r) => r.filter((_, idx) => idx !== i));
  }

  // ── Save availability ───────────────────────────────────────
  async function handleSaveAvail() {
    setSavingAvail(true);
    setAvailMsg({ type: "", text: "" });

    const slots = Object.entries(avail)
      .filter(([, v]) => v.enabled)
      .map(([day, v]) => ({
        day_of_week: Number(day),
        start_time: v.start,
        end_time: v.end,
      }));

    try {
      const res = await fetch(`${API}/maids/my/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slots }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAvailMsg({
        type: "success",
        text: `✅ Availability saved — ${slots.length} day(s) active`,
      });
    } catch (err) {
      setAvailMsg({
        type: "error",
        text: err.message || "Failed to save availability",
      });
    } finally {
      setSavingAvail(false);
    }
  }

  // ── Upload document ─────────────────────────────────────────
  async function handleDocUpload(e, docType) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setDocMsg({ type: "error", text: "File must be under 10MB" });
      return;
    }
    setUploadingDoc(docType);
    setDocMsg({ type: "", text: "" });

    const fd = new FormData();
    fd.append("document", file);
    fd.append("doc_type", docType);

    try {
      const res = await fetch(`${API}/maids/my/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh docs list
      const r2 = await fetch(`${API}/maids/my/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d2 = await r2.json();
      if (r2.ok) setDocs(d2.documents || []);

      setDocMsg({
        type: "success",
        text: `✅ ${DOC_TYPES.find((d) => d.value === docType)?.label} submitted for review`,
      });
    } catch (err) {
      setDocMsg({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setUploadingDoc(null);
    }
  }

  // ── Helpers ─────────────────────────────────────────────────
  const msgClass = {
    success: styles.successMsg,
    error: styles.errorMsg,
    warning: styles.warningMsg,
    info: styles.infoMsg,
  };
  const docStatus = Object.fromEntries(docs.map((d) => [d.doc_type, d]));
  const statusBadge = { pending: "🟡", approved: "✅", rejected: "❌" };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div>
      <p className={styles.sectionTitle}>My Profile</p>

      {msg.text && (
        <div className={`${styles.msgBanner} ${msgClass[msg.type]}`}>
          {msg.text}
        </div>
      )}

      <div className={styles.form}>
        {/* ══ SECTION: Profile Photo ════════════════════════════ */}
        <div className={styles.profileSection}>
          <p className={styles.profileSectionTitle}>📸 Profile Photo</p>

          <div className={styles.field}>
            <div className={styles.avatarRow}>
              <div className={styles.avatarPreview}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className={styles.avatarImg}
                    onError={() => setAvatarPreview(null)}
                  />
                ) : (
                  <span className={styles.avatarInitials}>
                    {initials(user.name)}
                  </span>
                )}
                {uploadingAvatar && (
                  <div className={styles.avatarOverlay}>📤</div>
                )}
              </div>
              <div className={styles.avatarActions}>
                <label
                  className={`${styles.avatarUploadBtn} ${uploadingAvatar ? styles.avatarUploadBtnDisabled : ""}`}
                >
                  {uploadingAvatar ? "Uploading…" : "📸 Change Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    style={{ display: "none" }}
                  />
                </label>
                <p className={styles.avatarHint}>JPG or PNG · Max 5 MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══ SECTION: Basic Info ═══════════════════════════════ */}
        <div className={styles.profileSection}>
          <p className={styles.profileSectionTitle}>👤 Basic Information</p>

          <div className={styles.field}>
            <label className={styles.label}>Bio</label>
            <textarea
              className={styles.textarea}
              placeholder="Tell customers about yourself, your experience, and what makes you great…"
              value={profile.bio}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bio: e.target.value }))
              }
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Location</label>
              <button
                type="button"
                className={styles.locationBtn}
                onClick={getCurrentLocation}
                disabled={gettingLocation}
              >
                {gettingLocation
                  ? "📍 Getting location…"
                  : "📍 Use current location"}
              </button>
            </div>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Lekki Phase 1, Lagos, Nigeria"
              value={profile.location}
              onChange={(e) =>
                setProfile((p) => ({ ...p, location: e.target.value }))
              }
            />
            {fullAddress && (fullAddress.street || fullAddress.city) && (
              <div className={styles.addressDetail}>
                <p className={styles.addressDetailTitle}>
                  📍 Detected address:
                </p>
                {fullAddress.street && <p>🏠 {fullAddress.street}</p>}
                {fullAddress.city && <p>🏙️ {fullAddress.city}</p>}
                {fullAddress.state && <p>📌 {fullAddress.state}</p>}
                {fullAddress.country && <p>🌍 {fullAddress.country}</p>}
                {currentCoords && (
                  <p>
                    🛰 {currentCoords.latitude.toFixed(4)},{" "}
                    {currentCoords.longitude.toFixed(4)} (±
                    {Math.round(currentCoords.accuracy)}m)
                  </p>
                )}
              </div>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Years Experience</label>
              <input
                className={styles.input}
                type="number"
                placeholder="e.g. 3"
                min="0"
                value={profile.years_exp}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, years_exp: e.target.value }))
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Preferred Currency</label>
              <select
                className={styles.input}
                value={profile.currency}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, currency: e.target.value }))
                }
              >
                {WORLD_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ══ SECTION: Pricing ══════════════════════════════════ */}
        <div className={styles.profileSection}>
          <p className={styles.profileSectionTitle}>💰 Pricing Rates</p>
          <p className={styles.profileSectionDesc}>
            Set your rates per hour, day, week, or month. Customers will see all
            rates you fill in. Currency: <strong>{profile.currency}</strong>
          </p>

          <div className={styles.ratesGrid}>
            <div className={styles.field}>
              <label className={styles.label}>
                Hourly Rate * <span className={styles.rateTag}>/ hr</span>
              </label>
              <input
                className={styles.input}
                type="number"
                placeholder="e.g. 3000"
                min="0"
                value={profile.hourly_rate}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, hourly_rate: e.target.value }))
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Daily Rate <span className={styles.rateTag}>/ day</span>
              </label>
              <input
                className={styles.input}
                type="number"
                placeholder="e.g. 15000"
                min="0"
                value={profile.rate_daily}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, rate_daily: e.target.value }))
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Weekly Rate <span className={styles.rateTag}>/ week</span>
              </label>
              <input
                className={styles.input}
                type="number"
                placeholder="e.g. 60000"
                min="0"
                value={profile.rate_weekly}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, rate_weekly: e.target.value }))
                }
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Monthly Rate <span className={styles.rateTag}>/ month</span>
              </label>
              <input
                className={styles.input}
                type="number"
                placeholder="e.g. 200000"
                min="0"
                value={profile.rate_monthly}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, rate_monthly: e.target.value }))
                }
              />
            </div>
          </div>

          <div className={styles.field} style={{ marginTop: 12 }}>
            <label className={styles.label}>
              Pricing Note{" "}
              <span className={styles.labelOptional}>(optional)</span>
            </label>
            <textarea
              className={styles.textarea}
              rows={2}
              placeholder="e.g. Rates may vary for deep cleaning, large homes, or same-day bookings."
              value={profile.pricing_note}
              onChange={(e) =>
                setProfile((p) => ({ ...p, pricing_note: e.target.value }))
              }
            />
          </div>

          {/* ══ Custom rates ═════════════════════════════════ */}
          <div className={styles.field} style={{ marginTop: 16 }}>
            <div className={styles.labelRow}>
              <label className={styles.label}>
                Custom Rates
                <span className={styles.labelOptional}> (optional)</span>
              </label>
              <button
                type="button"
                className={styles.locationBtn}
                onClick={addCustomRate}
              >
                + Add rate
              </button>
            </div>

            {customRates.length === 0 && (
              <p style={{ fontSize: 12, color: "gray", margin: 0 }}>
                e.g. Deep Clean, Move-In Clean, Office Clean with specific
                pricing
              </p>
            )}

            {customRates.map((r, i) => (
              <div key={i} className={styles.customRateRow}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Service name"
                  value={r.label}
                  onChange={(e) => updateCustomRate(i, "label", e.target.value)}
                />
                <input
                  className={styles.input}
                  type="number"
                  placeholder="Price"
                  min="0"
                  value={r.price}
                  style={{ maxWidth: 120 }}
                  onChange={(e) => updateCustomRate(i, "price", e.target.value)}
                />
                <button
                  type="button"
                  className={styles.removeRateBtn}
                  onClick={() => removeCustomRate(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ══ SECTION: Services ═════════════════════════════════ */}
        {/* ══ SECTION: Services ═════════════════════════════════ */}
        <div className={styles.profileSection}>
          <p className={styles.profileSectionTitle}>
            🧹 Services Offered
            {profile.services.length > 0 && (
              <span className={styles.labelCount}>
                {" "}
                · {profile.services.length} selected
              </span>
            )}
          </p>

          {/* Preset services grid */}
          <div className={styles.serviceGrid}>
            {SERVICES_LIST.map((s) => {
              const selected = profile.services.includes(s);
              return (
                <div
                  key={s}
                  className={`${styles.serviceItem} ${selected ? styles.serviceItemActive : ""}`}
                  onClick={() => toggleService(s)}
                >
                  <div
                    className={`${styles.serviceCheck} ${selected ? styles.serviceCheckActive : ""}`}
                  >
                    {selected && "✓"}
                  </div>
                  {s}
                </div>
              );
            })}
          </div>

          {/* ── Custom services chips (services NOT in SERVICES_LIST) ── */}
          {profile.services.filter((s) => !SERVICES_LIST.includes(s)).length >
            0 && (
            <div className={styles.customChips}>
              {profile.services
                .filter((s) => !SERVICES_LIST.includes(s))
                .map((s) => (
                  <span key={s} className={styles.customChip}>
                    {s}
                    <button
                      type="button"
                      className={styles.customChipRemove}
                      onClick={() => toggleService(s)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
            </div>
          )}

          {/* ── Add custom service input ── */}
          <div className={styles.customServiceRow}>
            <input
              className={styles.input}
              type="text"
              placeholder="Add a custom service e.g. Fumigation, Exterior Cleaning…"
              value={customServiceInput}
              onChange={(e) => setCustomServiceInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCustomService())
              }
            />
            <button
              type="button"
              className={styles.addCustomBtn}
              onClick={addCustomService}
              disabled={!customServiceInput.trim()}
            >
              + Add
            </button>
          </div>
        </div>

        {/* ── Save profile button ──────────────────────────────── */}
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>

      {/* ══ SECTION: Availability ════════════════════════════════ */}
      <div className={styles.form} style={{ marginTop: 24 }}>
        <div className={styles.profileSection}>
          <p className={styles.profileSectionTitle}>🗓 Weekly Availability</p>
          <p className={styles.profileSectionDesc}>
            Set which days and hours you're available for bookings.
          </p>

          {availMsg.text && (
            <div className={`${styles.msgBanner} ${msgClass[availMsg.type]}`}>
              {availMsg.text}
            </div>
          )}

          <div className={styles.availGrid}>
            {DAYS.map((day, i) => (
              <div
                key={i}
                className={`${styles.availRow} ${avail[i].enabled ? styles.availRowActive : ""}`}
              >
                <div className={styles.availDayToggle}>
                  <button
                    type="button"
                    className={`${styles.availToggleBtn} ${avail[i].enabled ? styles.availToggleBtnOn : ""}`}
                    onClick={() =>
                      setAvail((a) => ({
                        ...a,
                        [i]: { ...a[i], enabled: !a[i].enabled },
                      }))
                    }
                  >
                    <span className={styles.availToggleKnob} />
                  </button>
                  <span
                    className={`${styles.availDayLabel} ${avail[i].enabled ? styles.availDayLabelActive : ""}`}
                  >
                    {day}
                  </span>
                </div>

                {avail[i].enabled ? (
                  <div className={styles.availTimes}>
                    <input
                      type="time"
                      className={styles.timeInput}
                      value={avail[i].start}
                      onChange={(e) =>
                        setAvail((a) => ({
                          ...a,
                          [i]: { ...a[i], start: e.target.value },
                        }))
                      }
                    />
                    <span className={styles.timeSep}>→</span>
                    <input
                      type="time"
                      className={styles.timeInput}
                      value={avail[i].end}
                      onChange={(e) =>
                        setAvail((a) => ({
                          ...a,
                          [i]: { ...a[i], end: e.target.value },
                        }))
                      }
                    />
                  </div>
                ) : (
                  <span className={styles.availOff}>Not available</span>
                )}
              </div>
            ))}
          </div>

          <button
            className={styles.saveBtn}
            onClick={handleSaveAvail}
            disabled={savingAvail}
            style={{ marginTop: 16 }}
          >
            {savingAvail ? "Saving…" : "Save Availability"}
          </button>
        </div>
      </div>

      {/* ══ SECTION: Identity Documents ══════════════════════════ */}
      <div className={styles.form} style={{ marginTop: 24, paddingBottom: 24 }}>
        <div className={styles.profileSection}>
          <p className={styles.profileSectionTitle}>🪪 Identity Verification</p>
          <p className={styles.profileSectionDesc}>
            Upload a valid document to get your profile verified. Verified maids
            appear higher in search results.
          </p>

          {docMsg.text && (
            <div className={`${styles.msgBanner} ${msgClass[docMsg.type]}`}>
              {docMsg.text}
            </div>
          )}

          <div className={styles.docsGrid}>
            {DOC_TYPES.map(({ value, label, icon }) => {
              const existing = docStatus[value];
              const status = existing?.status;
              const isUpload = uploadingDoc === value;

              return (
                <div
                  key={value}
                  className={`${styles.docCard} ${status === "approved" ? styles.docCardApproved : status === "rejected" ? styles.docCardRejected : status === "pending" ? styles.docCardPending : ""}`}
                >
                  <div className={styles.docCardTop}>
                    <span className={styles.docIcon}>{icon}</span>
                    <div>
                      <p className={styles.docLabel}>{label}</p>
                      {status ? (
                        <span
                          className={`${styles.docStatus} ${styles[`docStatus_${status}`]}`}
                        >
                          {statusBadge[status]}{" "}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      ) : (
                        <span className={styles.docStatusNone}>
                          Not submitted
                        </span>
                      )}
                    </div>
                  </div>

                  {existing?.admin_notes && status === "rejected" && (
                    <p className={styles.docNote}>💬 {existing.admin_notes}</p>
                  )}

                  {status !== "approved" && (
                    <label
                      className={`${styles.docUploadBtn} ${isUpload ? styles.docUploadBtnLoading : ""}`}
                    >
                      {isUpload
                        ? "Uploading…"
                        : status === "rejected"
                          ? "Re-upload"
                          : "Upload"}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        disabled={isUpload}
                        onChange={(e) => handleDocUpload(e, value)}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>

          <p className={styles.docHint}>
            Accepted formats: JPG, PNG, PDF · Max 10 MB per file. Processing
            usually takes 1–2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Decline Modal ────────────────────────────────────────────
function DeclineConfirmModal({ booking, onConfirm, onCancel, isLoading }) {
  const [reason, setReason] = useState("");
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />
        <div style={{ textAlign: "center", paddingTop: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
            Decline Booking?
          </h2>
          <p
            style={{
              color: "rgb(100,100,100)",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Customer: <strong>{booking.customer_name}</strong>
          </p>
          <p
            style={{
              color: "rgb(100,100,100)",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            {formatDate(booking.service_date)}
          </p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: "bold",
              marginBottom: 6,
              color: "rgb(47,47,47)",
            }}
          >
            Reason for declining (optional)
          </label>
          <textarea
            style={{
              width: "100%",
              border: "1px solid rgb(228,228,228)",
              borderRadius: "8px",
              padding: "10px",
              fontSize: 13,
              fontFamily: "inherit",
              minHeight: "80px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
            placeholder="Let the customer know why you're declining..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className={styles.modalActions}>
          <button
            className={styles.modalBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            Keep Booking
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnDanger}`}
            onClick={() => onConfirm(booking.id, reason)}
            disabled={isLoading}
            style={{
              background: isLoading ? "rgb(200,100,100)" : "rgb(187,19,47)",
            }}
          >
            {isLoading ? "Declining..." : "Decline Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Floating Toast ───────────────────────────────────────────
function FloatingToast({ message, type, visible }) {
  if (!visible) return null;
  const base = {
    position: "fixed",
    bottom: 24,
    right: 24,
    padding: "14px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    maxWidth: 400,
    zIndex: 10000,
    animation: "slideIn 0.3s ease-in-out",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  };
  const types = {
    success: { background: "rgb(209,247,224)", color: "rgb(10,107,46)" },
    error: { background: "rgb(255,228,228)", color: "rgb(168,28,28)" },
    warning: { background: "rgb(255,243,205)", color: "rgb(133,100,4)" },
    info: { background: "rgb(209,236,255)", color: "rgb(10,76,140)" },
  };
  return (
    <>
      <style>{`@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={{ ...base, ...(types[type] || types.info) }}>{message}</div>
    </>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────
function BookingsTab({ token, onDeclineMessage, onGetSupport, onOpenChat }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [declineModal, setDeclineModal] = useState(null);
  const [isDeclining, setIsDeclining] = useState(false);

  const navigate = useNavigate();

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
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
    setLoading(false);
  }, [filter, token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const token_val = localStorage.getItem("token");
    if (!token_val) return;
    const id = setInterval(async () => {
      try {
        const params = new URLSearchParams({ limit: 50 });
        if (filter !== "all") params.set("status", filter);
        const res = await fetch(`${API_URL}/api/bookings?${params}`, {
          headers: { Authorization: `Bearer ${token_val}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Background refresh error:", err);
      }
    }, 30000);
    return () => clearInterval(id);
  }, [filter]);

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
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  }

  async function handleDecline(bookingId, reason) {
    setIsDeclining(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "declined",
          declined_reason: reason || undefined,
          declined_by: "maid",
        }),
      });
      if (res.ok) {
        setDeclineModal(null);
        fetchBookings();
        onDeclineMessage({
          message: "✅ Booking declined. Customer has been notified.",
          type: "success",
        });
      } else
        onDeclineMessage({
          message: "❌ Failed to decline booking. Please try again.",
          type: "error",
        });
    } catch {
      onDeclineMessage({
        message: "❌ Error declining booking. Please try again.",
        type: "error",
      });
    } finally {
      setIsDeclining(false);
    }
  }

  const FILTERS = [
    "all",
    "pending",
    "confirmed",
    "in_progress",
    "completed",
    "declined",
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
            <div
              onClick={() =>
                navigate(`/bookings/${b.id}`, { state: { booking: b } })
              }
              key={b.id}
              className={styles.bookingCard}
            >
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
                  {b.status === "in_progress"
                    ? "In Progress"
                    : b.status?.replace("_", " ")}
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
                    ₦{Number(b.total_amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  Address: <span className={styles.metaValue}>{b.address}</span>
                </div>
              </div>
              {b.status === "declined" && b.declined_reason && (
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(255,243,205)",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    fontSize: "12px",
                    color: "rgb(100,80,0)",
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontWeight: "bold" }}>
                    Decline reason:
                  </p>
                  <p style={{ margin: 0 }}>{b.declined_reason}</p>
                </div>
              )}
              <div className={styles.bookingActions}>
                {b.status === "pending" && (
                  <>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      onClick={() => updateStatus(b.id, "confirmed")}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => setDeclineModal(b)}
                    >
                      Decline
                    </button>
                  </>
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
                {b.status === "declined" && (
                  <p style={{ fontSize: 12, color: "gray", margin: 0 }}>
                    Declined on {formatDate(b.updated_at)}
                  </p>
                )}
                {["pending", "confirmed", "in_progress", "completed"].includes(
                  b.status,
                ) && (
                  <button
                    className={styles.actionBtn}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      color: "white",
                      background: "rgb(19,19,103)",
                      borderColor: "rgb(19,19,103)",
                      fontSize: 12,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenChat(b);
                    }}
                  >
                    💬 Chat Customer
                  </button>
                )}
                <button
                  className={styles.actionBtn}
                  style={{
                    marginLeft: "auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    color: "rgb(19,19,103)",
                    borderColor: "rgb(200,210,240)",
                    background: "rgb(245,245,255)",
                    fontSize: 12,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGetSupport(b);
                  }}
                >
                  🎫 Get Support
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {declineModal && (
        <DeclineConfirmModal
          booking={declineModal}
          onConfirm={handleDecline}
          onCancel={() => setDeclineModal(null)}
          isLoading={isDeclining}
        />
      )}
    </div>
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────
function ReviewsTab({ token }) {
  const { user } = useAuth();
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
  }, [user.id, token]);

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
          {reviews.map((r) => (
            <div key={r.id ?? r.created_at} className={styles.reviewCard}>
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
  const { user, token, logout } = useAuth();

  const [tab, setTab] = useState("bookings");
  const [available, setAvailable] = useState(true);
  const [savingAvail, setSavingAvail] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    earnings: 0,
  });
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [supportPrefill, setSupportPrefill] = useState(null);
  const [chatBooking, setChatBooking] = useState(null);
  const [supportOpenCount, setSupportOpenCount] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);

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
    async function loadSupportCount() {
      try {
        const res = await fetch(`${API_URL}/api/maid-support?limit=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const tickets = data.tickets || [];
        setSupportOpenCount(
          tickets.filter(
            (t) => t.status === "open" || t.status === "in_progress",
          ).length,
        );
      } catch {}
    }
    loadProfile();
    loadStats();
    loadSupportCount();
  }, [token, user, navigate]);

  useEffect(() => {
    const token_val = localStorage.getItem("token");
    if (!token_val) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/bookings?limit=200`, {
          headers: { Authorization: `Bearer ${token_val}` },
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
      } catch (err) {
        console.error("Background refresh error:", err);
      }
      try {
        const sr = await fetch(`${API_URL}/api/maid-support?limit=50`, {
          headers: { Authorization: `Bearer ${token_val}` },
        });
        const sd = await sr.json();
        const st = sd.tickets || [];
        setSupportOpenCount(
          st.filter((t) => t.status === "open" || t.status === "in_progress")
            .length,
        );
      } catch {}
    }, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(
        () => setToast({ ...toast, visible: false }),
        4000,
      );
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  function handleDeclineMessage({ message, type }) {
    setToast({ visible: true, message, type });
  }
  function handleOpenChat(booking) {
    setChatBooking(booking);
  }
  function handleGetSupport(booking) {
    setSupportPrefill(booking);
    setTab("support");
  }

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

  function handleLogout() {
    logout();
    onLogout?.();
  }

  if (chatBooking) {
    return (
      <MaidChat
        bookingId={chatBooking.id}
        otherName={chatBooking.customer_name}
        otherAvatar={chatBooking.customer_avatar}
        onClose={() => setChatBooking(null)}
      />
    );
  }

  if (showWithdraw)
    return (
      <WithdrawPage token={token} onClose={() => setShowWithdraw(false)} />
    );

  return (
    <>
      <div className={styles.dashboard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {user.avatar ? (
              <img
                onClick={() => navigate("/settings")}
                src={user.avatar}
                alt={user.name}
                className={styles.headerAvatar}
                onError={(ev) => {
                  ev.target.style.display = "none";
                }}
              />
            ) : (
              <div className={styles.headerAvatarPlaceholder}>
                {initials(user.name)}
              </div>
            )}
            <div>
              <p className={styles.headerName}>{user.name}</p>
              <p className={styles.headerRole}>Maid · Deusizi Sparkle</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <NotificationBell token={token} />
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Availability */}
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
            ["earnings", "Earnings"],
            ["wallet", "Wallet"],
            ["withdraw", "Withdraw "],
            ["reviews", "Reviews"],
            ["support", "Support"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`${styles.tab} ${tab === key ? styles.tabActive : ""}`}
              onClick={() => {
                setTab(key);
                if (key !== "support") setSupportPrefill(null);
              }}
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
              {key === "support" && supportOpenCount > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    background: "rgb(19,19,103)",
                    color: "white",
                    fontSize: 10,
                    padding: "1px 6px",
                    borderRadius: 10,
                    fontWeight: "bold",
                  }}
                >
                  {supportOpenCount > 99 ? "99+" : supportOpenCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {tab === "bookings" && (
            <BookingsTab
              token={token}
              onDeclineMessage={handleDeclineMessage}
              onGetSupport={handleGetSupport}
              onOpenChat={handleOpenChat}
            />
          )}
          {tab === "profile" && <ProfileTab token={token} />}
          {tab === "reviews" && <ReviewsTab token={token} />}
          {tab === "support" && (
            <MaidSupportTab token={token} prefillBooking={supportPrefill} />
          )}
          {tab === "withdraw" && <WithdrawTab token={token} />}
          {tab === "wallet" && (
            <WalletOverview
              token={token}
              onWithdraw={() => setShowWithdraw(true)}
            />
          )}
          {tab === "earnings" && <EarningsTab token={token} />}
        </div>

        <FloatingToast
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
        />
      </div>

      {/* Floating maid support chat — only renders for logged-in maids */}
      <FloatingMaidSupportChat />
    </>
  );
}
