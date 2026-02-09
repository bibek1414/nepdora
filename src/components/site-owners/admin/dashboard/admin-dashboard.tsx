"use client";
import React from "react";
import Dashboard from "./dashboard";
import { useDashboardStats } from "@/hooks/owner-site/admin/use-dashboard";
import RecentOrders from "../orders/recent-orders";
import { GoogleAuthRedirectHandler } from "@/components/auth/GoogleAuthRedirectHandler";

import { SessionProvider } from "next-auth/react";
import { User as UserType } from "@/hooks/use-jwt-server";
import RecentInquiries from "../contact/recent-inquiries";
import RecentAppointments from "../appointments/recent-appointments";
import { StatsCards } from "./stats-cards";
import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";

interface AdminDashboardProps {
  user?: UserType;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  // Fetch counts for stats cards
  const { data: contactsData, isLoading: isContactsLoading } = useGetContacts({
    page: 1,
    page_size: 1,
  });
  const { data: appointmentsData, isLoading: isAppointmentsLoading } =
    useGetAppointments({ page: 1, page_size: 1 });
  const {
    data: pendingAppointmentsData,
    isLoading: isPendingAppointmentsLoading,
  } = useGetAppointments({ page: 1, page_size: 1, status: "pending" });

  const isServiceSite =
    user?.websiteType === "service" ||
    user?.websiteType === "SERVICE_WEBSITE" ||
    user?.websiteType === "AGENCY_WEBSITE" ||
    user?.websiteType === "CONSULTANCY_WEBSITE";

  return (
    <div>
      <SessionProvider>
        <GoogleAuthRedirectHandler />
      </SessionProvider>

      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
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
          <div>
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
