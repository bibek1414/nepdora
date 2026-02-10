import OnboardingPage from "@/components/on-boarding/on-boarding";
import { getServerUser } from "@/hooks/use-jwt-server";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  return <OnboardingPage user={user} />;
}
