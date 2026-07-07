import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./CookieBanner.module.css";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <p className={styles.message}>
            🍪 We use cookies and local storage to keep you logged in and
            remember your preferences. We never sell your data. By using our
            platform, you consent to our use of cookies as described in our{" "}
            <Link to="/privacy-policy" className={styles.link}>
              Privacy Policy
            </Link>
            .
          </p>
          <div className={styles.actions}>
            <button className={styles.acceptBtn} onClick={acceptCookies}>
              Accept
            </button>
            <button className={styles.declineBtn} onClick={declineCookies}>
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
