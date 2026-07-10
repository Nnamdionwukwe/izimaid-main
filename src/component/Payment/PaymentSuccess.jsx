import { FaCheck } from "react-icons/fa";
import styles from "./Payment.module.css";

export default function PaymentSuccess({ status, onViewBookings, onHome }) {
  const message =
    status === "success_bank"
      ? "Your bank transfer proof has been submitted. Admin will verify within 24 hours."
      : status === "success_crypto"
        ? "Your crypto payment proof has been submitted. Admin will verify the transaction on‑chain shortly."
        : "Payment received. Admin will review and confirm your booking shortly.";

  const title =
    status === "success_bank"
      ? "Proof Submitted!"
      : status === "success_crypto"
        ? "Crypto Proof Submitted!"
        : "Payment Successful!";

  return (
    <div className={styles.page}>
      <div className={`${styles.statusCard} ${styles.statusSuccess}`}>
        <div className={styles.statusIcon}>
          <FaCheck />
        </div>
        <p className={styles.statusTitle}>{title}</p>
        <p className={styles.statusText}>{message}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button className={styles.actionBtn} onClick={onViewBookings}>
            View My Bookings
          </button>
          <button className={styles.ghostBtn} onClick={onHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
