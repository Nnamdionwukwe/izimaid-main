// src/pages/settings/SettingsPage.jsx
// Uses Settings.module.css — no more global .ds-* classes

import { useState, lazy, Suspense } from "react";
import styles from "./Settings.module.css";

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

function useCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const ALL_TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: "👤",
    component: ProfileSettings,
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

function TabSkeleton() {
  return (
    <div className={styles.loadingSection}>
      {[100, 44, 44, 44, 44].map((h, i) => (
        <div key={i} className={styles.skeleton} style={{ height: h }} />
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const user = useCurrentUser();
  const role = user?.role || "customer";
  const [tab, setTab] = useState("profile");

  const tabs = ALL_TABS.filter((t) => t.roles.includes(role));
  const current = tabs.find((t) => t.id === tab) || tabs[0];
  const Component = current.component;

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>
          Manage your account, preferences, and security
        </p>
      </div>

      <div className={styles.layout}>
        {/* Sidebar nav */}
        <nav className={styles.nav} aria-label="Settings navigation">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`${styles.navItem} ${tab === t.id ? styles.navItemActive : ""}`}
              aria-current={tab === t.id ? "page" : undefined}
            >
              <span className={styles.navIcon}>{t.icon}</span>
              <span className={styles.navLabel}>{t.label}</span>
              {t.badge && <span className={styles.navBadge}>{t.badge}</span>}
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <main className={styles.content}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>
              {current.icon} {current.label}
            </h2>
          </div>

          <Suspense fallback={<TabSkeleton />}>
            <Component styles={styles} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
