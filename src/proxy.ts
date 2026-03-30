import { type NextRequest, NextResponse } from "next/server";
import { rootDomain, siteConfig } from "./config/site";
import { apiFetch } from "@/lib/api-client";

// ─────────────────────────────────────────────
// Cache
// ─────────────────────────────────────────────

interface DomainCacheEntry {
  customDomain: string | null; // e.g. "yachuindia.com"
  subdomain: string | null; // e.g. "bibek"  (used for reverse lookup)
  timestamp: number;
}

const domainCache = new Map<string, DomainCacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─────────────────────────────────────────────
// JWT helpers
// ─────────────────────────────────────────────

function safeDecodeJWT(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const decoded = atob(padded);
    // Match the repo's `decodeJWT()` behavior (handles unicode payloads).
    const jsonStr = decodeURIComponent(escape(decoded));
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// Host helpers
// ─────────────────────────────────────────────

/**
 * Returns the subdomain if the request is on *.nepdora.com (or *.localhost),
 * or null if it is on a custom domain / root domain.
 */
function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Local development
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;

  if (hostname.endsWith(".localhost")) {
    const sub = hostname.replace(".localhost", "");
    return sub || null;
  }

  const rootDomainFormatted = rootDomain.split(":")[0];

  // Vercel preview deployments  (tenant---branch.nepdora.com)
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${rootDomainFormatted}`)
  ) {
    return hostname.split("---")[0] || null;
  }

  // Regular subdomain  (bibek.nepdora.com)
  if (
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`)
  ) {
    return hostname.replace(`.${rootDomainFormatted}`, "");
  }

  return null;
}

/**
 * Returns true when the visitor is on the root domain (nepdora.com / www / localhost).
 */
function isRootDomain(request: NextRequest): boolean {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  const rootDomainFormatted = rootDomain.split(":")[0];
  return (
    hostname === rootDomainFormatted ||
    hostname === `www.${rootDomainFormatted}`
  );
}

/**
 * Returns true when the request host is a fully custom domain
 * (not nepdora.com, not *.nepdora.com, not localhost).
 */
function isCustomDomain(request: NextRequest): boolean {
  return !isRootDomain(request) && extractSubdomain(request) === null;
}

/**
 * Read the tenant subdomain stored in the auth cookies.
 */
function getSubdomainFromAuth(request: NextRequest): string | null {
  try {
    const authUserCookie = request.cookies.get("authUser");
    if (authUserCookie?.value) {
      // Cookies can be URL-encoded depending on how they were written.
      // Try raw JSON first, then fall back to URL-decoding.
      let userData: any | null = null;
      try {
        userData = JSON.parse(authUserCookie.value);
      } catch {
        const decoded = decodeURIComponent(authUserCookie.value);
        userData = JSON.parse(decoded);
      }
      return userData.sub_domain || null;
    }
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

function redirectToPermissionDenied(request: NextRequest): NextResponse {
  const protocol = request.url.includes("localhost") ? "http" : "https";
  const target = new URL(`/permission-denied`, `${protocol}://${rootDomain}`);

  // Keep original query string if any (useful for debugging/support).
  if (request.nextUrl.search) target.search = request.nextUrl.search;

  return NextResponse.redirect(target);
}

// ─────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────

/**
 * Fetch all domains for a tenant (identified by its subdomain).
 * Returns { customDomain, subdomain } or null on failure.
 *
 * API response shape (array):
 * [
 *   { domain: "yachuindia.com",      is_primary: false },
 *   { domain: "bibek.nepdora.com",   is_primary: true  }
 * ]
 */
async function fetchTenantDomainsBySubdomain(
  subdomain: string,
  hostname: string
): Promise<{ customDomain: string | null; subdomain: string } | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const tenantDomain = siteConfig.isDev ? `${subdomain}.localhost` : hostname;

    const apiUrl = `${siteConfig.apiBaseUrl}/api/custom-domain/`;

    const res = await apiFetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Domain": tenantDomain,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(
        `[API] Non-OK status ${res.status} for subdomain "${subdomain}"`
      );
      return null;
    }

    const domains: Array<{ domain: string; is_primary: boolean }> =
      await res.json();

    // Custom domain = the entry that is NOT the *.nepdora.com subdomain
    const customEntry = domains.find(
      d => !d.domain.endsWith(`.${siteConfig.baseDomain}`)
    );

    return { customDomain: customEntry?.domain ?? null, subdomain };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.error(
        `[Timeout] Domain lookup timed out for subdomain "${subdomain}"`
      );
    } else {
      console.error(`[Fetch Error] Domain lookup failed:`, error.message);
    }
    return null;
  }
}

/**
 * Fetch the tenant subdomain for a fully custom domain (e.g. "yachuindia.com").
 * Uses the same endpoint but sends the custom domain as X-Tenant-Domain.
 */
async function fetchTenantDomainsByCustomDomain(
  customDomain: string
): Promise<{ customDomain: string; subdomain: string | null } | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const apiUrl = `${siteConfig.apiBaseUrl}/api/custom-domain/`;

    const res = await apiFetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Domain": customDomain,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(
        `[API] Non-OK status ${res.status} for custom domain "${customDomain}"`
      );
      return null;
    }

    const domains: Array<{ domain: string; is_primary: boolean }> =
      await res.json();

    // The subdomain entry ends with .nepdora.com
    const subdomainEntry = domains.find(d =>
      d.domain.endsWith(`.${siteConfig.baseDomain}`)
    );

    const subdomain = subdomainEntry
      ? subdomainEntry.domain.replace(`.${siteConfig.baseDomain}`, "")
      : null;

    return { customDomain, subdomain };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.error(
        `[Timeout] Reverse domain lookup timed out for "${customDomain}"`
      );
    } else {
      console.error(
        `[Fetch Error] Reverse domain lookup failed:`,
        error.message
      );
    }
    return null;
  }
}

// ─────────────────────────────────────────────
// Cache helpers
// ─────────────────────────────────────────────

function getCached(key: string): DomainCacheEntry | null {
  const entry = domainCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry;
  return null;
}

function setCached(key: string, entry: Omit<DomainCacheEntry, "timestamp">) {
  domainCache.set(key, { ...entry, timestamp: Date.now() });
}

// ─────────────────────────────────────────────
// Main proxy
// ─────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  if (!siteConfig.apiBaseUrl) {
    console.error("[Proxy] API base URL is not configured");
    return NextResponse.next();
  }

  const url = new URL(request.url);
  const { pathname } = request.nextUrl;

  // ── 1. Handle auth tokens in URL ──────────────────────────────────────────
  const authToken = url.searchParams.get("auth_token");
  const refreshToken = url.searchParams.get("refresh_token");

  if (authToken) {
    const nextUrl = new URL(request.url);
    nextUrl.searchParams.delete("auth_token");
    nextUrl.searchParams.delete("refresh_token");

    const response = NextResponse.redirect(nextUrl);
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";
    const isProd = process.env.NODE_ENV === "production";

    let maxAge = 7 * 24 * 60 * 60;

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
      console.warn("[Proxy] Failed to parse JWT:", e);
    }

    const cookieOptions = {
      path: "/",
      secure: isProd,
      sameSite: "lax" as const,
      maxAge,
      httpOnly: false,
    };

    response.cookies.set("authToken", authToken, cookieOptions);
    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, cookieOptions);
    }

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

  // ── 2. Paths that always bypass rewriting ─────────────────────────────────
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
    "/permission-denied",
  ];

  // ── 3. Request on *.nepdora.com subdomain ─────────────────────────────────
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    // Bypass admin / builder routes
    if (allowedPaths.some(p => pathname.startsWith(p))) {
      // Tenant isolation: prevent a logged-in user for one tenant
      // from loading admin/builder UI on a different tenant host.
      if (pathname.startsWith("/admin") || pathname.startsWith("/builder")) {
        const authSubdomain = getSubdomainFromAuth(request);
        const hasAuthCookies =
          !!request.cookies.get("authToken")?.value ||
          !!request.cookies.get("authUser")?.value;
        // If we can't even determine which tenant the cookie belongs to,
        // fail closed and deny access when user appears authenticated.
        if (hasAuthCookies && (!authSubdomain || authSubdomain !== subdomain)) {
          return redirectToPermissionDenied(request);
        }
      }

      return NextResponse.next();
    }

    // Clean up accidental internal paths
    if (pathname.startsWith(`/publish/${subdomain}`)) {
      const cleanPath = pathname.replace(`/publish/${subdomain}`, "") || "/";
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }

    // Rewrite to internal publish route
    const newPath = `/publish/${subdomain}${pathname}`;
    return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // ── 4. Request on a fully custom domain (e.g. yachuindia.com) ─────────────
  if (isCustomDomain(request)) {
    if (siteConfig.isDev) return NextResponse.next();
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];

    // Look up which tenant owns this custom domain
    let cacheEntry = getCached(hostname);

    if (!cacheEntry) {
      const result = await fetchTenantDomainsByCustomDomain(hostname);
      cacheEntry = {
        customDomain: hostname,
        subdomain: result?.subdomain ?? null,
        timestamp: Date.now(),
      };
      setCached(hostname, cacheEntry);
    }

    // Tenant isolation: prevent a logged-in user for one tenant
    // from loading admin/builder UI on a different tenant host.
    if (allowedPaths.some(p => pathname.startsWith(p))) {
      if (pathname.startsWith("/admin") || pathname.startsWith("/builder")) {
        const authSubdomain = getSubdomainFromAuth(request);
        const expectedSubdomain = cacheEntry.subdomain;
        const hasAuthCookies =
          !!request.cookies.get("authToken")?.value ||
          !!request.cookies.get("authUser")?.value;
        if (
          hasAuthCookies &&
          (!expectedSubdomain || !authSubdomain || authSubdomain !== expectedSubdomain)
        ) {
          return redirectToPermissionDenied(request);
        }
      }

      return NextResponse.next();
    }

    if (cacheEntry.subdomain) {
      // Rewrite to /publish/[subdomain]/[...path] — content served from Next.js
      const newPath = `/publish/${cacheEntry.subdomain}${pathname}`;

      return NextResponse.rewrite(new URL(newPath, request.url));
    }

    // No tenant found for this custom domain — let Next.js handle it (404 etc.)
    console.warn(`[Custom Domain] No tenant found for "${hostname}"`);
    return NextResponse.next();
  }

  // ── 5. Root domain ─────────────────────────────────────────────────────────
  if (isRootDomain(request)) {
    if (!siteConfig.isDev) {
      const userSubdomain = getSubdomainFromAuth(request);
      if (
        userSubdomain &&
        (pathname.startsWith("/admin") || pathname.startsWith("/builder"))
      ) {
        const host = request.headers.get("host") || "";
        const protocol = request.url.includes("localhost") ? "http" : "https";
        const rootDomainFormatted = rootDomain.split(":")[0];
        let subdomainUrl: string;
        if (host.includes("localhost")) {
          const port = host.split(":")[1] || "3000";
          subdomainUrl = `${protocol}://${userSubdomain}.localhost:${port}${pathname}`;
        } else {
          subdomainUrl = `${protocol}://${userSubdomain}.${rootDomainFormatted}${pathname}`;
        }
        if (request.nextUrl.search) {
          subdomainUrl += request.nextUrl.search;
        }
        return NextResponse.redirect(new URL(subdomainUrl));
      }
    }
  }
  return NextResponse.next();
}

// ─────────────────────────────────────────────
// Matcher
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known|media|uploads|images|assets|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.avif$|.*\\.webp$).*)",
  ],
};
