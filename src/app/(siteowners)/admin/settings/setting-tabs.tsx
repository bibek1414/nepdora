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
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {filteredItems.map(item => {
          const isActive = getCurrentTab() === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer
                ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {item.title}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
