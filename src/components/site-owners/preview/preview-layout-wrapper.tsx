"use client";

import { NavbarComponent } from "@/components/site-owners/builder/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/builder/footer/footer-component";
import { useNavbarQuery } from "@/hooks/owner-site/components/use-navbar";
import { useFooterQuery } from "@/hooks/owner-site/components/use-footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PreviewLayoutWrapperProps {
  children: React.ReactNode;
  siteUser: string;
}

export function PreviewLayoutWrapper({
  children,
  siteUser,
}: PreviewLayoutWrapperProps) {
  const { data: navbarResponse, isLoading: isNavbarLoading } = useNavbarQuery();
  const { data: footerResponse, isLoading: isFooterLoading } = useFooterQuery();
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const isLoading = isNavbarLoading || isFooterLoading;

  if (isLoading) {
    return (
      <div
        className="bg-background flex min-h-screen items-center justify-center"
        style={{
          color: theme.colors.primary,
          fontFamily: theme.fonts.heading,
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-32 w-32 animate-spin rounded-full border-b-2"
            style={{
              borderColor: theme.colors.primary,
            }}
          ></div>

          <p className="text-muted-foreground text-sm">Loading... </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Sticky Navbar - positioned outside the preview content */}
      {navbarResponse?.data && (
        <div className={`sticky top-0 z-40`}>
          <div className="border-b bg-white">
            <NavbarComponent
              navbar={navbarResponse.data}
              isEditable={false}
              siteUser={siteUser}
            />
          </div>
        </div>
      )}

      {/* Preview Content */}
      <main className="min-h-[calc(100vh-64px)]">
        <div className={`transition-all duration-300`}>
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
                siteUser={siteUser}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
