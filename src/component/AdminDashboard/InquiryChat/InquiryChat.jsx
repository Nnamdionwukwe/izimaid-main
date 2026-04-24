// src/component/InquiryChat/InquiryChat.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Chat from "../../Chat/Chat";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function InquiryChat() {
  const { maidId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const maidFromState = location.state?.maid;

  const [conversationId, setConversationId] = useState(null);
  const [maidInfo, setMaidInfo] = useState(maidFromState || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/chat/inquiry/${maidId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.conversation?.id) {
          setConversationId(d.conversation.id);
          if (!maidInfo?.name && d.conversation.maid_name) {
            setMaidInfo((prev) => ({
              ...prev,
              name: d.conversation.maid_name,
            }));
          }
        } else {
          setError(d.error || "Could not open chat");
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [maidId]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 12,
          color: "gray",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            border: "3px solid #eee",
            borderTopColor: "rgb(19,19,103)",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        />
        <p style={{ margin: 0, fontSize: 14 }}>Opening chat…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "gray" }}>
        <p>⚠️ {error}</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 16px",
            background: "rgb(19,19,103)",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Go back
        </button>
      </div>
    );

  // Pass conversationId directly — Chat handles the rest
  return (
    <Chat
      conversationId={conversationId}
      otherName={maidInfo?.name || "Maid"}
      otherAvatar={maidInfo?.avatar}
      onClose={() => navigate(-1)}
    />
  );
}
