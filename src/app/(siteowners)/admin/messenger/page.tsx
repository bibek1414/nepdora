import { redirect } from "next/navigation";
import { getSubDomain } from "@/lib/server/get-subdomain";
import MessagingPage from "@/components/site-owners/admin/messenger/messenger";

export default async function MessengerPage() {
  const subDomain = await getSubDomain();

  if (!subDomain) {
    redirect("/login");
  }

  return <MessagingPage subDomain={subDomain} />;
}
