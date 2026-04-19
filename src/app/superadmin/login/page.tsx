import AdminLogin from "@/components/super-admin/login/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Nepdora Superadmin",
  description: "Superadmin login for Nepdora platform.",
};

export default function SuperAdmin() {
  return <AdminLogin />;
}
