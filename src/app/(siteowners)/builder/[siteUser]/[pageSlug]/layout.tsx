import { DynamicFontProvider } from "@/providers/dynamic-font-provider";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { SubscriptionBlocker } from "@/components/site-owners/admin/subscription/subscription-blocker";
import { getServerUser } from "@/hooks/use-jwt-server";
import { redirect } from "next/navigation";
export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Website Builder",
    pageDescription:
      "Access the powerful website builder for {storeName}. Customize pages, layouts, and design elements in real time for a seamless building experience.",
    pageRoute: "/builder",
  });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/permission-denied");
  }
  return (
    <SubscriptionProvider>
      <DynamicFavicon />
      <DynamicFontProvider>{children}</DynamicFontProvider>
      <SubscriptionBlocker />
    </SubscriptionProvider>
  );
}
