"use client";
import React from "react";
import Dashboard from "./dashboard-stats";
import { useDashboardStats } from "@/hooks/owner-site/use-dashboard";

export default function AdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useDashboardStats();

  return (
    <Dashboard
      data={data}
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
    />
  );
}
