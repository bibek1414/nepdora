import { redirect } from "next/navigation";
import { use } from "react";

interface BuilderRedirectProps {
  params: Promise<{ siteUser: string }>;
}

export default function BuilderRedirect({ params }: BuilderRedirectProps) {
  const { siteUser } = use(params);

  redirect(`/builder/${siteUser}/home`);
}
