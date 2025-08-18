"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, AuthTokens, LoginResponse } from "@/types/auth/auth";
import { loginUser, signupUser } from "@/services/auth/api";
import { toast } from "sonner";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  phone: string;
  store_name: string;
}

interface ErrorResponse {
  response?: {
    status: number;
    data?: {
      errors?: Array<{
        message: string;
        code: string;
      }>;
      message?: string;
      error?: string;
      detail?: string;
    };
  };
  request?: unknown;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateTokens: (tokens: AuthTokens) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  verificationEmail: string | null;
  setVerificationEmail: (email: string | null) => void;
  clearAuthData: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null
  );
  const router = useRouter();

  // Enhanced cookie utilities for cross-domain support
  const setCrossDomainCookie = (
    name: string,
    value: string,
    days: number = 7
  ) => {
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    // Set cookie for main domain and all subdomains
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; domain=.${baseDomain}; path=/; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;
  };

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const deleteCrossDomainCookie = (name: string) => {
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
    // Delete from current domain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Delete from base domain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${baseDomain}; path=/;`;
  };

  useEffect(() => {
    // Check URL parameters first (for cross-domain auth)
    const urlParams = new URLSearchParams(window.location.search);
    const authTokenFromUrl = urlParams.get("auth_token");
    const userDataFromUrl = urlParams.get("user_data");

    if (authTokenFromUrl && userDataFromUrl) {
      try {
        const decodedUserData = JSON.parse(decodeURIComponent(userDataFromUrl));
        const tokenData: AuthTokens = {
          access_token: authTokenFromUrl,
          refresh_token: decodedUserData.refresh_token || "",
        };

        handleAuthSuccess(decodedUserData, tokenData);

        // Clean URL
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("auth_token");
        cleanUrl.searchParams.delete("user_data");
        window.history.replaceState({}, "", cleanUrl.toString());

        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Failed to parse URL auth data:", error);
      }
    }

    // Check localStorage
    const storedTokens = localStorage.getItem("authTokens");
    const storedUser = localStorage.getItem("authUser");
    const storedVerificationEmail = localStorage.getItem("verificationEmail");

    if (storedVerificationEmail) {
      setVerificationEmail(storedVerificationEmail);
    }

    // Check cookies as fallback
    const cookieToken = getCookie("authToken");
    const cookieUser = getCookie("authUser");

    if (storedTokens && storedUser) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const parsedUser: User = JSON.parse(storedUser);

        if (parsedTokens.access_token && parsedUser.id) {
          setTokens(parsedTokens);
          setUser(parsedUser);

          // Also set cross-domain cookies
          setCrossDomainCookie("authToken", parsedTokens.access_token);
          setCrossDomainCookie("authUser", JSON.stringify(parsedUser));
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        clearAuthData();
      }
    } else if (cookieToken && cookieUser) {
      // Fallback to cookies
      try {
        const parsedUser: User = JSON.parse(cookieUser);
        const tokenData: AuthTokens = {
          access_token: cookieToken,
          refresh_token: "", // You might want to store this in a separate cookie
        };

        setTokens(tokenData);
        setUser(parsedUser);

        // Sync to localStorage
        localStorage.setItem("authTokens", JSON.stringify(tokenData));
        localStorage.setItem("authUser", cookieUser);
      } catch (error) {
        console.error("Failed to parse cookie auth data:", error);
        clearAuthData();
      }
    }

    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData);

    // Store in localStorage
    localStorage.setItem("authTokens", JSON.stringify(tokenData));
    localStorage.setItem("authUser", JSON.stringify(userData));

    // Store in cross-domain cookies
    setCrossDomainCookie("authToken", tokenData.access_token);
    setCrossDomainCookie("authUser", JSON.stringify(userData));
  };

  const updateTokens = (newTokens: AuthTokens) => {
    setTokens(newTokens);
    localStorage.setItem("authTokens", JSON.stringify(newTokens));
    setCrossDomainCookie("authToken", newTokens.access_token);
  };

  const clearAuthData = () => {
    setUser(null);
    setTokens(null);

    // Clear localStorage
    localStorage.removeItem("authTokens");
    localStorage.removeItem("authUser");
    localStorage.removeItem("verificationEmail");

    // Clear sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("redirectAfterLogin");
    }

    // Clear cross-domain cookies
    deleteCrossDomainCookie("authToken");
    deleteCrossDomainCookie("authUser");
  };

  const getErrorMessage = (error: ErrorResponse) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (
        data?.errors &&
        Array.isArray(data.errors) &&
        data.errors.length > 0
      ) {
        const firstError = data.errors[0];

        if (firstError.code === "too_many_login_attempts") {
          return "Too many failed login attempts. Please wait a few minutes before trying again.";
        }

        if (firstError.code === "invalid_credentials") {
          return "Invalid email or password. Please check your credentials and try again.";
        }

        if (firstError.code === "user_not_found") {
          return "Account not found. Please check your email address or sign up for a new account.";
        }

        if (firstError.code === "account_disabled") {
          return "Your account has been disabled. Please contact support for assistance.";
        }

        return firstError.message || "Login failed. Please try again.";
      }

      switch (status) {
        case 401:
          return "Invalid email or password. Please check your credentials and try again.";
        case 400:
          return (
            data?.message ||
            data?.error ||
            data?.detail ||
            "Invalid login credentials. Please check your email and password."
          );
        case 403:
          return "Your account has been suspended or disabled. Please contact support.";
        case 404:
          return "Account not found. Please check your email address or sign up for a new account.";
        case 429:
          return "Too many login attempts. Please wait a few minutes before trying again.";
        case 500:
          return "Server error occurred. Please try again later.";
        default:
          return (
            data?.message ||
            data?.error ||
            data?.detail ||
            "Login failed. Please try again."
          );
      }
    } else if (error.request) {
      return "Network error. Please check your internet connection and try again.";
    } else {
      return error.message || "An unexpected error occurred. Please try again.";
    }
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await loginUser(data);

      const userData = response.data.user;
      const loggedInUser: User = {
        id: userData.id,
        username: userData.username,
        email: data.email,
        store_name: userData.display,
        has_usable_password: userData.has_usable_password,
      };

      const tokens: AuthTokens = {
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      };

      handleAuthSuccess(loggedInUser, tokens);

      toast.success("Login Successful", {
        description: "Welcome back!",
      });

      // Handle redirect after successful login
      if (typeof window !== "undefined") {
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");

        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin");

          // If redirecting to a subdomain, pass auth data in URL
          if (
            redirectUrl.includes(".nepdora.com") &&
            !redirectUrl.includes("www.nepdora.com")
          ) {
            const separator = redirectUrl.includes("?") ? "&" : "?";
            const authRedirectUrl = `${redirectUrl}${separator}auth_token=${encodeURIComponent(
              tokens.access_token
            )}&user_data=${encodeURIComponent(JSON.stringify(loggedInUser))}`;
            window.location.href = authRedirectUrl;
            return;
          }

          router.push(redirectUrl);
        } else {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get("redirect");

          if (redirectParam) {
            const decodedRedirect = decodeURIComponent(redirectParam);

            // If redirecting to a subdomain, pass auth data in URL
            if (
              decodedRedirect.includes(".nepdora.com") &&
              !decodedRedirect.includes("www.nepdora.com")
            ) {
              const separator = decodedRedirect.includes("?") ? "&" : "?";
              const authRedirectUrl = `${decodedRedirect}${separator}auth_token=${encodeURIComponent(
                tokens.access_token
              )}&user_data=${encodeURIComponent(JSON.stringify(loggedInUser))}`;
              window.location.href = authRedirectUrl;
              return;
            }

            router.push(decodedRedirect);
          } else {
            router.push("/");
          }
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error as ErrorResponse);

      toast.error("Login Failed", {
        description: errorMessage,
      });

      console.error("Login error:", error);
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    try {
      const signupData = {
        email: data.email,
        password: data.password,
        store_name: data.store_name,
        phone: data.phone,
      };

      await signupUser(signupData);

      setVerificationEmail(data.email);
      localStorage.setItem("verificationEmail", data.email);

      toast.success("Signup Successful", {
        description: "Please check your email to verify your account.",
      });

      router.push("/signup/verify");
    } catch (error) {
      const errorMessage = getErrorMessage(error as ErrorResponse);

      toast.error("Signup Failed", {
        description: errorMessage,
      });

      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setVerificationEmail(null);

    toast.success("Logged Out", {
      description: "You have been successfully logged out.",
    });

    // Always redirect to main domain for logout
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
    const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

    // Check if we're on a subdomain
    const hostname = window.location.hostname;
    if (
      hostname.includes(".") &&
      hostname.endsWith(baseDomain) &&
      !hostname.startsWith("www.") &&
      hostname !== baseDomain
    ) {
      // We're on a subdomain, redirect to main domain
      window.location.href = `${protocol}://www.${baseDomain}/login`;
    } else {
      // We're on main domain
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        signup,
        logout,
        updateTokens,
        isLoading,
        isAuthenticated: !!user && !!tokens?.access_token,
        verificationEmail,
        setVerificationEmail,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
