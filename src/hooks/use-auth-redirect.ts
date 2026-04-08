import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { buildTenantFrontendUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type RedirectOptions = {
  /**
   * Alternate route for first time users who still need onboarding.
   * Defaults to `/on-boarding`.
   */
  firstLoginPath?: string;
  /**
   * Ability to opt-out of the first_login based redirect.
   * Defaults to true so the login/signup pages mimic AuthContext.
   */
  respectFirstLogin?: boolean;
};

export function useAuthRedirect(
  redirectTo: string = "/admin",
  options: RedirectOptions = {}
) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const firstLoginPath = options.firstLoginPath ?? "/on-boarding";
  const respectFirstLogin =
    options.respectFirstLogin === undefined ? true : options.respectFirstLogin;

  useEffect(() => {
    if (isLoading || !user) return;

    const shouldUseFirstLoginPath = respectFirstLogin && user.first_login;
    let destination = shouldUseFirstLoginPath ? firstLoginPath : redirectTo;

    // Tenant-aware redirection
    if (user.sub_domain) {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      const isAlreadyOnSubdomain = hostname.startsWith(`${user.sub_domain}.`);

      // If we're on the root domain but have a subdomain, redirect to the subdomain
      if (!isAlreadyOnSubdomain && destination.startsWith("/")) {
        const tenantUrl = buildTenantFrontendUrl(user.sub_domain, {
          path: destination,
          isDev: siteConfig.isDev,
          baseDomain: siteConfig.baseDomain,
          port: siteConfig.frontendDevPort,
        });

        if (typeof window !== "undefined") {
          window.location.href = tenantUrl;
          return;
        }
      }
    }

    router.replace(destination);
  }, [user, isLoading, router, redirectTo, firstLoginPath, respectFirstLogin]);

  return { isRedirecting: !isLoading && !!user, isLoading };
}
