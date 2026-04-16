// src/pages/settings/SettingsPage.jsx
import { useState, lazy, Suspense } from "react";
import "./settings.css";

// Lazy-load each tab — only fetches data when the user clicks it
const ProfileSettings = lazy(() => import("../../component/ProfileSettings"));
const AppearanceSettings = lazy(
  () => import("../../component/AppearanceSettings"),
);
const NotificationSettings = lazy(
  () => import("../../component/NotificationSettings"),
);
const SubscriptionSettings = lazy(
  () => import("../../component/SubscriptionSettings"),
);
const SecuritySettings = lazy(() => import("../../component/SecuritySettings"));
const WithdrawalSettings = lazy(
  () => import("../../component/WithdrawalSettings"),
);
const PinSettings = lazy(() => import("../../component/PinSettings"));

// Current user from JWT — adjust to your auth context
function useCurrentUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
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
    id: "security",
    label: "Security",
    icon: "🔒",
    component: SecuritySettings,
    roles: ["customer", "maid", "admin"],
  },
  {
    id: "pin",
    label: "Transaction PIN",
    icon: "🔐",
    component: PinSettings,
    roles: ["maid"], // customers can have PIN too if you want — add "customer"
    badge: "Maid",
  },
];

function TabSkeleton() {
  return (
    <div className="ds-loading-section">
      {[120, 44, 44, 44].map((h, i) => (
        <div
          key={i}
          className="ds-skeleton"
          style={{ height: h, marginBottom: 12 }}
        />
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
    <div className="ds-settings-page">
      {/* Page header */}
      <div className="ds-settings-header">
        <h1 className="ds-settings-title">Settings</h1>
        <p className="ds-settings-subtitle">
          Manage your account, preferences, and security.
        </p>
      </div>

      <div className="ds-settings-layout">
        {/* Sidebar nav */}
        <nav className="ds-settings-nav" aria-label="Settings navigation">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`ds-nav-item ${tab === t.id ? "ds-nav-item-active" : ""}`}
              aria-current={tab === t.id ? "page" : undefined}
            >
              <span className="ds-nav-icon">{t.icon}</span>
              <span className="ds-nav-label">{t.label}</span>
              {t.badge && <span className="ds-nav-badge">{t.badge}</span>}
              {tab === t.id && (
                <span className="ds-nav-indicator" aria-hidden />
              )}
            </button>
          ))}
        </nav>

        {/* Content area */}
        <main className="ds-settings-content">
          <div className="ds-content-header">
            <h2 className="ds-content-title">
              {current.icon} {current.label}
            </h2>
          </div>

          <Suspense fallback={<TabSkeleton />}>
            <Component />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
