"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { buildTenantFrontendUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface GoogleAuthUser {
  user_id?: number;
  email: string;
  store_name: string;
  has_profile: boolean;
  role: string;
  phone_number: string;
  domain: string;
  sub_domain: string;
  has_profile_completed: boolean;
  first_login: boolean;
  is_onboarding_complete: boolean;
}

export function GoogleAuthRedirectHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current || isRedirecting) return;
    if (typeof window === "undefined") return;

    const hasGoogleAuthCookies =
      document.cookie.includes("google_auth_sub_domain=") ||
      document.cookie.includes("google_auth_token=") ||
      document.cookie.includes("google_auth_refresh_token=") ||
      document.cookie.includes("google_auth_user=");

    if (status === "loading" && !hasGoogleAuthCookies) return;

    const processRedirect = async () => {
      // Mark as processed immediately
      hasProcessed.current = true;

      console.log("[GoogleAuthRedirectHandler] Processing redirect...");

      const getCookie = (name: string): string | null => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === " ") c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
        }
        return null;
      };

      const clearCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        if (!siteConfig.isDev) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${siteConfig.baseDomain}; path=/;`;
        }
      };

      const subDomain = getCookie("google_auth_sub_domain");
      const authToken = getCookie("google_auth_token");
      const refreshToken = getCookie("google_auth_refresh_token");
      const userDataStr = getCookie("google_auth_user");

      console.log("[GoogleAuthRedirectHandler] Auth data:", {
        subDomain,
        hasAuthToken: !!authToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userDataStr,
        sessionSubDomain: session?.user?.sub_domain,
        sessionFirstLogin: session?.user?.first_login,
        currentPath: window.location.pathname,
      });

      const getFirstLoginFromToken = (
        token: string | undefined | null
      ): boolean | null => {
        if (!token) return null;
        try {
          const [, payload] = token.split(".");
          if (!payload) return null;
          const decoded = JSON.parse(
            decodeURIComponent(
              atob(payload)
                .split("")
                .map(char => {
                  return (
                    "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2)
                  );
                })
                .join("")
            )
          );
          if (typeof decoded?.first_login === "boolean")
            return decoded.first_login;
          if (typeof decoded?.firstLogin === "boolean")
            return decoded.firstLogin;
          return null;
        } catch (error) {
          console.warn("Failed to decode token for first_login:", error);
          return null;
        }
      };

      // Parse user data
      let userData: GoogleAuthUser | null = null;
      if (userDataStr) {
        try {
          userData = JSON.parse(userDataStr);
        } catch (e) {
          try {
            const decoded = decodeURIComponent(userDataStr);
            userData = JSON.parse(decoded);
          } catch (e2) {
            console.error("Failed to parse user data:", e2);
          }
        }
      }

      const targetSubDomain = subDomain || session?.user?.sub_domain;
      const tokenToUse = authToken || session?.user?.accessToken;
      const refreshTokenToUse = refreshToken || session?.user?.refreshToken;

      // Get first_login status preferring token payload to avoid late redirects
      const firstLogin =
        getFirstLoginFromToken(tokenToUse) ??
        userData?.first_login ??
        session?.user?.first_login ??
        true;

      console.log(
        "[GoogleAuthRedirectHandler] First login status:",
        firstLogin
      );

      if (targetSubDomain && tokenToUse && refreshTokenToUse) {
        console.log(
          "[GoogleAuthRedirectHandler] Found subdomain, preparing redirect:",
          targetSubDomain
        );
        setIsRedirecting(true);

        // Determine path based on current location and first_login status
        const currentPath = window.location.pathname;
        const isAdminRoute = currentPath.startsWith("/admin");

        let path: string;
        if (firstLogin) {
          // First login: always go to onboarding
          path = "/on-boarding";
        } else {
          // Regular login from non-admin route: go to root
          path = "/admin";
        }

        console.log("[GoogleAuthRedirectHandler] Determined path:", path);

        // Build tenant URL with the determined path
        let tenantUrl = buildTenantFrontendUrl(targetSubDomain, {
          path,
          isDev: siteConfig.isDev,
          baseDomain: siteConfig.baseDomain,
          port: siteConfig.frontendDevPort,
        });

        // Add auth tokens to URL
        const separator = tenantUrl.includes("?") ? "&" : "?";
        tenantUrl = `${tenantUrl}${separator}auth_token=${encodeURIComponent(
          tokenToUse
        )}&refresh_token=${encodeURIComponent(refreshTokenToUse)}`;

        console.log(
          "[GoogleAuthRedirectHandler] Final redirect URL:",
          tenantUrl
        );

        // Clear cookies BEFORE redirect
        clearCookie("google_auth_sub_domain");
        clearCookie("google_auth_token");
        clearCookie("google_auth_refresh_token");
        clearCookie("google_auth_user");

        console.log(
          "[GoogleAuthRedirectHandler] Cookies cleared, redirecting..."
        );

        // Small delay to ensure cookies are cleared
        await new Promise(resolve => setTimeout(resolve, 100));

        // Now redirect
        window.location.href = tenantUrl;
      } else if (session?.user && !targetSubDomain) {
        // User authenticated but no subdomain - redirect based on first login
        console.log(
          "[GoogleAuthRedirectHandler] User authenticated but no subdomain"
        );
        setIsRedirecting(true);

        const redirectPath = firstLogin ? "/on-boarding" : "/admin";

        console.log(
          "[GoogleAuthRedirectHandler] Redirecting to:",
          redirectPath
        );
        router.push(redirectPath);
      } else {
        console.log(
          "[GoogleAuthRedirectHandler] Insufficient auth data, not redirecting"
        );
      }
    };

    // Execute immediately
    processRedirect();
  }, [session, status, isRedirecting, router]);

  return null;
}
