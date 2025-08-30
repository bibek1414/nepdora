"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useRouter } from "next/navigation";
import { HeroComponent } from "@/components/site-owners/hero/hero-component";
import { AboutUsComponent } from "@/components/site-owners/about/about-component";
import { ProductsComponent } from "@/components/site-owners/products/products-component";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/use-hero";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { use } from "react";

interface DynamicPageProps {
  params: Promise<{
    siteUser: string;
    pageSlug?: string[];
  }>;
}

interface PageComponent {
  id: string | number;
  component_type: "hero" | "about" | "products";
  data:
    | HeroComponentData["data"]
    | AboutUsComponentData["data"]
    | ProductsComponentData["data"];
  order?: number;
}

export default function DynamicPage({ params }: DynamicPageProps) {
  const router = useRouter();
  const { siteUser, pageSlug } = use(params);

  // Determine the current page slug
  // If no pageSlug, default to home page
  // If pageSlug exists, use the first segment (e.g., 'about', 'features', etc.)
  const currentPageSlug =
    pageSlug && pageSlug.length > 0 ? pageSlug[0] : "home";

  // Fetch components for the current page
  const { data: pageComponentsResponse, isLoading: isComponentsLoading } =
    usePageComponentsQuery(currentPageSlug);

  // Process all page components with proper typing
  const pageComponents = React.useMemo((): PageComponent[] => {
    if (!pageComponentsResponse) return [];
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let components: any[] = [];
    if (Array.isArray(pageComponentsResponse.data)) {
      components = pageComponentsResponse.data;
    } else if (Array.isArray(pageComponentsResponse.components)) {
      components = pageComponentsResponse.components;
    } else if (Array.isArray(pageComponentsResponse)) {
      components = pageComponentsResponse;
    }

    return components.filter(
      (component): component is PageComponent =>
        component.component_type &&
        ["hero", "about", "products"].includes(component.component_type) &&
        component.data
    );
  }, [pageComponentsResponse]);

  const handleBackToBuilder = () => {
    router.push(`/builder/${siteUser}`);
  };

  // Product click handler - Navigate to product detail page
  const handleProductClick = (productId: number, order: number) => {
    console.log("Product clicked in preview:", { productId, order });
    router.push(`/preview/${siteUser}/products/${productId}`);
  };

  // Component update handler (not used in preview mode)
  const handleComponentUpdate = (
    componentId: string,
    newData: ProductsComponentData
  ) => {
    console.log("Component update in preview (not applied):", {
      componentId,
      newData,
    });
  };

  // Component renderer with proper typing
  const renderComponent = (component: PageComponent) => {
    switch (component.component_type) {
      case "hero":
        return (
          <HeroComponent
            key={component.id}
            component={component as HeroComponentData}
            isEditable={false}
            pageSlug={currentPageSlug}
          />
        );
      case "about":
        return (
          <AboutUsComponent
            key={component.id}
            component={component as AboutUsComponentData}
            isEditable={false}
            pageSlug={currentPageSlug}
          />
        );
      case "products":
        return (
          <ProductsComponent
            key={component.id}
            component={component as ProductsComponentData}
            isEditable={false}
            siteId={siteUser}
            onUpdate={handleComponentUpdate}
            onProductClick={handleProductClick}
          />
        );
      default:
        return null;
    }
  };

  if (isComponentsLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground text-sm">
            Loading {currentPageSlug} page...
          </p>
        </div>
      </div>
    );
  }

  const hasContent = pageComponents.length > 0;

  return (
    <>
      {/* Render All Page Components */}
      {pageComponents.length > 0 && (
        <div className="space-y-0">
          {pageComponents
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(renderComponent)}
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
              No Content for &apos;{currentPageSlug}&apos;page
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md">
              Go back to the builder and start adding components to the &apos;
              {currentPageSlug}&apos;page.
            </p>
            <Button onClick={handleBackToBuilder} className="mt-4">
              Open Builder
            </Button>
          </div>
        ) : (
          // Additional content sections when page components exist
          <div className="space-y-12">
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                {currentPageSlug.charAt(0).toUpperCase() +
                  currentPageSlug.slice(1)}{" "}
                Page
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                You&apos;re viewing the {currentPageSlug} page preview.
              </p>
              <Button onClick={handleBackToBuilder} size="lg">
                Continue Building
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
