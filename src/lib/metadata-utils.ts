import type { Metadata } from "next";
import { getServerUser } from "@/hooks/use-jwt-server";
import { capitalizeWords } from "@/lib/string-utils";

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
  const user = await getServerUser();

  const rawStoreName = user?.storeName || "Nepdora";
  const storeName = capitalizeWords(rawStoreName);
  const subDomain = user?.subDomain || "";

  const title = `${storeName} | ${pageName} `;
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
