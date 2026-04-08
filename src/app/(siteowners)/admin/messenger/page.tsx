import { redirect } from "next/navigation";
import { getSubDomain } from "@/lib/server/get-subdomain";
import MessagingPage from "@/components/site-owners/admin/messenger/messenger";
import { FacebookProvider } from "@/contexts/FacebookContext";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Messenger",
    pageDescription:
      "Manage your Facebook and Instagram messages for {storeName} in one place. Connect with your customers directly through the admin dashboard.",
    pageRoute: "/admin/messenger",
  });
}

export default async function MessengerPage() {
  const subDomain = await getSubDomain();

  if (!subDomain) {
    redirect("/login");
  }

  return (
    <FacebookProvider>
      <MessagingPage subDomain={subDomain} />
    </FacebookProvider>
  );
}
