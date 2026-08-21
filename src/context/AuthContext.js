"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("jwt");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);

    const onStorage = (e) => {
      if (e.key === "jwt" || e.key === "user") {
        setToken(localStorage.getItem("jwt"));
        const u = localStorage.getItem("user");
        setUser(u ? JSON.parse(u) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (userData, jwt) => {
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  // patch user in both state + localStorage — call after any profile API save
  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  // pull fresh copy straight from backend — call on profile page mount
  // so edits made from another device/tab show correct too, not just cached copy
  const refreshUser = async () => {
    if (!user?.id || !token) return;
    try {
      const res = await fetch(
        `https://backapp.preown.store/api/users/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("refresh failed");
      const data = await res.json();
      updateUser({ username: data.username, email: data.email });
    } catch (err) {
      console.error("refreshUser error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, updateUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
