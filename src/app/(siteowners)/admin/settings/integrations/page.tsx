// src/app/(siteowners)/admin/settings/integrations/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function IntegrationsPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "facebook_connected") {
      setMessage({ type: "success", text: "Facebook successfully connected!" });
    } else if (error) {
      setMessage({ type: "error", text: decodeURIComponent(error) });
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Integrations</h1>

      {message && (
        <div
          className={`mb-6 rounded p-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div className="rounded border p-4">
          <h2 className="mb-2 text-xl font-semibold">Facebook Integration</h2>
          <p className="mb-4 text-gray-600">
            Connect your Facebook page to manage messages
          </p>
          {/* Add your Facebook connect button here */}
        </div>
      </div>
    </div>
  );
}
