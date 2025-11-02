"use client";

import Script from "next/script";
import { useGoogleAnalytics } from "@/hooks/owner-site/admin/use-google-analytics";

export function GoogleAnalytics() {
  const { data: analyticsConfigs, isLoading, error } = useGoogleAnalytics();

  // Don't render anything while loading or if there's an error
  if (isLoading || error || !analyticsConfigs) {
    return null;
  }

  // Find the first enabled Google Analytics config
  const enabledConfig = analyticsConfigs.find(
    config => config.is_enabled === true
  );

  // Don't render if no enabled config found
  if (!enabledConfig || !enabledConfig.measurement_id) {
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${enabledConfig.measurement_id}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${enabledConfig.measurement_id}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
