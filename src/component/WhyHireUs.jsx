import { useNavigate } from "react-router-dom";
import styles from "./Residential.module.css";

const ITEMS = [
  { icon: "fa-th-large", label: "Our Approach", path: "/our-approach" },
  { icon: "fa-th-large", label: "Our Results", path: "/our-results" },
  { icon: "fa-th-large", label: "Our Commitment", path: "/our-commitment" },
  // { icon: "fa-th-large", label: "Affordable Cleaning", path: "/home-cleaning" },
  // { icon: "fa-th-large", label: "Reviews", path: "/our-results" },
  // {
  //   icon: "fa-th-large",
  //   label: "Neighborly Done Right Promise",
  //   path: "/our-commitment",
  // },
];

export default function WhyHireUs() {
  const navigate = useNavigate();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>Why Hire Us</span>
      </div>
      <div className={styles.grid}>
        {ITEMS.map(({ icon, label, path }) => (
          <div
            key={label}
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
