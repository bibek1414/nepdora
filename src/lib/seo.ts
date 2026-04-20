import { Metadata } from "next";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  `https://${process.env.NEXT_PUBLIC_BASE_DOMAIN || "www.nepdora.com"}`;

export const SITE_URL = rawSiteUrl.replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = `${SITE_URL}/nepdora.jpg`;
export const SITE_NAME = "Nepdora";

export function absoluteUrl(path = "") {
  const normalizedPath =
    path.startsWith("/") || path === "" ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
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

  // Smart OG extraction
  const displayTitle = ogTitle || title.split(/ [|:-] /)[0].trim();

  // Subtitle usually works best as a concise version of description
  const displaySubtitle =
    ogSubtitle ||
    (finalDescription.length > 120
      ? finalDescription.slice(0, 117) + "..."
      : finalDescription);

  const finalImage = image || DEFAULT_OG_IMAGE;
  // ||
  // getDynamicOgUrl({
  //   title: displayTitle,
  //   subtitle: displaySubtitle,
  //   label: ogLabel,
  // });

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
      title: displayTitle,
      description: displaySubtitle,
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
      title: displayTitle,
      description: displaySubtitle,
      images: [finalImage],
    },
  };
}
