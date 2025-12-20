import React, { createContext, useState } from "react";
import { signOut as apiSignOut } from "../services/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    accountId: localStorage.getItem("accountId"),
    role: localStorage.getItem("role"),
  });

  const login = (data) => {
    // Backend trả về: accesstoken, refreshtoken (chữ thường)
    const token = data.accesstoken || data.accessToken || data.token;
    const refresh = data.refreshtoken || data.refreshToken;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("accountId", data.accountId);
    localStorage.setItem("role", data.role);

    setAuth({
      accessToken: token,
      refreshToken: refresh,
      accountId: data.accountId,
      role: data.role,
    });
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await apiSignOut(refreshToken);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.clear();
      setAuth({
        accessToken: null,
        refreshToken: null,
        accountId: null,
        role: null,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
