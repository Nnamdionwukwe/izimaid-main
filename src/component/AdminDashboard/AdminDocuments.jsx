import { useState, useEffect, useCallback } from "react";
import styles from "./AdminDocuments.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const DOC_TYPE_LABELS = {
  national_id: "National ID",
  passport: "Passport",
  drivers_license: "Driver's License",
  utility_bill: "Utility Bill",
};

function formatDate(d) {
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

function statusClass(status) {
  if (status === "approved") return styles.statusApproved;
  if (status === "rejected") return styles.statusRejected;
  return styles.statusPending;
}

function statusLabel(status) {
  if (status === "approved") return "✅ Approved";
  if (status === "rejected") return "❌ Rejected";
  return "⏳ Pending";
}

// ── Review Modal ──────────────────────────────────────────────────────────────
function ReviewModal({ doc, onClose, onReviewed }) {
  const [decision, setDecision] = useState("approved");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  async function handleSubmit() {
    if (decision === "rejected" && !notes.trim()) return;
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/admin/documents/${doc.id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: decision,
            admin_notes: notes.trim() || null,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to review document");
        return;
      }
      onReviewed(data.document);
      onClose();
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHandle} />

        {/* Maid info */}
        <div className={styles.modalMaidRow}>
          {doc.maid_avatar && !imgError ? (
            <img
              src={doc.maid_avatar}
              alt={doc.maid_name}
              className={styles.modalAvatar}
            />
          ) : (
            <div className={styles.modalAvatarPlaceholder}>
              {initials(doc.maid_name)}
            </div>
          )}
          <div>
            <p className={styles.modalMaidName}>{doc.maid_name}</p>
            <p className={styles.modalMaidEmail}>{doc.maid_email}</p>
          </div>
          <span className={styles.modalDocTypeBadge}>
            {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
          </span>
        </div>

        {/* Document image */}
        <div className={styles.docImageWrap}>
          {imgError ? (
            <div className={styles.docImageFallback}>
              <div className={styles.docImageFallbackIcon}>📄</div>
              <p className={styles.docImageFallbackText}>
                PDF or non-displayable file
              </p>
              <a
                href={doc.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openDocLink}
              >
                Open document →
              </a>
            </div>
          ) : (
            <img
              src={doc.doc_url}
              alt="Document"
              className={styles.docImage}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <a
          href={doc.doc_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewFullLink}
        >
          🔗 Open full document in new tab
        </a>

        {/* Decision */}
        <p className={styles.sectionLabel}>Decision</p>
        <div className={styles.decisionRow}>
          <button
            className={`${styles.decisionBtn} ${styles.decisionBtnApprove} ${decision === "approved" ? styles.decisionBtnApproveActive : ""}`}
            onClick={() => setDecision("approved")}
          >
            ✅ Approve
          </button>
          <button
            className={`${styles.decisionBtn} ${styles.decisionBtnReject} ${decision === "rejected" ? styles.decisionBtnRejectActive : ""}`}
            onClick={() => setDecision("rejected")}
          >
            ❌ Reject
          </button>
        </div>

        <p className={styles.sectionLabel}>
          Notes {decision === "rejected" ? "(required)" : "(optional)"}
        </p>
        <textarea
          className={styles.notesTextarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={
            decision === "rejected"
              ? "Explain why the document is rejected..."
              : "Add any notes for the maid..."
          }
        />

        {error && <p className={styles.errorMsg}>{error}</p>}

        <div className={styles.modalActions}>
          <button
            className={styles.modalBtn}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className={
              decision === "approved"
                ? styles.modalBtnApprove
                : styles.modalBtnReject
            }
            onClick={handleSubmit}
            disabled={saving || (decision === "rejected" && !notes.trim())}
          >
            {saving
              ? "Submitting..."
              : `Confirm ${decision === "approved" ? "Approval" : "Rejection"}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDocuments({ onBack }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/admin/documents?status=${statusFilter}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setDocs(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  function handleReviewed(updatedDoc) {
    if (statusFilter === "pending") {
      setDocs((prev) => prev.filter((d) => d.id !== updatedDoc.id));
    } else {
      setDocs((prev) =>
        prev.map((d) => (d.id === updatedDoc.id ? { ...d, ...updatedDoc } : d)),
      );
    }
  }

  const pendingCount = docs.filter((d) => d.status === "pending").length;

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Document Review</h1>
            {pendingCount > 0 && (
              <span className={styles.headerBadge}>{pendingCount} pending</span>
            )}
          </div>
          <button className={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
        </div>

        <div className={styles.filterBar}>
          {["pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.filterBtnActive : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading documents...</div>
        ) : docs.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📄</div>
            <p className={styles.emptyText}>No {statusFilter} documents</p>
          </div>
        ) : (
          <div className={styles.docList}>
            {docs.map((doc) => (
              <div
                key={doc.id}
                className={`${styles.docCard} ${doc.status === "pending" ? styles.docCardPending : ""}`}
              >
                {/* Maid row */}
                <div className={styles.docCardTop}>
                  {doc.maid_avatar ? (
                    <img
                      src={doc.maid_avatar}
                      alt={doc.maid_name}
                      className={styles.avatar}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {initials(doc.maid_name)}
                    </div>
                  )}
                  <div className={styles.maidInfo}>
                    <p className={styles.maidName}>{doc.maid_name}</p>
                    <p className={styles.maidEmail}>{doc.maid_email}</p>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${statusClass(doc.status)}`}
                  >
                    {statusLabel(doc.status)}
                  </span>
                </div>

                {/* Doc type + dates */}
                <div className={styles.docMeta}>
                  <div>
                    <p className={styles.docType}>
                      {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                    </p>
                    <p className={styles.docDate}>
                      Submitted {formatDate(doc.submitted_at)}
                    </p>
                  </div>
                  {doc.reviewed_at && (
                    <p className={styles.docDateRight}>
                      Reviewed {formatDate(doc.reviewed_at)}
                    </p>
                  )}
                </div>

                {/* Admin notes */}
                {doc.admin_notes && (
                  <div
                    className={`${styles.docNotes} ${
                      doc.status === "approved"
                        ? styles.docNotesApproved
                        : styles.docNotesRejected
                    }`}
                  >
                    <strong>Notes:</strong> {doc.admin_notes}
                  </div>
                )}

                {/* Actions */}
                <div className={styles.docActions}>
                  <a
                    href={doc.doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionBtn}
                  >
                    🔗 View
                  </a>
                  <button
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    {doc.status === "pending" ? "Review Now" : "Re-review"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDoc && (
        <ReviewModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onReviewed={handleReviewed}
        />
      )}
    </div>
  );
}
