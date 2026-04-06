import { SiteLayoutWrapper } from "@/components/site-owners/shared/site-layout-wrapper";
import { DynamicFontProvider } from "@/providers/dynamic-font-provider";
import { WhatsApp } from "@/components/site-owners/builder/whatsapp/whatsapp";
import PopupManager from "@/components/site-owners/builder/popup/popup-manager";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";
import { GoogleAnalytics } from "@/components/site-owners/admin/google-analytics/google-analytics";
import { generatePreviewPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

import { WebsiteSocketProvider } from "@/providers/website-socket-provider";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { SubscriptionBlocker } from "@/components/site-owners/admin/subscription/subscription-blocker";

interface PreviewLayoutProps {
  children: React.ReactNode;
  params: Promise<{ siteUser: string }>;
}

export async function generateMetadata({
  params,
}: PreviewLayoutProps): Promise<Metadata> {
  const { siteUser } = await params;

  return generatePreviewPageMetadata({
    pageName: "Website Preview",
    pageDescription:
      "Preview the website for {storeName}. Explore pages, layouts, and content dynamically.",
    pageRoute: `/builder/${siteUser}/home`,
  });
}

import { SubscriptionGate } from "@/components/site-owners/admin/subscription/subscription-gate";

export default async function PreviewLayout({
  children,
  params,
}: PreviewLayoutProps) {
  const { siteUser } = await params;

  return (
    <>
      <DynamicFavicon />
      <GoogleAnalytics />
      <SubscriptionProvider>
        <WebsiteSocketProvider schema_name={siteUser} enabled={true}>
          <DynamicFontProvider>
            <SubscriptionGate>
              <SiteLayoutWrapper siteUser={siteUser}>
                {children}
              </SiteLayoutWrapper>
              <WhatsApp />
              <PopupManager />
            </SubscriptionGate>
          </DynamicFontProvider>
        </WebsiteSocketProvider>
        <SubscriptionBlocker />
      </SubscriptionProvider>
    </>
  );
}

