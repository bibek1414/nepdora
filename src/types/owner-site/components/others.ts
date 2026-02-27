export interface OthersButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
}

export interface OthersFeature {
  id: string;
  title: string;
  description: string;
}

export interface OthersStatistic {
  id: string;
  value: string;
  label: string;
}

export interface OthersProcessItem {
  id: string;
  title: string;
  description: string;
}

export interface OthersTrustItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface OthersStepItem {
  id: string;
  title: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
}

export interface OthersTemplate1Data {
  template: "others-1";
  subHeading: string;
  heading: string;
  features: OthersFeature[];
  buttons: OthersButton[];
  image: {
    url: string;
    alt: string;
  };
  experienceBadge: {
    count: string;
    text: string;
  };
  contact: {
    label: string;
    phone: string;
  };
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface OthersTemplate2Data {
  template: "others-2";
  heading: string;
  description: string;
  buttons: OthersButton[];
  statistics: OthersStatistic[];
  leftImage: {
    url: string;
    alt: string;
  };
  rightImage: {
    url: string;
    alt: string;
  };
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface OthersTemplate3Data {
  template: "others-3";
  processLabel: string;
  heading: string;
  processItems: OthersProcessItem[];
  successLabel: string;
  successHeading: string;
  successDescription: string;
  statistics: OthersStatistic[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface OthersCountryCard {
  id: string;
  label: string;
}

export interface OthersTemplate4Data {
  template: "others-4";
  subHeading: string;
  heading: string;
  buttons: OthersButton[];
  countryCards: OthersCountryCard[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface OthersTemplate5Data {
  template: "others-5";
  heading: string;
  subtitle: string;
  description: string;
  features: string[];
  image: {
    url: string;
    alt: string;
  };
  imagePosition: "left" | "right";
  buttonText?: string;
  buttonLink?: string;
}

export interface OthersTemplate6Data {
  template: "others-6";
  items: OthersTrustItem[];
}

export interface OthersTemplate7Data {
  template: "others-7";
  heading: string;
  description: string;
  items: OthersTrustItem[];
}

export interface OthersTemplate8Data {
  template: "others-8";
  heading: string;
  subtitle: string;
  steps: OthersStepItem[];
}

// Union type for all others templates
export type OthersData =
  | OthersTemplate1Data
  | OthersTemplate2Data
  | OthersTemplate3Data
  | OthersTemplate4Data
  | OthersTemplate5Data
  | OthersTemplate6Data
  | OthersTemplate7Data
  | OthersTemplate8Data;

// Component and API interfaces
export interface OthersComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "others";
  data: OthersData;
  type?: "others";
  order: number;
  page?: number;
}

// Default data
export const defaultOthersTemplate1Data: OthersTemplate1Data = {
  template: "others-1",
  subHeading: "WHY CHOOSE US",
  heading: "Experiencing Traditions Cultural Immersion",
  features: [
    {
      id: "1",
      title: "Marketing Services",
      description:
        "Et purus duis sollicitudin dignissim habitant. Egestas nulla quis venenatis cras sed eu massa loren ipsum",
    },
    {
      id: "2",
      title: "IT Maintenance",
      description:
        "Et purus duis sollicitudin dignissim habitant. Egestas nulla quis venenatis cras sed eu massa loren ipsum",
    },
  ],
  buttons: [
    {
      id: "btn-1",
      text: "Read More →",
      variant: "primary",
      href: "#",
    },
  ],
  image: {
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1171&auto=format&fit=crop",
    alt: "Why Choose Us Image",
  },
  experienceBadge: {
    count: "25",
    text: "Years Of experience",
  },
  contact: {
    label: "Need help?",
    phone: "(808) 555-0111",
  },
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};

export const defaultOthersTemplate2Data: OthersTemplate2Data = {
  template: "others-2",
  heading: "Get our best offers quickly",
  description:
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standard dummy",
  buttons: [
    {
      id: "btn-1",
      text: "Contact us",
      variant: "outline",
      href: "#",
    },
  ],
  statistics: [
    {
      id: "stat-1",
      value: "10k+",
      label: "Complete project",
    },
    {
      id: "stat-2",
      value: "20+",
      label: "Team member",
    },
    {
      id: "stat-3",
      value: "5k+",
      label: "Winning award",
    },
    {
      id: "stat-4",
      value: "100+",
      label: "Complete project",
    },
  ],
  leftImage: {
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    alt: "Office workspace",
  },
  rightImage: {
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop",
    alt: "Team collaboration",
  },
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};

export const defaultOthersTemplate3Data: OthersTemplate3Data = {
  template: "others-3",
  processLabel: "PROCESS OVER VIEW",
  heading: "Where Wanderlust Meets Reality Destinations",
  processItems: [
    {
      id: "proc-1",
      title: "Efficiency Experts",
      description:
        "Lorem Ipsum is simply dummy text th printing and typese Lorem Ipm been the industry's standard",
    },
    {
      id: "proc-2",
      title: "Global Entry",
      description:
        "Lorem Ipsum is simply dummy text th printing and typese Lorem Ipm been the industry's standard",
    },
    {
      id: "proc-3",
      title: "Passport Plus",
      description:
        "Lorem Ipsum is simply dummy text th printing and typese Lorem Ipm been the industry's standard",
    },
  ],
  successLabel: "SUCCESS STORY",
  successHeading: "Experiencing Traditions and Customs",
  successDescription:
    "Lorem Ipsum is simply dummy text the printing and typese Lorem Ipsum has been the industry's standardever",
  statistics: [
    { id: "stat-1", value: "200+", label: "Team member" },
    { id: "stat-2", value: "20+", label: "Winning award" },
    { id: "stat-3", value: "10k+", label: "Complete project" },
    { id: "stat-4", value: "900+", label: "Client review" },
  ],
  backgroundType: "color",
  backgroundColor: "#F1F5F1",
};

export const defaultOthersTemplate4Data: OthersTemplate4Data = {
  template: "others-4",
  subHeading: "RELAX TRAVEL",
  heading: "Visa Immigration\nFor A Brighter\nYou Future",
  buttons: [
    {
      id: "btn-1",
      text: "Contact Us",
      variant: "outline",
      href: "#",
    },
  ],
  countryCards: [
    { id: "card-1", label: "Germany" },
    { id: "card-2", label: "South Korea" },
    { id: "card-3", label: "South Africa" },
    { id: "card-4", label: "Turkey" },
    { id: "card-5", label: "Indonesia" },
  ],
  backgroundType: "color",
  backgroundColor: "#EDE8E3",
};

export const defaultOthersTemplate5Data: OthersTemplate5Data = {
  template: "others-5",
  heading: "Clarity You Can Trust",
  subtitle: "Features",
  description:
    "Experience the world through lenses crafted for perfection. Our eyewear combines advanced technology with timeless design to deliver unmatched visual comfort. Whether you're working, driving, or enjoying the outdoors, Nepglass ensures your vision is always crisp and clear.",
  features: [
    "Precision-engineered lenses for optimal clarity",
    "Lightweight and durable frame materials",
    "Tailored fit for all-day comfort",
    "Advanced UV and blue light protection",
  ],
  image: {
    url: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=1000",
    alt: "Person wearing stylish glasses outdoors",
  },
  imagePosition: "left",
  buttonText: "Find Your Perfect Pair",
  buttonLink: "/products",
};

export const defaultOthersTemplate6Data: OthersTemplate6Data = {
  template: "others-6",
  items: [
    {
      id: "trust-1",
      title: "Free Eye Test",
      description: "Available at partner clinics",
      icon: "Eye",
    },
    {
      id: "trust-2",
      title: "Fast Delivery",
      description: "Across Nepal",
      icon: "Truck",
    },
    {
      id: "trust-3",
      title: "7-Day Returns",
      description: "Hassle-free",
      icon: "RotateCcw",
    },
    {
      id: "trust-4",
      title: "Warranty",
      description: "On frames & lenses",
      icon: "ShieldCheck",
    },
  ],
};

export const defaultOthersTemplate7Data: OthersTemplate7Data = {
  template: "others-7",
  heading: "Why Choose NepGlass",
  description:
    "Thoughtfully designed eyewear that blends quality, comfort, and modern aesthetics for everyday life in Nepal.",
  items: [
    {
      id: "why-1",
      title: "Timeless Style",
      description:
        "A curated range of frames and sunglasses designed to suit every look.",
      icon: "Sparkles",
    },
    {
      id: "why-2",
      title: "Clear Vision",
      description:
        "Precision-crafted lenses focused on comfort, clarity, and protection.",
      icon: "Eye",
    },
    {
      id: "why-3",
      title: "Built for Nepal",
      description:
        "Designed with local lifestyle, climate, and preferences in mind.",
      icon: "MapPin",
    },
    {
      id: "why-4",
      title: "Trusted Care",
      description:
        "Personal guidance to help you find eyewear that truly fits you.",
      icon: "Shield",
    },
  ],
};

export const defaultOthersTemplate8Data: OthersTemplate8Data = {
  template: "others-8",
  heading: "How We Make Your Lenses",
  subtitle: "Our Process",
  steps: [
    {
      id: "step-1",
      title: "Precision Design",
      description:
        "Digital surfacing technology ensures lenses match your prescription perfectly.",
      image: {
        url: "https://images.pexels.com/photos/5843448/pexels-photo-5843448.jpeg",
        alt: "Precision Design",
      },
    },
    {
      id: "step-2",
      title: "Advanced Manufacturing",
      description:
        "High-quality materials and meticulous craftsmanship create durable, lightweight lenses.",
      image: {
        url: "https://images.pexels.com/photos/27624637/pexels-photo-27624637.jpeg",
        alt: "Advanced Manufacturing",
      },
    },
    {
      id: "step-3",
      title: "Expert Fitting",
      description:
        "Our specialists ensure lenses fit your frames and eyes comfortably for daily use.",
      image: {
        url: "https://images.pexels.com/photos/27399363/pexels-photo-27399363.jpeg",
        alt: "Expert Fitting",
      },
    },
    {
      id: "step-4",
      title: "Quality Assurance",
      description:
        "Each lens is tested for clarity, durability, and compliance with premium standards.",
      image: {
        url: "https://images.pexels.com/photos/5752328/pexels-photo-5752328.jpeg",
        alt: "Quality Assurance",
      },
    },
  ],
};

// Default data map for all others templates
export const DEFAULT_OTHERS_MAP: Record<OthersData["template"], OthersData> = {
  "others-1": defaultOthersTemplate1Data,
  "others-2": defaultOthersTemplate2Data,
  "others-3": defaultOthersTemplate3Data,
  "others-4": defaultOthersTemplate4Data,
  "others-5": defaultOthersTemplate5Data,
  "others-6": defaultOthersTemplate6Data,
  "others-7": defaultOthersTemplate7Data,
  "others-8": defaultOthersTemplate8Data,
};

// Type guards
export const isOthersTemplate1 = (
  data: OthersData
): data is OthersTemplate1Data => data.template === "others-1";

export const isOthersTemplate2 = (
  data: OthersData
): data is OthersTemplate2Data => data.template === "others-2";

export const isOthersTemplate3 = (
  data: OthersData
): data is OthersTemplate3Data => data.template === "others-3";

export const isOthersTemplate4 = (
  data: OthersData
): data is OthersTemplate4Data => data.template === "others-4";

export const isOthersTemplate5 = (
  data: OthersData
): data is OthersTemplate5Data => data.template === "others-5";

export const isOthersTemplate6 = (
  data: OthersData
): data is OthersTemplate6Data => data.template === "others-6";

export const isOthersTemplate7 = (
  data: OthersData
): data is OthersTemplate7Data => data.template === "others-7";

export const isOthersTemplate8 = (
  data: OthersData
): data is OthersTemplate8Data => data.template === "others-8";
