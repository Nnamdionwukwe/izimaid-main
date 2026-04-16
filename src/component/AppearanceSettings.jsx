// src/pages/settings/components/AppearanceSettings.jsx
import { useState, useEffect } from "react";
import {
  useSettings,
  useLanguages,
  useCurrencies,
} from "../../../hooks/useSettings";
import { Section, Field, Select, SaveButton, Toast } from "./SettingsUI";

const THEMES = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "system", label: "System", icon: "💻" },
];

export default function AppearanceSettings() {
  const { settings, loading, update } = useSettings();
  const languages = useLanguages();
  const currencies = useCurrencies();

  const [form, setForm] = useState({
    theme: "system",
    language: "en",
    currency: "NGN",
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (settings && !init) {
      setForm({
        theme: settings.theme || "system",
        language: settings.language || "en",
        currency: settings.currency || "NGN",
      });
      setInit(true);
    }
  }, [settings, init]);

  // Apply theme immediately on change
  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else if (theme === "light") root.setAttribute("data-theme", "light");
    else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
  }

  function handleThemeChange(theme) {
    setForm((f) => ({ ...f, theme }));
    applyTheme(theme);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await update({
        theme: form.theme,
        language: form.language,
        currency: form.currency,
      });
      setToast({ message: "Appearance saved", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="ds-loading-section">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="ds-skeleton"
            style={{ height: 44, marginBottom: 12 }}
          />
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
        {/* Theme */}
        <Section
          title="Theme"
          description="Choose how Deusizi Sparkle looks on your device."
        >
          <div className="ds-theme-grid">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleThemeChange(t.value)}
                className={`ds-theme-card ${form.theme === t.value ? "ds-theme-card-active" : ""}`}
              >
                <span className="ds-theme-icon">{t.icon}</span>
                <span className="ds-theme-label">{t.label}</span>
                {form.theme === t.value && (
                  <span className="ds-theme-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* Language */}
        <Section
          title="Language"
          description="Choose your preferred language. The interface will update immediately."
        >
          <Field label="Display language">
            <Select
              value={form.language}
              onChange={(e) =>
                setForm((f) => ({ ...f, language: e.target.value }))
              }
            >
              {languages.length === 0 && <option value="en">English</option>}
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native_name ? `${l.native_name} (${l.name})` : l.name}
                  {l.rtl ? " ← RTL" : ""}
                </option>
              ))}
            </Select>
          </Field>
        </Section>

        {/* Currency */}
        <Section
          title="Currency"
          description="Prices will be displayed in your chosen currency. Payments use the currency matching your location."
        >
          <Field label="Display currency">
            <Select
              value={form.currency}
              onChange={(e) =>
                setForm((f) => ({ ...f, currency: e.target.value }))
              }
            >
              {currencies.length === 0 && (
                <>
                  <option value="NGN">NGN — Nigerian Naira (₦)</option>
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="GBP">GBP — British Pound (£)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                </>
              )}
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </Select>
          </Field>
          <p className="ds-hint" style={{ marginTop: 8 }}>
            Exchange rates are approximate. Final payment amounts are confirmed
            at checkout.
          </p>
        </Section>

        <div className="ds-form-footer">
          <SaveButton loading={saving} />
        </div>
      </form>
    </div>
  );
}
