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

export interface HeroTemplate15Data {
  template: "hero-15";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  imageUrl?: string;
  imageAlt?: string;
  priceLabel?: string;
  priceValue?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
}

export interface HeroTemplate16Data {
  template: "hero-16";
  title: string;
  description?: string;
  badge1Image?: string;
  badge1Text?: string;
  badge2Image?: string;
  badge2Text?: string;
  buttons: HeroButton[];
  features?: HeroFeature[];
  imageUrl?: string;
  imageAlt?: string;
}

export interface HeroTemplate17Data {
  template: "hero-17";
  title: string;
  badgeText?: string;
  buttons: HeroButton[];
  rightImageUrl?: string;
  rightImageAlt?: string;
  rightStampImageUrl?: string;
  rightStampAlt?: string;
  features?: HeroFeature[];
}

export interface HeroTemplate18Data {
  template: "hero-18";
  buttons: HeroButton[];
  collections: HeroCollection[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface HeroTemplate19Data {
  template: "hero-19";
  titlePart1: string;
  description: string;
  buttons: HeroButton[];
  imageUrl: string;
  imageAlt: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
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
  | HeroTemplate14Data
  | HeroTemplate15Data
  | HeroTemplate16Data
  | HeroTemplate17Data
  | HeroTemplate18Data
  | HeroTemplate19Data;

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
  imageUrl: "/fallback/image-not-found.png",
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
      url: "/fallback/image-not-found.png",
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
      url: "/fallback/image-not-found.png",
      alt: "Images 3",
    },
  ],
  backgroundType: "image",
  backgroundColor: "#FFFFFF",
  backgroundImageUrl: "/fallback/image-not-found.png",
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
  imageUrl: "/fallback/image-not-found.png",
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
  imageUrl: "/fallback/image-not-found.png",
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
  backgroundImageUrl: "/fallback/image-not-found.png",
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
      url: "/fallback/image-not-found.png",
      alt: "Workout attire collection",
    },
    {
      id: "2",
      url: "/fallback/image-not-found.png",
      alt: "Fitness clothing",
    },
    {
      id: "3",
      url: "/fallback/image-not-found.png",
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
      imageUrl: "/fallback/image-not-found.png",
      imageAlt: "Woman in yellow sportswear stretching on stairs",
      buttonText: "DISCOVER MORE",
      buttonHref: "#",
    },
    {
      id: "men",
      title: "MEN'S COLLECTION",
      subtitle: "SAVE 50% OFF",
      badge: "MEN",
      imageUrl: "/fallback/image-not-found.png",
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
  leftImageUrl: "/fallback/image-not-found.png",
  leftImageAlt: "Left rug image",
  rightImageUrl: "/fallback/image-not-found.png",
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
      url: "/fallback/image-not-found.png",
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
      url: "/fallback/image-not-found.png",
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
      url: "/fallback/image-not-found.png",
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
      url: "/fallback/image-not-found.png",
      alt: "Images 3",
    },
    {
      id: "5",
      url: "/fallback/image-not-found.png",
      alt: "Images 4",
    },
    {
      id: "6",
      url: "/fallback/image-not-found.png",
      alt: "Images 3",
    },
    {
      id: "7",
      url: "/fallback/image-not-found.png",
      alt: "Images 4",
    },
    {
      id: "8",
      url: "/fallback/image-not-found.png",
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
  imageUrl: "/fallback/image-not-found.png",
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
  imageUrl: "/fallback/image-not-found.png",
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
  backgroundImageUrl: "/fallback/image-not-found.png",
  imageAlt: "Office meeting background",
};

export const defaultHeroTemplate14Data: HeroTemplate14Data = {
  template: "hero-14",
  subtitle: "Exclusive Drop",
  title: "MIDNIGHT SERIES",
  buttons: [{ id: "1", text: "Shop The Look", variant: "primary", href: "#" }],
  backgroundImageUrl: "/fallback/image-not-found.png",
  imageAlt: "Featured Collection",
};

export const defaultHeroTemplate15Data: HeroTemplate15Data = {
  template: "hero-15",
  title: "Delicious Deals\nIn One\nClick",
  subtitle: "Savor Every Bite",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed sodales auctor orci, sit amet vulputate velit molestie.",
  buttons: [{ id: "1", text: "Order Now", variant: "primary", href: "#" }],
  imageUrl: "/fallback/image-not-found.png",
  imageAlt: "Delicious food plate",
  priceLabel: "Price",
  priceValue: "$ 10.03",
  stat1Value: "23",
  stat1Label: "Daily Orders",
  stat2Value: "56+",
  stat2Label: "Items Available",
};

export const defaultHeroTemplate16Data: HeroTemplate16Data = {
  template: "hero-16",
  title: "Best Abroad Study Consultancy <br /> In Nepal",
  description:
    "Expert guidance for studying in USA, UK, Australia, Canada & New Zealand. From course selection to visa processing — we've got you covered.",
  badge1Text: "Approved by Ministry of Education",
  badge1Image: "/ministry-of-education.png",
  badge2Text: "TITI Certified Counselors",
  badge2Image: "/titi.png",
  buttons: [
    { id: "1", text: "Book Free Consultation", variant: "primary", href: "#" },
    { id: "2", text: "Learn More About Us", variant: "outline", href: "#" },
  ],
  features: [
    { id: "1", text: "10+ Years Experience" },
    { id: "2", text: "5000+ Students Placed" },
    { id: "3", text: "100+ Partner Universities" },
  ],
  imageUrl: "/fallback/image-not-found.png",
  imageAlt: "Students graduating",
};

export const defaultHeroTemplate17Data: HeroTemplate17Data = {
  template: "hero-17",
  badgeText: "New Trend 2025",
  title: "Waves Puffer\nCoat Black",
  buttons: [{ id: "1", text: "Shop Now", variant: "outline", href: "#" }],
  rightImageUrl: "/images/site-owners/hero/hero-style-17/hero-right-image.webp",
  rightImageAlt: "Waves Puffer Coat Black",
  rightStampImageUrl: "/images/site-owners/hero/hero-style-17/bag.webp",
  rightStampAlt: "Product Quality Best",
  features: [
    { id: "1", text: "Free Shipping|Free Shipping for orders over $90" },
    { id: "2", text: "Money Back guarantee|100% money back guarantee" },
    { id: "3", text: "24/7 online support|24 hours a day, 7 days a week" },
    { id: "4", text: "Flexible Payment|Pay with Multiple Credit Cards" },
  ],
};

export const defaultHeroTemplate18Data: HeroTemplate18Data = {
  template: "hero-18",
  buttons: [],
  collections: [
    {
      id: "men",
      title: "Men's\nCollection",
      subtitle: "",
      badge: "",
      imageUrl: "/fallback/image-not-found.png",
      imageAlt: "Men's collection",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
    {
      id: "women",
      title: "Women's\nCollection",
      subtitle: "",
      badge: "",
      imageUrl: "/fallback/image-not-found.png",
      imageAlt: "Women's collection",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
  ],
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};

export const defaultHeroTemplate19Data: HeroTemplate19Data = {
  template: "hero-19",
  titlePart1: "Premium Eyewear <br /> Made for Nepal",
  description:
    "Thoughtfully designed eyewear that blends comfort, clarity, and modern style for everyday life.",
  buttons: [
    {
      id: "1",
      text: "Explore Collection",
      variant: "primary",
      href: "#",
    },
    { id: "2", text: "Our Story", variant: "outline", href: "#" },
  ],
  imageUrl: "/fallback/image-not-found.png",
  imageAlt: "NepGlass Premium Sunglasses",
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
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
  "hero-15": defaultHeroTemplate15Data,
  "hero-16": defaultHeroTemplate16Data,
  "hero-17": defaultHeroTemplate17Data,
  "hero-18": defaultHeroTemplate18Data,
  "hero-19": defaultHeroTemplate19Data,
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

export const isHeroTemplate15 = (data: HeroData): data is HeroTemplate15Data =>
  data.template === "hero-15";

export const isHeroTemplate16 = (data: HeroData): data is HeroTemplate16Data =>
  data.template === "hero-16";

export const isHeroTemplate17 = (data: HeroData): data is HeroTemplate17Data =>
  data.template === "hero-17";

export const isHeroTemplate18 = (data: HeroData): data is HeroTemplate18Data =>
  data.template === "hero-18";

export const isHeroTemplate19 = (data: HeroData): data is HeroTemplate19Data =>
  data.template === "hero-19";
