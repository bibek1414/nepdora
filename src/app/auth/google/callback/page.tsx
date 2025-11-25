"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleAuthRedirectHandler } from "@/components/auth/GoogleAuthRedirectHandler";

export default function GoogleAuthCallbackPage() {
  return (
    <SessionProvider>
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-12 w-12 animate-spin text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
      <GoogleAuthRedirectHandler />
    </SessionProvider>
  );
}
