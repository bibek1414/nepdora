"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/unified";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import {
  ComponentTypeMap,
  ComponentResponse,
  ApiListResponse,
} from "@/types/owner-site/components/components";

interface PageComponent {
  id: string | number;
  component_id: string;
  component_type: "hero" | "about" | "products" | "blog";
  data:
    | HeroComponentData["data"]
    | AboutUsComponentData["data"]
    | ProductsComponentData["data"]
    | BlogComponentData["data"];
  order: number;
}

export function usePagePreview(siteUser: string, pageSlug: string) {
  const router = useRouter();

  // Fetch components for the current page
  const { data: pageComponentsResponse, isLoading: isComponentsLoading } =
    usePageComponentsQuery(pageSlug);

  // Process all page components with proper typing
  const pageComponents = React.useMemo((): PageComponent[] => {
    if (!pageComponentsResponse) return [];

    let components: ComponentResponse<keyof ComponentTypeMap>[] = [];

    if (Array.isArray(pageComponentsResponse)) {
      components = pageComponentsResponse;
    } else if (typeof pageComponentsResponse === "object") {
      const response = pageComponentsResponse as ApiListResponse<
        ComponentResponse<keyof ComponentTypeMap>
      >;
      components = response.data || response.components || [];
    }

    return components.filter(
      (component): component is PageComponent =>
        !!component.component_type &&
        ["hero", "about", "products", "blog"].includes(
          component.component_type
        ) &&
        !!component.data
    );
  }, [pageComponentsResponse]);

  // Navigation handlers
  const handleBackToBuilder = () => {
    router.push(`/builder/${siteUser}`);
  };

  const handleProductClick = (productId: number, order: number) => {
    console.log("Product clicked in preview:", { productId, order });
    router.push(`/preview/${siteUser}/products/${productId}`);
  };

  const handleBlogClick = (blogSlug: string, order: number) => {
    console.log("Blog clicked in preview:", { blogSlug, order });
    router.push(`/preview/${siteUser}/blog/${blogSlug}`);
  };

  // Component update handlers (not used in preview mode)
  const handleComponentUpdate = (
    componentId: string,
    newData:
      | HeroComponentData
      | AboutUsComponentData
      | ProductsComponentData
      | BlogComponentData
  ) => {
    console.log("Component update in preview (not applied):", {
      componentId,
      newData,
    });
  };

  return {
    pageComponents,
    isComponentsLoading,
    handleBackToBuilder,
    handleProductClick,
    handleBlogClick,
    handleComponentUpdate,
  };
}
