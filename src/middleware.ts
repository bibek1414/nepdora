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
    // e.g., bibek.localhost:3000
    const match = url.match(/http:\/\/([^.]+)\.localhost/);
    if (match && match[1]) return match[1];

    // fallback
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
 * Middleware: rewrites / → /preview/[subdomain] if subdomain exists
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // console.log("Middleware triggered:", request.url);
  // console.log("Extracted subdomain:", subdomain);

  if (subdomain) {
    // Block access to admin pages from subdomains
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Root path on subdomain → rewrite to /preview/[subdomain]
    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL(`/preview/${subdomain}`, request.url)
      );
    }

    // Optional: rewrite other pages for multi-page previews
    // e.g., /about → /preview/[subdomain]/about
    // const newPath = `/preview/${subdomain}${pathname}`;
    // return NextResponse.rewrite(new URL(newPath, request.url));
  }

  // Root domain: allow normal access
  return NextResponse.next();
}

/**
 * Matcher: only run middleware on pages (exclude API, Next internals, public files)
 */
export const config = {
  matcher: [
    "/((?!api|_next|[\\w-]+\\.\\w+).*)", // excludes /api, /_next/*, and files like /favicon.ico
  ],
};
