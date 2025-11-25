"use client";
import React from "react";
import Dashboard from "./dashboard";
import { useDashboardStats } from "@/hooks/owner-site/admin/use-dashboard";
import RecentOrders from "../orders/recent-orders";
import { GoogleAuthRedirectHandler } from "@/components/auth/GoogleAuthRedirectHandler";

import { SessionProvider } from "next-auth/react";
export default function AdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  return (
    <div>
      <SessionProvider>
        <GoogleAuthRedirectHandler />
      </SessionProvider>

      <Dashboard
        data={data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
      />
      <div className="mb-40">
        <RecentOrders />
      </div>
    </div>
  );
}
