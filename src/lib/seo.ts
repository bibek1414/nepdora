import { Metadata } from "next";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  `https://${process.env.NEXT_PUBLIC_BASE_DOMAIN || "www.nepdora.com"}`;

export const SITE_URL = rawSiteUrl.replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = `${SITE_URL}/nepdora-logooo.svg`;
export const SITE_NAME = "Nepdora";

export function absoluteUrl(path = "") {
  const normalizedPath =
    path.startsWith("/") || path === "" ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function getDynamicOgUrl({
  title,
  subtitle,
  label,
}: {
  title: string;
  subtitle?: string;
  label?: string;
}) {
  const params = new URLSearchParams();
  params.set("title", title);
  if (subtitle) params.set("subtitle", subtitle);
  if (label) params.set("label", label);
  return `${SITE_URL}/api/og?${params.toString()}`;
}

export function buildMarketingMetadata({
  title,
  description,
  path,
  image,
  ogTitle,
  ogSubtitle,
  ogLabel,
  keywords = [],
  noIndex = false,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  ogTitle?: string;
  ogSubtitle?: string;
  ogLabel?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const finalDescription =
    description ||
    "Launch your business online quickly with our free website builder, free hosting, and a comprehensive suite of essential business tools. Start now!";

  const finalImage =
    image ||
    getDynamicOgUrl({
      title: ogTitle || title.split(/ [|:-] /)[0].trim(),
      subtitle:
        ogSubtitle ||
        (finalDescription.length > 150
          ? finalDescription.slice(0, 147) + "..."
          : finalDescription),
      label: ogLabel,
    });

  return {
    title,
    description: finalDescription,
    keywords: [
      ...keywords,
      "website builder Nepal",
      "create website Nepal",
      "Nepdora",
      "AI website builder Nepal",
      "free website builder Nepal",
    ],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      title,
      description: finalDescription,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_NP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: finalDescription,
      images: [finalImage],
    },
  };
}
