import { useState, useEffect, useCallback } from "react";
import styles from "./AdminPages.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

const ACTION_BADGE = {
  ban_user: styles.badgeRed,
  unban_user: styles.badgeGreen,
  delete_user: styles.badgeRed,
  impersonate_user: styles.badgePurple,
  update_user: styles.badgeBlue,
  update_maid_profile: styles.badgeBlue,
  document_approved: styles.badgeGreen,
  document_rejected: styles.badgeRed,
  update_booking_status: styles.badgeAmber,
  resolve_sos: styles.badgeGreen,
  update_setting: styles.badgeAmber,
};

export default function AdminAuditLog({ onBack }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // Filters
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const LIMIT = 50;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (actionFilter) params.set("action", actionFilter);
      if (entityFilter) params.set("entity_type", entityFilter);
      if (fromFilter) params.set("date_from", fromFilter);
      if (toFilter) params.set("date_to", toFilter);
      const res = await fetch(`${API_URL}/api/admin/audit?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(data.logs || []);
      setHasMore((data.logs || []).length === LIMIT);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter, entityFilter, fromFilter, toFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  useEffect(() => {
    setPage(1);
  }, [actionFilter, entityFilter, fromFilter, toFilter]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Audit Log</h1>
          </div>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {/* Filters */}
        <div className={styles.toolbar}>
          <select
            className={styles.selectFilter}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All actions</option>
            {[
              "ban_user",
              "unban_user",
              "delete_user",
              "impersonate_user",
              "update_user",
              "update_maid_profile",
              "document_approved",
              "document_rejected",
              "update_booking_status",
              "resolve_sos",
              "update_setting",
            ].map((a) => (
              <option key={a} value={a}>
                {a.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <select
            className={styles.selectFilter}
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
          >
            <option value="">All entities</option>
            {["user", "booking", "maid_document", "platform"].map((e) => (
              <option key={e} value={e}>
                {e.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <input
            className={styles.dateInput}
            type="date"
            value={fromFilter}
            onChange={(e) => setFromFilter(e.target.value)}
          />
          <input
            className={styles.dateInput}
            type="date"
            value={toFilter}
            onChange={(e) => setToFilter(e.target.value)}
          />
        </div>

        <p className={styles.sectionTitle}>
          Admin Actions
          <span className={styles.sectionCount}>{logs.length}</span>
        </p>

        {loading ? (
          <div className={styles.loading}>Loading audit log...</div>
        ) : logs.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyText}>No audit log entries found</p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Admin</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Entity ID</th>
                    <th>IP</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <>
                      <tr key={log.id}>
                        <td className={styles.tdMuted}>
                          {formatDate(log.created_at)}
                        </td>
                        <td>
                          <span className={styles.tdBold}>
                            {log.admin_name}
                          </span>
                          <br />
                          <span className={styles.tdMuted}>
                            {log.admin_email}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.badge} ${ACTION_BADGE[log.action] || styles.badgeGray}`}
                          >
                            {log.action?.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className={styles.tdMuted}>{log.entity_type}</td>
                        <td
                          className={styles.tdMuted}
                          style={{ fontFamily: "monospace", fontSize: 11 }}
                        >
                          {log.entity_id
                            ? log.entity_id.slice(0, 8) + "…"
                            : "—"}
                        </td>
                        <td className={styles.tdMuted}>
                          {log.ip_address || "—"}
                        </td>
                        <td>
                          {(log.before_data || log.after_data) && (
                            <button
                              style={{
                                background: "none",
                                border: "1px solid #e0ddd6",
                                borderRadius: 6,
                                padding: "3px 10px",
                                fontSize: 11,
                                cursor: "pointer",
                                color: "#888",
                              }}
                              onClick={() =>
                                setExpanded(expanded === log.id ? null : log.id)
                              }
                            >
                              {expanded === log.id ? "Hide" : "Details"}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expanded === log.id &&
                        (log.before_data || log.after_data) && (
                          <tr key={`${log.id}-detail`}>
                            <td
                              colSpan={7}
                              style={{
                                padding: "10px 14px",
                                background: "#f5f4f0",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: 20,
                                  flexWrap: "wrap",
                                }}
                              >
                                {log.before_data && (
                                  <div style={{ flex: 1, minWidth: 200 }}>
                                    <p
                                      style={{
                                        fontSize: 11,
                                        color: "#999",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        margin: "0 0 6px",
                                      }}
                                    >
                                      Before
                                    </p>
                                    <pre
                                      style={{
                                        fontSize: 11,
                                        color: "#555",
                                        margin: 0,
                                        fontFamily: "monospace",
                                        whiteSpace: "pre-wrap",
                                        background: "#fff",
                                        padding: "10px",
                                        borderRadius: 6,
                                        border: "1px solid #e0ddd6",
                                        maxHeight: 200,
                                        overflow: "auto",
                                      }}
                                    >
                                      {JSON.stringify(
                                        typeof log.before_data === "string"
                                          ? JSON.parse(log.before_data)
                                          : log.before_data,
                                        null,
                                        2,
                                      )}
                                    </pre>
                                  </div>
                                )}
                                {log.after_data && (
                                  <div style={{ flex: 1, minWidth: 200 }}>
                                    <p
                                      style={{
                                        fontSize: 11,
                                        color: "#999",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        margin: "0 0 6px",
                                      }}
                                    >
                                      After
                                    </p>
                                    <pre
                                      style={{
                                        fontSize: 11,
                                        color: "#1a1a2e",
                                        margin: 0,
                                        fontFamily: "monospace",
                                        whiteSpace: "pre-wrap",
                                        background: "#fff",
                                        padding: "10px",
                                        borderRadius: 6,
                                        border: "1px solid #e0ddd6",
                                        maxHeight: 200,
                                        overflow: "auto",
                                      }}
                                    >
                                      {JSON.stringify(
                                        typeof log.after_data === "string"
                                          ? JSON.parse(log.after_data)
                                          : log.after_data,
                                        null,
                                        2,
                                      )}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                    </>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
}
