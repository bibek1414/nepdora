import { getServerUser } from "@/hooks/use-jwt-server";
import InquiriesClient from "./inquiries-client";

export default async function InquiriesManagement() {
  const user = await getServerUser();
  const subDomain = user?.subDomain;

  return <InquiriesClient subDomain={subDomain} />;
}
