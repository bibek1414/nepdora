import { redirect } from "next/navigation";
import { getServerUser } from "@/hooks/use-jwt-server";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <SubscriptionProvider>
      <DynamicFavicon />
      <div className="flex min-h-screen flex-col bg-white">
        {/* POS Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="group flex items-center gap-2"
            >
              <div className="group-hover:bg-primary flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all group-hover:text-white group-active:scale-95">
                <ChevronLeft className="h-5 w-5" />
              </div>
            </Link>
            <div className="relative">
              <Image
                src="/nepdora-logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </SubscriptionProvider>
  );
}
