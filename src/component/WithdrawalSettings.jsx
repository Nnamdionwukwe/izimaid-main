// src/pages/settings/components/WithdrawalSettings.jsx
// Only rendered for users with role === 'maid'
import { useState, useEffect } from "react";
import { useBankDetails } from "../../../hooks/useSettings";
import {
  Section,
  Field,
  Input,
  Select,
  SaveButton,
  Toast,
  Badge,
} from "./SettingsUI";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const METHODS = [
  { value: "bank_transfer", label: "Nigerian Bank / Fintech", flag: "🇳🇬" },
  { value: "wire_transfer", label: "International Wire (SWIFT)", flag: "🌍" },
  { value: "mobile_money", label: "Mobile Money", flag: "📱" },
  { value: "paypal", label: "PayPal", flag: "💙" },
  { value: "wise", label: "Wise (TransferWise)", flag: "💚" },
  { value: "crypto", label: "Cryptocurrency", flag: "₿" },
  { value: "flutterwave", label: "Flutterwave", flag: "🌊" },
];

const MOBILE_PROVIDERS = [
  { value: "mpesa", label: "M-Pesa (Kenya/Tanzania)" },
  { value: "mtn", label: "MTN Mobile Money" },
  { value: "airtel", label: "Airtel Money" },
  { value: "orange", label: "Orange Money" },
  { value: "vodafone", label: "Vodafone Cash" },
];

const CRYPTO_CURRENCIES = [
  { value: "USDT", label: "USDT (Tether)" },
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "USDC", label: "USDC" },
  { value: "BNB", label: "BNB (Binance)" },
];

const CRYPTO_NETWORKS = [
  { value: "TRC20", label: "TRON (TRC20) — Cheapest fees" },
  { value: "ERC20", label: "Ethereum (ERC20)" },
  { value: "BEP20", label: "BNB Smart Chain (BEP20)" },
  { value: "Bitcoin", label: "Bitcoin Network" },
];

export default function WithdrawalSettings() {
  const { details, loading, save } = useBankDetails();
  const [banks, setBanks] = useState([]);
  const [method, setMethod] = useState("bank_transfer");
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(null);
  const [toast, setToast] = useState(null);
  const [init, setInit] = useState(false);

  const [form, setForm] = useState({
    // Bank
    bank_name: "",
    bank_code: "",
    account_number: "",
    account_name: "",
    bank_country: "NG",
    // Wire
    swift_code: "",
    iban: "",
    bank_address: "",
    // Mobile
    mobile_provider: "",
    mobile_number: "",
    mobile_country: "",
    // Crypto
    crypto_currency: "USDT",
    crypto_address: "",
    crypto_network: "TRC20",
    // PayPal
    paypal_email: "",
    // Wise
    wise_email: "",
  });

  // Load NG banks
  useEffect(() => {
    fetch(`${API}/withdrawals/ng-banks`)
      .then((r) => r.json())
      .then((d) => setBanks(d.banks || []));
  }, []);

  // Populate from saved details
  useEffect(() => {
    if (details && !init) {
      setForm((f) => ({
        ...f,
        bank_name: details.bank_name || "",
        bank_code: details.bank_code || "",
        account_number: details.account_number || "",
        account_name: details.account_name || "",
        bank_country: details.country || "NG",
      }));
      setInit(true);
    }
  }, [details, init]);

  // Auto-fill bank name when code is selected
  function handleBankSelect(e) {
    const code = e.target.value;
    const bank = banks.find((b) => b.code === code);
    setForm((f) => ({ ...f, bank_code: code, bank_name: bank?.name || "" }));
    setVerified(null);
  }

  async function verifyAccount() {
    if (!form.account_number || !form.bank_code) {
      setToast({
        message: "Enter account number and select a bank first",
        type: "error",
      });
      return;
    }
    setVerifying(true);
    setVerified(null);
    try {
      const res = await fetch(`${API}/withdrawals/ng-banks/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          account_number: form.account_number,
          bank_code: form.bank_code,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setForm((f) => ({ ...f, account_name: data.account_name }));
      setVerified(data.account_name);
      setToast({
        message: `Account verified: ${data.account_name}`,
        type: "success",
      });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setVerifying(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await save({
        bank_name: form.bank_name,
        bank_code: form.bank_code,
        account_number: form.account_number,
        account_name: form.account_name,
        country: form.bank_country,
        currency: "NGN",
      });
      setToast({ message: "Withdrawal details saved", type: "success" });
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

      {/* Current saved details */}
      {details && (
        <Section title="Saved payout method">
          <div className="ds-saved-method">
            <div className="ds-saved-method-icon">🏦</div>
            <div>
              <div className="ds-saved-method-name">{details.bank_name}</div>
              <div className="ds-hint">
                {details.account_number} · {details.account_name}
              </div>
              {details.verified && <Badge color="green">Verified</Badge>}
            </div>
          </div>
        </Section>
      )}

      {/* Method selector */}
      <Section
        title="Payout method"
        description="How should we send your earnings?"
      >
        <div className="ds-method-grid">
          {METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMethod(m.value)}
              className={`ds-method-card ${method === m.value ? "ds-method-card-active" : ""}`}
            >
              <span className="ds-method-flag">{m.flag}</span>
              <span className="ds-method-label">{m.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Method-specific form */}
      <form onSubmit={handleSubmit}>
        {/* Nigerian bank / fintech */}
        {method === "bank_transfer" && (
          <Section title="Nigerian bank details">
            <div className="ds-form-grid">
              <Field label="Bank / Fintech">
                <Select value={form.bank_code} onChange={handleBankSelect}>
                  <option value="">— Select bank —</option>
                  {banks.filter((b) => b.type === "bank").length > 0 && (
                    <optgroup label="Commercial Banks">
                      {banks
                        .filter((b) => b.type === "bank")
                        .map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {banks.filter((b) => b.type === "fintech").length > 0 && (
                    <optgroup label="Fintechs (OPay, Kuda, Moniepoint…)">
                      {banks
                        .filter((b) => b.type === "fintech")
                        .map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {banks.filter((b) => b.type === "mfb").length > 0 && (
                    <optgroup label="Microfinance Banks">
                      {banks
                        .filter((b) => b.type === "mfb")
                        .map((b) => (
                          <option key={b.code} value={b.code}>
                            {b.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </Select>
              </Field>

              <Field
                label="Account number"
                hint="Enter your 10-digit NUBAN account number"
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <Input
                    value={form.account_number}
                    onChange={(e) => {
                      setForm((f) => ({
                        ...f,
                        account_number: e.target.value,
                      }));
                      setVerified(null);
                    }}
                    placeholder="0000000000"
                    maxLength={10}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="ds-btn-secondary"
                    onClick={verifyAccount}
                    disabled={verifying}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {verifying ? "Checking…" : "Verify"}
                  </button>
                </div>
              </Field>

              <Field label="Account name">
                <Input
                  value={form.account_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, account_name: e.target.value }))
                  }
                  placeholder="Auto-filled after verification"
                  readOnly={!!verified}
                  className={verified ? "ds-input-success" : ""}
                />
                {verified && (
                  <p className="ds-hint" style={{ color: "#16a34a" }}>
                    ✓ Account verified
                  </p>
                )}
              </Field>
            </div>
            <p className="ds-hint" style={{ marginTop: 8 }}>
              Works with GTB, Zenith, Access, UBA, First Bank, OPay, Moniepoint,
              Kuda, PalmPay, and all CBN-licensed banks. For PiggyVest — use
              your linked bank account details.
            </p>
          </Section>
        )}

        {/* Wire transfer */}
        {method === "wire_transfer" && (
          <Section title="International wire details">
            <div className="ds-form-grid">
              <Field label="Bank name">
                <Input
                  value={form.bank_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bank_name: e.target.value }))
                  }
                  placeholder="Guaranty Trust Bank"
                />
              </Field>
              <Field label="Account name">
                <Input
                  value={form.account_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, account_name: e.target.value }))
                  }
                  placeholder="Your full name"
                />
              </Field>
              <Field label="SWIFT / BIC code">
                <Input
                  value={form.swift_code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, swift_code: e.target.value }))
                  }
                  placeholder="e.g. GTBINGLA"
                />
              </Field>
              <Field label="IBAN / Account number">
                <Input
                  value={form.iban}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, iban: e.target.value }))
                  }
                  placeholder="Account or IBAN number"
                />
              </Field>
              <Field label="Bank address" hint="Street, City, Country">
                <Input
                  value={form.bank_address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bank_address: e.target.value }))
                  }
                  placeholder="123 Broad Street, Lagos, Nigeria"
                />
              </Field>
            </div>
            <p className="ds-hint" style={{ marginTop: 8, color: "#f97316" }}>
              ⚠️ Wire transfer fee: ₦12,000 per withdrawal. Processing takes 3–5
              business days.
            </p>
          </Section>
        )}

        {/* Mobile money */}
        {method === "mobile_money" && (
          <Section title="Mobile money details">
            <div className="ds-form-grid">
              <Field label="Provider">
                <Select
                  value={form.mobile_provider}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mobile_provider: e.target.value }))
                  }
                >
                  <option value="">— Select provider —</option>
                  {MOBILE_PROVIDERS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Mobile number"
                hint="Include country code, e.g. +254…"
              >
                <Input
                  value={form.mobile_number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mobile_number: e.target.value }))
                  }
                  placeholder="+254 700 000 000"
                  type="tel"
                />
              </Field>
              <Field label="Country">
                <Input
                  value={form.mobile_country}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mobile_country: e.target.value }))
                  }
                  placeholder="e.g. KE, TZ, GH"
                  maxLength={2}
                />
              </Field>
            </div>
          </Section>
        )}

        {/* Crypto */}
        {method === "crypto" && (
          <Section title="Cryptocurrency wallet">
            <div className="ds-form-grid">
              <Field label="Cryptocurrency">
                <Select
                  value={form.crypto_currency}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, crypto_currency: e.target.value }))
                  }
                >
                  {CRYPTO_CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Network"
                hint="Make sure your wallet supports this network."
              >
                <Select
                  value={form.crypto_network}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, crypto_network: e.target.value }))
                  }
                >
                  {CRYPTO_NETWORKS.map((n) => (
                    <option key={n.value} value={n.value}>
                      {n.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Wallet address"
                hint="Double-check — crypto payments are irreversible."
              >
                <Input
                  value={form.crypto_address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, crypto_address: e.target.value }))
                  }
                  placeholder="0x… or T…"
                />
              </Field>
            </div>
            <p className="ds-hint" style={{ color: "#16a34a" }}>
              ✓ No withdrawal fee for crypto. Gas fees paid by the network. USDT
              on TRC20 is recommended — cheapest and fastest.
            </p>
          </Section>
        )}

        {/* PayPal */}
        {method === "paypal" && (
          <Section title="PayPal details">
            <Field label="PayPal email address">
              <Input
                value={form.paypal_email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, paypal_email: e.target.value }))
                }
                placeholder="you@email.com"
                type="email"
              />
            </Field>
            <p className="ds-hint" style={{ marginTop: 8 }}>
              PayPal withdrawal fee: ₦500 flat. Payments arrive within 1
              business day.
            </p>
          </Section>
        )}

        {/* Wise */}
        {method === "wise" && (
          <Section title="Wise (TransferWise) details">
            <Field label="Wise email address">
              <Input
                value={form.wise_email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, wise_email: e.target.value }))
                }
                placeholder="you@email.com"
                type="email"
              />
            </Field>
            <p className="ds-hint" style={{ marginTop: 8 }}>
              Wise withdrawal fee: ₦250 flat. Supports 80+ currencies in 160+
              countries. Best option for international withdrawals.
            </p>
          </Section>
        )}

        {/* Flutterwave */}
        {method === "flutterwave" && (
          <Section title="Flutterwave bank details">
            <div className="ds-form-grid">
              <Field label="Bank code">
                <Input
                  value={form.bank_code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bank_code: e.target.value }))
                  }
                  placeholder="Bank routing code"
                />
              </Field>
              <Field label="Account number">
                <Input
                  value={form.account_number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, account_number: e.target.value }))
                  }
                  placeholder="Account number"
                />
              </Field>
              <Field label="Account name">
                <Input
                  value={form.account_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, account_name: e.target.value }))
                  }
                  placeholder="Your full name"
                />
              </Field>
            </div>
            <p className="ds-hint" style={{ marginTop: 8 }}>
              Flutterwave covers 34 African countries. Best for Ghana, Rwanda,
              Uganda, Cameroon.
            </p>
          </Section>
        )}

        <div className="ds-form-footer">
          <SaveButton loading={saving}>Save payout details</SaveButton>
        </div>
      </form>
    </div>
  );
}
