import { useState, useEffect, useRef } from "react";
import MaidSupportChat from "./MaidSupportChat";
import styles from "./FloatingMaidSupportChat.module.css";

const MARGIN = 10;
const FAB_SIZE = 56;
const CHAT_W = 370;
const CHAT_H = 560;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function FloatingMaidSupportChat() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [visible, setVisible] = useState(false);

  // Committed positions (used for initial placement + opening chat)
  const fabPosRef = useRef({
    x: window.innerWidth - FAB_SIZE - 24,
    y: window.innerHeight - FAB_SIZE - 24,
  });
  const chatPosRef = useRef({
    x: window.innerWidth - CHAT_W - 20,
    y: window.innerHeight - CHAT_H - 90,
  });

  const fabRef = useRef(null);
  const chatRef = useRef(null);
  const handleRef = useRef(null);

  // Drag bookkeeping — never touches React state
  const drag = useRef({
    active: false,
    target: null,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    moved: false,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ── Auth ────────────────────────────────────────────────────────────
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

  // ── Set initial DOM positions after mount ───────────────────────────
  useEffect(() => {
    if (fabRef.current) {
      fabRef.current.style.left = `${fabPosRef.current.x}px`;
      fabRef.current.style.top = `${fabPosRef.current.y}px`;
    }
  }, [visible]);

  useEffect(() => {
    if (open && chatRef.current) {
      chatRef.current.style.left = `${chatPosRef.current.x}px`;
      chatRef.current.style.top = `${chatPosRef.current.y}px`;
    }
  }, [open]);

  // ── Unread polling ──────────────────────────────────────────────────
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

  // ── Click outside ───────────────────────────────────────────────────
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

  // ── Global pointer move / up ────────────────────────────────────────
  useEffect(() => {
    function onMove(e) {
      const d = drag.current;
      if (!d.active) return;

      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) d.moved = true;

      if (d.target === "fab" && fabRef.current) {
        const x = clamp(
          d.origX + dx,
          MARGIN,
          window.innerWidth - FAB_SIZE - MARGIN,
        );
        const y = clamp(
          d.origY + dy,
          MARGIN,
          window.innerHeight - FAB_SIZE - MARGIN,
        );
        fabRef.current.style.left = `${x}px`;
        fabRef.current.style.top = `${y}px`;
        fabPosRef.current = { x, y };
      }

      if (d.target === "chat" && chatRef.current) {
        const x = clamp(
          d.origX + dx,
          MARGIN,
          window.innerWidth - CHAT_W - MARGIN,
        );
        const y = clamp(
          d.origY + dy,
          MARGIN,
          window.innerHeight - CHAT_H - MARGIN,
        );
        chatRef.current.style.left = `${x}px`;
        chatRef.current.style.top = `${y}px`;
        chatPosRef.current = { x, y };
      }
    }

    function onUp() {
      drag.current.active = false;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // ── FAB pointer down ────────────────────────────────────────────────
  function onFabPointerDown(e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    drag.current = {
      active: true,
      target: "fab",
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: fabPosRef.current.x,
      origY: fabPosRef.current.y,
    };
    fabRef.current?.setPointerCapture(e.pointerId);
  }

  function handleFabClick() {
    if (drag.current.moved) return;
    if (open) {
      setOpen(false);
    } else {
      chatPosRef.current = {
        x: clamp(
          fabPosRef.current.x - CHAT_W + FAB_SIZE,
          MARGIN,
          window.innerWidth - CHAT_W - MARGIN,
        ),
        y: clamp(
          fabPosRef.current.y - CHAT_H - 10,
          MARGIN,
          window.innerHeight - CHAT_H - MARGIN,
        ),
      };
      setOpen(true);
      setUnread(0);
    }
  }

  // ── Chat handle pointer down ────────────────────────────────────────
  function onHandlePointerDown(e) {
    e.preventDefault();
    drag.current = {
      active: true,
      target: "chat",
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: chatPosRef.current.x,
      origY: chatPosRef.current.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  if (!visible) return null;

  return (
    <>
      {open && (
        <div
          ref={chatRef}
          className={styles.chatWindow}
          style={{ left: 0, top: 0 }}
        >
          <div
            ref={handleRef}
            className={styles.chatDragHandle}
            onPointerDown={onHandlePointerDown}
          >
            <div className={styles.chatDragPill} />
          </div>
          <MaidSupportChat onClose={() => setOpen(false)} />
        </div>
      )}

      <button
        ref={fabRef}
        className={styles.fab}
        style={{ left: 0, top: 0 }}
        onPointerDown={onFabPointerDown}
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
