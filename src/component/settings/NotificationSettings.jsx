// src/pages/settings/components/NotificationSettings.jsx
import { useState } from "react";
import styles from "../../pages/settings/Settings.module.css";
import {
  Section,
  Toggle,
  SaveButton,
  Toast,
  Field,
  Input,
  Select,
} from "./SettingsUI";
import { useNotificationPrefs } from "../../pages/hooks/useSettings";

const CATEGORIES = [
  {
    key: "bookings",
    label: "Bookings",
    description: "Confirmations, reminders, cancellations",
  },
  {
    key: "payments",
    label: "Payments",
    description: "Receipts, refunds, failed payments",
  },
  {
    key: "messages",
    label: "Messages",
    description: "New messages from maids or customers",
  },
  {
    key: "reviews",
    label: "Reviews",
    description: "New reviews on your profile",
  },
  {
    key: "withdrawals",
    label: "Withdrawals",
    description: "Payout status updates",
  },
  {
    key: "support",
    label: "Support",
    description: "Ticket replies and status changes",
  },
  {
    key: "system",
    label: "System",
    description: "Security alerts, account updates",
  },
  {
    key: "promotions",
    label: "Promotions",
    description: "Deals, features, and news",
  },
];

const CHANNELS = [
  { key: "inapp", label: "In-app", icon: "🔔" },
  { key: "email", label: "Email", icon: "✉️" },
  { key: "push", label: "Push", icon: "📱" },
];

const TIMEZONES = [
  "Africa/Lagos",
  "Africa/Nairobi",
  "Africa/Accra",
  "Africa/Johannesburg",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Toronto",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
];

export default function NotificationSettings() {
  const { prefs, loading, update } = useNotificationPrefs();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [localPrefs, setLocalPrefs] = useState(null);

  if (prefs && !localPrefs) setLocalPrefs({ ...prefs });

  function toggle(channel, category) {
    const key = `${channel}_${category}`;
    setLocalPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function setQuiet(field, value) {
    setLocalPrefs((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await update(localPrefs);
      setToast({ message: "Notification preferences saved", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !localPrefs) {
    return (
      <div className={styles.loadingSection}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.skeleton} style={{ height: 52 }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <form onSubmit={handleSubmit}>
        <Section
          title="Notification channels"
          description="Control how you're notified for each category."
        >
          <div className={styles.notifTable}>
            {/* Header */}
            <div className={styles.notifHeader}>
              <div className={styles.notifCategoryCol} />
              {CHANNELS.map((ch) => (
                <div key={ch.key} className={styles.notifChannelCol}>
                  <span>{ch.icon}</span>
                  <span>{ch.label}</span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.key}
                className={`${styles.notifRow} ${i % 2 === 0 ? styles.notifRowEven : ""}`}
              >
                <div className={styles.notifCategoryCol}>
                  <span className={styles.notifCatLabel}>{cat.label}</span>
                  <span className={styles.notifCatDesc}>{cat.description}</span>
                </div>
                {CHANNELS.map((ch) => (
                  <div key={ch.key} className={styles.notifChannelCol}>
                    <Toggle
                      checked={localPrefs[`${ch.key}_${cat.key}`] !== false}
                      onChange={() => toggle(ch.key, cat.key)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>

        {/* Quiet hours */}
        <Section
          title="Quiet hours"
          description="Suppress push and in-app notifications during these hours."
        >
          <div className={styles.quietRow}>
            <div className={styles.quietToggle}>
              <span>Enable quiet hours</span>
              <Toggle
                checked={localPrefs.quiet_hours_enabled || false}
                onChange={(v) => setQuiet("quiet_hours_enabled", v)}
              />
            </div>

            {localPrefs.quiet_hours_enabled && (
              <div className={styles.formGrid} style={{ marginTop: 16 }}>
                <Field label="Start time">
                  <Input
                    type="time"
                    value={localPrefs.quiet_hours_start || "22:00"}
                    onChange={(e) =>
                      setQuiet("quiet_hours_start", e.target.value)
                    }
                  />
                </Field>
                <Field label="End time">
                  <Input
                    type="time"
                    value={localPrefs.quiet_hours_end || "08:00"}
                    onChange={(e) =>
                      setQuiet("quiet_hours_end", e.target.value)
                    }
                  />
                </Field>
                <Field label="Timezone">
                  <Select
                    value={localPrefs.quiet_hours_timezone || "Africa/Lagos"}
                    onChange={(e) =>
                      setQuiet("quiet_hours_timezone", e.target.value)
                    }
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz.replace(/_/g, " ")}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            )}
          </div>
        </Section>

        <div className={styles.formFooter}>
          <SaveButton loading={saving} />
        </div>
      </form>
    </div>
  );
}
