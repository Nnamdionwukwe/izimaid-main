// src/pages/settings/components/SettingsUI.jsx
// All shared primitives — fully CSS module based
import styles from "../../pages/settings/settings.module.css";

export function Section({ title, description, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {description && <p className={styles.sectionDesc}>{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function Field({ label, hint, error, children }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.fieldLabel}>{label}</label>}
      {children}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export function Input({ className = "", error, success, ...props }) {
  const cls = [
    styles.input,
    error ? styles.inputError : "",
    success ? styles.inputSuccess : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <input className={cls} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${styles.input} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`${styles.toggle} ${checked ? styles.toggleOn : styles.toggleOff}`}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

export function SaveButton({ loading, children = "Save changes", disabled }) {
  return (
    <button
      type="submit"
      className={styles.btnPrimary}
      disabled={loading || disabled}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  );
}

export function DangerButton({ loading, onClick, children, type = "button" }) {
  return (
    <button
      type={type}
      className={styles.btnDanger}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  );
}

export function SecondaryButton({
  loading,
  onClick,
  children,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={styles.btnSecondary}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  );
}

export function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  const cls = type === "success" ? styles.toastSuccess : styles.toastError;
  return (
    <div className={`${styles.toast} ${cls}`}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.toastClose}>
        ×
      </button>
    </div>
  );
}

export function Avatar({ src, name, size = 80 }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  return (
    <div
      className={styles.avatarCircle}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {src ? <img src={src} alt={name} /> : <span>{initials}</span>}
    </div>
  );
}

export function Skeleton({ width = "100%", height = 16 }) {
  return <div className={styles.skeleton} style={{ width, height }} />;
}

export function Badge({ children, color = "navy" }) {
  const colorMap = {
    navy: styles.badgeNavy,
    green: styles.badgeGreen,
    red: styles.badgeRed,
    gray: styles.badgeGray,
    blue: styles.badgeNavy,
    purple: styles.badgeNavy,
    gold: styles.badgeNavy,
  };
  return (
    <span className={`${styles.badge} ${colorMap[color] || styles.badgeNavy}`}>
      {children}
    </span>
  );
}
