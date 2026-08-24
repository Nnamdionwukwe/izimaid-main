// src/pages/VideoCallPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import VideoCall from "../component/VideoCall/VideoCall";

export default function VideoCallPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Log ALL URL parameters
  console.log(
    "📹 [VideoCallPage] All URL params:",
    Object.fromEntries(searchParams.entries()),
  );

  const bookingId = searchParams.get("bookingId");
  const channel = searchParams.get("channel");
  const token = searchParams.get("token");
  const appId = searchParams.get("appId");
  const otherName =
    searchParams.get("otherName") ||
    searchParams.get("callerName") ||
    "Remote User";
  const role = searchParams.get("role") || "customer"; // ← NEW: role parameter for app detection

  const [showCall, setShowCall] = useState(true);

  // Detailed logging of received parameters
  console.log("📹 [VideoCallPage] Received params:", {
    bookingId: bookingId || "MISSING",
    channel: channel
      ? `${channel.substring(0, 20)}... (length: ${channel.length})`
      : "MISSING",
    token: token
      ? `${token.substring(0, 20)}... (length: ${token.length})`
      : "MISSING",
    appId: appId ? `${appId.substring(0, 10)}...` : "MISSING",
    otherName: otherName || "MISSING",
    role: role || "customer",
  });

  // Check token format
  if (token) {
    console.log("📹 [VideoCallPage] Token format check:", {
      startsWith006: token.startsWith("006"),
      length: token.length,
      firstChars: token.substring(0, 10),
    });
  }

  // If missing parameters, show error with debug info
  if (!bookingId || !channel || !token) {
    const missing = [];
    if (!bookingId) missing.push("bookingId");
    if (!channel) missing.push("channel");
    if (!token) missing.push("token");

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
          Missing: {missing.join(", ")}
        </p>
        <div
          style={{
            marginTop: "20px",
            background: "#1e293b",
            padding: "16px",
            borderRadius: "8px",
            textAlign: "left",
            maxWidth: "500px",
            width: "100%",
            overflow: "auto",
          }}
        >
          <p
            style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px" }}
          >
            <strong>Debug Info:</strong>
          </p>
          <pre style={{ color: "#94a3b8", fontSize: "11px", margin: 0 }}>
            bookingId: {bookingId || "❌ MISSING"}
            channel: {channel || "❌ MISSING"}
            token:{" "}
            {token ? `✅ HAS TOKEN (${token.length} chars)` : "❌ MISSING"}
            appId: {appId || "❌ MISSING"}
            otherName: {otherName || "❌ MISSING"}
            role: {role || "❌ MISSING"}
          </pre>
        </div>
        <button
          onClick={() => {
            // Go back to the appropriate app based on role
            const scheme = role === "maid" ? "deusizimaid" : "deusizicustomer";
            window.location.href = `${scheme}://`;
          }}
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
    console.log("📹 [VideoCallPage] Call ended, redirecting back to app");
    setShowCall(false);

    // Determine which app to redirect back to based on role
    const scheme = role === "maid" ? "deusizimaid" : "deusizicustomer";
    const deepLink = `${scheme}://booking/${bookingId}`;

    console.log("📹 [VideoCallPage] Redirecting to:", deepLink);

    // Redirect back to the app
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage("end_call");
    } else {
      window.location.href = deepLink;
    }
  };

  if (!showCall) {
    return null;
  }

  console.log("📹 [VideoCallPage] Rendering VideoCall component with props:", {
    bookingId,
    channel: channel.substring(0, 20) + "...",
    token: token ? "HAS_TOKEN" : "NO_TOKEN",
    appId: appId ? appId.substring(0, 10) + "..." : "undefined",
    otherName,
    role,
  });

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <VideoCall
        bookingId={bookingId}
        channel={channel}
        token={token}
        appId={appId}
        otherName={otherName}
        onClose={handleClose}
        role={role} // ← Pass the role prop
      />
    </div>
  );
}
