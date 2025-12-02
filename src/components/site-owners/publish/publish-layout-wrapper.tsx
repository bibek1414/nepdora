"use client";

import { NavbarComponent } from "@/components/site-owners/publish/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/publish/footer/footer-component";
import { InnerPageHeader } from "@/components/site-owners/builder/navbar/inner-page-header";
import { useNavbarQueryPublished } from "@/hooks/owner-site/components/use-navbar";
import { useFooterQueryPublished } from "@/hooks/owner-site/components/use-footer";
import { useThemeQueryPublished } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PublishLayoutWrapperProps {
  children: React.ReactNode;
  siteUser: string;
}

export function PublishLayoutWrapper({
  children,
  siteUser,
}: PublishLayoutWrapperProps) {
  const { data: navbarResponse, isLoading: isNavbarLoading } =
    useNavbarQueryPublished();
  const { data: footerResponse, isLoading: isFooterLoading } =
    useFooterQueryPublished();
  const { data: themeResponse } = useThemeQueryPublished();
  const pathname = usePathname();

  const [pageInfo, setPageInfo] = useState<{ isHome: boolean; title: string }>({
    isHome: true,
    title: "",
  });

  const isStyle11 = navbarResponse?.data?.data?.style === "style-11";
  const isLoading = isNavbarLoading || isFooterLoading;

  // Theme fallback
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

  useEffect(() => {
    if (!pathname || !isStyle11) return;

    let isHome = false;
    let title = "";

    // Check for Home
    if (
      pathname === "/" ||
      pathname === `/publish/${siteUser}` ||
      pathname === `/publish/${siteUser}/`
    ) {
      isHome = true;
    } else {
      // Extract title from path
      let cleanPath = pathname;
      if (pathname.startsWith(`/publish/${siteUser}/`)) {
        cleanPath = pathname.replace(`/publish/${siteUser}/`, "");
      } else if (pathname.startsWith("/")) {
        cleanPath = pathname.substring(1);
      }

      const segment = cleanPath.split("/")[0];
      title = segment.replace(/-/g, " ");
    }

    setPageInfo({ isHome, title });
  }, [pathname, siteUser, isStyle11]);

  return (
    <div className="bg-background min-h-screen">
      {/* Sticky Navbar */}
      {navbarResponse?.data && (
        <div className="sticky top-0 z-40">
          <div className="border-b bg-white">
            <NavbarComponent
              navbar={navbarResponse.data}
              isEditable={false}
              siteUser={siteUser}
            />
          </div>
        </div>
      )}

      {/* Conditionally Render Inner Page Header for Style-11 */}
      {isStyle11 && !pageInfo.isHome && (
        <InnerPageHeader
          title={pageInfo.title || "Page"}
          currentPage={pageInfo.title || "Page"}
        />
      )}

      {/* Publish Content */}
      <main className="min-h-[calc(100vh-64px)]">
        <div className="transition-all duration-300">
          <div className="min-h-[600px] overflow-hidden bg-white">
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
