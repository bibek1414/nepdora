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

export interface HeroBadge {
  id: string;
  text: string;
  variant?: "default" | "secondary" | "outline";
}

// Simplified HeroData to match theme structure
export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  buttons: HeroButton[];
  layout: "text-left" | "text-center" | "text-right";

  // Simplified background options - only essential fields
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string; // Single background color
  backgroundImageUrl?: string;
  showOverlay?: boolean;
  overlayOpacity?: number;

  // Image settings
  showSlider?: boolean;
  sliderImages?: HeroSliderImage[];
  showImage?: boolean;
  imageUrl?: string;
  imageAlt?: string;

  // Template selection
  template:
    | "hero-1"
    | "hero-2"
    | "hero-3"
    | "hero-4"
    | "hero-5"
    | "hero-6"
    | "hero-7"
    | "hero-8"
    | "hero-9";

  // Hero 3 specific fields
  balanceLabel?: string;
  balanceAmount?: string;
  showBalanceBadge?: boolean;

  // Hero 5 specific fields
  badges?: HeroBadge[];
  overlayTitle?: string;
  secondaryImageUrl?: string;
  secondaryImageAlt?: string;
  statsNumber?: string;
  statsLabel?: string;
  collections?: HeroCollection[];
  features?: HeroFeature[];
  trustIndicators?: HeroTrustIndicators;
  leftImageUrl?: string;
  leftImageAlt?: string;
  rightImageUrl?: string;
  rightImageAlt?: string;
  mobileImageUrl?: string;
  mobileImageAlt?: string;
}
export interface HeroFeature {
  id: string;
  text: string;
}

export interface HeroTrustIndicators {
  rating: string;
  stars: string;
  features: string[];
  customerText: string;
}
// Updated interface to match API response structure
export interface HeroComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "hero";
  data: HeroData;
  type?: "hero";
  order: number;
  page?: number;
}
export interface HeroCollection {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonHref: string;
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

// Simplified default hero data
export const defaultHeroData: HeroData = {
  title: "Welcome to Our Platform",
  subtitle: "Build Something Great",
  description:
    "Create beautiful, responsive websites with our intuitive drag-and-drop builder. No coding required.",
  buttons: [
    { id: "1", text: "Get Started", variant: "primary", href: "#" },
    { id: "2", text: "Learn More", variant: "secondary", href: "#" },
  ],
  layout: "text-center",
  backgroundType: "color",
  backgroundColor: "#3B82F6", // Use primary color from theme
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=2070&auto=format&fit=crop",
  showOverlay: true,
  overlayOpacity: 0.5,
  showSlider: true,
  sliderImages: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1753010835776-3fd4bf38ef3c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    "https://plus.unsplash.com/premium_photo-1686944233139-b3f34be2ac2f?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  imageAlt: "Hero image",
  template: "hero-1",
};

// Simplified template configurations
export interface HeroTemplateConfig {
  template:
    | "hero-1"
    | "hero-2"
    | "hero-3"
    | "hero-4"
    | "hero-5"
    | "hero-6"
    | "hero-8"
    | "hero-9"
    | "hero-7";
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showOverlay?: boolean;
  showSlider?: boolean;
  overlayOpacity?: number;
}

// Simplified template configs - colors will come from theme
export const heroTemplateConfigs: Record<string, HeroTemplateConfig> = {
  "hero-1": {
    template: "hero-1",
    backgroundType: "color",
    backgroundColor: "#3B82F6",
  },
  "hero-2": {
    template: "hero-2",
    backgroundType: "image",
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=2070&auto=format&fit=crop",
    showOverlay: true,
    overlayOpacity: 0.6,
    showSlider: true,
  },
  "hero-3": {
    template: "hero-3",
    backgroundType: "color",
  },
  "hero-4": {
    template: "hero-4",
    backgroundType: "color",
    backgroundColor: "#F59E0B",
  },
  "hero-5": {
    template: "hero-5",
    backgroundType: "image",
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1559827291-72ee739d0d95?q=80&w=1974&auto=format&fit=crop",
    showOverlay: true,
    overlayOpacity: 0.4,
  },
  "hero-6": {
    template: "hero-6",
    backgroundType: "image",
    showSlider: true,
    showOverlay: true,
    overlayOpacity: 0.5,
  },
  "hero-7": {
    template: "hero-7",
    backgroundType: "color",
    showOverlay: true,
    overlayOpacity: 0.1,
  },
  "hero-8": {
    template: "hero-8",
    backgroundType: "color",
    backgroundColor: "#FDFAF6",
    showOverlay: true,
  },
  "hero-9": {
    template: "hero-9",
    backgroundType: "gradient",
    backgroundColor: "#F9FAFB",
    showOverlay: false,
  },
};
