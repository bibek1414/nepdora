import { redirect } from "next/navigation";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Change Password",
    pageDescription: "Redirecting to account settings...",
    pageRoute: "/admin/change-password",
  });
}

export default function ChangePasswordPage() {
  redirect("/admin/settings/account");
}
