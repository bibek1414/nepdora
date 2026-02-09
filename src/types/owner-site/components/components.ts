import { HeroData } from "./hero";
import { AboutUsData } from "./about";
import { BlogData } from "./blog";
import { ProductsData } from "./products";
import { CategoryData } from "./category";
import { SubCategoryData } from "./sub-category";
import { ContactData } from "./contact";
import { TeamData } from "./team";
import { AppointmentData } from "./appointment";
import { TestimonialsData } from "./testimonials";
import { FAQData } from "./faq";
import { PortfolioData } from "./portfolio";
import { BannerData } from "./banner";
import { NewsletterData } from "./newsletter";
import { VideosData } from "./videos";
import { ServicesData } from "./services";
import { GalleryData } from "./gallery";
import { PolicyData } from "./policies";
import { TextEditorData } from "./text-editor";
import { CTAData } from "./cta";
import { PricingData } from "./pricing";
import { OurClientsData } from "./our-client";
import { OthersData } from "./others";

export interface ComponentTypeMap {
  hero: HeroData;
  about: AboutUsData;
  blog: BlogData;
  products: ProductsData;
  category: CategoryData;
  subcategory: SubCategoryData;
  contact: ContactData;
  appointment: AppointmentData;
  team: TeamData;
  testimonials: TestimonialsData;
  portfolio: PortfolioData;
  faq: FAQData;
  cta: CTAData;
  gallery: GalleryData;
  newsletter: NewsletterData;
  banner: BannerData;
  services: ServicesData;
  videos: VideosData;
  policies: PolicyData;
  text_editor: TextEditorData;
  pricing: PricingData;
  our_clients: OurClientsData;
  others: OthersData;
}

// Generic interfaces
export interface BaseComponentData<
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
> {
  component_id?: string;
  component_type: T;
  data: ComponentTypeMap[T];
  order?: number;
}

export interface ComponentResponse<
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
> {
  id: string | number;
  component_id: string;
  component_type: T;
  data: ComponentTypeMap[T];
  order: number;
  page?: number;
}

export interface CreateComponentRequest<
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
> {
  component_id?: string;
  component_type: T;
  data: ComponentTypeMap[T];
  order?: number;
}

export interface UpdateComponentRequest<
  T extends keyof ComponentTypeMap = keyof ComponentTypeMap,
> {
  data: Partial<ComponentTypeMap[T]>;
  order?: number;
}

export interface ApiListResponse<T> {
  data?: T[];
  components?: T[];
  success?: boolean;
  message?: string;
}

export type ComponentsApiResponse<T extends keyof ComponentTypeMap> =
  | ComponentResponse<T>[]
  | ApiListResponse<ComponentResponse<T>>;
