import { PublishLayoutWrapper } from "@/components/site-owners/publish/publish-layout-wrapper";
import { WhatsApp } from "@/components/site-owners/builder/whatsapp/whatsapp";
import PopupManager from "@/components/site-owners/builder/popup/popup-manager";
import { DynamicFontProvider } from "@/providers/dynamic-font-provider";
import { DynamicFavicon } from "@/components/site-owners/admin/favicon/dynamic-favicon";
import { GoogleAnalytics } from "@/components/site-owners/admin/google-analytics/google-analytics";

interface PublishLayoutProps {
  children: React.ReactNode;
  params: Promise<{ siteUser: string }>;
}

export default async function PublishLayout({
  children,
  params,
}: PublishLayoutProps) {
  const { siteUser } = await params;

  return (
    <>
      <DynamicFavicon />
      <GoogleAnalytics />
      <DynamicFontProvider>
        <PublishLayoutWrapper siteUser={siteUser}>
          {children}
        </PublishLayoutWrapper>
        <WhatsApp />
        <PopupManager />
      </DynamicFontProvider>
    </>
  );
}
