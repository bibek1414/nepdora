"use client";
import React from "react";
import Dashboard from "./dashboard";
import { useDashboardStats } from "@/hooks/owner-site/admin/use-dashboard";
import RecentOrders from "../orders/recent-orders";
import { GoogleAuthRedirectHandler } from "@/components/auth/GoogleAuthRedirectHandler";

import { SessionProvider } from "next-auth/react";
import { User } from "@/types/auth/auth";
import RecentInquiries from "../contact/recent-inquiries";
import RecentAppointments from "../appointments/recent-appointments";
import { StatsCards } from "./stats-cards";
import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalyticsSummaryCards from "../analytics/analytics-summary-cards";
import { useAnalyticsStats } from "@/hooks/owner-site/admin/use-analytics-stats";

interface AdminDashboardProps {
  user?: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const isServiceSite =
    user?.website_type === "service" ||
    user?.website_type === "SERVICE_WEBSITE" ||
    user?.website_type === "AGENCY_WEBSITE" ||
    user?.website_type === "CONSULTANCY_WEBSITE";

  const { data, isLoading, isError, error, refetch } = useDashboardStats({
    enabled: !isServiceSite,
  });

  // Fetch counts for stats cards
  const { data: contactsData, isLoading: isContactsLoading } = useGetContacts(
    {
      page: 1,
      page_size: 1,
    },
    { enabled: isServiceSite }
  );
  const { data: appointmentsData, isLoading: isAppointmentsLoading } =
    useGetAppointments({ page: 1, page_size: 1 }, { enabled: isServiceSite });
  const {
    data: pendingAppointmentsData,
    isLoading: isPendingAppointmentsLoading,
  } = useGetAppointments(
    { page: 1, page_size: 1, status: "pending" },
    { enabled: isServiceSite }
  );

  return (
    <div>
      <SessionProvider>
        <GoogleAuthRedirectHandler />
      </SessionProvider>

      <div className="mx-auto mt-12 mb-40 max-w-7xl px-6 md:px-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name || user?.store_name || "Admin"}
            </h1>
            <p className="text-sm text-gray-500">
              Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
          {user?.website_type === "ecommerce" && (
            <Link href="/admin/analytics">
              <Button className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                View Full Analytics
              </Button>
            </Link>
          )}
        </div>

        {isServiceSite ? (
          <div className="space-y-12">
            <StatsCards
              inquiriesCount={contactsData?.count}
              appointmentsCount={appointmentsData?.count}
              pendingAppointmentsCount={pendingAppointmentsData?.count}
              isLoading={
                isContactsLoading ||
                isAppointmentsLoading ||
                isPendingAppointmentsLoading
              }
            />

            <div className="grid gap-8 md:grid-cols-2">
              <RecentInquiries />
              <RecentAppointments />
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Simple Analytics Summary */}

            <Dashboard
              data={data}
              isLoading={isLoading}
              isError={isError}
              error={error}
              refetch={refetch}
            />

            <RecentOrders />
          </div>
        )}
      </div>
    </div>
  );
}
