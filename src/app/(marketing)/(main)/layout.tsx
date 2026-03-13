import React from "react";
import Footer from "@/components/marketing/layout/footer";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
