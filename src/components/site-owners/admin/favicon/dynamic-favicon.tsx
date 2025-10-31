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

    // Find the existing favicon link tag in the document's head.
    let link: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']");

    // If the link tag doesn't exist, create it and append it to the head.
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = siteConfig.favicon;
  }, [siteConfig, isLoading, error, pathname]);

  return null;
};
