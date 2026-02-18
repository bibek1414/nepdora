"use client";

import { NavbarComponent } from "@/components/site-owners/builder/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/builder/footer/footer-component";
import {
  useNavbarQuery,
  useNavbarQueryPublished,
} from "@/hooks/owner-site/components/use-navbar";
import {
  useFooterQuery,
  useFooterQueryPublished,
} from "@/hooks/owner-site/components/use-footer";
import {
  useThemeQuery,
  useThemeQueryPublished,
} from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { InnerPageHeader } from "@/components/site-owners/builder/navbar/inner-page-header";
import { useEffect, useState } from "react";

interface SiteLayoutWrapperProps {
  children: React.ReactNode;
  siteUser: string;
}

export function SiteLayoutWrapper({
  children,
  siteUser,
}: SiteLayoutWrapperProps) {
  const pathname = usePathname();
  const isPreview = pathname?.startsWith("/preview") || false;

  const { data: navbarResponse, isLoading: isNavbarLoading } = isPreview
    ? useNavbarQuery()
    : useNavbarQueryPublished();

  const { data: footerResponse, isLoading: isFooterLoading } = isPreview
    ? useFooterQuery()
    : useFooterQueryPublished();

  const { data: themeResponse } = isPreview
    ? useThemeQuery()
    : useThemeQueryPublished();

  const [pageInfo, setPageInfo] = useState<{ isHome: boolean; title: string }>({
    isHome: true,
    title: "",
  });

  const isStyle11 = navbarResponse?.data?.data?.style === "style-11";
  const isLoading = isNavbarLoading || isFooterLoading;

  useEffect(() => {
    if (!pathname || !isStyle11) return;

    let isHome = false;
    let title = "";

    const previewPrefix = `/preview/${siteUser}`;
    const publishInternalPrefix = ``;
    const publishPrefix = `/${siteUser}`;

    if (
      pathname === "/" ||
      pathname === previewPrefix ||
      pathname === `${previewPrefix}/` ||
      pathname === publishInternalPrefix ||
      pathname === `${publishInternalPrefix}/` ||
      pathname === publishPrefix ||
      pathname === `${publishPrefix}/`
    ) {
      isHome = true;
    } else {
      let cleanPath = pathname;
      if (pathname.startsWith(`${previewPrefix}/`)) {
        cleanPath = pathname.replace(`${previewPrefix}/`, "");
      } else if (pathname.startsWith(`${publishInternalPrefix}/`)) {
        cleanPath = pathname.replace(`${publishInternalPrefix}/`, "");
      } else if (pathname.startsWith(`${publishPrefix}/`)) {
        cleanPath = pathname.replace(`${publishPrefix}/`, "");
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

      {/* Breadcrumb for Style-11 */}
      {isStyle11 && !pageInfo.isHome && (
        <InnerPageHeader
          title={pageInfo.title || "Page"}
          currentPage={pageInfo.title || "Page"}
        />
      )}

      <main className="min-h-[calc(100vh-64px)]">
        <div className="transition-all duration-300">
          <div className="min-h-[600px] overflow-hidden bg-white">
            {children}

            {/* Render Footer */}
            {footerResponse?.data && (
              <FooterComponent
                footer={footerResponse.data}
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
