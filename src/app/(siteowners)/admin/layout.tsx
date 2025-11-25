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

  console.log("[AdminLayout] User check:", {
    hasUser: !!user,
    user: user
      ? {
          id: user.id,
          email: user.email,
          subDomain: user.subDomain,
        }
      : null,
  });

  if (!user) {
    console.log("[AdminLayout] No user, redirecting to login");
    redirect("/admin/login");
  }

  return (
    <FacebookProvider>
      <SubscriptionProvider>
        <DynamicFavicon />
        <div className="flex min-h-screen bg-white">
          <AdminSidebar user={user} />
          <div className="mt-15 flex flex-1 flex-col">
            <AdminHeader user={user} />
            <main className="flex-1">{children}</main>
          </div>
        </div>
        <SubscriptionBlocker />
      </SubscriptionProvider>
    </FacebookProvider>
  );
}
