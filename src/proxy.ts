import { type NextRequest, NextResponse } from "next/server";
import { rootDomain, siteConfig } from "./config/site";
import { apiFetch } from "@/lib/api-client";

// Cache for custom domain lookups
const domainCache = new Map<
  string,
  { domain: string | null; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Utility function for safe JWT decoding
function safeDecodeJWT(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Pad base64 string if needed
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

/**
 * Extract subdomain from request (works for localhost & production)
 */
function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Local development
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const match = url.match(/http:\/\/([^.]+)\.localhost/);
    if (match && match[1]) return match[1];
    if (hostname.includes(".localhost")) return hostname.split(".")[0];
    return null;
  }

  // Production: remove port
  const rootDomainFormatted = rootDomain.split(":")[0];

  // Preview deployments (Vercel: tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".nepdora.com")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

/**
 * Extract subdomain from auth cookie/token
 */
function getSubdomainFromAuth(request: NextRequest): string | null {
  try {
    // Check for authUser cookie
    const authUserCookie = request.cookies.get("authUser");
    if (authUserCookie?.value) {
      const userData = JSON.parse(authUserCookie.value);
      return userData.sub_domain || null;
    }

    // Fallback: check authToken and decode JWT manually
    const authToken = request.cookies.get("authToken");
    if (authToken?.value) {
      const payload = safeDecodeJWT(authToken.value);
      return payload?.sub_domain || null;
    }
  } catch (error) {
    console.error("Error extracting subdomain from auth:", error);
  }
  return null;
}

/**
 * Check if user is on root domain (not subdomain)
 */
function isRootDomain(request: NextRequest): boolean {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Local development - check if it's just localhost without subdomain
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return true;
  }

  // Production - check if it's root domain or www
  const rootDomainFormatted = rootDomain.split(":")[0];
  return (
    hostname === rootDomainFormatted ||
    hostname === `www.${rootDomainFormatted}`
  );
}

/**
 * Validate environment configuration
 */
function validateConfig(): boolean {
  if (!siteConfig.apiBaseUrl) {
    console.error("API base URL is not configured");
    return false;
  }
  return true;
}

/**
 * proxy: rewrites subdomain routes and redirects authenticated users
 */
export async function proxy(request: NextRequest) {
  // Validate configuration
  if (!validateConfig()) {
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const authToken = url.searchParams.get("auth_token");
  const refreshToken = url.searchParams.get("refresh_token");

  // Handle authentication tokens in URL
  if (authToken) {
    // Determine where to redirect (same URL without tokens)
    const nextUrl = new URL(request.url);
    nextUrl.searchParams.delete("auth_token");
    nextUrl.searchParams.delete("refresh_token");

    const response = NextResponse.redirect(nextUrl);

    // Set cookies for both current domain and base domain
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
    const isProd = process.env.NODE_ENV === "production";

    // Calculate expiration from JWT if possible, or default to 7 days
    let maxAge = 7 * 24 * 60 * 60; // 7 days default

    try {
      const payload = safeDecodeJWT(authToken);
      if (payload?.exp) {
        maxAge = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
      }

      if (payload) {
        const persistedUser = {
          user_id: payload.user_id,
          email: payload.email,
          store_name: payload.store_name,
          has_profile: payload.has_profile,
          role: payload.role,
          phone_number: payload.phone_number,
          domain: payload.domain,
          sub_domain: payload.sub_domain,
          has_profile_completed: payload.has_profile_completed,
          is_onboarding_complete: payload.is_onboarding_complete,
          first_login: payload.first_login,
          website_type: payload.website_type,
        };
        const authUserStr = JSON.stringify(persistedUser);

        // User cookie (client-readable)
        const userCookieOptions = {
          path: "/",
          secure: isProd,
          sameSite: "lax" as const,
          maxAge,
          httpOnly: false,
        };

        response.cookies.set("authUser", authUserStr, userCookieOptions);
        if (baseDomain && !url.hostname.includes("localhost")) {
          response.cookies.set("authUser", authUserStr, {
            ...userCookieOptions,
            domain: `.${baseDomain}`,
          });
        }
      }
    } catch (e) {
      console.warn("[Proxy] Failed to parse JWT for expiration/authUser:", e);
    }

    // Auth tokens (httpOnly for security)
    const cookieOptions = {
      path: "/",
      secure: isProd,
      sameSite: "lax" as const,
      maxAge: maxAge,
      httpOnly: true,
    };

    // Set for current subdomain/domain
    response.cookies.set("authToken", authToken, cookieOptions);
    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, cookieOptions);
    }

    // Also set for base domain if not localhost
    if (baseDomain && !url.hostname.includes("localhost")) {
      response.cookies.set("authToken", authToken, {
        ...cookieOptions,
        domain: `.${baseDomain}`,
      });
      if (refreshToken) {
        response.cookies.set("refreshToken", refreshToken, {
          ...cookieOptions,
          domain: `.${baseDomain}`,
        });
      }
    }

    return response;
  }

  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // Handle subdomain requests
  if (subdomain) {
    console.log(`\n--- [Subdomain Logic Start: ${subdomain}] ---`);

    // Check custom domain redirect with caching
    try {
      // In development, skip checking for a custom domain to avoid both the slow API call 
      // and redirecting away from localhost.
      if (siteConfig.isDev) {
        console.log(`[Dev Mode] Skipping custom domain check for ${subdomain}`);
      } else {
        // Check cache first
        const cached = domainCache.get(subdomain);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(
          `[Cache Hit] Found entry for ${subdomain}:`,
          cached.domain || "No custom domain"
        );

        if (
          cached.domain &&
          !request.headers.get("host")?.includes(cached.domain)
        ) {
          const redirectUrl = new URL(request.url);
          redirectUrl.hostname = cached.domain;
          console.log(
            `[Redirect] Moving user to custom domain: ${redirectUrl.hostname}`
          );
          return NextResponse.redirect(redirectUrl, 301);
        }
      } else {
        console.log(
          `[Cache Miss] TTL expired or no entry for ${subdomain}. Fetching from API...`
        );

        // Fetch from API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const tenantDomain = siteConfig.isDev
            ? `${subdomain}.localhost`
            : `${subdomain}.${siteConfig.baseDomain}`;
          const apiUrl = `${siteConfig.apiBaseUrl}/api/custom-domain/`;

          console.log(
            `[API Call] URL: ${apiUrl} | X-Tenant-Domain: ${tenantDomain}`
          );

          const res = await apiFetch(apiUrl, {
            headers: {
              "Content-Type": "application/json",
              "X-Tenant-Domain": tenantDomain,
            },
            cache: "no-store",
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          console.log(`[API Response] Status: ${res.status} ${res.statusText}`);

          if (res.ok) {
            const domains = await res.json();
            const primaryDomain = domains.find((d: any) => d.is_primary);

            console.log(
              `[Domain Info] Primary Domain Found:`,
              primaryDomain?.domain || "None"
            );

            // Cache the result (even if null)
            domainCache.set(subdomain, {
              domain: primaryDomain?.domain || null,
              timestamp: Date.now(),
            });

            if (primaryDomain?.domain) {
              const currentHost = request.headers.get("host") || "";

              // Avoid infinite redirect
              if (!currentHost.includes(primaryDomain.domain)) {
                const redirectUrl = new URL(request.url);
                redirectUrl.hostname = primaryDomain.domain;
                console.log(
                  `[Redirect] Triggering 301 to ${primaryDomain.domain}`
                );
                return NextResponse.redirect(redirectUrl, 301);
              } else {
                console.log(
                  `[Host Match] Already on primary domain: ${currentHost}`
                );
              }
            }
          } else {
            console.warn(
              `[API Error] Failed to fetch domains. Status: ${res.status}`
            );
          }
        } catch (error: any) {
          clearTimeout(timeoutId);
          if (error.name === "AbortError") {
            console.error(
              "![Timeout] Custom domain check timed out for:",
              subdomain
            );
          } else {
            console.error("![Fetch Failed] Error:", error.message);
          }
        }
      }
      } // Close the 'else' block for siteConfig.isDev
    } catch (error) {
      console.error("![Critical] Custom domain check logic error:", error);
    }

    // Allow certain routes to pass through without rewriting
    const allowedPaths = [
      "/admin",
      "/builder",
      "/support",
      "/payment",
      "/logout",
      "/preview",
      "/location",
      "/on-boarding",
      "/websocket-worker.js",
      "/subscription",
    ];

    if (allowedPaths.some(path => pathname.startsWith(path))) {
      console.log(
        `[Bypass] Allowed path detected: ${pathname}. Skipping rewrite.`
      );
      return NextResponse.next();
    }

    // If URL already contains /publish/[subdomain], redirect to clean URL
    if (pathname.startsWith(`/publish/${subdomain}`)) {
      const cleanPath = pathname.replace(`/publish/${subdomain}`, "") || "/";
      console.log(
        `[Cleanup] Internal path found. Redirecting to clean URL: ${cleanPath}`
      );
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }

    // Rewrite all other subdomain routes to /publish/[subdomain]/[...path]
    const newPath = `/publish/${subdomain}${pathname}`;
    console.log(`[Rewrite] Transforming path: ${pathname} -> ${newPath}`);
    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // User is on root domain - check if they should be redirected to subdomain
  if (isRootDomain(request)) {
    const userSubdomain = getSubdomainFromAuth(request);

    // If user is authenticated and trying to access /admin or /builder
    if (
      userSubdomain &&
      (pathname.startsWith("/admin") || pathname.startsWith("/builder"))
    ) {
      const host = request.headers.get("host") || "";
      const protocol = request.url.includes("localhost") ? "http" : "https";

      // Build subdomain URL
      let subdomainUrl: string;
      if (host.includes("localhost")) {
        // Local development
        const port = host.split(":")[1] || "3000";
        subdomainUrl = `${protocol}://${userSubdomain}.localhost:${port}${pathname}`;
      } else {
        // Production
        const rootDomainFormatted = rootDomain.split(":")[0];
        subdomainUrl = `${protocol}://${userSubdomain}.${rootDomainFormatted}${pathname}`;
      }

      // Preserve query parameters
      if (request.nextUrl.search) {
        subdomainUrl += request.nextUrl.search;
      }

      return NextResponse.redirect(new URL(subdomainUrl));
    }
  }

  // Root domain: allow normal access
  return NextResponse.next();
}

/**
 * Matcher: run proxy on all routes except API, Next internals, and static files
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|media|uploads|images|assets|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.avif$|.*\\.webp$).*)",
  ],
};
