import { redirect } from "next/navigation";
import { getSubDomain } from "@/lib/server/get-subdomain";
import MessagingPage from "@/components/site-owners/admin/messenger/messenger";
import { FacebookProvider } from "@/contexts/FacebookContext";

export default async function MessengerPage() {
  const subDomain = await getSubDomain();

  if (!subDomain) {
    redirect("/login");
  }

  return (
    <FacebookProvider>
      <MessagingPage subDomain={subDomain} />
    </FacebookProvider>
  );
}
