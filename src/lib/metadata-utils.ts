import type { Metadata } from "next";
import { headers } from "next/headers";
import { getServerUser } from "@/hooks/use-jwt-server";
import { capitalizeWords } from "@/lib/string-utils";
import { extractSubdomain, siteConfig } from "@/config/site";

interface AdminPageMetadataOptions {
  pageName: string;
  pageDescription: string;
  pageRoute: string;
}

export async function generateAdminPageMetadata({
  pageName,
  pageDescription,
  pageRoute,
}: AdminPageMetadataOptions): Promise<Metadata> {
  const user = await getServerUser();

  const rawStoreName = user?.storeName || "Nepdora";
  const storeName = capitalizeWords(rawStoreName);
  const subDomain = user?.subDomain || "";

  const title = `${storeName} | ${pageName} | Admin Dashboard`;
  const description = pageDescription.replace(/\{storeName\}/g, storeName);

  return {
    title,
    description,
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

  const rawStoreName = user?.storeName || "Nepdora";
  const storeName = capitalizeWords(rawStoreName);
  const subDomain = user?.subDomain || "";

  const title = `${storeName} | ${pageName} | Preview`;
  const description = pageDescription.replace(/\{storeName\}/g, storeName);

  return {
    title,
    description,
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
