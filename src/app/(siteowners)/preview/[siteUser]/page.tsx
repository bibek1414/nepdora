"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Monitor, Smartphone, Tablet } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavbarComponent } from "@/components/site-owners/navbar/navbar-component";
import { useNavbarQuery } from "@/hooks/owner-site/components/navbar";
import { use } from "react";
interface PreviewPageProps {
  params: Promise<{ siteUser: string }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const router = useRouter();
  const { siteUser } = use(params);

  const { data: navbarResponse, isLoading } = useNavbarQuery();
  const [deviceView, setDeviceView] = React.useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

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

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

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
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Preview
              </Badge>
            </div>
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
      <div className="min-h-[calc(100vh-64px)] bg-gray-100 p-6">
        <div className={`transition-all duration-300 ${getViewportClass()}`}>
          <div className="min-h-[600px] overflow-hidden rounded-lg bg-white shadow-lg">
            {/* Render Navbar */}
            {navbarResponse?.data && (
              <NavbarComponent
                navbar={navbarResponse.data}
                isEditable={false}
              />
            )}

            {/* Preview Content Area */}
            <div className="p-8">
              {!navbarResponse?.data && (
                <div className="py-20 text-center">
                  <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full p-6">
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
              )}

              {navbarResponse?.data && (
                <div className="space-y-8">
                  {/* Hero Section Placeholder */}
                  <div className="bg-primary/5 rounded-lg py-16 text-center">
                    <h1 className="text-foreground mb-4 text-4xl font-bold">
                      Welcome to {navbarResponse.data.data.logoText}
                    </h1>
                    <p className="text-muted-foreground mb-8 text-xl">
                      This is a preview of your website. Add more components in
                      the builder.
                    </p>
                    <Button size="lg" className="bg-primary">
                      Get Started
                    </Button>
                  </div>

                  {/* Content Sections */}
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
              )}
            </div>
          </div>
        </div>
      </div>

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
