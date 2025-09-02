"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { HeroComponent } from "@/components/site-owners/hero/hero-component";
import { AboutUsComponent } from "@/components/site-owners/about/about-component";
import { ProductsComponent } from "@/components/site-owners/products/products-component";
import { BlogComponent } from "@/components/site-owners/blog/blog-components";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/use-hero";
import { usePages } from "@/hooks/owner-site/use-page";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { use } from "react";

interface PreviewPageProps {
  params: Promise<{ siteUser: string }>;
}

interface PageComponent {
  id: string | number;
  component_type: "hero" | "about" | "products" | "blog";
  data:
    | HeroComponentData["data"]
    | AboutUsComponentData["data"]
    | ProductsComponentData["data"]
    | BlogComponentData["data"];
  order?: number;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const router = useRouter();
  const { siteUser } = use(params);

  const { data: pagesData = [], isLoading: isPagesLoading } = usePages();

  // Get the home page slug for components
  const homePage =
    pagesData.find(page => page.title.toLowerCase() === "home") || pagesData[0];
  const homePageSlug = homePage?.slug || "";

  // Fetch all components for the home page
  const { data: pageComponentsResponse, isLoading: isComponentsLoading } =
    usePageComponentsQuery(homePageSlug);

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
        ["hero", "about", "products", "blog"].includes(
          component.component_type
        ) &&
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

  // Blog click handler - Navigate to blog detail page
  const handleBlogClick = (blogSlug: string, order: number) => {
    console.log("Blog clicked in preview:", { blogSlug, order });
    router.push(`/preview/${siteUser}/blog/${blogSlug}`);
  };

  // Component update handlers (not used in preview mode)
  const handleComponentUpdate = (
    componentId: string,
    newData: ProductsComponentData | BlogComponentData
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
            pageSlug={homePageSlug}
          />
        );
      case "about":
        return (
          <AboutUsComponent
            key={component.id}
            component={component as AboutUsComponentData}
            isEditable={false}
            pageSlug={homePageSlug}
          />
        );
      case "products":
        return (
          <ProductsComponent
            key={component.id}
            component={component as ProductsComponentData}
            isEditable={false}
            siteId={siteUser}
            onUpdate={(componentId, newData) =>
              handleComponentUpdate(
                componentId,
                newData as ProductsComponentData
              )
            }
            onProductClick={handleProductClick}
          />
        );
      case "blog":
        return (
          <BlogComponent
            key={component.id}
            component={component as BlogComponentData}
            isEditable={false}
            siteId={siteUser}
            pageSlug={homePageSlug}
            onUpdate={(componentId, newData) =>
              handleComponentUpdate(componentId, newData as BlogComponentData)
            }
            onBlogClick={handleBlogClick}
          />
        );
      default:
        return null;
    }
  };

  const isLoading = isPagesLoading || isComponentsLoading;

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

  const hasContent = pageComponents.length > 0;

  return (
    <>
      {pageComponents.length > 0 && (
        <div className="space-y-0">
          {pageComponents
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(renderComponent)}
        </div>
      )}
    </>
  );
}
