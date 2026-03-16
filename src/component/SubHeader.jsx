import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AboutUs from "./AboutUs";
import CleaningTips from "./CleaningTips";
import LightCommercial from "./LightCommercial";
import Practically from "./Practically";
import Residential from "./Residential";
import WhyHireUs from "./WhyHireUs";
import styles from "./SubHeader.module.css";

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

// ── Location modal (shared between mobile + desktop) ─────────────────────────
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
    <div className={styles.localIzimaidMain}>
      <div className={styles.localIzimaidMainDiv}>
        <div className={styles.localIzimaidMainDivSub}>
          <div onClick={onClose} className={styles.timesHover}>
            <h4>&times;</h4>
          </div>

          <div className={styles.logoDiv}>
            <img className={styles.logo2} alt="Logo" src="izimaid.jpg" />
          </div>

          <div className={styles.located}>
            <h4>Tell us where you are located</h4>
          </div>

          <div className={styles.ZIPcode}>
            <input
              onChange={onInput}
              value={locationInput}
              type="text"
              placeholder="Enter ZIP Code, City, or Street"
            />
            {clearInput && (
              <h3 onClick={onClear} className={styles.timesInput}>
                &times;
              </h3>
            )}
            <div
              onClick={onUseLocation}
              className={styles.location}
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

          {/* Display detected address details */}
          {detectedAddress && (
            <div
              style={{
                background: "rgb(209, 247, 224)",
                padding: "10px 12px",
                borderRadius: "8px",
                marginTop: 12,
                fontSize: "12px",
                color: "rgb(10, 107, 46)",
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
            <h5 className={styles.zip}>Please enter a location</h5>
          )}
          {invalidZip && (
            <h5 className={styles.zip}>Please enter at least 2 characters</h5>
          )}

          <div onClick={onSubmit} className={styles.help}>
            <h4>Find Local Help</h4>
          </div>

          <div className={styles.field}>
            <p>*indicates a required field</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SubHeader() {
  const navigate = useNavigate();

  const [locationInput, setLocationInput] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const [findLocalIzimaid, setFindLocalIzimaid] = useState(false);
  const [pleaseEnter, setPleaseEnter] = useState(false);
  const [invalidZip, setInvalidZip] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedAddress, setDetectedAddress] = useState(null);

  function handleInput(e) {
    const val = e.target.value;
    setLocationInput(val);
    setDetectedAddress(null); // Clear detected address when user types

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
    setFindLocalIzimaid(false);
    navigate(`/maids?location=${encodeURIComponent(locationInput)}`);
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    setLocationError("");
    setDetectedAddress(null);

    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 seconds for iOS
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

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
          setLocationInput(formattedAddress);
          setLocating(false);

          // Auto-navigate with the formatted address
          setTimeout(() => {
            setFindLocalIzimaid(false);
            navigate(`/maids?location=${encodeURIComponent(formattedAddress)}`);
          }, 1000);
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setLocating(false);

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

            setLocationInput(location);
            setDetectedAddress({
              city,
              postalCode: postcode,
              country,
              street: "",
              state: "",
            });

            setTimeout(() => {
              setFindLocalIzimaid(false);
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
      geolocationOptions,
    );
  }

  const modalProps = {
    onClose: () => setFindLocalIzimaid(false),
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
      {/* ── Mobile header ── */}
      <div className={styles.header}>
        <div className={styles.SubMain}>
          <div className={styles.SubHeader2}>
            <Link to="/request-a-free-estimate" className={styles.sub1}>
              <i className="fa fa-calendar" aria-hidden="true" />
              <p className={styles.subP}>Request a Free Estimate</p>
            </Link>
            <a href="tel:+2348030588774" className={styles.sub2}>
              <i className="fa fa-phone" aria-hidden="true" />
              <p>Call Us</p>
            </a>
          </div>
          <div className={styles.minsDiv}>
            <p className={styles.mins}>In under 2 mins</p>
          </div>
        </div>

        <div
          onClick={() => setFindLocalIzimaid(true)}
          className={styles.thirdHeader}
        >
          <i className="fa fa-map-marker" aria-hidden="true" />
          <p>Find My Local Deusizi Sparkle Maid</p>
        </div>

        {findLocalIzimaid && <LocationModal {...modalProps} />}
      </div>

      {/* ── Desktop header ── */}
      <div className={styles.thirdHeaderMain}>
        <div className={styles.secondMain1}>
          <Link
            to="https://izimaid-sage.vercel.app"
            className={styles.secondMainLogo}
          >
            <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
          </Link>

          <div className={styles.secondMain}>
            <div className={styles.thirdPara1}>
              <p>Gift Certificates</p>
            </div>
            <div className={styles.thirdPara2}>
              <p>Apply Locally</p>
            </div>
            <div className={styles.thirdPara2}>
              <p>Aplicar Localmente</p>
            </div>
            <div>
              <p className={styles.thirdPara3}>Own a Franchise</p>
            </div>

            <div
              className={styles.thirdHeader3}
              onClick={() => setFindLocalIzimaid(true)}
            >
              <i className="fa fa-map-marker" aria-hidden="true" />
              <p>Find My Local Deusizi Sparkle Maid</p>
            </div>

            {findLocalIzimaid && <LocationModal {...modalProps} />}
          </div>
        </div>

        <div className={styles.thirdMain}>
          <div className={styles.residence}>
            <p className={styles.thirdMainDiv1}>Residential</p>
            <div className={styles.hoverMain}>
              <Residential />
            </div>
          </div>
          <div className={styles.residence}>
            <p className={styles.thirdMainDiv2}>Light Commercial</p>
            <div className={styles.hoverMain}>
              <LightCommercial />
            </div>
          </div>
          <div className={styles.residence}>
            <p className={styles.thirdMainDiv3}>Why Hire Us</p>
            <div className={styles.hoverMain}>
              <WhyHireUs />
            </div>
          </div>
          <div className={styles.residence}>
            <p className={styles.thirdMainDiv4}>About Us</p>
            <div className={styles.hoverMain}>
              <AboutUs />
            </div>
          </div>
          <div className={styles.residence}>
            <p className={styles.thirdMainDiv5}>Cleaning Tip</p>
            <div className={styles.hoverMain}>
              <CleaningTips />
            </div>
          </div>
          <div className={styles.residence}>
            <p className={styles.thirdMainDiv6}>Practically Spotless Blog</p>
            <div className={styles.hoverMain}>
              <Practically />
            </div>
          </div>

          <div className={styles.SubMain}>
            <div className={styles.SubHeader3}>
              <a href="/request-a-free-estimate" className={styles.sub3}>
                <i className="fa fa-calendar" aria-hidden="true" />
                <p className={styles.subP3}>Request a Free Estimate</p>
              </a>
              <div className={styles.minsDi}>
                <p className={styles.mins}>In under 2 mins</p>
              </div>
            </div>
            <a className={styles.numberDiv} href="tel:+2348030588774">
              <p className={styles.number}>0803 0588 774</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
