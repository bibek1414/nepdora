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

export interface AboutUs5Service {
  id: string;
  title: string;
  description: string;
  points: string[];
  image: string;
}

export interface AboutUs1Data {
  template: "about-1";
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

export const defaultAboutUs1Data: AboutUs1Data = {
  template: "about-1",
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

export interface AboutUs2Data {
  template: "about-2";
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

export const defaultAboutUs2Data: AboutUs2Data = {
  template: "about-2",
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

export interface AboutUs3Data {
  template: "about-3";
  title: string;
  subtitle: string;
  subSubtitle: string; // New field
  imageUrl: string;
  imageAlt: string;
}

export const defaultAboutUs3Data: AboutUs3Data = {
  template: "about-3",
  title: "Our Vision",
  subtitle: "Simple, Elegant, Effective.",
  subSubtitle:
    "We believe in crafting solutions that truly make a difference, solutions that go beyond the surface and create real impact. Every challenge is an opportunity to innovate, to design with both purpose and creativity. With precision and care, we transform ideas into meaningful outcomes that empower people. Our focus is always on building tools and experiences that inspire growth and progress. In everything we create, we strive to shape a future where positive change becomes possible.",
  imageUrl:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1770&auto=format&fit=crop",
  imageAlt: "A minimalist office setting with a computer and plants.",
};

export interface AboutUs4Data {
  template: "about-4";
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

export const defaultAboutUs4Data: AboutUs4Data = {
  template: "about-4",
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

export interface AboutUs5Data {
  template: "about-5";
  title: string;
  italicWord: string;
  buttonText: string;
  buttonLink: string;
  services: AboutUs5Service[];
}

export const defaultAboutUs5Data: AboutUs5Data = {
  template: "about-5",
  title: "Driving Growth Through Strategic Excellence",
  italicWord: "Excellence",
  buttonText: "Contact Us",
  buttonLink: "#",
  services: [
    {
      id: "01",
      title: "Strategy Consulting",
      description:
        "Guiding individuals and businesses with smart financial planning, investment advice, and long-term wealth strategies.",
      points: [
        "Personalized Financial Planning",
        "Investment & Portfolio Guidance",
        "Risk Management & Wealth Protection",
      ],
      image: "https://picsum.photos/id/1059/800/800",
    },
    {
      id: "02",
      title: "Market Insights and Analysis",
      description:
        "Deep dive analysis into market trends to position your business ahead of the curve.",
      points: [
        "Competitor Benchmarking",
        "Consumer Behavior Analysis",
        "Trend Forecasting",
      ],
      image: "https://picsum.photos/id/1060/800/800",
    },
    {
      id: "03",
      title: "Wealth & Finance Advisory",
      description:
        "Comprehensive financial structures to optimize tax efficiency and capital allocation.",
      points: ["Capital Allocation", "Tax Optimization", "M&A Advisory"],
      image: "https://picsum.photos/id/1070/800/800",
    },
    {
      id: "04",
      title: "Digital Transformation",
      description:
        "Leveraging technology to streamline operations and enhance customer experiences.",
      points: [
        "Tech Stack Audit",
        "Digital Workflow Integration",
        "Data Security",
      ],
      image: "https://picsum.photos/id/118/800/800",
    },
  ],
};

export interface AboutUs6Data {
  template: "about-6";
  badgeCount: string;
  badgeText: string;
  badgeDescription: string;
  smallTitle: string;
  title: string;
  highlightedText: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  mainImage: string;
  smallImage1: string;
  smallImage2: string;
}

export const defaultAboutUs6Data: AboutUs6Data = {
  template: "about-6",
  badgeCount: "35",
  badgeText: "Years' Experience in HR",
  badgeDescription: "We have Lots of Success Stories",
  smallTitle: "ACUVIC IS THE BEST SOLUTION",
  title: "Welcome to Digital",
  highlightedText: "HR Consulting",
  description:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure.",
  buttonText: "Explore More",
  buttonLink: "#",
  mainImage:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
  smallImage1:
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=300&auto=format&fit=crop",
  smallImage2:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=300&auto=format&fit=crop",
};

export interface AboutUs7Data {
  template: "about-7";
  title: string;
  description: string;
  visaAppliedLabel: string;
  visaApplied: string;
  visaTypeLabel: string;
  visaType: string;
  approvalLabel: string;
  approval: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  imageUrl: string;
  imageAlt: string;
}

export const defaultAboutUs7Data: AboutUs7Data = {
  template: "about-7",
  title: "Visa Got Approved for Eygpt",
  description:
    "Aliquam eros justo, posuere lobortis viverra laoreet matti ullamcorper posuere viverra .Aliquam eros justo, posuere lobortis viverra laoreet augue mattis fmentum ullamco rper viverra laoreet Aliquam eros justo, posuere lobortis viverra laoreet matti ullamc orper posuere viverra .Aliquam eros justo, posu Aliquam eros justo, posuere lobortis viverra laoreet matti ullamcorper posuere viverra .Aliquam eros justo, posuere lobo rtis viverra laoreet augue mattis fmentum ullamcorper viverra laoreet Aliquam eros justo, posuere lobortis viverra laoreet matti ullamcorper posuere",
  visaAppliedLabel: "Visa Applied:",
  visaApplied: "Visa Special",
  visaTypeLabel: "Visa Type:",
  visaType: "10 years +",
  approvalLabel: "Approval:",
  approval: "adbs@gmail.com",
  button1Text: "Apply For Visa",
  button1Link: "#",
  button2Text: "Read More Stories",
  button2Link: "#",
  imageUrl:
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2874&auto=format&fit=crop",
  imageAlt: "Visa approval document",
};

export interface AboutUs8Data {
  template: "about-8";
  sectionTag: string;
  title: string;
  italicWord: string;
  description: string;
  steps: Array<{
    id: string;
    stepNumber: string;
    icon: string;
    title: string;
    description: string;
  }>;
}

export const defaultAboutUs8Data: AboutUs8Data = {
  template: "about-8",
  sectionTag: "[Our Process]",
  title: "Step-by-Step to Business Growth",
  italicWord: "Business Growth",
  description:
    "How We Turn Strategy Into Measurable Success through our refined three-step methodology.",
  steps: [
    {
      id: "1",
      stepNumber: "01",
      icon: "Search",
      title: "Discover & Diagnose",
      description:
        "We start by understanding your needs and evaluating your outdoor space through a free consultation — in-person or virtual.",
    },
    {
      id: "2",
      stepNumber: "02",
      icon: "Puzzle",
      title: "Strategize & Plan",
      description:
        "We develop tailored, data-driven strategies designed to solve challenges, align with your goals and create a roadmap for success.",
    },
    {
      id: "3",
      stepNumber: "03",
      icon: "Rocket",
      title: "Execute & Optimize",
      description:
        "We work alongside your team to implement solutions, monitor progress and refine the strategy for maximum impact.",
    },
  ],
};

export interface AboutUs9Data {
  template: "about-9";
  eyebrow: string;
  title: string;
  description1: string;
  description2: string;
  description3: string;
  stats: AboutUsStat[];
}

export const defaultAboutUs9Data: AboutUs9Data = {
  template: "about-9",
  eyebrow: "My Story",
  title: "From curiosity to code",
  description1:
    "My journey into software development began with a simple curiosity about how things work on the web. What started as tweaking HTML pages quickly evolved into a deep passion for creating full-scale applications.",
  description2:
    "Over the years, I've honed my skills across the entire stack — from crafting pixel-perfect interfaces to designing robust backend architectures. I believe great software is invisible: it just works, beautifully.",
  description3:
    "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.",
  stats: [
    { id: "1", label: "Years of Experience", value: "5+" },
    { id: "2", label: "Projects Completed", value: "40+" },
    { id: "3", label: "Technologies Mastered", value: "15+" },
    { id: "4", label: "Cups of Coffee", value: "∞" },
  ],
};

export interface AboutUs10Data {
  template: "about-10";
  title: string;
  italicWord: string;
  description: string;
  statsValue: string;
  statsLabel: string;
  image: string;
  imageAlt: string;
  features: Array<{ id: string; text: string }>;
  buttonText: string;
  buttonLink: string;
}

export const defaultAboutUs10Data: AboutUs10Data = {
  template: "about-10",
  title:
    "Since 2019, we’ve delivered finance and automation solutions that streamline operations and boost financial performance.",
  italicWord: "finance and automation",
  description:
    "At Xinfin, We help businesses navigate complexity unlock to growth achieve lasting transformation with a team of experienced consultations, We can combine for strategic instant.",
  statsValue: "150+",
  statsLabel: "Successful Projects Delivered",
  image: "https://picsum.photos/id/1001/800/800",
  imageAlt: "Team Portrait",
  features: [
    { id: "1", text: "Financial Strategy & Planning" },
    { id: "2", text: "Process Automation Solutions" },
    { id: "3", text: "Real-Time Data Analytics" },
    { id: "4", text: "Virtual CFO Services" },
  ],
  buttonText: "Book a Free Call",
  buttonLink: "#",
};

export interface AboutUs11Data {
  template: "about-11";
  tag: string;
  title: string;
  italicWord: string;
  description1: string;
  description2: string;
  experienceYears: string;
  experienceLabel: string;
  clientsCount: string;
  clientsLabel: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
  floatingCardTitle: string;
  floatingCardDescription: string;
}

export const defaultAboutUs11Data: AboutUs11Data = {
  template: "about-11",
  tag: "[Who We Are]",
  title: "Your Trusted Financial & Compliance Partner",
  italicWord: "Partner",
  description1:
    "XInfin Consultants offers end-to-end financial, compliance, and business formation support designed for modern businesses.",
  description2:
    "With over 6+ years of cumulative experience and a portfolio of 250+ clients globally, we bring professionalism, integrity, and a client-centric approach to every engagement. Our mission is simple: to handle the complexities of finance and regulation so you can focus entirely on growth.",
  experienceYears: "6+",
  experienceLabel: "Years Experience",
  clientsCount: "250+",
  clientsLabel: "Global Clients",
  buttonText: "Learn More About Us",
  buttonLink: "/about",
  image:
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  imageAlt: "Financial Analysis",
  floatingCardTitle: "100% Compliant",
  floatingCardDescription:
    "We navigate complex regulatory landscapes so you don't have to.",
};

export interface AboutUs12Data {
  template: "about-12";
  missionTag: string;
  missionTitle: string;
  missionItalicWord: string;
  missionDescription: string;
  missionFeatures: Array<{ id: string; text: string }>;
  missionButtonText: string;
  missionButtonLink: string;
  missionImage: string;
  missionImageAlt: string;
  visionTag: string;
  visionTitle: string;
  visionItalicWord: string;
  visionDescription: string;
  visionFeatures: Array<{ id: string; text: string }>;
  visionButtonText: string;
  visionButtonLink: string;
  visionImage: string;
  visionImageAlt: string;
}

export const defaultAboutUs12Data: AboutUs12Data = {
  template: "about-12",
  missionTag: "[Our Mission]",
  missionTitle: "Empowering Your Financial Excellence",
  missionItalicWord: "Excellence",
  missionDescription:
    "At XInfin, our mission is to empower businesses worldwide with innovative financial solutions that streamline operations, enhance decision-making, and drive sustainable growth.",
  missionFeatures: [
    {
      id: "m1",
      text: "Deliver accurate, real-time financial insights for better decisions",
    },
    {
      id: "m2",
      text: "Automate processes to reduce costs and improve efficiency",
    },
    {
      id: "m3",
      text: "Build lasting partnerships founded on trust and measurable results",
    },
  ],
  missionButtonText: "Get Started",
  missionButtonLink: "/contact",
  missionImage:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  missionImageAlt: "XInfin Mission - Team Collaboration",
  visionTag: "[Our Vision]",
  visionTitle: "Leading The Future of Global Financial Services",
  visionItalicWord: "Future",
  visionDescription:
    "We envision becoming the global partner of choice for businesses seeking intelligent financial solutions, where technology and expertise converge to create lasting competitive advantages.",
  visionFeatures: [
    {
      id: "v1",
      text: "Pioneer innovative technologies that transform financial management",
    },
    {
      id: "v2",
      text: "Expand our global reach while maintaining personalized service",
    },
    {
      id: "v3",
      text: "Create a world where every business has access to CFO-level insights",
    },
  ],
  visionButtonText: "Get Started",
  visionButtonLink: "/contact",
  visionImage:
    "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80",
  visionImageAlt: "XInfin Vision - Global Innovation",
};

export interface AboutUs13Data {
  template: "about-13";
  badge: string;
  title: string;
  description: string;
  mainImage: string;
  secondaryImage: string;
  svgUrl: string;
}

export const defaultAboutUs13Data: AboutUs13Data = {
  template: "about-13",
  badge: "About Us",
  title: "Unveiling the Heart of Our Travel Passion",
  description:
    "Delve into the essence of our travel passion as we unveil the beating heart behind every journey, driven by a relentless pursuit of exploration and discovery.",
  mainImage:
    "https://images.pexels.com/photos/7368202/pexels-photo-7368202.jpeg",
  secondaryImage:
    "https://images.pexels.com/photos/29890131/pexels-photo-29890131.jpeg",
  svgUrl:
    "https://cdn.prod.website-files.com/65fab07abb0beb90e59749bd/660436b87c5c859535a7b7f6_Vector%207.svg",
};

// Union type for all about us templates
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
  | AboutUs10Data
  | AboutUs11Data
  | AboutUs12Data
  | AboutUs13Data;

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
    | Partial<AboutUs10Data>
    | Partial<AboutUs11Data>
    | Partial<AboutUs12Data>
    | Partial<AboutUs13Data>;
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

// Default data map for all about us templates
export const DEFAULT_ABOUT_MAP: Record<AboutUsData["template"], AboutUsData> = {
  "about-1": defaultAboutUs1Data,
  "about-2": defaultAboutUs2Data,
  "about-3": defaultAboutUs3Data,
  "about-4": defaultAboutUs4Data,
  "about-5": defaultAboutUs5Data,
  "about-6": defaultAboutUs6Data,
  "about-7": defaultAboutUs7Data,
  "about-8": defaultAboutUs8Data,
  "about-9": defaultAboutUs9Data,
  "about-10": defaultAboutUs10Data,
  "about-11": defaultAboutUs11Data,
  "about-12": defaultAboutUs12Data,
  "about-13": defaultAboutUs13Data,
};

// Type guards for each template
export const isAboutUsTemplate1 = (data: AboutUsData): data is AboutUs1Data =>
  data.template === "about-1";

export const isAboutUsTemplate2 = (data: AboutUsData): data is AboutUs2Data =>
  data.template === "about-2";

export const isAboutUsTemplate3 = (data: AboutUsData): data is AboutUs3Data =>
  data.template === "about-3";

export const isAboutUsTemplate4 = (data: AboutUsData): data is AboutUs4Data =>
  data.template === "about-4";

export const isAboutUsTemplate5 = (data: AboutUsData): data is AboutUs5Data =>
  data.template === "about-5";

export const isAboutUsTemplate6 = (data: AboutUsData): data is AboutUs6Data =>
  data.template === "about-6";

export const isAboutUsTemplate7 = (data: AboutUsData): data is AboutUs7Data =>
  data.template === "about-7";

export const isAboutUsTemplate8 = (data: AboutUsData): data is AboutUs8Data =>
  data.template === "about-8";

export const isAboutUsTemplate9 = (data: AboutUsData): data is AboutUs9Data =>
  data.template === "about-9";

export const isAboutUsTemplate10 = (data: AboutUsData): data is AboutUs10Data =>
  data.template === "about-10";

export const isAboutUsTemplate11 = (data: AboutUsData): data is AboutUs11Data =>
  data.template === "about-11";

export const isAboutUsTemplate12 = (data: AboutUsData): data is AboutUs12Data =>
  data.template === "about-12";

export const isAboutUsTemplate13 = (data: AboutUsData): data is AboutUs13Data =>
  data.template === "about-13";
