import { TrendingUp } from "lucide-react";
import StatCard from "./stat-card";
import { DashboardStats } from "@/types/owner-site/admin/dashboard";

interface DashboardProps {
  data?: DashboardStats;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  refetch?: () => void;
}

export default function Dashboard({
  data,
  isLoading,
  isError,
  error,
  refetch,
}: DashboardProps) {
  const handleRefresh = () => {
    refetch?.();
  };

  // Derived stats with defaults
  const stats = {
    totalOrders: data?.total_orders ?? 0,
    totalOrdersThisMonth: data?.total_orders_this_month ?? 0,
    totalRevenue: data?.total_revenue ?? 0,
    revenueThisMonth: data?.revenue_this_month ?? 0,
  };

  // Calculate percentage changes (mock data for demo)
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const dashboardStats = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: getPercentageChange(stats.totalOrders, stats.totalOrders * 0.97),
      icon: "/images/site-owners/dashboard/dashboard1.svg",
      bgColor: "bg-green-50",
      trendColor: "bg-green-600",
    },
    {
      title: "Orders This Month",
      value: stats.totalOrdersThisMonth.toLocaleString(),
      change: getPercentageChange(
        stats.totalOrdersThisMonth,
        stats.totalOrdersThisMonth * 1.1
      ),
      icon: "/images/site-owners/dashboard/dashboard2.svg",
      bgColor: "bg-purple-50",
      trendColor: "bg-purple-600",
    },
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "NPR",
        maximumFractionDigits: 0,
      }).format(stats.totalRevenue),
      change: getPercentageChange(
        stats.totalRevenue,
        stats.totalRevenue * 0.97
      ),
      icon: "/images/site-owners/dashboard/dashboard3.svg",
      bgColor: "bg-yellow-50",
      trendColor: "bg-orange-600",
    },
    {
      title: "Revenue This Month",
      value: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "NPR",
        maximumFractionDigits: 0,
      }).format(stats.revenueThisMonth),
      change: getPercentageChange(
        stats.revenueThisMonth,
        stats.revenueThisMonth * 0.96
      ),
      icon: "/images/site-owners/dashboard/dashboard4.svg",
      bgColor: "bg-red-50",
      trendColor: "bg-red-600",
    },
  ];

  return (
    <div className="">
      <div className="mx-auto">
        {isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-100 p-4 text-red-700">
            <p className="font-medium">Error loading dashboard data</p>
            <p className="text-sm">
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
