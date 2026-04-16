// src/pages/settings/components/SubscriptionSettings.jsx
import { useState } from "react";
import { useSubscription } from "../../../hooks/useSettings";
import { Section, DangerButton, Badge, Toast } from "./SettingsUI";

const PLAN_COLORS = {
  free: "gray",
  basic: "blue",
  standard: "green",
  premium: "purple",
  pro_badge: "gold",
};

const PLAN_ICONS = {
  free: "🆓",
  basic: "⚡",
  standard: "⭐",
  premium: "👑",
  pro_badge: "🏅",
};

function PlanCard({ plan, isCurrent, onUpgrade }) {
  const color = PLAN_COLORS[plan.name] || "blue";
  return (
    <div className={`ds-plan-card ${isCurrent ? "ds-plan-card-current" : ""}`}>
      <div className="ds-plan-header">
        <span className="ds-plan-icon">{PLAN_ICONS[plan.name] || "📦"}</span>
        <div>
          <div className="ds-plan-name">{plan.display_name}</div>
          {isCurrent && <Badge color={color}>Current plan</Badge>}
        </div>
        {plan.is_featured && !isCurrent && (
          <Badge color="green">Most popular</Badge>
        )}
      </div>

      <div className="ds-plan-price">
        {plan.price === 0 ? (
          <span>Free</span>
        ) : (
          <>
            <span className="ds-plan-amount">
              {plan.currency} {Number(plan.price).toLocaleString()}
            </span>
            <span className="ds-plan-interval">
              /{plan.interval || "month"}
            </span>
          </>
        )}
      </div>

      <ul className="ds-plan-features">
        {(plan.features || []).slice(0, 4).map((f, i) => (
          <li key={i}>✓ {f}</li>
        ))}
      </ul>

      {!isCurrent && (
        <button
          className="ds-btn-primary"
          style={{ width: "100%", marginTop: 16 }}
          onClick={() => onUpgrade(plan)}
        >
          {plan.price === 0 ? "Downgrade" : "Upgrade"}
        </button>
      )}
    </div>
  );
}

function InvoiceRow({ invoice }) {
  const date = new Date(invoice.created_at).toLocaleDateString();
  const amount = `${invoice.currency} ${Number(invoice.amount).toLocaleString()}`;
  return (
    <div className="ds-invoice-row">
      <div>
        <div className="ds-invoice-period">
          {new Date(invoice.period_start).toLocaleDateString()} –{" "}
          {new Date(invoice.period_end).toLocaleDateString()}
        </div>
        <div className="ds-invoice-date">{date}</div>
      </div>
      <div className="ds-invoice-amount">{amount}</div>
      <Badge color={invoice.status === "paid" ? "green" : "red"}>
        {invoice.status}
      </Badge>
    </div>
  );
}

export default function SubscriptionSettings() {
  const { data, loading, cancel } = useSubscription();
  const [cancelling, setCancelling] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [toast, setToast] = useState(null);

  async function handleCancel() {
    if (!cancelReason.trim()) {
      setToast({
        message: "Please give a reason for cancelling",
        type: "error",
      });
      return;
    }
    setCancelling(true);
    try {
      await cancel(cancelReason, false);
      setToast({
        message: "Subscription cancelled at end of billing period.",
        type: "success",
      });
      setShowCancel(false);
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="ds-loading-section">
        <div
          className="ds-skeleton"
          style={{ height: 120, marginBottom: 16 }}
        />
        <div className="ds-skeleton" style={{ height: 44 }} />
      </div>
    );
  }

  const sub = data?.subscription;
  const plan = data?.plan;

  const statusColor =
    {
      active: "green",
      trialing: "blue",
      past_due: "red",
      paused: "gray",
      cancelled: "red",
    }[sub?.status] || "gray";

  return (
    <div>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Current plan */}
      <Section title="Your plan">
        {sub ? (
          <div className="ds-current-plan">
            <div className="ds-current-plan-header">
              <div>
                <div className="ds-current-plan-name">
                  {PLAN_ICONS[plan?.name]} {plan?.display_name || sub.plan_name}
                </div>
                <div className="ds-current-plan-meta">
                  <Badge color={statusColor}>{sub.status}</Badge>
                  <span className="ds-hint">
                    {sub.cancel_at_period_end
                      ? `Cancels on ${new Date(sub.current_period_end).toDateString()}`
                      : `Renews ${new Date(sub.current_period_end).toDateString()}`}
                  </span>
                </div>
              </div>
              <div className="ds-current-plan-price">
                <span className="ds-plan-amount">
                  {sub.currency} {Number(sub.amount).toLocaleString()}
                </span>
                <span className="ds-plan-interval">/{sub.interval}</span>
              </div>
            </div>

            {/* Usage */}
            {data.bookings_limit && (
              <div className="ds-usage-bar-wrap">
                <div className="ds-usage-label">
                  <span>Bookings this period</span>
                  <span>
                    {data.bookings_used} / {data.bookings_limit}
                  </span>
                </div>
                <div className="ds-usage-bar">
                  <div
                    className="ds-usage-fill"
                    style={{
                      width: `${Math.min(100, (data.bookings_used / data.bookings_limit) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="ds-current-plan">
            <div className="ds-current-plan-name">🆓 Free plan</div>
            <p className="ds-hint" style={{ marginTop: 8 }}>
              You're on the free plan. Upgrade to unlock more bookings and
              discounts.
            </p>
            <div className="ds-usage-label" style={{ marginTop: 12 }}>
              <span>Bookings used</span>
              <span>{data?.bookings_used || 0} / 2</span>
            </div>
            <div className="ds-usage-bar">
              <div
                className="ds-usage-fill"
                style={{
                  width: `${Math.min(100, ((data?.bookings_used || 0) / 2) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </Section>

      {/* Invoice history */}
      {data?.invoices?.length > 0 && (
        <Section title="Billing history">
          <div className="ds-invoice-list">
            {data.invoices.map((inv) => (
              <InvoiceRow key={inv.id} invoice={inv} />
            ))}
          </div>
        </Section>
      )}

      {/* Upgrade CTA */}
      {(!sub || sub.status === "cancelled") && (
        <Section title="Upgrade your plan">
          <p className="ds-hint" style={{ marginBottom: 16 }}>
            Get more bookings, better matching, and exclusive discounts.
          </p>
          <a
            href="/pricing"
            className="ds-btn-primary"
            style={{ display: "inline-block" }}
          >
            View all plans →
          </a>
        </Section>
      )}

      {/* Cancel subscription */}
      {sub && !sub.cancel_at_period_end && sub.status === "active" && (
        <Section title="Cancel subscription">
          {!showCancel ? (
            <div>
              <p className="ds-hint" style={{ marginBottom: 12 }}>
                You'll keep access until{" "}
                {new Date(sub.current_period_end).toDateString()}. Your plan
                won't renew after that.
              </p>
              <DangerButton onClick={() => setShowCancel(true)}>
                Cancel subscription
              </DangerButton>
            </div>
          ) : (
            <div className="ds-cancel-form">
              <p className="ds-label" style={{ marginBottom: 8 }}>
                Why are you cancelling? (required)
              </p>
              <textarea
                className="ds-input"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tell us why you're leaving…"
                style={{ resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <DangerButton loading={cancelling} onClick={handleCancel}>
                  Confirm cancellation
                </DangerButton>
                <button
                  type="button"
                  className="ds-btn-secondary"
                  onClick={() => setShowCancel(false)}
                >
                  Keep subscription
                </button>
              </div>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
