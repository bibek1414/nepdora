"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { History, Settings2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentTabItem {
  id: string;
  title: string;
  path: string;
  icon: any;
}

const paymentTabs: PaymentTabItem[] = [
  {
    id: "history",
    title: "Payment History",
    path: "/admin/payments/history",
    icon: History,
  },
  {
    id: "gateways",
    title: "Gateways",
    path: "/admin/payments/gateways",
    icon: Settings2,
  },
  {
    id: "subscriptions",
    title: "Subscription History",
    path: "/admin/payments/subscriptions",
    icon: CreditCard,
  },
];

export default function PaymentsTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const getCurrentTab = () => {
    const currentItem = paymentTabs.find(item =>
      pathname.startsWith(item.path)
    );
    return currentItem ? currentItem.id : paymentTabs[0].id;
  };

  const handleTabChange = (path: string) => {
    router.push(path);
  };

  return (
    <div className="border-b border-black/5">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {paymentTabs.map(item => {
          const isActive = getCurrentTab() === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.path)}
              className={cn(
                "group flex cursor-pointer items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-all",
                isActive
                  ? "border-[#003d79] text-[#003d79]"
                  : "border-transparent text-black/50 hover:border-black/20 hover:text-black"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive
                    ? "text-[#003d79]"
                    : "text-black/40 group-hover:text-black/60"
                )}
              />
              {item.title}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
