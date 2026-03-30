"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/site-owners/button";
import { PageComponentRenderer } from "@/components/site-owners/shared/page-component-renderer";
import { ComponentResponse } from "@/types/owner-site/components/components";

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

      <div className="p-8">
        {!hasContent ? (
          <div className="py-20 text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Oops! The &apos;{currentPageSlug}&apos; page you&apos;re looking
              for doesn&apos;t exist.
            </h3>

            <Button
              onClick={handleBacktoHome}
              className="mt-4"
              variant="default"
            >
              Go back home
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
}
