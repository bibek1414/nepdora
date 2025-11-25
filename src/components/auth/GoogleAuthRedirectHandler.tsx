"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { buildTenantFrontendUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function GoogleAuthRedirectHandler() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only run on client side and after session is loaded
    if (status === "loading" || typeof window === "undefined") return;

    // Check for Google auth cookies (set during Google login in auth.ts)
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

    const subDomain = getCookie("google_auth_sub_domain");
    const authToken = getCookie("google_auth_token");
    const refreshToken = getCookie("google_auth_refresh_token");
    const userDataStr = getCookie("google_auth_user");

    console.log("[GoogleAuthRedirectHandler] Checking cookies:", {
      hasSubDomain: !!subDomain,
      hasAuthToken: !!authToken,
      hasRefreshToken: !!refreshToken,
      subDomain,
      currentPath: window.location.pathname,
    });

    // If we have sub_domain cookie, redirect to tenant URL
    if (subDomain && (authToken || session?.user?.sub_domain)) {
      // Determine path based on first_login (similar to AuthContext.tsx)
      let path = "/admin";
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          if (userData.first_login) {
            path = "/on-boarding";
          }
        } catch (e) {
          // If parsing fails, use default /admin
        }
      } else if (session?.user?.first_login) {
        path = "/on-boarding";
      }

      // Build tenant URL with determined path, similar to AuthContext.tsx
      let tenantUrl = buildTenantFrontendUrl(subDomain, {
        path,
        isDev: siteConfig.isDev,
        baseDomain: siteConfig.baseDomain,
        port: siteConfig.frontendDevPort,
      });

      // Add auth tokens to URL if available (same as AuthContext.tsx)
      const tokenToUse = authToken || session?.user?.accessToken;
      const refreshTokenToUse = refreshToken || session?.user?.refreshToken;

      if (tokenToUse && refreshTokenToUse) {
        const separator = tenantUrl.includes("?") ? "&" : "?";
        tenantUrl = `${tenantUrl}${separator}auth_token=${encodeURIComponent(
          tokenToUse
        )}&refresh_token=${encodeURIComponent(refreshTokenToUse)}`;
      }

      console.log("[GoogleAuthRedirectHandler] Redirecting to:", tenantUrl);

      // Clear the cookies
      const expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = `google_auth_sub_domain=; ${expires}; path=/;`;
      document.cookie = `google_auth_token=; ${expires}; path=/;`;
      document.cookie = `google_auth_refresh_token=; ${expires}; path=/;`;
      document.cookie = `google_auth_user=; ${expires}; path=/;`;

      // Redirect to tenant URL
      window.location.href = tenantUrl;
      return;
    }

    // Also check if session has sub_domain (fallback)
    if (session?.user?.sub_domain && !subDomain) {
      const sub = session.user.sub_domain;
      let path = "/admin";
      if (session.user.first_login) {
        path = "/on-boarding";
      }

      let tenantUrl = buildTenantFrontendUrl(sub, {
        path,
        isDev: siteConfig.isDev,
        baseDomain: siteConfig.baseDomain,
        port: siteConfig.frontendDevPort,
      });

      const tokenToUse = session.user.accessToken;
      const refreshTokenToUse = session.user.refreshToken;

      if (tokenToUse && refreshTokenToUse) {
        const separator = tenantUrl.includes("?") ? "&" : "?";
        tenantUrl = `${tenantUrl}${separator}auth_token=${encodeURIComponent(
          tokenToUse
        )}&refresh_token=${encodeURIComponent(refreshTokenToUse)}`;
      }

      console.log(
        "[GoogleAuthRedirectHandler] Redirecting using session:",
        tenantUrl
      );
      window.location.href = tenantUrl;
    }
  }, [session, status]);

  return null; // This component doesn't render anything
}
