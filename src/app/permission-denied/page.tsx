import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Permission Denied | Nepdora",
  description:
    "You don’t have permission to view this page. Please log in to the correct tenant.",
};

export default function PermissionDeniedPage() {
  const protocol = siteConfig.isDev ? "http" : siteConfig.protocol;
  const homeUrl = `${protocol}://${siteConfig.baseDomain}/`;
  const loginUrl = `${protocol}://${siteConfig.baseDomain}/admin/login`;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-6 text-gray-900">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            {/* Simple inline illustration (lock + warning) */}
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 2C9.79086 2 8 3.79086 8 6V8H7C5.89543 8 5 8.89543 5 10V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V10C19 8.89543 18.1046 8 17 8H16V6C16 3.79086 14.2091 2 12 2Z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M9 8V6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6V8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M12 12V17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M12 19.2H12.01"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Permission denied
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            You’re logged in, but you’re trying to access an admin/builder
            page for a different tenant. Please log in again to the correct
            account.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={homeUrl}
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Go to home
            </a>

            <a
              href={loginUrl}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
            >
              Login
            </a>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            If you think this is a mistake, contact support and mention the
            tenant you’re trying to access.
          </div>
        </div>
      </div>
    </div>
  );
}

