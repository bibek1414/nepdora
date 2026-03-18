"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

interface AnalyticsSummaryCardsProps {
  data?: AnalyticsStats;
  isLoading?: boolean;
}

export default function AnalyticsSummaryCards({
  data,
  isLoading,
}: AnalyticsSummaryCardsProps) {
  const cards = [
    {
      title: "Revenue",
      value: `Rs. ${data?.revenue?.toLocaleString() ?? 0}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Orders",
      value: data?.orders ?? 0,
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Delivery Charge",
      value: `Rs. ${data?.delivery_charge?.toLocaleString() ?? 0}`,
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Online Payments",
      value: `Rs. ${data?.online_payments?.toLocaleString() ?? 0}`,
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Unique Customers",
      value: data?.unique_customers ?? 0,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Avg Order Value",
      value: `Rs. ${data?.average_order_value?.toFixed(2) ?? 0}`,
      icon: TrendingUp,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="border bg-white p-4 shadow-none transition-all hover:bg-slate-50/50"
        >
          <div className="flex items-center gap-4">
            <div className={cn("shrink-0 rounded-xl p-2.5", card.bgColor)}>
              <card.icon className={cn("h-5 w-5", card.color)} />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {card.title}
              </span>
              <span className="truncate text-lg font-bold text-gray-900">
                {card.value}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
