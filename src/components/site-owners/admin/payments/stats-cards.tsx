"use client";

import { IconType } from "react-icons";

interface StatsCardProps {
  name: string;
  value: string | number;
  icon: IconType;
  color: string;
}

export function StatsCard({ name, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 text-white ${color} mr-4`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{name}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface PaymentStatsCardsProps {
  totalReceived: number;
  totalPaid: number;
  pendingBalance: number;
  isLoading?: boolean;
}

import {
  FiDollarSign,
  FiArrowUpRight,
  FiArrowDownRight,
  FiClock,
} from "react-icons/fi";

export function PaymentStatsCards({
  totalReceived,
  totalPaid,
  pendingBalance,
  isLoading,
}: PaymentStatsCardsProps) {
  const stats = [
    {
      name: "Total Received",
      value: isLoading ? "..." : `Rs. ${totalReceived.toLocaleString()}`,
      icon: FiArrowUpRight,
      color: "bg-green-500",
    },
    {
      name: "Total Paid",
      value: isLoading ? "..." : `Rs. ${totalPaid.toLocaleString()}`,
      icon: FiArrowDownRight,
      color: "bg-blue-500",
    },
    {
      name: "Pending Balance",
      value: isLoading ? "..." : `Rs. ${pendingBalance.toLocaleString()}`,
      icon: FiClock,
      color: pendingBalance > 0 ? "bg-orange-500" : "bg-gray-400",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
