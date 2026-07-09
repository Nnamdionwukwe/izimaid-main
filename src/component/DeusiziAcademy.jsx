import { useNavigate } from "react-router-dom";
import styles from "./Residential.module.css"; // ← now uses the same CSS as Practically

export default function DeusiziAcademy() {
  const navigate = useNavigate();

  const ITEMS = [
    { label: "Cleaner Training", path: "/deusizi-academy/cleaner-training" },
    {
      label: "Housekeeper Training",
      path: "/deusizi-academy/housekeeper-training",
    },
    {
      label: "Caregiver Training",
      path: "/deusizi-academy/caregiver-training",
    },
    {
      label: "Domestic Staff Certification",
      path: "/deusizi-academy/domestic-staff-certification",
    },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Deusizi Academy</span>
      </div>
      <div className={styles.grid}>
        {ITEMS.map(({ label, path }) => (
          <div
            key={path}
            className={styles.item}
            onClick={() => navigate(path)}
          >
            <div className={styles.iconWrap}>
              <i className="fa fa-th-large" aria-hidden="true" />
            </div>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
