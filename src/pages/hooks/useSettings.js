// src/hooks/useSettings.js
import { useState, useEffect, useCallback } from "react";

const RAW = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const BASE = RAW.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

function getToken() {
  return localStorage.getItem("token");
}
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/settings`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
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
    const res = await fetch(`${BASE}/settings`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setSettings(data.settings);
    return data.settings;
  }, []);

  return { settings, loading, error, refetch: fetch_, update };
}

export function useLanguages() {
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    fetch(`${BASE}/settings/languages`)
      .then((r) => r.json())
      .then((d) => setLanguages(d.languages || []));
  }, []);
  return languages;
}

export function useCurrencies() {
  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    fetch(`${BASE}/settings/currencies`)
      .then((r) => r.json())
      .then((d) => setCurrencies(d.currencies || []));
  }, []);
  return currencies;
}

export function useNotificationPrefs() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/notifications/preferences`, {
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
    const res = await fetch(`${BASE}/notifications/preferences`, {
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

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/auth/me`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const update = useCallback(async (payload) => {
    const res = await fetch(`${BASE}/maids/profile`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setProfile((prev) => ({ ...prev, ...data.profile }));
    return data;
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    const form = new FormData();
    form.append("avatar", file);
    const res = await fetch(`${BASE}/maids/avatar`, {
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

export function useSubscription(interval = null) {
  const [data, setData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const role =
    JSON.parse(localStorage.getItem("user") || "{}").role || "customer";

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const plansUrl = `${BASE}/subscriptions/plans?role=${role}${interval ? `&interval=${interval}` : ""}`;
      const [rSub, rPlans] = await Promise.all([
        fetch(`${BASE}/subscriptions/my`, { headers: authHeaders() }),
        fetch(plansUrl),
      ]);
      const [dSub, dPlans] = await Promise.all([rSub.json(), rPlans.json()]);
      if (rSub.ok) setData(dSub);
      if (rPlans.ok) setPlans(dPlans.plans || []);
    } catch (err) {
      console.error("[useSubscription]", err);
    } finally {
      setLoading(false);
    }
  }, [role, interval]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  const cancel = useCallback(
    async (reason, immediate = false) => {
      const res = await fetch(`${BASE}/subscriptions/cancel`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ reason, immediate }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await fetch_();
      return json;
    },
    [fetch_],
  );

  const pause = useCallback(async () => {
    const res = await fetch(`${BASE}/subscriptions/pause`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({}),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await fetch_();
    return json;
  }, [fetch_]);

  const resume = useCallback(async () => {
    const res = await fetch(`${BASE}/subscriptions/resume`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({}),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await fetch_();
    return json;
  }, [fetch_]);

  const subscribe = useCallback(
    async (planId, gateway = "paystack", promoCode) => {
      const res = await fetch(`${BASE}/subscriptions/subscribe/${gateway}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          plan_id: planId,
          promo_code: promoCode || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    [],
  );

  const changePlan = useCallback(
    async (planId) => {
      const res = await fetch(`${BASE}/subscriptions/change-plan`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ new_plan_id: planId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await fetch_();
      return json;
    },
    [fetch_],
  );

  const validatePromo = useCallback(async (code, planId) => {
    const res = await fetch(`${BASE}/subscriptions/validate-promo`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ code, plan_id: planId }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    return json;
  }, []);

  return {
    data,
    plans,
    loading,
    refetch: fetch_,
    cancel,
    pause,
    resume,
    subscribe,
    changePlan,
    validatePromo,
  };
}

export function useBankDetails() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/payments/bank-details`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setDetails(d.bank_details);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const save = useCallback(async (payload) => {
    const res = await fetch(`${BASE}/payments/bank-details`, {
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

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${BASE}/auth/change-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}
