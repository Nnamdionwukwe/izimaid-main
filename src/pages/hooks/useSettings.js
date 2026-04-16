// src/hooks/useSettings.js
import { useState, useEffect, useCallback } from "react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// Make sure trailing slash is stripped:
const API = BASE.replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ── Settings ──────────────────────────────────────────────────────────
export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/settings`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load settings");
      setSettings(data.settings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  const update = useCallback(async (payload) => {
    const res = await fetch(`${API}/settings`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update settings");
    setSettings(data.settings);
    return data.settings;
  }, []);

  return { settings, loading, error, refetch: fetch_, update };
}

// ── Languages & Currencies ────────────────────────────────────────────
export function useLanguages() {
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    fetch(`${API}/settings/languages`)
      .then((r) => r.json())
      .then((d) => setLanguages(d.languages || []));
  }, []);
  return languages;
}

export function useCurrencies() {
  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    fetch(`${API}/settings/currencies`)
      .then((r) => r.json())
      .then((d) => setCurrencies(d.currencies || []));
  }, []);
  return currencies;
}

// ── Notification Preferences ──────────────────────────────────────────
export function useNotificationPrefs() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/notifications/preferences`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setPrefs(data.preferences);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  const update = useCallback(async (payload) => {
    const res = await fetch(`${API}/notifications/preferences`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setPrefs(data.preferences);
    return data.preferences;
  }, []);

  return { prefs, loading, update };
}

// ── Profile (GET /auth/me + PATCH /users/profile) ─────────────────────
export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/auth/me`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.user);
        setLoading(false);
      });
  }, []);

  const update = useCallback(async (formData) => {
    // formData can be FormData (for avatar) or plain object
    const isForm = formData instanceof FormData;
    const res = await fetch(`${API}/maids/profile`, {
      method: "PATCH",
      headers: isForm
        ? { Authorization: `Bearer ${getToken()}` }
        : authHeaders(),
      body: isForm ? formData : JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setProfile((prev) => ({ ...prev, ...data.profile }));
    return data;
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    const form = new FormData();
    form.append("avatar", file);
    const res = await fetch(`${API}/maids/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setProfile((prev) => ({ ...prev, avatar: data.avatar_url }));
    return data.avatar_url;
  }, []);

  return { profile, loading, update, uploadAvatar };
}

// ── Subscription ──────────────────────────────────────────────────────
export function useSubscription() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/subscriptions/my`, {
        headers: authHeaders(),
      });
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  const cancel = useCallback(
    async (reason, immediate = false) => {
      const res = await fetch(`${API}/subscriptions/cancel`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ reason, immediate }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      fetch_();
      return json;
    },
    [fetch_],
  );

  return { data, loading, refetch: fetch_, cancel };
}

// ── Maid bank details ─────────────────────────────────────────────────
export function useBankDetails() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/payments/bank-details`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setDetails(d.bank_details);
        setLoading(false);
      });
  }, []);

  const save = useCallback(async (payload) => {
    const res = await fetch(`${API}/payments/bank-details`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setDetails(data.bank_details);
    return data.bank_details;
  }, []);

  return { details, loading, save };
}

// ── Auth (change password) ────────────────────────────────────────────
export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${API}/auth/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
