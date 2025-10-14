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
 * Middleware: rewrites subdomain routes and redirects authenticated users
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // If user is on subdomain, handle normally
  if (subdomain) {
    // Allow /admin and /builder routes to pass through without rewriting
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/builder") ||
      pathname.startsWith("/support") ||
      pathname.startsWith("/preview")
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
 * Matcher: run middleware on all routes except API, Next internals, and static files
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|media|uploads|images|assets|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.avif$|.*\\.webp$).*)",
  ],
};
