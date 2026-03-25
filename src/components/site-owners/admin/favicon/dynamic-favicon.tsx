"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { usePathname } from "next/navigation";

const withCacheBust = (url: string) => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    parsedUrl.searchParams.set("v", Date.now().toString());
    return parsedUrl.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${Date.now()}`;
  }
};

export const DynamicFavicon = () => {
  const { data: siteConfig, isLoading, error } = useSiteConfig();
  const pathname = usePathname();

  useEffect(() => {
    // If data is loading, there's an error, or no favicon is set, do nothing.
    if (isLoading || error || !siteConfig?.favicon) {
      return;
    }

    const faviconUrl = withCacheBust(siteConfig.favicon);

    // Helper to update or create a link tag
    const updateIcon = (selector: string, rel: string) => {
      let link = document.querySelector(selector) as HTMLLinkElement;
      if (link) {
        link.href = faviconUrl;
        link.type = "image/x-icon";
      } else {
        link = document.createElement("link");
        link.rel = rel;
        link.href = faviconUrl;
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
