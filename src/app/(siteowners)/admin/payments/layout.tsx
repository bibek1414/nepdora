import React from "react";
import PaymentsTabs from "./payments-tabs";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Payment System",
    pageDescription:
      "Manage your store's payment gateways, transaction history, and platform subscriptions in one place.",
    pageRoute: "/admin/payments",
  });
}

interface PaymentsLayoutProps {
  children: React.ReactNode;
}

export default function PaymentsLayout({ children }: PaymentsLayoutProps) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Payment System
          </h1>
          <p className="mt-2 text-sm font-medium text-black/50">
            Configure gateways, track orders, and manage your billing.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <PaymentsTabs />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
