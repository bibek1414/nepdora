"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  usePageComponentsQuery,
  usePageComponentsQueryPublished,
} from "./components/use-unified";
import {
  useNavbarQuery,
  useNavbarQueryPublished,
} from "./components/use-navbar";
import {
  useFooterQuery,
  useFooterQueryPublished,
} from "./components/use-footer";
import { useThemeQuery, useThemeQueryPublished } from "./components/use-theme";
import {
  ComponentTypeMap,
  ComponentResponse,
  ApiListResponse,
} from "@/types/owner-site/components/components";

export function usePageData(siteUser: string, pageSlug: string) {
  const pathname = usePathname();
  const router = useRouter();

  const isPreview = pathname?.startsWith("/preview") || false;

  const { data: pageComponentsResponse, isLoading: isComponentsLoading } =
    isPreview
      ? usePageComponentsQuery(pageSlug)
      : usePageComponentsQueryPublished(pageSlug);

  const { data: navbarResponse, isLoading: isNavbarLoading } = isPreview
    ? useNavbarQuery()
    : useNavbarQueryPublished();

  const { data: footerResponse, isLoading: isFooterLoading } = isPreview
    ? useFooterQuery()
    : useFooterQueryPublished();

  const { data: themeResponse, isLoading: isThemeLoading } = isPreview
    ? useThemeQuery()
    : useThemeQueryPublished();

  const isLoading =
    isComponentsLoading || isNavbarLoading || isFooterLoading || isThemeLoading;

  const pageComponents = React.useMemo(() => {
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

    const validTypes = [
      "hero",
      "about",
      "products",
      "blog",
      "services",
      "contact",
      "team",
      "others",
      "faq",
      "testimonials",
      "category",
      "newsletter",
      "subcategory",
      "portfolio",
      "our_clients",
      "appointment",
      "cta",
      "videos",
      "banner",
      "gallery",
      "policies",
      "text_editor",
      "pricing",
    ];

    return components.filter(
      component =>
        !!component.component_type &&
        validTypes.includes(component.component_type) &&
        !!component.data
    );
  }, [pageComponentsResponse]);

  const routePrefix = isPreview ? `/preview/${siteUser}` : `/`;

  const navigation = {
    handleBacktoHome: () => {
      router.push(isPreview ? `/preview/${siteUser}` : `/`);
    },
    handleProductClick: (productId: number) => {
      router.push(`${routePrefix}/products/${productId}`);
    },
    handleBlogClick: (blogSlug: string) => {
      router.push(`${routePrefix}/blog/${blogSlug}`);
    },
    handleServiceClick: (serviceSlug: string) => {
      router.push(`${routePrefix}/services/${serviceSlug}`);
    },
    handleCategoryClick: (categoryId: number) => {
      router.push(`${routePrefix}/categories/${categoryId}`);
    },
    handleSubCategoryClick: (subcategoryId: number) => {
      router.push(`${routePrefix}/subcategories/${subcategoryId}`);
    },
  };

  return {
    pageComponents,
    navbarData: navbarResponse?.data,
    footerData: footerResponse?.data,
    themeData: themeResponse?.data?.[0]?.data?.theme,
    isLoading,
    isPreview,
    ...navigation,
  };
}
