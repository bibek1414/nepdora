import WhatsAppList from "@/components/site-owners/admin/plugins/whatsapp/whatsapp-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "WhatsApp Integration",
    pageDescription:
      "Configure and manage your WhatsApp integration for {storeName}. Set up automated messages and customer support.",
    pageRoute: "/admin/plugins/whatsapp",
  });
}

export default function WhatsAppPage() {
  return <WhatsAppList />;
}
