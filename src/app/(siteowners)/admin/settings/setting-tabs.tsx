"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  path: string;
  hideForService?: boolean;
}

interface SettingsTabsProps {
  items: SettingItem[];
  websiteType?: string;
}

export default function SettingsTabs({
  items,
  websiteType,
}: SettingsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // filter items
  const filteredItems = items.filter(item => {
    if (websiteType === "service" && item.hideForService) return false;
    return true;
  });

  // current active tab
  const getCurrentTab = () => {
    const currentItem = filteredItems.find(item =>
      pathname.startsWith(item.path)
    );
    return currentItem ? currentItem.id : filteredItems[0]?.id;
  };

  // handle change
  const handleTabChange = (tabId: string) => {
    const selected = filteredItems.find(item => item.id === tabId);
    if (selected) router.push(selected.path);
  };

  return (
    <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
      <TabsList className="flex">
        {filteredItems.map(item => {
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
