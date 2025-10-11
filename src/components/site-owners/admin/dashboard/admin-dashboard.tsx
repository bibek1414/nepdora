"use client";
import React from "react";
import Dashboard from "./dashboard";
import { useDashboardStats } from "@/hooks/owner-site/admin/use-dashboard";
import RecentOrders from "../orders/recent-orders";
export default function AdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  return (
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
  );
}
