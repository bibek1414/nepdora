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
  title: string;
  subtitle: string;
  description: string;
  teamMembers: TeamMember[];
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

export type AboutUsData = AboutUs1Data | AboutUs2Data | AboutUs3Data;

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
  data: Partial<AboutUsData>;
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

export const defaultAboutUs2Data: AboutUs2Data = {
  template: "about-2",
  title: "Meet Our Team",
  subtitle: "The Minds Behind Our Success",
  description:
    "We are a collective of creators, thinkers, and innovators, united by a passion for building exceptional digital experiences. Get to know the people who make it all happen.",
  teamMembers: [
    {
      id: "1",
      name: "Jane Doe",
      role: "CEO & Founder",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
    },
    {
      id: "2",
      name: "John Smith",
      role: "Lead Developer",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    },
    {
      id: "3",
      name: "Emily White",
      role: "UX/UI Designer",
      imageUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
    },
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
