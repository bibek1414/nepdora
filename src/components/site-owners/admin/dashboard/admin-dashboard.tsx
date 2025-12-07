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

interface AdminDashboardProps {
  user?: UserType;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();
  const isServiceSite = user?.websiteType === "service";

  return (
    <div>
      <SessionProvider>
        <GoogleAuthRedirectHandler />
      </SessionProvider>

      <div className="mt-8 mb-40">
        {isServiceSite ? (
          <div className="mx-auto max-w-6xl space-y-8">
            <RecentInquiries />
            <RecentAppointments />
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
