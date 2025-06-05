"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (error) {
        // Clear any stored token if error
        localStorage.removeItem("accessToken");
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        checkAuth();
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user);
      
      // Save token
      localStorage.setItem("accessToken", data.accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
      
      toast.success("Login successful");
      router.push("/feed");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", userData);
      toast.success("Registration successful. You can now login.");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"];
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const { data } = await api.post("/auth/refresh");
      localStorage.setItem("accessToken", data.accessToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
      return true;
    } catch (error) {
      setUser(null);
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"];
      return false;
    }
  };

  // Axios interceptor to handle token expiration
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't already tried refreshing
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshed = await refreshAuth();
            if (refreshed) {
              // Retry the original request
              return api(originalRequest);
            }
            // Redirect to login if refresh failed
            router.push("/login");
          } catch (refreshError) {
            // Redirect to login
            router.push("/login");
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}