// src/pages/settings/components/ProfileSettings.jsx
import { useState, useRef } from "react";
import { useProfile } from "../../../hooks/useSettings";
import {
  Section,
  Field,
  Input,
  Select,
  SaveButton,
  Avatar,
  Toast,
} from "./SettingsUI";

const COUNTRIES = [
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "ZA", name: "South Africa" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  { code: "NG", name: "Nigeria" },
].filter((c, i, a) => a.findIndex((x) => x.code === c.code) === i);

export default function ProfileSettings() {
  const { profile, loading, update, uploadAvatar } = useProfile();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "NG",
  });

  // Populate form when profile loads
  if (profile && form.name === "" && profile.name) {
    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      country: profile.country || "NG",
    });
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) {
      e.phone = "Enter a valid phone number";
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await update({ bio: form.bio, location: form.location });
      // Update name/phone via user update
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/auth/update-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            country: form.country,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to update profile");
      setToast({ message: "Profile updated successfully", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: "Image must be under 5MB", type: "error" });
      return;
    }
    setUploading(true);
    try {
      await uploadAvatar(file);
      setToast({ message: "Avatar updated!", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="ds-loading-section">
        <div
          className="ds-skeleton"
          style={{ width: 80, height: 80, borderRadius: "50%" }}
        />
        <div
          className="ds-skeleton"
          style={{ width: "60%", height: 20, marginTop: 16 }}
        />
        <div
          className="ds-skeleton"
          style={{ width: "100%", height: 44, marginTop: 12 }}
        />
        <div
          className="ds-skeleton"
          style={{ width: "100%", height: 44, marginTop: 12 }}
        />
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

      {/* Avatar upload */}
      <Section
        title="Profile photo"
        description="Shown to customers and maids on bookings."
      >
        <div className="ds-avatar-row">
          <Avatar src={profile?.avatar} name={profile?.name} size={72} />
          <div className="ds-avatar-actions">
            <button
              type="button"
              className="ds-btn-secondary"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Change photo"}
            </button>
            <p className="ds-hint">JPG or PNG, max 5 MB</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>
      </Section>

      {/* Profile details */}
      <Section title="Personal information">
        <form onSubmit={handleSubmit} className="ds-form">
          <div className="ds-form-grid">
            <Field label="Full name" error={errors.name}>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Your full name"
              />
            </Field>

            <Field label="Email address" hint="Email cannot be changed here.">
              <Input
                value={profile?.email || ""}
                disabled
                className="ds-input-disabled"
              />
            </Field>

            <Field
              label="Phone number"
              hint="Include country code, e.g. +234…"
              error={errors.phone}
            >
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+234 800 000 0000"
                type="tel"
              />
            </Field>

            <Field label="Country">
              <Select
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="ds-form-footer">
            <SaveButton loading={saving} />
          </div>
        </form>
      </Section>
    </div>
  );
}
