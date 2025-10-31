import { redirect } from "next/navigation";
import AdminSidebar from "@/components/site-owners/admin/admin-sidebar";
import AdminHeader from "@/components/site-owners/admin/admin-header";
import { getServerUser } from "@/hooks/use-jwt-server";
import { FacebookProvider } from "@/contexts/FacebookContext";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <FacebookProvider>
      <DynamicFavicon />
      <div className="flex min-h-screen bg-white">
        <AdminSidebar user={user} />
        <div className="mt-15 flex flex-1 flex-col">
          <AdminHeader user={user} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </FacebookProvider>
  );
}
