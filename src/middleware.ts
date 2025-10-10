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
 * Middleware: rewrites subdomain routes to /preview/[subdomain]/[...path]
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    // Allow /admin and /builder routes to pass through without rewriting
    if (pathname.startsWith("/admin") || pathname.startsWith("/builder")) {
      return NextResponse.next();
    }

    // If URL already contains /preview/[subdomain], redirect to clean URL
    if (pathname.startsWith(`/preview/${subdomain}`)) {
      const cleanPath = pathname.replace(`/preview/${subdomain}`, "") || "/";
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }

    // Rewrite all other subdomain routes to /preview/[subdomain]/[...path]
    const newPath = `/preview/${subdomain}${pathname}`;
    return NextResponse.rewrite(new URL(newPath, request.url));
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
