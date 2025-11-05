import { HeroData } from "./hero";
import { AboutUsData } from "./about";
import { BlogData } from "./blog";
import { ProductsData } from "./products";
import { CategoryData } from "./category";
import { SubCategoryData } from "./sub-category";
import { ContactData } from "./contact";
import { TeamData } from "./team";
import { TestimonialsData } from "./testimonials";
import { FAQData } from "./faq";
import { PortfolioData } from "./portfolio";
import { BannerData } from "./banner";
import { NewsletterData } from "./newsletter";
import { YouTubeData } from "./youtube";
import { ServicesData } from "./services";
import { GalleryData } from "./gallery";
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
  | FAQData
  | PortfolioData
  | BannerData
  | NewsletterData
  | YouTubeData
  | ServicesData
  | GalleryData
  | TestimonialsData;

// Component type mapping for better type safety
export interface ComponentTypeMap {
  hero: HeroData;
  about: AboutUsData;
  blog: BlogData;
  products: ProductsData;
  category: CategoryData;
  subcategory: SubCategoryData;
  contact: ContactData;
  team: TeamData;
  testimonials: TestimonialsData;
  portfolio: PortfolioData;
  faq: FAQData;
  gallery: GalleryData;
  newsletter: NewsletterData;
  banner: BannerData;
  services: ServicesData;
  youtube: YouTubeData;
}

// Generic interfaces that replace the any types
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
export const isGalleryComponent = (
  component: ComponentResponse
): component is ComponentResponse<"gallery"> =>
  component.component_type === "gallery";

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

export const isAboutComponent = (
  component: ComponentResponse
): component is ComponentResponse<"about"> =>
  component.component_type === "about";

export const isBlogComponent = (
  component: ComponentResponse
): component is ComponentResponse<"blog"> =>
  component.component_type === "blog";

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

export const isYouTubeComponent = (
  component: ComponentResponse
): component is ComponentResponse<"youtube"> =>
  component.component_type === "youtube";
export interface ApiListResponse<T> {
  data?: T[];
  components?: T[];
  success?: boolean;
  message?: string;
}

export type ComponentsApiResponse<T extends keyof ComponentTypeMap> =
  | ComponentResponse<T>[]
  | ApiListResponse<ComponentResponse<T>>;
