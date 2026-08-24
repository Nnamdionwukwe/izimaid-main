// src/component/VideoCall/VideoCall.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaUserCircle,
} from "react-icons/fa";
import styles from "./VideoCall.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Enable debug logs for Agora
AgoraRTC.setLogLevel(0);

export default function VideoCall({
  bookingId,
  channel,
  token,
  appId,
  otherName,
  onClose,
}) {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Initializing...");
  const [isJoining, setIsJoining] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const tokenStorage = localStorage.getItem("token");
  const joinedRef = useRef(false);
  const remoteTrackRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // ── LOG ALL PROPS ────────────────────────────────────────────────
  console.log("📹 [VideoCall] Component mounted");
  console.log("📹 [VideoCall] Props received:", {
    bookingId: bookingId || "undefined",
    channel: channel ? `"${channel}" (length: ${channel.length})` : "undefined",
    token: token ? `HAS_TOKEN (length: ${token.length})` : "undefined",
    tokenPreview: token ? token.substring(0, 30) + "..." : "undefined",
    appId: appId ? `"${appId}"` : "undefined",
    otherName: otherName || "undefined",
  });

  // ── Validate and fallback for appId ───────────────────────────────
  const finalAppId =
    appId ||
    import.meta.env.VITE_AGORA_APP_ID ||
    "76bf723b062d4aa39f6395c53fff650e";

  // ── Validate channel – must be a non-empty string with allowed chars ──
  const validateChannel = (ch) => {
    if (!ch || typeof ch !== "string") return false;
    const allowed = /^[a-zA-Z0-9_-]{1,64}$/;
    return allowed.test(ch);
  };

  const finalChannel = channel && validateChannel(channel) ? channel : null;

  // ── Validate token ────────────────────────────────────────────────
  const isValidToken =
    token &&
    typeof token === "string" &&
    token !== "undefined" &&
    token !== "null" &&
    token.length > 10;

  console.log("📹 [VideoCall] Validation results:", {
    finalAppId: finalAppId ? "HAS_APP_ID" : "MISSING",
    finalChannel: finalChannel ? `"${finalChannel}"` : "INVALID or MISSING",
    isValidToken: isValidToken,
    tokenLength: token ? token.length : 0,
  });

  useEffect(() => {
    if (!isValidToken) {
      console.error("❌ [VideoCall] Invalid token:", {
        token: token ? `"${token.substring(0, 20)}..."` : "undefined",
        tokenLength: token ? token.length : 0,
      });
      setError("Video call token is missing or invalid. Please try again.");
      setStatus("Error: Invalid token");
      return;
    }
    if (!finalChannel) {
      console.error("❌ [VideoCall] Invalid channel:", { channel });
      setError("Video call channel is invalid. Please try again.");
      setStatus("Error: Invalid channel");
      return;
    }
    if (!finalAppId) {
      console.error("❌ [VideoCall] Missing App ID");
      setError("Video call app ID is missing. Please contact support.");
      setStatus("Error: Missing appId");
      return;
    }
    console.log("✅ [VideoCall] All validations passed");
  }, [isValidToken, finalChannel, finalAppId]);

  useEffect(() => {
    let isMounted = true;

    async function startCall() {
      console.log("📹 [VideoCall] startCall() invoked");

      // Validate again
      if (!isValidToken) {
        console.error("❌ [VideoCall] startCall: Invalid token");
        setError("Video call token is missing. Please try again.");
        setStatus("Error: Missing token");
        return;
      }
      if (!finalChannel) {
        console.error("❌ [VideoCall] startCall: Invalid channel");
        setError("Video call channel is invalid. Please try again.");
        setStatus("Error: Invalid channel");
        return;
      }
      if (!finalAppId) {
        console.error("❌ [VideoCall] startCall: Missing App ID");
        setError("Video call app ID is missing. Please contact support.");
        setStatus("Error: Missing appId");
        return;
      }

      if (joinedRef.current) {
        console.log("📹 [VideoCall] Already joined, skipping");
        return;
      }
      joinedRef.current = true;

      setIsJoining(true);
      setStatus("Creating client...");

      try {
        // Use H.264 for better compatibility
        console.log("📹 [VideoCall] Creating Agora client...");
        const rtcClient = AgoraRTC.createClient({
          mode: "rtc",
          codec: "h264",
        });
        setClient(rtcClient);
        console.log("✅ [VideoCall] Client created");

        setStatus("Joining channel...");
        console.log(`📹 [VideoCall] Joining with:`, {
          appId: finalAppId ? finalAppId.substring(0, 10) + "..." : "MISSING",
          channel: finalChannel,
          tokenLength: token.length,
          tokenPreview: token.substring(0, 30) + "...",
        });

        try {
          await rtcClient.join(finalAppId, finalChannel, token, null);
          console.log(`✅ [VideoCall] Joined channel: ${finalChannel}`);
        } catch (joinError) {
          console.error("❌ [VideoCall] Join failed:", {
            message: joinError.message,
            code: joinError.code,
            name: joinError.name,
            stack: joinError.stack,
          });
          // Check for specific error codes
          if (
            joinError.message?.includes("token") ||
            joinError.code === "ERR_TOKEN_EXPIRED"
          ) {
            setError("Token expired. Please start a new call.");
          } else if (joinError.code === "ERR_INVALID_TOKEN") {
            setError("Invalid token. Please try again.");
          } else if (joinError.code === "ERR_DYNAMIC_APP_SIGNATURE_INVALID") {
            setError("Invalid App ID. Please check Agora configuration.");
          } else {
            setError(`Join failed: ${joinError.message}`);
          }
          throw joinError;
        }

        setStatus("Joined channel, creating tracks...");
        console.log("📹 [VideoCall] Creating audio and video tracks...");

        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: "720p",
        });

        if (!isMounted) {
          console.log(
            "📹 [VideoCall] Component unmounted during track creation, cleaning up",
          );
          audioTrack.close();
          videoTrack.close();
          return;
        }

        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);

        // Play local video
        videoTrack.play(localVideoRef.current);
        console.log("📹 [VideoCall] Local video playing");

        setStatus("Publishing tracks...");
        await rtcClient.publish([audioTrack, videoTrack]);
        console.log("✅ [VideoCall] Published local tracks");
        setStatus("Connected, waiting for remote user...");
        setIsJoining(false);

        // ── Remote user events ──────────────────────────────────
        rtcClient.on("user-published", async (user, mediaType) => {
          console.log(
            `📢 [VideoCall] Remote user ${user.uid} published ${mediaType}`,
          );
          try {
            await rtcClient.subscribe(user, mediaType);
            if (mediaType === "video") {
              const remoteVideoTrack = user.videoTrack;
              remoteTrackRef.current = remoteVideoTrack;
              const playRemote = () => {
                if (remoteVideoRef.current) {
                  remoteVideoTrack.play(remoteVideoRef.current);
                  setRemoteUser(user);
                  setStatus(`Remote user joined`);
                  console.log("✅ [VideoCall] Remote video playing");
                } else {
                  setTimeout(playRemote, 200);
                }
              };
              playRemote();
            }
            if (mediaType === "audio") {
              user.audioTrack?.play();
              console.log("🔊 [VideoCall] Remote audio playing");
            }
          } catch (subErr) {
            console.error(
              "❌ [VideoCall] Failed to subscribe to remote:",
              subErr,
            );
            setError("Failed to connect to remote user.");
          }
        });

        rtcClient.on("user-unpublished", (user, mediaType) => {
          console.log(
            `👋 [VideoCall] Remote user ${user.uid} unpublished ${mediaType}`,
          );
          if (mediaType === "video") {
            setRemoteUser(null);
            remoteTrackRef.current = null;
          }
        });

        rtcClient.on("user-left", (user) => {
          console.log(`🚪 [VideoCall] Remote user ${user.uid} left`);
          setRemoteUser(null);
          remoteTrackRef.current = null;
          setStatus("Remote user left");
        });

        rtcClient.on("connection-state-change", (cur, prev, reason) => {
          console.log(
            `🔄 [VideoCall] Connection state: ${prev} → ${cur} (${reason})`,
          );
          setStatus(`Connection: ${cur}`);
        });

        rtcClient.on("exception", (e) => {
          console.error("⚠️ [VideoCall] Agora exception:", e);
          setError(e.message || "Agora exception occurred.");
        });

        // ── Retry if no remote user after 15 seconds ────────────
        retryTimeoutRef.current = setTimeout(() => {
          if (!remoteUser && isMounted) {
            console.warn(
              "⏳ [VideoCall] No remote user joined yet – re-publishing tracks...",
            );
            rtcClient
              .unpublish()
              .then(() => rtcClient.publish([audioTrack, videoTrack]))
              .catch((e) => console.error("Re-publish failed:", e));
          }
        }, 15000);
      } catch (err) {
        console.error("❌ [VideoCall] Video call error:", err);
        joinedRef.current = false;
        setError(
          err.message || "Could not start video call. Please try again.",
        );
        setStatus("Error: " + err.message);
        setIsJoining(false);
        if (client) {
          try {
            client.leave();
          } catch {}
        }
      }
    }

    startCall();

    return () => {
      isMounted = false;
      console.log("🧹 [VideoCall] Cleaning up...");
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
      if (client) client.leave();
      console.log("🧹 [VideoCall] Cleaned up");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Controls ──────────────────────────────────────────────────
  const toggleMute = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    console.log("📹 [VideoCall] Ending call...");
    try {
      await fetch(`${API_URL}/api/bookings/${bookingId}/video-call`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenStorage}` },
      });
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
      if (client) await client.leave();

      // Call onClose if provided
      onClose?.();

      // If in WebView, send message back to app
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage("end_call");
      } else {
        // Otherwise redirect back to app using deep link
        window.location.href = `deusizicustomer://booking/${bookingId}`;
      }
    } catch (err) {
      console.error("❌ [VideoCall] End call error:", err);
      setError("Failed to end call properly.");
    }
  };

  if (error) {
    return (
      <div className={styles.overlay}>
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <FaUserCircle size={48} color="#dc3545" />
            <p className={styles.errorTitle}>Connection Error</p>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.endCallBtn} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Remote video container */}
        <div className={styles.remoteVideoContainer}>
          <div
            ref={remoteVideoRef}
            className={styles.remoteVideo}
            style={{ display: remoteUser ? "block" : "none" }}
          />
          {!remoteUser && (
            <div className={styles.waitingOverlay}>
              <FaUserCircle size={64} />
              <p>Waiting for {otherName || "the other party"} to join…</p>
              <p className={styles.statusText}>{status}</p>
              {isJoining && <p className={styles.statusText}>Joining…</p>}
            </div>
          )}
        </div>

        {/* Local video (picture-in-picture) */}
        <div className={styles.localVideoContainer}>
          <div ref={localVideoRef} className={styles.localVideo} />
          <div className={styles.localLabel}>You</div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            className={`${styles.controlBtn} ${isMuted ? styles.active : ""}`}
            onClick={toggleMute}
          >
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button
            className={`${styles.controlBtn} ${isVideoOff ? styles.active : ""}`}
            onClick={toggleVideo}
          >
            {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
          </button>
          <button className={styles.endCallBtn} onClick={endCall}>
            <FaPhoneSlash />
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
