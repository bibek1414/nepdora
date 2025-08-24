"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavbarComponent } from "@/components/site-owners/navbar/navbar-component";
import { useNavbarQuery } from "@/hooks/owner-site/components/navbar";
import { useFooterQuery } from "@/hooks/owner-site/components/footer";
import { Footer as FooterComponent } from "@/components/site-owners/footer/footer";
import { HeroComponent } from "@/components/site-owners/hero/hero-component";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/hero";
import { usePages } from "@/hooks/owner-site/page";
import { HeroComponentData } from "@/types/owner-site/components/hero";

import { use } from "react";
interface PreviewPageProps {
  params: Promise<{ siteUser: string }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const router = useRouter();
  const { siteUser } = use(params);

  const { data: navbarResponse, isLoading: isNavbarLoading } = useNavbarQuery();
  const { data: footerResponse, isLoading: isFooterLoading } = useFooterQuery();
  const { data: pagesData = [], isLoading: isPagesLoading } = usePages();

  // Get the home page slug for hero components
  const homePage =
    pagesData.find(page => page.title.toLowerCase() === "home") || pagesData[0];
  const homePageSlug = homePage?.slug || "";

  // Fetch hero components for the home page
  const { data: heroComponentsResponse, isLoading: isHeroLoading } =
    usePageComponentsQuery(homePageSlug);
  const heroComponents = heroComponentsResponse?.data || [];

  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  const handleBackToBuilder = () => {
    router.push(`/builder/${siteUser}`);
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

  const isLoading =
    isNavbarLoading || isFooterLoading || isPagesLoading || isHeroLoading;

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground text-sm">Loading preview...</p>
        </div>
      </div>
    );
  }

  const hasContent =
    navbarResponse?.data || footerResponse?.data || heroComponents.length > 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Preview Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToBuilder}
              className="text-primary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Builder
            </Button>
            <Badge variant="secondary" className="text-xs">
              Preview
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

            {/* Render Hero Components */}
            {heroComponents.length > 0 && (
              <div className="space-y-0">
                {heroComponents
                  .sort(
                    (a: HeroComponentData, b: HeroComponentData) =>
                      a.order - b.order
                  )
                  .map((heroComponent: HeroComponentData) => (
                    <HeroComponent
                      key={heroComponent.id}
                      component={heroComponent}
                      isEditable={false}
                      pageSlug={homePageSlug}
                    />
                  ))}
              </div>
            )}

            {/* Preview Content Area */}
            <div className="p-8">
              {!hasContent ? (
                <div className="py-20 text-center">
                  <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Monitor className="text-muted-foreground h-8 w-8" />
                  </div>
                  <h3 className="text-foreground mb-2 text-xl font-semibold">
                    No Content Yet
                  </h3>
                  <p className="text-muted-foreground mx-auto max-w-md">
                    Go back to the builder and start adding components to see
                    your site preview here.
                  </p>
                  <Button onClick={handleBackToBuilder} className="mt-4">
                    Open Builder
                  </Button>
                </div>
              ) : heroComponents.length === 0 ? (
                <div className="space-y-8">
                  <div className="bg-primary/5 rounded-lg py-16 text-center">
                    <h1 className="text-foreground mb-4 text-4xl font-bold">
                      Welcome to{" "}
                      {navbarResponse?.data?.data.logoText || "Your Site"}
                    </h1>
                    <p className="text-muted-foreground mb-8 text-xl">
                      This is a preview of your website. Add hero sections and
                      more components in the builder.
                    </p>
                    <Button size="lg" className="bg-primary">
                      Get Started
                    </Button>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-lg border p-6">
                      <h2 className="mb-4 text-2xl font-semibold">About Us</h2>
                      <p className="text-muted-foreground">
                        Add an about section to tell your visitors about your
                        business, mission, and what makes you unique.
                      </p>
                    </div>
                    <div className="rounded-lg border p-6">
                      <h2 className="mb-4 text-2xl font-semibold">
                        Our Services
                      </h2>
                      <p className="text-muted-foreground">
                        Showcase your products or services here to help visitors
                        understand what you offer.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Additional content sections when hero components exist
                <div className="space-y-12">
                  <div className="grid gap-8 md:grid-cols-3">
                    <div className="rounded-lg border p-6 text-center">
                      <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <Monitor className="text-primary h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        Feature One
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Add more components to showcase your features and
                        services.
                      </p>
                    </div>
                    <div className="rounded-lg border p-6 text-center">
                      <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <Smartphone className="text-primary h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        Feature Two
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Build responsive designs that work on all devices.
                      </p>
                    </div>
                    <div className="rounded-lg border p-6 text-center">
                      <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <Tablet className="text-primary h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold">
                        Feature Three
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Create professional layouts with our intuitive builder.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <h2 className="mb-4 text-3xl font-bold">
                      Ready to Get Started?
                    </h2>
                    <p className="text-muted-foreground mb-6 text-lg">
                      Continue building your site by adding more components and
                      pages.
                    </p>
                    <Button onClick={handleBackToBuilder} size="lg">
                      Continue Building
                    </Button>
                  </div>
                </div>
              )}
            </div>

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
