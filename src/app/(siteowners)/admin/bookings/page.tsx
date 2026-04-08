import { getServerUser } from "@/hooks/use-jwt-server";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import BookingsClient from "./bookings-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Bookings",
    pageDescription:
      "View and manage your {storeName} bookings efficiently. Monitor upcoming appointments and service orders.",
    pageRoute: "/admin/bookings",
  });
}

export default async function BookingsPage() {
  const user = await getServerUser();
  const subDomain = user?.sub_domain;

  return <BookingsClient subDomain={subDomain} />;
}
