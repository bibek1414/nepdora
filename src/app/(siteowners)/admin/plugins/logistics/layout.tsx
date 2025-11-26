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

const settingsItems: PaymentGateway[] = [
  {
    id: "Dash",
    title: "Dash Setup",
    description: "Manage your domain settings and configurations",
    path: "/admin/plugins/logistics/dash",
  },
  {
    id: "YDM",
    title: "YDM Setup",
    description: "Manage your domain settings and configurations",
    path: "/admin/plugins/logistics/ydm",
  },
];

export default function LogisticsLayout({
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
          Logistics
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
