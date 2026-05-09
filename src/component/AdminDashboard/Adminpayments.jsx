import { useState, useEffect, useCallback } from "react";
import styles from "./AdminDashboard.module.css";
import { useNavigate } from "react-router-dom";

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
};

function fmtMoney(amount, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || (currency ? `${currency} ` : "₦");
  return `${sym}${Number(amount || 0).toLocaleString()}`;
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

const GATEWAY_LABELS = {
  paystack: "Paystack",
  stripe: "Stripe",
  bank_transfer: "Bank Transfer",
  crypto: "Crypto",
};

// ── Tab: Pending Approvals ────────────────────────────────────────────────────
function PendingApprovals() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [msg, setMsg] = useState({});
  const [gateway, setGateway] = useState("");

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = gateway ? `?gateway=${gateway}` : "";
      const res = await fetch(`${API_URL}/api/payments/pending${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [gateway]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  async function handleAction(booking_id, action) {
    setProcessing((p) => ({ ...p, [booking_id]: action }));
    setMsg((m) => ({ ...m, [booking_id]: null }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/payments/${action}/${booking_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body:
            action === "reject"
              ? JSON.stringify({ reason: "Admin rejected" })
              : undefined,
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg((m) => ({
        ...m,
        [booking_id]: {
          type: "success",
          text:
            action === "approve"
              ? "✓ Approved — maid notified"
              : "✗ Rejected — refund initiated",
        },
      }));
      setTimeout(
        () => setBookings((b) => b.filter((x) => x.booking_id !== booking_id)),
        2000,
      );
    } catch (err) {
      setMsg((m) => ({
        ...m,
        [booking_id]: { type: "error", text: err.message },
      }));
    } finally {
      setProcessing((p) => ({ ...p, [booking_id]: null }));
    }
  }

  return (
    <>
      {/* Gateway filter */}
      <div className={styles.filterBar}>
        {["", "paystack", "stripe", "bank_transfer", "crypto"].map((g) => (
          <button
            key={g}
            className={`${styles.filterBtn} ${gateway === g ? styles.filterBtnActive : ""}`}
            onClick={() => setGateway(g)}
          >
            {g ? GATEWAY_LABELS[g] : "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : bookings.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✅</div>
          <p className={styles.emptyText}>No pending bookings to review</p>
        </div>
      ) : (
        <div className={styles.cardList}>
          {bookings.map((b) => (
            <div key={b.booking_id} className={styles.payCard}>
              <div className={styles.payCardTop}>
                <div>
                  <p className={styles.payCardName}>{b.customer_name}</p>
                  <p className={styles.payCardEmail}>{b.customer_email}</p>
                </div>
                <div className={styles.badgeRow}>
                  <span className={`${styles.badge} ${styles.badgePaid}`}>
                    Paid ✓
                  </span>
                  {b.gateway && (
                    <span className={`${styles.badge} ${styles.badgeGateway}`}>
                      {GATEWAY_LABELS[b.gateway] || b.gateway}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.metaGrid}>
                {[
                  ["Maid", b.maid_name],
                  ["Date", formatDate(b.service_date)],
                  ["Duration", `${b.duration_hours}h`],
                  ["Amount", fmtMoney(b.total_amount, b.currency || "NGN")],
                  [
                    "Platform fee",
                    fmtMoney(b.platform_fee, b.currency || "NGN"),
                  ],
                  ["Maid gets", fmtMoney(b.maid_payout, b.currency || "NGN")],
                  ["Paid at", b.paid_at ? formatDate(b.paid_at) : "—"],
                  [
                    "Ref",
                    b.paystack_reference?.slice(-8) ||
                      b.stripe_payment_id?.slice(-8) ||
                      b.bank_transfer_ref?.slice(-8) ||
                      "—",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className={styles.metaItem}>
                    {k}: <span className={styles.metaVal}>{v}</span>
                  </div>
                ))}
              </div>

              <p className={styles.addressRow}>📍 {b.address}</p>

              {msg[b.booking_id] && (
                <div
                  className={`${styles.feedback} ${msg[b.booking_id].type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
                >
                  {msg[b.booking_id].text}
                </div>
              )}

              <div className={styles.actionRow}>
                <button
                  className={`${styles.btn} ${styles.btnApprove}`}
                  onClick={() => handleAction(b.booking_id, "approve")}
                  disabled={!!processing[b.booking_id]}
                >
                  {processing[b.booking_id] === "approve"
                    ? "Approving..."
                    : "✓ Approve"}
                </button>
                <button
                  className={`${styles.btn} ${styles.btnReject}`}
                  onClick={() => handleAction(b.booking_id, "reject")}
                  disabled={!!processing[b.booking_id]}
                >
                  {processing[b.booking_id] === "reject"
                    ? "Rejecting..."
                    : "✗ Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Tab: Bank Transfer Verification ──────────────────────────────────────────
// ── Tab: Bank Transfer Verification ──────────────────────────────────────────
function BankTransfers() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [msg, setMsg] = useState({});
  const [notes, setNotes] = useState({});
  const [filter, setFilter] = useState("all"); // all | awaiting_proof | proof_submitted

  const fetchBankTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/payments/bank-transfers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankTransfers();
  }, [fetchBankTransfers]);

  const filtered =
    filter === "all"
      ? payments
      : payments.filter((p) => p.bank_transfer_status === filter);

  async function handleVerify(payment_id, approved) {
    setProcessing((p) => ({
      ...p,
      [payment_id]: approved ? "approve" : "reject",
    }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/payments/bank-transfer/${payment_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approved, notes: notes[payment_id] || null }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg((m) => ({
        ...m,
        [payment_id]: {
          type: "success",
          text: approved
            ? "✓ Transfer verified — booking moved to pending"
            : "✗ Transfer rejected",
        },
      }));
      setTimeout(
        () => setPayments((p) => p.filter((x) => x.payment_id !== payment_id)),
        2000,
      );
    } catch (err) {
      setMsg((m) => ({
        ...m,
        [payment_id]: { type: "error", text: err.message },
      }));
    } finally {
      setProcessing((p) => ({ ...p, [payment_id]: null }));
    }
  }

  if (loading)
    return <div className={styles.loading}>Loading bank transfers...</div>;

  return (
    <>
      <div className={styles.filterBar}>
        {[
          { key: "all", label: `All (${payments.length})` },
          {
            key: "awaiting_proof",
            label: `Awaiting Proof (${payments.filter((p) => p.bank_transfer_status === "awaiting_proof").length})`,
          },
          {
            key: "proof_submitted",
            label: `Proof Submitted (${payments.filter((p) => p.bank_transfer_status === "proof_submitted").length})`,
          },
        ].map((f) => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏦</div>
          <p className={styles.emptyText}>No bank transfers to review</p>
        </div>
      ) : (
        <div className={styles.cardList}>
          {filtered.map((b) => (
            <div
              key={b.payment_id}
              className={`${styles.payCard} ${b.bank_transfer_proof ? styles.payCardAccentBank : ""}`}
            >
              <div className={styles.payCardTop}>
                <div>
                  <p className={styles.payCardName}>{b.customer_name}</p>
                  <p className={styles.payCardEmail}>{b.customer_email}</p>
                </div>
                <span
                  className={`${styles.badge} ${
                    b.bank_transfer_status === "proof_submitted"
                      ? styles.badgeProof
                      : styles.badgeAwaiting
                  }`}
                >
                  {b.bank_transfer_status === "proof_submitted"
                    ? "⏳ Proof submitted"
                    : "⏸ Awaiting proof"}
                </span>
              </div>

              <div className={styles.metaGrid}>
                {[
                  ["Maid", b.maid_name],
                  ["Amount", fmtMoney(b.total_amount, b.currency || "NGN")],
                  ["Duration", `${b.duration_hours}h`],
                  ["Ref", b.bank_transfer_ref || "—"],
                  ["Service date", formatDate(b.service_date)],
                  ["Submitted", formatDate(b.created_at)],
                ].map(([k, v]) => (
                  <div key={k} className={styles.metaItem}>
                    {k}: <span className={styles.metaVal}>{v}</span>
                  </div>
                ))}
              </div>

              <p className={styles.addressRow}>📍 {b.address}</p>

              {b.bank_transfer_proof ? (
                <div className={styles.proofWrap}>
                  <p className={styles.proofLabel}>Payment Proof</p>
                  <a
                    href={b.bank_transfer_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={b.bank_transfer_proof}
                      alt="Payment proof"
                      className={styles.proofImg}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <span className={styles.proofLink}>
                      🔗 Open full proof →
                    </span>
                  </a>
                </div>
              ) : (
                <div className={styles.warnBanner}>
                  ⏸ Customer has not uploaded proof yet. You can reject if
                  overdue.
                </div>
              )}

              <div className={styles.inputWrap}>
                <input
                  className={styles.fieldInput}
                  placeholder="Admin notes (optional)..."
                  value={notes[b.payment_id] || ""}
                  onChange={(e) =>
                    setNotes((n) => ({ ...n, [b.payment_id]: e.target.value }))
                  }
                />
              </div>

              {msg[b.payment_id] && (
                <div
                  className={`${styles.feedback} ${
                    msg[b.payment_id].type === "success"
                      ? styles.feedbackSuccess
                      : styles.feedbackError
                  }`}
                >
                  {msg[b.payment_id].text}
                </div>
              )}

              <div className={styles.actionRow}>
                <button
                  className={`${styles.btn} ${styles.btnApprove}`}
                  onClick={() => handleVerify(b.payment_id, true)}
                  disabled={
                    !!processing[b.payment_id] || !b.bank_transfer_proof
                  }
                  title={
                    !b.bank_transfer_proof
                      ? "Cannot verify — no proof uploaded"
                      : ""
                  }
                >
                  {processing[b.payment_id] === "approve"
                    ? "Verifying..."
                    : "✓ Verify Transfer"}
                </button>
                <button
                  className={`${styles.btn} ${styles.btnReject}`}
                  onClick={() => handleVerify(b.payment_id, false)}
                  disabled={!!processing[b.payment_id]}
                >
                  {processing[b.payment_id] === "reject"
                    ? "Rejecting..."
                    : "✗ Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Tab: Crypto Payments ──────────────────────────────────────────────────────
function CryptoPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [msg, setMsg] = useState({});
  const [filter, setFilter] = useState("all");

  const fetchCrypto = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/payments/crypto`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrypto();
  }, [fetchCrypto]);

  const filtered =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);

  async function handleAction(booking_id, action) {
    setProcessing((p) => ({ ...p, [booking_id]: action }));
    setMsg((m) => ({ ...m, [booking_id]: null }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/payments/${action}/${booking_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body:
            action === "reject"
              ? JSON.stringify({ reason: "Admin rejected crypto payment" })
              : undefined,
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg((m) => ({
        ...m,
        [booking_id]: {
          type: "success",
          text:
            action === "approve" ? "✓ Approved — maid notified" : "✗ Rejected",
        },
      }));
      setTimeout(
        () => setPayments((p) => p.filter((x) => x.booking_id !== booking_id)),
        2000,
      );
    } catch (err) {
      setMsg((m) => ({
        ...m,
        [booking_id]: { type: "error", text: err.message },
      }));
    } finally {
      setProcessing((p) => ({ ...p, [booking_id]: null }));
    }
  }

  const STATUS_COLORS = {
    success: { badge: styles.badgePaid, label: "Confirmed" },
    pending: { badge: styles.badgeAwaiting, label: "Pending" },
    failed: { badge: styles.badgePastDue, label: "Failed" },
  };

  if (loading)
    return <div className={styles.loading}>Loading crypto payments...</div>;

  return (
    <>
      <div className={styles.filterBar}>
        {[
          { key: "all", label: `All (${payments.length})` },
          {
            key: "pending",
            label: `Pending (${payments.filter((p) => p.status === "pending").length})`,
          },
          {
            key: "success",
            label: `Confirmed (${payments.filter((p) => p.status === "success").length})`,
          },
          {
            key: "failed",
            label: `Failed (${payments.filter((p) => p.status === "failed").length})`,
          },
        ].map((f) => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>₿</div>
          <p className={styles.emptyText}>No crypto payments found</p>
        </div>
      ) : (
        <div className={styles.cardList}>
          {filtered.map((p) => {
            const sc = STATUS_COLORS[p.status] || STATUS_COLORS.pending;
            let chargeInfo = {};
            try {
              chargeInfo = JSON.parse(p.notes || "{}");
            } catch {}

            return (
              <div key={p.payment_id} className={styles.payCard}>
                <div className={styles.payCardTop}>
                  <div>
                    <p className={styles.payCardName}>{p.customer_name}</p>
                    <p className={styles.payCardEmail}>{p.customer_email}</p>
                  </div>
                  <div className={styles.badgeRow}>
                    <span className={`${styles.badge} ${sc.badge}`}>
                      {sc.label}
                    </span>
                    <span className={`${styles.badge} ${styles.badgeGateway}`}>
                      ₿ Crypto
                    </span>
                  </div>
                </div>

                <div className={styles.metaGrid}>
                  {[
                    ["Maid", p.maid_name],
                    ["Amount", fmtMoney(p.total_amount, p.currency || "USD")],
                    ["Duration", `${p.duration_hours}h`],
                    ["Service date", formatDate(p.service_date)],
                    ["Submitted", formatDate(p.created_at)],
                    chargeInfo.charge_code && [
                      "Charge code",
                      chargeInfo.charge_code,
                    ],
                    chargeInfo.charge_id && [
                      "Charge ID",
                      chargeInfo.charge_id.slice(0, 12) + "…",
                    ],
                    chargeInfo.expires_at && [
                      "Expires",
                      formatDate(chargeInfo.expires_at),
                    ],
                  ]
                    .filter(Boolean)
                    .map(([k, v]) => (
                      <div key={k} className={styles.metaItem}>
                        {k}: <span className={styles.metaVal}>{v}</span>
                      </div>
                    ))}
                </div>

                <p className={styles.addressRow}>📍 {p.address}</p>

                {msg[p.booking_id] && (
                  <div
                    className={`${styles.feedback} ${
                      msg[p.booking_id].type === "success"
                        ? styles.feedbackSuccess
                        : styles.feedbackError
                    }`}
                  >
                    {msg[p.booking_id].text}
                  </div>
                )}

                {p.status === "pending" && (
                  <div className={styles.actionRow}>
                    <button
                      className={`${styles.btn} ${styles.btnApprove}`}
                      onClick={() => handleAction(p.booking_id, "approve")}
                      disabled={!!processing[p.booking_id]}
                    >
                      {processing[p.booking_id] === "approve"
                        ? "Approving..."
                        : "✓ Approve"}
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnReject}`}
                      onClick={() => handleAction(p.booking_id, "reject")}
                      disabled={!!processing[p.booking_id]}
                    >
                      {processing[p.booking_id] === "reject"
                        ? "Rejecting..."
                        : "✗ Reject"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ── Tab: Payouts ──────────────────────────────────────────────────────────────
function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("escrow");
  const [processing, setProcessing] = useState({});
  const [msg, setMsg] = useState({});
  const [refs, setRefs] = useState({});
  const [notes, setNotes] = useState({});

  const fetchPayouts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/payments/payouts?status=${statusFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setPayouts(data.payouts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  async function handleProcess(payout_id) {
    setProcessing((p) => ({ ...p, [payout_id]: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/payments/payouts/${payout_id}/process`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            payout_ref: refs[payout_id] || null,
            notes: notes[payout_id] || null,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg((m) => ({
        ...m,
        [payout_id]: {
          type: "success",
          text: "✓ Payout processed successfully",
        },
      }));
      setTimeout(() => {
        setPayouts((p) => p.filter((x) => x.id !== payout_id));
        setMsg((m) => {
          const n = { ...m };
          delete n[payout_id];
          return n;
        });
      }, 2500);
    } catch (err) {
      setMsg((m) => ({
        ...m,
        [payout_id]: { type: "error", text: err.message },
      }));
    } finally {
      setProcessing((p) => ({ ...p, [payout_id]: false }));
    }
  }

  return (
    <>
      <div className={styles.statusBar}>
        {["escrow", "paid"].map((s) => (
          <button
            key={s}
            className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === "escrow" ? "In Escrow" : "Paid Out"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading payouts...</div>
      ) : payouts.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💸</div>
          <p className={styles.emptyText}>No {statusFilter} payouts</p>
        </div>
      ) : (
        <div className={styles.cardList}>
          {payouts.map((p) => (
            <div
              key={p.id}
              className={`${styles.payCard} ${p.status === "escrow" ? styles.payCardAccentEscrow : styles.payCardAccentPaid}`}
            >
              <div className={styles.payCardTop}>
                <div>
                  <p className={styles.payCardName}>{p.maid_name}</p>
                  <p className={styles.payCardEmail}>{p.maid_email}</p>
                </div>
                <div className={styles.payoutAmount}>
                  <p
                    className={`${styles.payoutAmountValue} ${p.status === "escrow" ? styles.escrow : styles.paid}`}
                  >
                    {fmtMoney(p.amount, p.currency)}
                  </p>
                  <p className={styles.payoutCurrency}>{p.currency}</p>
                </div>
              </div>

              <div className={styles.metaGrid}>
                {[
                  ["Status", p.status],
                  ["Service date", formatDate(p.service_date)],
                  ["Address", p.address?.split(",")[0] || "—"],
                  ["Bank", p.bank_name || "—"],
                  ["Account", p.account_number || "—"],
                  ["Account name", p.account_name || "—"],
                  p.payout_ref && ["Payout ref", p.payout_ref],
                ]
                  .filter(Boolean)
                  .map(([k, v]) => (
                    <div key={k} className={styles.metaItem}>
                      {k}: <span className={styles.metaVal}>{v}</span>
                    </div>
                  ))}
              </div>

              {p.booking_status !== "completed" && p.status === "escrow" && (
                <div className={styles.warnBanner}>
                  ⚠️ Booking not yet completed — payout cannot be processed
                  until the job is done
                </div>
              )}

              {p.status === "escrow" && p.booking_status === "completed" && (
                <div className={styles.inputWrap}>
                  <input
                    className={styles.fieldInput}
                    placeholder="Payment reference (e.g. bank transfer ref)..."
                    value={refs[p.id] || ""}
                    onChange={(e) =>
                      setRefs((r) => ({ ...r, [p.id]: e.target.value }))
                    }
                  />
                  <input
                    className={styles.fieldInput}
                    placeholder="Notes (optional)..."
                    value={notes[p.id] || ""}
                    onChange={(e) =>
                      setNotes((n) => ({ ...n, [p.id]: e.target.value }))
                    }
                  />
                </div>
              )}

              {msg[p.id] && (
                <div
                  className={`${styles.feedback} ${msg[p.id].type === "success" ? styles.feedbackSuccess : styles.feedbackError}`}
                >
                  {msg[p.id].text}
                </div>
              )}

              {p.status === "escrow" && p.booking_status === "completed" && (
                <div className={styles.actionRow}>
                  <button
                    className={`${styles.btn} ${styles.btnProcess}`}
                    onClick={() => handleProcess(p.id)}
                    disabled={processing[p.id]}
                  >
                    {processing[p.id]
                      ? "Processing..."
                      : `💸 Process Payout ${fmtMoney(p.amount, p.currency)}`}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Main AdminPayments ────────────────────────────────────────────────────────
export default function AdminPayments({ onBack }) {
  const [activeTab, setActiveTab] = useState("approvals");
  const [pendingCount, setPendingCount] = useState(0);
  const [bankCount, setBankCount] = useState(0);
  const [escrowCount, setEscrowCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    async function loadCounts() {
      try {
        const [pRes, bRes, eRes, cRes] = await Promise.all([
          fetch(`${API_URL}/api/payments/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/payments/bank-transfers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/payments/payouts?status=escrow`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/payments/crypto`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [pData, bData, eData, cData] = await Promise.all([
          pRes.json(),
          bRes.json(),
          eRes.json(),
          cRes.json(),
        ]);
        setPendingCount((pData.bookings || []).length);
        setBankCount(
          (bData.payments || []).filter(
            (b) => b.bank_transfer_status === "proof_submitted",
          ).length,
        );
        setEscrowCount(
          (eData.payouts || []).filter((p) => p.booking_status === "completed")
            .length,
        );
        setCryptoCount(
          (cData.payments || []).filter((p) => p.status === "pending").length,
        );
      } catch {}
    }
    loadCounts();
  }, []);

  const tabs = [
    { id: "approvals", label: "Approvals", badge: pendingCount },
    { id: "bank", label: "Bank Transfers", badge: bankCount },
    { id: "crypto", label: "Crypto", badge: cryptoCount },
    { id: "payouts", label: "Payouts", badge: escrowCount },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Payments</h1>
          </div>
          <button
            className={styles.backBtn}
            onClick={() => (onBack ? onBack() : navigate("/admin"))}
          >
            ← Back
          </button>
        </div>

        <div className={styles.tabBar}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {t.badge > 0 && (
                <span className={styles.tabBadge}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "approvals" && <PendingApprovals />}
        {activeTab === "bank" && <BankTransfers />}
        {activeTab === "crypto" && <CryptoPayments />}
        {activeTab === "payouts" && <Payouts />}
      </div>
    </div>
  );
}
