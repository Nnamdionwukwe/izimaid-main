import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import styles from "./SideBsr.module.css";
import ResidentialSideBar from "./ResidentialSideBar";
import LightCommercialSideBar from "./LightCommercialSideBar";
import WhyHireUsSideBar from "./WhyHireUseSideBar";
import AboutUsSideBar from "./AboutUsSideBar";
import CleaningTipsSideBar from "./CleaningTipsSIdeBar";
import PracticalSideBar from "./PracticalSideBar";

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
  const [openFAQ, setOpenFAQ] = useState(false);
  const [iziBest, setIziBest] = useState(true);
  const [iziBest2, setIziBest2] = useState(false);
  const [isAll, setIsAll] = useState(false);

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
    setIsOpen77(true);
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
            <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
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
                                  onClick={() => navigate("/awards")}
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
            <dhiv className={styles.thirdHeader}>
              <i className="fa fa-map-marker" aria-hidden="true"></i>
              <p>Find My Local Deusizi Sparkle Maid</p>
              70
            </dhiv>
            1hnm`gift-certificateszgf[]`
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
            {isOpenFotter && (
              <div className={styles.icons}>
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-x-twitter"></i>
                <i className="fa-brands fa-youtube"></i>
                <i className="fa-brands fa-linkedin"></i>
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
                <video src=""></video>{" "}
                <button className={styles.authBtn} onClick={handleAuthBtn}>
                  {token ? `Logout (${user.name?.split(" ")[0]})` : "Login"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
