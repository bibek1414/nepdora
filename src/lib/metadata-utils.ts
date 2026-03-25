import type { Metadata } from "next";
import { headers } from "next/headers";
import { getServerUser } from "@/hooks/use-jwt-server";
import { capitalizeWords } from "@/lib/string-utils";
import { extractSubdomain, siteConfig } from "@/config/site";
import { getServerApiBaseUrl } from "@/config/server-site";

interface AdminPageMetadataOptions {
  pageName: string;
  pageDescription: string;
  pageRoute: string;
}

interface SiteConfigMetadata {
  favicon?: string | null;
}

const DEFAULT_ICONS: NonNullable<Metadata["icons"]> = {
  icon: "https://nepdora.com/favicon.ico",
  shortcut: "https://nepdora.com/favicon-16x16.png",
  apple: "https://nepdora.com/apple-touch-icon.png",
};

const buildIconsMetadata = (
  favicon: string | null | undefined
): NonNullable<Metadata["icons"]> => {
  if (!favicon) {
    return DEFAULT_ICONS;
  }

  return {
    icon: favicon,
    shortcut: favicon,
    apple: favicon,
  };
};

const getTenantDomainFromHeaders = async (): Promise<string | null> => {
  const headersList = await headers();
  return headersList.get("x-forwarded-host") || headersList.get("host");
};

const normalizeTenantDomain = (tenantDomain: string): string => {
  if (tenantDomain.includes(".") || tenantDomain.includes(":")) {
    return tenantDomain;
  }

  return `${tenantDomain}.${siteConfig.baseDomain}`;
};

const getSiteConfigForMetadata = async (
  tenantDomainOverride?: string | null
): Promise<SiteConfigMetadata | null> => {
  try {
    const tenantDomain =
      tenantDomainOverride || (await getTenantDomainFromHeaders());

    if (!tenantDomain) {
      return null;
    }

    const baseUrl = await getServerApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/site-config/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Domain": normalizeTenantDomain(tenantDomain),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data[0] ?? null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch site config metadata:", error);
    return null;
  }
};

export async function generateAdminPageMetadata({
  pageName,
  pageDescription,
  pageRoute,
}: AdminPageMetadataOptions): Promise<Metadata> {
  const user = await getServerUser();
  const siteMetadata = await getSiteConfigForMetadata(user?.sub_domain);

  const rawStoreName = user?.store_name || "Nepdora";
  const storeName = capitalizeWords(rawStoreName);
  const subDomain = user?.sub_domain || "";

  const title = `${storeName} | ${pageName} | Admin Dashboard`;
  const description = pageDescription.replace(/\{storeName\}/g, storeName);

  return {
    title,
    description,
    icons: buildIconsMetadata(siteMetadata?.favicon),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: storeName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(subDomain && {
      alternates: {
        canonical: `https://${subDomain}${pageRoute}`,
      },
    }),
  };
}

export async function generatePreviewPageMetadata({
  pageName,
  pageDescription,
  pageRoute,
}: AdminPageMetadataOptions): Promise<Metadata> {
  const user = await getServerUser();
  const siteMetadata = await getSiteConfigForMetadata(user?.sub_domain);

  const rawStoreName = user?.store_name || "Nepdora";
  const storeName = capitalizeWords(rawStoreName);
  const subDomain = user?.sub_domain || "";

  const title = `${storeName} | ${pageName} | Preview`;
  const description = pageDescription.replace(/\{storeName\}/g, storeName);

  return {
    title,
    description,
    icons: buildIconsMetadata(siteMetadata?.favicon),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: storeName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(subDomain && {
      alternates: {
        canonical: `https://${subDomain}${pageRoute}`,
      },
    }),
  };
}

export async function generatePublishPageMetadata({
  pageName,
  pageDescription,
  pageRoute,
}: AdminPageMetadataOptions): Promise<Metadata> {
  // Get the actual request headers to extract the host
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const siteMetadata = await getSiteConfigForMetadata();

  // Construct URL from the actual request host
  const protocol = siteConfig.isDev ? "http" : siteConfig.protocol;
  const url = new URL(`${protocol}://${host}`);

  // Extract subdomain from the actual request
  const subDomain = extractSubdomain(url);

  // Use subdomain as store name or fallback
  const storeName = capitalizeWords(subDomain || "Nepdora");

  const title = `${storeName} | ${pageName}`;
  const description = pageDescription.replace(/\{storeName\}/g, storeName);

  return {
    title,
    description,
    icons: buildIconsMetadata(siteMetadata?.favicon),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: storeName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(subDomain && {
      alternates: {
        canonical: `${protocol}://${subDomain}.${siteConfig.baseDomain}${pageRoute}`,
      },
    }),
  };
}
