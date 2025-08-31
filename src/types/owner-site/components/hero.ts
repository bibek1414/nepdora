export interface HeroButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
}

export interface HeroSliderImage {
  id: string;
  url: string;
  alt: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  textColor: string;
  buttons: HeroButton[];
  layout: "text-left" | "text-center" | "text-right";
  backgroundType: "color" | "gradient" | "image";
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImageUrl: string;
  showOverlay: boolean;
  overlayColor: string;
  overlayOpacity: number;
  showSlider: boolean;
  sliderImages: HeroSliderImage[];
  showImage: boolean;
  imageUrl: string;
  imageAlt: string;
  template: "hero-1" | "hero-2";
}

// Updated interface to match API response structure
export interface HeroComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "hero";
  data: HeroData;
  type?: "hero"; // Keep for backward compatibility
  order: number;
  page?: number;
}

// API response interface that matches your actual data structure
export interface ApiHeroComponentResponse {
  id: number;
  component_id: string;
  component_type: "hero";
  data: HeroData;
  order: number;
  page: number;
}

export interface CreateHeroRequest {
  component_id?: string;
  component_type: "hero";
  data: HeroData;
  order?: number;
}

export interface UpdateHeroRequest {
  component_id?: string;
  component_type?: "hero";
  data: Partial<HeroData>;
  order?: number;
}

export interface CreateHeroResponse {
  success: boolean;
  message: string;
  data: HeroComponentData;
}

export interface UpdateHeroResponse {
  success: boolean;
  message: string;
  data: HeroComponentData;
}

export interface DeleteHeroResponse {
  success: boolean;
  message: string;
}

// Updated response interface to handle different response formats
export interface GetPageComponentsResponse {
  success?: boolean;
  message?: string;
  data?: ApiHeroComponentResponse[] | HeroComponentData[]; // Handle both formats
  components?: ApiHeroComponentResponse[] | HeroComponentData[]; // Keep for backward compatibility
}

export const defaultHeroData: HeroData = {
  title: "Welcome to Our Platform",
  subtitle: "Build Something Great",
  description:
    "Create beautiful, responsive websites with our intuitive drag-and-drop builder. No coding required.",
  textColor: "#FFFFFF",
  buttons: [
    { id: "1", text: "Get Started", variant: "primary", href: "#" },
    { id: "2", text: "Learn More", variant: "primary", href: "#" },
  ],
  layout: "text-center",
  backgroundType: "gradient",
  backgroundColor: "#1e3a8a",
  gradientFrom: "#1e3a8a",
  gradientTo: "#3b82f6",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=2070&auto=format&fit=crop",
  showOverlay: true,
  overlayColor: "#000000",
  overlayOpacity: 0.5,
  showSlider: true,
  sliderImages: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1559827291-72ee739d0d95?q=80&w=1974&auto=format&fit=crop",
      alt: "Hero image 1",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop",
      alt: "Hero image 2",
    },
  ],
  showImage: true,
  imageUrl:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
  imageAlt: "Hero image",
  template: "hero-1",
};
