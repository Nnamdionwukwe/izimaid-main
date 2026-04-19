import { useState, useEffect, useRef, useCallback } from "react";
import SupportChat from "./SupportChat";
import styles from "./FloatingSupportChat.module.css";

const VIEWPORT_MARGIN = 10; // min px from any edge

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function useDraggable(initialPos) {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);
  const dragData = useRef({ startX: 0, startY: 0, origX: 0, origY: 0 });

  const onPointerDown = useCallback(
    (e) => {
      // only primary button / touch
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();

      const el = ref.current;
      if (!el) return;

      dragData.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
      };
      setDragging(true);
      el.setPointerCapture(e.pointerId);
    },
    [pos],
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      const { startX, startY, origX, origY } = dragData.current;
      const el = ref.current;
      if (!el) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = el.offsetWidth;
      const h = el.offsetHeight;

      setPos({
        x: clamp(origX + dx, VIEWPORT_MARGIN, vw - w - VIEWPORT_MARGIN),
        y: clamp(origY + dy, VIEWPORT_MARGIN, vh - h - VIEWPORT_MARGIN),
      });
    },
    [dragging],
  );

  const onPointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  return {
    pos,
    setPos,
    dragging,
    ref,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}

export default function FloatingSupportChat() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [visible, setVisible] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ── FAB drag ──────────────────────────────────────────────────────
  const fab = useDraggable({
    x: window.innerWidth - 180 - 24,
    y: window.innerHeight - 52 - 24,
  });

  // ── Chat window drag ───────────────────────────────────────────────
  const chat = useDraggable({
    x: window.innerWidth - 370 - 20,
    y: window.innerHeight - 560 - 90,
  });

  // Track whether this was a drag or a click on the FAB
  const fabDragMoved = useRef(false);
  const fabDragStart = useRef({ x: 0, y: 0 });

  // Detect auth state
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (token && user.role === "customer") setVisible(true);
  }, []);

  // Poll unread when chat is closed
  useEffect(() => {
    if (!visible || open) return;
    async function fetchUnread() {
      try {
        const res = await fetch(`${API_URL}/api/support-chat/unread`, {
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

  function handleFabPointerDown(e) {
    fabDragMoved.current = false;
    fabDragStart.current = { x: e.clientX, y: e.clientY };
    fab.onPointerDown(e);
  }

  function handleFabPointerMove(e) {
    const dx = Math.abs(e.clientX - fabDragStart.current.x);
    const dy = Math.abs(e.clientY - fabDragStart.current.y);
    if (dx > 4 || dy > 4) fabDragMoved.current = true;
    fab.onPointerMove(e);
  }

  function handleFabClick() {
    // suppress click if this was actually a drag
    if (fabDragMoved.current) return;
    chat.setPos({
      x: clamp(
        fab.pos.x - 370 + 52,
        VIEWPORT_MARGIN,
        window.innerWidth - 370 - VIEWPORT_MARGIN,
      ),
      y: clamp(
        fab.pos.y - 560 - 10,
        VIEWPORT_MARGIN,
        window.innerHeight - 560 - VIEWPORT_MARGIN,
      ),
    });
    setOpen(true);
    setUnread(0);
  }

  if (!visible) return null;

  return (
    <>
      {/* ── Draggable chat window ── */}
      {open && (
        <div
          ref={chat.ref}
          className={`${styles.chatWindow} ${chat.dragging ? styles.chatWindowDragging : ""}`}
          style={{
            left: chat.pos.x,
            top: chat.pos.y,
            bottom: "auto",
            right: "auto",
          }}
          onPointerMove={chat.onPointerMove}
          onPointerUp={chat.onPointerUp}
        >
          {/* drag handle */}
          <div
            className={styles.chatDragHandle}
            onPointerDown={chat.onPointerDown}
          >
            <div className={styles.chatDragPill} />
          </div>

          <SupportChat onClose={() => setOpen(false)} />
        </div>
      )}

      {/* ── Draggable FAB ── */}
      {!open && (
        <button
          ref={fab.ref}
          className={`${styles.fab} ${fab.dragging ? styles.fabDragging : ""}`}
          style={{
            left: fab.pos.x,
            top: fab.pos.y,
            bottom: "auto",
            right: "auto",
          }}
          onPointerDown={handleFabPointerDown}
          onPointerMove={handleFabPointerMove}
          onPointerUp={(e) => {
            fab.onPointerUp(e);
          }}
          onClick={handleFabClick}
          aria-label="Open support chat"
        >
          <span className={styles.fabIcon}>💬</span>
          {unread > 0 && (
            <span className={styles.badge}>{unread > 99 ? "99+" : unread}</span>
          )}
          <span className={styles.pulse} />
        </button>
      )}
    </>
  );
}
