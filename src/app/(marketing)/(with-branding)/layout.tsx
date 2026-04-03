import Header from "@/components/marketing/layout/header";
import React from "react";

type WithBrandingLayoutProps = {
  children: React.ReactNode;
};

export default function WithBrandingLayout({ children }: WithBrandingLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
