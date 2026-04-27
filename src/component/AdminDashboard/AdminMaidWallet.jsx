import { useState, useEffect, useCallback } from "react";
import styles from "./AdminWallet.module.css";

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

function sym(c) {
  return CURRENCY_SYMBOLS[c] || (c ? `${c} ` : "₦");
}
function fmt(amount, currency) {
  return `${sym(currency)}${Number(amount || 0).toLocaleString()}`;
}
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
function initials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

// ── Maid Wallet Detail Modal ──────────────────────────────────────────────────
function WalletDetailModal({ maidId, maidName, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state for all 3 actions
  const [creditForm, setCreditForm] = useState({
    currency: "NGN",
    amount: "",
    description: "",
    reference: "",
  });
  const [releaseForm, setReleaseForm] = useState({
    currency: "NGN",
    amount: "",
  });
  const [adjustForm, setAdjustForm] = useState({
    currency: "NGN",
    amount: "",
    type: "debit",
    description: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/admin/${maidId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [maidId]);

  useEffect(() => {
    load();
  }, [load]);

  async function doAction(endpoint, body) {
    setSubmitting(true);
    setActionMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/wallet/admin/${maidId}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setActionMsg({ type: "success", text: json.message || "Done" });
      load(); // refresh
    } catch (err) {
      setActionMsg({
        type: "error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const txnAmtClass = (type) =>
    ({
      credit: styles.txnAmountCredit,
      debit: styles.txnAmountDebit,
      release: styles.txnAmountRelease,
    })[type] || styles.txnAmountCredit;

  const txnBadgeClass = (type) =>
    ({
      credit: styles.txnBadgeCredit,
      debit: styles.txnBadgeDebit,
      release: styles.txnBadgeRelease,
    })[type] || styles.txnBadgeCredit;

  const txnPrefix = (type) =>
    ({ credit: "+", debit: "-", release: "" })[type] || "";

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />

        <p className={styles.modalTitle}>{maidName}</p>
        <p className={styles.modalSubtitle}>Wallet management</p>

        {loading ? (
          <div className={styles.loading}>Loading wallet...</div>
        ) : data ? (
          <>
            {/* Wallet balances per currency */}
            {data.wallets?.length > 0 && (
              <div className={styles.actionSection}>
                <p className={styles.actionSectionTitle}>Balances</p>
                {data.wallets.map((w) => (
                  <div key={w.currency} style={{ marginBottom: 10 }}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailKey}>
                        {w.currency} Available
                      </span>
                      <span className={`${styles.detailVal}`}>
                        {fmt(w.available_balance, w.currency)}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailKey}>
                        {w.currency} Pending
                      </span>
                      <span className={styles.detailVal}>
                        {fmt(w.pending_balance, w.currency)}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailKey}>
                        {w.currency} Total Earned
                      </span>
                      <span className={styles.detailVal}>
                        {fmt(w.total_earned, w.currency)}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailKey}>
                        {w.currency} Withdrawn
                      </span>
                      <span className={styles.detailVal}>
                        {fmt(w.total_withdrawn, w.currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <hr className={styles.divider} />

            {actionMsg && (
              <div
                className={`${styles.feedback} ${actionMsg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
              >
                {actionMsg.text}
              </div>
            )}

            {/* Credit form */}
            <div className={styles.actionSection}>
              <p className={styles.actionSectionTitle}>💰 Credit (add funds)</p>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Currency</label>
                  <select
                    className={styles.formSelect}
                    value={creditForm.currency}
                    onChange={(e) =>
                      setCreditForm((f) => ({ ...f, currency: e.target.value }))
                    }
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c} {sym(c)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Amount</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={creditForm.amount}
                    onChange={(e) =>
                      setCreditForm((f) => ({ ...f, amount: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Description (optional)
                </label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Reason for credit"
                  value={creditForm.description}
                  onChange={(e) =>
                    setCreditForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                disabled={submitting || !creditForm.amount}
                onClick={() =>
                  doAction("credit", {
                    currency: creditForm.currency,
                    amount: Number(creditForm.amount),
                    description: creditForm.description,
                  })
                }
              >
                {submitting
                  ? "Processing..."
                  : `Credit ${creditForm.currency} ${sym(creditForm.currency)}${creditForm.amount || "0"}`}
              </button>
            </div>

            <hr className={styles.divider} />

            {/* Release form */}
            <div className={styles.actionSection}>
              <p className={styles.actionSectionTitle}>
                🔓 Release (pending → available)
              </p>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Currency</label>
                  <select
                    className={styles.formSelect}
                    value={releaseForm.currency}
                    onChange={(e) =>
                      setReleaseForm((f) => ({
                        ...f,
                        currency: e.target.value,
                      }))
                    }
                  >
                    {(data.wallets || []).map((w) => (
                      <option key={w.currency} value={w.currency}>
                        {w.currency} {sym(w.currency)} (pending:{" "}
                        {fmt(w.pending_balance, w.currency)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Amount</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={releaseForm.amount}
                    onChange={(e) =>
                      setReleaseForm((f) => ({ ...f, amount: e.target.value }))
                    }
                  />
                </div>
              </div>
              <button
                className={`${styles.btn} ${styles.btnAmber}`}
                disabled={submitting || !releaseForm.amount}
                onClick={() =>
                  doAction("release", {
                    currency: releaseForm.currency,
                    amount: Number(releaseForm.amount),
                  })
                }
              >
                {submitting ? "Processing..." : "Release Pending Funds"}
              </button>
            </div>

            <hr className={styles.divider} />

            {/* Adjust form */}
            <div className={styles.actionSection}>
              <p className={styles.actionSectionTitle}>⚙️ Manual adjustment</p>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Type</label>
                  <select
                    className={styles.formSelect}
                    value={adjustForm.type}
                    onChange={(e) =>
                      setAdjustForm((f) => ({ ...f, type: e.target.value }))
                    }
                  >
                    <option value="debit">Debit (remove)</option>
                    <option value="credit">Credit (add)</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Currency</label>
                  <select
                    className={styles.formSelect}
                    value={adjustForm.currency}
                    onChange={(e) =>
                      setAdjustForm((f) => ({ ...f, currency: e.target.value }))
                    }
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c} {sym(c)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Amount</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={adjustForm.amount}
                    onChange={(e) =>
                      setAdjustForm((f) => ({ ...f, amount: e.target.value }))
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="Reason"
                    value={adjustForm.description}
                    onChange={(e) =>
                      setAdjustForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={submitting || !adjustForm.amount}
                onClick={() =>
                  doAction("adjust", {
                    currency: adjustForm.currency,
                    amount: Number(adjustForm.amount),
                    type: adjustForm.type,
                    description: adjustForm.description,
                  })
                }
              >
                {submitting ? "Processing..." : "Apply Adjustment"}
              </button>
            </div>

            <hr className={styles.divider} />

            {/* Recent transactions */}
            {data.transactions?.length > 0 && (
              <div className={styles.actionSection}>
                <p className={styles.actionSectionTitle}>
                  Recent Transactions ({data.transactions.length})
                </p>
                <div className={styles.txnList}>
                  {data.transactions.slice(0, 15).map((t) => (
                    <div key={t.id} className={styles.txnRow}>
                      <div className={styles.txnLeft}>
                        <p className={styles.txnDesc}>
                          {t.description || t.type}
                        </p>
                        <p className={styles.txnDate}>
                          {formatDate(t.created_at)}
                        </p>
                      </div>
                      <span
                        className={`${styles.txnBadge} ${txnBadgeClass(t.type)}`}
                      >
                        {t.type}
                      </span>
                      <span
                        className={`${styles.txnAmount} ${txnAmtClass(t.type)}`}
                      >
                        {txnPrefix(t.type)}
                        {fmt(t.amount, t.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>❌</div>
            <p className={styles.emptyText}>Could not load wallet data</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main AdminWallet ──────────────────────────────────────────────────────────
export default function AdminWallet({ onBack }) {
  const [wallets, setWallets] = useState([]);
  const [totals, setTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null); // { maidId, maidName }
  const LIMIT = 20;

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set("search", search);
      if (currency) params.set("currency", currency);
      const res = await fetch(`${API_URL}/api/wallet/admin?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWallets(data.wallets || []);
      setTotals(data.platform_totals || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, currency]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);
  useEffect(() => {
    setPage(1);
  }, [search, currency]);

  const totalPages = Math.ceil(total / LIMIT);

  const allCurrencies = [
    ...new Set(wallets.map((w) => w.currency).filter(Boolean)),
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Maid Wallets</h1>
          </div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* Platform totals */}
        {totals.length > 0 && (
          <>
            <p className={styles.sectionTitle}>
              Platform Totals
              <span className={styles.sectionCount}>
                {totals.length} currencies
              </span>
            </p>
            <div className={styles.totalsStrip}>
              {totals.map((t) => (
                <div key={t.currency} className={styles.totalCard}>
                  <p className={styles.totalCardCurrency}>
                    {t.currency} · {t.maid_count} maids
                  </p>
                  <p className={styles.totalCardValue}>
                    {fmt(t.total_available, t.currency)}
                  </p>
                  <p className={styles.totalCardSub}>
                    {fmt(t.total_pending, t.currency)} pending ·{" "}
                    {fmt(t.total_earned, t.currency)} earned
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Search + currency filter */}
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
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.currencySelect}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="">All currencies</option>
            {allCurrencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <p className={styles.sectionTitle}>
          All Maid Wallets
          <span className={styles.sectionCount}>{total}</span>
        </p>

        {loading ? (
          <div className={styles.loading}>Loading wallets...</div>
        ) : wallets.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>👛</div>
            <p className={styles.emptyText}>No wallets found</p>
          </div>
        ) : (
          <>
            <div className={styles.walletList}>
              {wallets.map((w) => (
                <div
                  key={`${w.maid_id}-${w.currency}`}
                  className={styles.walletCard}
                >
                  {/* Maid info */}
                  <div className={styles.walletCardTop}>
                    {w.maid_avatar ? (
                      <img
                        src={w.maid_avatar}
                        alt={w.maid_name}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {initials(w.maid_name)}
                      </div>
                    )}
                    <div className={styles.maidInfo}>
                      <p className={styles.maidName}>{w.maid_name}</p>
                      <p className={styles.maidEmail}>{w.maid_email}</p>
                    </div>
                    <span className={styles.currencyBadge}>{w.currency}</span>
                  </div>

                  {/* Balance grid */}
                  <div className={styles.balanceGrid}>
                    <div className={styles.balanceTile}>
                      <p className={styles.balanceLabel}>Available</p>
                      <p className={`${styles.balanceValue} ${styles.green}`}>
                        {fmt(w.available_balance, w.currency)}
                      </p>
                    </div>
                    <div className={styles.balanceTile}>
                      <p className={styles.balanceLabel}>Pending</p>
                      <p className={`${styles.balanceValue} ${styles.amber}`}>
                        {fmt(w.pending_balance, w.currency)}
                      </p>
                    </div>
                    <div className={styles.balanceTile}>
                      <p className={styles.balanceLabel}>Total Earned</p>
                      <p className={`${styles.balanceValue} ${styles.blue}`}>
                        {fmt(w.total_earned, w.currency)}
                      </p>
                    </div>
                    <div className={styles.balanceTile}>
                      <p className={styles.balanceLabel}>Withdrawn</p>
                      <p className={styles.balanceValue}>
                        {fmt(w.total_withdrawn, w.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      onClick={() =>
                        setSelected({
                          maidId: w.maid_id,
                          maidName: w.maid_name,
                        })
                      }
                    >
                      Manage Wallet
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnGreen}`}
                      onClick={() =>
                        setSelected({
                          maidId: w.maid_id,
                          maidName: w.maid_name,
                        })
                      }
                    >
                      + Credit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className={styles.pageInfo}>
                  {page} / {totalPages}
                </span>
                <button
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <WalletDetailModal
          maidId={selected.maidId}
          maidName={selected.maidName}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
