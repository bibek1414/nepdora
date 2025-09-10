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
import { TeamComponent } from "@/components/site-owners/team-member/team-component";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { FAQComponent } from "@/components/site-owners/faq/faq-component";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { TestimonialsComponent } from "@/components/site-owners/testimonials/testimonial-component";
interface PageComponent {
  id: string | number;
  component_id: string;
  component_type:
    | "hero"
    | "about"
    | "products"
    | "blog"
    | "contact"
    | "team"
    | "faq"
    | "testimonials";
  data:
    | HeroComponentData["data"]
    | AboutUsComponentData["data"]
    | ProductsComponentData["data"]
    | BlogComponentData["data"]
    | ContactComponentData["data"]
    | FAQComponentData["data"]
    | TestimonialsComponentData["data"]
    | TeamComponentData["data"];
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
    newData:
      | ProductsComponentData
      | BlogComponentData
      | ContactComponentData
      | TeamComponentData
      | FAQComponentData
      | HeroComponentData
      | AboutUsComponentData
      | TestimonialsComponentData
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
      case "team":
        return (
          <TeamComponent
            key={component.id}
            component={component as TeamComponentData}
            isEditable={false}
            siteId={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as TeamComponentData)
            }
          />
        );
      case "faq":
        return (
          <FAQComponent
            key={component.id}
            component={component as FAQComponentData}
            isEditable={false}
            siteId={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as FAQComponentData)
            }
          />
        );
      case "testimonials":
        return (
          <TestimonialsComponent
            key={component.id}
            component={component as TestimonialsComponentData}
            isEditable={false}
            siteId={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(
                componentId,
                newData as TestimonialsComponentData
              )
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
