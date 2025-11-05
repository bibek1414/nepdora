"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePageComponentsQueryPublished } from "@/hooks/owner-site/components/use-unified";
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
import { GalleryComponentData } from "@/types/owner-site/components/gallery";

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
    | "gallery"
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
    | GalleryComponentData["data"]
    | BannerComponentData["data"]
    | YouTubeComponentData["data"]
    | SubCategoryComponentData["data"];
  order: number;
}

export function usePagePublished(siteUser: string, pageSlug: string) {
  const router = useRouter();

  // Fetch components for the current page
  const { data: pageComponentsResponse, isLoading: isComponentsLoading } =
    usePageComponentsQueryPublished(pageSlug);

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
          "gallery",
        ].includes(component.component_type) &&
        !!component.data
    );
  }, [pageComponentsResponse]);

  // Navigation handlers
  const handleBacktoHome = () => {
    router.push(`/preview/${siteUser}`);
  };

  const handleProductClick = (productId: number, order: number) => {
    console.log("Product clicked in preview:", { productId, order });
    router.push(`/preview/${siteUser}/products/${productId}`);
  };

  const handleBlogClick = (blogSlug: string, order: number) => {
    console.log("Blog clicked in preview:", { blogSlug, order });
    router.push(`/preview/${siteUser}/blog/${blogSlug}`);
  };
  const handleServiceClick = (serviceSlug: string, order: number) => {
    console.log("Service clicked in preview:", { serviceSlug, order });
    router.push(`/preview/${siteUser}/services/${serviceSlug}`);
  };
  const handleCategoryClick = (categoryId: number, order: number) => {
    console.log("Category clicked in preview:", { categoryId, order });
    router.push(`/preview/${siteUser}/categories/${categoryId}`);
  };

  const handleSubCategoryClick = (subcategoryId: number, order: number) => {
    console.log("SubCategory clicked in preview:", { subcategoryId, order });
    router.push(`/preview/${siteUser}/subcategories/${subcategoryId}`);
  };

  // Component update handlers (not used in preview mode)
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
      | GalleryComponentData
  ) => {
    console.log("Component update in preview (not applied):", {
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
