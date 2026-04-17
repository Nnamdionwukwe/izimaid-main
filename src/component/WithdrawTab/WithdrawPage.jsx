// src/component/WithdrawPage/WithdrawPage.jsx
//
// Full-page replacement — same pattern as MaidChat.
// In MaidDashboard.jsx:
//
//   const [showWithdraw, setShowWithdraw] = useState(false);
//   if (showWithdraw) return <WithdrawPage token={token} onClose={() => setShowWithdraw(false)} />;
//
// In the Wallet tab, replace the old WithdrawTab with:
//   <WalletOverview token={token} onWithdraw={() => setShowWithdraw(true)} />
//
// Both are exported from this file.

import { useState, useEffect, useCallback } from "react";
import styles from "./WithdrawPage.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API = API_URL.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

// ── Helpers ──────────────────────────────────────────────────────────
function fmt(n, decimals = 2) {
  return Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(d).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Payment methods catalogue ────────────────────────────────────────
const METHODS = [
  {
    id: "bank_transfer",
    label: "Local Bank Transfer",
    icon: "🏦",
    desc: "Nigerian bank accounts via Paystack",
    currencies: ["NGN"],
    feeDesc: "₦200 – ₦750 (tiered)",
    regions: ["NG"],
    fields: ["bank", "account_number", "account_name"],
  },
  {
    id: "flutterwave",
    label: "Flutterwave",
    icon: "🦋",
    desc: "Pan-African bank transfers (20+ countries)",
    currencies: [
      "NGN",
      "KES",
      "GHS",
      "ZAR",
      "UGX",
      "TZS",
      "RWF",
      "XOF",
      "EGP",
      "MAD",
    ],
    feeDesc: "₦200 – ₦750 (tiered)",
    regions: ["NG", "KE", "GH", "ZA", "UG", "TZ", "RW", "CI", "EG", "MA"],
    fields: ["flw_bank", "flw_account_number", "account_name"],
  },
  {
    id: "mobile_money",
    label: "Mobile Money",
    icon: "📱",
    desc: "M-Pesa, MTN MoMo, Airtel, Vodafone",
    currencies: ["KES", "GHS", "UGX", "TZS", "RWF", "XOF", "ZMW"],
    feeDesc: "₦200 – ₦500 (tiered)",
    regions: ["KE", "GH", "UG", "TZ", "RW", "CI", "ZM"],
    fields: ["mobile_provider", "mobile_number", "mobile_country"],
  },
  {
    id: "wire_transfer",
    label: "International Wire (SWIFT)",
    icon: "🌍",
    desc: "Send to any bank worldwide via SWIFT",
    currencies: ["USD", "GBP", "EUR", "CAD", "AUD", "SGD", "JPY", "CNY"],
    feeDesc: "Flat $15 / £12 / €14",
    regions: ["GLOBAL"],
    fields: ["swift_code", "iban", "account_name", "bank_address"],
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: "🅿️",
    desc: "Fast transfer to any PayPal account",
    currencies: ["USD", "GBP", "EUR", "CAD", "AUD"],
    feeDesc: "Flat $2 / £1.50 / €1.80",
    regions: ["GLOBAL"],
    fields: ["paypal_email"],
  },
  {
    id: "wise",
    label: "Wise (TransferWise)",
    icon: "💚",
    desc: "Cheapest international transfers",
    currencies: ["USD", "GBP", "EUR", "CAD", "AUD", "SGD", "MYR", "BRL", "MXN"],
    feeDesc: "Flat $1 / £0.80 / €0.90",
    regions: ["GLOBAL"],
    fields: ["wise_email"],
  },
  {
    id: "crypto",
    label: "Cryptocurrency",
    icon: "₿",
    desc: "BTC, ETH, USDT, BNB, SOL & more",
    currencies: ["BTC", "ETH", "USDT", "USDC", "BNB", "SOL", "TRX", "MATIC"],
    feeDesc: "No fee (network gas only)",
    regions: ["GLOBAL"],
    fields: ["crypto_currency", "crypto_network", "crypto_address"],
  },
];

const MOBILE_PROVIDERS = {
  KE: ["M-Pesa (Safaricom)", "Airtel Kenya"],
  GH: ["MTN MoMo Ghana", "Vodafone Cash", "AirtelTigo"],
  UG: ["MTN MoMo Uganda", "Airtel Uganda"],
  TZ: ["M-Pesa Tanzania", "Tigo Pesa", "Airtel Tanzania", "Halotel"],
  RW: ["MTN MoMo Rwanda", "Airtel Rwanda"],
  CI: ["MTN MoMo Côte d'Ivoire", "Orange Money", "Moov"],
  ZM: ["MTN MoMo Zambia", "Airtel Zambia"],
};

const CRYPTO_NETWORKS = {
  BTC: ["Bitcoin (BTC)"],
  ETH: ["Ethereum (ERC-20)", "Arbitrum", "Optimism", "Base"],
  USDT: [
    "Ethereum (ERC-20)",
    "Tron (TRC-20)",
    "BNB Smart Chain (BEP-20)",
    "Solana",
  ],
  USDC: ["Ethereum (ERC-20)", "Solana", "Arbitrum", "Base"],
  BNB: ["BNB Smart Chain (BEP-20)"],
  SOL: ["Solana"],
  TRX: ["Tron (TRC-20)"],
  MATIC: ["Polygon"],
};

const COUNTRIES = [
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "UG", name: "Uganda" },
  { code: "TZ", name: "Tanzania" },
  { code: "RW", name: "Rwanda" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "ZM", name: "Zambia" },
];

const STATUS_CFG = {
  pending: { label: "Pending", color: "#b57b00", bg: "#fff8e1" },
  processing: { label: "Processing", color: "#1565c0", bg: "#e3f2fd" },
  paid: { label: "Paid ✓", color: "#1b5e20", bg: "#e8f5e9" },
  completed: { label: "Paid ✓", color: "#1b5e20", bg: "#e8f5e9" },
  failed: { label: "Failed", color: "#b71c1c", bg: "#ffebee" },
  cancelled: { label: "Cancelled", color: "#555", bg: "#f5f5f5" },
  rejected: { label: "Rejected", color: "#b71c1c", bg: "#ffebee" },
};

// ══════════════════════════════════════════════════════════════════════
// WalletOverview — sits inside the Wallet tab of MaidDashboard
// ══════════════════════════════════════════════════════════════════════
export function WalletOverview({ token, onWithdraw }) {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [innerView, setInnerView] = useState("overview");

  useEffect(() => {
    async function load() {
      try {
        const [wR, wdR, hR] = await Promise.all([
          fetch(`${API}/withdrawals/wallet`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/withdrawals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/withdrawals/wallet/history?limit=30`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [wD, wdD, hD] = await Promise.all([
          wR.json(),
          wdR.json(),
          hR.json(),
        ]);
        if (wR.ok) setWallet(wD.wallet);
        if (wdR.ok) setWithdrawals(wdD.withdrawals || []);
        if (hR.ok) setHistory(hD.transactions || hD.history || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, [token]);

  async function cancelWithdrawal(id) {
    await fetch(`${API}/withdrawals/${id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "cancelled" } : w)),
    );
  }

  if (loading)
    return (
      <div className={styles.ov_loading}>
        <div className={styles.spinner} />
        <p>Loading wallet…</p>
      </div>
    );

  return (
    <div className={styles.ov_wrap}>
      {/* Balance card */}
      <div className={styles.ov_card}>
        <div className={styles.ov_card_bg} />
        <p className={styles.ov_card_label}>Available Balance</p>
        <p className={styles.ov_card_balance}>
          <span>₦</span>
          {fmt(wallet?.available || wallet?.available_balance || 0)}
        </p>
        <div className={styles.ov_card_stats}>
          <div>
            <span>Earned</span>
            <strong>₦{fmt(wallet?.total_earned || 0)}</strong>
          </div>
          <div className={styles.ov_divider} />
          <div>
            <span>Pending</span>
            <strong>
              ₦{fmt(wallet?.pending || wallet?.pending_balance || 0)}
            </strong>
          </div>
          <div className={styles.ov_divider} />
          <div>
            <span>Withdrawn</span>
            <strong>₦{fmt(wallet?.total_withdrawn || 0)}</strong>
          </div>
        </div>
        <button
          className={styles.ov_withdrawBtn}
          onClick={onWithdraw}
          disabled={
            Number(wallet?.available || wallet?.available_balance || 0) <= 0
          }
        >
          💸 Withdraw Funds
        </button>
      </div>

      {/* Inner nav */}
      <div className={styles.ov_nav}>
        {[
          ["requests", "Requests"],
          ["history", "History"],
        ].map(([v, l]) => (
          <button
            key={v}
            className={`${styles.ov_navBtn} ${innerView === v ? styles.ov_navBtnActive : ""}`}
            onClick={() => setInnerView(v)}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Requests */}
      {innerView === "requests" &&
        (withdrawals.length === 0 ? (
          <div className={styles.ov_empty}>📭 No withdrawal requests yet.</div>
        ) : (
          withdrawals.map((w) => {
            const cfg = STATUS_CFG[w.status] || STATUS_CFG.pending;
            return (
              <div key={w.id} className={styles.ov_wdCard}>
                <div className={styles.ov_wdRow}>
                  <div>
                    <p className={styles.ov_wdAmt}>₦{fmt(w.amount)}</p>
                    <p className={styles.ov_wdMeta}>
                      {w.method?.replace(/_/g, " ")} · {timeAgo(w.created_at)}
                    </p>
                  </div>
                  <span
                    className={styles.ov_badge}
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>
                {w.failure_reason && (
                  <p className={styles.ov_fail}>❌ {w.failure_reason}</p>
                )}
                {w.status === "pending" && (
                  <button
                    className={styles.ov_cancelBtn}
                    onClick={() => cancelWithdrawal(w.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            );
          })
        ))}

      {/* History */}
      {innerView === "history" &&
        (history.length === 0 ? (
          <div className={styles.ov_empty}>📊 No transactions yet.</div>
        ) : (
          history.map((tx, i) => {
            const isCredit = tx.type === "credit" || Number(tx.amount) > 0;
            return (
              <div key={tx.id || i} className={styles.ov_txRow}>
                <div className={styles.ov_txIcon}>{isCredit ? "💰" : "📤"}</div>
                <div className={styles.ov_txInfo}>
                  <p>{tx.description || tx.type}</p>
                  <span>{timeAgo(tx.created_at)}</span>
                </div>
                <p className={isCredit ? styles.ov_credit : styles.ov_debit}>
                  {isCredit ? "+" : "−"}₦{fmt(Math.abs(tx.amount))}
                </p>
              </div>
            );
          })
        ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// WithdrawPage — full-page overlay, same pattern as MaidChat
// ══════════════════════════════════════════════════════════════════════
export default function WithdrawPage({ token, onClose }) {
  const [wallet, setWallet] = useState(null);
  const [banks, setBanks] = useState([]);
  const [step, setStep] = useState("method"); // method → form → pin → done
  const [method, setMethod] = useState(null);
  const [fields, setFields] = useState({});
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [manualAccName, setManualAccName] = useState(false);

  useEffect(() => {
    fetch(`${API}/withdrawals/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.wallet) setWallet(d.wallet);
      })
      .catch(() => {});
    fetch(`${API}/withdrawals/ng-banks`)
      .then((r) => r.json())
      .then((d) => setBanks(d.banks || []))
      .catch(() => {});
  }, [token]);

  const available = Number(wallet?.available || wallet?.available_balance || 0);
  const m = METHODS.find((x) => x.id === method);

  function setField(k, v) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  // ── Auto-detect fintech by code or name ──────────────────────────
  function isFintechCode(code = "") {
    const FINTECH = new Set([
      "999992",
      "999991",
      "100004",
      "090405",
      "090110",
      "100002",
      "100003",
      "999995",
      "090317",
      "090259",
      "090267",
      "090189",
      "090318",
      "090363",
      "090084",
      "090325",
      "000017",
      "090270",
      "090133",
      "090253",
      "090272",
      "090386",
    ]);
    return FINTECH.has(code);
  }
  function isFintechName(name = "") {
    return /opay|palmpay|kuda|carbon|fairmoney|rubies|vfd|mint|eyowo|chipper|moniepoint|sparkle|brass/i.test(
      name,
    );
  }

  // ── Verify NG bank account ────────────────────────────────────────
  async function handleVerify() {
    if (
      !fields.bank_code ||
      String(fields.account_number || "").length !== 10
    ) {
      setMsg({
        type: "error",
        text: "Enter a 10-digit account number and select a bank",
      });
      return;
    }

    // Skip Paystack verify for known fintechs
    const bankInfo = banks.find((b) => b.code === fields.bank_code);
    if (
      isFintechCode(fields.bank_code) ||
      isFintechName(bankInfo?.name || "")
    ) {
      setManualAccName(true);
      setMsg({
        type: "info",
        text: `Enter your name as it appears on your ${bankInfo?.name || "account"}.`,
      });
      return;
    }

    setVerifying(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API}/withdrawals/ng-banks/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bank_code: fields.bank_code,
          account_number: fields.account_number,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Graceful fallback — Paystack can't verify this bank
        setManualAccName(true);
        setMsg({
          type: "warning",
          text: "Auto-verify unavailable. Enter your account name manually.",
        });
        return;
      }
      setField("account_name", data.account_name);
      setMsg({ type: "success", text: `✅ ${data.account_name}` });
    } catch {
      setManualAccName(true);
      setMsg({
        type: "warning",
        text: "Verification failed. Enter your account name manually.",
      });
    } finally {
      setVerifying(false);
    }
  }

  // ── Submit withdrawal ─────────────────────────────────────────────
  async function handleSubmit() {
    const amt = Number(amount);
    if (!amt || amt < 100) {
      setMsg({
        type: "error",
        text: "Minimum withdrawal is equivalent of ₦100",
      });
      return;
    }
    if (amt > available) {
      setMsg({ type: "error", text: "Amount exceeds available balance" });
      return;
    }
    if (pin.length < 4) {
      setMsg({ type: "error", text: "Enter your 4-6 digit transaction PIN" });
      return;
    }

    // Validate method fields
    const required = {
      bank_transfer: () =>
        fields.bank_code && fields.account_number && fields.account_name,
      flutterwave: () =>
        fields.flw_account_bank &&
        fields.flw_account_number &&
        fields.account_name,
      mobile_money: () =>
        fields.mobile_provider && fields.mobile_number && fields.mobile_country,
      wire_transfer: () =>
        (fields.swift_code || fields.iban) && fields.account_name,
      paypal: () => fields.paypal_email?.includes("@"),
      wise: () => fields.wise_email?.includes("@"),
      crypto: () =>
        fields.crypto_currency &&
        fields.crypto_network &&
        fields.crypto_address,
    };
    if (!required[method]?.()) {
      setMsg({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const payload = {
        amount: amt,
        currency: fields.currency || "NGN",
        method,
        transaction_pin: pin,
        ...fields,
      };
      const res = await fetch(`${API}/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Withdrawal failed");
      setStep("done");
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  // ── Render helper: method-specific fields ─────────────────────────
  function renderFields() {
    if (!method) return null;

    if (method === "bank_transfer")
      return (
        <>
          <div className={styles.field}>
            <label>Bank</label>
            <select
              value={fields.bank_code || ""}
              onChange={(e) => {
                const b = banks.find((x) => x.code === e.target.value);
                setField("bank_code", e.target.value);
                setField("bank_name", b?.name || "");
                setField("account_name", "");
                setManualAccName(
                  isFintechCode(e.target.value) || isFintechName(b?.name || ""),
                );
                setMsg({ type: "", text: "" });
              }}
            >
              <option value="">Select bank…</option>
              {banks.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Account Number</label>
            <div className={styles.inlineRow}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="10 digits"
                value={fields.account_number || ""}
                onChange={(e) => {
                  setField("account_number", e.target.value.replace(/\D/g, ""));
                  setField("account_name", "");
                  setMsg({ type: "", text: "" });
                }}
              />
              {!manualAccName && (
                <button
                  className={styles.verifyBtn}
                  onClick={handleVerify}
                  disabled={
                    verifying ||
                    (fields.account_number || "").length !== 10 ||
                    !fields.bank_code
                  }
                >
                  {verifying ? "…" : "Verify"}
                </button>
              )}
            </div>
          </div>
          {manualAccName && (
            <div className={styles.field}>
              <label>
                Account Name <span className={styles.manualTag}>manual</span>
              </label>
              <input
                type="text"
                placeholder="Your name on the account"
                value={fields.account_name || ""}
                onChange={(e) => setField("account_name", e.target.value)}
              />
              <p className={styles.hint}>
                Enter your name exactly as it appears on the account.
              </p>
            </div>
          )}
          {!manualAccName && fields.account_name && (
            <div className={styles.verifiedBadge}>✅ {fields.account_name}</div>
          )}
        </>
      );

    if (method === "flutterwave")
      return (
        <>
          <div className={styles.field}>
            <label>Bank Code</label>
            <input
              type="text"
              placeholder="e.g. 058"
              value={fields.flw_account_bank || ""}
              onChange={(e) => setField("flw_account_bank", e.target.value)}
            />
            <p className={styles.hint}>
              Find your bank code at flutterwave.com/docs/banks
            </p>
          </div>
          <div className={styles.field}>
            <label>Account Number</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Account number"
              value={fields.flw_account_number || ""}
              onChange={(e) => setField("flw_account_number", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Account Name</label>
            <input
              type="text"
              placeholder="Name on account"
              value={fields.account_name || ""}
              onChange={(e) => setField("account_name", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Currency</label>
            <select
              value={fields.currency || "NGN"}
              onChange={(e) => setField("currency", e.target.value)}
            >
              {[
                "NGN",
                "KES",
                "GHS",
                "ZAR",
                "UGX",
                "TZS",
                "RWF",
                "XOF",
                "EGP",
                "MAD",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </>
      );

    if (method === "mobile_money")
      return (
        <>
          <div className={styles.field}>
            <label>Country</label>
            <select
              value={fields.mobile_country || ""}
              onChange={(e) => {
                setField("mobile_country", e.target.value);
                setField("mobile_provider", "");
              }}
            >
              <option value="">Select country…</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {fields.mobile_country && (
            <div className={styles.field}>
              <label>Provider</label>
              <select
                value={fields.mobile_provider || ""}
                onChange={(e) => setField("mobile_provider", e.target.value)}
              >
                <option value="">Select provider…</option>
                {(MOBILE_PROVIDERS[fields.mobile_country] || []).map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.field}>
            <label>Mobile Number</label>
            <input
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={fields.mobile_number || ""}
              onChange={(e) => setField("mobile_number", e.target.value)}
            />
          </div>
        </>
      );

    if (method === "wire_transfer")
      return (
        <>
          <div className={styles.field}>
            <label>SWIFT / BIC Code</label>
            <input
              type="text"
              placeholder="e.g. BARCGB22"
              value={fields.swift_code || ""}
              onChange={(e) =>
                setField("swift_code", e.target.value.toUpperCase())
              }
            />
          </div>
          <div className={styles.field}>
            <label>
              IBAN <span className={styles.optionalTag}>(if applicable)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. GB29NWBK60161331926819"
              value={fields.iban || ""}
              onChange={(e) => setField("iban", e.target.value.toUpperCase())}
            />
          </div>
          <div className={styles.field}>
            <label>Beneficiary Name</label>
            <input
              type="text"
              placeholder="Full legal name"
              value={fields.account_name || ""}
              onChange={(e) => setField("account_name", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>
              Bank Address{" "}
              <span className={styles.optionalTag}>(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Bank name and address"
              value={fields.bank_address || ""}
              onChange={(e) => setField("bank_address", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Currency</label>
            <select
              value={fields.currency || "USD"}
              onChange={(e) => setField("currency", e.target.value)}
            >
              {["USD", "GBP", "EUR", "CAD", "AUD", "SGD", "JPY", "CNY"].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </div>
        </>
      );

    if (method === "paypal")
      return (
        <>
          <div className={styles.field}>
            <label>PayPal Email</label>
            <input
              type="email"
              placeholder="your@paypal.com"
              value={fields.paypal_email || ""}
              onChange={(e) => setField("paypal_email", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Currency</label>
            <select
              value={fields.currency || "USD"}
              onChange={(e) => setField("currency", e.target.value)}
            >
              {["USD", "GBP", "EUR", "CAD", "AUD"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </>
      );

    if (method === "wise")
      return (
        <>
          <div className={styles.field}>
            <label>Wise Email</label>
            <input
              type="email"
              placeholder="your@wise.com"
              value={fields.wise_email || ""}
              onChange={(e) => setField("wise_email", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Currency</label>
            <select
              value={fields.currency || "USD"}
              onChange={(e) => setField("currency", e.target.value)}
            >
              {[
                "USD",
                "GBP",
                "EUR",
                "CAD",
                "AUD",
                "SGD",
                "MYR",
                "BRL",
                "MXN",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </>
      );

    if (method === "crypto")
      return (
        <>
          <div className={styles.field}>
            <label>Cryptocurrency</label>
            <select
              value={fields.crypto_currency || ""}
              onChange={(e) => {
                setField("crypto_currency", e.target.value);
                setField("crypto_network", "");
              }}
            >
              <option value="">Select coin…</option>
              {Object.keys(CRYPTO_NETWORKS).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          {fields.crypto_currency && (
            <div className={styles.field}>
              <label>Network</label>
              <select
                value={fields.crypto_network || ""}
                onChange={(e) => setField("crypto_network", e.target.value)}
              >
                <option value="">Select network…</option>
                {(CRYPTO_NETWORKS[fields.crypto_currency] || []).map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
          )}
          {fields.crypto_network && (
            <div className={styles.field}>
              <label>Wallet Address</label>
              <input
                type="text"
                placeholder="0x… or bc1…"
                value={fields.crypto_address || ""}
                onChange={(e) => setField("crypto_address", e.target.value)}
              />
              <p className={styles.hint}>
                ⚠️ Double-check the address. Wrong address = lost funds.
              </p>
            </div>
          )}
        </>
      );
  }

  // ── Step: method picker ──────────────────────────────────────────
  if (step === "method")
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={onClose}>
            ← Back
          </button>
          <h1 className={styles.pageTitle}>Withdraw Funds</h1>
          <div className={styles.balancePill}>₦{fmt(available)} available</div>
        </div>

        <div className={styles.pageBody}>
          <p className={styles.stepLabel}>Choose how to receive your money</p>
          <div className={styles.methodGrid}>
            {METHODS.map((m) => (
              <button
                key={m.id}
                className={styles.methodCard}
                onClick={() => {
                  setMethod(m.id);
                  setStep("form");
                  setMsg({ type: "", text: "" });
                  setFields({});
                  setManualAccName(false);
                }}
              >
                <span className={styles.methodIcon}>{m.icon}</span>
                <div className={styles.methodInfo}>
                  <p className={styles.methodName}>{m.label}</p>
                  <p className={styles.methodDesc}>{m.desc}</p>
                </div>
                <div className={styles.methodRight}>
                  <span className={styles.methodFee}>{m.feeDesc}</span>
                  <span className={styles.methodArrow}>›</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  // ── Step: form ───────────────────────────────────────────────────
  if (step === "form")
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <button
            className={styles.backBtn}
            onClick={() => {
              setStep("method");
              setMsg({ type: "", text: "" });
            }}
          >
            ← Back
          </button>
          <h1 className={styles.pageTitle}>
            {m?.icon} {m?.label}
          </h1>
          <div className={styles.balancePill}>₦{fmt(available)}</div>
        </div>

        <div className={styles.pageBody}>
          {/* Fee info banner */}
          <div className={styles.feeBanner}>
            <span>
              💡 Fee: <strong>{m?.feeDesc}</strong>
            </span>
            <span className={styles.feeCurrencies}>
              {m?.currencies.join(" · ")}
            </span>
          </div>

          {msg.text && (
            <div className={`${styles.alert} ${styles["alert_" + msg.type]}`}>
              {msg.text}
            </div>
          )}

          <div className={styles.formCard}>
            <p className={styles.formCardTitle}>Payment details</p>
            {renderFields()}
          </div>

          <div className={styles.formCard} style={{ marginTop: 12 }}>
            <p className={styles.formCardTitle}>Amount</p>
            <div className={styles.field}>
              <label>Amount ({fields.currency || "NGN"})</label>
              <div className={styles.inlineRow}>
                <input
                  type="number"
                  placeholder="0.00"
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  className={styles.maxBtn}
                  onClick={() => setAmount(String(available))}
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          <button
            className={styles.nextBtn}
            onClick={() => {
              if (!amount || Number(amount) < 100) {
                setMsg({ type: "error", text: "Enter a valid amount" });
                return;
              }
              setMsg({ type: "", text: "" });
              setStep("pin");
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    );

  // ── Step: PIN ────────────────────────────────────────────────────
  if (step === "pin")
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <button className={styles.backBtn} onClick={() => setStep("form")}>
            ← Back
          </button>
          <h1 className={styles.pageTitle}>Confirm PIN</h1>
          <div className={styles.balancePill}>₦{fmt(Number(amount))}</div>
        </div>

        <div className={styles.pageBody}>
          <div className={styles.pinCard}>
            <div className={styles.pinSummary}>
              <p className={styles.pinAmt}>₦{fmt(Number(amount))}</p>
              <p className={styles.pinMethod}>
                {m?.icon} {m?.label}
              </p>
              {method === "bank_transfer" && (
                <p className={styles.pinDest}>
                  {fields.account_name} · {fields.bank_name}
                </p>
              )}
              {method === "paypal" && (
                <p className={styles.pinDest}>{fields.paypal_email}</p>
              )}
              {method === "wise" && (
                <p className={styles.pinDest}>{fields.wise_email}</p>
              )}
              {method === "crypto" && (
                <p className={styles.pinDest}>
                  {fields.crypto_currency} · {fields.crypto_network}
                </p>
              )}
              {method === "wire_transfer" && (
                <p className={styles.pinDest}>
                  {fields.account_name} · SWIFT {fields.swift_code}
                </p>
              )}
              {method === "mobile_money" && (
                <p className={styles.pinDest}>
                  {fields.mobile_provider} · {fields.mobile_number}
                </p>
              )}
            </div>

            {msg.text && (
              <div className={`${styles.alert} ${styles["alert_" + msg.type]}`}>
                {msg.text}
              </div>
            )}

            <div className={styles.field}>
              <label>Transaction PIN</label>
              <input
                className={styles.pinInput}
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="● ● ● ●"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
              <p className={styles.hint}>
                Enter the PIN you set in Settings to authorise this withdrawal.
              </p>
            </div>

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={saving || pin.length < 4}
            >
              {saving ? "Processing…" : "Confirm Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    );

  // ── Step: done ───────────────────────────────────────────────────
  if (step === "done")
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div />
          <h1 className={styles.pageTitle}>Done</h1>
          <div />
        </div>
        <div className={styles.pageBody}>
          <div className={styles.doneCard}>
            <div className={styles.doneIcon}>🎉</div>
            <h2>Request Submitted!</h2>
            <p>
              Your withdrawal of <strong>₦{fmt(Number(amount))}</strong> via{" "}
              <strong>{m?.label}</strong> has been submitted and is under
              review.
            </p>
            <p className={styles.doneEta}>
              Processing time: <strong>1–3 business days</strong>
            </p>
            <button className={styles.doneBtn} onClick={onClose}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
}
