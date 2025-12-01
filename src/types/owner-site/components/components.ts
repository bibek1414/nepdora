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

// Union type for all component data types
export type ComponentData =
  | HeroData
  | AboutUsData
  | BlogData
  | ProductsData
  | CategoryData
  | SubCategoryData
  | TeamData
  | ContactData
  | AppointmentData
  | FAQData
  | TextEditorData
  | PortfolioData
  | BannerData
  | CTAData
  | NewsletterData
  | VideosData
  | ServicesData
  | GalleryData
  | PolicyData
  | TestimonialsData
  | PricingData
  | OthersData
  | OurClientsData;

// Component type mapping for better type safety
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

export interface ApiResponse<T = ComponentData> {
  success?: boolean;
  message?: string;
  data?: T;
}

// Type guards for runtime type checking
export const isHeroComponent = (
  component: ComponentResponse
): component is ComponentResponse<"hero"> =>
  component.component_type === "hero";

export const isCTAComponent = (
  component: ComponentResponse
): component is ComponentResponse<"cta"> => component.component_type === "cta";

export const isAboutComponent = (
  component: ComponentResponse
): component is ComponentResponse<"about"> =>
  component.component_type === "about";

export const isOthersComponent = (
  component: ComponentResponse
): component is ComponentResponse<"others"> =>
  component.component_type === "others";

export const isBlogComponent = (
  component: ComponentResponse
): component is ComponentResponse<"blog"> =>
  component.component_type === "blog";

export const isPolicyComponent = (
  component: ComponentResponse
): component is ComponentResponse<"policies"> =>
  component.component_type === "policies";

export const isTextEditorComponent = (
  component: ComponentResponse
): component is ComponentResponse<"text_editor"> =>
  component.component_type === "text_editor";

export const isProductsComponent = (
  component: ComponentResponse
): component is ComponentResponse<"products"> =>
  component.component_type === "products";

export const isCategoryComponent = (
  component: ComponentResponse
): component is ComponentResponse<"category"> =>
  component.component_type === "category";

export const isSubCategoryComponent = (
  component: ComponentResponse
): component is ComponentResponse<"subcategory"> =>
  component.component_type === "subcategory";

export const isContactComponent = (
  component: ComponentResponse
): component is ComponentResponse<"contact"> =>
  component.component_type === "contact";

export const isAppointmentComponent = (
  component: ComponentResponse
): component is ComponentResponse<"appointment"> =>
  component.component_type === "appointment";

export const isTeamComponent = (
  component: ComponentResponse
): component is ComponentResponse<"team"> =>
  component.component_type === "team";

export const isTestimonialsComponent = (
  component: ComponentResponse
): component is ComponentResponse<"testimonials"> =>
  component.component_type === "testimonials";

export const isFAQComponent = (
  component: ComponentResponse
): component is ComponentResponse<"faq"> => component.component_type === "faq";

export const isPortfolioComponent = (
  component: ComponentResponse
): component is ComponentResponse<"portfolio"> =>
  component.component_type === "portfolio";

export const isBannerComponent = (
  component: ComponentResponse
): component is ComponentResponse<"banner"> =>
  component.component_type === "banner";

export const isNewsletterComponent = (
  component: ComponentResponse
): component is ComponentResponse<"newsletter"> =>
  component.component_type === "newsletter";

export const isServicesComponent = (
  component: ComponentResponse
): component is ComponentResponse<"services"> =>
  component.component_type === "services";

export const isVideosComponent = (
  component: ComponentResponse
): component is ComponentResponse<"videos"> =>
  component.component_type === "videos";

export const isGalleryComponent = (
  component: ComponentResponse
): component is ComponentResponse<"gallery"> =>
  component.component_type === "gallery";

export const isPricingComponent = (
  component: ComponentResponse
): component is ComponentResponse<"pricing"> =>
  component.component_type === "pricing";

export const isOurClientsComponent = (
  component: ComponentResponse
): component is ComponentResponse<"our_clients"> =>
  component.component_type === "our_clients";

export interface ApiListResponse<T> {
  data?: T[];
  components?: T[];
  success?: boolean;
  message?: string;
}

export type ComponentsApiResponse<T extends keyof ComponentTypeMap> =
  | ComponentResponse<T>[]
  | ApiListResponse<ComponentResponse<T>>;
