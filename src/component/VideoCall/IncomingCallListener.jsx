import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaTimes } from "react-icons/fa";
import styles from "./IncomingCallListener.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function IncomingCallListener() {
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(null);
  const pollRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    async function pollIncoming() {
      try {
        const res = await fetch(`${API_URL}/api/bookings/active-call`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.call) {
          setIncomingCall(data.call);
        } else {
          // Only clear if no incoming call (prevents flicker)
          setIncomingCall((prev) => (prev ? null : prev));
        }
      } catch (err) {
        // silent fail
      }
    }

    // Poll immediately, then every 5 seconds
    pollIncoming();
    pollRef.current = setInterval(pollIncoming, 5000);

    return () => clearInterval(pollRef.current);
  }, [token]);

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
    // Navigate to booking detail page with incoming call data
    navigate(`/bookings/${incomingCall.booking_id}`, {
      state: {
        incomingCall: {
          channel: incomingCall.channel,
          token: incomingCall.token,
          appId: incomingCall.app_id,
          callerName: incomingCall.caller_name,
        },
      },
    });
    setIncomingCall(null);
  }

  if (!incomingCall) return null;

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
