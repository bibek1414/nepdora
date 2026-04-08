import { redirect } from "next/navigation";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Profile",
    pageDescription: "Redirecting to account settings...",
    pageRoute: "/admin/profile",
  });
}

const AdminProfile = () => {
  redirect("/admin/settings/account");
};

export default AdminProfile;
