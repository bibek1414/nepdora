import { PublishLayoutWrapper } from "@/components/site-owners/publish/publish-layout-wrapper";
import { WhatsApp } from "@/components/site-owners/builder/whatsapp/whatsapp";
import PopupManager from "@/components/site-owners/builder/popup/popup-manager";

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
      <PublishLayoutWrapper siteUser={siteUser}>
        {children}
      </PublishLayoutWrapper>
      <WhatsApp />
      <PopupManager />
    </>
  );
}
