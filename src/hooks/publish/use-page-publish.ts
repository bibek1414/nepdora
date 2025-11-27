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
import { AppointmentComponentData } from "@/types/owner-site/components/appointment";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { PortfolioComponentData } from "@/types/owner-site/components/portfolio";
import { BannerComponentData } from "@/types/owner-site/components/banner";
import { NewsletterComponentData } from "@/types/owner-site/components/newsletter";
import { YouTubeComponentData } from "@/types/owner-site/components/youtube";
import { GalleryComponentData } from "@/types/owner-site/components/gallery";
import { PolicyComponentData } from "@/types/owner-site/components/policies";
import { TextEditorComponentData } from "@/types/owner-site/components/text-editor";
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
    | "appointment"
    | "category"
    | "portfolio"
    | "banner"
    | "newsletter"
    | "youtube"
    | "policies"
    | "text_editor"
    | "subcategory";
  data:
    | HeroComponentData["data"]
    | AboutUsComponentData["data"]
    | ProductsComponentData["data"]
    | BlogComponentData["data"]
    | ServicesComponentData["data"]
    | ContactComponentData["data"]
    | AppointmentComponentData["data"]
    | FAQComponentData["data"]
    | TeamComponentData["data"]
    | TestimonialsComponentData["data"]
    | PortfolioComponentData["data"]
    | NewsletterComponentData["data"]
    | CategoryComponentData["data"]
    | GalleryComponentData["data"]
    | TextEditorComponentData["data"]
    | BannerComponentData["data"]
    | YouTubeComponentData["data"]
    | SubCategoryComponentData["data"]
    | PolicyComponentData["data"];
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
          "appointment",
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
          "text_editor",
          "banner",
          "gallery",
          "policies",
        ].includes(component.component_type) &&
        !!component.data
    );
  }, [pageComponentsResponse]);

  // Navigation handlers
  const handleBacktoHome = () => {
    router.push(``);
  };

  const handleProductClick = (productId: number, order: number) => {
    console.log("Product clicked in publish:", { productId, order });
    router.push(`/products/${productId}`);
  };

  const handleBlogClick = (blogSlug: string, order: number) => {
    console.log("Blog clicked in publish:", { blogSlug, order });
    router.push(`/blog/${blogSlug}`);
  };
  const handleServiceClick = (serviceSlug: string, order: number) => {
    console.log("Service clicked in publish:", { serviceSlug, order });
    router.push(`/services/${serviceSlug}`);
  };
  const handleCategoryClick = (categoryId: number, order: number) => {
    console.log("Category clicked in publish:", { categoryId, order });
    router.push(`/categories/${categoryId}`);
  };

  const handleSubCategoryClick = (subcategoryId: number, order: number) => {
    console.log("SubCategory clicked in publish:", { subcategoryId, order });
    router.push(`/subcategories/${subcategoryId}`);
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
      | AppointmentComponentData
      | SubCategoryComponentData
      | NewsletterComponentData
      | PortfolioComponentData
      | BannerComponentData
      | YouTubeComponentData
      | TextEditorComponentData
      | PolicyComponentData
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
