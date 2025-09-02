import React from "react";
import Link from "next/link";
import { getServerUser } from "@/hooks/use-jwt-server";
import { siteConfig } from "@/config/site";

async function DomainsPage() {
  const user = await getServerUser();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Please log in to view your domain.</p>
      </div>
    );
  }

  // Generate the appropriate domain based on environment
  const generateDomain = (subDomain: string): string => {
    if (siteConfig.isDev) {
      return `${subDomain}.localhost:${siteConfig.frontendDevPort}`;
    } else {
      return `${subDomain}.${siteConfig.baseDomain}`;
    }
  };

  const fullDomain = generateDomain(user.subDomain);

  return (
    <div>
      <Link
        href={`${fullDomain}/admin`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-4 text-2xl font-semibold text-gray-600 hover:underline"
      >
        {fullDomain}
      </Link>
    </div>
  );
}

export default DomainsPage;
