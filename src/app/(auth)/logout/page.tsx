"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";

export default function LogoutPage() {
  useEffect(() => {
    const authLocalStorageKeys = [
      "authTokens",
      "authUser",
      "authToken",
      "refreshToken",
      "verificationEmail",
      "nepdora-subscription-status",
    ];
    const authSessionStorageKeys = [
      "redirectAfterLogin",
      "verified_subscription_payment",
      "subscription_payment_data",
      "esewa_transaction",
      "khalti_transaction",
    ];
    const cookieNames = [
      "authToken",
      "refreshToken",
      "authUser",
      "google_auth_sub_domain",
      "google_auth_token",
      "google_auth_refresh_token",
      "google_auth_user",
      "google_auth_error",
    ];

    authLocalStorageKeys.forEach(key => localStorage.removeItem(key));
    authSessionStorageKeys.forEach(key => sessionStorage.removeItem(key));

    const domainVariants = [
      "",
      `.${siteConfig.baseDomain}`,
      window.location.hostname,
    ];

    if (window.location.hostname.endsWith(".localhost")) {
      domainVariants.push(".localhost");
    }

    cookieNames.forEach(name => {
      domainVariants.forEach(domain => {
        const domainAttr = domain ? `;domain=${domain}` : "";
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${domainAttr};SameSite=Lax`;
      });
    });

    const searchParams = new URLSearchParams(window.location.search);
    const nextPath = searchParams.get("next") || "/";

    setTimeout(() => {
      window.location.href = nextPath;
    }, 800);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
      Logging out...
    </div>
  );
}
