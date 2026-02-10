import { getServerUser } from "@/hooks/use-jwt-server";
import InquiriesClient from "./inquiries-client";

export default async function InquiriesManagement() {
  const user = await getServerUser();
  const subDomain = user?.sub_domain;

  return <InquiriesClient subDomain={subDomain} />;
}
