// ─── Profile Tab ──────────────────────────────────────────────
// Full version — covers all controller endpoints:
//   updateProfile  (bio, rates, currency, location, services, availability)
//   getMaidAvailability / setMaidAvailability
//   uploadMaidDocument / getMaidDocuments
// Drop-in replacement inside MaidDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./ProfileTab.module.css";

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

export default function ProfileTab({ token }) {
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

  // ── Load all data on mount ──────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        // 1. Profile
        const r1 = await fetch(`${API_URL}/maids/${user.id}`, {
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
        }

        // 2. Availability
        const r2 = await fetch(`${API_URL}/maids/${user.id}/availability`, {
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
        const r3 = await fetch(`${API_URL}/maids/documents`, {
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
      const res = await fetch(`${API_URL}/maids/avatar`, {
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
      const res = await fetch(`${API_URL}/maids/profile`, {
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
      const res = await fetch(`${API_URL}/maids/availability`, {
        method: "POST",
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
      const res = await fetch(`${API_URL}/maids/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh docs list
      const r2 = await fetch(`${API_URL}/maids/documents`, {
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
        </div>

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
