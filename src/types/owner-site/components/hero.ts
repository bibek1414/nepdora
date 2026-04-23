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
  sliderImages?: HeroSliderImage[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showOverlay?: boolean;
  overlayOpacity?: number;
}

export const defaultHeroTemplate1Data: HeroTemplate1Data = {
  template: "hero-1",
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

export interface HeroTemplate2Data {
  template: "hero-2";
  title?: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  collections: HeroCollection[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export const defaultHeroTemplate2Data: HeroTemplate2Data = {
  template: "hero-2",
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

export interface HeroTemplate3Data {
  template: "hero-3";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: HeroButton[];
  sliderImages?: HeroSliderImage[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export const defaultHeroTemplate3Data: HeroTemplate3Data = {
  template: "hero-3",
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

export interface HeroTemplate4Data {
  template: "hero-4";
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

export const defaultHeroTemplate4Data: HeroTemplate4Data = {
  template: "hero-4",
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

export interface HeroTemplate5Data {
  template: "hero-5";
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

export const defaultHeroTemplate5Data: HeroTemplate5Data = {
  template: "hero-5",
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

export interface HeroTemplate6Data {
  template: "hero-6";
  subtitle?: string;
  title: string;
  buttons: HeroButton[];
  backgroundImageUrl?: string;
  imageAlt?: string;
}

export const defaultHeroTemplate6Data: HeroTemplate6Data = {
  template: "hero-6",
  subtitle: "Exclusive Drop",
  title: "MIDNIGHT SERIES",
  buttons: [{ id: "1", text: "Shop The Look", variant: "primary", href: "#" }],
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2576&auto=format&fit=crop",
  imageAlt: "Featured Collection",
};

export interface HeroTemplate7Data {
  template: "hero-7";
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

export const defaultHeroTemplate7Data: HeroTemplate7Data = {
  template: "hero-7",
  title: "Delicious Deals\nIn One\nClick",
  subtitle: "Savor Every Bite",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed sodales auctor orci, sit amet vulputate velit molestie.",
  buttons: [{ id: "1", text: "Order Now", variant: "primary", href: "#" }],
  imageUrl: "/hero.webp",
  imageAlt: "Delicious food plate",
  priceLabel: "Price",
  priceValue: "$ 10.03",
  stat1Value: "23",
  stat1Label: "Daily Orders",
  stat2Value: "56+",
  stat2Label: "Items Available",
};

export interface HeroTemplate8Data {
  template: "hero-8";
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

export const defaultHeroTemplate8Data: HeroTemplate8Data = {
  template: "hero-8",
  title: "Best Abroad Study Consultancy <br /> In Nepal",
  description:
    "Expert guidance for studying in USA, UK, Australia, Canada & New Zealand. From course selection to visa processing - we've got you covered.",
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
  imageUrl:
    "https://images.unsplash.com/photo-1523240715639-9942f1476d06?q=80&w=2070&auto=format&fit=crop",
  imageAlt: "Students graduating",
};

export interface HeroTemplate9Data {
  template: "hero-9";
  title: string;
  badgeText?: string;
  buttons: HeroButton[];
  rightImageUrl?: string;
  rightImageAlt?: string;
  rightStampImageUrl?: string;
  rightStampAlt?: string;
  features?: HeroFeature[];
}

export const defaultHeroTemplate9Data: HeroTemplate9Data = {
  template: "hero-9",
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

export interface HeroTemplate10Data {
  template: "hero-10";
  buttons: HeroButton[];
  collections: HeroCollection[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export const defaultHeroTemplate10Data: HeroTemplate10Data = {
  template: "hero-10",
  buttons: [],
  collections: [
    {
      id: "men",
      title: "Men's\nCollection",
      subtitle: "",
      badge: "",
      imageUrl:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=774&auto=format&fit=crop",
      imageAlt: "Men's collection",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
    {
      id: "women",
      title: "Women's\nCollection",
      subtitle: "",
      badge: "",
      imageUrl:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1020&auto=format&fit=crop",
      imageAlt: "Women's collection",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
  ],
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};

export interface HeroTemplate11Data {
  template: "hero-11";
  titlePart1: string;
  description: string;
  buttons: HeroButton[];
  imageUrl: string;
  imageAlt: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export const defaultHeroTemplate11Data: HeroTemplate11Data = {
  template: "hero-11",
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
  imageUrl:
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
  imageAlt: "NepGlass Premium Sunglasses",
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};
export interface HeroTemplate12Slide {
  id: string;
  url: string;
  alt: string;
  subtitle: string;
  title: string;
  description: string;
  color: string;
  buttonText: string;
  buttonHref: string;
}
export interface HeroTemplate12Data {
  template: "hero-12";
  buttons: HeroButton[];
  slides?: HeroTemplate12Slide[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export const defaultHeroTemplate12Data: HeroTemplate12Data = {
  template: "hero-12",
  buttons: [],
  slides: [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      alt: "Next Gen Gaming",
      subtitle: "New Arrival",
      title: "Next Gen Gaming",
      description: "Experience console quality gaming on the go.",
      color: "from-navy-950/90",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      alt: "Workstation Pro",
      subtitle: "Best Seller",
      title: "Workstation Pro",
      description: "Power through your workflow with M3 chips.",
      color: "from-blue-900/90",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      alt: "Wearable Tech",
      subtitle: "Spring Sale",
      title: "Wearable Tech",
      description: "Track your fitness goals with precision.",
      color: "from-emerald-900/90",
      buttonText: "Shop Now",
      buttonHref: "#",
    },
  ],
  backgroundType: "color",
  backgroundColor: "#000000",
};

export interface HeroTemplate13Data {
  template: "hero-13";
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  buttons: HeroButton[];
}

export const defaultHeroTemplate13Data: HeroTemplate13Data = {
  template: "hero-13",
  title: "I'm Sam, and I am a senior industrial designer",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit lectus etiam malesuada nunc lacus velit vitae egestas integer urna phasellu.",
  imageUrl:
    "https://cdn.prod.website-files.com/60e640d00fdb1e0bd76fae59/60ecd8896b60ff2782eeee29_sam-moore-avatar-home-v3-portfolio-x-webflow-template%20(1).jpeg",
  imageAlt: "Sam Profile",
  buttons: [],
};

export interface HeroTemplate14Data {
  template: "hero-14";
  eyebrow: string;
  title: string;
  spanText: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export const defaultHeroTemplate14Data: HeroTemplate14Data = {
  template: "hero-14",
  eyebrow: "About Me",
  title: "I craft digital experiences",
  spanText: "digital",
  description:
    "Full-stack developer passionate about building elegant, performant, and user-centric applications that make a difference.",
  imageUrl:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
  imageAlt: "Developer workspace",
};

export interface HeroTemplate15Data {
  template: "hero-15";
  eyebrow: string;
  title: string;
  spanText: string;
  description: string;
  backgroundImageUrl: string;
  imageAlt: string;
  buttons: HeroButton[];
}

export const defaultHeroTemplate15Data: HeroTemplate15Data = {
  template: "hero-15",
  eyebrow: "6+ Years Experience • 250+ Clients Worldwide",
  title: "Professional Accounting, Compliance & Business Setup",
  spanText: "Business Setup",
  description:
    "We help businesses stay compliant, manage finances, and grow - so you can focus on running your business.",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  imageAlt: "Corporate Finance",
  buttons: [
    { id: "1", text: "Explore Services", variant: "primary", href: "#" },
    { id: "2", text: "Get a Quote", variant: "secondary", href: "#" },
  ],
};

export interface HeroTemplate16Data {
  template: "hero-16";
  title: string;
  spanText: string;
  imageUrl: string;
  imageAlt: string;
}

export const defaultHeroTemplate16Data: HeroTemplate16Data = {
  template: "hero-16",
  title: "Your Partner <br /> In",
  spanText: "Financial Growth",
  imageUrl:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  imageAlt: "Office Meeting",
};

export interface HeroTemplate17Data {
  template: "hero-17";
  badge: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  mainImageUrl: string;
  mainImageAlt: string;
  floatingImageUrl: string;
  floatingImageAlt: string;
  floatingBadgeIcon: string;
  floatingBadgeTitle: string;
  floatingBadgeSubtitle: string;
}

export interface HeroTemplate18Data {
  template: "hero-18";
  eyebrow: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  mapIconUrl: string;
  mapIconAlt: string;
  airplaneIconUrl: string;
  airplaneIconAlt: string;
  polaroid1Url: string;
  polaroid1Alt: string;
  polaroid2Url: string;
  polaroid2Alt: string;
}

export const defaultHeroTemplate17Data: HeroTemplate17Data = {
  template: "hero-17",
  badge: "New Collection 2024",
  title: "Unlock Your <br />Natural Glow",
  description:
    "Discover premium Korean skincare formulated with time-tested ingredients for radiant, healthy skin.",
  primaryButtonText: "Shop Now",
  primaryButtonHref: "#",
  secondaryButtonText: "About Us",
  secondaryButtonHref: "#",
  stat1Value: "50K+",
  stat1Label: "Happy Customers",
  stat2Value: "4.9★",
  stat2Label: "Average Rating",
  stat3Value: "100%",
  stat3Label: "Authentic",
  mainImageUrl:
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=900&h=900&fit=crop",
  mainImageAlt: "Beautiful woman with glowing skin",
  floatingImageUrl:
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=250&fit=crop",
  floatingImageAlt: "Featured serum",
  floatingBadgeIcon: "🌸",
  floatingBadgeTitle: "Best Seller",
  floatingBadgeSubtitle: "5000+ sold",
};

export const defaultHeroTemplate18Data: HeroTemplate18Data = {
  template: "hero-18",
  eyebrow: "Tailored Travel Experiences for Unforgettable Adventures",
  title: "Craft Your Ultimate Dream Getaway",
  description:
    "Design your perfect escape with our tailored travel services, ensuring every detail of your dream vacation is meticulously planned and flawlessly executed",
  primaryButtonText: "Book Now",
  primaryButtonHref: "#",
  secondaryButtonText: "Learn More",
  secondaryButtonHref: "#",
  mapIconUrl:
    "https://cdn.prod.website-files.com/65fab07abb0beb90e59749bd/65fd903f275685d6e088dffa_Map%20Icon.svg",
  mapIconAlt: "Map Icon",
  airplaneIconUrl:
    "https://cdn.prod.website-files.com/65fab07abb0beb90e59749bd/65fd8c344e5e2ed428a8c2bc_Banner%20Home%202.svg",
  airplaneIconAlt: "Airplane Icon",
  polaroid1Url: "https://picsum.photos/seed/canyon/400/500",
  polaroid1Alt: "Canyon",
  polaroid2Url: "https://picsum.photos/seed/lake/400/500",
  polaroid2Alt: "Lake",
};

export interface HeroTemplate19Slide {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  label: string;
  iconName: string; // Map to Lucide icons like 'Utensils', 'Users', 'Droplets', 'Baby'
}

export interface HeroTemplate19Data {
  template: "hero-19";
  slides: HeroTemplate19Slide[];
  primaryButtonText: string;
  primaryButtonHref: string;
  autoplayDuration?: number;
}

export const defaultHeroTemplate19Data: HeroTemplate19Data = {
  template: "hero-19",
  autoplayDuration: 5000,
  primaryButtonText: "Get in touch",
  primaryButtonHref: "#",
  slides: [
    {
      id: "1",
      badge: "Transforms lives with us today",
      title: "Small acts of kindness change lives",
      description:
        "Together we empower underprivileged communities through education, care, opportunity, and long term sustainable support.",
      image: "https://picsum.photos/seed/impact-1/1920/1080",
      imageAlt: "Feeding hungry",
      label: "Feeding hungry",
      iconName: "Utensils",
    },
    {
      id: "2",
      badge: "Transforms lives with us today",
      title: "Small acts of kindness change lives",
      description:
        "Together we empower underprivileged communities through education, care, opportunity, and long term sustainable support.",
      image: "https://picsum.photos/seed/impact-2/1920/1080",
      imageAlt: "Teaching youth",
      label: "Teaching youth",
      iconName: "Users",
    },
    {
      id: "3",
      badge: "Transforms lives with us today",
      title: "Small acts of kindness change lives",
      description:
        "Together we empower underprivileged communities through education, care, opportunity, and long term sustainable support.",
      image: "https://picsum.photos/seed/impact-3/1920/1080",
      imageAlt: "Clean water",
      label: "Clean water",
      iconName: "Droplets",
    },
    {
      id: "4",
      badge: "Transforms lives with us today",
      title: "Small acts of kindness change lives",
      description:
        "Together we empower underprivileged communities through education, care, opportunity, and long term sustainable support.",
      image: "https://picsum.photos/seed/impact-4/1920/1080",
      imageAlt: "Feeding kids",
      label: "Feeding kids",
      iconName: "Baby",
    },
  ],
};
export interface HeroTemplate20Pill {
  id: string;
  image: string;
  imageAlt: string;
}

export interface HeroTemplate20Data {
  template: "hero-20";
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  pills: HeroTemplate20Pill[];
}

export const defaultHeroTemplate20Data: HeroTemplate20Data = {
  template: "hero-20",
  title: "Crafting Spaces with Purpose and Personality",
  description:
    "At Neptecture, we transform ideas into inspiring spaces through innovative design, thoughtful planning, and a commitment to quality, detail, and timeless aesthetics.",
  primaryButtonText: "Get in touch",
  primaryButtonHref: "#",
  pills: [
    {
      id: "1",
      image:
        "https://cdn.prod.website-files.com/6883a66d1ebb4685edc545ce/688a8f736ba3faadf02781f4_minimalist-bedroom-hero-archipro-webflow-template.png",
      imageAlt: "Minimalist bedroom",
    },
    {
      id: "2",
      image:
        "https://cdn.prod.website-files.com/6883a66d1ebb4685edc545ce/688a8f73c7632f2e0ff7b0b3_modern-living-room-hero-archipro-webflow-template.png",
      imageAlt: "Modern living room",
    },
    {
      id: "3",
      image:
        "https://cdn.prod.website-files.com/6883a66d1ebb4685edc545ce/688a8f734866d06a9c67bd1d_wooden-dining-table-hero-archipro-webflow-template.png",
      imageAlt: "Wooden dining table",
    },
    {
      id: "4",
      image:
        "https://cdn.prod.website-files.com/6883a66d1ebb4685edc545ce/688a8f7371c3c0dcf19aa5a7_minimalist-bathroom-hero-archipro-webflow-template.png",
      imageAlt: "Minimalist bathroom",
    },
  ],
};

export interface HeroTemplate21Data {
  template: "hero-21";
  status: string;
  title: string;
  description: string;
  buttons: HeroButton[];
  portraitUrl: string;
  portraitAlt: string;
  location: string;
}

export const defaultHeroTemplate21Data: HeroTemplate21Data = {
  template: "hero-21",
  status: "Available for new work in summer 2026",
  title: "Calm, considered work for teams who care about the details.",
  description:
    "I'm Daniel — an independent designer and engineer. I work with small teams from first sketch to shipped product, mostly in fintech, health, and tools for thinking.",
  buttons: [
    { id: "1", text: "Start a project", variant: "primary", href: "#" },
    { id: "2", text: "About me", variant: "secondary", href: "#" },
  ],
  portraitUrl: "/images/site-owners/hero/hero-style-21/hero-21.jpg",
  portraitAlt: "Daniel Hart",
  location: "Lisbon, Portugal",
};

export interface HeroFeature22 {
  id: string;
  title: string;
  subtitle: string;
}

export interface HeroTemplate22Data {
  template: "hero-22";
  eyebrow: string;
  title: string;
  description: string;
  buttons: HeroButton[];
  mainImageUrl: string;
  mainImageAlt: string;
  features: HeroFeature22[];
}

export const defaultHeroTemplate22Data: HeroTemplate22Data = {
  template: "hero-22",
  eyebrow: "Independent studio · Est. 2014",
  title: "Strategy and design for brands that intend to last.",
  description:
    "We help ambitious teams clarify what they stand for and build the brand, product and growth systems to prove it — quietly, carefully, and to a standard you can defend.",
  buttons: [
    { id: "1", text: "Start a project", variant: "primary", href: "#" },
    { id: "2", text: "See selected work", variant: "outline", href: "#" },
  ],
  mainImageUrl: "/images/site-owners/hero/hero-style-22/hero-workspace.jpg",
  mainImageAlt: "A quiet workspace with laptop and notebook",
  features: [
    { id: "1", title: "Clarity", subtitle: "over cleverness" },
    { id: "2", title: "Craft", subtitle: "over speed" },
  ],
};

export interface HeroStat23 {
  id: string;
  number: string;
  label: string;
}

export interface HeroTemplate23Data {
  template: "hero-23";
  eyebrow: string;
  title: string;
  description: string;
  buttons: HeroButton[];
  backgroundImageUrl: string;
  imageAlt: string;
  stats: HeroStat23[];
}

export const defaultHeroTemplate23Data: HeroTemplate23Data = {
  template: "hero-23",
  eyebrow: "Award-winning architecture firm in Nepal",
  title: "Designing spaces that inspire life",
  description:
    "We blend traditional Nepali craftsmanship with contemporary design to create timeless architectural masterpieces across the Himalayas.",
  buttons: [
    { id: "1", text: "View our work", variant: "primary", href: "/works" },
    { id: "2", text: "Start your project", variant: "secondary", href: "/contact" },
  ],
  backgroundImageUrl: "/images/site-owners/hero/hero-23/hero-23.jpg",
  imageAlt: "Modern villa in Nepal",
  stats: [
    { id: "1", number: "200+", label: "Projects completed" },
    { id: "2", number: "15+", label: "Years experience" },
    { id: "3", number: "50+", label: "Team members" },
    { id: "4", number: "12", label: "Awards won" },
  ],
};

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
  | HeroTemplate19Data
  | HeroTemplate20Data
  | HeroTemplate21Data
  | HeroTemplate22Data
  | HeroTemplate23Data;

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
  "hero-20": defaultHeroTemplate20Data,
  "hero-21": defaultHeroTemplate21Data,
  "hero-22": defaultHeroTemplate22Data,
  "hero-23": defaultHeroTemplate23Data,
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

export const isHeroTemplate20 = (data: HeroData): data is HeroTemplate20Data =>
  data.template === "hero-20";

export const isHeroTemplate21 = (data: HeroData): data is HeroTemplate21Data =>
  data.template === "hero-21";

export const isHeroTemplate22 = (data: HeroData): data is HeroTemplate22Data =>
  data.template === "hero-22";

export const isHeroTemplate23 = (data: HeroData): data is HeroTemplate23Data =>
  data.template === "hero-23";
