import { HeroData } from "./hero";
import { AboutUsData } from "./about";
import { BlogDisplayData } from "./blog";
import { ProductsData } from "./products";
import { ContactData } from "./contact";
import { TeamData } from "./team";

// Union type for all component data types
export type ComponentData =
  | HeroData
  | AboutUsData
  | BlogDisplayData
  | ProductsData
  | TeamData
  | ContactData;

// Component type mapping for better type safety
export interface ComponentTypeMap {
  hero: HeroData;
  about: AboutUsData;
  blog: BlogDisplayData;
  products: ProductsData;
  contact: ContactData;
  team: TeamData;
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

export const isContactComponent = (
  component: ComponentResponse
): component is ComponentResponse<"contact"> =>
  component.component_type === "contact";

export interface ApiListResponse<T> {
  data?: T[];
  components?: T[];
  success?: boolean;
  message?: string;
}

export type ComponentsApiResponse<T extends keyof ComponentTypeMap> =
  | ComponentResponse<T>[]
  | ApiListResponse<ComponentResponse<T>>;
