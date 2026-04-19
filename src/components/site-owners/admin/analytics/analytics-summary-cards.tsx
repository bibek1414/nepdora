"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsStats } from "@/types/owner-site/admin/stats";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  CreditCard,
  Truck,
  DollarSign,
} from "lucide-react";

interface AnalyticsSummaryCardsProps {
  data?: AnalyticsStats;
  isLoading?: boolean;
}

const cards = (data?: AnalyticsStats) => [
  {
    title: "Revenue",
    value: `Rs. ${data?.revenue?.toLocaleString() ?? "0"}`,
    icon: DollarSign,
    iconClass: "text-blue-600",
    iconBg: "bg-blue-50",
    accent: "border-blue-100",
  },
  {
    title: "Orders",
    value: String(data?.orders ?? 0),
    icon: ShoppingBag,
    iconClass: "text-violet-600",
    iconBg: "bg-violet-50",
    accent: "border-violet-100",
  },
  {
    title: "Delivery Charge",
    value: `Rs. ${data?.delivery_charge?.toLocaleString() ?? "0"}`,
    icon: Truck,
    iconClass: "text-orange-600",
    iconBg: "bg-orange-50",
    accent: "border-orange-100",
  },
  {
    title: "Online Payments",
    value: `Rs. ${data?.online_payments?.toLocaleString() ?? "0"}`,
    icon: CreditCard,
    iconClass: "text-emerald-600",
    iconBg: "bg-emerald-50",
    accent: "border-emerald-100",
  },
  {
    title: "Unique Customers",
    value: String(data?.unique_customers ?? 0),
    icon: Users,
    iconClass: "text-indigo-600",
    iconBg: "bg-indigo-50",
    accent: "border-indigo-100",
  },
  {
    title: "Avg Order Value",
    value: `Rs. ${data?.average_order_value?.toFixed(0) ?? "0"}`,
    icon: TrendingUp,
    iconClass: "text-rose-600",
    iconBg: "bg-rose-50",
    accent: "border-rose-100",
  },
];

export default function AnalyticsSummaryCards({
  data,
  isLoading,
}: AnalyticsSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards(data).map((card, i) => (
        <div
          key={i}
          className={`flex flex-col gap-3 rounded-xl border border-black/[0.07] bg-white p-4 -[0_1px_3px_rgba(0,0,0,0.04)] transition- hover:-[0_4px_12px_rgba(0,0,0,0.07)]`}
        >
          {/* Icon */}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}
          >
            <card.icon className={`h-4 w-4 ${card.iconClass}`} />
          </div>

          {/* Value */}
          <div className="flex flex-col gap-0.5">
            <span className="truncate text-[17px] leading-tight font-semibold text-gray-900">
              {card.value}
            </span>
            <span className="text-[13px] font-medium text-gray-500">
              {card.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
