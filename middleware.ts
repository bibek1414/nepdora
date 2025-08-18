import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;

  // Extract subdomain (supports localhost dev: <sub>.localhost:3000)
  const isLocalhost = host.includes("localhost");
  let subdomain = "";
  if (isLocalhost) {
    const [maybeSub] = host.split(".");
    if (maybeSub && maybeSub !== "localhost") subdomain = maybeSub;
  } else {
    // e.g., foo.nepdora.com => foo
    const parts = host.split(".");
    if (parts.length > 2) {
      subdomain = parts[0];
    }
  }

  const response = NextResponse.next();
  if (subdomain) {
    response.headers.set("x-tenant-subdomain", subdomain);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
