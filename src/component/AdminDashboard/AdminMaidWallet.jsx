import { useState, useEffect, useCallback } from "react";
import styles from "./Payments.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "₵",
  KES: "KSh",
  ZAR: "R",
  UGX: "USh",
  TZS: "TSh",
  EGP: "E£",
  CAD: "CA$",
  AUD: "A$",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
  QAR: "QR",
  SGD: "S$",
  MYR: "RM",
  BRL: "R$",
  JPY: "¥",
};

function sym(currency) {
  return CURRENCY_SYMBOLS[currency] || (currency ? `${currency} ` : "₦");
}

function fmt(amount, currency) {
  return `${sym(currency)}${Number(amount || 0).toLocaleString()}`;
}

const COUNTRIES = [
  ["NG", "Nigeria"],
  ["GH", "Ghana"],
  ["KE", "Kenya"],
  ["ZA", "South Africa"],
  ["UG", "Uganda"],
  ["TZ", "Tanzania"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
  ["CA", "Canada"],
  ["AU", "Australia"],
  ["AE", "UAE"],
  ["IN", "India"],
  ["SG", "Singapore"],
  ["MY", "Malaysia"],
  ["BR", "Brazil"],
  ["MX", "Mexico"],
];

const CURRENCIES = [
  "NGN",
  "USD",
  "GBP",
  "EUR",
  "GHS",
  "KES",
  "ZAR",
  "UGX",
  "TZS",
  "EGP",
  "CAD",
  "AUD",
  "INR",
  "AED",
  "SAR",
  "QAR",
  "SGD",
  "MYR",
  "BRL",
  "JPY",
];

// ── Earnings Tab ──────────────────────────────────────────────────────────────
function EarningsTab() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/payments/earnings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEarnings(data.earnings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className={styles.loading}>Loading earnings...</div>;

  if (!earnings.length)
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>💰</div>
        <p className={styles.emptyText}>No earnings yet</p>
      </div>
    );

  return (
    <>
      <p className={styles.sectionTitle}>
        Earnings by Currency
        <span className={styles.sectionCount}>
          {earnings.length} {earnings.length === 1 ? "currency" : "currencies"}
        </span>
      </p>

      <div className={styles.earningsGrid}>
        {earnings.map((e) => (
          <div key={e.currency} className={styles.earningsCard}>
            <div className={styles.earningsCardHead}>
              <p className={styles.currencyCode}>{e.currency}</p>
              <span className={styles.currencySymbol}>{sym(e.currency)}</span>
            </div>

            <div className={styles.earningsStats}>
              <div className={styles.earningStat}>
                <p className={styles.earningStatLabel}>Total Earned</p>
                <p className={`${styles.earningStatValue} ${styles.green}`}>
                  {fmt(e.total_earned, e.currency)}
                </p>
              </div>
              <div className={styles.earningStat}>
                <p className={styles.earningStatLabel}>In Escrow</p>
                <p className={`${styles.earningStatValue} ${styles.amber}`}>
                  {fmt(e.in_escrow, e.currency)}
                </p>
              </div>
              <div className={styles.earningStat}>
                <p className={styles.earningStatLabel}>Jobs Paid</p>
                <p className={styles.earningStatValue}>{e.total_paid_count}</p>
              </div>
              <div className={styles.earningStat}>
                <p className={styles.earningStatLabel}>Pending Jobs</p>
                <p className={`${styles.earningStatValue} ${styles.blue}`}>
                  {e.in_escrow_count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Bank Details Tab ──────────────────────────────────────────────────────────
function BankDetailsTab() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const [form, setForm] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
    bank_code: "",
    country: "NG",
    currency: "NGN",
  });

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/payments/bank-details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.bank_details) {
          setDetails(data.bank_details);
          setForm({
            bank_name: data.bank_details.bank_name || "",
            account_number: data.bank_details.account_number || "",
            account_name: data.bank_details.account_name || "",
            bank_code: data.bank_details.bank_code || "",
            country: data.bank_details.country || "NG",
            currency: data.bank_details.currency || "NGN",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    if (!form.bank_name || !form.account_number || !form.account_name) {
      setMsg({
        type: "error",
        text: "Bank name, account number and account name are required",
      });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/payments/bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDetails(data.bank_details);
      setMsg({ type: "success", text: "✓ Bank details saved successfully" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <div className={styles.loading}>Loading bank details...</div>;

  return (
    <div className={styles.formCard}>
      <div className={styles.formCardHead}>
        <p className={styles.formCardTitle}>
          {details ? "Bank / Payout Account" : "Add Bank Account"}
        </p>
        {details && (
          <span
            className={
              details.verified ? styles.verifiedBadge : styles.unverifiedBadge
            }
          >
            {details.verified ? "✓ Verified" : "Pending verification"}
          </span>
        )}
      </div>

      <div className={styles.formBody}>
        {msg && (
          <div
            className={`${styles.feedback} ${msg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
          >
            {msg.text}
          </div>
        )}

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Country</label>
            <select
              className={styles.formSelect}
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
            >
              {COUNTRIES.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Payout Currency</label>
            <select
              className={styles.formSelect}
              value={form.currency}
              onChange={(e) => set("currency", e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c} {sym(c)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Bank Name</label>
          <input
            className={styles.formInput}
            type="text"
            placeholder="e.g. First Bank, Barclays, Chase..."
            value={form.bank_name}
            onChange={(e) => set("bank_name", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Account Number / IBAN</label>
          <input
            className={styles.formInput}
            type="text"
            placeholder="Account or IBAN number"
            value={form.account_number}
            onChange={(e) => set("account_number", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Account Name</label>
          <input
            className={styles.formInput}
            type="text"
            placeholder="Name on the account"
            value={form.account_name}
            onChange={(e) => set("account_name", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Bank Code / Sort Code / Routing (optional)
          </label>
          <input
            className={styles.formInput}
            type="text"
            placeholder="e.g. 011, 20-00-00, 021000021"
            value={form.bank_code}
            onChange={(e) => set("bank_code", e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formFooter}>
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : details
              ? "Update Bank Details"
              : "Save Bank Details"}
        </button>
      </div>
    </div>
  );
}

// ── Main MaidWallet ───────────────────────────────────────────────────────────
export default function AdminMaidWallet({ onBack }) {
  const [activeTab, setActiveTab] = useState("earnings");

  const tabs = [
    { id: "earnings", label: "💰 Earnings" },
    { id: "bank", label: "🏦 Bank Details" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>My Wallet</h1>
          </div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
        </div>

        <div className={styles.tabBar}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "earnings" && <EarningsTab />}
        {activeTab === "bank" && <BankDetailsTab />}
      </div>
    </div>
  );
}
