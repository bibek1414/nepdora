import { redirect } from "next/navigation";
import AdminSidebar from "@/components/site-owners/admin/admin-sidebar";
import AdminHeader from "@/components/site-owners/admin/admin-header";
import { getServerUser } from "@/hooks/use-jwt-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={user} />
      <div className="flex flex-1 flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
