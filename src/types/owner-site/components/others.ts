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
export interface OthersProcessCard {
  id: number;
  number: string;
  title: string;
  description: string;
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

export interface OthersTemplate2Data {
  template: "others-2";
  items: OthersTrustItem[];
}

export interface OthersTemplate3Data {
  template: "others-3";
  heading: string;
  description: string;
  items: OthersTrustItem[];
}

export interface OthersTemplate4Data {
  template: "others-4";
  heading: string;
  subtitle: string;
  steps: OthersStepItem[];
}

export interface OthersTemplate5Data {
  template: "others-5";
  badge: string;
  heading: string;
  features: OthersFeature[];
  image: {
    url: string;
    alt: string;
  };
  accentColor: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export interface OthersTemplate6Data {
  template: "others-6";
  subtitle?: string;
  title: string;
  processCards?: OthersProcessCard[];
  images?: any[];
}

export interface OthersTemplate7Data {
  template: "others-7";
  subtitle?: string;
  title: string;
  description?: string;
  images: any[];
  buttonText?: string;
}

export interface OthersTemplate8Data {
  template: "others-8";
  subtitle?: string;
  title: string;
  description?: string;
  images: any[];
  buttonText?: string;
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

// Default data (Re-indexed)
export const defaultOthersTemplate1Data: OthersTemplate1Data = {
  template: "others-1",
  heading: "Clarity You Can Trust",
  subtitle: "Features",
  description: "Experience the world through lenses crafted for perfection.",
  features: ["Precision-engineered lenses", "Lightweight frames"],
  image: {
    url: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=1000",
    alt: "Person wearing stylish glasses",
  },
  imagePosition: "left",
  buttonText: "Find Your Perfect Pair",
  buttonLink: "/products",
};

export const defaultOthersTemplate2Data: OthersTemplate2Data = {
  template: "others-2",
  items: [
    {
      id: "1",
      title: "Free Eye Test",
      description: "At partner clinics",
      icon: "Eye",
    },
  ],
};

export const defaultOthersTemplate3Data: OthersTemplate3Data = {
  template: "others-3",
  heading: "Why Choose NepGlass",
  description: "Thoughtfully designed eyewear.",
  items: [
    {
      id: "1",
      title: "Timeless Style",
      description: "Curated range",
      icon: "Sparkles",
    },
  ],
};

export const defaultOthersTemplate4Data: OthersTemplate4Data = {
  template: "others-4",
  heading: "How We Make Your Lenses",
  subtitle: "Our Process",
  steps: [
    {
      id: "step-1",
      title: "Precision Design",
      description: "Digital surfacing technology.",
      image: {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        alt: "Design",
      },
    },
  ],
};

export const defaultOthersTemplate5Data: OthersTemplate5Data = {
  template: "others-5",
  badge: "Why Choose us",
  heading: "Why We're Your Best Choice",
  features: [
    { id: "1", title: "Personalized Coaching", description: "Custom plans" },
  ],
  image: {
    url: "https://images.pexels.com/photos/36485447/pexels-photo-36485447.jpeg",
    alt: "Professional team",
  },
  accentColor: "#D4FF5F",
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
};

export const defaultOthersTemplate6Data: OthersTemplate6Data = {
  template: "others-6",
  title: "Process Overview",
  subtitle: "Process Overview",
  processCards: [
    {
      id: 1,
      number: "01",
      title: "Visa Voyage Agency",
      description: "Lorem Ipsum is simply dummy text the printing and typeser",
    },
    {
      id: 2,
      number: "02",
      title: "International Access Visas",
      description: "Lorem Ipsum is simply dummy text the printing and typeser",
    },
    {
      id: 3,
      number: "03",
      title: "Gateway to Global Citizenship",
      description: "Lorem Ipsum is simply dummy text the printing and typeser",
    },
  ],
};

export const defaultOthersTemplate7Data: OthersTemplate7Data = {
  template: "others-7",
  title: "The New Standard",
  images: [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ],
};

export const defaultOthersTemplate8Data: OthersTemplate8Data = {
  template: "others-8",
  title: "Power for Professionals",
  images: [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
