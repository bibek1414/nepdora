"use client";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  trendColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trendColor }) => {
  // Generate consistent bar heights for the chart
  const barHeights = React.useMemo(() => {
    return Array.from({ length: 7 }).map(() => Math.random() * 60 + 30);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-100 bg-white p-6">
      {/* Title at the top */}
      <div className="mb-4 text-sm font-medium text-gray-600">{title}</div>

      {/* Value and chart side by side */}
      <div className="flex items-end justify-between gap-4">
        {/* Left side: Value and change */}
        <div className="flex-1">
          <div className="mb-2 text-3xl font-bold text-gray-900">{value}</div>
        </div>

        {/* Right side: Bar chart */}
        <div className="flex h-12 items-end gap-1">
          {barHeights.map((height, i) => (
            <div
              key={i}
              className={`${trendColor} rounded-sm`}
              style={{
                height: `${height}%`,
                width: "8px",
                minHeight: "4px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface StatsCardsProps {
  inquiriesCount?: number;
  appointmentsCount?: number;
  pendingAppointmentsCount?: number;
  isLoading?: boolean;
}

export function StatsCards({
  inquiriesCount,
  appointmentsCount,
  pendingAppointmentsCount,
  isLoading,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Inquiries",
      value: isLoading ? "..." : (inquiriesCount || 0).toString(),
      change: 2.6,
      trendColor: "bg-green-500",
    },
    {
      title: "Total Appointments",
      value: isLoading ? "..." : (appointmentsCount || 0).toString(),
      change: 0.2,
      trendColor: "bg-blue-500",
    },
    {
      title: "Appointments Left",
      value: isLoading ? "..." : (pendingAppointmentsCount || 0).toString(),
      change: -0.1,
      trendColor: "bg-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
