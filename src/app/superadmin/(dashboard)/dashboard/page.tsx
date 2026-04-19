import DashboardClient from "./dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Nepdora Superadmin",
  description: "Platform-wide overview and statistics for super-admins.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
