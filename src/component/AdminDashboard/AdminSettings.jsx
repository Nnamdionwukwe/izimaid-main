import { useState, useEffect } from "react";
import styles from "./AdminSettings.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSettings({ onBack }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState({});
  const [msgs, setMsgs] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/api/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setSettings(d.settings || {});
        // Pre-populate edit values
        const init = {};
        for (const [k, v] of Object.entries(d.settings || {})) {
          init[k] =
            typeof v.value === "object"
              ? JSON.stringify(v.value)
              : String(v.value ?? "");
        }
        setEdits(init);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(key) {
    setSaving((s) => ({ ...s, [key]: true }));
    setMsgs((m) => ({ ...m, [key]: null }));
    try {
      const token = localStorage.getItem("token");
      // Try parse as JSON first, fall back to string
      let value;
      try {
        value = JSON.parse(edits[key]);
      } catch {
        value = edits[key];
      }

      const res = await fetch(`${API_URL}/api/admin/settings/${key}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSettings((s) => ({
        ...s,
        [key]: { ...s[key], value, updated_at: new Date().toISOString() },
      }));
      setMsgs((m) => ({ ...m, [key]: { type: "success", text: "✓ Saved" } }));
    } catch (err) {
      setMsgs((m) => ({ ...m, [key]: { type: "error", text: err.message } }));
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  }

  const allKeys = Object.keys(settings).filter(
    (k) =>
      !search ||
      k.toLowerCase().includes(search.toLowerCase()) ||
      settings[k]?.description?.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by prefix (e.g. "platform_fee_percent" → "platform", "withdrawal_min" → "withdrawal")
  const groups = {};
  for (const k of allKeys) {
    const group = k.split("_")[0];
    if (!groups[group]) groups[group] = [];
    groups[group].push(k);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Platform Settings</h1>
          </div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <svg
              className={styles.searchIcon}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Filter settings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading settings...</div>
        ) : allKeys.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⚙️</div>
            <p className={styles.emptyText}>
              {search
                ? "No settings match your search"
                : "No platform settings configured yet"}
            </p>
          </div>
        ) : (
          Object.entries(groups).map(([group, keys]) => (
            <div key={group} className={styles.card}>
              <div className={styles.cardHead}>
                <p className={styles.cardTitle}>
                  {group.charAt(0).toUpperCase() + group.slice(1)}
                  <span
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: 11,
                      color: "#aaa",
                      fontWeight: 400,
                      marginLeft: 8,
                    }}
                  >
                    {keys.length} setting{keys.length !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
              <div className={styles.cardBody} style={{ padding: "0 20px" }}>
                {keys.map((key) => {
                  const s = settings[key];
                  const msg = msgs[key];
                  return (
                    <div key={key} className={styles.settingRow}>
                      <div className={styles.settingMeta}>
                        <p className={styles.settingKey}>{key}</p>
                        {s.description && (
                          <p className={styles.settingDesc}>{s.description}</p>
                        )}
                        <p
                          className={styles.settingDesc}
                          style={{ marginTop: 4, color: "#bbb" }}
                        >
                          Last updated: {formatDate(s.updated_at)}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 6,
                        }}
                      >
                        {msg && (
                          <span
                            className={`${styles.feedback} ${msg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
                            style={{
                              margin: 0,
                              padding: "4px 10px",
                              fontSize: 11,
                            }}
                          >
                            {msg.text}
                          </span>
                        )}
                        <div className={styles.settingControl}>
                          <input
                            className={styles.settingInput}
                            type="text"
                            value={edits[key] ?? ""}
                            onChange={(e) =>
                              setEdits((ed) => ({
                                ...ed,
                                [key]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className={styles.saveSettingBtn}
                            onClick={() => handleSave(key)}
                            disabled={saving[key]}
                          >
                            {saving[key] ? "..." : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
