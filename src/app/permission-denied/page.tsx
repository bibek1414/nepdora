import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Permission Denied | Nepdora",
  description:
    "You don’t have permission to view this page. Please log in to the correct tenant.",
};

export default async function PermissionDeniedPage({
  searchParams,
}: {
  searchParams: { tenant?: string };
}) {
  const params = await searchParams;
  let tenant = params.tenant;
  const protocol = siteConfig.isDev ? "http" : siteConfig.protocol;

  // Fallback: detect tenant from hostname if param is missing
  if (!tenant) {
    const headerList = await headers();
    const host = headerList.get("host") || "";
    const hostname = host.split(":")[0];
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "nepdora.com";

    if (hostname.endsWith(`.${baseDomain}`)) {
      const sub = hostname.replace(`.${baseDomain}`, "");
      if (sub && sub !== "www") {
        tenant = sub;
      }
    } else if (hostname.endsWith(".localhost")) {
      tenant = hostname.replace(".localhost", "");
    }
  }

  const homeUrl = `${protocol}://${siteConfig.isDev ? `localhost:${siteConfig.frontendDevPort}` : siteConfig.baseDomain}/`;
  const dashboardUrl = tenant
    ? `${protocol}://${tenant}.${siteConfig.baseDomain}/admin`
    : homeUrl;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-6 text-zinc-900">
      <div className="w-full max-w-xl">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-red-50/50" />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm transition-transform hover:scale-105">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2C9.79086 2 8 3.79086 8 6V8H7C5.89543 8 5 8.89543 5 10V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V10C19 8.89543 18.1046 8 17 8H16V6C16 3.79086 14.2091 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 8V6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="15" r="1.5" fill="currentColor" />
                <path
                  d="M12 16.5V18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Access Restricted
            </h1>
            <p className="mt-4 max-w-sm text-base text-zinc-600 leading-relaxed">
              {tenant ? (
                <>
                  You’re currently logged in, but you don’t have permission to
                  access the <b>{tenant}</b> account. Please switch accounts or
                  return home.
                </>
              ) : (
                "You don’t have permission to view this page. You may need to log in to a different account."
              )}
            </p>

            <div className="mt-10 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              {tenant && (
                <a
                  href={dashboardUrl}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98]"
                >
                  Log in as {tenant}
                </a>
              )}
              <a
                href={homeUrl}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98]"
              >
                Go back home
              </a>
            </div>

            <div className="mt-12 border-t border-zinc-100 pt-8 w-full">
              <p className="text-xs text-zinc-400">
                If you think this is a mistake, please contact support or try
                logging out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
