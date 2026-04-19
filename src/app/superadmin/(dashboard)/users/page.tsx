import UsersPage from "@/components/super-admin/user/user-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | Nepdora Superadmin",
  description: "Overview and management of all platform users.",
};

export default function Page() {
  return <UsersPage />;
}
