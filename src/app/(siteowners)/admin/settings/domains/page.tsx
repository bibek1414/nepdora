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

  return <CloudflareDomainForm existingDomains={existingDomains} />;
}

export default DomainsPage;
