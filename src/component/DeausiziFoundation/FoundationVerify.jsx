// FoundationVerify.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./FoundationVerify.module.css";
import FixedHeader from "../FixedHeader";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FoundationVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [donationDetails, setDonationDetails] = useState(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const statusParam = searchParams.get("status");

    // If payment was cancelled
    if (statusParam === "cancelled") {
      setStatus("cancelled");
      setMessage(
        "Your donation was cancelled. Please try again if you'd like to support the foundation.",
      );
      setLoading(false);
      return;
    }

    if (!reference) {
      setStatus("error");
      setMessage(
        "No payment reference found. Please contact support if you've made a donation.",
      );
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/foundation/donations/verify?reference=${reference}`,
        );

        if (response.data.success) {
          setStatus("success");
          setMessage(
            response.data.message ||
              "Payment verified successfully! Thank you for your generous donation.",
          );
          setDonationDetails({
            reference: response.data.donation.reference,
            amount: response.data.donation.amount,
            status: response.data.donation.status,
          });
        } else {
          setStatus("error");
          setMessage(
            response.data.error ||
              "Payment verification failed. Please contact support.",
          );
        }
      } catch (error) {
        console.error("Verification error:", error);

        // Check if it's a network error
        if (error.message === "Network Error") {
          setStatus("error");
          setMessage(
            "Network error. Please check your connection and try again.",
          );
        } else if (error.response) {
          setStatus("error");
          setMessage(
            error.response.data?.error ||
              "Payment verification failed. Please contact support.",
          );
        } else {
          setStatus("error");
          setMessage("An unexpected error occurred. Please contact support.");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleRetry = () => {
    navigate("/foundation");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <FixedHeader />
        <div className={styles.container}>
          <div className={styles.verifyCard}>
            <div className={styles.spinner}></div>
            <h2 className={styles.verifyingTitle}>
              Verifying your donation...
            </h2>
            <p className={styles.verifyingText}>
              Please wait while we confirm your payment.
            </p>
            <p className={styles.verifyingSubtext}>
              This may take a few moments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <FixedHeader />
      <div className={styles.container}>
        <div className={styles.verifyCard}>
          {status === "success" && (
            <>
              <div className={styles.successIcon}>✅</div>
              <h2 className={styles.successTitle}>Payment Successful!</h2>
              <p className={styles.successMessage}>{message}</p>
              {donationDetails && (
                <div className={styles.donationDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Reference:</span>
                    <span className={styles.detailValue}>
                      {donationDetails.reference}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Amount:</span>
                    <span className={styles.detailValue}>
                      ₦{donationDetails.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span
                      className={`${styles.detailValue} ${styles.statusSuccess}`}
                    >
                      {donationDetails.status}
                    </span>
                  </div>
                </div>
              )}
              <p className={styles.followUpText}>
                A confirmation email has been sent to your email address. Thank
                you for making a difference in the lives of vulnerable families
                across Nigeria.
              </p>
              <div className={styles.buttonGroup}>
                <button className={styles.primaryBtn} onClick={handleGoHome}>
                  Return Home
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => navigate("/foundation")}
                >
                  Learn More About the Foundation
                </button>
              </div>
            </>
          )}

          {status === "cancelled" && (
            <>
              <div className={styles.cancelledIcon}>↩️</div>
              <h2 className={styles.cancelledTitle}>Donation Cancelled</h2>
              <p className={styles.cancelledMessage}>{message}</p>
              <p className={styles.followUpText}>
                Every donation, no matter the size, helps us serve more
                families. We hope you'll consider supporting us in the future.
              </p>
              <div className={styles.buttonGroup}>
                <button className={styles.primaryBtn} onClick={handleRetry}>
                  Try Again
                </button>
                <button className={styles.secondaryBtn} onClick={handleGoHome}>
                  Return Home
                </button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className={styles.errorIcon}>❌</div>
              <h2 className={styles.errorTitle}>Verification Failed</h2>
              <p className={styles.errorMessage}>{message}</p>
              <p className={styles.followUpText}>
                Please try again or contact our support team for assistance.
                We're here to help you with any issues.
              </p>
              <div className={styles.buttonGroup}>
                <button className={styles.primaryBtn} onClick={handleRetry}>
                  Try Again
                </button>
                <button className={styles.secondaryBtn} onClick={handleContact}>
                  Contact Support
                </button>
                <button className={styles.outlineBtn} onClick={handleGoHome}>
                  Return Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
