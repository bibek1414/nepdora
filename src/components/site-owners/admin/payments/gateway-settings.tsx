"use client";

import React, { useState } from "react";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import EsewaPage from "@/components/site-owners/admin/plugins/payment-gateway/esewa";
import KhaltiPage from "@/components/site-owners/admin/plugins/payment-gateway/khalti";

export default function GatewaySettings() {
  const [activeGateway, setActiveGateway] = useState<"esewa" | "khalti">(
    "esewa"
  );

  return (
    <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center rounded-lg bg-black/5 p-1">
          <button
            onClick={() => setActiveGateway("esewa")}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all",
              activeGateway === "esewa"
                ? "bg-white text-green-600 shadow-sm"
                : "text-black/60 hover:text-black"
            )}
          >
            <Wallet className="h-4 w-4" />
            eSewa
          </button>
          <button
            onClick={() => setActiveGateway("khalti")}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all",
              activeGateway === "khalti"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-black/60 hover:text-black"
            )}
          >
            <Wallet className="h-4 w-4" />
            Khalti
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeGateway === "esewa" ? <EsewaPage /> : <KhaltiPage />}
      </div>
    </div>
  );
}
