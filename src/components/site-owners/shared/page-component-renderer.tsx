"use client";

import React from "react";
import { HeroComponent } from "@/components/site-owners/builder/hero/hero-component";
import { AboutUsComponent } from "@/components/site-owners/builder/about/about-component";
import { ProductsComponent } from "@/components/site-owners/builder/products/products-component";
import { BlogComponent } from "@/components/site-owners/builder/blog/blog-components";
import { ServicesComponent } from "@/components/site-owners/builder/services/services-component";
import { ContactComponent } from "@/components/site-owners/builder/contact/contact-component";
import { AppointmentComponent } from "@/components/site-owners/builder/appointment/appointment-component";
import { OurClientsComponent } from "@/components/site-owners/builder/our-clients/our-clients-component";
import { CTAComponent } from "@/components/site-owners/builder/cta/cta-component";
import { CategoryComponent } from "@/components/site-owners/builder/category/category-component";

import { SubCategoryComponent } from "@/components/site-owners/builder/sub-category/sub-category-component";
import { TeamComponent } from "@/components/site-owners/builder/team-member/team-component";
import { FAQComponent } from "@/components/site-owners/builder/faq/faq-component";
import { TestimonialsComponent } from "@/components/site-owners/builder/testimonials/testimonial-component";
import { PortfolioComponent } from "@/components/site-owners/builder/portfolio/portfolio-component";
import { BannerComponent } from "@/components/site-owners/builder/banner/banner-component";
import { NewsletterComponent } from "@/components/site-owners/builder/newsletter/newsletter-component";
import { VidoesComponent } from "@/components/site-owners/builder/videos/videos-component";
import { GalleryComponent } from "@/components/site-owners/builder/gallery/gallery-component";
import { PolicyComponent } from "@/components/site-owners/builder/policies/policies-component";
import { TextEditorComponent } from "@/components/site-owners/builder/text-editor/text-editor-component";
import { PricingComponent } from "@/components/site-owners/builder/pricing/pricing-component";
import { OthersComponent } from "@/components/site-owners/builder/others/others-component";

import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { ContactComponentData } from "@/types/owner-site/components/contact";
import { AppointmentComponentData } from "@/types/owner-site/components/appointment";
import { OurClientsComponentData } from "@/types/owner-site/components/our-client";
import { CTAComponentData } from "@/types/owner-site/components/cta";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { PortfolioComponentData } from "@/types/owner-site/components/portfolio";
import { BannerComponentData } from "@/types/owner-site/components/banner";
import { NewsletterComponentData } from "@/types/owner-site/components/newsletter";
import { VideosComponentData } from "@/types/owner-site/components/videos";
import { GalleryComponentData } from "@/types/owner-site/components/gallery";
import { PolicyComponentData } from "@/types/owner-site/components/policies";
import { TextEditorComponentData } from "@/types/owner-site/components/text-editor";
import { PricingComponentData } from "@/types/owner-site/components/pricing";
import { OthersComponentData } from "@/types/owner-site/components/others";

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
  onProductClick: (productId: number, order: number) => void;
  onBlogClick: (blogSlug: string, order: number) => void;
  onServiceClick: (serviceSlug: string, order: number) => void;
  onCategoryClick: (categoryId: number, order: number) => void;
  onSubCategoryClick: (subcategoryId: number, order: number) => void;
  onComponentUpdate: (
    componentId: string,
    newData:
      | HeroComponentData
      | AboutUsComponentData
      | ProductsComponentData
      | BlogComponentData
      | ServicesComponentData
      | ContactComponentData
      | AppointmentComponentData
      | OurClientsComponentData
      | CTAComponentData
      | CategoryComponentData
      | SubCategoryComponentData
      | TeamComponentData
      | FAQComponentData
      | TestimonialsComponentData
      | PortfolioComponentData
      | BannerComponentData
      | NewsletterComponentData
      | VideosComponentData
      | GalleryComponentData
      | TextEditorComponentData
      | PricingComponentData
      | PolicyComponentData
      | OthersComponentData
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
      case "others":
        return (
          <OthersComponent
            key={component.id}
            siteUser={siteUser}
            component={component as OthersComponentData}
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
      case "gallery":
        return (
          <GalleryComponent
            key={component.id}
            component={component as GalleryComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as GalleryComponentData)
            }
          />
        );
      case "cta":
        return (
          <CTAComponent
            key={component.id}
            component={component as CTAComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as CTAComponentData)
            }
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
      case "our_clients":
        return (
          <OurClientsComponent
            key={component.id}
            component={component as OurClientsComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as OurClientsComponentData)
            }
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
      case "appointment":
        return (
          <AppointmentComponent
            key={component.id}
            component={component as AppointmentComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(
                componentId,
                newData as AppointmentComponentData
              )
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
      case "videos":
        return (
          <VidoesComponent
            key={component.id}
            component={component as VideosComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as VideosComponentData)
            }
          />
        );
      case "policies":
        return (
          <PolicyComponent
            key={component.id}
            component={component as PolicyComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
          />
        );
      case "text_editor":
        return (
          <TextEditorComponent
            key={component.id}
            component={component as TextEditorComponentData}
            isEditable={false}
            siteUser={siteUser}
            pageSlug={pageSlug}
          />
        );
      case "pricing":
        return (
          <PricingComponent
            key={component.id}
            component={component as PricingComponentData}
            isEditable={false}
            pageSlug={pageSlug}
            onUpdate={(componentId, newData) =>
              onComponentUpdate(componentId, newData as PricingComponentData)
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
