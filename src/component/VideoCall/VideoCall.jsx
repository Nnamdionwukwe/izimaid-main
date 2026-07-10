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

export default function VideoCall({
  bookingId,
  channel,
  token,
  appId,
  otherName,
  otherAvatar,
  onClose,
}) {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Initializing...");
  const [isJoining, setIsJoining] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const tokenStorage = localStorage.getItem("token");
  const joinedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function startCall() {
      // Prevent double join
      if (joinedRef.current) return;
      joinedRef.current = true;

      setIsJoining(true);
      setStatus("Creating client...");

      try {
        const rtcClient = AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });
        setClient(rtcClient);

        setStatus("Joining channel...");
        // Pass null as UID to let Agora auto‑assign a unique one
        await rtcClient.join(appId, channel, token, null);
        console.log(`✅ Joined channel: ${channel}`);
        setStatus("Joined channel, creating tracks...");

        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: "720p",
        });

        if (!mounted) {
          audioTrack.close();
          videoTrack.close();
          return;
        }

        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);

        // Play local video
        videoTrack.play(localVideoRef.current);

        setStatus("Publishing tracks...");
        await rtcClient.publish([audioTrack, videoTrack]);
        console.log("✅ Published local tracks");
        setIsConnected(true);
        setStatus("Connected, waiting for remote user...");
        setIsJoining(false);

        // ── Remote user events ──────────────────────────────────
        rtcClient.on("user-published", async (user, mediaType) => {
          console.log(`📢 Remote user ${user.uid} published ${mediaType}`);
          await rtcClient.subscribe(user, mediaType);
          if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            remoteVideoTrack.play(remoteVideoRef.current);
            setRemoteUsers((prev) => [...prev, user]);
            setStatus(`Remote user joined`);
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });

        rtcClient.on("user-unpublished", (user, mediaType) => {
          console.log(`👋 Remote user ${user.uid} unpublished ${mediaType}`);
          if (mediaType === "video") {
            setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          }
        });

        rtcClient.on("user-left", (user) => {
          console.log(`🚪 Remote user ${user.uid} left`);
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          setStatus("Remote user left");
        });

        rtcClient.on("connection-state-change", (cur, prev, reason) => {
          console.log(`🔄 Connection state: ${prev} → ${cur} (${reason})`);
          setStatus(`Connection: ${cur}`);
        });

        rtcClient.on("exception", (e) => {
          console.error("⚠️ Agora exception:", e);
          setError(e.message || "Agora exception occurred.");
        });
      } catch (err) {
        console.error("❌ Video call error:", err);
        joinedRef.current = false; // allow retry if needed
        setError(
          err.message || "Could not start video call. Please try again.",
        );
        setStatus("Error: " + err.message);
        setIsJoining(false);
        // Clean up client if created
        if (client) {
          try {
            client.leave();
          } catch {}
        }
      }
    }

    startCall();

    return () => {
      mounted = false;
      // Cleanup
      if (localAudioTrack) {
        localAudioTrack.close();
        console.log("🔊 Audio track closed");
      }
      if (localVideoTrack) {
        localVideoTrack.close();
        console.log("📹 Video track closed");
      }
      if (client) {
        client.leave();
        console.log("👋 Left channel");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only run once

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
    try {
      // Notify backend call ended
      await fetch(`${API_URL}/api/bookings/${bookingId}/video-call`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenStorage}` },
      });

      // Cleanup tracks
      if (localAudioTrack) localAudioTrack.close();
      if (localVideoTrack) localVideoTrack.close();
      if (client) await client.leave();

      onClose?.();
      navigate(-1);
    } catch (err) {
      console.error("End call error:", err);
      setError("Failed to end call properly.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Remote video */}
        <div className={styles.remoteVideoContainer}>
          {remoteUsers.length > 0 ? (
            <div ref={remoteVideoRef} className={styles.remoteVideo} />
          ) : (
            <div className={styles.waiting}>
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
