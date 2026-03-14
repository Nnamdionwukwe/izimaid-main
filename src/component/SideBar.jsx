import { Link } from "react-router-dom";

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

          <a href="https://izimaid-sage.vercel.app">
            <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
          </a>

          <div className={styles.SubHeader2}>
            <Link to="request-a-free-estimate" className={styles.sub1}>
              <i class="fa fa-calendar" aria-hidden="true"></i>

              <p className={styles.subP}>Request a Free Estimate</p>
            </Link>

            <a href="tel: +2348030588774" className={styles.sub2}>
              <i class="fa fa-phone" aria-hidden="true"></i>
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
                                <div className={styles.residentialDI23}>
                                  <i
                                    class="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>What's Included</p>
                                </div>

                                <div className={styles.residentialDI23}>
                                  <i
                                    class="fa fa-th-large"
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
                              <p>IziBest Foundation</p>
                              <p className={styles.greater}>&darr;</p>
                            </div>

                            {iziBest2 && (
                              <div className={styles.residentialDI}>
                                <div className={styles.residentialDI23}>
                                  <i
                                    class="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>Donate</p>
                                </div>

                                <div className={styles.residentialDI23}>
                                  <i
                                    class="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>IziBest Awards</p>
                                </div>

                                <div className={styles.residentialDI23}>
                                  <i
                                    class="fa fa-th-large"
                                    aria-hidden="true"
                                  ></i>
                                  <p>Local Shelter/Agency Support</p>
                                </div>

                                <div className={styles.residentialDI23}>
                                  <i
                                    class="fa fa-th-large"
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

            <div className={styles.thirdHeader}>
              <i class="fa fa-map-marker" aria-hidden="true"></i>

              <p>Find My Local IziMaid</p>
            </div>

            {isOpenFotter && (
              <div className={styles.icons}>
                <i class="fa-brands fa-facebook"></i>
                <i class="fa-brands fa-instagram"></i>
                <i class="fa-brands fa-x-twitter"></i>
                <i class="fa-brands fa-youtube"></i>
                <i class="fa-brands fa-linkedin"></i>
              </div>
            )}

            {isOpenFotter && (
              <div className={styles.giftsDiv}>
                <p>Gift Certificates</p>
                <p>Apply Locally</p>
                <p>Applicar Localmente</p>
                <p>Own a Franchise</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
