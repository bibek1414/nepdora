import MessagingPage from "@/components/site-owners/admin/messenger/messenger";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Messenger Management",
    pageDescription:
      "Handle real-time conversations with customers in {storeName}. Manage chats, respond instantly, and view all messages directly from your admin dashboard.",
    pageRoute: "/admin/messenger",
  });
}

export default function MessengerPage() {
  return <MessagingPage />;
}
