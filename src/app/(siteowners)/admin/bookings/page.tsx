import { getServerUser } from "@/hooks/use-jwt-server";
import BookingsClient from "./bookings-client";

export default async function BookingsPage() {
  const user = await getServerUser();
  const subDomain = user?.sub_domain;

  return <BookingsClient subDomain={subDomain} />;
}
