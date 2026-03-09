import { Metadata } from "next";
import { CustomersList } from "@/components/site-owners/admin/customers/customers-list";

export const metadata: Metadata = {
  title: "Customers - Admin Dashboard",
  description: "Manage registered customers for your site.",
};

export default function CustomersPage() {
  return <CustomersList />;
}
