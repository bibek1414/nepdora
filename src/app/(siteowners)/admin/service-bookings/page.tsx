import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import ServiceBookingsClient from "./service-bookings-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Service Bookings",
    pageDescription:
      "Manage your scheduled service appointments for {storeName}. View upcoming and past bookings, and handle rescheduling or cancellations.",
    pageRoute: "/admin/service-bookings",
  });
}

export default function ServiceBookingsPage() {
  return <ServiceBookingsClient />;
}
