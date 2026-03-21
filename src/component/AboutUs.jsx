import { useNavigate } from "react-router-dom";
import styles from "./Residential.module.css";
import aboutStyles from "./Residential.module.css";

const SECTIONS = [
  {
    heading: null,
    items: [
      {
        icon: "fa fa-th-large",
        label: "A Deusizi Company",
        path: "/deusizi-group",
      },
      { icon: "fa fa-th-large", label: "Locations", path: "/locations" },
      { icon: "fa fa-th-large", label: "The Deusizi App", path: "/app" },
      {
        icon: "fa fa-th-large",
        label: "Gift Certificates",
        path: "/gift-certificates",
      },
    ],
  },
  {
    heading: "FAQ",
    items: [
      {
        icon: "fa fa-th-large",
        label: "What's Included",
        path: "/whats-included",
      },
      {
        icon: "fa fa-th-large",
        label: "Before and After Your Cleaning",
        path: "/before-after-cleaning",
      },
    ],
  },
  {
    heading: "Deusizi Foundation",
    items: [
      { icon: "fa fa-th-large", label: "Donate", path: "/foundation" },
      {
        icon: "fa fa-th-large",
        label: "Deusizi Sparkle Awards",
        path: "/awards",
      },
      {
        icon: "fa fa-th-large",
        label: "Local Shelter/Agency Support",
        path: "/local-shelter-support",
      },
      {
        icon: "fa fa-th-large",
        label: "Board of Directors",
        path: "/board-of-directors",
      },
    ],
  },
  {
    heading: null,
    items: [
      { icon: "fa fa-th-large", label: "Own a Franchise", path: "/franchise" },
      { icon: "fa fa-th-large", label: "Contact Us", path: "/contact" },
      {
        icon: "fa fa-th-large",
        label: "Apply Locally",
        path: "/apply-locally",
      },
      {
        icon: "fa fa-th-large",
        label: "Aplicar Localmente",
        path: "/aplicar-localmente",
      },
    ],
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className={`${styles.panel} ${aboutStyles.wide}`}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>About Us</span>
      </div>

      <div className={aboutStyles.sections}>
        {SECTIONS.map((section, si) => (
          <div key={si} className={aboutStyles.section}>
            {section.heading && (
              <p className={aboutStyles.sectionHeading}>{section.heading}</p>
            )}
            <div className={aboutStyles.sectionItems}>
              {section.items.map(({ icon, label, path }) => (
                <div
                  key={path + label}
                  className={styles.item}
                  onClick={() => navigate(path)}
                >
                  <div className={styles.iconWrap}>
                    <i className={icon} aria-hidden="true" />
                  </div>
                  <span className={styles.label}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
