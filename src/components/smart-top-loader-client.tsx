"use client";

import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState, useMemo } from "react";
import { extractSubdomain } from "@/config/site";

interface SmartTopLoaderClientProps {
  previewColor: string;
  publishedColor: string;
}

export function SmartTopLoaderClient({
  previewColor,
  publishedColor,
}: SmartTopLoaderClientProps) {
  const pathname = usePathname();
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setSubdomain(extractSubdomain(new URL(window.location.href)));
      } catch (error) {
        console.error("Error setting subdomain in top loader:", error);
      }
    }
  }, [pathname]);

  const color = useMemo(() => {
    if (!subdomain) return "#4b74f5";

    const isPreview = Boolean(
      pathname?.startsWith("/preview") || pathname?.startsWith("/builder")
    );

    const isPublished = Boolean(
      pathname &&
      !pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/on-boarding") &&
      !pathname.startsWith("/superadmin") &&
      !isPreview
    );

    if (isPreview) return previewColor;
    if (isPublished) return publishedColor;
    
    return "#4b74f5";
  }, [subdomain, pathname, previewColor, publishedColor]);

  return <NextTopLoader color={color} height={3} showSpinner={false} />;
}
