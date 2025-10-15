import { PreviewLayoutWrapper } from "@/components/site-owners/preview/preview-layout-wrapper";
import { WhatsApp } from "@/components/site-owners/builder/whatsapp/whatsapp";
import PopupManager from "@/components/site-owners/builder/popup/popup-manager";
import { DynamicFontProvider } from "@/providers/dynamic-font-provider";

interface PreviewLayoutProps {
  children: React.ReactNode;
  params: Promise<{ siteUser: string }>;
}

export default async function PreviewLayout({
  children,
  params,
}: PreviewLayoutProps) {
  const { siteUser } = await params;

  return (
    <>
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
