// src/component/Booking/Booking.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Booking.module.css";

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

function extractAddressDetails(data) {
  const address = data.address || {};
  return {
    street: address.road || address.house_number || "",
    city: address.city || address.town || address.village || "",
    state: address.state || address.region || address.county || "",
    country: address.country || "",
    postalCode: address.postcode || "",
    displayName: data.display_name || "",
  };
}
function formatAddress(a) {
  return (
    [a.street, a.city, a.state, a.country].filter(Boolean).join(", ") ||
    a.displayName
  );
}

// ── Duration config per rate type ────────────────────────────────────
const DURATION_CONFIG = {
  hourly: {
    label: "Hours",
    min: 1,
    max: 24,
    step: 0.5,
    default: "2",
    unit: "hr",
    toHours: (n) => n,
  },
  daily: {
    label: "Days",
    min: 1,
    max: 31,
    step: 1,
    default: "1",
    unit: "day",
    toHours: (n) => n * 8,
  },
  weekly: {
    label: "Weeks",
    min: 1,
    max: 52,
    step: 1,
    default: "1",
    unit: "week",
    toHours: (n) => n * 40,
  },
  monthly: {
    label: "Months",
    min: 1,
    max: 12,
    step: 1,
    default: "1",
    unit: "month",
    toHours: (n) => n * 160,
  },
  custom: {
    label: "Units",
    min: 1,
    max: 999,
    step: 1,
    default: "1",
    unit: "",
    toHours: (n) => n,
  },
};

// Negotiated duration unit options
const NEGOT_UNITS = [
  { value: "hours", label: "Hours", toHours: (n) => n },
  { value: "days", label: "Days", toHours: (n) => n * 8 },
  { value: "weeks", label: "Weeks", toHours: (n) => n * 40 },
  { value: "months", label: "Months", toHours: (n) => n * 160 },
];

function buildRateOptions(maid, s) {
  const options = [];
  const hourly = Number(maid.rate_hourly || maid.hourly_rate || 0);
  const daily = Number(maid.rate_daily || 0);
  const weekly = Number(maid.rate_weekly || 0);
  const monthly = Number(maid.rate_monthly || 0);

  if (hourly > 0)
    options.push({
      id: "hourly",
      label: "Hourly",
      icon: "⏱",
      price: hourly,
      unit: "/hr",
      rateType: "hourly",
    });
  if (daily > 0)
    options.push({
      id: "daily",
      label: "Daily",
      icon: "📅",
      price: daily,
      unit: "/day",
      rateType: "daily",
    });
  if (weekly > 0)
    options.push({
      id: "weekly",
      label: "Weekly",
      icon: "🗓",
      price: weekly,
      unit: "/week",
      rateType: "weekly",
    });
  if (monthly > 0)
    options.push({
      id: "monthly",
      label: "Monthly",
      icon: "📆",
      price: monthly,
      unit: "/month",
      rateType: "monthly",
    });

  if (maid.rate_custom) {
    try {
      const parsed =
        typeof maid.rate_custom === "string"
          ? JSON.parse(maid.rate_custom)
          : maid.rate_custom;
      Object.entries(parsed).forEach(([label, price]) => {
        if (Number(price) > 0) {
          options.push({
            id: `custom_${label}`,
            label,
            icon: "✨",
            price: Number(price),
            unit: "",
            rateType: "custom",
            customLabel: label,
          });
        }
      });
    } catch {}
  }

  options.push({
    id: "negotiated",
    label: "Custom / Negotiated",
    icon: "🤝",
    price: null,
    unit: "",
    rateType: "negotiated",
    desc: "Enter the price and duration you've agreed with the maid",
  });

  return options;
}

export default function Booking() {
  const { maidId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const maid = state?.maid || {};

  const currency = maid.currency || "NGN";
  const s = sym(currency);
  const rateOptions = buildRateOptions(maid, s);

  const [selectedRateId, setSelectedRateId] = useState(
    rateOptions[0]?.id || "hourly",
  );
  const [duration, setDuration] = useState("2"); // for all rate types
  const [negotiatedPrice, setNegotiatedPrice] = useState("");
  const [negotiatedQty, setNegotiatedQty] = useState("2"); // how many units
  const [negotiatedUnit, setNegotiatedUnit] = useState("hours"); // hours|days|weeks|months

  const [form, setForm] = useState({
    service_date: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedAddress, setDetectedAddress] = useState(null);
  const [success, setSuccess] = useState(null);

  const selected = rateOptions.find((r) => r.id === selectedRateId);
  const durConfig =
    DURATION_CONFIG[selected?.rateType] || DURATION_CONFIG.hourly;

  // Reset duration to sensible default when rate type changes
  useEffect(() => {
    const cfg = DURATION_CONFIG[selected?.rateType];
    if (cfg) setDuration(cfg.default);
  }, [selectedRateId]);

  useEffect(() => {
    if (success) navigate("/payment", { state: { booking: success } });
  }, [success]);

  // ── Total calculation ─────────────────────────────────────────────
  function calcTotal() {
    if (!selected) return 0;
    if (selected.rateType === "negotiated") return Number(negotiatedPrice) || 0;
    if (selected.rateType === "custom")
      return selected.price * Number(duration || 1);
    return selected.price * Number(duration || 0);
  }

  function calcDurationHours() {
    if (selected?.rateType === "negotiated") {
      const unitCfg = NEGOT_UNITS.find((u) => u.value === negotiatedUnit);
      return unitCfg
        ? unitCfg.toHours(Number(negotiatedQty) || 1)
        : Number(negotiatedQty) || 1;
    }
    const cfg = DURATION_CONFIG[selected?.rateType];
    return cfg ? cfg.toHours(Number(duration) || 1) : Number(duration) || 1;
  }

  const total = calcTotal();

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  }

  // ── Geolocation ───────────────────────────────────────────────────
  function getCurrentLocation() {
    setGettingLocation(true);
    setLocationError("");
    setDetectedAddress(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      setGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );
          const data = await res.json();
          const det = extractAddressDetails(data);
          setDetectedAddress(det);
          setForm((p) => ({ ...p, address: formatAddress(det) }));
        } catch {
          setForm((p) => ({
            ...p,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }));
        }
        setGettingLocation(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location denied. Enter manually."
            : "Could not get location.",
        );
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  }

  // ── Submit ────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!form.service_date) return setError("Please select a service date");
    if (!form.address) return setError("Please enter your address");
    if (!selected) return setError("Please select a pricing option");

    if (selected.rateType === "negotiated") {
      if (!negotiatedPrice || Number(negotiatedPrice) <= 0)
        return setError("Please enter the agreed price");
      if (!negotiatedQty || Number(negotiatedQty) < 1)
        return setError("Please enter the duration");
    } else {
      if (!duration || Number(duration) < 1)
        return setError(
          `Please enter the number of ${durConfig.label.toLowerCase()}`,
        );
    }

    if (total <= 0) return setError("Total amount must be greater than 0");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    setError("");

    try {
      const durationHours = calcDurationHours();
      const unitLabel =
        NEGOT_UNITS.find((u) => u.value === negotiatedUnit)?.label || "Hours";

      const payload = {
        maid_id: maidId,
        service_date: form.service_date,
        duration_hours: durationHours,
        duration_qty:
          selected.rateType === "negotiated"
            ? Number(negotiatedQty) || 1
            : Number(duration) || 1, // ← raw count (days/weeks/months/units)
        address: form.address,
        rate_type:
          selected.rateType === "negotiated" ? "hourly" : selected.rateType,
      };
      // Build human-readable notes
      const noteLines = [];
      if (form.notes) noteLines.push(form.notes);

      if (selected.rateType === "negotiated") {
        payload.total_override = Number(negotiatedPrice);
        noteLines.push(
          `[Negotiated: ${s}${Number(negotiatedPrice).toLocaleString()} for ${negotiatedQty} ${unitLabel.toLowerCase()}]`,
        );
      }
      if (selected.rateType === "custom" && selected.customLabel) {
        noteLines.push(
          `[Custom rate: ${selected.customLabel} × ${duration} unit(s)]`,
        );
      }
      if (selected.rateType === "daily")
        noteLines.push(`[Duration: ${duration} day(s)]`);
      if (selected.rateType === "weekly")
        noteLines.push(`[Duration: ${duration} week(s)]`);
      if (selected.rateType === "monthly")
        noteLines.push(`[Duration: ${duration} month(s)]`);

      if (noteLines.length) payload.notes = noteLines.join(" — ");

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setSuccess({
        ...data.booking,
        maid_name: maid.name || "",
        maid_avatar: maid.avatar || "",
        maid_currency: maid.currency || "NGN",
        // total_amount is already on data.booking from the INSERT RETURNING *
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  // ── Duration label helper ────────────────────────────────────────
  function durationLabel() {
    if (!selected) return "";
    if (selected.rateType === "custom")
      return `Number of ${selected.label} sessions`;
    return `Number of ${durConfig.label}`;
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate("/maids")}>
        ← Back to maids
      </button>

      {/* ── Maid card ───────────────────────────────────────────── */}
      <div className={styles.maidCard}>
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
        <div className={styles.maidCardInfo}>
          <p className={styles.maidName}>{maid.name || "Selected Maid"}</p>
          <p className={styles.maidRate}>
            {s}
            {Number(maid.hourly_rate || maid.rate_hourly || 0).toLocaleString()}
            /hr · {currency}
          </p>
          {maid.id_verified && (
            <span className={styles.maidVerified}>✓ Verified</span>
          )}
        </div>
      </div>

      <div className={styles.form}>
        {/* ── Rate selector ─────────────────────────────────────── */}
        <div className={styles.field}>
          <label className={styles.label}>💰 Choose Pricing Option</label>
          <p className={styles.fieldHint}>
            All rates are set by the maid. Choose what works for you.
          </p>
          <div className={styles.rateGrid}>
            {rateOptions.map((opt) => {
              const isSelected = selectedRateId === opt.id;
              const isNegotiated = opt.rateType === "negotiated";
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.rateCard} ${isSelected ? styles.rateCardActive : ""} ${isNegotiated ? styles.rateCardNegotiated : ""}`}
                  onClick={() => {
                    setSelectedRateId(opt.id);
                    setError("");
                  }}
                >
                  <span className={styles.rateCardIcon}>{opt.icon}</span>
                  <div className={styles.rateCardBody}>
                    <p className={styles.rateCardLabel}>{opt.label}</p>
                    {opt.price != null ? (
                      <p className={styles.rateCardPrice}>
                        {s}
                        {opt.price.toLocaleString()}
                        {opt.unit && (
                          <span className={styles.rateCardUnit}>
                            {opt.unit}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className={styles.rateCardPriceCustom}>
                        Enter amount + duration
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <span className={styles.rateCardCheck}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Duration — shown for ALL rate types except negotiated ── */}
        {selected && selected.rateType !== "negotiated" && (
          <div className={styles.field}>
            <label className={styles.label}>
              {selected.rateType === "hourly" && "⏱ "}
              {selected.rateType === "daily" && "📅 "}
              {selected.rateType === "weekly" && "🗓 "}
              {selected.rateType === "monthly" && "📆 "}
              {selected.rateType === "custom" && "✨ "}
              {durationLabel()} *
            </label>
            <div className={styles.durationRow}>
              <button
                type="button"
                className={styles.durationBtn}
                onClick={() =>
                  setDuration((d) =>
                    String(Math.max(durConfig.min, Number(d) - durConfig.step)),
                  )
                }
              >
                −
              </button>
              <input
                className={`${styles.input} ${styles.durationInput}`}
                type="number"
                min={durConfig.min}
                max={durConfig.max}
                step={durConfig.step}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <span className={styles.durationUnit}>
                {durConfig.unit || selected.label?.toLowerCase()}
              </span>
              <button
                type="button"
                className={styles.durationBtn}
                onClick={() =>
                  setDuration((d) =>
                    String(Math.min(durConfig.max, Number(d) + durConfig.step)),
                  )
                }
              >
                +
              </button>
            </div>
            {/* Live cost preview */}
            {selected.price && Number(duration) > 0 && (
              <p className={styles.costPreview}>
                {s}
                {selected.price.toLocaleString()} × {duration}{" "}
                {durConfig.label.toLowerCase()}
                {" = "}
                <strong>
                  {s}
                  {(selected.price * Number(duration)).toLocaleString()}
                </strong>
              </p>
            )}
          </div>
        )}

        {/* ── Negotiated — price + duration picker ─────────────── */}
        {selected?.rateType === "negotiated" && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>
                🤝 Agreed Total Price ({currency})
              </label>
              <p className={styles.fieldHint}>
                Enter the total amount you and the maid agreed on.
              </p>
              <div className={styles.negotiatedRow}>
                <span className={styles.currencyPrefix}>{s}</span>
                <input
                  className={`${styles.input} ${styles.negotiatedInput}`}
                  type="number"
                  min="1"
                  placeholder="e.g. 15000"
                  value={negotiatedPrice}
                  onChange={(e) => {
                    setNegotiatedPrice(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>⏳ Agreed Duration</label>
              <p className={styles.fieldHint}>
                How long did you agree the service will run?
              </p>
              <div className={styles.negotiatedDurationRow}>
                <div className={styles.durationRow} style={{ flex: 1 }}>
                  <button
                    type="button"
                    className={styles.durationBtn}
                    onClick={() =>
                      setNegotiatedQty((q) =>
                        String(Math.max(1, Number(q) - 1)),
                      )
                    }
                  >
                    −
                  </button>
                  <input
                    className={`${styles.input} ${styles.durationInput}`}
                    type="number"
                    min="1"
                    value={negotiatedQty}
                    onChange={(e) => {
                      setNegotiatedQty(e.target.value);
                      setError("");
                    }}
                  />
                  <button
                    type="button"
                    className={styles.durationBtn}
                    onClick={() =>
                      setNegotiatedQty((q) => String(Number(q) + 1))
                    }
                  >
                    +
                  </button>
                </div>
                <select
                  className={`${styles.input} ${styles.unitSelect}`}
                  value={negotiatedUnit}
                  onChange={(e) => setNegotiatedUnit(e.target.value)}
                >
                  {NEGOT_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className={styles.negotiatedNote}>
                ℹ️ {negotiatedQty}{" "}
                {NEGOT_UNITS.find(
                  (u) => u.value === negotiatedUnit,
                )?.label.toLowerCase()}
                {negotiatedPrice
                  ? ` · ${s}${Number(negotiatedPrice).toLocaleString()} total`
                  : ""}
                {" — ensure the maid knows this amount before booking."}
              </p>
            </div>
          </>
        )}

        {/* ── Date ──────────────────────────────────────────────── */}
        <div className={styles.field}>
          <label className={styles.label}>📅 Service Date & Time *</label>
          <input
            className={styles.input}
            type="datetime-local"
            name="service_date"
            value={form.service_date}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        {/* ── Address ───────────────────────────────────────────── */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>📍 Service Address *</label>
            <button
              type="button"
              className={styles.geoLink}
              onClick={getCurrentLocation}
              disabled={gettingLocation}
            >
              {gettingLocation ? "Getting location…" : "Use my location"}
            </button>
          </div>
          <input
            className={styles.input}
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. 12 Banana Street, Lekki, Lagos"
          />
          {detectedAddress && (
            <div className={styles.addressBox}>
              <p className={styles.addressBoxTitle}>📍 Detected:</p>
              {detectedAddress.street && <p>🏠 {detectedAddress.street}</p>}
              {detectedAddress.city && <p>🏙️ {detectedAddress.city}</p>}
              {detectedAddress.state && <p>📌 {detectedAddress.state}</p>}
              {detectedAddress.country && <p>🌍 {detectedAddress.country}</p>}
            </div>
          )}
          {locationError && (
            <p className={styles.fieldError}>{locationError}</p>
          )}
        </div>

        {/* ── Notes ─────────────────────────────────────────────── */}
        <div className={styles.field}>
          <label className={styles.label}>
            📝 Notes <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            className={styles.textarea}
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any special instructions for the maid…"
          />
        </div>

        {/* ── Summary ───────────────────────────────────────────── */}
        <div className={styles.summary}>
          <p className={styles.summaryTitle}>Booking Summary</p>
          <div className={styles.summaryRow}>
            <span>Maid</span>
            <span>{maid.name || "—"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Pricing</span>
            <span>
              {selected?.label || "—"}
              {selected?.price != null
                ? ` · ${s}${selected.price.toLocaleString()}${selected.unit}`
                : ""}
            </span>
          </div>
          {selected?.rateType !== "negotiated" &&
            selected?.rateType &&
            duration && (
              <div className={styles.summaryRow}>
                <span>Duration</span>
                <span>
                  {duration} {durConfig.label.toLowerCase()}
                </span>
              </div>
            )}
          {selected?.rateType === "negotiated" && (
            <>
              <div className={styles.summaryRow}>
                <span>Agreed price</span>
                <span>
                  {negotiatedPrice
                    ? `${s}${Number(negotiatedPrice).toLocaleString()}`
                    : "—"}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Duration</span>
                <span>
                  {negotiatedQty}{" "}
                  {NEGOT_UNITS.find(
                    (u) => u.value === negotiatedUnit,
                  )?.label.toLowerCase()}
                </span>
              </div>
            </>
          )}
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>
              {s}
              {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Payment note ──────────────────────────────────────── */}
        <div className={styles.paymentNote}>
          🔒 After booking, you'll be taken to payment. Your booking is only
          confirmed after payment and admin approval.
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading || total <= 0}
        >
          {loading
            ? "Creating booking…"
            : `Continue to Payment → ${total > 0 ? `(${s}${total.toLocaleString()})` : ""}`}
        </button>
      </div>
    </div>
  );
}
