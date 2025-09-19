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
  template: "hero-1" | "hero-2" | "hero-3" | "hero-4" | "hero-5";
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

export const defaultHero3Data: HeroData = {
  title: "All in one App finance for your business",
  subtitle: "New Multi-currency account",
  description:
    "Keep your business account needs safely organized under one roof. Manage money quickly, easily & efficiently.",
  textColor: "#000000",
  buttons: [
    { id: "1", text: "Try for Free", variant: "primary", href: "#" },
    { id: "2", text: "Preview", variant: "outline", href: "#" },
  ],
  layout: "text-left",
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
  gradientFrom: "#f8fafc",
  gradientTo: "#e2e8f0",
  backgroundImageUrl: "",
  showOverlay: false,
  overlayColor: "#000000",
  overlayOpacity: 0.3,
  showSlider: false,
  sliderImages: [],
  showImage: true,
  imageUrl:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  imageAlt: "Business finance illustration",
  template: "hero-3",
  balanceLabel: "🇺🇸 My current balance",
  balanceAmount: "$90,438.40",
  showBalanceBadge: true,
};

export const defaultHero3KatachiData: HeroData = {
  title: "Design furniture for",
  subtitle: "Premium Collection",
  description: "spaces that breathe.",
  textColor: "#FFFFFF",
  buttons: [
    { id: "1", text: "Explore Collection", variant: "primary", href: "#" },
    { id: "2", text: "Learn More", variant: "outline", href: "#" },
  ],
  layout: "text-center",
  backgroundType: "image",
  backgroundColor: "#000000",
  gradientFrom: "#1e3a8a",
  gradientTo: "#3b82f6",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2070&auto=format&fit=crop",
  showOverlay: true,
  overlayColor: "#000000",
  overlayOpacity: 0.2,
  showSlider: false,
  sliderImages: [],
  showImage: true,
  imageUrl: "",
  imageAlt: "Elegant interior with modern furniture design",
  template: "hero-4",
  balanceLabel: "",
  balanceAmount: "",
  showBalanceBadge: false,
};

export const defaultHero5Data: HeroData = {
  title: "Customize without page_sizes with Avora",
  subtitle: "A platform built for full-stack functionality",
  description:
    "Accelerate development cycle to launch apps in days, not months.",
  textColor: "#000000",
  buttons: [{ id: "1", text: "Try Demo Now", variant: "outline", href: "#" }],
  layout: "text-left",
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
  gradientFrom: "#f8fafc",
  gradientTo: "#e2e8f0",
  backgroundImageUrl: "",
  showOverlay: false,
  overlayColor: "#000000",
  overlayOpacity: 0.3,
  showSlider: false,
  sliderImages: [],
  showImage: true,
  imageUrl:
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  imageAlt: "Developer working",
  template: "hero-5",
  // Hero 5 specific fields
  badges: [
    { id: "1", text: "Build Products", variant: "default" },
    { id: "2", text: "Faster Workflow", variant: "secondary" },
  ],
  overlayTitle: "Convert your innovative ideas into powerful products",
  secondaryImageUrl:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  secondaryImageAlt: "Platform stack",
  statsNumber: "598+",
  statsLabel: "Apps built on the most secure platform",
};

// Function to get default data based on template
export const getDefaultHeroDataByTemplate = (
  template: "hero-1" | "hero-2" | "hero-3" | "hero-4" | "hero-5"
): HeroData => {
  switch (template) {
    case "hero-5":
      return defaultHero5Data;
    case "hero-4":
      return defaultHero3KatachiData;
    case "hero-3":
      return defaultHero3Data;
    case "hero-2":
      return {
        ...defaultHeroData,
        template: "hero-2",
        layout: "text-center",
        backgroundType: "gradient",
      };
    default:
      return defaultHeroData;
  }
};
