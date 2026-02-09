"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
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
  website_type: "ecommerce" | "service";
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: (redirectPath?: string) => void;
  updateTokens: (tokens: AuthTokens) => void;
  updateUser: (userData: Partial<User>) => void;
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();

  // Simple cookie utility - sets cookie with expiration from JWT
  const setCookieWithExpiration = (
    name: string,
    value: string,
    token: string
  ) => {
    const baseDomain = siteConfig.baseDomain;

    // Extract expiration from JWT
    let expiresStr = "";
    try {
      const decoded = decodeJwt(token) as { exp?: number } | null;
      if (decoded?.exp) {
        const expires = new Date(decoded.exp * 1000);
        expiresStr = `; expires=${expires.toUTCString()}`;
      }
    } catch {
      // If can't decode, set default 7 days
      const expires = new Date();
      expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
      expiresStr = `; expires=${expires.toUTCString()}`;
    }

    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

    // Set for current domain
    document.cookie = `${name}=${value}${expiresStr}; path=/; SameSite=Lax${secure}`;

    // Set for base domain
    document.cookie = `${name}=${value}${expiresStr}; domain=.${baseDomain}; path=/; SameSite=Lax${secure}`;
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

  const deleteCookie = (name: string) => {
    const baseDomain = siteConfig.baseDomain;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${baseDomain}; path=/;`;
  };

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = decodeJwt(token) as { exp?: number } | null;
      if (!decoded?.exp) return true;
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  };

  // Refresh token when needed
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const storedTokens = localStorage.getItem("authTokens");
    if (!storedTokens) return false;

    try {
      const parsedTokens: AuthTokens = JSON.parse(storedTokens);

      // Check if refresh token is valid
      if (
        !parsedTokens.refresh_token ||
        isTokenExpired(parsedTokens.refresh_token)
      ) {
        clearAuthData();
        return false;
      }

      // Call your refresh API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: parsedTokens.refresh_token }),
        }
      );

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      const newTokens: AuthTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token || parsedTokens.refresh_token,
      };

      updateTokens(newTokens);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData();
      toast.error("Session expired", { description: "Please log in again" });
      router.push("/account/login");
      return false;
    }
  }, [router]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...userData };
      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      // Update cookie with access token expiration
      const storedTokens = localStorage.getItem("authTokens");
      if (storedTokens) {
        const { access_token } = JSON.parse(storedTokens);
        setCookieWithExpiration(
          "authUser",
          JSON.stringify(updatedUser),
          access_token
        );
      }

      return updatedUser;
    });
  };

  const updateTokens = (newTokens: AuthTokens) => {
    setTokens(newTokens);
    localStorage.setItem("authTokens", JSON.stringify(newTokens));

    // Set cookies with JWT expiration
    setCookieWithExpiration(
      "authToken",
      newTokens.access_token,
      newTokens.access_token
    );
    if (newTokens.refresh_token) {
      setCookieWithExpiration(
        "refreshToken",
        newTokens.refresh_token,
        newTokens.refresh_token
      );
    }

    // Update user cookie too
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setCookieWithExpiration("authUser", storedUser, newTokens.access_token);
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setTokens(null);

    localStorage.removeItem("authTokens");
    localStorage.removeItem("authUser");
    localStorage.removeItem("verificationEmail");

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("redirectAfterLogin");
    }

    deleteCookie("authToken");
    deleteCookie("authUser");
    deleteCookie("refreshToken");
  };

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check URL params first (cross-domain auth)
      const urlParams = new URLSearchParams(window.location.search);
      const authTokenFromUrl = urlParams.get("auth_token");
      const refreshTokenFromUrl = urlParams.get("refresh_token");

      if (authTokenFromUrl) {
        // Check if expired
        if (isTokenExpired(authTokenFromUrl)) {
          clearAuthData();
          setIsLoading(false);
          return;
        }

        const decoded = decodeJwt(
          authTokenFromUrl
        ) as unknown as Partial<User> | null;
        if (decoded) {
          const tokenData: AuthTokens = {
            access_token: authTokenFromUrl,
            refresh_token: refreshTokenFromUrl || "",
          };
          handleAuthSuccess(decoded as User, tokenData);
        }

        // Clean URL
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("auth_token");
        cleanUrl.searchParams.delete("refresh_token");
        window.history.replaceState({}, "", cleanUrl.toString());

        setIsLoading(false);
        return;
      }

      // Check localStorage
      let storedTokens = localStorage.getItem("authTokens");
      let storedUser = localStorage.getItem("authUser");

      // Check cookies if localStorage is empty (e.g. after middleware redirect on new subdomain)
      if (!storedTokens) {
        const cookieAuthToken = getCookie("authToken");
        const cookieRefreshToken = getCookie("refreshToken");
        const cookieAuthUser = getCookie("authUser");

        if (cookieAuthToken) {
          console.log("[AuthContext] Initializing from cookies...");
          const tokenData: AuthTokens = {
            access_token: cookieAuthToken,
            refresh_token: cookieRefreshToken || "",
          };
          storedTokens = JSON.stringify(tokenData);
          localStorage.setItem("authTokens", storedTokens);

          if (cookieAuthUser) {
            try {
              const decodedUser = JSON.parse(
                decodeURIComponent(cookieAuthUser)
              );
              storedUser = JSON.stringify(decodedUser);
              localStorage.setItem("authUser", storedUser);
            } catch (e) {
              // Try raw parse if URL decoded fails
              try {
                storedUser = cookieAuthUser;
                localStorage.setItem("authUser", storedUser);
              } catch (e2) {
                console.error(
                  "[AuthContext] Failed to parse authUser cookie:",
                  e2
                );
              }
            }
          }
        }
      }

      if (storedTokens) {
        try {
          const parsedTokens: AuthTokens = JSON.parse(storedTokens);

          // If access token expired, try refresh
          if (isTokenExpired(parsedTokens.access_token)) {
            const refreshed = await refreshAccessToken();
            if (!refreshed) {
              setIsLoading(false);
              return;
            }
            // After refresh, re-read from storage
            const newTokens = localStorage.getItem("authTokens");
            const newUser = localStorage.getItem("authUser");
            if (newTokens && newUser) {
              setTokens(JSON.parse(newTokens));
              setUser(JSON.parse(newUser));
            }
          } else {
            // Token still valid
            setTokens(parsedTokens);

            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              // Decode token to get user
              const decoded = decodeJwt(
                parsedTokens.access_token
              ) as unknown as Partial<User> | null;
              if (decoded) {
                setUser(decoded as User);
                localStorage.setItem("authUser", JSON.stringify(decoded));
              }
            }

            // Sync cookies
            setCookieWithExpiration(
              "authToken",
              parsedTokens.access_token,
              parsedTokens.access_token
            );
            if (storedUser) {
              setCookieWithExpiration(
                "authUser",
                storedUser,
                parsedTokens.access_token
              );
            }
          }
        } catch (error) {
          console.error("Auth init error:", error);
          clearAuthData();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [refreshAccessToken]);

  const handleAuthSuccess = (userData: User, tokenData: AuthTokens) => {
    const persistedUser = {
      user_id:
        userData.user_id ??
        (typeof userData.id === "number" ? userData.id : undefined),
      email: userData.email,
      store_name: userData.store_name,
      has_profile: userData.has_profile,
      role: userData.role,
      phone_number: userData.phone_number,
      domain: userData.domain,
      sub_domain: userData.sub_domain,
      has_profile_completed: userData.has_profile_completed,
      is_onboarding_complete: userData.is_onboarding_complete,
      first_login: userData.first_login,
      website_type: userData.website_type,
    };

    setUser(userData);
    setTokens(tokenData);

    localStorage.setItem("authTokens", JSON.stringify(tokenData));
    localStorage.setItem("authUser", JSON.stringify(persistedUser));

    // Set cookies with JWT expiration
    setCookieWithExpiration(
      "authToken",
      tokenData.access_token,
      tokenData.access_token
    );
    setCookieWithExpiration(
      "authUser",
      JSON.stringify(persistedUser),
      tokenData.access_token
    );
    if (tokenData.refresh_token) {
      setCookieWithExpiration(
        "refreshToken",
        tokenData.refresh_token,
        tokenData.refresh_token
      );
    }
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
            first_login?: boolean;
            is_onboarding_complete?: boolean;
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
        first_login: payload?.first_login,
        is_onboarding_complete: payload?.is_onboarding_complete,
      };

      handleAuthSuccess(loggedInUser, tokens);

      toast.success("Login Successful", {
        description: "Welcome back!",
      });

      setIsRedirecting(true);

      if (typeof window !== "undefined") {
        const sub = loggedInUser.sub_domain;
        if (sub) {
          const currentPath = window.location.pathname;
          const isAdminRoute = currentPath.startsWith("/admin");

          let path: string;
          if (loggedInUser.first_login) {
            path = "/on-boarding";
          } else if (isAdminRoute) {
            path = "/admin";
          } else {
            path = "/";
          }

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

      if (loggedInUser.first_login) {
        router.push("/on-boarding");
      } else {
        router.push("/");
      }
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const parsedError = AuthErrorHandler.parseAuthError(errorResponse);

      toast.error("Login Failed", {
        description: parsedError.message,
      });

      console.error("Login error:", error);
      clearAuthData();
      setIsLoading(false);
      setIsRedirecting(false);
      throw error;
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
        website_type: data.website_type,
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

  const logout = (redirectPath?: string) => {
    clearAuthData();

    toast.success("Logged Out", {
      description: "You have been successfully logged out.",
    });

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const redirectQuery = redirectPath
        ? `?next=${encodeURIComponent(redirectPath)}`
        : "";

      if (hostname.includes("localhost")) {
        window.location.href = `http://localhost:3000/logout${redirectQuery}`;
        return;
      }

      const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
      const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "https";
      const logoutUrl = `${protocol}://${baseDomain}/logout${redirectQuery}`;
      window.location.href = logoutUrl;
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
        updateUser,
        isLoading: isLoading || isRedirecting,
        isAuthenticated: !!user && !!tokens?.access_token,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
