import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const RELATIONSHIPS = [
  "spouse",
  "parent",
  "sibling",
  "child",
  "friend",
  "colleague",
  "other",
];
const COUNTRY_CODES = [
  "+234",
  "+1",
  "+44",
  "+49",
  "+33",
  "+254",
  "+233",
  "+27",
  "+256",
  "+20",
  "+971",
  "+91",
  "+971",
];

export default function EmergencySettings({ styles }) {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [form, setForm] = useState({
    name: "",
    phone: "",
    phone_country_code: "+234",
    email: "",
    relationship: "other",
    is_primary: false,
  });

  useEffect(() => {
    fetch(`${API_URL}/api/bookings/emergency-contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 4000);
  }

  async function handleAdd() {
    if (!form.name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    if (!form.phone.trim()) {
      showToast("Phone number is required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/emergency-contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setContacts((p) => [...p, data.contact]);
      setForm({
        name: "",
        phone: "",
        phone_country_code: "+234",
        email: "",
        relationship: "other",
        is_primary: false,
      });
      showToast("✅ Emergency contact added!");
    } catch (err) {
      showToast(err.message || "Failed to add contact", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this emergency contact?")) return;
    try {
      const res = await fetch(
        `${API_URL}/api/bookings/emergency-contacts/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      setContacts((p) => p.filter((c) => c.id !== id));
      showToast("Contact removed");
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <div>
      {toast.msg && (
        <div
          className={`${styles.toast} ${toast.type === "error" ? styles.toastError : styles.toastSuccess}`}
        >
          <span>{toast.msg}</span>
          <button
            className={styles.toastClose}
            onClick={() => setToast({ msg: "", type: "" })}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Existing contacts ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Your emergency contacts</p>
          <p className={styles.sectionDesc}>
            Shared with the other party (maid/customer) and sent to admins when
            an SOS alert is triggered. Always use full international phone
            numbers.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "gray", fontSize: 13 }}>Loading contacts…</p>
        ) : contacts.length === 0 ? (
          <div
            style={{
              padding: "20px 16px",
              background: "rgb(245,245,248)",
              borderRadius: 8,
              textAlign: "center",
              border: "1px dashed rgb(200,200,220)",
            }}
          >
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>🆘</p>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                margin: "0 0 4px",
                color: "rgb(47,47,47)",
              }}
            >
              No emergency contacts yet
            </p>
            <p style={{ fontSize: 12, color: "gray", margin: 0 }}>
              Add a contact below so help can reach you in an emergency.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {contacts.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "14px 16px",
                  background: "rgb(245,245,248)",
                  border: "1px solid rgb(228,228,228)",
                  borderRadius: 10,
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        margin: 0,
                        color: "rgb(30,30,30)",
                      }}
                    >
                      {c.name}
                    </p>
                    {c.is_primary && (
                      <span
                        style={{
                          fontSize: 9,
                          background: "rgb(19,19,103)",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: 20,
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        Primary
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "gray",
                      margin: "0 0 4px",
                      textTransform: "capitalize",
                    }}
                  >
                    {c.relationship}
                  </p>
                  <a
                    href={`tel:${c.phone}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "rgb(10,107,46)",
                      textDecoration: "none",
                      marginBottom: c.email ? 4 : 0,
                    }}
                  >
                    📞 {c.phone}
                  </a>
                  {c.email && (
                    <p
                      style={{ fontSize: 12, color: "gray", margin: "2px 0 0" }}
                    >
                      ✉️ {c.email}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={{
                    background: "none",
                    border: "1px solid rgb(255,200,200)",
                    color: "rgb(168,28,28)",
                    borderRadius: 6,
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add new contact ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Add a new contact</p>
          <p className={styles.sectionDesc}>
            We recommend adding at least one primary emergency contact.
          </p>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Full name *</label>
            <input
              className={styles.input}
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Relationship</label>
            <select
              className={styles.input}
              value={form.relationship}
              onChange={(e) =>
                setForm((p) => ({ ...p, relationship: e.target.value }))
              }
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Country code</label>
            <select
              className={styles.input}
              value={form.phone_country_code}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone_country_code: e.target.value }))
              }
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Phone number *</label>
            <input
              className={styles.input}
              placeholder="08012345678"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
            <span className={styles.hint}>
              Enter without leading 0 if country code is selected, e.g.
              8012345678
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              Email address{" "}
              <span style={{ fontWeight: 400, color: "gray" }}>(optional)</span>
            </label>
            <input
              className={styles.input}
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>

          <div
            className={styles.field}
            style={{ justifyContent: "flex-end", paddingTop: 20 }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "rgb(47,47,47)",
              }}
            >
              <input
                type="checkbox"
                checked={form.is_primary}
                onChange={(e) =>
                  setForm((p) => ({ ...p, is_primary: e.target.checked }))
                }
                style={{ width: 16, height: 16, cursor: "pointer" }}
              />
              Set as primary contact
            </label>
            <span className={styles.hint}>
              Primary contact is shown first and notified first in emergencies.
            </span>
          </div>
        </div>

        <div className={styles.formFooter}>
          <button
            className={styles.btnPrimary}
            onClick={handleAdd}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className={styles.spinner} /> Adding…
              </>
            ) : (
              "🆘 Add Emergency Contact"
            )}
          </button>
        </div>
      </div>

      {/* ── Info box ── */}
      <div className={styles.section}>
        <div
          style={{
            padding: "14px 16px",
            background: "rgb(255,243,205)",
            borderRadius: 8,
            border: "1px solid rgb(234,179,8)",
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "rgb(133,100,4)",
              margin: "0 0 6px",
            }}
          >
            ⚠️ Why this matters
          </p>
          <p
            style={{
              fontSize: 12,
              color: "rgb(100,75,0)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            When an SOS alert is triggered during a booking, your emergency
            contacts are immediately emailed alongside the maid's and customer's
            contacts. Admins are also notified with everyone's details so help
            can be coordinated fast.
          </p>
        </div>
      </div>
    </div>
  );
}
