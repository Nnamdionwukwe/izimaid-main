import { useState, useEffect, useCallback } from "react";
import styles from "./Withdrawals.module.css";

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

const STATUS_BADGE = {
  pending: styles.badgePending,
  processing: styles.badgeProcessing,
  paid: styles.badgePaid,
  rejected: styles.badgeRejected,
  failed: styles.badgeFailed,
  cancelled: styles.badgeCancelled,
};

// ── Process Modal ─────────────────────────────────────────────────────────────
function ProcessModal({ withdrawal: w, onClose, onProcessed }) {
  const [gatewayRef, setGatewayRef] = useState(w.gateway_ref || "");
  const [notes, setNotes] = useState(w.notes || "");
  const [failureReason, setFailureReason] = useState(w.failure_reason || "");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  async function doAction(action) {
    setSubmitting(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/withdrawals/admin/${w.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          gateway_ref: gatewayRef || null,
          notes: notes || null,
          failure_reason: failureReason || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setMsg({ type: "success", text: data.message || "Done" });
      setTimeout(() => {
        onProcessed(data.withdrawal);
        onClose();
      }, 1200);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  async function doAutoProcess() {
    setSubmitting(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/withdrawals/admin/${w.id}/auto-process`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Auto-process failed");
      setMsg({ type: "success", text: `Auto-processed: ${data.status}` });
      setTimeout(() => {
        onProcessed({ ...w, status: data.status });
        onClose();
      }, 1500);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  // Build payout detail rows
  const payoutRows = [
    ["Maid", w.maid_name],
    ["Email", w.maid_email],
    ["Amount", fmt(w.amount, w.currency)],
    ["Fee", fmt(w.fee, w.currency)],
    ["Net payout", fmt(w.net_amount, w.currency)],
    ["Method", w.method?.replace(/_/g, " ")],
    ["Status", w.status],
    w.bank_name && ["Bank", w.bank_name],
    w.account_number && ["Account no.", w.account_number],
    w.account_name && ["Account name", w.account_name],
    w.bank_code && ["Bank code", w.bank_code],
    w.swift_code && ["SWIFT", w.swift_code],
    w.iban && ["IBAN", w.iban],
    w.mobile_provider && ["Provider", w.mobile_provider],
    w.mobile_number && ["Mobile", w.mobile_number],
    w.crypto_currency && ["Coin", `${w.crypto_currency} (${w.crypto_network})`],
    w.crypto_address && ["Address", w.crypto_address],
    w.paypal_email && ["PayPal", w.paypal_email],
    w.wise_email && ["Wise", w.wise_email],
    ["Submitted", formatDate(w.created_at)],
  ].filter(Boolean);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />
        <p className={styles.modalTitle}>{w.maid_name}</p>
        <p className={styles.modalSubtitle}>
          {w.method?.replace(/_/g, " ")} · {fmt(w.amount, w.currency)}
        </p>

        {/* Payout details */}
        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Payout Details</p>
          {payoutRows.map(([k, v]) => (
            <div key={k} className={styles.detailRow}>
              <span className={styles.detailKey}>{k}</span>
              <span className={styles.detailVal}>{v}</span>
            </div>
          ))}
        </div>

        <hr className={styles.divider} />

        {msg && (
          <div
            className={`${styles.feedback} ${msg.type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
          >
            {msg.text}
          </div>
        )}

        {/* Action inputs */}
        <div className={styles.detailSection}>
          <p className={styles.detailSectionTitle}>Process</p>

          <div className={styles.processGroup}>
            <label className={styles.formLabel}>
              Gateway / Payment Reference
            </label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="Bank trf ref, tx hash, PayPal batch ID..."
              value={gatewayRef}
              onChange={(e) => setGatewayRef(e.target.value)}
            />
          </div>

          <div className={styles.processGroup}>
            <label className={styles.formLabel}>Admin Notes (optional)</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="Internal notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className={styles.processGroup}>
            <label className={styles.formLabel}>
              Failure Reason (if rejecting / marking failed)
            </label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="Reason shown to maid..."
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
            />
          </div>

          <div className={styles.processActions}>
            {w.status === "pending" && (
              <button
                className={`${styles.btn} ${styles.btnApprove}`}
                disabled={submitting}
                onClick={() => doAction("approve")}
              >
                {submitting ? "..." : "✓ Approve"}
              </button>
            )}
            {(w.status === "pending" || w.status === "processing") && (
              <button
                className={`${styles.btn} ${styles.btnPaid}`}
                disabled={submitting}
                onClick={() => doAction("mark_paid")}
              >
                {submitting ? "..." : "✅ Mark Paid"}
              </button>
            )}
            {(w.status === "pending" || w.status === "processing") && (
              <button
                className={`${styles.btn} ${styles.btnReject}`}
                disabled={submitting}
                onClick={() => doAction("reject")}
              >
                {submitting ? "..." : "✗ Reject"}
              </button>
            )}
            {(w.status === "pending" || w.status === "processing") && (
              <button
                className={`${styles.btn} ${styles.btnFailed}`}
                disabled={submitting}
                onClick={() => doAction("mark_failed")}
              >
                {submitting ? "..." : "Mark Failed"}
              </button>
            )}
            {w.status === "processing" && (
              <button
                className={`${styles.btn} ${styles.btnAuto}`}
                disabled={submitting}
                onClick={doAutoProcess}
              >
                {submitting ? "..." : "⚡ Auto-Process"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main AdminWithdrawals ─────────────────────────────────────────────────────
export default function AdminWithdrawals({ onBack }) {
  const [withdrawals, setWithdrawals] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [methodFilter, setMethodFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selected, setSelected] = useState(null);
  const LIMIT = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (statusFilter) params.set("status", statusFilter);
      if (methodFilter) params.set("method", methodFilter);
      const res = await fetch(`${API_URL}/api/withdrawals/admin?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // client-side search filter
      const list = (data.withdrawals || []).filter(
        (w) =>
          !search ||
          w.maid_name?.toLowerCase().includes(search.toLowerCase()) ||
          w.maid_email?.toLowerCase().includes(search.toLowerCase()),
      );
      setWithdrawals(list);
      setSummary(data.summary || []);
      setHasMore((data.withdrawals || []).length === LIMIT);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, methodFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    setPage(1);
  }, [statusFilter, methodFilter, search]);

  function handleProcessed(updated) {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === updated.id ? { ...w, ...updated } : w)),
    );
  }

  // Summary counts
  const summaryMap = summary.reduce(
    (acc, s) => ({ ...acc, [s.status]: { count: s.count, total: s.total } }),
    {},
  );
  const pendingCount = Number(summaryMap.pending?.count || 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Withdrawals</h1>
          </div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
        <div className={styles.tabBar}>
          {[
            "pending",
            "processing",
            "paid",
            "rejected",
            "failed",
            "cancelled",
          ].map((s) => (
            <button
              key={s}
              className={`${styles.tabBtn} ${statusFilter === s ? styles.tabBtnActive : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
              {s === "pending" && pendingCount > 0 && (
                <span className={styles.tabBadge}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {/* Summary strip */}
        {summary.length > 0 && (
          <div className={styles.summaryStrip}>
            {summary.map((s) => (
              <div key={s.status} className={styles.summaryCard}>
                <p className={styles.summaryLabel}>{s.status}</p>
                <p className={styles.summaryValue}>{s.count}</p>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
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
              placeholder="Search by maid name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.selectFilter}
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="">All methods</option>
            {[
              "bank_transfer",
              "wire_transfer",
              "mobile_money",
              "crypto",
              "paypal",
              "wise",
              "flutterwave",
            ].map((m) => (
              <option key={m} value={m}>
                {m.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <p className={styles.sectionTitle}>
          {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}{" "}
          Withdrawals
          <span className={styles.sectionCount}>{withdrawals.length}</span>
        </p>

        {loading ? (
          <div className={styles.loading}>Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>💸</div>
            <p className={styles.emptyText}>No {statusFilter} withdrawals</p>
          </div>
        ) : (
          <>
            <div className={styles.cardList}>
              {withdrawals.map((w) => (
                <div key={w.id} className={styles.wCard}>
                  <div className={styles.wCardTop}>
                    <div className={styles.wCardLeft}>
                      <p className={styles.wCardName}>{w.maid_name}</p>
                      <p className={styles.wCardEmail}>{w.maid_email}</p>
                      <p className={styles.wCardDate}>
                        {formatDate(w.created_at)}
                      </p>
                    </div>
                    <div className={styles.wCardRight}>
                      <p className={styles.wCardAmount}>
                        {fmt(w.amount, w.currency)}
                      </p>
                      <p className={styles.wCardCurrency}>{w.currency}</p>
                    </div>
                  </div>

                  <div className={styles.metaRow}>
                    <span
                      className={`${styles.badge} ${STATUS_BADGE[w.status] || styles.badgePending}`}
                    >
                      {w.status}
                    </span>
                    <span className={styles.metaTag}>
                      {w.method?.replace(/_/g, " ")}
                    </span>
                    <span className={styles.metaTag}>
                      Fee: {fmt(w.fee, w.currency)}
                    </span>
                    <span className={styles.metaTag}>
                      Net: {fmt(w.net_amount, w.currency)}
                    </span>
                  </div>

                  {/* Destination preview */}
                  <p className={styles.payoutDetail}>
                    {w.bank_name && (
                      <>
                        <span className={styles.payoutDetailVal}>
                          {w.bank_name}
                        </span>{" "}
                        · {w.account_number}
                      </>
                    )}
                    {w.mobile_number && (
                      <>
                        <span className={styles.payoutDetailVal}>
                          {w.mobile_provider}
                        </span>{" "}
                        · {w.mobile_number}
                      </>
                    )}
                    {w.crypto_address && (
                      <span className={styles.payoutDetailVal}>
                        {w.crypto_address.slice(0, 16)}...
                      </span>
                    )}
                    {w.paypal_email && (
                      <span className={styles.payoutDetailVal}>
                        {w.paypal_email}
                      </span>
                    )}
                    {w.wise_email && (
                      <span className={styles.payoutDetailVal}>
                        {w.wise_email}
                      </span>
                    )}
                  </p>

                  {w.failure_reason && (
                    <div className={styles.failureReason}>
                      ⚠️ {w.failure_reason}
                    </div>
                  )}

                  {w.gateway_ref && (
                    <p className={styles.feeNote}>Ref: {w.gateway_ref}</p>
                  )}

                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                      onClick={() => setSelected(w)}
                    >
                      {w.status === "pending"
                        ? "Review & Process"
                        : "View Details"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(page > 1 || hasMore) && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className={styles.pageInfo}>Page {page}</span>
                <button
                  className={styles.pageBtn}
                  disabled={!hasMore}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <ProcessModal
          withdrawal={selected}
          onClose={() => setSelected(null)}
          onProcessed={handleProcessed}
        />
      )}
    </div>
  );
}
