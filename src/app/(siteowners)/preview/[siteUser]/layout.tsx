import { PreviewLayoutWrapper } from "@/components/site-owners/preview/preview-layout-wrapper";
import { DynamicFontProvider } from "@/providers/dynamic-font-provider";
import { WhatsApp } from "@/components/site-owners/builder/whatsapp/whatsapp";
import PopupManager from "@/components/site-owners/builder/popup/popup-manager";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";
import { GoogleAnalytics } from "@/components/site-owners/admin/google-analytics/google-analytics";
import { generatePreviewPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

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

export default async function PreviewLayout({
  children,
  params,
}: PreviewLayoutProps) {
  const { siteUser } = await params;

  return (
    <>
      <DynamicFavicon />
      <GoogleAnalytics />
      <DynamicFontProvider>
        <PreviewLayoutWrapper siteUser={siteUser}>
          {children}
        </PreviewLayoutWrapper>
        <WhatsApp />
        <PopupManager />
      </DynamicFontProvider>
    </>
  );
}
