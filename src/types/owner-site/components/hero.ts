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

export interface HeroCountry {
  id: string;
  name: string;
  flagColor: string;
  features: string[];
}

// Template-specific interfaces
export interface HeroTemplate1Data {
  template: "hero-1";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  layout: "text-left" | "text-center" | "text-right";
  showImage?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  showOverlay?: boolean;
}

export interface HeroTemplate2Data {
  template: "hero-2";
  title: string;
  subtitle: string;
  description?: string;
  buttons: HeroButton[];
  layout: "text-left" | "text-center" | "text-right";
  showSlider?: boolean;
  sliderImages?: HeroSliderImage[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showOverlay?: boolean;
  overlayOpacity?: number;
  imageAlt?: string;
}

export interface HeroTemplate3Data {
  template: "hero-3";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  showImage?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  backgroundImageUrl?: string;
  statsNumber?: string;
  statsLabel?: string;
}

export interface HeroTemplate4Data {
  template: "hero-4";
  title: string;
  subtitle: string;
  description: string;
  buttons: HeroButton[];
  showImage?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  statsNumber?: string;
  statsLabel?: string;
}

export interface HeroTemplate5Data {
  template: "hero-5";
  title: string;
  subtitle?: string;
  description: string;
  buttons: HeroButton[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showOverlay?: boolean;
  overlayOpacity?: number;
  imageAlt?: string;
}

export interface HeroTemplate6Data {
  template: "hero-6";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  sliderImages?: HeroSliderImage[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showOverlay?: boolean;
  overlayOpacity?: number;
}

export interface HeroTemplate7Data {
  template: "hero-7";
  title?: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  collections: HeroCollection[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}
export interface HeroTemplate8Data {
  template: "hero-8";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  features?: HeroFeature[];
  trustIndicators?: HeroTrustIndicators;
  leftImageUrl?: string;
  leftImageAlt?: string;
  rightImageUrl?: string;
  rightImageAlt?: string;
  mobileImageUrl?: string;
  mobileImageAlt?: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface HeroTemplate9Data {
  template: "hero-9";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  sliderImages?: HeroSliderImage[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface HeroTemplate10Data {
  template: "hero-10";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  sliderImages?: HeroSliderImage[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface HeroTemplate11Data {
  template: "hero-11";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  imageUrl?: string;
  imageAlt?: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface HeroTemplate12Data {
  template: "hero-12";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  imageUrl?: string;
  imageAlt?: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface HeroTemplate13Data {
  template: "hero-13";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  imageUrl?: string;
  imageAlt?: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface HeroTemplate14Data {
  template: "hero-14";
  subtitle?: string;
  title: string;
  buttons: HeroButton[];
  backgroundImageUrl?: string;
  imageAlt?: string;
}

// Union type for all hero templates
export type HeroData =
  | HeroTemplate1Data
  | HeroTemplate2Data
  | HeroTemplate3Data
  | HeroTemplate4Data
  | HeroTemplate5Data
  | HeroTemplate6Data
  | HeroTemplate7Data
  | HeroTemplate8Data
  | HeroTemplate9Data
  | HeroTemplate10Data
  | HeroTemplate11Data
  | HeroTemplate12Data
  | HeroTemplate13Data
  | HeroTemplate14Data;

// Component and API interfaces
export interface HeroComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "hero";
  data: HeroData;
  type?: "hero";
  order: number;
  page?: number;
}

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

export interface GetPageComponentsResponse {
  success?: boolean;
  message?: string;
  data?: ApiHeroComponentResponse[] | HeroComponentData[];
  components?: ApiHeroComponentResponse[] | HeroComponentData[];
}

// Default data for each template
export const defaultHeroTemplate1Data: HeroTemplate1Data = {
  template: "hero-1",
  title: "Transform Your Digital Presence",
  subtitle: "Modern Solutions for Growing Businesses",
  description:
    "Empower your brand with cutting-edge technology and innovative design that drives real results.",
  buttons: [
    { id: "1", text: "Start Free Trial", variant: "primary", href: "#" },
    { id: "2", text: "View Demo", variant: "secondary", href: "#" },
  ],
  layout: "text-center",
  showImage: true,
  imageUrl:
    "https://images.unsplash.com/photo-1706708709028-9ed38f34115f?q=80&w=1170&auto=format&fit=crop",
  imageAlt: "Hero image",
};

export const defaultHeroTemplate2Data: HeroTemplate2Data = {
  template: "hero-2",
  title: "Discover Amazing Products",
  subtitle: "Featured Collection",
  description:
    "Explore our handpicked selection of premium products designed to enhance your lifestyle.",
  buttons: [
    { id: "1", text: "Shop Now", variant: "primary", href: "#" },
    { id: "2", text: "Learn More", variant: "secondary", href: "#" },
  ],
  layout: "text-center",
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
  ],
  backgroundType: "image",
  backgroundColor: "#FFFFFF",
  backgroundImageUrl:
    "https://images.pexels.com/photos/695644/pexels-photo-695644.jpeg",
};

export const defaultHeroTemplate3Data: HeroTemplate3Data = {
  template: "hero-3",
  title: "Build Better Products Faster",
  subtitle: "Innovation Platform",
  description:
    "Join thousands of teams building the next generation of digital products with our powerful platform.",
  buttons: [
    { id: "1", text: "Get Started", variant: "primary", href: "#" },
    { id: "2", text: "Watch Demo", variant: "outline", href: "#" },
  ],
  showImage: true,
  imageUrl:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1170&auto=format&fit=crop",
  imageAlt: "Platform interface",
  statsNumber: "12k+",
  statsLabel: "Used by teams and professionals.",
};

export const defaultHeroTemplate4Data: HeroTemplate4Data = {
  template: "hero-4",
  title: "Elevate Your",
  subtitle: "Style Game",
  description:
    "Discover our exclusive collection of premium fashion that combines comfort, style, and sustainability.",
  buttons: [
    { id: "1", text: "Shop Collection", variant: "primary", href: "#" },
  ],
  showImage: true,
  imageUrl: "https://images.pexels.com/photos/813787/pexels-photo-813787.jpeg",
  imageAlt: "Fashion collection",
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
  statsNumber: "788+|8k+",
  statsLabel: "Happy clients|Projects completed",
};

export const defaultHeroTemplate5Data: HeroTemplate5Data = {
  template: "hero-5",
  title: "Minimal Elegance",
  subtitle: "Introducing the UA-01",
  description:
    "Experience the perfect blend of form and function with our latest collection of minimalist design.",
  buttons: [
    { id: "1", text: "Discover More", variant: "primary", href: "#" },
    { id: "2", text: "Explore Collection", variant: "outline", href: "#" },
  ],
  backgroundType: "image",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1327&auto=format&fit=crop",
  showOverlay: true,
  overlayOpacity: 0.7,
  imageAlt: "Minimalist design",
};

export const defaultHeroTemplate6Data: HeroTemplate6Data = {
  template: "hero-6",
  title: "FIND YOUR PERFECT WORKOUT ATTIRE",
  subtitle: "AN EXCLUSIVE SELECTION OF THIS SEASON'S TRENDS.",
  description: "EXCLUSIVELY ONLINE!",
  buttons: [
    { id: "1", text: "SHOP COLLECTION", variant: "primary", href: "#" },
  ],
  sliderImages: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1035&auto=format&fit=crop",
      alt: "Workout attire collection",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1545151414-8a948e1ea54f?q=80&w=987&auto=format&fit=crop",
      alt: "Fitness clothing",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?q=80&w=1920&auto=format&fit=crop",
      alt: "Activewear selection",
    },
  ],
  backgroundType: "color",
  backgroundColor: "#000000",
  showOverlay: true,
  overlayOpacity: 0.5,
};

export const defaultHeroTemplate7Data: HeroTemplate7Data = {
  template: "hero-7",
  buttons: [],
  collections: [
    {
      id: "women",
      title: "WOMEN'S COLLECTION",
      subtitle: "NEW COLLECTION",
      badge: "WOMEN",
      imageUrl:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop",
      imageAlt: "Woman in yellow sportswear stretching on stairs",
      buttonText: "DISCOVER MORE",
      buttonHref: "#",
    },
    {
      id: "men",
      title: "MEN'S COLLECTION",
      subtitle: "SAVE 50% OFF",
      badge: "MEN",
      imageUrl:
        "https://images.unsplash.com/photo-1683509231125-5c487afaa453?q=80&w=1364&auto=format&fit=crop",
      imageAlt: "Man in red t-shirt resting after a workout",
      buttonText: "DISCOVER MORE",
      buttonHref: "#",
    },
  ],
  backgroundType: "color",
  backgroundColor: "#F3F4F6",
};
export const defaultHeroTemplate8Data: HeroTemplate8Data = {
  template: "hero-8",
  title: "Premium Nepali Hand Knotted Rugs",
  description:
    "Experience the timeless beauty of authentic Nepali craftsmanship. Each rug tells a story of tradition, patience, and unparalleled artistry passed down through generations.",
  buttons: [
    { id: "1", text: "Order Now", variant: "primary", href: "#" },
    { id: "2", text: "View Menu", variant: "outline", href: "#" },
  ],
  features: [
    { id: "1", text: "Hand Knotted" },
    { id: "2", text: "Premium Quality" },
    { id: "3", text: "Authentic" },
  ],
  trustIndicators: {
    rating: "4.9/5",
    stars: "★★★★★",
    features: ["Free Shipping", "30-Day Returns"],
    customerText: "Trusted by 1000+ customers worldwide",
  },
  leftImageUrl:
    "https://images.unsplash.com/photo-1725653811863-8ca1776e126a?q=80&w=764&auto=format&fit=crop",
  leftImageAlt: "Left rug image",
  rightImageUrl:
    "https://images.unsplash.com/photo-1758640920659-0bb864175983?q=80&w=1171&auto=format&fit=crop",
  rightImageAlt: "Right rug image",
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};

export const defaultHeroTemplate9Data: HeroTemplate9Data = {
  template: "hero-9",
  title: "Innovation Meets Elegance",
  description:
    "Join our community of innovators and creators shaping the future of design and technology.",
  buttons: [{ id: "1", text: "Get Started", variant: "primary", href: "#" }],
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
  ],
  backgroundType: "color",
  backgroundColor: "#F9FAFB",
};

export const defaultHeroTemplate10Data: HeroTemplate10Data = {
  template: "hero-10",
  title: "Summer styles are finally here",
  description:
    "This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care if you live or die.",
  buttons: [
    { id: "1", text: "Shop Collection", variant: "primary", href: "#" },
  ],
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
      id: "8",
      url: "https://images.unsplash.com/photo-1757137910091-1cf071030691?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Images 3",
    },
  ],
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};

export const defaultHeroTemplate11Data: HeroTemplate11Data = {
  template: "hero-11",
  title: "Best Solution For Your Business Strategy.",
  subtitle: "Started From - 1998",
  description: "Whole-Life Business Coaching for committed entrepreneurs",
  buttons: [
    { id: "1", text: "Get started today", variant: "primary", href: "#" },
  ],
  imageUrl:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2080&auto=format&fit=crop",
  imageAlt: "Business strategy meeting",
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};

export const defaultHeroTemplate12Data: HeroTemplate12Data = {
  template: "hero-12",
  title: "Visa Made Easy\nDreams Made\nPossible",
  buttons: [
    { id: "1", text: "Read More", variant: "primary", href: "#" },
    { id: "2", text: "Watch Our Videos", variant: "secondary", href: "#" },
  ],
  imageUrl:
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2940&auto=format&fit=crop",
  imageAlt: "Happy traveler in Paris",
  backgroundType: "color",
  backgroundColor: "#013D2F",
};

export const defaultHeroTemplate13Data: HeroTemplate13Data = {
  template: "hero-13",
  title:
    "Navigate Business <br /> with <span class='font-serif font-normal italic'>Confidence</span>",
  description:
    "Expert strategic consulting to drive sustainable growth, operational innovation, and lasting business transformation across industries and markets, maximizing impact.",
  buttons: [
    { id: "1", text: "Book a Free Call", variant: "secondary", href: "#" },
  ],
  backgroundType: "image",
  backgroundImageUrl: "https://picsum.photos/seed/office1/1920/1080",
  imageAlt: "Office meeting background",
};

export const defaultHeroTemplate14Data: HeroTemplate14Data = {
  template: "hero-14",
  subtitle: "Exclusive Drop",
  title: "MIDNIGHT SERIES",
  buttons: [{ id: "1", text: "Shop The Look", variant: "primary", href: "#" }],
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576&auto=format&fit=crop",
  imageAlt: "Featured Collection",
};

// Default data map for all hero templates
export const DEFAULT_HERO_MAP: Record<HeroData["template"], HeroData> = {
  "hero-1": defaultHeroTemplate1Data,
  "hero-2": defaultHeroTemplate2Data,
  "hero-3": defaultHeroTemplate3Data,
  "hero-4": defaultHeroTemplate4Data,
  "hero-5": defaultHeroTemplate5Data,
  "hero-6": defaultHeroTemplate6Data,
  "hero-7": defaultHeroTemplate7Data,
  "hero-8": defaultHeroTemplate8Data,
  "hero-9": defaultHeroTemplate9Data,
  "hero-10": defaultHeroTemplate10Data,
  "hero-11": defaultHeroTemplate11Data,
  "hero-12": defaultHeroTemplate12Data,
  "hero-13": defaultHeroTemplate13Data,
  "hero-14": defaultHeroTemplate14Data,
};

// Type guards for each template
export const isHeroTemplate1 = (data: HeroData): data is HeroTemplate1Data =>
  data.template === "hero-1";

export const isHeroTemplate2 = (data: HeroData): data is HeroTemplate2Data =>
  data.template === "hero-2";

export const isHeroTemplate3 = (data: HeroData): data is HeroTemplate3Data =>
  data.template === "hero-3";

export const isHeroTemplate4 = (data: HeroData): data is HeroTemplate4Data =>
  data.template === "hero-4";

export const isHeroTemplate5 = (data: HeroData): data is HeroTemplate5Data =>
  data.template === "hero-5";

export const isHeroTemplate6 = (data: HeroData): data is HeroTemplate6Data =>
  data.template === "hero-6";

export const isHeroTemplate7 = (data: HeroData): data is HeroTemplate7Data =>
  data.template === "hero-7";
export const isHeroTemplate8 = (data: HeroData): data is HeroTemplate8Data =>
  data.template === "hero-8";

export const isHeroTemplate9 = (data: HeroData): data is HeroTemplate9Data =>
  data.template === "hero-9";

export const isHeroTemplate10 = (data: HeroData): data is HeroTemplate10Data =>
  data.template === "hero-10";

export const isHeroTemplate11 = (data: HeroData): data is HeroTemplate11Data =>
  data.template === "hero-11";

export const isHeroTemplate12 = (data: HeroData): data is HeroTemplate12Data =>
  data.template === "hero-12";

export const isHeroTemplate13 = (data: HeroData): data is HeroTemplate13Data =>
  data.template === "hero-13";

export const isHeroTemplate14 = (data: HeroData): data is HeroTemplate14Data =>
  data.template === "hero-14";
