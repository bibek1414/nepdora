import { type NextRequest, NextResponse } from "next/server";
import { rootDomain } from "./config/site";

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
      // Simple JWT decode (without verification - just for subdomain extraction)
      const parts = authToken.value.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        return payload.sub_domain || null;
      }
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
 * proxy: rewrites subdomain routes and redirects authenticated users
 */
export async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const authToken = url.searchParams.get("auth_token");
  const refreshToken = url.searchParams.get("refresh_token");

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
      const [, payloadBase64] = authToken.split(".");
      if (payloadBase64) {
        // Use atob for Edge runtime compatibility
        const payload = JSON.parse(
          atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (payload.exp) {
          maxAge = Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
        }

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

    const cookieOptions = {
      path: "/",
      secure: isProd,
      sameSite: "lax" as const,
      maxAge: maxAge,
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

  // If user is on subdomain, handle normally
  if (subdomain) {
    // Allow /admin and /builder routes to pass through without rewriting
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/builder") ||
      pathname.startsWith("/support") ||
      pathname.startsWith("/payment") ||
      pathname.startsWith("/preview") ||
      pathname.startsWith("/location") ||
      pathname.startsWith("/on-boarding") ||
      pathname.startsWith("/subscription")
    ) {
      return NextResponse.next();
    }

    // If URL already contains /publish/[subdomain], redirect to clean URL
    if (pathname.startsWith(`/publish/${subdomain}`)) {
      const cleanPath = pathname.replace(`/publish/${subdomain}`, "") || "/";
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }

    // Rewrite all other subdomain routes to /publish/[subdomain]/[...path]
    const newPath = `/publish/${subdomain}${pathname}`;
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
