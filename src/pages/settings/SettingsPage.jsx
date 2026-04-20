import { useState, lazy, Suspense, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Settings.module.css";
import EmergencySettings from "./EmergencySettings";

const ProfileSettings = lazy(
  () => import("../../component/settings/ProfileSettings"),
);
const AppearanceSettings = lazy(
  () => import("../../component/settings/AppearanceSettings"),
);
const NotificationSettings = lazy(
  () => import("../../component/settings/NotificationSettings"),
);
const SubscriptionSettings = lazy(
  () => import("../../component/settings/SubscriptionSettings"),
);
const SecuritySettings = lazy(
  () => import("../../component/settings/SecuritySettings"),
);
const WithdrawalSettings = lazy(
  () => import("../../component/settings/WithdrawalSettings"),
);
const PinSettings = lazy(() => import("../../component/settings/PinSettings"));

const ALL_TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: "👤",
    component: ProfileSettings,
    roles: ["customer", "maid", "admin"],
  },
  {
    id: "emergency",
    label: "Emergency",
    icon: "🆘",
    component: EmergencySettings,
    roles: ["customer", "maid", "admin"],
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: "🎨",
    component: AppearanceSettings,
    roles: ["customer", "maid", "admin"],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "🔔",
    component: NotificationSettings,
    roles: ["customer", "maid", "admin"],
  },
  {
    id: "subscription",
    label: "Subscription",
    icon: "⭐",
    component: SubscriptionSettings,
    roles: ["customer", "maid"],
  },
  {
    id: "withdrawal",
    label: "Payouts",
    icon: "💸",
    component: WithdrawalSettings,
    roles: ["maid"],
    badge: "Maid",
  },
  {
    id: "pin",
    label: "Transaction PIN",
    icon: "🔐",
    component: PinSettings,
    roles: ["maid"],
    badge: "Maid",
  },
  {
    id: "security",
    label: "Security",
    icon: "🔒",
    component: SecuritySettings,
    roles: ["customer", "maid", "admin"],
  },
];

function TabSkeleton({ styles }) {
  return (
    <div className={styles.loadingSection}>
      {[100, 44, 44, 44, 44].map((h, i) => (
        <div key={i} className={styles.skeleton} style={{ height: h }} />
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const role = user?.role || "customer";
  const [tab, setTab] = useState("profile");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tabs = ALL_TABS.filter((t) => t.roles.includes(role));
  const visibleTabs = tabs.length > 0 ? tabs : ALL_TABS;
  const current = visibleTabs.find((t) => t.id === tab) || visibleTabs[0];
  const Component = current.component;

  // Close drawer on tab change or Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  function selectTab(id) {
    setTab(id);
    setDrawerOpen(false);
  }

  const NavList = () => (
    <>
      {visibleTabs.map((t) => (
        <button
          key={t.id}
          onClick={() => selectTab(t.id)}
          className={`${styles.navItem} ${tab === t.id ? styles.navItemActive : ""}`}
        >
          <span className={styles.navIcon}>{t.icon}</span>
          <span className={styles.navLabel}>{t.label}</span>
          {t.badge && <span className={styles.navBadge}>{t.badge}</span>}
          {tab === t.id && <span className={styles.navArrow}>›</span>}
        </button>
      ))}
    </>
  );

  return (
    <div className={styles.page}>
      {/* ── Mobile drawer backdrop ── */}
      {drawerOpen && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile slide-in drawer ── */}
      <div
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
      >
        <div className={styles.drawerHeader}>
          <p className={styles.drawerTitle}>⚙️ Settings</p>
          <button
            className={styles.drawerClose}
            onClick={() => setDrawerOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className={styles.drawerUser}>
          <div className={styles.drawerAvatar}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "?"
            )}
          </div>
          <div>
            <p className={styles.drawerUserName}>{user?.name || "User"}</p>
            <p className={styles.drawerUserRole}>
              {(user?.role || "").charAt(0).toUpperCase() +
                (user?.role || "").slice(1)}
            </p>
          </div>
        </div>
        <nav className={styles.drawerNav}>
          <NavList />
        </nav>
      </div>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        {/* Hamburger — mobile only */}
        <button
          className={styles.menuBtn}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open settings menu"
        >
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
        </button>

        <button
          className={styles.backBtn}
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>
            {current.icon} {current.label}
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Desktop sidebar */}
        <nav className={styles.nav} aria-label="Settings navigation">
          <NavList />
        </nav>

        {/* Content */}
        <main className={styles.content}>
          <div className={styles.contentHeader}>
            <span style={{ fontSize: 18 }}>{current.icon}</span>
            <h2 className={styles.contentTitle}>{current.label}</h2>
          </div>
          <Suspense fallback={<TabSkeleton styles={styles} />}>
            <Component styles={styles} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
