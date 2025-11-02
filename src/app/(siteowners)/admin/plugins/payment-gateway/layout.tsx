import React from "react";
import TabsNavigation from "@/components/site-owners/admin/plugins/payment-gateway/tab-navigations";
import PaymentPageHeader from "@/components/site-owners/admin/plugins/payment-gateway/payment-page-header";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto px-20 py-20">
      <PaymentPageHeader title="Payment Gateway" />
      <TabsNavigation />
      <div className="mt-2">{children}</div>
    </div>
  );
}
