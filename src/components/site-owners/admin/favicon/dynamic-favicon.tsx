"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { usePathname } from "next/navigation";

const withCacheBust = (url: string) => {
  if (url.startsWith("data:")) {
    return url;
  }
  try {
    const parsedUrl = new URL(url, window.location.origin);
    parsedUrl.searchParams.set("v", Date.now().toString());
    return parsedUrl.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${Date.now()}`;
  }
};

const getFallbackFavicon = (businessName?: string | null): string => {
  const letter = (businessName || "N").trim().charAt(0).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="24" fill="#111827"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="80" font-weight="bold">${letter}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const DynamicFavicon = () => {
  const { data: siteConfig, isLoading, error } = useSiteConfig();
  const pathname = usePathname();

  useEffect(() => {
    // If data is loading or there's an error, do nothing.
    if (isLoading || error) {
      return;
    }

    let faviconUrl = siteConfig?.favicon;

    if (!faviconUrl && siteConfig?.business_name) {
      faviconUrl = getFallbackFavicon(siteConfig.business_name);
    }

    if (!faviconUrl) {
      return;
    }

    const finalFaviconUrl = withCacheBust(faviconUrl);

    // Helper to update or create a link tag
    const updateIcon = (selector: string, rel: string) => {
      let link = document.querySelector(selector) as HTMLLinkElement;
      if (link) {
        link.href = finalFaviconUrl;
        link.type = "image/x-icon";
      } else {
        link = document.createElement("link");
        link.rel = rel;
        link.href = finalFaviconUrl;
        link.type = "image/x-icon";
        document.head.appendChild(link);
      }
    };

    // Update standard favicon
    updateIcon("link[rel~='icon']", "icon");
    // Update shortcut icon
    updateIcon("link[rel='shortcut icon']", "shortcut icon");
    // Update apple touch icon
    updateIcon("link[rel='apple-touch-icon']", "apple-touch-icon");
  }, [siteConfig, isLoading, error, pathname]);

  return null;
};
