"use client";

import { FiUsers, FiGlobe, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import StatsCard from "@/components//super-admin/dashboard/statscard";
import RecentActivity from "@/components//super-admin/dashboard/recentactivity";

const stats = [
  { name: "Domains", value: 12, icon: FiGlobe, color: "bg-blue-500" },
  { name: "Stores", value: 8, icon: FiShoppingBag, color: "bg-green-500" },
  { name: "Users", value: 152, icon: FiUsers, color: "bg-purple-500" },
  {
    name: "Revenue",
    value: "$12,430",
    icon: FiDollarSign,
    color: "bg-yellow-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <StatsCard
            key={stat.name}
            name={stat.name}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
