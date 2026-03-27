import type { Metadata } from "next";
import { headers } from "next/headers";
import { getServerUser } from "@/hooks/use-jwt-server";
import { capitalizeWords } from "@/lib/string-utils";
import { extractSubdomain, siteConfig } from "@/config/site";
import { getServerApiBaseUrl } from "@/config/server-site";
import type { ComponentResponse } from "@/types/owner-site/components/components";
import { EntityMetadata } from "./publish-page-cache";

interface AdminPageMetadataOptions {
  pageName: string;
  pageDescription: string;
  pageRoute: string;
  pageImage?: string | null;
}

interface SiteConfigMetadata {
  favicon?: string | null;
}

interface PublishContentMetadata {
  title?: string | null;
  description?: string | null;
  image?: string | null;
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

const stripHtml = (value: string): string =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const normalizeText = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = stripHtml(value);
  return cleaned.length > 0 ? cleaned : null;
};

const truncateText = (value: string, maxLength = 160): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
};

const extractTitleFromComponent = (component: ComponentResponse): string | null => {
  const data = component.data as unknown as Record<string, unknown>;

  switch (component.component_type) {
    case "hero":
      return (
        normalizeText(data.title) ||
        normalizeText(data.subtitle) ||
        normalizeText(data.description)
      );
    case "about":
      return (
        normalizeText(data.title) ||
        normalizeText(data.heroTitle) ||
        normalizeText(data.storyTitle) ||
        normalizeText(data.smallTitle)
      );
    case "banner":
    case "text_editor":
    case "contact":
    case "appointment":
    case "newsletter":
    case "cta":
    case "gallery":
    case "services":
    case "products":
    case "blog":
    case "portfolio":
    case "faq":
    case "pricing":
    case "our_clients":
    case "others":
    case "socials":
      return normalizeText(data.title) || normalizeText(data.subtitle);
    default:
      return null;
  }
};

const extractDescriptionFromComponent = (
  component: ComponentResponse
): string | null => {
  const data = component.data as unknown as Record<string, unknown>;

  switch (component.component_type) {
    case "hero":
    case "banner":
    case "contact":
    case "appointment":
    case "newsletter":
    case "cta":
    case "gallery":
    case "services":
    case "products":
    case "blog":
    case "portfolio":
    case "faq":
    case "pricing":
    case "our_clients":
    case "others":
    case "socials":
      return (
        normalizeText(data.description) ||
        normalizeText(data.subtitle) ||
        normalizeText(data.title)
      );
    case "about":
      return (
        normalizeText(data.description) ||
        normalizeText(data.journeyDescription) ||
        normalizeText(data.subSubtitle) ||
        normalizeText(data.badgeDescription)
      );
    case "text_editor":
      return (
        normalizeText(data.content) ||
        normalizeText(data.title)
      );
    default:
      return null;
  }
};

const extractImageFromComponent = (component: ComponentResponse): string | null => {
  const data = component.data as unknown as Record<string, unknown>;

  switch (component.component_type) {
    case "hero":
      return (
        normalizeText(data.imageUrl) ||
        normalizeText(data.backgroundImageUrl) ||
        normalizeText(
          Array.isArray(data.sliderImages)
            ? (data.sliderImages[0] as Record<string, unknown> | undefined)?.url
            : null
        )
      );
    case "banner":
      return normalizeText(
        Array.isArray(data.images)
          ? (data.images[0] as Record<string, unknown> | undefined)?.image
          : null
      );
    case "about":
      return (
        normalizeText(data.heroImageUrl) ||
        normalizeText(data.imageUrl) ||
        normalizeText(data.journeyImageUrl) ||
        normalizeText(data.mainImage)
      );
    default:
      return null;
  }
};

export function derivePublishContentMetadata(
  pageName: string,
  pageComponents: ComponentResponse[],
  entityMetadata?: EntityMetadata
): PublishContentMetadata {
  const orderedComponents = [...pageComponents].sort(
    (left, right) => left.order - right.order
  );

  const componentTitle = orderedComponents
    .map(extractTitleFromComponent)
    .find(Boolean);
  const title =
    normalizeText(entityMetadata?.title) ||
    componentTitle ||
    normalizeText(pageName);

  const componentDescription = orderedComponents
    .map(extractDescriptionFromComponent)
    .find(Boolean);
  const description =
    normalizeText(entityMetadata?.description) || componentDescription;

  const componentImage = orderedComponents
    .map(extractImageFromComponent)
    .find(Boolean);
  const image = normalizeText(entityMetadata?.image) || componentImage;

  return {
    title,
    description: description ? truncateText(description) : null,
    image,
  };
}

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
  pageImage,
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
      ...(pageImage ? { images: [{ url: pageImage, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(pageImage ? { images: [pageImage] } : {}),
    },
    ...(subDomain && {
      alternates: {
        canonical: `${protocol}://${subDomain}.${siteConfig.baseDomain}${pageRoute}`,
      },
    }),
  };
}
