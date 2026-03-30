"use client";

import { NavbarComponent } from "@/components/site-owners/builder/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/builder/footer/footer-component";
import { useNavbarQuery } from "@/hooks/owner-site/components/use-navbar";
import { useFooterQuery } from "@/hooks/owner-site/components/use-footer";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { usePathname } from "next/navigation";
import { InnerPageHeader } from "@/components/site-owners/builder/navbar/inner-page-header";
import { useEffect, useState } from "react";
import { GetNavbarResponse } from "@/types/owner-site/components/navbar";
import { GetFooterResponse } from "@/types/owner-site/components/footer";
import { GetThemeResponse } from "@/types/owner-site/components/theme";

interface SiteLayoutWrapperProps {
  children: React.ReactNode;
  siteUser: string;
  initialNavbarResponse?: GetNavbarResponse | null;
  initialFooterResponse?: GetFooterResponse | null;
  initialThemeResponse?: GetThemeResponse | null;
}

export function SiteLayoutWrapper({
  children,
  siteUser,
  initialNavbarResponse,
  initialFooterResponse,
  initialThemeResponse,
}: SiteLayoutWrapperProps) {
  const pathname = usePathname();
  const isPreview = pathname?.startsWith("/preview") || false;

  const { data: previewNavbarResponse, isLoading: isNavbarLoading } =
    useNavbarQuery(isPreview);

  const { data: previewFooterResponse, isLoading: isFooterLoading } =
    useFooterQuery(isPreview);

  const { data: previewThemeResponse } = useThemeQuery(isPreview);

  const navbarResponse = isPreview
    ? previewNavbarResponse
    : (initialNavbarResponse ?? null);
  const footerResponse = isPreview
    ? previewFooterResponse
    : (initialFooterResponse ?? null);
  const themeResponse = isPreview
    ? previewThemeResponse
    : (initialThemeResponse ?? null);

  const [pageInfo, setPageInfo] = useState<{ isHome: boolean; title: string }>({
    isHome: true,
    title: "",
  });

  const isStyle11 = navbarResponse?.data?.data?.style === "style-11";
  const isLoading = isPreview ? isNavbarLoading || isFooterLoading : false;

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
      {!isLoading && navbarResponse?.data && (
        <div className="sticky top-0 z-40">
          <NavbarComponent
            navbar={navbarResponse.data}
            isEditable={false}
            siteUser={siteUser}
          />
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
            {!isLoading && footerResponse?.data && (
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
