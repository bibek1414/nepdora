import WebsiteFooter from "@/components/marketing/layout/website-footer";

type WebsiteLayoutProps = {
  children: React.ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <>
      {children}
      <WebsiteFooter />
    </>
  );
}
