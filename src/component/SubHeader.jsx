import { Link } from "react-router-dom";

import AboutUs from "./AboutUs";
import CleaningTips from "./CleaningTips";
import LightCommercial from "./LightCommercial";
import Practically from "./Practically";
import Residential from "./Residential";
import styles from "./SubHeader.module.css";
import WhyHireUs from "./WhyHireUs";
import { useState } from "react";

export default function SubHeader() {
  const [locationInput, setLocationInput] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const [findLocalIzimaid, setFindLocalIzimaid] = useState(false);
  const [pleaseEnter, setPleaseEnter] = useState(false);
  const [invalidZip, setInvalidZip] = useState(false);

  function handleInput(e) {
    setLocationInput(e.target.value);

    if (!locationInput.length) {
      setInvalidZip(false);
      setClearInput(false);
    }

    if (locationInput.length > 1) {
      setPleaseEnter(false);
    } else {
      setPleaseEnter(false);
      setInvalidZip(true);
      setClearInput(true);
    }
  }

  function handleClearInput() {
    setLocationInput("");
    setClearInput(false);
    setInvalidZip(false);
  }

  function handleSubmitLocation() {
    // locationInput.length && setPleaseEnter(false);
    invalidZip && locationInput.length
      ? setPleaseEnter(false)
      : setPleaseEnter(true);
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.SubMain}>
          <div className={styles.SubHeader2}>
            <Link to="/request-a-free-estimate" className={styles.sub1}>
              <i class="fa fa-calendar" aria-hidden="true"></i>

              <p className={styles.subP}>Request a Free Estimate</p>
            </Link>

            <a href="tel: +2348030588774" className={styles.sub2}>
              <i class="fa fa-phone" aria-hidden="true"></i>
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
          <i class="fa fa-map-marker" aria-hidden="true"></i>

          <p>Find My Local IziMaid</p>
        </div>

        {findLocalIzimaid && (
          <div className={styles.localIzimaidMain}>
            <div className={styles.localIzimaidMainDiv}>
              <div className={styles.localIzimaidMainDivSub}>
                <div
                  onClick={() => setFindLocalIzimaid(false)}
                  className={styles.timesHover}
                >
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
                    onChange={handleInput}
                    type="text"
                    placeholder="Enter ZIP Code"
                  />

                  {clearInput && (
                    <h3
                      onClick={handleClearInput}
                      className={styles.timesInput}
                    >
                      &times;
                    </h3>
                  )}

                  <div className={styles.location}>
                    <i class="fa fa-map-marker" aria-hidden="true"></i>

                    <h5>Use My Location</h5>
                  </div>
                </div>

                {pleaseEnter && (
                  <h5 className={styles.zip}>Please enter a zip code</h5>
                )}

                {invalidZip && (
                  <h5 className={styles.zip}> Invalid zip code format</h5>
                )}

                <div onClick={handleSubmitLocation} className={styles.help}>
                  <h4>Find Local Help</h4>
                </div>

                <div className={styles.field}>
                  <p>*indicates a reqiured field</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
              <p>Gift Certifcates</p>
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
              <i class="fa fa-map-marker" aria-hidden="true"></i>

              <p>Find My Local IziMaid</p>
            </div>

            {findLocalIzimaid && (
              <div className={styles.localIzimaidMain}>
                <div className={styles.localIzimaidMainDiv}>
                  <div className={styles.localIzimaidMainDivSub}>
                    <div
                      onClick={() => setFindLocalIzimaid(false)}
                      className={styles.timesHover}
                    >
                      <h4>&times;</h4>
                    </div>

                    <div className={styles.logoDiv}>
                      <img
                        className={styles.logo2}
                        alt="Logo"
                        src="izimaid.jpg"
                      />
                    </div>

                    <div className={styles.located}>
                      <h4>Tell us where you are located</h4>
                    </div>

                    <div className={styles.ZIPcode}>
                      <input
                        onChange={handleInput}
                        type="text"
                        placeholder="Enter ZIP Code"
                      />

                      {clearInput && (
                        <h3
                          onClick={handleClearInput}
                          className={styles.timesInput}
                        >
                          &times;
                        </h3>
                      )}

                      <div className={styles.location}>
                        <i class="fa fa-map-marker" aria-hidden="true"></i>

                        <h5>Use My Location</h5>
                      </div>
                    </div>

                    {pleaseEnter && (
                      <h5 className={styles.zip}>Please enter a zip code</h5>
                    )}

                    {invalidZip && (
                      <h5 className={styles.zip}> Invalid zip code format</h5>
                    )}

                    <div className={styles.help}>
                      <h4 onClick={handleSubmitLocation}>Find Local Help</h4>
                    </div>

                    <div className={styles.field}>
                      <p>*indicates a reqiured field</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                <i class="fa fa-calendar" aria-hidden="true"></i>

                <p className={styles.subP3}>Request a Free Estimate</p>
              </a>

              <div className={styles.minsDi}>
                <p className={styles.mins}>In under 2 mins</p>
              </div>
            </div>

            <a className={styles.numberDiv} href="tel: +2348030588774">
              <p className={styles.number}>0803 0588 774</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
