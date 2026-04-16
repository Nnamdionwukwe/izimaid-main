// src/pages/settings/components/SubscriptionSettings.jsx
import { useState } from "react";
import styles from "../../pages/settings/Settings.module.css";
import {
  Section,
  DangerButton,
  Badge,
  Toast,
  SecondaryButton,
} from "./SettingsUI";
import { useSubscription } from "../../pages/hooks/useSettings";

const PLAN_ICONS = {
  free: "🆓",
  basic: "⚡",
  standard: "⭐",
  premium: "👑",
  pro_badge: "🏅",
};

function InvoiceRow({ invoice }) {
  return (
    <div className={styles.invoiceRow}>
      <div>
        <div className={styles.invoicePeriod}>
          {new Date(invoice.period_start).toLocaleDateString()} –{" "}
          {new Date(invoice.period_end).toLocaleDateString()}
        </div>
        <div className={styles.invoiceDate}>
          {new Date(invoice.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className={styles.invoiceAmount}>
        {invoice.currency} {Number(invoice.amount).toLocaleString()}
      </div>
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
      <div className={styles.loadingSection}>
        <div className={styles.skeleton} style={{ height: 120 }} />
        <div className={styles.skeleton} style={{ height: 44 }} />
      </div>
    );
  }

  const sub = data?.subscription;
  const plan = data?.plan;

  const statusColor =
    {
      active: "green",
      trialing: "navy",
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
        <div className={styles.currentPlan}>
          {sub ? (
            <>
              <div className={styles.currentPlanHeader}>
                <div>
                  <div className={styles.currentPlanName}>
                    {PLAN_ICONS[plan?.name]}{" "}
                    {plan?.display_name || sub.plan_name}
                  </div>
                  <div className={styles.currentPlanMeta}>
                    <Badge color={statusColor}>{sub.status}</Badge>
                    <span className={styles.hint}>
                      {sub.cancel_at_period_end
                        ? `Cancels on ${new Date(sub.current_period_end).toDateString()}`
                        : `Renews ${new Date(sub.current_period_end).toDateString()}`}
                    </span>
                  </div>
                </div>
                <div>
                  <span className={styles.planAmount}>
                    {sub.currency} {Number(sub.amount).toLocaleString()}
                  </span>
                  <span className={styles.planInterval}>/{sub.interval}</span>
                </div>
              </div>

              {data.bookings_limit && (
                <div className={styles.usageWrap}>
                  <div className={styles.usageLabel}>
                    <span>Bookings this period</span>
                    <span>
                      {data.bookings_used} / {data.bookings_limit}
                    </span>
                  </div>
                  <div className={styles.usageBar}>
                    <div
                      className={styles.usageFill}
                      style={{
                        width: `${Math.min(100, (data.bookings_used / data.bookings_limit) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.currentPlanName}>🆓 Free plan</div>
              <p className={styles.hint} style={{ marginTop: 8 }}>
                You're on the free plan. Upgrade to unlock more bookings and
                discounts.
              </p>
              <div className={styles.usageWrap}>
                <div className={styles.usageLabel}>
                  <span>Bookings used</span>
                  <span>{data?.bookings_used || 0} / 2</span>
                </div>
                <div className={styles.usageBar}>
                  <div
                    className={styles.usageFill}
                    style={{
                      width: `${Math.min(100, ((data?.bookings_used || 0) / 2) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Invoice history */}
      {data?.invoices?.length > 0 && (
        <Section title="Billing history">
          <div className={styles.invoiceList}>
            {data.invoices.map((inv) => (
              <InvoiceRow key={inv.id} invoice={inv} />
            ))}
          </div>
        </Section>
      )}

      {/* Upgrade CTA */}
      {(!sub || sub.status === "cancelled") && (
        <Section title="Upgrade your plan">
          <p className={styles.hint} style={{ marginBottom: 16 }}>
            Get more bookings, better matching, and exclusive discounts.
          </p>
          <a
            href="/pricing"
            className={styles.btnPrimary}
            style={{ display: "inline-flex" }}
          >
            View all plans →
          </a>
        </Section>
      )}

      {/* Cancel */}
      {sub && !sub.cancel_at_period_end && sub.status === "active" && (
        <Section title="Cancel subscription">
          {!showCancel ? (
            <div>
              <p className={styles.hint} style={{ marginBottom: 12 }}>
                You'll keep access until{" "}
                {new Date(sub.current_period_end).toDateString()}. Your plan
                won't renew after that.
              </p>
              <DangerButton onClick={() => setShowCancel(true)}>
                Cancel subscription
              </DangerButton>
            </div>
          ) : (
            <div className={styles.cancelForm}>
              <p className={styles.fieldLabel} style={{ marginBottom: 8 }}>
                Why are you cancelling? (required)
              </p>
              <textarea
                className={styles.input}
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tell us why you're leaving…"
                style={{ resize: "vertical", width: "100%" }}
              />
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <DangerButton loading={cancelling} onClick={handleCancel}>
                  Confirm cancellation
                </DangerButton>
                <SecondaryButton onClick={() => setShowCancel(false)}>
                  Keep subscription
                </SecondaryButton>
              </div>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
