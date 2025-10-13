"use client";

import React from "react";
import { HeroComponent } from "@/components/site-owners/builder/hero/hero-component";
import { AboutUsComponent } from "@/components/site-owners/builder/about/about-component";
import { ProductsComponent } from "@/components/site-owners/builder/products/products-component";
import { BlogComponent } from "@/components/site-owners/builder/blog/blog-components";
import { ServicesComponent } from "@/components/site-owners/builder/services/services-component";
import { ContactComponent } from "@/components/site-owners/builder/contact/contact-component";
import { CategoryComponent } from "@/components/site-owners/builder/category/category-component";
import { SubCategoryComponent } from "@/components/site-owners/builder/sub-category/sub-category-component";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { ContactComponentData } from "@/types/owner-site/components/contact";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { TeamComponent } from "@/components/site-owners/builder/team-member/team-component";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { FAQComponent } from "@/components/site-owners/builder/faq/faq-component";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { TestimonialsComponent } from "@/components/site-owners/builder/testimonials/testimonial-component";
import { PortfolioComponentData } from "@/types/owner-site/components/portfolio";
import { PortfolioComponent } from "@/components/site-owners/builder/portfolio/portfolio-component";
import { BannerComponentData } from "@/types/owner-site/components/banner";
import { BannerComponent } from "@/components/site-owners/builder/banner/banner-component";
import { NewsletterComponent } from "@/components/site-owners/builder/newsletter/newsletter-component";
import { NewsletterComponentData } from "@/types/owner-site/components/newsletter";
import { YouTubeComponent } from "@/components/site-owners/builder/youtube/youtube-component";
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
    | TestimonialsComponentData["data"]
    | TeamComponentData["data"]
    | CategoryComponentData["data"]
    | PortfolioComponentData["data"]
    | NewsletterComponentData["data"]
    | YouTubeComponentData["data"]
    | BannerComponentData["data"]
    | SubCategoryComponentData["data"];
  order: number;
}

interface PageComponentRendererProps {
  components: PageComponent[];
  siteUser: string;
  pageSlug: string;
  onProductClick: (productId: number, order: number) => void;
  onBlogClick: (blogSlug: string, order: number) => void;
  onServiceClick?: (serviceSlug: string, order: number) => void;
  onCategoryClick?: (categoryId: number, order: number) => void;
  onSubCategoryClick?: (subcategoryId: number, order: number) => void;
  onComponentUpdate: (
    componentId: string,
    newData:
      | ProductsComponentData
      | BlogComponentData
      | ServicesComponentData
      | ContactComponentData
      | TeamComponentData
      | FAQComponentData
      | HeroComponentData
      | AboutUsComponentData
      | TestimonialsComponentData
      | CategoryComponentData
      | SubCategoryComponentData
      | PortfolioComponentData
      | BannerComponentData
      | NewsletterComponentData
      | YouTubeComponentData
  ) => void;
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
            siteUser={siteUser}
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
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as BlogComponentData)
            }
            onBlogClick={onBlogClick}
          />
        );
      case "services":
        return (
          <ServicesComponent
            key={component.id}
            component={component as ServicesComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as ServicesComponentData)
            }
            onServiceClick={onServiceClick}
          />
        );
      case "contact":
        return (
          <ContactComponent
            key={component.id}
            component={component as ContactComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as ContactComponentData)
            }
          />
        );
      case "newsletter":
        return (
          <NewsletterComponent
            key={component.id}
            component={component as NewsletterComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as NewsletterComponentData)
            }
          />
        );
      case "team":
        return (
          <TeamComponent
            key={component.id}
            component={component as TeamComponentData}
            isEditable={false}
            siteUser={siteUser}
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
            siteUser={siteUser}
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
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(
                componentId,
                newData as TestimonialsComponentData
              )
            }
          />
        );
      case "category":
        return (
          <CategoryComponent
            key={component.id}
            component={component as CategoryComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as CategoryComponentData)
            }
            onCategoryClick={onCategoryClick}
          />
        );
      case "subcategory":
        return (
          <SubCategoryComponent
            key={component.id}
            component={component as SubCategoryComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(
                componentId,
                newData as SubCategoryComponentData
              )
            }
            onSubCategoryClick={onSubCategoryClick}
          />
        );
      case "portfolio":
        return (
          <PortfolioComponent
            key={component.id}
            component={component as PortfolioComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as PortfolioComponentData)
            }
          />
        );
      case "banner":
        return (
          <BannerComponent
            key={component.id}
            component={component as BannerComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as BannerComponentData)
            }
          />
        );
      case "youtube":
        return (
          <YouTubeComponent
            key={component.id}
            component={component as YouTubeComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as YouTubeComponentData)
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
