"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/site-owners/button";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { ComponentResponse } from "@/types/owner-site/components/components";
import { SiteNotFound } from "@/components/site-owners/shared/site-not-found";

interface DynamicPageClientProps {
  siteUser: string;
  currentPageSlug: string;
  contentSlug?: string;
  initialPageSlug: string;
  initialPageComponents: ComponentResponse[];
}

export default function DynamicPageClient({
  siteUser,
  currentPageSlug,
  contentSlug,
  initialPageSlug,
  initialPageComponents,
}: DynamicPageClientProps) {
  const router = useRouter();
  const pageComponents = React.useMemo(
    () => initialPageComponents ?? [],
    [initialPageComponents]
  );
  const handleBacktoHome = React.useCallback(() => {
    router.push(`/publish/${siteUser}`);
  }, [router, siteUser]);
  const handleComponentUpdate = () => {
    // Component update handlers (not used in publish mode)
  };

  const hasContent = pageComponents.length > 0;

  return (
    <>
      {hasContent ? (
        <PageComponentRenderer
          components={pageComponents}
          siteUser={siteUser}
          pageSlug={initialPageSlug}
          onComponentUpdate={handleComponentUpdate}
          productSlug={contentSlug}
          blogSlug={contentSlug}
          serviceSlug={contentSlug}
          portfolioSlug={contentSlug}
        />
      ) : null}

      {!hasContent && (
        <SiteNotFound 
          pageName={currentPageSlug} 
          onBackHome={handleBacktoHome} 
        />
      )}
    </>
  );
}
