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
import { COMPONENT_REGISTRY } from "@/types/owner-site/components/registry";

export function usePageData(siteUser: string, pageSlug: string) {
  const pathname = usePathname();
  const router = useRouter();

  const isPreview = pathname?.startsWith("/preview") || false;
  const isPublish = pathname?.startsWith("/publish") || false;

  const { data: pageComponentsResponse, isLoading: isComponentsLoading } =
    isPreview
      ? usePageComponentsQuery(pageSlug, "preview")
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
      components = pageComponentsResponse as unknown as ComponentResponse<
        keyof ComponentTypeMap
      >[];
    } else if (typeof pageComponentsResponse === "object") {
      const response = pageComponentsResponse as ApiListResponse<
        ComponentResponse<keyof ComponentTypeMap>
      >;
      components = response.data || response.components || [];
    }

    const validTypes = Object.keys(COMPONENT_REGISTRY);

    return components.filter(
      component =>
        !!component.component_type &&
        validTypes.includes(component.component_type) &&
        !!component.data
    );
  }, [pageComponentsResponse]);

  // routePrefix should NOT end with a slash to avoid double slashes when concatenated with /products/...
  const routePrefix = isPreview
    ? `/preview/${siteUser}`
    : isPublish
      ? `/publish/${siteUser}`
      : "";

  const navigation = {
    handleBacktoHome: () => {
      router.push(routePrefix || "/");
    },
    handleProductClick: (productSlug: string, _order: number) => {
      router.push(`${routePrefix}/products/${productSlug}`);
    },
    handleBlogClick: (blogSlug: string, _order: number) => {
      router.push(`${routePrefix}/blog/${blogSlug}`);
    },
    handleServiceClick: (serviceSlug: string, _order: number) => {
      router.push(`${routePrefix}/services/${serviceSlug}`);
    },
    handleCategoryClick: (categoryId: number, _order: number) => {
      router.push(`${routePrefix}/categories/${categoryId}`);
    },
    handleSubCategoryClick: (subcategoryId: number, _order: number) => {
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
