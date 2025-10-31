"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Globe, CreditCard, Truck } from "lucide-react";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  path: string;
}

const settingsItems: SettingItem[] = [
  {
    id: "delivery-charge",
    title: "Delivery Charge",
    description: "Configure delivery-charge gateways and billing settings",
    path: "/admin/settings/delivery-charge",
  },
  {
    id: "site-config",
    title: "Site Configuration",
    description: "Configure site-config gateways and billing settings",
    path: "/admin/settings/site-config",
  },
  {
    id: "domains",
    title: "Domains",
    description: "Manage your domain settings and configurations",
    path: "/admin/settings/domains",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Get current active tab based on pathname
  const getCurrentTab = () => {
    const currentItem = settingsItems.find(item =>
      pathname.startsWith(item.path)
    );
    return currentItem ? currentItem.id : settingsItems[0].id;
  };

  const handleTabChange = (tabId: string) => {
    const selectedItem = settingsItems.find(item => item.id === tabId);
    if (selectedItem) {
      router.push(selectedItem.path);
    }
  };

  return (
    <div className="mx-auto px-20 py-20">
      <div className="mb-3">
        <h1 className="px-2 text-2xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
      </div>

      <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
        <TabsList className="flex">
          {settingsItems.map(item => {
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

      <div className="mt-2">{children}</div>
    </div>
  );
}
