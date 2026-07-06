// src/pages/settings/components/SubscriptionSettings.jsx
import { useState } from "react";
import {
  Section,
  Toast,
  Badge,
  DangerButton,
  SecondaryButton,
  SaveButton,
  Skeleton,
} from "../../component/settings/SettingsUI";
import sub from "./Subscription.module.css";
import { useSubscription } from "../../pages/hooks/useSettings";

// ─── React Icons ──────────────────────────────────────────────
import {
  FaUser,
  FaBolt,
  FaStar,
  FaCrown,
  FaMedal,
  FaTicketAlt,
  FaCheck,
} from "react-icons/fa";

const PLAN_ICONS = {
  free: <FaUser />,
  basic: <FaBolt />,
  standard: <FaStar />,
  premium: <FaCrown />,
  pro_badge: <FaMedal />,
};
const CURRENCY_SYMBOLS = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "₵",
  KES: "KSh",
  ZAR: "R",
  UGX: "USh",
  CAD: "CA$",
  AUD: "A$",
};
function fmtAmt(n, c = "NGN") {
  return `${CURRENCY_SYMBOLS[c] || c + " "}${Number(n || 0).toLocaleString()}`;
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function daysLeft(d) {
  if (!d) return 0;
  return Math.max(0, Math.ceil((new Date(d) - Date.now()) / 86400000));
}

const STATUS_COLOR = {
  active: "green",
  trialing: "navy",
  past_due: "red",
  paused: "gray",
  cancelled: "gray",
  expired: "gray",
};

export default function SubscriptionSettings({ styles }) {
  const [view, setView] = useState("overview");
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [toast, setToast] = useState({ message: null, type: "success" });
  const [busy, setBusy] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [promo, setPromo] = useState("");
  const [promoResult, setPromoResult] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);

  function formatInterval(interval, planName) {
    if (!interval && !planName) return "month";
    // If the plan name suggests annual, override
    if (planName && /annual|yearly|year/i.test(planName)) {
      return "yearly";
    }
    const map = { annual: "yearly", year: "yearly", yearly: "yearly" };
    return map[interval] || interval || "month";
  }

  // ─── Annual plan helpers ─────────────────────────────────────
  function isAnnualPlan(plan) {
    if (!plan) return false;
    // Check plan interval or name
    if (plan.interval === "year" || plan.interval === "annual") return true;
    const name = (plan.display_name || plan.name || "").toLowerCase();
    return (
      name.includes("annual") ||
      name.includes("yearly") ||
      name.includes("year")
    );
  }

  function getEffectivePeriod(subData, activePlan, invoices) {
    if (!subData) return null;
    // Default: use the stored period
    const end = subData.current_period_end
      ? new Date(subData.current_period_end)
      : null;
    const start = subData.current_period_start
      ? new Date(subData.current_period_start)
      : null;

    // If annual, override with 1 year from the earliest invoice start
    if (isAnnualPlan(activePlan) && invoices && invoices.length > 0) {
      // Sort invoices by period_start ascending
      const sorted = [...invoices].sort(
        (a, b) => new Date(a.period_start) - new Date(b.period_start),
      );
      const first = sorted[0];
      if (first && first.period_start) {
        const startDate = new Date(first.period_start);
        const annualEnd = new Date(startDate);
        annualEnd.setFullYear(annualEnd.getFullYear() + 1);
        // If the computed end is still in the past, add another year (edge case)
        if (annualEnd < new Date()) {
          annualEnd.setFullYear(annualEnd.getFullYear() + 1);
        }
        return { start: startDate, end: annualEnd };
      }
    }
    // Fallback: use stored start/end (or infer start from end if missing)
    if (end && !start) {
      // For monthly, assume 30 days back (rough)
      const inferredStart = new Date(end);
      inferredStart.setDate(inferredStart.getDate() - 30);
      return { start: inferredStart, end };
    }
    return { start, end };
  }

  // ── Hook ──
  const {
    data,
    plans,
    loading,
    cancel,
    pause,
    resume,
    subscribe,
    changePlan,
    validatePromo,
  } = useSubscription(view === "plans" ? billingInterval : null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null, type: "success" }), 5000);
  }

  const subData = data?.subscription;
  const activePlan = plans.find((p) => p.id === subData?.plan_id);
  const isActive = ["active", "trialing"].includes(subData?.status);
  const isPaused = subData?.status === "paused";
  const isPastDue = subData?.status === "past_due";
  const noSub = !subData || ["cancelled", "expired"].includes(subData?.status);

  // ── Compute effective period ──────────────────────────────
  const effective = getEffectivePeriod(subData, activePlan, data?.invoices);
  const effectiveEnd = effective?.end;
  const effectiveStart = effective?.start;
  const effectiveDaysLeft = effectiveEnd
    ? daysLeft(effectiveEnd.toISOString())
    : 0;
  const effectiveTotalDays =
    effectiveStart && effectiveEnd
      ? Math.max(1, Math.ceil((effectiveEnd - effectiveStart) / 86400000))
      : 30; // fallback
  const progressW =
    effectiveStart && effectiveEnd
      ? `${Math.max(4, Math.min(100, 100 - (effectiveDaysLeft / effectiveTotalDays) * 100))}%`
      : `${Math.max(4, Math.min(100, 100 - (effectiveDaysLeft / 30) * 100))}%`;

  async function handlePromo() {
    if (!promo.trim()) return;
    setPromoLoading(true);
    setPromoResult(null);
    try {
      const r = await validatePromo(promo.trim().toUpperCase(), null);
      setPromoResult(r);
    } catch (err) {
      setPromoResult({ error: err.message });
    } finally {
      setPromoLoading(false);
    }
  }

  async function handleSubscribe(plan) {
    setBusy("sub_" + plan.id);
    try {
      const d = await subscribe(
        plan.id,
        "flutterwave",
        promoResult?.valid ? promo : undefined,
      );
      const url = d.authorization_url || d.url || d.checkout_url || d.link;
      if (url) {
        window.location.href = url;
        return;
      }
      showToast("✅ Subscription activated!");
    } catch (err) {
      showToast(err.message || "Subscription failed", "error");
    } finally {
      setBusy("");
    }
  }

  async function handleChangePlan(plan) {
    setBusy("chg_" + plan.id);
    try {
      const d = await changePlan(plan.id);
      const url = d.authorization_url || d.url || d.checkout_url || d.link;
      if (url) {
        window.location.href = url;
        return;
      }
      showToast(`✅ Switched to ${plan.display_name || plan.name}!`);
      setView("overview");
    } catch (err) {
      showToast(err.message || "Plan change failed", "error");
    } finally {
      setBusy("");
    }
  }

  async function handleCancel() {
    if (!cancelReason.trim()) {
      showToast("Please give a reason.", "error");
      return;
    }
    setBusy("cancel");
    try {
      await cancel(cancelReason.trim(), false);
      showToast(
        "Subscription cancelled. Access continues until billing period ends.",
      );
      setShowCancelForm(false);
      setCancelReason("");
    } catch (err) {
      showToast(err.message || "Cancellation failed", "error");
    } finally {
      setBusy("");
    }
  }

  async function handlePause() {
    setBusy("pause");
    try {
      await pause();
      showToast("Subscription paused. Resume anytime.");
    } catch (err) {
      showToast(err.message || "Pause failed", "error");
    } finally {
      setBusy("");
    }
  }

  async function handleResume() {
    setBusy("resume");
    try {
      await resume();
      showToast("✅ Subscription resumed!");
    } catch (err) {
      showToast(err.message || "Resume failed", "error");
    } finally {
      setBusy("");
    }
  }

  if (loading)
    return (
      <div className={styles.loadingSection}>
        <Skeleton height={120} />
        <Skeleton height={44} />
        <Skeleton height={44} />
      </div>
    );

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: null, type: "success" })}
      />

      {/* View toggle */}
      <div className={styles.section}>
        <div className={sub.toggleWrap}>
          {[
            ["overview", "My Plan"],
            ["plans", "All Plans"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`${sub.toggleBtn} ${view === v ? sub.toggleBtnActive : ""}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ══ OVERVIEW ══ */}
      {view === "overview" && (
        <>
          {noSub && (
            <Section
              title="Your plan"
              description="Upgrade to get more bookings, priority matching, and exclusive discounts."
            >
              <div className={sub.freePlanCard}>
                <span className={sub.freePlanIcon}>
                  <FaUser />
                </span>
                <div>
                  <p className={sub.freePlanName}>Free plan</p>
                  <p className={sub.freePlanHint}>
                    {data?.bookings_used || 0} of 2 bookings used this month
                  </p>
                </div>
              </div>
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
              <div className={styles.formFooter}>
                <SaveButton onClick={() => setView("plans")}>
                  View plans →
                </SaveButton>
              </div>
            </Section>
          )}

          {!noSub && (
            <Section title="Your plan">
              <div className={sub.planHeader}>
                <div className={sub.planHeaderTop}>
                  <div className={sub.planHeaderLeft}>
                    <div className={sub.planBadgeRow}>
                      <Badge color={STATUS_COLOR[subData.status] || "gray"}>
                        {subData.status}
                      </Badge>
                      {subData.cancel_at_period_end && (
                        <Badge color="red">
                          Cancels{" "}
                          {fmtDate(
                            effectiveEnd?.toISOString() ||
                              subData.current_period_end,
                          )}
                        </Badge>
                      )}
                    </div>
                    <p className={sub.planHeaderName}>
                      {PLAN_ICONS[activePlan?.name] || <FaStar />}{" "}
                      {activePlan?.display_name ||
                        activePlan?.name ||
                        "Premium"}
                    </p>
                    <p className={sub.planHeaderMeta}>
                      {isActive &&
                        `${effectiveDaysLeft} day${
                          effectiveDaysLeft !== 1 ? "s" : ""
                        } remaining · `}
                      {subData.cancel_at_period_end ? "Cancels" : "Renews"}{" "}
                      {fmtDate(
                        effectiveEnd?.toISOString() ||
                          subData.current_period_end,
                      )}
                    </p>
                  </div>
                  <div className={sub.planHeaderRight}>
                    <p className={sub.planHeaderPrice}>
                      {fmtAmt(subData.amount, subData.currency)}
                    </p>
                    <p className={sub.planHeaderInterval}>
                      /
                      {formatInterval(
                        subData.interval,
                        activePlan?.display_name || activePlan?.name,
                      )}
                    </p>
                  </div>
                </div>
                {isActive && (
                  <div className={sub.planProgressWrap}>
                    <div
                      className={sub.planProgressFill}
                      style={{ width: progressW }}
                    />
                  </div>
                )}
              </div>

              {data?.bookings_limit && (
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

              {activePlan?.features?.length > 0 && (
                <div className={sub.featuresList}>
                  {activePlan.features.map((f, i) => (
                    <div key={i} className={sub.featureRow}>
                      <span className={sub.featureCheck}>
                        <FaCheck />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              )}

              <div className={sub.actionRow}>
                {isActive && !subData.cancel_at_period_end && (
                  <SecondaryButton
                    onClick={() => setView("plans")}
                    disabled={!!busy}
                  >
                    Change Plan
                  </SecondaryButton>
                )}
                {isPastDue && (
                  <SaveButton onClick={() => setView("plans")}>
                    Update Payment
                  </SaveButton>
                )}
              </div>
            </Section>
          )}

          {data?.invoices?.length > 0 && (
            <Section title="Billing history">
              <div className={sub.invoiceList}>
                {data.invoices.map((inv) => (
                  <div key={inv.id} className={sub.invoiceRow}>
                    <div>
                      <p className={sub.invoicePeriod}>
                        {fmtDate(inv.period_start)} –{" "}
                        {fmtDate(
                          effectiveEnd?.toISOString() ||
                            subData?.current_period_end,
                        )}
                      </p>
                      <p className={sub.invoiceDate}>
                        Paid {fmtDate(inv.paid_at || inv.created_at)}
                      </p>
                    </div>
                    <span className={sub.invoiceAmt}>
                      {fmtAmt(inv.amount, inv.currency)}
                    </span>
                    <Badge color={inv.status === "paid" ? "green" : "red"}>
                      {inv.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {isActive && !subData?.cancel_at_period_end && (
            <Section
              title="Cancel subscription"
              description={`You'll keep access until ${fmtDate(
                effectiveEnd?.toISOString() || subData?.current_period_end,
              )}.`}
            >
              {!showCancelForm ? (
                <DangerButton onClick={() => setShowCancelForm(true)}>
                  Cancel subscription
                </DangerButton>
              ) : (
                <div>
                  <p className={sub.cancelLabel}>
                    Why are you cancelling? (required)
                  </p>
                  <textarea
                    className={sub.cancelTextarea}
                    rows={3}
                    placeholder="Tell us why you're leaving…"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <div className={sub.cancelActions}>
                    <DangerButton
                      loading={busy === "cancel"}
                      onClick={handleCancel}
                    >
                      Confirm cancellation
                    </DangerButton>
                    <SecondaryButton
                      onClick={() => {
                        setShowCancelForm(false);
                        setCancelReason("");
                      }}
                    >
                      Keep subscription
                    </SecondaryButton>
                  </div>
                </div>
              )}
            </Section>
          )}
        </>
      )}

      {/* ══ PLANS ══ */}
      {view === "plans" && (
        <>
          <Section title="Payment method">
            <div className={sub.intervalToggle}>
              {[
                ["monthly", "Monthly"],
                ["annual", "Annual (save 20%)"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setBillingInterval(v)}
                  className={`${sub.intervalBtn} ${billingInterval === v ? sub.intervalBtnActive : ""}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <label className={sub.promoLabel}>
              <FaTicketAlt /> Promo code
            </label>
            <div className={sub.promoRow}>
              <input
                className={sub.promoInput}
                placeholder="e.g. SPARKLE20"
                value={promo}
                onChange={(e) => {
                  setPromo(e.target.value.toUpperCase());
                  setPromoResult(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handlePromo()}
              />
              <button
                className={sub.promoBtn}
                disabled={promoLoading || !promo.trim()}
                onClick={handlePromo}
              >
                {promoLoading ? <span className={sub.spinnerDark} /> : "Apply"}
              </button>
            </div>
            {promoResult?.valid && (
              <p className={sub.promoSuccess}>
                ✅ Code valid — {promoResult.discount_percent}% off
              </p>
            )}
            {promoResult?.error && (
              <p className={sub.promoError}>❌ {promoResult.error}</p>
            )}
          </Section>

          <Section title="Choose a plan">
            {plans.length === 0 ? (
              <p className={styles.hint}>No plans available right now.</p>
            ) : (
              <div className={sub.plansGrid}>
                {plans.map((plan) => {
                  const isCurrent = subData?.plan_id === plan.id && isActive;
                  const discount = promoResult?.valid
                    ? Number(promoResult.discount_percent || 0)
                    : 0;
                  const finalPrice = plan.price * (1 - discount / 100);
                  const isLoading =
                    busy === `sub_${plan.id}` || busy === `chg_${plan.id}`;
                  const showBadge = isCurrent || plan.is_popular;

                  return (
                    <div
                      key={plan.id}
                      className={`${sub.planCard} ${isCurrent ? sub.planCardCurrent : ""} ${plan.is_popular && !isCurrent ? sub.planCardPopular : ""}`}
                    >
                      {showBadge && (
                        <div
                          className={`${sub.planCardBadge} ${isCurrent ? sub.planCardBadgeCurrent : sub.planCardBadgePopular}`}
                        >
                          {isCurrent ? "Your plan" : "Most popular"}
                        </div>
                      )}

                      <p
                        className={`${sub.planCardName} ${showBadge ? sub.planCardNameOffset : ""}`}
                      >
                        {PLAN_ICONS[plan.name] || <FaStar />}{" "}
                        {plan.display_name || plan.name}
                      </p>

                      <div className={sub.planPriceRow}>
                        {discount > 0 && (
                          <span className={sub.planPriceStrike}>
                            {fmtAmt(plan.price, plan.currency)}
                          </span>
                        )}
                        <span className={sub.planPriceMain}>
                          {fmtAmt(finalPrice, plan.currency)}
                        </span>
                        <span className={sub.planPriceInterval}>
                          /
                          {formatInterval(
                            plan.interval,
                            plan.display_name || plan.name,
                          )}
                        </span>
                      </div>

                      {plan.trial_days > 0 && (
                        <span className={sub.trialBadge}>
                          {plan.trial_days}-day free trial
                        </span>
                      )}

                      <div className={sub.planFeatures}>
                        {plan.features?.slice(0, 4).map((f, i) => (
                          <div key={i} className={sub.planFeatureRow}>
                            <span className={sub.planFeatureTick}>
                              <FaCheck />
                            </span>{" "}
                            {f}
                          </div>
                        ))}
                      </div>

                      <div className={sub.planCta}>
                        {isCurrent ? (
                          <p className={sub.planCtaCurrent}>✓ Current plan</p>
                        ) : (
                          <button
                            className={sub.planCtaBtn}
                            disabled={!!busy}
                            onClick={() =>
                              isActive
                                ? handleChangePlan(plan)
                                : handleSubscribe(plan)
                            }
                          >
                            {isLoading && <span className={sub.spinnerDark} />}
                            {isLoading
                              ? "Processing…"
                              : isActive
                                ? "Switch to this plan"
                                : plan.trial_days > 0
                                  ? `Start ${plan.trial_days}-day trial`
                                  : "Subscribe"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className={sub.plansFootnote}>
              🔒 Secured by Flutterwave · Cancel anytime · Receipt sent by email
            </p>
          </Section>
        </>
      )}
    </div>
  );
}
