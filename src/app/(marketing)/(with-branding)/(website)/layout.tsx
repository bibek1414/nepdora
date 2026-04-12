import WebsiteFooter from "@/components/marketing/layout/website-footer";
import { Footer } from "@/components/marketing/layout/footer";

type WebsiteLayoutProps = {
  children: React.ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <>
      {children}
      <WebsiteFooter />
      <Footer  />
    </>
  );
}
