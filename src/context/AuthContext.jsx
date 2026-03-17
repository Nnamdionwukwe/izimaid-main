import { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  const token = localStorage.getItem("token");

  // ✅ On every app load, re-fetch the user's profile from the database
  // This ensures the avatar and any other profile data is always up to date
  // regardless of which device last updated it
  useEffect(() => {
    if (!token || !user?.id) return;

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.user) return;
        // Merge fresh data — preserves role/token fields not returned by /me
        const refreshed = { ...user, ...data.user };
        setUser(refreshed);
        localStorage.setItem("user", JSON.stringify(refreshed));
      })
      .catch(() => {
        // Silently fail — user still works from localStorage cache
      });
  }, []); // runs once on mount

  function updateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  function login(userData, authToken) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser({});
  }

  return (
    <AuthContext.Provider value={{ user, token, updateUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
