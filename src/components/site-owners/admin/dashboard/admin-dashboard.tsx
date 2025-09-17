"use client";
import React from "react";
import Dashboard from "./dashboard";
import { useDashboardStats } from "@/hooks/owner-site/admin/use-dashboard";

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
