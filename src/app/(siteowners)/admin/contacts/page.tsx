import ContactDetails from "@/components/site-owners/admin/contact/contact-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Contact Management",
    pageDescription:
      "Manage contact information efficiently in {storeName}. View, edit, and organize all customer or user contacts from the admin dashboard.",
    pageRoute: "/admin/contacts",
  });
}

const ContactPage = () => {
  return (
    <div className="container mx-auto p-6">
      <ContactDetails />
    </div>
  );
};

export default ContactPage;
