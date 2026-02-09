"use client";

import { useEffect, useRef } from "react";
import { useSiteConfig } from "@/hooks/owner-site/admin/use-site-config";
import { usePathname } from "next/navigation";
export const DynamicFavicon = () => {
  const { data: siteConfig, isLoading, error } = useSiteConfig();
  const pathname = usePathname();

  useEffect(() => {
    // If data is loading, there's an error, or no favicon is set, do nothing.
    if (isLoading || error || !siteConfig?.favicon) {
      return;
    }

    const faviconUrl = siteConfig.favicon;

    // Helper to update or create a link tag
    const updateIcon = (selector: string, rel: string) => {
      let link = document.querySelector(selector) as HTMLLinkElement;
      if (link) {
        link.href = faviconUrl;
      } else {
        link = document.createElement("link");
        link.rel = rel;
        link.href = faviconUrl;
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
