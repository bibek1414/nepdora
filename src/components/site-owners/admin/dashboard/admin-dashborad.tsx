import { redirect } from "next/navigation";
import { getServerUser } from "@/hooks/use-jwt-server";
import { SiteManager } from "@/components/site-owners/admin/site-manager";

export default async function AdminDashboardPage() {
  const user = await getServerUser();

  // If no user is found (not logged in), redirect to the login page
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <SiteManager user={user} />
        </div>
      </main>
    </div>
  );
}
