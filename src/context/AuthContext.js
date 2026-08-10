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

    // keep tabs in sync (e.g. logout in one tab logs out all tabs)
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
    setToken(jwt); // this is what makes CartContext's isLoggedIn flip
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
