import { PreviewLayoutWrapper } from "@/components/site-owners/preview/preview-layout-wrapper";
import { WhatsApp } from "@/components/site-owners/whatsapp/whatsapp";

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
      <PreviewLayoutWrapper siteUser={siteUser}>
        {children}
      </PreviewLayoutWrapper>
      <WhatsApp />
    </>
  );
}
