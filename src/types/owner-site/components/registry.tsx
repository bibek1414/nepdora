import React from "react";
import { ComponentTypeMap } from "./components";
import { DEFAULT_HERO_MAP } from "./hero";
import { DEFAULT_ABOUT_MAP } from "./about";
import { DEFAULT_BLOG_MAP } from "./blog";
import { DEFAULT_PRODUCTS_MAP } from "./products";
import { DEFAULT_CONTACT_MAP } from "./contact";
import { DEFAULT_APPOINTMENT_MAP } from "./appointment";
import { DEFAULT_TEAM_MAP } from "./team";
import { DEFAULT_TESTIMONIALS_MAP } from "./testimonials";
import { DEFAULT_FAQ_MAP } from "./faq";
import { DEFAULT_PORTFOLIO_MAP } from "./portfolio";
import { DEFAULT_BANNER_MAP } from "./banner";
import { DEFAULT_NEWSLETTER_MAP } from "./newsletter";
import { DEFAULT_VIDEOS_MAP } from "./videos";
import { DEFAULT_SERVICES_MAP } from "./services";
import { DEFAULT_GALLERY_MAP } from "./gallery";
import { DEFAULT_POLICIES_MAP } from "./policies";
import { DEFAULT_TEXT_EDITOR_MAP } from "./text-editor";
import { DEFAULT_CTA_MAP } from "./cta";
import { DEFAULT_PRICING_MAP } from "./pricing";
import { DEFAULT_OUR_CLIENTS_MAP } from "./our-client";
import { DEFAULT_OTHERS_MAP } from "./others";
import { DEFAULT_CATEGORY_MAP } from "./category";
import { DEFAULT_SUB_CATEGORY_MAP } from "./sub-category";

// Component Imports
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
import { VidoesComponent as VideosComponent } from "@/components/site-owners/builder/videos/videos-component";
import { GalleryComponent } from "@/components/site-owners/builder/gallery/gallery-component";
import { PolicyComponent } from "@/components/site-owners/builder/policies/policies-component";
import { TextEditorComponent } from "@/components/site-owners/builder/text-editor/text-editor-component";
import { PricingComponent } from "@/components/site-owners/builder/pricing/pricing-component";
import { OthersComponent } from "@/components/site-owners/builder/others/others-component";

export type ComponentCategory =
  | "basic"
  | "content"
  | "dynamic"
  | "ecommerce"
  | "legal"
  | "navigation"
  | "footer";

export interface ComponentMetadata<T extends keyof ComponentTypeMap> {
  type: T;
  displayName: string;
  category: ComponentCategory;
  getDefaultData: (variant?: any) => ComponentTypeMap[T];
  component: React.ComponentType<any>;
}

export const COMPONENT_REGISTRY: {
  [K in keyof ComponentTypeMap]: ComponentMetadata<K>;
} = {
  hero: {
    type: "hero",
    displayName: "Hero",
    category: "basic",
    getDefaultData: variant =>
      DEFAULT_HERO_MAP[variant as keyof typeof DEFAULT_HERO_MAP] ||
      DEFAULT_HERO_MAP["hero-1"],
    component: HeroComponent,
  },
  about: {
    type: "about",
    displayName: "About Us",
    category: "content",
    getDefaultData: variant =>
      DEFAULT_ABOUT_MAP[variant as keyof typeof DEFAULT_ABOUT_MAP] ||
      DEFAULT_ABOUT_MAP["about-1"],
    component: AboutUsComponent,
  },
  blog: {
    type: "blog",
    displayName: "Blog",
    category: "dynamic",
    getDefaultData: variant =>
      DEFAULT_BLOG_MAP[variant as keyof typeof DEFAULT_BLOG_MAP] ||
      DEFAULT_BLOG_MAP["blog-1"],
    component: BlogComponent,
  },
  products: {
    type: "products",
    displayName: "Products",
    category: "ecommerce",
    getDefaultData: variant =>
      DEFAULT_PRODUCTS_MAP[variant as keyof typeof DEFAULT_PRODUCTS_MAP] ||
      DEFAULT_PRODUCTS_MAP["product-1"],
    component: ProductsComponent,
  },
  category: {
    type: "category",
    displayName: "Category",
    category: "ecommerce",
    getDefaultData: variant =>
      DEFAULT_CATEGORY_MAP[variant as keyof typeof DEFAULT_CATEGORY_MAP] ||
      DEFAULT_CATEGORY_MAP["category-1"],
    component: CategoryComponent,
  },
  subcategory: {
    type: "subcategory",
    displayName: "SubCategory",
    category: "ecommerce",
    getDefaultData: variant =>
      DEFAULT_SUB_CATEGORY_MAP[
        variant as keyof typeof DEFAULT_SUB_CATEGORY_MAP
      ] || DEFAULT_SUB_CATEGORY_MAP["subcategory-1"],
    component: SubCategoryComponent,
  },
  contact: {
    type: "contact",
    displayName: "Contact",
    category: "basic",
    getDefaultData: variant =>
      DEFAULT_CONTACT_MAP[variant as keyof typeof DEFAULT_CONTACT_MAP] ||
      DEFAULT_CONTACT_MAP["contact-1"],
    component: ContactComponent,
  },
  appointment: {
    type: "appointment",
    displayName: "Appointment",
    category: "dynamic",
    getDefaultData: variant =>
      DEFAULT_APPOINTMENT_MAP[
        variant as keyof typeof DEFAULT_APPOINTMENT_MAP
      ] || DEFAULT_APPOINTMENT_MAP["appointment-1"],
    component: AppointmentComponent,
  },
  team: {
    type: "team",
    displayName: "Team",
    category: "content",
    getDefaultData: variant =>
      DEFAULT_TEAM_MAP[variant as keyof typeof DEFAULT_TEAM_MAP] ||
      DEFAULT_TEAM_MAP["team-1"],
    component: TeamComponent,
  },
  testimonials: {
    type: "testimonials",
    displayName: "Testimonials",
    category: "content",
    getDefaultData: variant =>
      DEFAULT_TESTIMONIALS_MAP[
        variant as keyof typeof DEFAULT_TESTIMONIALS_MAP
      ] || DEFAULT_TESTIMONIALS_MAP["testimonial-1"],
    component: TestimonialsComponent,
  },
  portfolio: {
    type: "portfolio",
    displayName: "Portfolio",
    category: "dynamic",
    getDefaultData: variant =>
      DEFAULT_PORTFOLIO_MAP[variant as keyof typeof DEFAULT_PORTFOLIO_MAP] ||
      DEFAULT_PORTFOLIO_MAP["portfolio-1"],
    component: PortfolioComponent,
  },
  faq: {
    type: "faq",
    displayName: "FAQ",
    category: "content",
    getDefaultData: variant =>
      DEFAULT_FAQ_MAP[variant as keyof typeof DEFAULT_FAQ_MAP] ||
      DEFAULT_FAQ_MAP["faq-1"],
    component: FAQComponent,
  },
  cta: {
    type: "cta",
    displayName: "CTA",
    category: "basic",
    getDefaultData: variant =>
      DEFAULT_CTA_MAP[variant as keyof typeof DEFAULT_CTA_MAP] ||
      DEFAULT_CTA_MAP["cta-1"],
    component: CTAComponent,
  },
  gallery: {
    type: "gallery",
    displayName: "Gallery",
    category: "content",
    getDefaultData: variant =>
      DEFAULT_GALLERY_MAP[variant as keyof typeof DEFAULT_GALLERY_MAP] ||
      DEFAULT_GALLERY_MAP["gallery-1"],
    component: GalleryComponent,
  },
  newsletter: {
    type: "newsletter",
    displayName: "Newsletter",
    category: "basic",
    getDefaultData: variant =>
      DEFAULT_NEWSLETTER_MAP[variant as keyof typeof DEFAULT_NEWSLETTER_MAP] ||
      DEFAULT_NEWSLETTER_MAP["newsletter-1"],
    component: NewsletterComponent,
  },
  banner: {
    type: "banner",
    displayName: "Banner",
    category: "basic",
    getDefaultData: variant =>
      DEFAULT_BANNER_MAP[variant as keyof typeof DEFAULT_BANNER_MAP] ||
      DEFAULT_BANNER_MAP["banner-1"],
    component: BannerComponent,
  },
  services: {
    type: "services",
    displayName: "Services",
    category: "dynamic",
    getDefaultData: variant =>
      DEFAULT_SERVICES_MAP[variant as keyof typeof DEFAULT_SERVICES_MAP] ||
      DEFAULT_SERVICES_MAP["services-1"],
    component: ServicesComponent,
  },
  videos: {
    type: "videos",
    displayName: "Videos",
    category: "content",
    getDefaultData: variant =>
      DEFAULT_VIDEOS_MAP[variant as keyof typeof DEFAULT_VIDEOS_MAP] ||
      DEFAULT_VIDEOS_MAP["videos-1"],
    component: VideosComponent,
  },
  policies: {
    type: "policies",
    displayName: "Policies",
    category: "legal",
    getDefaultData: variant =>
      DEFAULT_POLICIES_MAP[variant as keyof typeof DEFAULT_POLICIES_MAP] ||
      DEFAULT_POLICIES_MAP["privacy-policy"],
    component: PolicyComponent,
  },
  text_editor: {
    type: "text_editor",
    displayName: "Text Editor",
    category: "content",
    getDefaultData: () => DEFAULT_TEXT_EDITOR_MAP["default"],
    component: TextEditorComponent,
  },
  pricing: {
    type: "pricing",
    displayName: "Pricing",
    category: "dynamic",
    getDefaultData: variant =>
      DEFAULT_PRICING_MAP[variant as keyof typeof DEFAULT_PRICING_MAP] ||
      DEFAULT_PRICING_MAP["pricing-1"],
    component: PricingComponent,
  },
  our_clients: {
    type: "our_clients",
    displayName: "Our Clients",
    category: "content",
    getDefaultData: variant =>
      DEFAULT_OUR_CLIENTS_MAP[
        variant as keyof typeof DEFAULT_OUR_CLIENTS_MAP
      ] || DEFAULT_OUR_CLIENTS_MAP["our-clients-1"],
    component: OurClientsComponent,
  },
  others: {
    type: "others",
    displayName: "Others",
    category: "basic",
    getDefaultData: variant =>
      DEFAULT_OTHERS_MAP[variant as keyof typeof DEFAULT_OTHERS_MAP] ||
      DEFAULT_OTHERS_MAP["others-1"],
    component: OthersComponent,
  },
};
