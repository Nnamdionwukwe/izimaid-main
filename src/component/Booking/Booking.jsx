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

// ── Build rate options from maid profile ──────────────────────────────
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
      desc: `${s}${hourly.toLocaleString()} per hour`,
      rateType: "hourly",
    });
  if (daily > 0)
    options.push({
      id: "daily",
      label: "Daily",
      icon: "📅",
      price: daily,
      unit: "/day",
      desc: `${s}${daily.toLocaleString()} per day`,
      rateType: "daily",
    });
  if (weekly > 0)
    options.push({
      id: "weekly",
      label: "Weekly",
      icon: "🗓",
      price: weekly,
      unit: "/week",
      desc: `${s}${weekly.toLocaleString()} per week`,
      rateType: "weekly",
    });
  if (monthly > 0)
    options.push({
      id: "monthly",
      label: "Monthly",
      icon: "📆",
      price: monthly,
      unit: "/month",
      desc: `${s}${monthly.toLocaleString()} per month`,
      rateType: "monthly",
    });

  // Custom named rates from maid profile (JSONB object)
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
            desc: `${s}${Number(price).toLocaleString()} (fixed rate)`,
            rateType: "custom",
            customLabel: label,
          });
        }
      });
    } catch {}
  }

  // Always show negotiated option last
  options.push({
    id: "negotiated",
    label: "Custom / Negotiated",
    icon: "🤝",
    price: null,
    unit: "",
    desc: "Enter a price you've agreed with the maid",
    rateType: "negotiated",
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
  const [negotiatedPrice, setNegotiatedPrice] = useState("");

  const [form, setForm] = useState({
    service_date: "",
    duration_hours: "2",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedAddress, setDetectedAddress] = useState(null);

  const selected = rateOptions.find((r) => r.id === selectedRateId);

  // ── Total calculation ─────────────────────────────────────────────
  function calcTotal() {
    if (!selected) return 0;
    if (selected.rateType === "negotiated") return Number(negotiatedPrice) || 0;
    if (selected.rateType === "custom") return selected.price; // fixed, no multiply
    return selected.price * Number(form.duration_hours || 0);
  }
  const total = calcTotal();

  // ── Navigate to payment once booking is created ───────────────────
  const [success, setSuccess] = useState(null);
  useEffect(() => {
    if (success) navigate("/payment", { state: { booking: success } });
  }, [success]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  // ── Geolocation ───────────────────────────────────────────────────
  async function getCurrentLocation() {
    setGettingLocation(true);
    setLocationError("");
    setDetectedAddress(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
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
          setForm((prev) => ({ ...prev, address: formatAddress(det) }));
        } catch {
          setForm((prev) => ({
            ...prev,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          }));
        }
        setGettingLocation(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location access denied. Please allow access or enter manually."
            : "Could not get your location. Enter manually.",
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
    }

    if (selected.rateType !== "custom" && selected.rateType !== "negotiated") {
      if (!form.duration_hours || Number(form.duration_hours) < 1)
        return setError("Minimum 1 hour");
    }

    if (total <= 0) return setError("Total amount must be greater than 0");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    setError("");

    try {
      // For negotiated price — send total_override so backend uses it directly
      const payload = {
        maid_id: maidId,
        service_date: form.service_date,
        duration_hours: Number(form.duration_hours) || 1,
        address: form.address,
        notes: form.notes || undefined,
        rate_type:
          selected.rateType === "negotiated" ? "hourly" : selected.rateType,
      };

      // total_override lets backend skip its own calculation
      if (selected.rateType === "negotiated") {
        payload.total_override = Number(negotiatedPrice);
        payload.notes = [
          form.notes,
          `[Negotiated price: ${s}${Number(negotiatedPrice).toLocaleString()}]`,
        ]
          .filter(Boolean)
          .join(" — ");
      }
      if (selected.rateType === "custom" && selected.customLabel) {
        payload.notes = [form.notes, `[Custom rate: ${selected.customLabel}]`]
          .filter(Boolean)
          .join(" — ");
      }

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
      setSuccess(data.booking);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  // ── Whether to show duration field ───────────────────────────────
  const showDuration = selected?.rateType === "hourly";

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
                      <p className={styles.rateCardPriceCustom}>Enter amount</p>
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

        {/* ── Negotiated price input ─────────────────────────────── */}
        {selected?.rateType === "negotiated" && (
          <div className={styles.field}>
            <label className={styles.label}>🤝 Agreed Price ({currency})</label>
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
            <p className={styles.negotiatedNote}>
              ℹ️ This is a custom price you've privately agreed with the maid.
              Please ensure the maid is aware of this amount before booking.
            </p>
          </div>
        )}

        {/* ── Duration (hourly only) ─────────────────────────────── */}
        {showDuration && (
          <div className={styles.field}>
            <label className={styles.label}>⏱ Duration (hours)</label>
            <input
              className={styles.input}
              type="number"
              name="duration_hours"
              value={form.duration_hours}
              onChange={handleChange}
              min="1"
              max="24"
              step="0.5"
            />
          </div>
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
          {showDuration && (
            <div className={styles.summaryRow}>
              <span>Duration</span>
              <span>{form.duration_hours} hour(s)</span>
            </div>
          )}
          {selected?.rateType === "negotiated" && negotiatedPrice && (
            <div className={styles.summaryRow}>
              <span>Agreed Price</span>
              <span>
                {s}
                {Number(negotiatedPrice).toLocaleString()}
              </span>
            </div>
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
          🔒 After booking, you'll pay securely via <strong>Paystack</strong>.
          Your booking is only confirmed after payment and admin approval.
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
