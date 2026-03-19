import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./MaidChat.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const CHAT_URL = `${API_URL}/api/chat`;
const POLL_MS = 8000; // poll every 8s for near-real-time feel
const MAX_FILES = 5;
const ACCEPTED = "image/*,video/*";

function authH() {
  return { Authorization: `Bearer ${localStorage.getItem("token")}` };
}

function fmtTime(d) {
  return new Date(d).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(d) {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function groupByDate(messages) {
  const groups = [];
  let lastDate = null;
  for (const msg of messages) {
    const d = fmtDate(msg.created_at);
    if (d !== lastDate) {
      groups.push({ type: "divider", label: d, id: `divider-${msg.id}` });
      lastDate = d;
    }
    groups.push(msg);
  }
  return groups;
}

// ─── Lightbox ────────────────────────────────────────────────────────
function Lightbox({ item, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className={styles.lightbox} onClick={onClose}>
      <button className={styles.lightboxClose} onClick={onClose}>
        ✕
      </button>
      <div
        className={styles.lightboxInner}
        onClick={(e) => e.stopPropagation()}
      >
        {item.media_type === "video" ? (
          <video
            src={item.media_url}
            controls
            autoPlay
            className={styles.lightboxMedia}
          />
        ) : (
          <img src={item.media_url} alt="" className={styles.lightboxMedia} />
        )}
      </div>
    </div>
  );
}

// ─── Message bubble ──────────────────────────────────────────────────
// Delete works as follows:
//   Mobile  — long-press (500ms hold) on your own message → popup appears
//   Desktop — right-click on your own message → popup appears
// The popup has "🗑 Delete" and "Cancel".
// Deletion is only allowed within 5 minutes of sending (enforced by backend too).
function Bubble({ msg, isMine, onDelete, onMedia }) {
  const [showDel, setShowDel] = useState(false);
  const pressTimer = useRef(null);
  const ageMin = (Date.now() - new Date(msg.created_at)) / 60000;
  const canDelete = isMine && ageMin <= 5;

  // ── Long-press (mobile touch) ───────────────────────────────────────
  function onTouchStart(e) {
    if (!canDelete) return;
    pressTimer.current = setTimeout(() => {
      setShowDel(true);
    }, 500); // 500ms hold
  }
  function onTouchEnd() {
    clearTimeout(pressTimer.current);
  }
  function onTouchMove() {
    // Cancel if finger moves (scrolling)
    clearTimeout(pressTimer.current);
  }

  // ── Right-click (desktop) ────────────────────────────────────────────
  function onContextMenu(e) {
    if (!canDelete) return;
    e.preventDefault();
    setShowDel(true);
  }

  // ── Close popup on outside click ────────────────────────────────────
  useEffect(() => {
    if (!showDel) return;
    function handler() {
      setShowDel(false);
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showDel]);

  return (
    <div
      className={`${styles.bubbleRow} ${isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs}`}
    >
      {!isMine && (
        <div className={styles.avatar}>
          {msg.sender_avatar ? (
            <img src={msg.sender_avatar} alt="" className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarInitial}>
              {msg.sender_name?.[0]?.toUpperCase() || "?"}
            </span>
          )}
        </div>
      )}

      <div
        className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleTheirs}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onContextMenu={onContextMenu}
      >
        {!isMine && (
          <span className={styles.senderName}>{msg.sender_name}</span>
        )}

        {/* Media */}
        {(msg.message_type === "image" || msg.message_type === "video") &&
          msg.media_url && (
            <button className={styles.mediaThumb} onClick={() => onMedia(msg)}>
              {msg.message_type === "video" ? (
                <div className={styles.videoThumb}>
                  <span className={styles.playIcon}>▶</span>
                </div>
              ) : (
                <img src={msg.media_url} alt="" className={styles.thumbImg} />
              )}
            </button>
          )}

        {/* Text */}
        {msg.message_type === "text" && (
          <p className={styles.bubbleText}>{msg.content}</p>
        )}
        {/* Caption under media */}
        {msg.message_type !== "text" &&
          msg.content &&
          msg.content !== msg.media_url && (
            <p className={styles.bubbleCaption}>{msg.content}</p>
          )}

        <div className={styles.bubbleMeta}>
          <span className={styles.bubbleTime}>{fmtTime(msg.created_at)}</span>
          {isMine && (
            <span
              className={styles.bubbleRead}
              title={msg.is_read ? "Seen" : "Sent"}
            >
              {msg.is_read ? "✓✓" : "✓"}
            </span>
          )}
        </div>

        {/* Delete popup */}
        {showDel && canDelete && (
          <div
            className={styles.deletePopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.deleteBtn}
              onClick={() => {
                onDelete(msg.id);
                setShowDel(false);
              }}
            >
              🗑 Delete
            </button>
            <button
              className={styles.deleteCancelBtn}
              onClick={() => setShowDel(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Media preview strip ─────────────────────────────────────────────
function MediaStrip({ files, onRemove }) {
  if (!files.length) return null;
  return (
    <div className={styles.mediaStrip}>
      {files.map((f, i) => (
        <div key={i} className={styles.mediaStripItem}>
          {f.file.type.startsWith("video/") ? (
            <div className={styles.stripVideo}>
              <span>🎥</span>
            </div>
          ) : (
            <img src={f.preview} alt="" className={styles.stripImg} />
          )}
          <button className={styles.stripRemove} onClick={() => onRemove(i)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Main Chat component ─────────────────────────────────────────────
// Props:
//   bookingId   — required, used to open/create the conversation
//   otherName   — display name of the other party
//   otherAvatar — avatar url (optional)
//   onClose     — called when user taps ← back
export default function MaidChat({
  bookingId,
  otherName,
  otherAvatar,
  onClose,
}) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProg, setUploadProg] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [error, setError] = useState("");
  const threadRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const lastMsgId = useRef(null);
  const me = JSON.parse(localStorage.getItem("user") || "{}");

  // ── Load conversation ──
  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`${CHAT_URL}/booking/${bookingId}`, {
          headers: authH(),
        });
        if (!res.ok) throw new Error("Failed to load chat");
        const data = await res.json();
        setConversation(data.conversation);
        setMessages(data.messages || []);
        // Mark read
        if (data.conversation?.id) {
          fetch(`${CHAT_URL}/${data.conversation.id}/read`, {
            method: "PATCH",
            headers: authH(),
          }).catch(() => {});
        }
      } catch (e) {
        setError(e.message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [bookingId],
  );

  useEffect(() => {
    load(false);
  }, [load]);

  // ── Poll for new messages ──
  useEffect(() => {
    const id = setInterval(() => load(true), POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  // ── Scroll to bottom on new message ──
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && last.id !== lastMsgId.current) {
      lastMsgId.current = last.id;
      requestAnimationFrame(() => {
        threadRef.current?.scrollTo({
          top: threadRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messages]);

  // ── Send text ──
  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed && !files.length) return;
    if (!conversation?.id) return;

    // Send media files first
    if (files.length) {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        setUploadProg(`Sending file ${i + 1} of ${files.length}…`);
        const form = new FormData();
        form.append("media", files[i].file);
        try {
          const res = await fetch(
            `${CHAT_URL}/${conversation.id}/messages/media`,
            {
              method: "POST",
              headers: authH(),
              body: form,
            },
          );
          const d = await res.json();
          if (res.ok) setMessages((prev) => [...prev, d.message]);
        } catch {}
      }
      setFiles([]);
      setUploadProg("");
      setUploading(false);
    }

    // Send text if any
    if (trimmed) {
      setSending(true);
      try {
        const res = await fetch(`${CHAT_URL}/${conversation.id}/messages`, {
          method: "POST",
          headers: { ...authH(), "Content-Type": "application/json" },
          body: JSON.stringify({ content: trimmed }),
        });
        const d = await res.json();
        if (res.ok) {
          setMessages((prev) => [...prev, d.message]);
          setText("");
        } else setError(d.error || "Failed to send");
      } catch {
        setError("Network error");
      } finally {
        setSending(false);
      }
    }
  }

  // ── Delete message ──
  async function handleDelete(msgId) {
    try {
      await fetch(`${CHAT_URL}/messages/${msgId}`, {
        method: "DELETE",
        headers: authH(),
      });
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {}
  }

  // ── File picker ──
  function handleFileChange(e) {
    const picked = Array.from(e.target.files || []);
    const toAdd = picked.slice(0, MAX_FILES - files.length).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  }

  function removeFile(i) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  // ── Enter to send (Shift+Enter for newline) ──
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const grouped = groupByDate(messages);
  const isBusy = sending || uploading;

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onClose}>
          ←
        </button>
        <div className={styles.headerAvatar}>
          {otherAvatar ? (
            <img src={otherAvatar} alt="" className={styles.headerAvatarImg} />
          ) : (
            <span className={styles.headerAvatarInitial}>
              {otherName?.[0]?.toUpperCase() || "?"}
            </span>
          )}
          <span className={styles.onlineDot} />
        </div>
        <div className={styles.headerInfo}>
          <p className={styles.headerName}>{otherName || "Chat"}</p>
          <p className={styles.headerSub}>Booking chat</p>
        </div>
      </div>

      {/* ── Thread ── */}
      {loading ? (
        <div className={styles.loadingState}>
          <span className={styles.spinnerDark} />
          <span>Opening chat…</span>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>⚠️ {error}</p>
          <button className={styles.retryBtn} onClick={() => load(false)}>
            Retry
          </button>
        </div>
      ) : (
        <div className={styles.thread} ref={threadRef}>
          {grouped.length === 0 && (
            <div className={styles.emptyThread}>
              <p className={styles.emptyEmoji}>💬</p>
              <p className={styles.emptyTitle}>Start the conversation</p>
              <p className={styles.emptySub}>Send a message to {otherName}</p>
            </div>
          )}

          {grouped.map((item) => {
            if (item.type === "divider") {
              return (
                <div key={item.id} className={styles.dateDivider}>
                  <span>{item.label}</span>
                </div>
              );
            }
            const isMine = item.sender_id === me.id;
            return (
              <Bubble
                key={item.id}
                msg={item}
                isMine={isMine}
                onDelete={handleDelete}
                onMedia={setLightbox}
              />
            );
          })}
        </div>
      )}

      {/* ── Input area ── */}
      {!loading && !error && (
        <div className={styles.inputArea}>
          <MediaStrip files={files} onRemove={removeFile} />

          {uploading && (
            <div className={styles.uploadProgress}>
              <span className={styles.spinnerDark} /> {uploadProg}
            </div>
          )}

          <div className={styles.inputRow}>
            {/* Attach */}
            <label className={styles.attachLabel} title="Attach photo/video">
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED}
                multiple
                className={styles.hiddenInput}
                onChange={handleFileChange}
                disabled={files.length >= MAX_FILES}
              />
              <span className={styles.attachIcon}>📎</span>
            </label>

            {/* Text input */}
            <textarea
              ref={inputRef}
              className={styles.textInput}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${otherName || ""}…`}
              rows={1}
              disabled={isBusy}
            />

            {/* Send */}
            <button
              className={`${styles.sendBtn} ${text.trim() || files.length ? styles.sendBtnActive : ""}`}
              onClick={handleSend}
              disabled={isBusy || (!text.trim() && !files.length)}
            >
              {isBusy ? (
                <span className={styles.spinner} />
              ) : (
                <span className={styles.sendIcon}>➤</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
