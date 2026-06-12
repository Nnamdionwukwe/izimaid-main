import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./IziBestCleaningCar.module.css";

// ── Helpers (same as SubHeader) ──────────────────────────────────────────────
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

function formatAddress({ street, city, state, country, displayName }) {
  const parts = [street, city, state, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : displayName;
}

// ── Inline location modal (same UI as SubHeader's LocationModal) ─────────────
function LocationModal({
  onClose,
  locationInput,
  onInput,
  onClear,
  onSubmit,
  onUseLocation,
  locating,
  locationError,
  pleaseEnter,
  invalidZip,
  clearInput,
  detectedAddress,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button
          type="button"
          onClick={onClose}
          className={styles.modalClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className={styles.modalLogoDiv}>
          <img
            className={styles.modalLogo}
            alt="Deusizi Logo"
            src="deusizi.jpg"
          />
        </div>

        <div className={styles.modalLocated}>
          <h2 className={styles.modalTitle}>Tell us where you are located</h2>
        </div>

        {/* Improved Flex Search Container */}
        <div className={styles.modalInputGroup}>
          <div className={styles.modalZipRow}>
            <input
              onChange={onInput}
              value={locationInput}
              type="text"
              placeholder="Enter ZIP Code, City, or Street"
              className={styles.modalInputElement}
            />
            {clearInput && (
              <span onClick={onClear} className={styles.modalClear}>
                &times;
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onUseLocation}
            disabled={locating}
            className={`${styles.modalUseLocation} ${locating ? styles.isLocating : ""}`}
          >
            <span>
              {locating ? "📍 Detecting location..." : "📍 Use My Location"}
            </span>
          </button>
        </div>

        {/* Global Error Space */}
        {locationError && (
          <p className={styles.inlineContextError}>{locationError}</p>
        )}
        {pleaseEnter && (
          <p className={styles.modalErrorText}>Please enter a location</p>
        )}
        {invalidZip && (
          <p className={styles.modalErrorText}>
            Please enter at least 2 characters
          </p>
        )}

        {/* Address Component Card Box */}
        {detectedAddress && (
          <div className={styles.addressDisplayCard}>
            <p className={styles.addressDisplayTitle}>✅ Location Detected:</p>
            {detectedAddress.street && (
              <p className={styles.addressLine}>🏠 {detectedAddress.street}</p>
            )}
            {(detectedAddress.city || detectedAddress.state) && (
              <p className={styles.addressLine}>
                City:{" "}
                {[detectedAddress.city, detectedAddress.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            {detectedAddress.country && (
              <p className={styles.addressLine}>🌍 {detectedAddress.country}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onSubmit}
          className={styles.modalFindBtn}
        >
          Find Local Help
        </button>

        <div className={styles.modalFieldFooter}>
          <p>*indicates a required field</p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function IziBestCleaningCar() {
  const navigate = useNavigate();

  const [locationInput, setLocationInput] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pleaseEnter, setPleaseEnter] = useState(false);
  const [invalidZip, setInvalidZip] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedAddress, setDetectedAddress] = useState(null);

  // Also wire the inline input on the card itself
  const [inlineInput, setInlineInput] = useState("");

  function handleInput(e) {
    const val = e.target.value;
    setLocationInput(val);
    setDetectedAddress(null);
    if (!val.length) {
      setInvalidZip(false);
      setClearInput(false);
    } else if (val.length < 2) {
      setPleaseEnter(false);
      setInvalidZip(true);
      setClearInput(true);
    } else {
      setPleaseEnter(false);
      setInvalidZip(false);
      setClearInput(true);
    }
  }

  function handleClearInput() {
    setLocationInput("");
    setClearInput(false);
    setInvalidZip(false);
    setDetectedAddress(null);
  }

  function handleSubmitLocation() {
    if (!locationInput.length || locationInput.length < 2) {
      setPleaseEnter(true);
      return;
    }
    setPleaseEnter(false);
    setModalOpen(false);
    navigate(`/maids?location=${encodeURIComponent(locationInput)}`);
  }

  // Inline card submit
  function handleInlineFind() {
    const val = inlineInput.trim();
    if (!val || val.length < 2) {
      setLocationInput(val);
      setModalOpen(true);
      return;
    }
    navigate(`/maids?location=${encodeURIComponent(val)}`);
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    setLocationError("");
    setDetectedAddress(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { timeout: 8000 },
          );
          if (!res.ok) throw new Error("Address lookup failed");
          const data = await res.json();
          const addressDetails = extractAddressDetails(data);
          const formattedAddress = formatAddress(addressDetails);
          setDetectedAddress(addressDetails);
          setLocationInput(formattedAddress);
          setLocating(false);
          setTimeout(() => {
            setModalOpen(false);
            navigate(`/maids?location=${encodeURIComponent(formattedAddress)}`);
          }, 1000);
        } catch {
          setLocating(false);
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
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
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setLocationInput(location);
            setDetectedAddress({
              city,
              postalCode: postcode,
              country,
              street: "",
              state: "",
            });
            setTimeout(() => {
              setModalOpen(false);
              navigate(`/maids?location=${encodeURIComponent(location)}`);
            }, 1000);
          } catch {
            setLocationError(
              "Could not detect your location. Try entering it manually.",
            );
          }
        }
      },
      (err) => {
        setLocating(false);
        setLocationError(
          err.code === 1
            ? "📍 Location access denied. Please allow location access or enter manually."
            : err.code === 3
              ? "📍 Location request timed out. Please try again or enter manually."
              : "📍 Could not get your location. Try enabling GPS or entering manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
    );
  }

  const modalProps = {
    onClose: () => setModalOpen(false),
    locationInput,
    onInput: handleInput,
    onClear: handleClearInput,
    onSubmit: handleSubmitLocation,
    onUseLocation: handleUseMyLocation,
    locating,
    locationError,
    pleaseEnter,
    invalidZip,
    clearInput,
    detectedAddress,
  };

  return (
    <>
      <div className={styles.mainWrapper}>
        <div className={styles.cardContainer}>
          <div className={styles.imageLayoutPane}>
            <img
              className={styles.bannerImage}
              alt="Deusizi Pro Service Van"
              src="chefboldmart.JPG"
            />
          </div>

          <div className={styles.contentLayoutPane}>
            <h1 className={styles.searchHeading}>
              Find a Deusizi Sparkle Pro Near Me
            </h1>
            <p className={styles.searchSubheading}>
              Let us know how we can help you today.
            </p>

            <div className={styles.searchActionForm}>
              <div className={styles.inputIconWrapper}>
                <i className="fa fa-map-marker" aria-hidden="true" />
                <input
                  className={styles.geoInput}
                  type="text"
                  placeholder="Enter Zip/Postal Code or City"
                  value={inlineInput}
                  onChange={(e) => setInlineInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInlineFind()}
                />
              </div>

              <button
                type="button"
                className={styles.submitSearchButton}
                onClick={handleInlineFind}
              >
                Find My Pro
              </button>
            </div>

            <div
              className={styles.useLocationTrigger}
              onClick={() => {
                setModalOpen(true);
                handleUseMyLocation();
              }}
            >
              <i className="fa fa-crosshairs" aria-hidden="true" />
              <span>Use my current location</span>
            </div>

            <div className={styles.phoneContactWrapper}>
              <span className={styles.callLabel}>Or speak to an expert:</span>
              <a href="tel:+2348030588774" className={styles.phoneLink}>
                <i className="fa fa-phone" aria-hidden="true" /> +234 803 058
                8774
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal — opens when inline input is empty or "Use my location" is clicked */}
      {modalOpen && <LocationModal {...modalProps} />}
    </>
  );
}
