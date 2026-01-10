import { createContext, useEffect, useState } from "react";
import api from "../config/axios";
import type { User } from "../interfaces/taskInterface";
import type { AuthContextType } from "../interfaces/authContextInterface";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on app load / refresh
  const checkAuth = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Call this AFTER successful login
  const login = async () => {
    const res = await api.get("/user/me");
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
