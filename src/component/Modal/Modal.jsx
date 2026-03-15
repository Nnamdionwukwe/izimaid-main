import styles from "./Modal.module.css";

export default function Modal({ message, onClose }) {
  if (!message) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrap}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(200, 50, 50)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className={styles.title}>Something went wrong</p>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeBtn} onClick={onClose}>
          OK, got it
        </button>
      </div>
    </div>
  );
}
