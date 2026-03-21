import { useNavigate } from "react-router-dom";
import styles from "./Residential.module.css";

const ITEMS = [
  {
    icon: "fa fa-th-large",
    label: "Recurring Cleaning",
    path: "/recurring-cleaning",
  },
  {
    icon: "fa fa-th-large",
    label: "One Time Cleaning",
    path: "/one-time-cleaning",
  },
  {
    icon: "fa fa-th-large",
    label: "Occasional Cleaning",
    path: "/occasional-cleaning",
  },
];

export default function LightCommercial() {
  const navigate = useNavigate();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Light Commercial Services</span>
      </div>
      <div className={styles.grid}>
        {ITEMS.map(({ icon, label, path }) => (
          <div
            key={path}
            className={styles.item}
            onClick={() => navigate(path)}
          >
            <div className={styles.iconWrap}>
              <i className={`fa ${icon}`} aria-hidden="true" />
            </div>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
