"use client";

import React from "react";
import { HeroComponent } from "@/components/site-owners/hero/hero-component";
import { AboutUsComponent } from "@/components/site-owners/about/about-component";
import { ProductsComponent } from "@/components/site-owners/products/products-component";
import { BlogComponent } from "@/components/site-owners/blog/blog-components";
import { ContactComponent } from "@/components/site-owners/contact/contact-component";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { ContactComponentData } from "@/types/owner-site/components/contact";

interface PageComponent {
  id: string | number;
  component_id: string;
  component_type: "hero" | "about" | "products" | "blog" | "contact";
  data:
    | HeroComponentData["data"]
    | AboutUsComponentData["data"]
    | ProductsComponentData["data"]
    | BlogComponentData["data"]
    | ContactComponentData["data"];
  order: number;
}

interface PageComponentRendererProps {
  components: PageComponent[];
  siteUser: string;
  pageSlug: string;
  onProductClick: (productId: number, order: number) => void;
  onBlogClick: (blogSlug: string, order: number) => void;
  onComponentUpdate: (
    componentId: string,
    newData: ProductsComponentData | BlogComponentData | ContactComponentData
  ) => void;
}

export function PageComponentRenderer({
  components,
  siteUser,
  pageSlug,
  onProductClick,
  onBlogClick,
  onComponentUpdate,
}: PageComponentRendererProps) {
  const renderComponent = (component: PageComponent) => {
    switch (component.component_type) {
      case "hero":
        return (
          <HeroComponent
            key={component.id}
            siteUser={siteUser}
            component={component as HeroComponentData}
            isEditable={false}
            pageSlug={pageSlug}
          />
        );
      case "about":
        return (
          <AboutUsComponent
            key={component.id}
            component={component as AboutUsComponentData}
            isEditable={false}
            pageSlug={pageSlug}
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
              onComponentUpdate(componentId, newData as ProductsComponentData)
            }
            onProductClick={onProductClick}
          />
        );
      case "blog":
        return (
          <BlogComponent
            key={component.id}
            component={component as BlogComponentData}
            isEditable={false}
            siteId={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as BlogComponentData)
            }
            onBlogClick={onBlogClick}
          />
        );
      case "contact":
        return (
          <ContactComponent
            key={component.id}
            component={component as ContactComponentData}
            isEditable={false}
            siteId={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as ContactComponentData)
            }
          />
        );
      default:
        return null;
    }
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
