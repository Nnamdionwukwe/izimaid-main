import { useState, useEffect, useRef, useCallback } from "react";
import MaidSupportChat from "./MaidSupportChat";
import styles from "./FloatingMaidSupportChat.module.css";

export default function FloatingMaidSupportChat() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [visible, setVisible] = useState(false);

  // Drag state
  const [pos, setPos] = useState({ x: 24, y: 24 }); // distance from bottom-right
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null); // { mouseX, mouseY, posX, posY }
  const hasDragged = useRef(false);
  const fabRef = useRef(null);
  const chatRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // Check maid auth
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (token && user.role === "maid") setVisible(true);
  }, []);

  // Poll unread when chat closed
  useEffect(() => {
    if (!visible || open) return;
    async function fetchUnread() {
      try {
        const res = await fetch(`${API_URL}/api/maid-support-chat/unread`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUnread(data.unread || 0);
        }
      } catch {}
    }
    fetchUnread();
    const id = setInterval(fetchUnread, 15000);
    return () => clearInterval(id);
  }, [visible, open, API_URL]);

  // ── Click outside to close ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      // If click is outside both the chat window and the FAB → close
      if (
        chatRef.current &&
        !chatRef.current.contains(e.target) &&
        fabRef.current &&
        !fabRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    // Use mousedown so it fires before any child onClick
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // ── Drag logic ─────────────────────────────────────────────────────────────
  const onMouseDown = useCallback(
    (e) => {
      // Only drag on the button itself, not child elements like the badge
      if (e.button !== 0) return;
      e.preventDefault();
      hasDragged.current = false;
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        posX: pos.x,
        posY: pos.y,
      };
      setDragging(true);
    },
    [pos],
  );

  useEffect(() => {
    if (!dragging) return;

    function onMouseMove(e) {
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;

      // Only mark as drag if moved more than 4px (avoids eating click events)
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;

      // FAB uses bottom-right positioning — dx subtracts, dy subtracts
      const newX = Math.max(8, dragStart.current.posX - dx);
      const newY = Math.max(8, dragStart.current.posY - dy);

      // Clamp to viewport
      const fabW = fabRef.current?.offsetWidth || 160;
      const fabH = fabRef.current?.offsetHeight || 52;
      const maxX = window.innerWidth - fabW - 8;
      const maxY = window.innerHeight - fabH - 8;

      setPos({
        x: Math.min(newX, maxX),
        y: Math.min(newY, maxY),
      });
    }

    function onMouseUp() {
      setDragging(false);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  // Touch support
  const onTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      hasDragged.current = false;
      dragStart.current = {
        mouseX: touch.clientX,
        mouseY: touch.clientY,
        posX: pos.x,
        posY: pos.y,
      };
    },
    [pos],
  );

  const onTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.current.mouseX;
    const dy = touch.clientY - dragStart.current.mouseY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;

    const newX = Math.max(8, dragStart.current.posX - dx);
    const newY = Math.max(8, dragStart.current.posY - dy);
    const fabW = fabRef.current?.offsetWidth || 160;
    const fabH = fabRef.current?.offsetHeight || 52;
    const maxX = window.innerWidth - fabW - 8;
    const maxY = window.innerHeight - fabH - 8;

    setPos({ x: Math.min(newX, maxX), y: Math.min(newY, maxY) });
    e.preventDefault(); // prevent page scroll while dragging
  }, []);

  // ── Handle click vs drag ───────────────────────────────────────────────────
  function handleFabClick() {
    if (hasDragged.current) return; // was a drag, not a click
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
      setUnread(0);
    }
  }

  // ── Chat window position (anchors near FAB) ────────────────────────────────
  // Position the chat window just above the FAB
  const fabH = 52;
  const chatW = 370;
  const chatH = 560;
  const chatRight = pos.x;
  const chatBottom = pos.y + fabH + 10;

  // Clamp chat window so it doesn't go off-screen top/left
  const clampedChatRight = Math.min(chatRight, window.innerWidth - chatW - 8);
  const clampedChatBottom = Math.min(
    chatBottom,
    window.innerHeight - chatH - 8,
  );

  if (!visible) return null;

  return (
    <>
      {/* ── Chat window ── */}
      {open && (
        <div
          ref={chatRef}
          className={styles.chatWindow}
          style={{
            bottom: clampedChatBottom,
            right: clampedChatRight,
          }}
        >
          <MaidSupportChat onClose={() => setOpen(false)} />
        </div>
      )}

      {/* ── FAB ── */}
      <button
        ref={fabRef}
        className={`${styles.fab} ${dragging ? styles.fabDragging : ""}`}
        style={{
          bottom: pos.y,
          right: pos.x,
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onClick={handleFabClick}
        aria-label={open ? "Close support chat" : "Open support chat"}
      >
        <span className={styles.fabIcon}>{open ? "✕" : "💬"}</span>
        {/* <span className={styles.fabLabel}>{open ? "Close" : "Support"}</span> */}

        {!open && unread > 0 && (
          <span className={styles.badge}>{unread > 99 ? "99+" : unread}</span>
        )}
        {!open && <span className={styles.pulse} />}
      </button>
    </>
  );
}
