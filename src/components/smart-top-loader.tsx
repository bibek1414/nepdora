"use client";

import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import {
  useThemeQuery,
  useThemeQueryPublished,
} from "@/hooks/owner-site/components/use-theme";

export function SmartTopLoader() {
  const pathname = usePathname();

  const isPreview = Boolean(
    pathname?.startsWith("/preview") || pathname?.startsWith("/builder")
  );

  // Dashboard routes usually start with /dashboard, /admin, /on-boarding
  const isPublished = Boolean(
    pathname &&
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/on-boarding") &&
    !isPreview
  );

  const { data: previewTheme } = useThemeQuery(isPreview);
  const { data: publishedTheme } = useThemeQueryPublished(isPublished);

  let color = "#4b74f5"; // your default theme color

  if (isPreview) {
    const pColor = previewTheme?.data?.[0]?.data?.theme?.colors?.primary;
    if (pColor) color = pColor;
  } else if (isPublished) {
    const pColor = publishedTheme?.data?.[0]?.data?.theme?.colors?.primary;
    if (pColor) color = pColor;
  }

  return <NextTopLoader color={color} height={3} />;
}

export default SmartTopLoader;
