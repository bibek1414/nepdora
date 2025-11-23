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
    | "hero-9"
    | "hero-10"
    | "hero-11";

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
// Default hero data configurations for different templates
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
  backgroundColor: "#3B82F6",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=2070&auto=format&fit=crop",
  showOverlay: true,
  overlayOpacity: 0.5,
  showSlider: true,
  sliderImages: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1760694533407-6a10714f3b65?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 1",
    },
    {
      id: "2",
      url: "https://plus.unsplash.com/premium_photo-1710849581742-f2151607c745?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 2",
    },
    {
      id: "3",
      url: "https://plus.unsplash.com/premium_photo-1763466939715-c2efc8499f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 2",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1762776345918-dbc968a5fcb0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 3",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1756134904044-1cf7868cb9de?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 4",
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1757137910091-1cf071030691?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 3",
    },

    {
      id: "7",
      url: "https://images.unsplash.com/photo-1762112800040-b0d01696cb92?q=80&w=681&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 4",
    },
    {
      id: "7",
      url: "https://images.unsplash.com/photo-1757137910091-1cf071030691?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 3",
    },
  ],
  showImage: true,
  imageUrl:
    "https://images.unsplash.com/photo-1706708709028-9ed38f34115f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  imageAlt: "Hero image",
  template: "hero-1",
};

// Hero template-specific content
export const heroTemplateContent: Record<string, Partial<HeroData>> = {
  "hero-1": {
    title: "Transform Your Digital Presence",
    subtitle: "Modern Solutions for Growing Businesses",
    description:
      "Empower your brand with cutting-edge technology and innovative design that drives real results.",
    buttons: [
      { id: "1", text: "Start Free Trial", variant: "primary", href: "#" },
      { id: "2", text: "View Demo", variant: "secondary", href: "#" },
    ],
  },
  "hero-2": {
    title: "Discover Premium Quality Products",
    subtitle: "Curated Collections for Every Style",
    description:
      "Shop our exclusive range of handpicked items designed to elevate your lifestyle and exceed expectations.",
    buttons: [
      { id: "1", text: "Shop Now", variant: "primary", href: "#" },
      { id: "2", text: "View Catalog", variant: "outline", href: "#" },
    ],
  },
  "hero-3": {
    title: "Unlock Your Financial Freedom",
    subtitle: "Smart Banking for Modern Life",
    description:
      "Experience seamless banking with zero fees, instant transfers, and rewards that actually matter.",
    buttons: [
      { id: "1", text: "Open Account", variant: "primary", href: "#" },
      { id: "2", text: "Learn More", variant: "secondary", href: "#" },
    ],
  },
  "hero-4": {
    title: "Learn from Industry Experts",
    subtitle: "Master New Skills Online",
    description:
      "Access thousands of courses taught by professionals. Start learning today and advance your career.",
    buttons: [
      { id: "1", text: "Browse Courses", variant: "primary", href: "#" },
      { id: "2", text: "Free Preview", variant: "outline", href: "#" },
    ],
  },
  "hero-5": {
    title: "Your Dream Home Awaits",
    subtitle: "Find the Perfect Property",
    description:
      "Explore premium real estate listings with virtual tours, expert guidance, and transparent pricing.",
    buttons: [
      { id: "1", text: "Search Properties", variant: "primary", href: "#" },
      { id: "2", text: "Talk to Agent", variant: "secondary", href: "#" },
    ],
  },
  "hero-6": {
    title: "Elevate Your Fitness Journey",
    subtitle: "Personal Training Redefined",
    description:
      "Get customized workout plans, nutrition guidance, and 24/7 support from certified trainers.",
    buttons: [
      { id: "1", text: "Start Training", variant: "primary", href: "#" },
      { id: "2", text: "See Plans", variant: "outline", href: "#" },
    ],
  },
  "hero-7": {
    title: "Travel the World Your Way",
    subtitle: "Unforgettable Adventures Begin Here",
    description:
      "Book exclusive travel experiences, from luxury resorts to authentic local stays worldwide.",
    buttons: [
      { id: "1", text: "Plan Trip", variant: "primary", href: "#" },
      {
        id: "2",
        text: "Explore Destinations",
        variant: "secondary",
        href: "#",
      },
    ],
  },
  "hero-8": {
    title: "Taste Perfection Delivered",
    subtitle: "Artisan Food & Beverages",
    description:
      "Savor gourmet meals crafted by award-winning chefs, delivered fresh to your doorstep.",
    buttons: [
      { id: "1", text: "Order Now", variant: "primary", href: "#" },
      { id: "2", text: "View Menu", variant: "outline", href: "#" },
    ],
  },
  "hero-9": {
    title: "Innovation Meets Elegance",
    subtitle: "Next-Gen Technology Solutions",
    description:
      "Experience the future with AI-powered tools designed to simplify complex business operations.",
    buttons: [
      { id: "1", text: "Get Started", variant: "primary", href: "#" },
      { id: "2", text: "Watch Demo", variant: "secondary", href: "#" },
    ],
  },
  "hero-10": {
    title: "Create Lasting Memories",
    subtitle: "Professional Event Planning",
    description:
      "From weddings to corporate events, we transform your vision into extraordinary celebrations.",
    buttons: [
      { id: "1", text: "Book Consultation", variant: "primary", href: "#" },
      { id: "2", text: "View Portfolio", variant: "outline", href: "#" },
    ],
  },
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
    | "hero-7"
    | "hero-10"
    | "hero-11";
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
      "https://images.unsplash.com/photo-1762430259780-28ffac74916c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  "hero-10": {
    template: "hero-10",
    backgroundType: "image",
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1542382257-80dedb725088?q=80&w=2070&auto=format&fit=crop",
    showOverlay: true,
    overlayOpacity: 0.6,
    showSlider: true,
  },
  "hero-11": {
    template: "hero-11",
    backgroundType: "color",
    backgroundColor: "#FFFFFF",
    showOverlay: false,
  },
};
