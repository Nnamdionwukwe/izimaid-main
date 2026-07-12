import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPhoneAlt, FaTimes } from "react-icons/fa";
import styles from "./IncomingCallListener.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function IncomingCallListener() {
  const navigate = useNavigate();
  const location = useLocation();
  const [incomingCall, setIncomingCall] = useState(null);
  const pollRef = useRef(null);
  const token = localStorage.getItem("token");
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!token) return;

    async function pollIncoming() {
      // Skip if navigating or already on booking detail
      if (isProcessingRef.current) return;
      if (location.pathname.match(/^\/bookings\//)) return;

      try {
        const res = await fetch(`${API_URL}/api/bookings/active-call`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.call) {
          setIncomingCall(data.call);
        } else {
          setIncomingCall(null);
        }
      } catch (err) {
        // silent fail
      }
    }

    pollIncoming();
    pollRef.current = setInterval(pollIncoming, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [token, location]);

  async function declineCall() {
    try {
      await fetch(
        `${API_URL}/api/bookings/${incomingCall.booking_id}/video-call`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.error("Decline failed:", err);
    }
    setIncomingCall(null);
  }

  function acceptCall() {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Stop polling immediately
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    const callData = incomingCall;
    setIncomingCall(null);

    // Ensure appId is passed correctly
    navigate(`/bookings/${callData.booking_id}`, {
      state: {
        incomingCall: {
          channel: callData.channel,
          token: callData.token,
          appId: callData.app_id, // ✅ use correct key
          callerName: callData.caller_name,
        },
      },
    });

    // Re-enable after 10 seconds (fallback)
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 10000);
  }

  // Only show if on non‑booking page and we have a call
  if (!incomingCall || location.pathname.match(/^\/bookings\//)) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.ringingIcon}>
            <FaPhoneAlt />
          </div>
          <button className={styles.closeBtn} onClick={declineCall}>
            <FaTimes />
          </button>
        </div>
        <h3 className={styles.title}>Incoming Video Call</h3>
        <p className={styles.caller}>
          {incomingCall.caller_name} is calling you
        </p>
        <div className={styles.actions}>
          <button className={styles.declineBtn} onClick={declineCall}>
            Decline
          </button>
          <button className={styles.acceptBtn} onClick={acceptCall}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
