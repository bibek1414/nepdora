import { getServerUser } from "@/hooks/use-jwt-server";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import InquiriesClient from "./inquiries-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Inquiries",
    pageDescription:
      "Manage customer inquiries for {storeName}. View, respond, and track all incoming requests in one place.",
    pageRoute: "/admin/inquiries",
  });
}

export default async function InquiriesManagement() {
  const user = await getServerUser();
  const subDomain = user?.sub_domain;

  return <InquiriesClient subDomain={subDomain} />;
}
