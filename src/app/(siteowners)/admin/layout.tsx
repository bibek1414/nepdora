import { redirect } from "next/navigation";
import AdminSidebar from "@/components/site-owners/admin/admin-sidebar";
import AdminHeader from "@/components/site-owners/admin/admin-header";
import { getServerUser } from "@/hooks/use-jwt-server";
import { FacebookProvider } from "@/contexts/FacebookContext";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { SubscriptionBlocker } from "@/components/site-owners/admin/subscription/subscription-blocker";

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
      <SubscriptionProvider>
        <DynamicFavicon />
        <div className="flex min-h-screen bg-white">
          <AdminSidebar user={user} />
          <div className="flex flex-1 flex-col">
            <AdminHeader user={user} />
            <main className="flex-1">{children}</main>
          </div>
        </div>
        <SubscriptionBlocker />
      </SubscriptionProvider>
    </FacebookProvider>
  );
}
