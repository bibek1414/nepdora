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

export type AboutUsData =
  | AboutUs1Data
  | AboutUs2Data
  | AboutUs3Data
  | AboutUs4Data
  | AboutUs5Data;
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
