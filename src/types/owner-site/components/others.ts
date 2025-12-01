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

// Union type for all others templates
export type OthersData =
  | OthersTemplate1Data
  | OthersTemplate2Data
  | OthersTemplate3Data;

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

// Helper functions
export const getDefaultOthersData = (
  template: OthersData["template"]
): OthersData => {
  switch (template) {
    case "others-1":
      return defaultOthersTemplate1Data;
    case "others-2":
      return defaultOthersTemplate2Data;
    case "others-3":
      return defaultOthersTemplate3Data;
    default:
      return defaultOthersTemplate1Data;
  }
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
