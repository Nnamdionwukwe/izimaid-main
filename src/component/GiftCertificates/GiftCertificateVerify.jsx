// GiftCertificateVerify.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./GiftCertificateVerify.module.css";
import FixedHeader from "../FixedHeader";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function GiftCertificateVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [certificateDetails, setCertificateDetails] = useState(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const statusParam = searchParams.get("status");

    // If payment was cancelled
    if (statusParam === "cancelled") {
      setStatus("cancelled");
      setMessage(
        "Your gift certificate purchase was cancelled. Please try again if you'd like to give this thoughtful gift.",
      );
      setLoading(false);
      return;
    }

    if (!reference) {
      setStatus("error");
      setMessage(
        "No payment reference found. Please contact support if you've made a purchase.",
      );
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/gift-certificates/certificates/verify?reference=${reference}`,
        );

        if (response.data.success) {
          setStatus("success");
          setMessage(
            response.data.message ||
              "Payment verified successfully! Your gift certificate is ready.",
          );
          setCertificateDetails({
            code: response.data.certificate.code,
            amount: response.data.certificate.amount,
            from: response.data.certificate.from,
            to: response.data.certificate.to,
            status: response.data.certificate.status,
            expiresAt: response.data.certificate.expiresAt,
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
    navigate("/gift-certificates");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  const handleViewCertificate = () => {
    // Navigate to certificate details or download
    navigate("/gift-certificates");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <FixedHeader />
        <div className={styles.container}>
          <div className={styles.verifyCard}>
            <div className={styles.spinner}></div>
            <h2 className={styles.verifyingTitle}>
              Verifying your gift certificate...
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
              <div className={styles.successIcon}>🎉</div>
              <h2 className={styles.successTitle}>Gift Certificate Ready!</h2>
              <p className={styles.successMessage}>{message}</p>

              {certificateDetails && (
                <div className={styles.certificateCard}>
                  <div className={styles.certificateHeader}>
                    <span className={styles.certificateEmoji}>🎁</span>
                    <div>
                      <p className={styles.certificateBrand}>Deusizi Sparkle</p>
                      <p className={styles.certificateType}>Gift Certificate</p>
                    </div>
                  </div>

                  <div className={styles.certificateAmount}>
                    ₦{certificateDetails.amount.toLocaleString()}
                  </div>

                  <div className={styles.certificateDetails}>
                    <div className={styles.certificateRow}>
                      <span className={styles.certificateLabel}>From:</span>
                      <span className={styles.certificateValue}>
                        {certificateDetails.from}
                      </span>
                    </div>
                    <div className={styles.certificateRow}>
                      <span className={styles.certificateLabel}>For:</span>
                      <span className={styles.certificateValue}>
                        {certificateDetails.to}
                      </span>
                    </div>
                    <div className={styles.certificateRow}>
                      <span className={styles.certificateLabel}>Code:</span>
                      <span className={styles.certificateCode}>
                        {certificateDetails.code}
                      </span>
                    </div>
                    <div className={styles.certificateRow}>
                      <span className={styles.certificateLabel}>Expires:</span>
                      <span className={styles.certificateValue}>
                        {new Date(
                          certificateDetails.expiresAt,
                        ).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className={styles.certificateRow}>
                      <span className={styles.certificateLabel}>Status:</span>
                      <span
                        className={`${styles.certificateValue} ${styles.statusActive}`}
                      >
                        ✅ Active
                      </span>
                    </div>
                  </div>

                  <div className={styles.certificateFooter}>
                    <span className={styles.certificateFooterText}>
                      Professional Home Cleaning · Abuja & Lagos
                    </span>
                  </div>
                </div>
              )}

              <p className={styles.followUpText}>
                Your gift certificate has been sent to the recipient's email
                address. They can use the unique code above to book any cleaning
                service on our platform.
              </p>

              <div className={styles.buttonGroup}>
                <button
                  className={styles.primaryBtn}
                  onClick={handleViewCertificate}
                >
                  View Certificate
                </button>
                <button className={styles.secondaryBtn} onClick={handleGoHome}>
                  Return Home
                </button>
              </div>
            </>
          )}

          {status === "cancelled" && (
            <>
              <div className={styles.cancelledIcon}>↩️</div>
              <h2 className={styles.cancelledTitle}>Purchase Cancelled</h2>
              <p className={styles.cancelledMessage}>{message}</p>
              <p className={styles.followUpText}>
                No worries! You can try again whenever you're ready to give the
                gift of a clean home.
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
