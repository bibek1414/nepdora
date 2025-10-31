"use client";

import { Suspense } from "react";
import { FacebookAuthHandler } from "@/components/facebook/FacebookAuthHandler";

function CallbackContent() {
  return <FacebookAuthHandler />;
}

export default function FacebookCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-lg">Loading...</span>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
