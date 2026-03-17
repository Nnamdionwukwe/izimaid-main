import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MaidDashboard.module.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

function ProfileTab({ token, user }) {
  const [profile, setProfile] = useState({
    bio: "",
    hourly_rate: "",
    years_exp: "",
    services: [],
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locationAttempts, setLocationAttempts] = useState(0);
  const [fullAddress, setFullAddress] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

  // Load profile on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/maids/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.maid) {
          setProfile({
            bio: data.maid.bio || "",
            hourly_rate: data.maid.hourly_rate || "",
            years_exp: data.maid.years_exp || "",
            services: data.maid.services || [],
            location: data.maid.location || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
      setLoading(false);
    }
    load();
  }, [user.id, token, API_URL]);

  // Extract detailed address from Nominatim response
  function extractAddressDetails(data) {
    const address = data.address || {};

    const details = {
      street: address.road || address.house_number || "",
      houseNumber: address.house_number || "",
      city: address.city || address.town || address.village || "",
      state: address.state || address.region || address.county || "",
      country: address.country || "",
      postalCode: address.postcode || "",
      displayName: data.display_name || "",
    };

    return details;
  }

  // Format address nicely
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

  // Format display address for user confirmation
  function formatDisplayAddress(addressDetails) {
    let display = "";

    if (addressDetails.street) {
      display += `📍 ${addressDetails.street}\n`;
    }

    if (addressDetails.city || addressDetails.state) {
      display += `📍 ${[addressDetails.city, addressDetails.state]
        .filter(Boolean)
        .join(", ")}\n`;
    }

    if (addressDetails.country) {
      display += `🌍 ${addressDetails.country}`;
    }

    return display;
  }

  // Handle avatar upload
  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMsg({ type: "error", text: "❌ Image must be less than 5MB" });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setMsg({ type: "error", text: "❌ Please select an image file" });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`${API_URL}/api/maids/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update localStorage
      const updatedUser = { ...user, avatar: data.avatar_url };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMsg({ type: "success", text: "✅ Profile picture updated!" });
    } catch (err) {
      setMsg({
        type: "error",
        text: `❌ ${err.message || "Failed to upload image"}`,
      });
      setAvatarPreview(user?.avatar || null);
    } finally {
      setUploadingAvatar(false);
    }
  }

  // Get current location using Geolocation API with iOS-specific handling
  async function getCurrentLocation() {
    setGettingLocation(true);
    setMsg({ type: "", text: "" });
    setLocationAttempts((prev) => prev + 1);

    if (!navigator.geolocation) {
      setMsg({
        type: "error",
        text: "Geolocation is not supported by your browser",
      });
      setGettingLocation(false);
      return;
    }

    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentCoords({ latitude, longitude, accuracy });

        setMsg({
          type: "info",
          text: `📍 Location found (Accuracy: ${Math.round(accuracy)}m). Converting to address...`,
        });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { timeout: 8000 },
          );

          if (!response.ok) throw new Error("Address lookup failed");

          const data = await response.json();
          const addressDetails = extractAddressDetails(data);
          const formattedAddress = formatAddress(addressDetails);
          const displayAddress = formatDisplayAddress(addressDetails);

          setFullAddress(addressDetails);
          setProfile((prev) => ({
            ...prev,
            location: formattedAddress,
          }));

          const addressDisplay = displayAddress.trim()
            ? `✅ Location updated:\n${displayAddress}`
            : `✅ Location: ${formattedAddress}`;

          setMsg({
            type: "success",
            text: addressDisplay,
          });
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          const coordLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setProfile((prev) => ({
            ...prev,
            location: coordLocation,
          }));
          setMsg({
            type: "success",
            text: `✅ Location: ${coordLocation}\n(Try again later for address with street details)`,
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        let errorMessage = "Unable to get location";
        let errorType = "error";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "📍 Location access denied. Please go to Settings > Safari > Location and grant permission to this website.";
            break;

          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "📍 GPS signal not found. Try:\n• Move outdoors\n• Wait a moment\n• Enable WiFi\n• Retry location request";
            errorType = "warning";
            break;

          case error.TIMEOUT:
            if (locationAttempts < 3) {
              errorMessage =
                "📍 Location request timed out. Retrying... (Attempt " +
                (locationAttempts + 1) +
                "/3)";
              errorType = "warning";
              setTimeout(() => {
                getCurrentLocation();
              }, 2000);
              setGettingLocation(false);
              setMsg({ type: errorType, text: errorMessage });
              return;
            } else {
              errorMessage =
                "📍 Could not determine location after 3 attempts. Please:\n• Check location services are enabled\n• Try manually entering your location\n• Ensure GPS/WiFi is turned on";
              setLocationAttempts(0);
            }
            break;

          default:
            if (
              error.message &&
              error.message.includes("Only secure origins")
            ) {
              errorMessage =
                "⚠️ Location requires HTTPS. This error should only appear on HTTP sites.";
            } else {
              errorMessage =
                "📍 Error getting location: " +
                (error.message || "Unknown error");
            }
        }

        setMsg({ type: errorType, text: errorMessage });
      },
      geolocationOptions,
    );

    setGettingLocation(false);
  }

  function toggleService(s) {
    setProfile((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }));
  }

  async function handleSave() {
    if (!profile.hourly_rate || Number(profile.hourly_rate) <= 0) {
      setMsg({ type: "error", text: "Please enter a valid hourly rate" });
      return;
    }

    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch(`${API_URL}/api/maids/profile`, {
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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: "success", text: "✅ Profile saved successfully!" });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.message || "Failed to save profile",
      });
    } finally {
      setSaving(false);
    }
  }

  const getMsgStyle = (type) => {
    const baseStyle = {
      padding: "10px 14px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "bold",
      marginBottom: 16,
      whiteSpace: "pre-line",
      lineHeight: "1.5",
    };

    const typeStyles = {
      success: {
        background: "rgb(209, 247, 224)",
        color: "rgb(10, 107, 46)",
      },
      error: {
        background: "rgb(255, 228, 228)",
        color: "rgb(168, 28, 28)",
      },
      warning: {
        background: "rgb(255, 243, 205)",
        color: "rgb(133, 100, 4)",
      },
      info: {
        background: "rgb(209, 236, 255)",
        color: "rgb(10, 76, 140)",
      },
    };

    return { ...baseStyle, ...(typeStyles[type] || typeStyles.info) };
  };

  if (loading)
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "gray" }}>
        Loading profile...
      </div>
    );

  return (
    <div>
      <p
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "rgb(19, 19, 103)",
          margin: "0 0 14px",
        }}
      >
        My Profile
      </p>

      {msg.text && <p style={getMsgStyle(msg.type)}>{msg.text}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Profile Picture Upload */}
        <div>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "rgb(47, 47, 47)",
              display: "block",
              marginBottom: 10,
            }}
          >
            Profile Picture
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
            }}
          >
            {/* Avatar Preview */}
            <div
              style={{
                position: "relative",
                width: 80,
                height: 80,
                borderRadius: "12px",
                overflow: "hidden",
                background: "rgb(240, 240, 245)",
                border: "2px solid rgb(228, 228, 228)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "rgb(19, 19, 103)",
                  }}
                >
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase() || "?"}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "inline-block",
                  padding: "10px 16px",
                  background: "rgb(19, 19, 103)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: uploadingAvatar ? "not-allowed" : "pointer",
                  opacity: uploadingAvatar ? 0.6 : 1,
                  border: "none",
                  fontFamily: "inherit",
                }}
              >
                {uploadingAvatar ? "📤 Uploading..." : "📸 Change Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  style={{ display: "none" }}
                />
              </label>
              <p
                style={{
                  fontSize: "11px",
                  color: "rgb(100, 100, 100)",
                  margin: "6px 0 0",
                }}
              >
                JPG, PNG (Max 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "rgb(47, 47, 47)",
              display: "block",
              marginBottom: 6,
            }}
          >
            Bio
          </label>
          <textarea
            style={{
              border: "1px solid rgb(228, 228, 228)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "14px",
              fontFamily: "inherit",
              width: "100%",
              minHeight: "90px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
            placeholder="Tell customers about yourself, your experience and what makes you great..."
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
          />
        </div>

        {/* Hourly Rate & Years Experience */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "rgb(47, 47, 47)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Hourly Rate (₦)*
            </label>
            <input
              style={{
                height: "44px",
                border: "1px solid rgb(228, 228, 228)",
                borderRadius: "8px",
                padding: "0 14px",
                fontSize: "14px",
                fontFamily: "inherit",
                width: "100%",
                boxSizing: "border-box",
              }}
              type="number"
              placeholder="e.g. 3000"
              value={profile.hourly_rate}
              onChange={(e) =>
                setProfile((p) => ({ ...p, hourly_rate: e.target.value }))
              }
              min="0"
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "rgb(47, 47, 47)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Years Experience
            </label>
            <input
              style={{
                height: "44px",
                border: "1px solid rgb(228, 228, 228)",
                borderRadius: "8px",
                padding: "0 14px",
                fontSize: "14px",
                fontFamily: "inherit",
                width: "100%",
                boxSizing: "border-box",
              }}
              type="number"
              placeholder="e.g. 3"
              value={profile.years_exp}
              onChange={(e) =>
                setProfile((p) => ({ ...p, years_exp: e.target.value }))
              }
              min="0"
            />
          </div>
        </div>

        {/* Location with Geolocation Button */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <label
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: "rgb(47, 47, 47)",
              }}
            >
              Location
            </label>
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
              title="Get your exact location with street address (requires location permission)"
            >
              {gettingLocation
                ? "📍 Getting location..."
                : "📍 Use Current Location"}
            </button>
          </div>

          <input
            style={{
              height: "44px",
              border: "1px solid rgb(228, 228, 228)",
              borderRadius: "8px",
              padding: "0 14px",
              fontSize: "14px",
              fontFamily: "inherit",
              width: "100%",
              boxSizing: "border-box",
            }}
            type="text"
            placeholder="e.g. Street Name, Lekki, Lagos, Nigeria"
            value={profile.location}
            onChange={(e) =>
              setProfile((p) => ({ ...p, location: e.target.value }))
            }
          />

          {fullAddress &&
            (fullAddress.street ||
              fullAddress.city ||
              fullAddress.state ||
              fullAddress.country) && (
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
                {fullAddress.street && (
                  <p style={{ margin: "2px 0" }}>
                    🏠 Street: {fullAddress.street}
                  </p>
                )}
                {fullAddress.city && (
                  <p style={{ margin: "2px 0" }}>🏙️ City: {fullAddress.city}</p>
                )}
                {fullAddress.state && (
                  <p style={{ margin: "2px 0" }}>
                    📍 State: {fullAddress.state}
                  </p>
                )}
                {fullAddress.country && (
                  <p style={{ margin: "2px 0" }}>
                    🌍 Country: {fullAddress.country}
                  </p>
                )}
                {currentCoords && (
                  <p style={{ margin: "2px 0" }}>
                    📌 Coordinates: {currentCoords.latitude.toFixed(4)},
                    {currentCoords.longitude.toFixed(4)} (Accuracy:
                    {Math.round(currentCoords.accuracy)}m)
                  </p>
                )}
              </div>
            )}
        </div>

        {/* Services */}
        <div>
          <label
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: "rgb(47, 47, 47)",
              display: "block",
              marginBottom: 6,
            }}
          >
            Services Offered
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {SERVICES_LIST.map((s) => (
              <div
                key={s}
                onClick={() => toggleService(s)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 12px",
                  border: profile.services.includes(s)
                    ? "1px solid rgb(19, 19, 103)"
                    : "1px solid rgb(228, 228, 228)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: profile.services.includes(s)
                    ? "rgb(19, 19, 103)"
                    : "rgb(47, 47, 47)",
                  background: profile.services.includes(s)
                    ? "rgb(240, 240, 255)"
                    : "white",
                  fontWeight: profile.services.includes(s) ? "bold" : "normal",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: profile.services.includes(s)
                      ? "2px solid rgb(19, 19, 103)"
                      : "2px solid rgb(228, 228, 228)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: profile.services.includes(s)
                      ? "rgb(19, 19, 103)"
                      : "white",
                    color: "white",
                    fontSize: 10,
                  }}
                >
                  {profile.services.includes(s) && "✓"}
                </div>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            height: "48px",
            background: "rgb(19, 19, 103)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            fontFamily: "inherit",
          }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

// ── Decline Confirmation Modal ────────────────────────────────────────────
function DeclineConfirmModal({ booking, onConfirm, onCancel, isLoading }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(booking.id, reason);
  };

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
              color: "rgb(100, 100, 100)",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Customer: <strong>{booking.customer_name}</strong>
          </p>
          <p
            style={{
              color: "rgb(100, 100, 100)",
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
              color: "rgb(47, 47, 47)",
            }}
          >
            Reason for declining (optional)
          </label>
          <textarea
            style={{
              width: "100%",
              border: "1px solid rgb(228, 228, 228)",
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
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              background: isLoading ? "rgb(200, 100, 100)" : "rgb(187, 19, 47)",
            }}
          >
            {isLoading ? "Declining..." : "Decline Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingsTab({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [declineModal, setDeclineModal] = useState(null);
  const [isDeclining, setIsDeclining] = useState(false);

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
      if (res.ok) {
        fetchBookings();
      }
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

        // Show success message
        alert("Booking declined. Customer has been notified.");
      } else {
        alert("Failed to decline booking. Please try again.");
      }
    } catch (err) {
      console.error("Error declining booking:", err);
      alert("Error declining booking. Please try again.");
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
              : f === "declined"
                ? "Declined"
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
            <div key={b.id} className={styles.bookingCard}>
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
                  {b.status === "declined"
                    ? "Declined"
                    : b.status === "in_progress"
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

              {/* Show decline reason if exists */}
              {b.status === "declined" && b.declined_reason && (
                <div
                  style={{
                    padding: "10px",
                    background: "rgb(255, 243, 205)",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    fontSize: "12px",
                    color: "rgb(100, 80, 0)",
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decline confirmation modal */}
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
function ReviewsTab({ token, user }) {
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
  }, []);

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
          {reviews.map((r, i) => (
            <div key={i} className={styles.reviewCard}>
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
  const [tab, setTab] = useState("bookings");
  const [available, setAvailable] = useState(true);
  const [savingAvail, setSavingAvail] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    earnings: 0,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

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
    loadProfile();
    loadStats();
  }, []);

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

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className={styles.headerAvatar}
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
        <button className={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Availability toggle */}
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
          ["reviews", "Reviews"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`${styles.tab} ${tab === key ? styles.tabActive : ""}`}
            onClick={() => setTab(key)}
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
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === "bookings" && <BookingsTab token={token} />}
        {tab === "profile" && <ProfileTab token={token} user={user} />}
        {tab === "reviews" && <ReviewsTab token={token} user={user} />}
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────
