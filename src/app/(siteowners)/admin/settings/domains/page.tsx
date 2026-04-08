import React from "react";
import Link from "next/link";
import { getServerUser } from "@/hooks/use-jwt-server";
import { siteConfig } from "@/config/site";
import CloudflareDomainForm from "./cloudflare-domain-form";
import {
  getCustomDomains,
  CustomDomain,
} from "@/lib/actions/custom-domain-actions";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Domain Settings",
    pageDescription:
      "Manage your domain settings efficiently. Update your domain settings directly from the admin dashboard.",
    pageRoute: "/admin/settings/domains",
  });
}

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

  const fullDomain = generateDomain(user.sub_domain || "");

  const domainsResult = await getCustomDomains();
  let existingDomains: CustomDomain[] = [];
  if (domainsResult.success && domainsResult.domains) {
    // Filter out system and primary domains from the custom domain list
    existingDomains = domainsResult.domains.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (d: any) =>
        !d.domain.endsWith(".nepdora.com") && !d.domain.endsWith(".localhost")
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="mb-2 text-lg font-medium text-gray-900">
          Your Nepdora Subdomain
        </h2>
        <Link
          href={`${siteConfig.isDev ? "http://" : "https://"}${fullDomain}/admin`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl font-semibold text-gray-600 hover:underline"
        >
          {fullDomain}
        </Link>
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold text-gray-900">Custom Domain</h2>
        <p className="mt-2 text-gray-600">
          Want to use your own domain? You can map it here.
        </p>
        <CloudflareDomainForm existingDomains={existingDomains} />
      </div>
    </div>
  );
}

export default DomainsPage;
