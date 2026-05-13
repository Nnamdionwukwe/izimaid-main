import { useState, useEffect, useRef, useCallback } from "react";
import MaidSupportChat from "./MaidSupportChat";
import styles from "./FloatingMaidSupportChat.module.css";

const MARGIN = 10;
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function FloatingMaidSupportChat() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [visible, setVisible] = useState(false);

  const FAB_SIZE = 56;
  const CHAT_W = 370;
  const CHAT_H = 560;

  const [fabPos, setFabPos] = useState({
    x: window.innerWidth - FAB_SIZE - 24,
    y: window.innerHeight - FAB_SIZE - 24,
  });
  const [chatPos, setChatPos] = useState({
    x: window.innerWidth - CHAT_W - 20,
    y: window.innerHeight - CHAT_H - 90,
  });

  const fabRef = useRef(null);
  const chatRef = useRef(null);
  const dragging = useRef(false);
  const dragTarget = useRef(null); // "fab" | "chat"
  const dragStart = useRef({ px: 0, py: 0, ox: 0, oy: 0 });
  const didDrag = useRef(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ── Auth detection ─────────────────────────────────────────────────
  function checkAuth() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    setVisible(!!(token && user.role === "maid"));
  }
  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // ── Unread polling ─────────────────────────────────────────────────
  useEffect(() => {
    if (!visible || open) return;
    async function fetchUnread() {
      try {
        const res = await fetch(`${API_URL}/api/maid-support-chat/unread`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) setUnread((await res.json()).unread || 0);
      } catch {}
    }
    fetchUnread();
    const id = setInterval(fetchUnread, 15000);
    return () => clearInterval(id);
  }, [visible, open, API_URL]);

  // ── Click outside to close ─────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (
        chatRef.current &&
        !chatRef.current.contains(e.target) &&
        fabRef.current &&
        !fabRef.current.contains(e.target)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // ── Pointer drag (FAB) ─────────────────────────────────────────────
  function onFabPointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    didDrag.current = false;
    dragging.current = true;
    dragTarget.current = "fab";
    dragStart.current = {
      px: e.clientX,
      py: e.clientY,
      ox: fabPos.x,
      oy: fabPos.y,
    };
    fabRef.current?.setPointerCapture(e.pointerId);
  }

  function onFabPointerMove(e) {
    if (!dragging.current || dragTarget.current !== "fab") return;
    const dx = e.clientX - dragStart.current.px;
    const dy = e.clientY - dragStart.current.py;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag.current = true;
    setFabPos({
      x: clamp(
        dragStart.current.ox + dx,
        MARGIN,
        window.innerWidth - FAB_SIZE - MARGIN,
      ),
      y: clamp(
        dragStart.current.oy + dy,
        MARGIN,
        window.innerHeight - FAB_SIZE - MARGIN,
      ),
    });
  }

  function onFabPointerUp() {
    dragging.current = false;
  }

  function handleFabClick() {
    if (didDrag.current) return;
    if (open) {
      setOpen(false);
    } else {
      // Anchor chat above/beside FAB
      setChatPos({
        x: clamp(
          fabPos.x - CHAT_W + FAB_SIZE,
          MARGIN,
          window.innerWidth - CHAT_W - MARGIN,
        ),
        y: clamp(
          fabPos.y - CHAT_H - 10,
          MARGIN,
          window.innerHeight - CHAT_H - MARGIN,
        ),
      });
      setOpen(true);
      setUnread(0);
    }
  }

  // ── Pointer drag (chat window handle) ─────────────────────────────
  function onChatHandlePointerDown(e) {
    e.preventDefault();
    dragging.current = true;
    dragTarget.current = "chat";
    dragStart.current = {
      px: e.clientX,
      py: e.clientY,
      ox: chatPos.x,
      oy: chatPos.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onChatHandlePointerMove(e) {
    if (!dragging.current || dragTarget.current !== "chat") return;
    const dx = e.clientX - dragStart.current.px;
    const dy = e.clientY - dragStart.current.py;
    setChatPos({
      x: clamp(
        dragStart.current.ox + dx,
        MARGIN,
        window.innerWidth - CHAT_W - MARGIN,
      ),
      y: clamp(
        dragStart.current.oy + dy,
        MARGIN,
        window.innerHeight - CHAT_H - MARGIN,
      ),
    });
  }

  function onChatHandlePointerUp() {
    dragging.current = false;
  }

  if (!visible) return null;

  return (
    <>
      {open && (
        <div
          ref={chatRef}
          className={styles.chatWindow}
          style={{ left: chatPos.x, top: chatPos.y }}
        >
          <div
            className={styles.chatDragHandle}
            onPointerDown={onChatHandlePointerDown}
            onPointerMove={onChatHandlePointerMove}
            onPointerUp={onChatHandlePointerUp}
          >
            <div className={styles.chatDragPill} />
          </div>
          <MaidSupportChat onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        ref={fabRef}
        className={`${styles.fab} ${dragging.current ? styles.fabDragging : ""}`}
        style={{ left: fabPos.x, top: fabPos.y, bottom: "auto", right: "auto" }}
        onPointerDown={onFabPointerDown}
        onPointerMove={onFabPointerMove}
        onPointerUp={onFabPointerUp}
        onClick={handleFabClick}
        aria-label={open ? "Close support chat" : "Open support chat"}
      >
        <span className={styles.fabIcon}>
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </span>
        {!open && unread > 0 && (
          <span className={styles.badge}>{unread > 99 ? "99+" : unread}</span>
        )}
        {!open && <span className={styles.pulse} />}
      </button>
    </>
  );
}
