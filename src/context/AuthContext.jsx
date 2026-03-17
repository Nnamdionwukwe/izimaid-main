import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}"),
  );

  const token = localStorage.getItem("token");

  // Call this after a successful avatar upload, name change, etc.
  // Re-renders every component using useAuth() instantly.
  function updateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  // Call this after a successful login response
  function login(userData, authToken) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
  }

  // Call this on logout — clears everything globally
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

// Use this hook in any component that needs the current user or token
export function useAuth() {
  return useContext(AuthContext);
}
