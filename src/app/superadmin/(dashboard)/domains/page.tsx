import DomainsPage from "@/components/super-admin/domain/domain-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Management | Nepdora Superadmin",
  description: "Manage and monitor custom domains connected to the platform.",
};

export default function page() {
  return <DomainsPage />;
}
