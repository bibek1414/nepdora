"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User, AuthTokens, LoginResponse } from "@/types/auth/auth";
import { loginUser, signupUser } from "@/services/auth/api";
import { toast } from "sonner";
import { AuthErrorHandler } from "@/utils/auth/error.utils";
import { ErrorResponse } from "@/types/auth/error.types";
import { decodeJwt, buildTenantFrontendUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

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

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateTokens: (tokens: AuthTokens) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  clearAuthData: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Enhanced cookie utilities for cross-domain support
  const setCrossDomainCookie = (
    name: string,
    value: string,
    days: number = 7
  ) => {
    const baseDomain = siteConfig.baseDomain;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    // Set cookie for current host
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;

    // Additionally set cookie scoped to base domain (effective in production domains)
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
    const baseDomain = siteConfig.baseDomain;
    // Delete from current domain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Delete from base domain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${baseDomain}; path=/;`;
  };

  useEffect(() => {
    // Check URL parameters first (for cross-domain auth)
    const urlParams = new URLSearchParams(window.location.search);
    const authTokenFromUrl = urlParams.get("auth_token");
    const refreshTokenFromUrl = urlParams.get("refresh_token");

    if (authTokenFromUrl) {
      try {
        const decoded = decodeJwt(
          authTokenFromUrl
        ) as unknown as Partial<User> | null;
        const tokenData: AuthTokens = {
          access_token: authTokenFromUrl,
          refresh_token: refreshTokenFromUrl || getCookie("refreshToken") || "",
        };

        if (decoded) {
          handleAuthSuccess(decoded as User, tokenData);
        }

        // Clean URL
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("auth_token");
        cleanUrl.searchParams.delete("refresh_token");
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

    // Check cookies as fallback
    const cookieToken = getCookie("authToken");
    const cookieUser = getCookie("authUser");

    if (storedTokens && storedUser) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const parsedUser: User = JSON.parse(storedUser);

        const hasUserIdentifier = Boolean(
          (parsedUser as unknown as { user_id?: number | string }).user_id ??
            (parsedUser as unknown as { id?: number | string }).id
        );

        if (parsedTokens.access_token && hasUserIdentifier) {
          setTokens(parsedTokens);
          setUser(parsedUser);

          // Also set cross-domain cookies
          setCrossDomainCookie("authToken", parsedTokens.access_token);
          setCrossDomainCookie("authUser", JSON.stringify(parsedUser));
        } else {
          // Try to recover by decoding the token
          const decoded = decodeJwt(
            parsedTokens.access_token
          ) as Partial<User> | null;
          if (decoded) {
            setTokens(parsedTokens);
            setUser(decoded as User);
            setCrossDomainCookie("authToken", parsedTokens.access_token);
            setCrossDomainCookie("authUser", JSON.stringify(decoded));
            localStorage.setItem("authUser", JSON.stringify(decoded));
          } else {
            clearAuthData();
          }
        }
      } catch (error) {
        console.error("Failed to parse stored auth data:", error);
        clearAuthData();
      }
    } else if (storedTokens && !storedUser) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const decoded = decodeJwt(
          parsedTokens.access_token
        ) as unknown as Partial<User> | null;
        if (decoded) {
          setTokens(parsedTokens);
          setUser(decoded as User);
          setCrossDomainCookie("authToken", parsedTokens.access_token);
          setCrossDomainCookie("authUser", JSON.stringify(decoded));
          localStorage.setItem("authUser", JSON.stringify(decoded));
        }
      } catch (error) {
        console.error("Failed to decode stored token:", error);
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

    // Persist only required fields in authUser key
    const persistedUser = {
      user_id:
        userData.user_id ??
        (typeof userData.id === "number" ? userData.id : undefined),
      email: userData.email,
      store_name: userData.store_name,
      has_profile: userData.has_profile ?? undefined,
      role: userData.role ?? undefined,
      phone_number: userData.phone_number ?? undefined,
      domain: userData.domain ?? undefined,
      sub_domain: userData.sub_domain ?? undefined,
      has_profile_completed: userData.has_profile_completed ?? undefined,
    };

    // Store in localStorage
    localStorage.setItem("authTokens", JSON.stringify(tokenData));
    localStorage.setItem("authUser", JSON.stringify(persistedUser));

    // Store in cross-domain cookies (prod only for security)
    setCrossDomainCookie("authToken", tokenData.access_token);
    setCrossDomainCookie("authUser", JSON.stringify(persistedUser));
    if (tokenData.refresh_token) {
      setCrossDomainCookie("refreshToken", tokenData.refresh_token);
    }
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
    deleteCrossDomainCookie("refreshToken");
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await loginUser(data);

      const userData = response.data.user;
      const tokens: AuthTokens = {
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      };

      const payload = decodeJwt(tokens.access_token) as unknown as
        | (Partial<User> & {
            user_id?: number;
            email?: string;
            store_name?: string;
            has_profile?: boolean;
            role?: string;
            phone_number?: string;
            domain?: string;
            sub_domain?: string;
            has_profile_completed?: boolean;
          })
        | null;

      const loggedInUser: User = {
        id: payload?.user_id ?? userData.id,
        username: userData.username,
        email: payload?.email ?? data.email,
        store_name: payload?.store_name ?? userData.display,
        has_usable_password: userData.has_usable_password,
        user_id: payload?.user_id,
        has_profile: payload?.has_profile,
        role: payload?.role,
        phone_number: payload?.phone_number,
        domain: payload?.domain,
        sub_domain: payload?.sub_domain,
        has_profile_completed: payload?.has_profile_completed,
      };

      handleAuthSuccess(loggedInUser, tokens);

      toast.success("Login Successful", {
        description: "Welcome back!",
      });

      // Environment-based tenant redirect
      if (typeof window !== "undefined") {
        const sub = loggedInUser.sub_domain;
        if (sub) {
          const path = siteConfig.isDev ? "/admin" : "/";
          let url = buildTenantFrontendUrl(sub, {
            path,
            isDev: siteConfig.isDev,
            baseDomain: siteConfig.baseDomain,
            port: siteConfig.frontendDevPort,
          });
          const separator = url.includes("?") ? "&" : "?";
          url = `${url}${separator}auth_token=${encodeURIComponent(
            tokens.access_token
          )}&refresh_token=${encodeURIComponent(tokens.refresh_token)}`;
          window.location.href = url;
          return;
        }
      }
      router.push("/");
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const parsedError = AuthErrorHandler.parseAuthError(errorResponse);

      toast.error("Login Failed", {
        description: parsedError.message,
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

      const response = await signupUser(signupData);

      toast.success("Signup Successful", {
        description: "Please check your email to verify your account.",
      });

      router.push(
        `/account/verify-email?email=${encodeURIComponent(response.email)}`
      );
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const parsedError = AuthErrorHandler.parseAuthError(errorResponse);

      toast.error("Signup Failed", {
        description: parsedError.message,
      });

      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();

    toast.success("Logged Out", {
      description: "You have been successfully logged out.",
    });

    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
    const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";

    // Always redirect to the main domain after logout
    if (typeof window !== "undefined") {
      const mainDomainUrl = `${protocol}://${baseDomain}`;
      window.location.href = mainDomainUrl;
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
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
