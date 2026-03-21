import { useNavigate } from "react-router-dom";
import styles from "./Residential.module.css";

const ITEMS = [
  { icon: "fa-th-large", label: "Guides and Graphics", path: "/blog" },
  { icon: "fa-th-large", label: "Seasonal", path: "/blog/seasonal" },
  {
    icon: "fa-th-large",
    label: "Tips and Tricks",
    path: "/blog/tips-and-tricks",
  },
];

export default function Practically() {
  const navigate = useNavigate();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Practically Spotless Blog</span>
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
