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
        <div className={styles.modalInner}>
          <div onClick={onClose} className={styles.modalClose}>
            <h4>&times;</h4>
          </div>

          <div className={styles.modalLogoDiv}>
            <img className={styles.modalLogo} alt="Logo" src="izimaid.jpg" />
          </div>

          <div className={styles.modalLocated}>
            <h4>Tell us where you are located</h4>
          </div>

          <div className={styles.modalZipRow}>
            <input
              onChange={onInput}
              value={locationInput}
              type="text"
              placeholder="Enter ZIP Code, City, or Street"
            />
            {clearInput && (
              <h3 onClick={onClear} className={styles.modalClear}>
                &times;
              </h3>
            )}
            <div
              onClick={onUseLocation}
              className={styles.modalUseLocation}
              style={{
                cursor: locating ? "wait" : "pointer",
                opacity: locating ? 0.5 : 1,
              }}
            >
              <h5>
                {locating ? "📍 Detecting location..." : "📍 Use My Location"}
              </h5>
            </div>
            {locationError && (
              <h5 style={{ color: "red", fontSize: 11, marginTop: 4 }}>
                {locationError}
              </h5>
            )}
          </div>

          {detectedAddress && (
            <div
              style={{
                background: "rgb(209,247,224)",
                padding: "10px 12px",
                borderRadius: "8px",
                marginTop: 12,
                fontSize: "12px",
                color: "rgb(10,107,46)",
                lineHeight: "1.6",
              }}
            >
              <p style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>
                ✅ Location Detected:
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
                <p style={{ margin: "2px 0" }}>🌍 {detectedAddress.country}</p>
              )}
            </div>
          )}

          {pleaseEnter && (
            <h5 className={styles.modalError}>Please enter a location</h5>
          )}
          {invalidZip && (
            <h5 className={styles.modalError}>
              Please enter at least 2 characters
            </h5>
          )}

          <div onClick={onSubmit} className={styles.modalFindBtn}>
            <h4>Find Local Help</h4>
          </div>

          <div className={styles.modalField}>
            <p>*indicates a required field</p>
          </div>
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
      <div className={styles.main}>
        <div className={styles.Submain}>
          <div className={styles.SubmainDiv}>
            <div className={styles.imgDiv}>
              <img
                alt="iziBest Cleaning Car"
                src="https://png.pngtree.com/png-clipart/20240616/original/pngtree-trends-in-car-wash-technology-png-image_15341820.png"
              />
            </div>

            <div className={styles.Submain}>
              <div className={styles.SubDiv}>
                <h1>Find a Deusizi Sparkle Maid Near Me</h1>
                <p>Let us know how we can help you today.</p>

                <div className={styles.SubmainFlex}>
                  <div className={styles.Submain2}>
                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                    <input
                      type="text"
                      placeholder="Enter Zip/Postal Code or City"
                      value={inlineInput}
                      onChange={(e) => setInlineInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleInlineFind()}
                    />
                  </div>
                  <div
                    className={styles.useLocation}
                    onClick={() => {
                      setModalOpen(true);
                      handleUseMyLocation();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-crosshairs" aria-hidden="true" />
                    <span>Use my current location</span>
                  </div>

                  <h4
                    className={styles.find}
                    onClick={handleInlineFind}
                    style={{ cursor: "pointer" }}
                  >
                    Find My Deusizi Sparkle Maid
                  </h4>
                </div>

                {/* Use My Location shortcut */}

                <div className={styles.Submain}>
                  <div className={styles.Submain3}>
                    <h2>Call us at +2348030588774</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal — opens when inline input is empty or "Use my location" is clicked */}
      {modalOpen && <LocationModal {...modalProps} />}
    </>
  );
}
