// src/component/WithdrawTab/WithdrawTab.jsx
// Drop into MaidDashboard tabs:
//   ["withdraw", "Withdraw"]  ← add to the tabs array
//   {tab === "withdraw" && <WithdrawTab token={token} />}

import { useState, useEffect, useCallback } from "react";
import styles from "./WithdrawTab.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API = API_URL.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

// ── Helpers ──────────────────────────────────────────────────────────
function fmt(n) {
  return Number(n || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// In BankSetupForm, add this constant near the top of the component:
const FINTECH_CODES = [
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
];
// OPay=999992, PalmPay=999991, Kuda=090267, etc.
// Add a broader check — if bank name contains these words, skip Paystack verify:
const isFintechBank = (name = "") =>
  /opay|palmpay|kuda|carbon|fairmoney|rubies|vfd|mint|eyowo|chipper/i.test(
    name,
  );

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#b57b00", bg: "#fff8e1" },
  processing: { label: "Processing", color: "#1565c0", bg: "#e3f2fd" },
  completed: { label: "Paid", color: "#1b5e20", bg: "#e8f5e9" },
  failed: { label: "Failed", color: "#b71c1c", bg: "#ffebee" },
  cancelled: { label: "Cancelled", color: "#555", bg: "#f5f5f5" },
};

const TX_ICONS = {
  credit: "💰",
  debit: "📤",
  booking: "📋",
  withdrawal: "🏦",
  refund: "↩️",
  bonus: "🎁",
};

// ── Sub-component: Wallet card ────────────────────────────────────────
function WalletCard({ wallet, onWithdraw }) {
  return (
    <div className={styles.walletCard}>
      <div className={styles.walletTop}>
        <div>
          <p className={styles.walletLabel}>Available Balance</p>
          <p className={styles.walletBalance}>
            <span className={styles.walletCurrency}>₦</span>
            {fmt(wallet.available_balance)}
          </p>
        </div>
        <div className={styles.walletIcon}>🏦</div>
      </div>
      <div className={styles.walletMeta}>
        <div className={styles.walletMetaItem}>
          <span className={styles.walletMetaLabel}>Total Earned</span>
          <span className={styles.walletMetaValue}>
            ₦{fmt(wallet.total_earned)}
          </span>
        </div>
        <div className={styles.walletMetaDivider} />
        <div className={styles.walletMetaItem}>
          <span className={styles.walletMetaLabel}>Pending</span>
          <span className={styles.walletMetaValue}>
            ₦{fmt(wallet.pending_balance)}
          </span>
        </div>
        <div className={styles.walletMetaDivider} />
        <div className={styles.walletMetaItem}>
          <span className={styles.walletMetaLabel}>Withdrawn</span>
          <span className={styles.walletMetaValue}>
            ₦{fmt(wallet.total_withdrawn)}
          </span>
        </div>
      </div>
      <button
        className={styles.withdrawTriggerBtn}
        onClick={onWithdraw}
        disabled={Number(wallet.available_balance) <= 0}
      >
        💸 Withdraw Funds
      </button>
    </div>
  );
}

// ── Sub-component: Bank preference form ──────────────────────────────
function BankSetupForm({ token, preference, onSaved }) {
  const [banks, setBanks] = useState([]);
  const [bankCode, setBankCode] = useState(preference?.bank_code || "");
  const [bankName, setBankName] = useState(preference?.bank_name || "");
  const [accountNo, setAccountNo] = useState(preference?.account_number || "");
  const [accountName, setAccountName] = useState(
    preference?.account_name || "",
  );
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [verified, setVerified] = useState(!!preference?.account_name);
  const [manualEntry, setManualEntry] = useState(false);

  // Codes AND name patterns that Paystack can't verify
  const UNVERIFIABLE_CODES = new Set([
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
  ]);

  const isManualBank = (code = "", name = "") =>
    UNVERIFIABLE_CODES.has(code) ||
    /opay|palmpay|kuda|carbon|fairmoney|rubies|vfd|mint|eyowo|chipper|moniepoint|sparkle|brass|piggyvest|cowrywise|wallet africa/i.test(
      name,
    );

  useEffect(() => {
    fetch(`${API}/withdrawals/ng-banks`)
      .then((r) => r.json())
      .then((d) => {
        setBanks(d.banks || []);
        // If preference already has a bank, check if it needs manual entry
        if (preference?.bank_code) {
          const b = (d.banks || []).find(
            (b) => b.code === preference.bank_code,
          );
          setManualEntry(isManualBank(preference.bank_code, b?.name || ""));
        }
      })
      .catch(() => {});
  }, []);

  function handleBankChange(e) {
    const b = banks.find((b) => b.code === e.target.value);
    setBankCode(e.target.value);
    setBankName(b?.name || "");
    setVerified(false);
    setAccountName("");
    setMsg({ type: "", text: "" });
    setManualEntry(isManualBank(e.target.value, b?.name || ""));
  }

  async function handleVerify() {
    if (!bankCode || accountNo.length !== 10) {
      setMsg({
        type: "error",
        text: "Select a bank and enter a 10-digit account number",
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
          bank_code: bankCode,
          account_number: accountNo,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Paystack can't verify this bank — fall back to manual entry
        setManualEntry(true);
        setMsg({
          type: "warning",
          text: `⚠️ Auto-verify unavailable for ${bankName}. Enter your account name manually.`,
        });
        return;
      }
      setAccountName(data.account_name);
      setVerified(true);
      setMsg({ type: "success", text: `✅ Verified: ${data.account_name}` });
    } catch {
      setManualEntry(true);
      setMsg({
        type: "warning",
        text: "Auto-verify failed. Enter your account name manually.",
      });
    } finally {
      setVerifying(false);
    }
  }

  function handleManualConfirm() {
    if (!accountName.trim() || accountNo.length !== 10) {
      setMsg({ type: "error", text: "Fill in account number and name" });
      return;
    }
    setVerified(true);
    setMsg({ type: "success", text: `✅ Ready: ${accountName.trim()}` });
  }

  async function handleSave() {
    if (!verified) {
      setMsg({ type: "error", text: "Confirm your account details first" });
      return;
    }
    if (!bankCode || !accountNo || !accountName) {
      setMsg({ type: "error", text: "All fields are required" });
      return;
    }
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API}/withdrawals/preference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method: "bank_transfer",
          bank_code: bankCode,
          bank_name: bankName,
          account_number: accountNo,
          account_name: accountName.trim(),
          bank_country: "NG",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMsg({ type: "success", text: "✅ Bank account saved!" });
      // Pass back the saved preference so parent re-renders the saved bank display
      onSaved?.({
        bank_code: bankCode,
        bank_name: bankName,
        account_number: accountNo,
        account_name: accountName.trim(),
      });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.bankForm}>
      <p className={styles.sectionSubtitle}>Where should we send your money?</p>

      {msg.text && (
        <div className={`${styles.msg} ${styles[msg.type + "Msg"]}`}>
          {msg.text}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Bank</label>
        <select
          className={styles.input}
          value={bankCode}
          onChange={handleBankChange}
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
        <label className={styles.label}>Account Number</label>
        <div className={styles.verifyRow}>
          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit account number"
            value={accountNo}
            onChange={(e) => {
              setAccountNo(e.target.value.replace(/\D/g, ""));
              setVerified(false);
              setAccountName("");
            }}
          />
          {!manualEntry && (
            <button
              className={styles.verifyBtn}
              onClick={handleVerify}
              disabled={verifying || accountNo.length !== 10 || !bankCode}
            >
              {verifying ? "Checking…" : "Verify"}
            </button>
          )}
        </div>
      </div>

      {/* Manual name field — shown for fintechs or when auto-verify fails */}
      {manualEntry && (
        <div className={styles.field}>
          <label className={styles.label}>Account Name</label>
          <div className={styles.verifyRow}>
            <input
              className={styles.input}
              type="text"
              placeholder="As it appears on your account"
              value={accountName}
              onChange={(e) => {
                setAccountName(e.target.value);
                setVerified(false);
              }}
            />
            <button
              className={styles.verifyBtn}
              onClick={handleManualConfirm}
              disabled={!accountName.trim() || accountNo.length !== 10}
            >
              Confirm
            </button>
          </div>
          <p style={{ fontSize: 11, color: "gray", margin: "4px 0 0" }}>
            ℹ️ Enter your name exactly as it appears on your{" "}
            {bankName || "account"}.
          </p>
        </div>
      )}

      {/* Badge for auto-verified name */}
      {!manualEntry && accountName && (
        <div className={styles.accountNameBadge}>✅ {accountName}</div>
      )}

      <button
        className={styles.saveBtn}
        onClick={handleSave}
        disabled={!verified || saving}
      >
        {saving ? "Saving…" : "Save Bank Account"}
      </button>
    </div>
  );
}

// ── Sub-component: Withdrawal request modal ───────────────────────────
function WithdrawModal({ token, wallet, preference, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const max = Number(wallet?.available_balance || 0);

  async function handleSubmit() {
    const amt = Number(amount);
    if (!amt || amt < 100) {
      setMsg({ type: "error", text: "Minimum withdrawal is ₦100" });
      return;
    }
    if (amt > max) {
      setMsg({ type: "error", text: "Amount exceeds available balance" });
      return;
    }
    if (pin.length < 4) {
      setMsg({ type: "error", text: "Enter your 4-digit PIN" });
      return;
    }
    if (!preference?.account_number) {
      setMsg({ type: "error", text: "Set up your bank account first" });
      return;
    }

    setLoading(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API}/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amt, transaction_pin: pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Withdrawal failed");
      onSuccess?.();
      onClose();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />
        <h2 className={styles.modalTitle}>Withdraw Funds</h2>

        {preference?.account_number ? (
          <div className={styles.bankBadge}>
            <span className={styles.bankBadgeIcon}>🏦</span>
            <div>
              <p className={styles.bankBadgeName}>{preference.account_name}</p>
              <p className={styles.bankBadgeMeta}>
                {preference.bank_name} · {preference.account_number}
              </p>
            </div>
          </div>
        ) : (
          <div className={`${styles.msg} ${styles.warningMsg}`}>
            ⚠️ No bank account saved. Set one up in the Bank Account section
            below.
          </div>
        )}

        <div className={styles.balanceLine}>
          Available: <strong>₦{fmt(max)}</strong>
        </div>

        {msg.text && (
          <div className={`${styles.msg} ${styles[msg.type + "Msg"]}`}>
            {msg.text}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Amount (₦)</label>
          <div className={styles.amountRow}>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 5000"
              min="100"
              max={max}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              className={styles.maxBtn}
              onClick={() => setAmount(String(max))}
            >
              Max
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Transaction PIN</label>
          <input
            className={`${styles.input} ${styles.pinInput}`}
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter your PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.confirmBtn}
            onClick={handleSubmit}
            disabled={loading || !amount || !pin || !preference?.account_number}
          >
            {loading
              ? "Processing…"
              : `Withdraw ₦${amount ? fmt(amount) : "0.00"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main WithdrawTab ──────────────────────────────────────────────────
export default function WithdrawTab({ token }) {
  const [wallet, setWallet] = useState(null);
  const [preference, setPreference] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("overview"); // "overview" | "bank" | "history"
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    try {
      const [wRes, wdRes, hRes] = await Promise.all([
        fetch(`${API}/withdrawals/wallet`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/withdrawals`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/withdrawals/wallet/history?limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const [wData, wdData, hData] = await Promise.all([
        wRes.json(),
        wdRes.json(),
        hRes.json(),
      ]);
      if (wRes.ok) {
        setWallet(wData.wallet);
        setPreference(wData.preference || null);
      }
      if (wdRes.ok) setWithdrawals(wdData.withdrawals || []);
      if (hRes.ok) setHistory(hData.history || []);
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCancel(id) {
    try {
      await fetch(`${API}/withdrawals/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch {}
  }

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
        <p>Loading wallet…</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {/* ── Inner nav ───────────────────────────────────────── */}
      <div className={styles.innerNav}>
        {[
          ["overview", "💼 Overview"],
          ["bank", "🏦 Bank Account"],
          ["history", "📊 History"],
        ].map(([v, label]) => (
          <button
            key={v}
            className={`${styles.innerNavBtn} ${view === v ? styles.innerNavBtnActive : ""}`}
            onClick={() => setView(v)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW ══════════════════════════════════════════ */}
      {view === "overview" && (
        <>
          {wallet && (
            <WalletCard wallet={wallet} onWithdraw={() => setShowModal(true)} />
          )}

          {/* Withdrawals list */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Withdrawal Requests</p>

            {withdrawals.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📭</span>
                <p>No withdrawal requests yet.</p>
              </div>
            ) : (
              <div className={styles.wdList}>
                {withdrawals.map((w) => {
                  const cfg = STATUS_CONFIG[w.status] || STATUS_CONFIG.pending;
                  return (
                    <div key={w.id} className={styles.wdCard}>
                      <div className={styles.wdTop}>
                        <div>
                          <p className={styles.wdAmount}>₦{fmt(w.amount)}</p>
                          <p className={styles.wdBank}>
                            {w.bank_name} · {w.account_number}
                          </p>
                        </div>
                        <div className={styles.wdRight}>
                          <span
                            className={styles.wdStatus}
                            style={{ color: cfg.color, background: cfg.bg }}
                          >
                            {cfg.label}
                          </span>
                          <p className={styles.wdTime}>
                            {timeAgo(w.created_at)}
                          </p>
                        </div>
                      </div>

                      {w.status === "failed" && w.failure_reason && (
                        <p className={styles.wdFailReason}>
                          ❌ {w.failure_reason}
                        </p>
                      )}

                      {w.status === "pending" && (
                        <button
                          className={styles.cancelWithdrawBtn}
                          onClick={() => handleCancel(w.id)}
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ══ BANK ACCOUNT ══════════════════════════════════════ */}
      {view === "bank" && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Bank Account</p>

          {preference?.account_number && (
            <div className={styles.savedBank}>
              <div className={styles.savedBankLeft}>
                <div className={styles.savedBankIcon}>🏦</div>
                <div>
                  <p className={styles.savedBankName}>
                    {preference.account_name}
                  </p>
                  <p className={styles.savedBankMeta}>{preference.bank_name}</p>
                  <p className={styles.savedBankNo}>
                    {preference.account_number}
                  </p>
                </div>
              </div>
              <span className={styles.savedBankBadge}>✅ Active</span>
            </div>
          )}

          <BankSetupForm
            token={token}
            preference={preference}
            onSaved={(pref) => {
              setPreference(pref);
            }}
          />
        </div>
      )}

      {/* ══ HISTORY ═══════════════════════════════════════════ */}
      {view === "history" && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Transaction History</p>

          {history.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📊</span>
              <p>No transactions yet.</p>
            </div>
          ) : (
            <div className={styles.txList}>
              {history.map((tx, i) => {
                const isCredit = tx.type === "credit" || tx.amount > 0;
                return (
                  <div key={tx.id || i} className={styles.txRow}>
                    <div className={styles.txIcon}>
                      {TX_ICONS[tx.category] || (isCredit ? "💰" : "📤")}
                    </div>
                    <div className={styles.txContent}>
                      <p className={styles.txDesc}>
                        {tx.description || tx.type}
                      </p>
                      <p className={styles.txTime}>{timeAgo(tx.created_at)}</p>
                    </div>
                    <p
                      className={`${styles.txAmount} ${isCredit ? styles.txCredit : styles.txDebit}`}
                    >
                      {isCredit ? "+" : "−"}₦{fmt(Math.abs(tx.amount))}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Withdraw modal ────────────────────────────────────── */}
      {showModal && (
        <WithdrawModal
          token={token}
          wallet={wallet}
          preference={preference}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            load();
          }}
        />
      )}
    </div>
  );
}
