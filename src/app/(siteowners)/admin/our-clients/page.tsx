import OurClientList from "@/components/site-owners/admin/our-clients/our-client-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Our Clients",
    pageDescription:
      "Manage your client logos and partnerships. Add, edit, and organize the clients displayed on your site.",
    pageRoute: "/admin/our-clients",
  });
}

const OurClientsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <OurClientList />
    </div>
  );
};

export default OurClientsPage;
