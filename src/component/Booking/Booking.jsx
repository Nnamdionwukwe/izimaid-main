import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Booking.module.css";

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

// ── Extract detailed address from Nominatim response ─────────────────────────
function extractAddressDetails(data) {
  const address = data.address || {};

  return {
    street: address.road || address.house_number || "",
    houseNumber: address.house_number || "",
    city: address.city || address.town || address.village || "",
    state: address.state || address.region || address.county || "",
    country: address.country || "",
    postalCode: address.postcode || "",
    displayName: data.display_name || "",
  };
}

// ── Format address nicely for saving ────────────────────────────────────────
function formatAddress(addressDetails) {
  const parts = [];

  if (addressDetails.street) {
    parts.push(addressDetails.street);
  }

  if (addressDetails.city) {
    parts.push(addressDetails.city);
  }

  if (addressDetails.state) {
    parts.push(addressDetails.state);
  }

  if (addressDetails.country) {
    parts.push(addressDetails.country);
  }

  return parts.length > 0 ? parts.join(", ") : addressDetails.displayName;
}

export default function Booking() {
  const { maidId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const maid = state?.maid || {};

  const [form, setForm] = useState({
    service_date: "",
    duration_hours: "2",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedAddress, setDetectedAddress] = useState(null);

  const total =
    Number(maid.hourly_rate || 0) * Number(form.duration_hours || 0);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  // Get current location using Geolocation API with iOS-specific handling
  async function getCurrentLocation() {
    setGettingLocation(true);
    setLocationError("");
    setDetectedAddress(null);

    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    // Increased timeout for iOS - give it more time to get a fix
    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 seconds
      maximumAge: 0, // Don't use cached location
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;

          // Fetch detailed address from Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { timeout: 8000 },
          );

          if (!res.ok) throw new Error("Address lookup failed");

          const data = await res.json();
          const addressDetails = extractAddressDetails(data);
          const formattedAddress = formatAddress(addressDetails);

          setDetectedAddress(addressDetails);
          setForm((prev) => ({
            ...prev,
            address: formattedAddress,
          }));

          setLocationError("");
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setGettingLocation(false);

          try {
            // Fallback: Just get city/postcode if detailed lookup fails
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`,
            );
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              "";
            const postcode = data.address?.postcode || "";
            const country = data.address?.country || "";
            const location =
              [city, postcode, country].filter(Boolean).join(", ") ||
              `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;

            setForm((prev) => ({
              ...prev,
              address: location,
            }));

            setDetectedAddress({
              city,
              postalCode: postcode,
              country,
              street: "",
              state: "",
            });

            setLocationError("");
          } catch {
            setLocationError(
              "Could not detect your location. Try entering it manually.",
            );
          }
        }

        setGettingLocation(false);
      },
      (err) => {
        setGettingLocation(false);
        setLocationError(
          err.code === 1
            ? "📍 Location access denied. Please allow location access or enter manually."
            : err.code === 3
              ? "📍 Location request timed out. Please try again or enter manually."
              : "📍 Could not get your location. Try enabling GPS or entering manually.",
        );
      },
      geolocationOptions,
    );
  }

  async function handleSubmit() {
    if (!form.service_date) return setError("Please select a service date");
    if (!form.address) return setError("Please enter your address");
    if (!form.duration_hours || Number(form.duration_hours) < 1)
      return setError("Minimum 1 hour");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          maid_id: maidId,
          service_date: form.service_date,
          duration_hours: Number(form.duration_hours),
          address: form.address,
          notes: form.notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setSuccess(data.booking);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <p className={styles.successTitle}>✓ Booking Confirmed!</p>
          <p className={styles.successText}>
            Your booking with {maid.name} has been submitted. You will receive a
            confirmation once the maid accepts.
          </p>
          <button
            className={styles.successBtn}
            onClick={() => navigate("/my-bookings")}
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate("/maids")}>
        ← Back to maids
      </button>

      {/* Maid summary */}
      <div className={styles.maidCard}>
        {maid.avatar ? (
          <img src={maid.avatar} alt={maid.name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{initials(maid.name)}</div>
        )}
        <div>
          <p className={styles.maidName}>{maid.name || "Selected Maid"}</p>
          <p className={styles.maidRate}>
            ₦{Number(maid.hourly_rate || 0).toLocaleString()} / hour
          </p>
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Service Date & Time*</label>
          <input
            className={styles.input}
            type="datetime-local"
            name="service_date"
            value={form.service_date}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Duration (hours)*</label>
            <input
              className={styles.input}
              type="number"
              name="duration_hours"
              value={form.duration_hours}
              onChange={handleChange}
              min="1"
              max="12"
              step="0.5"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Total Cost</label>
            <input
              className={styles.input}
              type="text"
              value={`₦${total.toLocaleString()}`}
              readOnly
              style={{
                background: "rgb(248, 248, 248)",
                color: "rgb(19, 19, 103)",
                fontWeight: "bold",
              }}
            />
          </div>
        </div>

        <div className={styles.field}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <label className={styles.label}>Service Address*</label>
            <button
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              style={{
                background: "none",
                border: "none",
                color: gettingLocation
                  ? "rgb(100, 100, 100)"
                  : "rgb(19, 19, 103)",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: gettingLocation ? "not-allowed" : "pointer",
                opacity: gettingLocation ? 0.6 : 1,
                textDecoration: "underline",
                fontFamily: "inherit",
              }}
              title="Use your current GPS location (requires location permission)"
            >
              {gettingLocation
                ? "📍 Getting location..."
                : "📍 Use Current Location"}
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

          {/* Display detected address details */}
          {detectedAddress &&
            (detectedAddress.street ||
              detectedAddress.city ||
              detectedAddress.state ||
              detectedAddress.country) && (
              <div
                style={{
                  fontSize: "11px",
                  color: "gray",
                  marginTop: 8,
                  padding: "8px",
                  background: "rgb(245, 245, 248)",
                  borderRadius: "6px",
                  lineHeight: "1.6",
                }}
              >
                <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
                  📍 Address Details:
                </p>
                {detectedAddress.street && (
                  <p style={{ margin: "2px 0" }}>🏠 {detectedAddress.street}</p>
                )}
                {(detectedAddress.city || detectedAddress.state) && (
                  <p style={{ margin: "2px 0" }}>
                    🏙️{" "}
                    {[detectedAddress.city, detectedAddress.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                {detectedAddress.country && (
                  <p style={{ margin: "2px 0" }}>
                    🌍 {detectedAddress.country}
                  </p>
                )}
              </div>
            )}

          {locationError && (
            <p
              style={{ color: "rgb(187, 19, 47)", fontSize: 12, marginTop: 4 }}
            >
              {locationError}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notes (optional)</label>
          <textarea
            className={styles.textarea}
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any special instructions for the maid..."
          />
        </div>

        <div className={styles.summary}>
          <p className={styles.summaryTitle}>Booking Summary</p>
          <div className={styles.summaryRow}>
            <span>Maid</span>
            <span>{maid.name || "—"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Rate</span>
            <span>₦{Number(maid.hourly_rate || 0).toLocaleString()}/hr</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Duration</span>
            <span>{form.duration_hours} hour(s)</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
