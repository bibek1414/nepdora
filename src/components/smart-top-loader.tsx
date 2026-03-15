"use client";

import { extractSubdomain } from "@/config/site";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import {
  useThemeQuery,
  useThemeQueryPublished,
} from "@/hooks/owner-site/components/use-theme";
import { useEffect, useState } from "react";

export function SmartTopLoader() {
  const pathname = usePathname();
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSubdomain(extractSubdomain(new URL(window.location.href)));
    }
  }, [pathname]);

  const hasSubdomain = Boolean(subdomain);

  const isPreview = Boolean(
    hasSubdomain &&
      (pathname?.startsWith("/preview") || pathname?.startsWith("/builder"))
  );

  // Dashboard routes usually start with /dashboard, /admin, /on-boarding, /superadmin
  const isPublished = Boolean(
    hasSubdomain &&
      pathname &&
      !pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/on-boarding") &&
      !pathname.startsWith("/superadmin") &&
      !isPreview
  );

  const { data: previewTheme } = useThemeQuery(isPreview);
  const { data: publishedTheme } = useThemeQueryPublished(isPublished);

  let color = "#4b74f5"; // your default theme color

  if (isPreview && previewTheme?.data?.[0]?.data?.theme?.colors?.primary) {
    color = previewTheme.data[0].data.theme.colors.primary;
  } else if (
    isPublished &&
    publishedTheme?.data?.[0]?.data?.theme?.colors?.primary
  ) {
    color = publishedTheme.data[0].data.theme.colors.primary;
  }

  return <NextTopLoader color={color} height={3} />;
}

export default SmartTopLoader;
