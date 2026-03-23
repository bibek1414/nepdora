import Script from "next/script";

interface GoogleAnalyticsStaticProps {
  measurementId?: string;
}

export function GoogleAnalyticsStatic({
  measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
}: GoogleAnalyticsStaticProps) {
  if (!measurementId) return null;

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-static"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
