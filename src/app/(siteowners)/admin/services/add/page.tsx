import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import AddServiceClient from "./add-service-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Add New Service",
    pageDescription:
      "Create and offer a new service for {storeName}. Define service details, categories, and descriptions for your customers.",
    pageRoute: "/admin/services/add",
  });
}

export default function AddServicePage() {
  return <AddServiceClient />;
}
