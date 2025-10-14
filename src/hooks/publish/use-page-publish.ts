"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePageComponentsQueryPublished } from "@/hooks/owner-site/components/unified";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { ContactComponentData } from "@/types/owner-site/components/contact";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import {
  ComponentTypeMap,
  ComponentResponse,
  ApiListResponse,
} from "@/types/owner-site/components/components";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { PortfolioComponentData } from "@/types/owner-site/components/portfolio";
import { BannerComponentData } from "@/types/owner-site/components/banner";
import { NewsletterComponentData } from "@/types/owner-site/components/newsletter";
import { YouTubeComponentData } from "@/types/owner-site/components/youtube";
interface PageComponent {
  id: string | number;
  component_id: string;
  component_type:
    | "hero"
    | "about"
    | "products"
    | "blog"
    | "services"
    | "contact"
    | "team"
    | "faq"
    | "testimonials"
    | "category"
    | "portfolio"
    | "banner"
    | "newsletter"
    | "youtube"
    | "subcategory";
  data:
    | HeroComponentData["data"]
    | AboutUsComponentData["data"]
    | ProductsComponentData["data"]
    | BlogComponentData["data"]
    | ServicesComponentData["data"]
    | ContactComponentData["data"]
    | FAQComponentData["data"]
    | TeamComponentData["data"]
    | TestimonialsComponentData["data"]
    | PortfolioComponentData["data"]
    | NewsletterComponentData["data"]
    | CategoryComponentData["data"]
    | BannerComponentData["data"]
    | YouTubeComponentData["data"]
    | SubCategoryComponentData["data"];
  order: number;
}

export function usePagePublished(siteUser: string, pageId: string | number) {
  const router = useRouter();

  // Fetch components for the current page by pageId
  const { data: pageComponentsResponse, isLoading: isComponentsLoading } =
    usePageComponentsQueryPublished(pageId);

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
        [
          "hero",
          "about",
          "products",
          "blog",
          "services",
          "contact",
          "team",
          "faq",
          "testimonials",
          "category",
          "newsletter",
          "subcategory",
          "portfolio",
          "youtube",
          "banner",
        ].includes(component.component_type) &&
        !!component.data
    );
  }, [pageComponentsResponse]);

  // Navigation handlers
  const handleBacktoHome = () => {
    router.push(`/publish/${siteUser}`);
  };

  const handleProductClick = (productId: number, order: number) => {
    console.log("Product clicked in publish:", { productId, order });
    router.push(`/publish/${siteUser}/products/${productId}`);
  };

  const handleBlogClick = (blogSlug: string, order: number) => {
    console.log("Blog clicked in publish:", { blogSlug, order });
    router.push(`/publish/${siteUser}/blog/${blogSlug}`);
  };
  const handleServiceClick = (serviceSlug: string, order: number) => {
    console.log("Service clicked in publish:", { serviceSlug, order });
    router.push(`/publish/${siteUser}/services/${serviceSlug}`);
  };
  const handleCategoryClick = (categoryId: number, order: number) => {
    console.log("Category clicked in publish:", { categoryId, order });
    router.push(`/publish/${siteUser}/categories/${categoryId}`);
  };

  const handleSubCategoryClick = (subcategoryId: number, order: number) => {
    console.log("SubCategory clicked in publish:", { subcategoryId, order });
    router.push(`/publish/${siteUser}/subcategories/${subcategoryId}`);
  };

  // Component update handlers (not used in publish mode)
  const handleComponentUpdate = (
    componentId: string,
    newData:
      | HeroComponentData
      | AboutUsComponentData
      | ProductsComponentData
      | BlogComponentData
      | ServicesComponentData
      | ContactComponentData
      | TeamComponentData
      | FAQComponentData
      | TestimonialsComponentData
      | CategoryComponentData
      | SubCategoryComponentData
      | NewsletterComponentData
      | PortfolioComponentData
      | BannerComponentData
      | YouTubeComponentData
  ) => {
    console.log("Component update in publish (not applied):", {
      componentId,
      newData,
    });
  };

  return {
    pageComponents,
    isComponentsLoading,
    handleBacktoHome,
    handleProductClick,
    handleBlogClick,
    handleCategoryClick,
    handleServiceClick,
    handleSubCategoryClick,
    handleComponentUpdate,
  };
}
