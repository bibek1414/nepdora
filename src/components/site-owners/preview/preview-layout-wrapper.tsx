"use client";

import { NavbarComponent } from "@/components/site-owners/builder/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/builder/footer/footer-component";
import { useNavbarQuery } from "@/hooks/owner-site/components/use-navbar";
import { useFooterQuery } from "@/hooks/owner-site/components/use-footer";
import { usePathname } from "next/navigation";
import { InnerPageHeader } from "@/components/site-owners/builder/navbar/inner-page-header";
import { useEffect, useState } from "react";

interface PreviewLayoutWrapperProps {
  children: React.ReactNode;
  siteUser: string;
}

export function PreviewLayoutWrapper({
  children,
  siteUser,
}: PreviewLayoutWrapperProps) {
  const { data: navbarResponse } = useNavbarQuery();
  const { data: footerResponse } = useFooterQuery();
  const pathname = usePathname();
  const [pageInfo, setPageInfo] = useState<{ isHome: boolean; title: string }>({
    isHome: true,
    title: "",
  });

  // Check if current navbar is style-11
  const isStyle11 = navbarResponse?.data?.data?.style === "style-11";

  useEffect(() => {
    if (!pathname || !isStyle11) return;

    let isHome = false;
    let title = "";

    // Check for Home
    if (
      pathname === "/" ||
      pathname === `/preview/${siteUser}` ||
      pathname === `/preview/${siteUser}/`
    ) {
      isHome = true;
    } else {
      isHome = false;
      // Extract title from path
      let cleanPath = pathname;
      if (pathname.startsWith(`/preview/${siteUser}/`)) {
        cleanPath = pathname.replace(`/preview/${siteUser}/`, "");
      } else if (pathname.startsWith("/")) {
        cleanPath = pathname.substring(1);
      }

      // Take the first segment as the title
      const segment = cleanPath.split("/")[0];
      title = segment.replace(/-/g, " ");
    }

    setPageInfo({ isHome, title });
  }, [pathname, siteUser, isStyle11]);

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

      {/* Conditionally Render Inner Page Header (Breadcrumb) for Style-11 - Non-sticky */}
      {isStyle11 && !pageInfo.isHome && (
        <InnerPageHeader
          title={pageInfo.title || "Page"}
          currentPage={pageInfo.title || "Page"}
        />
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
