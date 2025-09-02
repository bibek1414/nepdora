"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { NavbarComponent } from "@/components/site-owners/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/footer/footer";
import { useNavbarQuery } from "@/hooks/owner-site/components/use-navbar";
import { useFooterQuery } from "@/hooks/owner-site/components/use-footer";

interface PreviewLayoutWrapperProps {
  children: React.ReactNode;
  siteUser: string;
}

export function PreviewLayoutWrapper({
  children,
  siteUser,
}: PreviewLayoutWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  const { data: navbarResponse, isLoading: isNavbarLoading } = useNavbarQuery();
  const { data: footerResponse, isLoading: isFooterLoading } = useFooterQuery();

  // Determine if we're on a product detail page
  const isProductDetail = pathname.includes("/products/");
  const isPreviewHome = pathname === `/preview/${siteUser}`;

  const handleBackToBuilder = () => {
    router.push(`/builder/${siteUser}`);
  };

  const handleBackToPreview = () => {
    router.push(`/preview/${siteUser}`);
  };

  const getTitle = () => {
    if (isProductDetail) return "Product Preview";
    return "Preview";
  };

  const getViewportClass = () => {
    switch (deviceView) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      default:
        return "w-full";
    }
  };

  const isLoading = isNavbarLoading || isFooterLoading;

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Sticky Navbar - positioned outside the preview content */}
      {navbarResponse?.data && (
        <div className={`sticky top-0 z-40 ${getViewportClass()}`}>
          <div className="overflow-hidden bg-white">
            <NavbarComponent
              navbar={navbarResponse.data}
              isEditable={false}
              siteId={siteUser}
              siteUser={siteUser}
            />
          </div>
        </div>
      )}

      {/* Preview Content */}
      <main className="min-h-[calc(100vh-64px)] bg-gray-100 p-6">
        <div className={`transition-all duration-300 ${getViewportClass()}`}>
          <div className="min-h-[600px] overflow-hidden rounded-lg bg-white">
            {/* Main Content - Children no longer includes navbar */}
            {children}

            {/* Render Footer */}
            {footerResponse?.data && (
              <FooterComponent
                componentId={footerResponse.data.id}
                footerData={footerResponse.data.data}
                style={footerResponse.data.data.style}
                isEditable={false}
              />
            )}
          </div>
        </div>
      </main>

      {/* Device Info */}
      <div className="fixed right-4 bottom-4">
        <Badge variant="outline" className="bg-white">
          {deviceView === "desktop" && "Desktop View"}
          {deviceView === "tablet" && "Tablet View"}
          {deviceView === "mobile" && "Mobile View"}
        </Badge>
      </div>
    </div>
  );
}
