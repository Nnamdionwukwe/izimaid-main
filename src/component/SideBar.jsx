import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import styles from "./SideBsr.module.css";
import ResidentialSideBar from "./ResidentialSideBar";
import LightCommercialSideBar from "./LightCommercialSideBar";
import WhyHireUsSideBar from "./WhyHireUseSideBar";
import AboutUsSideBar from "./AboutUsSideBar";
import CleaningTipsSideBar from "./CleaningTipsSIdeBar";
import PracticalSideBar from "./PracticalSideBar";
import DeusiziAcademy from "./DeusiziAcademy";

const logo = "/deusizi.jpg";

// ── Helper functions (copied from SubHeader) ──
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

export function LocationModal({
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
            <img className={styles.logo2} alt="Logo" src="deusizi.jpg" />
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

// Your social media links
const facebookLink = "https://www.facebook.com/share/1DH3rUFVdU/";
const instagramLink =
  "https://www.instagram.com/deusizisparkle?utm_source=qr&igsh=ZGR2b3BqYW45MWow";
const twitterLink = "https://x.com/Deusizigroup";
const linkedinLink =
  "https://www.linkedin.com/in/queen-lily-adiyono-11a767420?utm_source=share_via&utm_content=profile&utm_medium=member_android";
const youtubeLink = "https://youtube.com/@deusizisparkle?si=rjTmvPkm8AaAERUF";

export default function SideBar({ isOpen, setIsOpen }) {
  const [isClose, setIsClose] = useState(false);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen22, setIsOpen22] = useState(false);
  const [isOpen3, setIsOpen3] = useState(true);
  const [isOpen33, setIsOpen33] = useState(false);
  const [isOpen4, setIsOpen4] = useState(true);
  const [isOpen44, setIsOpen44] = useState(false);
  const [isOpen5, setIsOpen5] = useState(true);
  const [isOpen55, setIsOpen55] = useState(false);
  const [isOpen6, setIsOpen6] = useState(true);
  const [isOpen66, setIsOpen66] = useState(false);
  const [isOpen7, setIsOpen7] = useState(true);
  const [isOpen77, setIsOpen77] = useState(false);
  const [isOpen8, setIsOpen8] = useState(true);
  const [isOpen88, setIsOpen88] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(false);
  const [iziBest, setIziBest] = useState(true);
  const [iziBest2, setIziBest2] = useState(false);
  const [isAll, setIsAll] = useState(false);

  const [findLocalIzimaid, setFindLocalIzimaid] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const [pleaseEnter, setPleaseEnter] = useState(false);
  const [invalidZip, setInvalidZip] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedAddress, setDetectedAddress] = useState(null);

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
            setFindLocalIzimaid(false);
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
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 },
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

  // ── NEW: logout modal state ──
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isOpenFotter, setIsOpenFotter] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || null;

  function handleAuthBtn() {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  // ── NEW: open logout modal ──
  function handleLogoutClick() {
    setShowLogoutModal(true);
  }

  // ── NEW: confirm logout ──
  function confirmLogout() {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/login");
    window.location.reload();
  }

  // ── NEW: cancel logout ──
  function cancelLogout() {
    setShowLogoutModal(false);
  }

  function handleBookingNavigation() {
    if (!token) {
      navigate("/login");
      return;
    }

    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "maid":
        navigate("/maid");
        break;
      case "customer":
      default:
        navigate("/my-bookings");
        break;
    }
  }

  function handleCloseAll() {
    setIsClose(false);
    setIsOpen2(true);
    setIsOpen22(false);
    setIsOpen3(true);
    setIsOpen33(false);
    setIsOpen4(true);
    setIsOpen44(false);
    setIsOpen5(true);
    setIsOpen55(false);
    setIsOpen6(true);
    setIsOpen66(false);
    setIsOpen7(true);
    setIsOpen8(true);
    setIsOpen88(false);
    setIsOpen77(false);
    setIsOpenFotter(true);
    setIsAll(false);
  }

  function handleIsOpen2() {
    setIsClose(true);
    setIsOpen2(true);
    setIsOpen22(true);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpenFotter(false);
  }

  function handleIsOpen3() {
    setIsClose(true);
    setIsOpen2(false);
    setIsOpen3(true);
    setIsOpen33(true);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpenFotter(false);
  }

  function handleIsOpen4() {
    setIsClose(true);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(true);
    setIsOpen44(true);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpenFotter(false);
  }

  function handleIsOpen5() {
    setIsClose(true);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen44(true);
    setIsOpen5(true);
    setIsOpen55(true);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsAll(true);
    setIsOpenFotter(false);
    setOpenFAQ(false);
    setIziBest2(false);
  }

  function handleIsOpen6() {
    setIsClose(true);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen44(true);
    setIsOpen5(false);
    setIsOpen55(true);
    setIsOpen6(true);
    setIsOpen66(true);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpenFotter(false);
  }

  function handleIsOpen7() {
    setIsClose(true);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen44(true);
    setIsOpen5(false);
    setIsOpen55(true);
    setIsOpen6(false);
    setIsOpen7(true);
    setIsOpen8(false);
    setIsOpen88(false);
    setIsOpen77(true);
    setIsOpenFotter(false);
  }

  function handleIsOpen8() {
    setIsClose(true);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen44(true);
    setIsOpen5(false);
    setIsOpen55(true);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(true);
    setIsOpen88(true);
    setIsOpenFotter(false);
  }

  function handleFAQ() {
    setOpenFAQ(true);
    setIsOpen55(false);
    setIziBest2(false);
  }

  function handleIzibest() {
    setOpenFAQ(false);
    setIsOpen55(false);
    setIziBest2(true);
  }

  return (
    <>
      {isOpen && (
        <div className={styles.sideBarMain}>
          <div className={styles.menuDIv}>
            <div className={styles.menu}>MENU</div>

            <div className={styles.times}>
              <p onClick={() => setIsOpen((is) => !is)}>&times;</p>
            </div>
          </div>

          <a href="https://deusizisparkle.com">
            <img className={styles.logo} alt="Logo" src={logo} />
          </a>

          <div className={styles.SubHeader2}>
            <Link to="request-a-free-estimate" className={styles.sub1}>
              <i className="fa fa-calendar" aria-hidden="true"></i>

              <p className={styles.subP}>Request a Free Estimate</p>
            </Link>

            <a href="tel: +2348030588774" className={styles.sub2}>
              <i className="fa fa-phone" aria-hidden="true"></i>
              <p>Call Us</p>
            </a>
          </div>

          <div>
            {isClose && (
              <div>
                <p className={styles.x} onClick={handleCloseAll}>
                  &larr;
                </p>
              </div>
            )}

            {isOpen2 && (
              <div>
                <div onClick={handleIsOpen2} className={styles.resident123}>
                  <p>Residential</p>
                  <p className={styles.greater}>&darr;</p>
                </div>

                <div>
                  {isOpen22 && (
                    <div className={styles.residentialHoverDiv}>
                      <ResidentialSideBar />
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOpen3 && (
              <div>
                <div onClick={handleIsOpen3} className={styles.resident123}>
                  <p>Light Commercial</p>
                  <p className={styles.greater}>&darr;</p>
                </div>

                <div>
                  {isOpen33 && (
                    <div>
                      <LightCommercialSideBar />
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOpen4 && (
              <div>
                <div onClick={handleIsOpen4} className={styles.resident123}>
                  <p>Why Hire Us</p>
                  <p className={styles.greater}>&darr;</p>
                </div>

                <div>
                  {isOpen44 && (
                    <div>
                      <WhyHireUsSideBar />
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOpen5 && (
              <div>
                <div onClick={handleIsOpen5} className={styles.resident123}>
                  <p>About Us</p>
                  <p className={styles.greater}>&darr;</p>
                </div>

                <div>
                  {isOpen55 && (
                    <div className={styles.residentialHoverDiv}>
                      <AboutUsSideBar iziBest={iziBest} openFAQ={openFAQ} />
                    </div>
                  )}

                  <>
                    {isAll && (
                      <div>
                        <div className={styles.residentialD}>
                          <div
                            className={styles.resident1234}
                            onClick={handleFAQ}
                          >
                            <p>FAQ</p>
                            <p className={styles.greater}>&darr;</p>
                          </div>

                          <div>
                            {openFAQ && (
                              <div className={styles.residentialDI}>
                                <div
                                  onClick={() => navigate("/whats-included")}
                                  className={styles.residentialDI23}
                                >
                                  <i
                                    className="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>What's Included</p>
                                </div>

                                <div
                                  onClick={() =>
                                    navigate("/before-after-cleaning")
                                  }
                                  className={styles.residentialDI23}
                                >
                                  <i
                                    className="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p className={styles.u}>
                                    Before and After Your Cleaning
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {iziBest && (
                          <div className={styles.residentiaDI}>
                            <div
                              className={styles.resident1234}
                              onClick={handleIzibest}
                            >
                              <p>Deausizi Foundation</p>
                              <p className={styles.greater}>&darr;</p>
                            </div>

                            {iziBest2 && (
                              <div className={styles.residentialDI}>
                                <div
                                  onClick={() => navigate("/foundation")}
                                  className={styles.residentialDI23}
                                >
                                  <i
                                    className="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>Donate</p>
                                </div>

                                <div
                                  onClick={() => navigate("/awards")}
                                  className={styles.residentialDI23}
                                >
                                  <i
                                    className="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>Deusizi Sparkle Awards</p>
                                </div>

                                <div
                                  onClick={() =>
                                    navigate("/local-shelter-support")
                                  }
                                  className={styles.residentialDI23}
                                >
                                  <i
                                    className="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>Local Shelter/Agency Support</p>
                                </div>

                                <div
                                  onClick={() =>
                                    navigate("/board-of-directors")
                                  }
                                  className={styles.residentialDI23}
                                >
                                  <i
                                    className="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>Board of Directors</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                </div>
              </div>
            )}

            {isOpen6 && (
              <div>
                <div onClick={handleIsOpen6} className={styles.resident123}>
                  <p>Cleaning Tips</p>
                  <p className={styles.greater}>&darr;</p>
                </div>

                <div>
                  {isOpen66 && (
                    <div>
                      <CleaningTipsSideBar />
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOpen7 && (
              <div>
                <div onClick={handleIsOpen7} className={styles.resident123}>
                  <p>Practical Spotless Blog</p>
                  <p className={styles.greater}>&darr;</p>
                </div>

                <div>
                  {isOpen77 && (
                    <div>
                      <PracticalSideBar />
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOpen8 && (
              <div>
                <div onClick={handleIsOpen8} className={styles.resident123}>
                  <p>Deusizi Academy</p>
                  <p className={styles.greater}>&darr;</p>
                </div>

                <div>
                  {isOpen88 && (
                    <div>
                      <DeusiziAcademy />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              className={styles.thirdHeader}
              onClick={() => setFindLocalIzimaid(true)}
            >
              <i className="fa fa-map-marker" aria-hidden="true"></i>
              <p>Find My Local Deusizi Sparkle Professionals</p>
            </div>

            <button
              className={styles.authBtn}
              onClick={handleBookingNavigation}
            >
              {token && role === "admin"
                ? "Admin Dashboard"
                : token && role === "maid"
                  ? "Maid Dashboard"
                  : token
                    ? "My Bookings"
                    : "My Bookings"}
            </button>

            {/* ─── SOCIAL ICONS WITH LINKS ─── */}
            {isOpenFotter && (
              <div className={styles.icons}>
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a
                  href={twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a
                  href={youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </div>
            )}

            {isOpenFotter && (
              <div className={styles.giftsDiv}>
                <p onClick={() => navigate("/gift-certificates")}>
                  Gift Certificates
                </p>
                <p onClick={() => navigate("/apply-locally")}>Apply Locally</p>
                <p onClick={() => navigate("/aplicar-localmente")}>
                  Applicar Localmente
                </p>
                <p onClick={() => navigate("/franchise")}>Own a Franchise</p>

                {/* ── Logout button now opens modal ── */}
                <button className={styles.authBtn} onClick={handleLogoutClick}>
                  {token ? `Logout (${user.name?.split(" ")[0]})` : "Login"}
                </button>
              </div>
            )}

            {/* ── Logout Confirmation Modal ── */}
            {showLogoutModal && (
              <div className={styles.logoutModalOverlay} onClick={cancelLogout}>
                <div
                  className={styles.logoutModal}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.logoutModalHeader}>
                    <i className="fa fa-sign-out" aria-hidden="true" />
                    <h3>Confirm Logout</h3>
                  </div>
                  <p className={styles.logoutModalText}>
                    Are you sure you want to log out? You will need to sign in
                    again to access your account.
                  </p>
                  <div className={styles.logoutModalButtons}>
                    <button
                      className={styles.logoutModalCancel}
                      onClick={cancelLogout}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.logoutModalConfirm}
                      onClick={confirmLogout}
                    >
                      <i className="fa fa-sign-out" aria-hidden="true" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Location Modal ── */}
            {findLocalIzimaid && <LocationModal {...modalProps} />}
          </div>
        </div>
      )}
    </>
  );
}
