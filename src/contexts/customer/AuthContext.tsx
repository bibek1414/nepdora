"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  User,
  AuthTokens,
  DecodedAccessToken,
} from "@/types/auth/customer/auth";
import { loginUser, signupUser } from "@/services/auth/customer/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: (data: any) => Promise<void>;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  signup: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedTokens = localStorage.getItem("customer-authTokens");
    if (storedTokens) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const decodedAccess = jwtDecode<DecodedAccessToken>(
          parsedTokens.access
        );

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedAccess.exp > currentTime) {
          setUser({
            id: decodedAccess.user_id,
            email: decodedAccess.email,
            username: decodedAccess.email,
            first_name: decodedAccess.first_name,
            last_name: decodedAccess.last_name,
            phone: decodedAccess.phone,
            address: decodedAccess.address,
          });
          setTokens(parsedTokens);
        } else {
          localStorage.removeItem("customer-authTokens");
          toast.error("Session expired. Please log in again.");
        }
      } catch (error) {
        console.error("Failed to parse stored tokens or decode token:", error);
        localStorage.removeItem("customer-authTokens");
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData);
    const tokensToStore = {
      access: tokenData.access,
      refresh: tokenData.refresh,
      access_token: tokenData.access,
    };
    localStorage.setItem("customer-authTokens", JSON.stringify(tokensToStore));
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getErrorMessage = (error: any) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (
        data?.errors &&
        Array.isArray(data.errors) &&
        data.errors.length > 0
      ) {
        const firstError = data.errors[0];
        if (firstError.code === "too_many_login_attempts")
          return "Too many failed login attempts.";
        if (firstError.code === "invalid_credentials")
          return "Invalid email or password.";
        return firstError.message || "Login failed.";
      }

      switch (status) {
        case 401:
          return "Invalid email or password.";
        case 403:
          return "Your account has been suspended.";
        case 404:
          return "Account not found.";
        default:
          return data?.message || data?.error || "Login failed.";
      }
    } else if (error.request) {
      return "Network error. Please check your connection.";
    } else {
      return error.message || "An unexpected error occurred.";
    }
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);
      const accessToken = response.tokens.access;
      const refreshToken = response.tokens.refresh;

      if (!accessToken) throw new Error("No access token received");

      const decodedAccess = jwtDecode<DecodedAccessToken>(accessToken);
      const loggedInUser: User = {
        id: decodedAccess.user_id,
        email: decodedAccess.email,
        username: decodedAccess.email,
        first_name: decodedAccess.first_name,
        last_name: decodedAccess.last_name,
        phone: decodedAccess.phone,
        address: decodedAccess.address,
      };

      handleAuthSuccess(loggedInUser, {
        access: accessToken,
        refresh: refreshToken,
      });

      toast.success("Login successful!");

      // Handle redirect
      const isPreview = pathname?.startsWith("/preview");
      const isPublish = pathname?.startsWith("/publish");
      const pathSegments = pathname.split("/").filter(Boolean);

      let siteUser = null;
      if (isPreview) {
        const previewIndex = pathSegments.indexOf("preview");
        if (previewIndex !== -1 && previewIndex + 1 < pathSegments.length) {
          siteUser = pathSegments[previewIndex + 1];
        }
      } else if (isPublish) {
        const publishIndex = pathSegments.indexOf("publish");
        if (publishIndex !== -1 && publishIndex + 1 < pathSegments.length) {
          siteUser = pathSegments[publishIndex + 1];
        }
      }

      // Fallback for subdomain
      if (!siteUser && typeof window !== "undefined") {
        const hostname = window.location.hostname;
        if (hostname.includes(".localhost")) siteUser = hostname.split(".")[0];
        else if (
          hostname.includes(".nepdora.com") &&
          hostname !== "nepdora.com"
        )
          siteUser = hostname.split(".")[0];
      }

      let routePrefix = "";
      if (isPreview && siteUser) {
        routePrefix = `/preview/${siteUser}`;
      } else if (isPublish && siteUser) {
        routePrefix = `/publish/${siteUser}`;
      }

      if (siteUser) router.push(`${routePrefix}/home`);
      else router.push("/");
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signup = async (data: any) => {
    setIsLoading(true);
    try {
      const signupData = { ...data };
      delete signupData.confirmPassword;
      await signupUser(signupData);

      toast.success("Account created successfully! Please log in.");

      const isPreview = pathname?.startsWith("/preview");
      const isPublish = pathname?.startsWith("/publish");
      const pathSegments = pathname.split("/").filter(Boolean);

      let siteUser = null;
      if (isPreview) {
        const previewIndex = pathSegments.indexOf("preview");
        if (previewIndex !== -1 && previewIndex + 1 < pathSegments.length)
          siteUser = pathSegments[previewIndex + 1];
      } else if (isPublish) {
        const publishIndex = pathSegments.indexOf("publish");
        if (publishIndex !== -1 && publishIndex + 1 < pathSegments.length)
          siteUser = pathSegments[publishIndex + 1];
      }

      let loginPath = "/login";
      if (isPreview && siteUser) {
        loginPath = `/preview/${siteUser}/login`;
      } else if (isPublish && siteUser) {
        loginPath = `/publish/${siteUser}/login`;
      }
      router.push(loginPath);
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("customer-authTokens");
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        signup,
        logout,
        isLoading,
        isAuthenticated: !!user && !!tokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
