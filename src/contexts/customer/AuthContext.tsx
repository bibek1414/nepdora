"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    const storedTokens = localStorage.getItem("customer-authTokens"); // Updated key
    if (storedTokens) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const decodedAccess = jwtDecode<DecodedAccessToken>(
          parsedTokens.access
        );

        if (decodedAccess.exp * 1000 > Date.now()) {
          setTokens(parsedTokens);
          setUser({
            id: decodedAccess.user_id,
            email: decodedAccess.email,
            username: decodedAccess.email,
            first_name: decodedAccess.first_name,
            last_name: decodedAccess.last_name,
            phone: decodedAccess.phone,
            address: decodedAccess.address,
          });
        } else {
          // Token expired
          localStorage.removeItem("customer-authTokens"); // Updated key
          toast.error("Session expired. Please log in again.");
        }
      } catch (error) {
        console.error("Failed to parse stored tokens or decode token:", error);
        localStorage.removeItem("customer-authTokens"); // Updated key
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData);
    // Store with updated key and access_token format for compatibility
    const tokensToStore = {
      access: tokenData.access,
      refresh: tokenData.refresh,
      access_token: tokenData.access, // For backward compatibility
    };
    localStorage.setItem("customer-authTokens", JSON.stringify(tokensToStore)); // Updated key
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getErrorMessage = (error: any) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Handle errors array format: {status: 400, errors: [{message: "...", code: "..."}]}
      if (
        data?.errors &&
        Array.isArray(data.errors) &&
        data.errors.length > 0
      ) {
        const firstError = data.errors[0];

        // Check for specific error codes
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

      // Fallback to status code based handling
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

  // Helper function to check if a page exists (you might need to implement this based on your API)
  const checkPageExists = async (
    siteUser: string,
    page: string
  ): Promise<boolean> => {
    try {
      return page === "home";
    } catch (error) {
      return false;
    }
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);

      // Access tokens from the correct path in the response
      const accessToken = response.tokens.access;
      const refreshToken = response.tokens.refresh;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

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

      toast.success("Login successful! Welcome back!");

      // Handle redirect after successful login
      if (typeof window !== "undefined") {
        // Check for redirect URL in sessionStorage first
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");

        if (redirectUrl) {
          // Clear the stored redirect URL
          sessionStorage.removeItem("redirectAfterLogin");
          // Redirect to the stored URL
          router.push(redirectUrl);
        } else {
          // Check URL parameters as fallback
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get("redirect");

          if (redirectParam) {
            router.push(decodeURIComponent(redirectParam));
          } else {
            // FIXED: Extract siteUser from current URL path instead of using email
            const currentPath = window.location.pathname;
            const pathSegments = currentPath.split("/");

            // Find the siteUser from the URL pattern /preview/{siteUser}/login
            let originalSiteUser = null;
            const previewIndex = pathSegments.indexOf("preview");
            if (previewIndex !== -1 && previewIndex + 1 < pathSegments.length) {
              originalSiteUser = pathSegments[previewIndex + 1];
            }

            // Use the original siteUser from URL, or fallback to user ID/email
            const siteUser =
              originalSiteUser ||
              loggedInUser.id?.toString() ||
              loggedInUser.email;

            try {
              // Try to check if home page exists
              const homePageExists = await checkPageExists(siteUser, "home");

              if (homePageExists) {
                router.push(`/preview/${siteUser}/home`);
              } else {
                // Fallback to base preview URL
                router.push(`/preview/${siteUser}`);
              }
            } catch (error) {
              console.warn(
                "Could not check page existence, using fallback:",
                error
              );
              // If page check fails, try home first, then fallback
              router.push(`/preview/${siteUser}/home`);
            }
          }
        }
      } else {
        // Fallback for server-side rendering - try to extract from router
        // You might need to adjust this based on your Next.js setup
        const siteUser = loggedInUser.id?.toString() || loggedInUser.email;
        router.push(`/preview/${siteUser}/home`);
      }
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      toast.error(errorMessage);

      console.error("Login error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        error,
      });

      // Re-throw the error so the form can handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signup = async (data: any) => {
    setIsLoading(true);
    try {
      const signupData = {
        ...data,
        password: data.password,
      };

      delete signupData.confirmPassword;

      const response = await signupUser(signupData);

      // Don't auto-login after signup, just redirect to login page
      toast.success("Account created successfully! Please log in to continue.");

      // FIXED: Extract siteUser from current URL path and redirect to preview-specific login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split("/");

        // Find the siteUser from the URL pattern /preview/{siteUser}/signup
        let siteUser = null;
        const previewIndex = pathSegments.indexOf("preview");
        if (previewIndex !== -1 && previewIndex + 1 < pathSegments.length) {
          siteUser = pathSegments[previewIndex + 1];
        }

        if (siteUser) {
          router.push(`/preview/${siteUser}/login`);
        } else {
          // Fallback to general login page if siteUser cannot be determined
          router.push("/login");
        }
      } else {
        // Fallback for server-side rendering
        router.push("/login");
      }
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      toast.error(errorMessage);

      console.error("Signup error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("customer-authTokens"); // Updated key
    // Clear any pending redirects
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("redirectAfterLogin");
    }
    toast.success("You have been successfully logged out.");
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
