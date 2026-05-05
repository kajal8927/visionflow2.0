import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getStoredToken,
  getStoredUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setToken(getStoredToken());
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await loginUser(email, password);

    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    }

    return result;
  };

  const register = async (formData) => {
    const result = await registerUser(formData);

    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    }

    return result;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading VisionFlow...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};