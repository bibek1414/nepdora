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
export interface AboutUs2Data {
  template: "about-2";
  heroTitle: string;
  heroImageUrl: string;
  heroImageAlt: string;
  storyTitle: string;
  journeyTitle: string;
  journeyDescription: string;
  journeyImageUrl: string;
  journeyImageAlt: string;
  ctaText: string;
  ctaLink: string;
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
    startLabel: string;
    completeLabel: string;
  };
}

// Add this to your types file (about.ts)
export interface AboutUs5Data {
  template: "about-5";
  heroTitle: string;
  sectionTag: string;
  mainTitle: string;
  image1Url: string;
  image1Alt: string;
  image1Tag: string;
  image2Url: string;
  image2Alt: string;
  image2Tag: string;
  teamImageUrl: string;
  teamImageAlt: string;
  description: string;
  stats: Array<{
    id: string;
    value: string;
    label: string;
  }>;
  avatars: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
  videoLinkText: string;
  videoLink: string;
}

// Add this to your types file (about.ts)
export interface AboutUs6Data {
  template: "about-6";
  headline: string;
  buttonText: string;
  buttonLink: string;
  stats: Array<{
    id: string;
    value: string;
    label: string;
    topIcon: string;
    bottomIcon: string;
  }>;
  image1Url: string;
  image1Alt: string;
  centerImageUrl: string;
  centerImageAlt: string;
  image2Url: string;
  image2Alt: string;
}

// Add this to your types file (about.ts)
export interface AboutUs7Data {
  template: "about-7";
  subtitle: string;
  title: string;
  trainings: Array<{
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    imageAlt: string;
  }>;
  buttonText: string;
  buttonLink: string;
}

export interface AboutUs8Data {
  template: "about-8";
  title: string;
  description: string;
  features: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
}

export interface AboutUs9Data {
  template: "about-9";
  eyebrow: string;
  title: string;
  descriptionPrimary: string;
  descriptionSecondary: string;
  buttonText: string;
  buttonLink: string;
  media: {
    type: "image" | "video";
    url: string;
    alt: string;
  };
}

export interface AboutUs10Data {
  template: "about-10";
  badgeCount: string;
  badgeText: string;
  sectionTag: string;
  title: string;
  description: string;
  features: Array<{
    id: string;
    title: string;
    items: string[];
  }>;
  buttonText: string;
  supportText: string;
  supportNumber: string;
  imageUrl: string;
  imageAlt: string;
  circularStampText: string;
}

// Don't forget to update your AboutUsData type union to include AboutUs7Data and AboutUs8Data
export type AboutUsData =
  | AboutUs1Data
  | AboutUs2Data
  | AboutUs3Data
  | AboutUs4Data
  | AboutUs5Data
  | AboutUs6Data
  | AboutUs7Data
  | AboutUs8Data
  | AboutUs9Data
  | AboutUs10Data;

export interface AboutUs4Data {
  template: "about-4";
  title: string;
  subtitle: string;
  subSubtitle: string; // New field
  imageUrl: string;
  imageAlt: string;
}

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
  data:
    | Partial<AboutUs1Data>
    | Partial<AboutUs2Data>
    | Partial<AboutUs3Data>
    | Partial<AboutUs4Data>
    | Partial<AboutUs5Data>
    | Partial<AboutUs6Data>
    | Partial<AboutUs7Data>
    | Partial<AboutUs8Data>
    | Partial<AboutUs9Data>
    | Partial<AboutUs10Data>;
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
    startLabel: "Start Date",
    completeLabel: "Completion Date",
  },
};
export const defaultAboutUs4Data: AboutUs4Data = {
  template: "about-4",
  title: "Our Vision",
  subtitle: "Simple, Elegant, Effective.",
  subSubtitle:
    "We believe in crafting solutions that truly make a difference, solutions that go beyond the surface and create real impact. Every challenge is an opportunity to innovate, to design with both purpose and creativity. With precision and care, we transform ideas into meaningful outcomes that empower people. Our focus is always on building tools and experiences that inspire growth and progress. In everything we create, we strive to shape a future where positive change becomes possible.",
  imageUrl:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1770&auto=format&fit=crop",
  imageAlt: "A minimalist office setting with a computer and plants.",
};

export const defaultAboutUs2Data: AboutUs2Data = {
  template: "about-2",
  heroTitle: "ABOUT",
  heroImageUrl:
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  heroImageAlt: "Sneaker background",
  storyTitle: "Our Story",
  journeyTitle: "Our Sneaker Journey",
  journeyDescription:
    "Sneaker Story Began With A Love For Sneakers. We've Evolved Into A Hub For Innovation, Style, And Community. Uniting Enthusiasts Globally With Our Curated Selection And Passion-Driven Approach.",
  journeyImageUrl:
    "https://images.unsplash.com/photo-1626379616459-b2ce1d9decbc?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  journeyImageAlt: "Sneaker Journey",
  ctaText: "Let's Go",
  ctaLink: "#",
};

export const defaultAboutUs5Data: AboutUs5Data = {
  template: "about-5",
  heroTitle: "ABOUT US",
  sectionTag: "Our Story",
  mainTitle:
    "Your Vision Our Expertise Your Success Get Noticed Generate Leads Dominate.",
  image1Url:
    "https://plus.unsplash.com/premium_photo-1661627374844-11ca6ddb3633?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  image1Alt: "Woman with laptop",
  image1Tag: "Tech Blog",
  image2Url:
    "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  image2Alt: "Team meeting",
  image2Tag: "Trends",
  teamImageUrl:
    "https://plus.unsplash.com/premium_photo-1677529496297-fd0174d65941?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  teamImageAlt: "Team collaboration",
  description:
    "Tempor commodo ullamcorper a lacus. Amet commodo nulla facilisi nullam. Molestie nunc non blandit massa enim nec. Felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices. Eros in cursus turpis massa tincidunt dui.",
  stats: [
    { id: "1", value: "10k+", label: "Completed Projects" },
    { id: "2", value: "15k", label: "Satisfied Customers" },
    { id: "3", value: "10k+", label: "Years Of Mastery" },
    { id: "4", value: "45+", label: "Worldwide Honors" },
  ],
  avatars: [
    {
      id: "1",
      imageUrl:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Avatar A",
    },
    {
      id: "2",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Avatar B",
    },
    {
      id: "3",
      imageUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1061&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Avatar C",
    },
  ],
  videoLinkText: "WATCH INTRO",
  videoLink: "#",
};

export const defaultAboutUs6Data: AboutUs6Data = {
  template: "about-6",
  headline:
    "Brewhaus is where flavor meets craft. From bean to cup, we focus on quality, speed, and simplicity — perfect for busy mornings or laid-back afternoons.",
  buttonText: "Our News",
  buttonLink: "#",
  stats: [
    {
      id: "1",
      value: "10K+",
      label: "Happy Customers",
      topIcon: "Heart",
      bottomIcon: "Zap",
    },
    {
      id: "2",
      value: "20",
      label: "Products",
      topIcon: "Box",
      bottomIcon: "Lightbulb",
    },
  ],
  image1Url:
    "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  image1Alt: "A female barista smiling while holding a coffee cup",
  centerImageUrl:
    "https://images.unsplash.com/photo-1464979681340-bdd28a61699e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  centerImageAlt: "A close-up of coffee beans being roasted",
  image2Url:
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  image2Alt: "A female barista smiling while holding a coffee cup",
};

// Add this to your default data exports
export const defaultAboutUs7Data: AboutUs7Data = {
  template: "about-7",
  subtitle: "What we do",
  title: "Where athletes push their limits and train with purpose.",
  trainings: [
    {
      id: "1",
      title: "Speed & Endurance Training",
      imageUrl:
        "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "Athlete running on track",
    },
    {
      id: "2",
      title: "Agility & Quickness Drills",
      imageUrl:
        "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "Athlete doing agility drills",
    },
    {
      id: "3",
      title: "Jump & Plyometric Training",
      imageUrl:
        "https://images.unsplash.com/photo-1526676317768-d9b14f15615a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "Athlete doing jump training",
    },
    {
      id: "4",
      title: "Strength & Power Training",
      imageUrl:
        "https://images.unsplash.com/photo-1526676317768-d9b14f15615a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      imageAlt: "Athlete lifting weights",
    },
  ],
  buttonText: "Learn more",
  buttonLink: "#",
};

export const defaultAboutUs8Data: AboutUs8Data = {
  template: "about-8",
  title: "Technical Specifications",
  description:
    "The walnut wood card tray is precision milled to perfectly fit a stack of Focus cards. The powder coated steel divider separates active cards from new ones, or can be used to archive important task lists.",
  features: [
    { id: "1", name: "Origin", description: "Designed by Good Goods, Inc." },
    {
      id: "2",
      name: "Material",
      description:
        "Solid walnut base with rare earth magnets and powder coated steel card cover",
    },
    { id: "3", name: "Dimensions", description: '6.25" x 3.55" x 1.15"' },
    {
      id: "4",
      name: "Finish",
      description: "Hand sanded and finished with natural oil",
    },
    {
      id: "5",
      name: "Includes",
      description: "Wood card tray and 3 refill packs",
    },
    {
      id: "6",
      name: "Considerations",
      description:
        "Made from natural materials. Grain and color vary with each item.",
    },
  ],
  images: [
    {
      id: "1",
      url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-feature-03-detail-01.jpg",
      alt: "Walnut card tray with white powder coated steel divider and 3 punchout holes.",
    },
    {
      id: "2",
      url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-feature-03-detail-02.jpg",
      alt: "Top down view of walnut card tray with embedded magnets and card groove.",
    },
    {
      id: "3",
      url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-feature-03-detail-03.jpg",
      alt: "Side of walnut card tray with card groove and recessed card area.",
    },
    {
      id: "4",
      url: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-feature-03-detail-04.jpg",
      alt: "Walnut card tray filled with cards and card angled in dedicated groove.",
    },
  ],
};

export const defaultAboutUs9Data: AboutUs9Data = {
  template: "about-9",
  eyebrow: "About Funder",
  title: "Funder is best business solution provider.",
  descriptionPrimary:
    "We are Funder Business Consultancy Agency, pioneers in business consultancy. Funder is a leading consulting company that has helped over 100 companies grow their businesses to the next level.",
  descriptionSecondary:
    "Funder provides all of its services with integrity and honesty. We take pride in our work because we know how much your success means to us!",
  buttonText: "Read More",
  buttonLink: "#",
  media: {
    type: "image",
    url: "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Businessman in office",
  },
};

export const defaultAboutUs10Data: AboutUs10Data = {
  template: "about-10",
  badgeCount: "25",
  badgeText: "Years Of experience",
  sectionTag: "WHY CHOOSE US",
  title: "Where Wanderlust Meets Dream Destinations",
  description:
    "Et purus duis sollicitudin dignissim habitant. Egestas nulla quis venenatis cras sed eu massa Et purus duis sollicitudin dignissim habitant. Egestas nulla quis venenatis cras sed eu massa Et purus duis sollicitudin dignissim habitant. Egestas nulla",
  features: [
    {
      id: "1",
      title: "Passport Plus",
      items: ["Beyond Border Immigration", "Worldwide Visa Assistance"],
    },
    {
      id: "2",
      title: "Global Entry",
      items: ["GlobeTrot Visa Services", "Infinity Visa Solutions"],
    },
  ],
  buttonText: "Read More",
  supportText: "Need help?",
  supportNumber: "(808) 555-0111",
  imageUrl:
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2874&auto=format&fit=crop",
  imageAlt: "Traveler with backpack",
  circularStampText: "World Wide Access • Immigration Agency •",
};
