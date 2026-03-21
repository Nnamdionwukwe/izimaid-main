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
    icon: "ffa fa-th-large",
    label: "Move-In Cleaning",
    path: "/move-in-cleaning",
  },
  {
    icon: "fa fa-th-large",
    label: "Eco Friendly Cleaning",
    path: "/eco-friendly-cleaning",
  },
  {
    icon: "fa fa-th-large",
    label: "Apartment & Condo Cleaning",
    path: "/apartment-cleaning",
  },
  {
    icon: "fa fa-th-large",
    label: "Occasional Cleaning",
    path: "/occasional-cleaning",
  },
  {
    icon: "fa fa-th-large",
    label: "Move-Out Cleaning",
    path: "/move-out-cleaning",
  },
  { icon: "fa fa-th-large", label: "Home Cleaning", path: "/home-cleaning" },
  {
    icon: "ffa fa-th-large",
    label: "Special Event Cleaning",
    path: "/special-event-cleaning",
  },
];

export default function Residential() {
  const navigate = useNavigate();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Residential Services</span>
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
