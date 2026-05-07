import { createContext, useContext, useEffect, useState } from "react";

import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    client
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (payload) => {
    localStorage.setItem("token", payload.token);
    setUser(payload.user);
  };

  const register = async (formData) => {
    const response = await client.post("/auth/register", formData);
    saveSession(response.data);
  };

  const login = async (formData) => {
    const response = await client.post("/auth/login", formData);
    saveSession(response.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await client.get("/auth/me");
    setUser(response.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        register,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

