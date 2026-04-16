// src/pages/settings/components/SettingsUI.jsx
// Shared micro-components — import from here, don't duplicate

export function Section({ title, description, children }) {
  return (
    <div className="ds-section">
      <div className="ds-section-header">
        <h3 className="ds-section-title">{title}</h3>
        {description && <p className="ds-section-desc">{description}</p>}
      </div>
      <div className="ds-section-body">{children}</div>
    </div>
  );
}

export function Field({ label, hint, error, children }) {
  return (
    <div className="ds-field">
      {label && <label className="ds-label">{label}</label>}
      {children}
      {hint && !error && <p className="ds-hint">{hint}</p>}
      {error && <p className="ds-error">{error}</p>}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return <input className={`ds-input ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`ds-input ${className}`} {...props}>
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
      className={`ds-toggle ${checked ? "ds-toggle-on" : "ds-toggle-off"}`}
    >
      <span className="ds-toggle-thumb" />
    </button>
  );
}

export function SaveButton({ loading, saved, children = "Save changes" }) {
  return (
    <button type="submit" className="ds-btn-primary" disabled={loading}>
      {loading ? (
        <span className="ds-spinner" />
      ) : saved ? (
        <span>✓ Saved</span>
      ) : (
        children
      )}
    </button>
  );
}

export function DangerButton({ loading, onClick, children }) {
  return (
    <button
      type="button"
      className="ds-btn-danger"
      disabled={loading}
      onClick={onClick}
    >
      {loading ? <span className="ds-spinner" /> : children}
    </button>
  );
}

export function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  return (
    <div className={`ds-toast ds-toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ds-toast-close">
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
      className="ds-avatar"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export function Skeleton({ width = "100%", height = 16 }) {
  return (
    <div className="ds-skeleton" style={{ width, height, borderRadius: 6 }} />
  );
}

export function Badge({ children, color = "blue" }) {
  return <span className={`ds-badge ds-badge-${color}`}>{children}</span>;
}
