import { SiteLayoutWrapper } from "@/components/site-owners/shared/site-layout-wrapper";
import { WhatsApp } from "@/components/site-owners/builder/whatsapp/whatsapp";
import PopupManager from "@/components/site-owners/builder/popup/popup-manager";
import { DynamicFontProvider } from "@/providers/dynamic-font-provider";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";
import { GoogleAnalytics } from "@/components/site-owners/admin/google-analytics/google-analytics";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import { getPublishedLayoutPayload } from "@/lib/publish-page-cache";
import type { Metadata } from "next";
import { WebsiteSocketProvider } from "@/providers/website-socket-provider";

interface PublishLayoutProps {
  children: React.ReactNode;
  params: Promise<{ siteUser: string }>;
}
export async function generateMetadata({
  params,
}: PublishLayoutProps): Promise<Metadata> {
  const { siteUser } = await params;

  return generatePublishPageMetadata({
    pageName: "Home",
    pageDescription:
      "Preview the website for {storeName}. Explore pages, layouts, and content dynamically.",
    pageRoute: `/builder/${siteUser}/home`,
  });
}

export default async function PublishLayout({
  children,
  params,
}: PublishLayoutProps) {
  const { siteUser } = await params;
  const { navbarResponse, footerResponse, themeResponse } =
    await getPublishedLayoutPayload(siteUser);

  return (
    <>
      <DynamicFavicon />
      <GoogleAnalytics />
      <WebsiteSocketProvider schema_name={siteUser} enabled={false}>
        <DynamicFontProvider>
          <SiteLayoutWrapper
            siteUser={siteUser}
            initialNavbarResponse={navbarResponse}
            initialFooterResponse={footerResponse}
            initialThemeResponse={themeResponse}
          >
            {children}
          </SiteLayoutWrapper>
          <WhatsApp />
          <PopupManager />
        </DynamicFontProvider>
      </WebsiteSocketProvider>
    </>
  );
}
