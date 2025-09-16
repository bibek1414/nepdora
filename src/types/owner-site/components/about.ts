export interface AboutUsStat {
  id: string;
  value: string;
  label: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
}
export interface AboutUs1Data {
  template: "about-1";
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  layout: "image-left" | "image-right";
  stats: AboutUsStat[];
}

export interface AboutUs3Data {
  template: "about-3";
  title: string;
  subtitle: string;
  description: string;
  features: Array<{
    id: string;
    text: string;
  }>;
  stats: {
    startYear: string;
    completeYear: string;
    unitsAvailable: string;
  };
}
export interface AboutUs4Data {
  template: "about-4";
  title: string;
  subtitle: string;
  subSubtitle: string; // New field
  imageUrl: string;
  imageAlt: string;
}

export type AboutUsData = AboutUs1Data | AboutUs3Data | AboutUs4Data;

export interface AboutUsComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "about";
  data: AboutUsData;
  order: number;
  page?: number;
}

// API response interface for a single component
export interface ApiAboutUsComponentResponse {
  id: number;
  component_id: string;
  component_type: "about";
  data: AboutUsData;
  order: number;
  page: number;
}

// Request interfaces
export interface CreateAboutUsRequest {
  component_id?: string;
  component_type: "about";
  data: AboutUsData;
  order?: number;
}

export interface UpdateAboutUsRequest {
  component_id?: string;
  component_type?: "about";
  data: Partial<AboutUs1Data> | Partial<AboutUs3Data> | Partial<AboutUs4Data>;
  order?: number;
}

// Response interfaces for mutations
export interface CreateAboutUsResponse {
  success: boolean;
  message: string;
  data: AboutUsComponentData;
}

export interface UpdateAboutUsResponse {
  success: boolean;
  message: string;
  data: AboutUsComponentData;
}

export interface DeleteAboutUsResponse {
  success: boolean;
  message: string;
}

// Default data for creating a new component
export const defaultAboutUs1Data: AboutUs1Data = {
  template: "about-1",
  title: "About Our Company",
  subtitle: "Driving Innovation and Excellence Since 2010",
  description:
    "We are a passionate team dedicated to creating cutting-edge solutions that empower businesses and individuals. Our journey began with a simple idea: to make technology accessible and impactful.",
  imageUrl:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",
  imageAlt: "A team of professionals collaborating in a modern office.",
  layout: "image-right",
  stats: [
    { id: "1", value: "10+", label: "Years Experience" },
    { id: "2", value: "500+", label: "Projects Completed" },
    { id: "3", value: "99%", label: "Client Satisfaction" },
  ],
};

export const defaultAboutUs3Data: AboutUs3Data = {
  template: "about-3",
  title: "Luxury Living",
  subtitle: "Redefined",
  description:
    "Experience the pinnacle of modern architecture and sophisticated living. Simcoe Garden represents the future of urban residential design.",
  features: [
    { id: "1", text: "Premium finishes throughout" },
    { id: "2", text: "Smart home technology" },
    { id: "3", text: "Sustainable design principles" },
  ],
  stats: {
    startYear: "2024",
    completeYear: "2026",
    unitsAvailable: "50+ UNITS",
  },
};
export const defaultAboutUs4Data: AboutUs4Data = {
  template: "about-4",
  title: "Our Vision",
  subtitle: "Simple, Elegant, Effective.",
  subSubtitle: "Crafting solutions that make a difference.",
  imageUrl:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1770&auto=format&fit=crop",
  imageAlt: "A minimalist office setting with a computer and plants.",
};
