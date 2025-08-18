import React from 'react';
import Header from '@/components/marketing/layout/header';
import Footer from '@/components/marketing/layout/footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
