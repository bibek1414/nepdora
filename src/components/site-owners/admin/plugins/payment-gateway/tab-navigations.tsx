"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentGateway {
  id: string;
  title: string;
  description: string;
  path: string;
}

const paymentItems: PaymentGateway[] = [
  {
    id: "Esewa",
    title: "Esewa Setup",
    description: "Manage your domain settings and configurations",
    path: "/admin/plugins/payment-gateway/esewa",
  },
  {
    id: "Khalti",
    title: "Khalti Setup",
    description: "Configure Khalti gateways and billing settings",
    path: "/admin/plugins/payment-gateway/khalti",
  },
];

export default function TabsNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentTab = () => {
    const currentItem = paymentItems.find(item =>
      pathname.startsWith(item.path)
    );
    return currentItem ? currentItem.id : paymentItems[0].id;
  };

  const handleTabChange = (tabId: string) => {
    const selectedItem = paymentItems.find(item => item.id === tabId);
    if (selectedItem) router.push(selectedItem.path);
  };

  return (
    <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
      <TabsList className="flex">
        {paymentItems.map(item => {
          const isActive = getCurrentTab() === item.id;
          return (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className={`flex w-fit cursor-pointer items-center gap-1 ${
                isActive ? "rounded-full bg-[#f3f4f6]" : "bg-white"
              }`}
            >
              <span className="hidden sm:inline">{item.title}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
