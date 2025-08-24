"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavbarComponent } from "@/components/site-owners/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/footer/footer";
import { useNavbarQuery } from "@/hooks/owner-site/components/use-navbar";
import { useFooterQuery } from "@/hooks/owner-site/components/use-footer";

interface PreviewLayoutProps {
  children: React.ReactNode;
  siteUser: string;
  title?: string;
  showBackToPreview?: boolean;
}

export function PreviewLayout({
  children,
  siteUser,
  title = "Preview",
  showBackToPreview = false,
}: PreviewLayoutProps) {
  const router = useRouter();
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  const { data: navbarResponse, isLoading: isNavbarLoading } = useNavbarQuery();
  const { data: footerResponse, isLoading: isFooterLoading } = useFooterQuery();

  const handleBackToBuilder = () => {
    router.push(`/builder/${siteUser}`);
  };

  const handleBackToPreview = () => {
    router.push(`/preview/${siteUser}`);
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
      {/* Preview Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {showBackToPreview ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToPreview}
                  className="text-primary flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Preview
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToBuilder}
                  className="text-muted-foreground flex items-center gap-2"
                >
                  Back to Builder
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToBuilder}
                className="text-primary flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Builder
              </Button>
            )}
            <Badge variant="secondary" className="text-xs">
              {title}
            </Badge>
          </div>

          {/* Device Toggle */}
          <div className="bg-muted flex items-center gap-2 rounded-lg p-1">
            <Button
              variant={deviceView === "desktop" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDeviceView("desktop")}
              className="h-8 px-3"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceView === "tablet" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDeviceView("tablet")}
              className="h-8 px-3"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceView === "mobile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDeviceView("mobile")}
              className="h-8 px-3"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <main className="min-h-[calc(100vh-64px)] bg-gray-100 p-6">
        <div className={`transition-all duration-300 ${getViewportClass()}`}>
          <div className="min-h-[600px] overflow-hidden rounded-lg bg-white shadow-lg">
            {/* Render Navbar */}
            {navbarResponse?.data && (
              <NavbarComponent
                navbar={navbarResponse.data}
                isEditable={false}
              />
            )}

            {/* Main Content */}
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
