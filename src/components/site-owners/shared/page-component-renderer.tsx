"use client";

import React from "react";
import { COMPONENT_REGISTRY } from "@/types/owner-site/components/registry";
import { ComponentTypeMap } from "@/types/owner-site/components/components";

interface PageComponent {
  id: string | number;
  component_id: string;
  component_type: string;
  data: any;
  order: number;
}

interface PageComponentRendererProps {
  components: PageComponent[];
  siteUser: string;
  pageSlug: string;
  onProductClick: (productSlug: string, order: number) => void;
  onBlogClick: (blogSlug: string, order: number) => void;
  onServiceClick: (serviceSlug: string, order: number) => void;
  onCategoryClick: (categoryId: number, order: number) => void;
  onSubCategoryClick: (subcategoryId: number, order: number) => void;
  onComponentUpdate: (componentId: string, newData: any) => void;
  productSlug?: string;
  blogSlug?: string;
  portfolioSlug?: string;
  serviceSlug?: string;
}

export function PageComponentRenderer({
  components,
  siteUser,
  pageSlug,
  onProductClick,
  onBlogClick,
  onServiceClick,
  onCategoryClick,
  onSubCategoryClick,
  onComponentUpdate,
  productSlug,
  blogSlug,
  portfolioSlug,
  serviceSlug,
}: PageComponentRendererProps) {
  const renderComponent = (component: PageComponent) => {
    const type = component.component_type as keyof ComponentTypeMap;
    const config = COMPONENT_REGISTRY[type];

    if (!config) {
      console.warn(`Unknown component type: ${component.component_type}`);
      return null;
    }

    const Component = config.component;

    // Common props passed to all components
    const commonProps = {
      component: component,
      isEditable: false,
      siteUser: siteUser,
      pageSlug: pageSlug,
      onUpdate: (componentId: string, newData: any) =>
        onComponentUpdate(componentId, newData),
      productSlug,
      blogSlug,
      portfolioSlug,
      serviceSlug,
    };

    // Specific props for certain components (passed regardless, but used by those that need them)
    const specificProps = {
      onProductClick,
      onBlogClick,
      onServiceClick,
      onCategoryClick,
      onSubCategoryClick,
    };

    return <Component key={component.id} {...commonProps} {...specificProps} />;
  };

  if (components.length === 0) {
    return null;
  }

  return (
    <div className="space-y-0">
      {components
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(renderComponent)}
    </div>
  );
}
