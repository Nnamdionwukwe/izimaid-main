import { useNavigate } from "react-router-dom";
import styles from "./Residential.module.css";

const ITEMS = [
  {
    icon: "fa-th-large",
    label: "General House Cleaning",
    path: "/general-household",
  },
  { icon: "fa-th-large", label: "Living Rooms", path: "/living-rooms" },
  { icon: "fa-th-large", label: "Bedrooms", path: "/bedrooms" },
  { icon: "fa-th-large", label: "Laundry Rooms", path: "/laundry-rooms" },
  { icon: "fa-th-large", label: "Kid's Rooms", path: "/kids-rooms" },
  { icon: "fa-th-large", label: "Bathrooms", path: "/bathrooms" },
  { icon: "fa-th-large", label: "Kitchens", path: "/kitchens" },
  { icon: "fa-th-large", label: "Spring Cleaning", path: "/spring-cleaning" },
  {
    icon: "fa-th-large",
    label: "Move-In Cleaning",
    path: "/move-cleaning-tips",
  },
  { icon: "fa-th-large", label: "How to Save Time", path: "/how-to-save-time" },
  {
    icon: "fa-th-large",
    label: "Schedules, Charts and Checklist",
    path: "/schedules-charts-checklists",
  },
  { icon: "fa-th-large", label: "Office", path: "/office-cleaning-tips" },
];

export default function CleaningTips() {
  const navigate = useNavigate();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Cleaning Tips</span>
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
