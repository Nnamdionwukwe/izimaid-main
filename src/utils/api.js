// src/utils/api.js
const RAW = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const API = RAW.replace(/\/$/, "").replace(/\/api$/, "") + "/api";

export function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}
