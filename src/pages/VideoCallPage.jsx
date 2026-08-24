// src/pages/VideoCallPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import VideoCall from "../component/VideoCall/VideoCall";

export default function VideoCallPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get("bookingId");
  const channel = searchParams.get("channel");
  const token = searchParams.get("token");
  const appId = searchParams.get("appId");
  const otherName =
    searchParams.get("otherName") ||
    searchParams.get("callerName") ||
    "Remote User";

  const [showCall, setShowCall] = useState(true);

  // If missing parameters, show error
  if (!bookingId || !channel || !token) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f172a",
          color: "white",
          flexDirection: "column",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>❌ Missing Video Call Parameters</h2>
        <p style={{ color: "#94a3b8", marginTop: "8px" }}>
          Please go back and try again.
        </p>
        <button
          onClick={() => (window.location.href = "deusizicustomer://")}
          style={{
            padding: "12px 24px",
            marginTop: "20px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Go Back to App
        </button>
      </div>
    );
  }

  const handleClose = () => {
    setShowCall(false);
    // Redirect back to the app
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage("end_call");
    } else {
      window.location.href = `deusizicustomer://booking/${bookingId}`;
    }
  };

  if (!showCall) {
    return null;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <VideoCall
        bookingId={bookingId}
        channel={channel}
        token={token}
        appId={appId}
        otherName={otherName}
        onClose={handleClose}
      />
    </div>
  );
}
