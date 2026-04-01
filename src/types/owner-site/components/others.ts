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

export interface OthersDestination {
  id: string;
  name: string;
  image: {
    url: string;
    alt: string;
  };
  top: number;
  left: number;
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
  | OthersTemplate8Data
  | OthersTemplate9Data
  | OthersTemplate10Data
  | OthersTemplate11Data
  | OthersTemplate12Data
  | OthersTemplate13Data
  | OthersTemplate14Data
  | OthersTemplate15Data
  | OthersTemplate16Data;

export interface OthersProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface OthersRoutineStep {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface OthersRoutine {
  id: string;
  title: string;
  description: string;
  icon: string;
  stepCount: string;
  steps: OthersRoutineStep[];
}

export interface OthersTemplate9Data {
  template: "others-9";
  label: string;
  title: string;
  subtitle: string;
  routines: OthersRoutine[];
}

export interface OthersTip {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface OthersTemplate10Data {
  template: "others-10";
  label: string;
  title: string;
  subtitle: string;
  tips: OthersTip[];
}

export interface OthersTemplate11Data {
  template: "others-11";
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  stats: OthersStatistic[];
  destinations: OthersDestination[];
}

export interface OthersTemplate12Data {
  template: "others-12";
  heading: string;
  buttonText: string;
  buttonLink: string;
  image: {
    url: string;
    alt: string;
  };
  steps: OthersProcessItem[];
}

export interface OthersTemplate13Data {
  template: "others-13";
  stats: OthersStatistic[];
}
export interface OthersTemplate14Data {
  template: "others-14";
  heading: string;
  description: string;
  steps: OthersProcessStep[];
}

export interface OthersFeature15 {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface OthersTemplate15Data {
  template: "others-15";
  badge: string;
  heading: string;
  description: string;
  trustBadges: OthersStatistic[];
  features: OthersFeature15[];
}

export interface OthersProgramItem {
  id: string;
  title: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
}

export interface OthersTemplate16Data {
  template: "others-16";
  badge: string;
  heading: string;
  programs: OthersProgramItem[];
  trustBadgeLabel: string;
  trustBadgeText: string;
}
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
  buttonLink: "#",
};

export const defaultOthersTemplate2Data: OthersTemplate2Data = {
  template: "others-2",
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

export const defaultOthersTemplate3Data: OthersTemplate3Data = {
  template: "others-3",
  heading: "Why Choose NepGlass",
  description: "Thoughtfully designed eyewear.",
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

export const defaultOthersTemplate4Data: OthersTemplate4Data = {
  template: "others-4",
  heading: "How We Make Your Lenses",
  subtitle: "Our Process",
  steps: [
    {
      id: "step-1",
      title: "Precision Design",
      description:
        "Digital surfacing technology ensures lenses match your prescription perfectly.",
      image: {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1171&auto=format&fit=crop",
        alt: "Precision Design",
      },
    },
    {
      id: "step-2",
      title: "Advanced Manufacturing",
      description:
        "High-quality materials and meticulous craftsmanship create durable, lightweight lenses.",
      image: {
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        alt: "Advanced Manufacturing",
      },
    },
    {
      id: "step-3",
      title: "Expert Fitting",
      description:
        "Our specialists ensure lenses fit your frames and eyes comfortably for daily use.",
      image: {
        url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop",
        alt: "Expert Fitting",
      },
    },
    {
      id: "step-4",
      title: "Quality Assurance",
      description:
        "Each lens is tested for clarity, durability, and compliance with premium standards.",
      image: {
        url: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=1000",
        alt: "Quality Assurance",
      },
    },
  ],
};

export const defaultOthersTemplate5Data: OthersTemplate5Data = {
  template: "others-5",
  badge: "Why Choose us",
  heading: "Why We're Your Best Choice",
  features: [
    {
      id: "1",
      title: "Personalized Coaching Plans",
      description:
        "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod",
    },
    {
      id: "2",
      title: "Proven Success Strategies",
      description:
        "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod",
    },
    {
      id: "3",
      title: "Flexible Scheduling Options",
      description:
        "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod",
    },
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

export const defaultOthersTemplate9Data: OthersTemplate9Data = {
  template: "others-9",
  label: "The basics",
  title: "Your daily routine, simplified",
  subtitle:
    "Every great skin day starts with the right order. Here's the essential structure — morning and night.",
  routines: [
    {
      id: "morning",
      title: "Morning Routine",
      description: "Protect & prep",
      icon: "☀️",
      stepCount: "5 steps",
      steps: [
        {
          id: "m-1",
          name: "Cleanser",
          description: "Removes overnight oil and impurities",
          icon: "🧴",
        },
        {
          id: "m-2",
          name: "Toner",
          description: "Balances pH and preps skin",
          icon: "💧",
        },
        {
          id: "m-3",
          name: "Serum",
          description: "Targets concerns — acne, glow, pigmentation",
          icon: "✨",
        },
        {
          id: "m-4",
          name: "Moisturizer",
          description: "Locks in hydration and plumps skin",
          icon: "🌿",
        },
        {
          id: "m-5",
          name: "Sunscreen",
          description: "Shields from UV damage — never skip",
          icon: "🛡️",
        },
      ],
    },
    {
      id: "night",
      title: "Night Routine",
      description: "Repair & restore",
      icon: "🌙",
      stepCount: "4 steps",
      steps: [
        {
          id: "n-1",
          name: "Cleanser",
          description: "Deep clean — remove makeup, SPF, pollutants",
          icon: "🧴",
        },
        {
          id: "n-2",
          name: "Toner",
          description: "Rebalances and soothes skin",
          icon: "💧",
        },
        {
          id: "n-3",
          name: "Treatment / Serum",
          description: "Retinol, AHA, niacinamide — repair overnight",
          icon: "🔬",
        },
        {
          id: "n-4",
          name: "Night Cream",
          description: "Rich moisture barrier while you sleep",
          icon: "🌙",
        },
      ],
    },
  ],
};

export const defaultOthersTemplate10Data: OthersTemplate10Data = {
  template: "others-10",
  label: "Expert advice",
  title: "Skincare tips that matter",
  subtitle: "Simple, science-backed habits to get the most from your routine.",
  tips: [
    {
      id: "1",
      icon: "🧪",
      title: "Layer thinnest to thickest",
      description:
        "Always apply products from lightest to heaviest — serums before moisturizers — so actives can absorb properly.",
    },
    {
      id: "2",
      icon: "⏱️",
      title: "Wait between steps",
      description:
        "Give each layer 30–60 seconds to absorb before the next. This prevents pilling and improves efficacy.",
    },
    {
      id: "3",
      icon: "☀️",
      title: "Sunscreen is non-negotiable",
      description:
        "SPF protects against premature aging, dark spots, and skin cancer. Apply every single morning, rain or shine.",
    },
    {
      id: "4",
      icon: "🔄",
      title: "Introduce actives slowly",
      description:
        "Start new actives like retinol or AHA once or twice a week. Build frequency gradually to avoid irritation.",
    },
    {
      id: "5",
      icon: "💤",
      title: "Sleep is your best serum",
      description:
        "Skin repairs itself at night. A consistent sleep schedule amplifies the effect of your nighttime routine.",
    },
    {
      id: "6",
      icon: "💦",
      title: "Hydration starts from within",
      description:
        "Topical moisturizers help, but drinking enough water and a balanced diet are foundational to glowing skin.",
    },
  ],
};

export const defaultOthersTemplate11Data: OthersTemplate11Data = {
  template: "others-11",
  title: "Our Favourite Destinations",
  description:
    "Step into a world of wonder as we reveal our handpicked selection of favourite destinations, each promising a unique blend of captivating experiences and breathtaking beauty.",
  buttonText: "Learn More",
  buttonLink: "#",
  stats: [
    {
      id: "stat-1",
      value: "95%",
      label: "Client Satisfaction",
    },
    {
      id: "stat-2",
      value: "55+",
      label: "Destinations\nWorldwide",
    },
  ],
  destinations: [
    {
      id: "dest-1",
      name: "Spain",
      image: {
        url: "https://picsum.photos/seed/spain/600/600",
        alt: "Spain",
      },
      top: 20,
      left: 160,
    },
    {
      id: "dest-2",
      name: "India",
      image: {
        url: "https://picsum.photos/seed/india/600/600",
        alt: "India",
      },
      top: 190,
      left: 0,
    },
    {
      id: "dest-3",
      name: "Brazil",
      image: {
        url: "https://picsum.photos/seed/brazil/600/600",
        alt: "Brazil",
      },
      top: 190,
      left: 320,
    },
    {
      id: "dest-4",
      name: "New Zealand",
      image: {
        url: "https://picsum.photos/seed/nz/600/600",
        alt: "New Zealand",
      },
      top: 360,
      left: 160,
    },
  ],
};

export const defaultOthersTemplate12Data: OthersTemplate12Data = {
  template: "others-12",
  heading: "Simplify Your Vacation Planning Experience",
  buttonText: "Book Now",
  buttonLink: "#",
  image: {
    url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=800&auto=format&fit=crop",
    alt: "Happy travelers",
  },
  steps: [
    {
      id: "01",
      title: "Consultation",
      description:
        "Begin by scheduling a consultation with our experienced travel experts. During this session, we'll discuss your preferences, interests, and budget to understand your travel goals fully.",
    },
    {
      id: "02",
      title: "Customized Itinerary Creation",
      description:
        "Based on your consultation, our team will craft a personalized itinerary tailored to your specifications. We'll handle all the details, from selecting accommodations and arranging transportation to curating activities and excursions.",
    },
    {
      id: "03",
      title: "Review and Adjustments",
      description:
        "Once the itinerary is complete, we'll present it to you for review. We welcome your feedback and are happy to make any necessary adjustments to ensure it meets your expectations and desires.",
    },
    {
      id: "04",
      title: "Seamless Execution",
      description:
        "With your approval, we'll take care of all the arrangements, leaving you free to relax and anticipate your upcoming adventure.",
    },
  ],
};
export const defaultOthersTemplate13Data: OthersTemplate13Data = {
  template: "others-13",
  stats: [
    { id: "stat-1", value: "10+", label: "Years Experience" },
    { id: "stat-2", value: "1000+", label: "Students Placed" },
    { id: "stat-3", value: "100+", label: "Partner Universities" },
    { id: "stat-4", value: "98%", label: "Visa Success Rate" },
  ],
};

export const defaultOthersTemplate14Data: OthersTemplate14Data = {
  template: "others-14",
  heading: "Your Journey to Study Abroad",
  description:
    "A simple, transparent process that takes you from dream to reality in 6 easy steps",
  steps: [
    {
      id: "step-1",
      number: "01",
      title: "Free Counseling",
      description:
        "Meet our expert counselors to discuss your goals, budget, and preferences",
      icon: "MessageSquare",
    },
    {
      id: "step-2",
      number: "02",
      title: "University Selection",
      description:
        "We shortlist the best universities and courses based on your profile",
      icon: "Search",
    },
    {
      id: "step-3",
      number: "03",
      title: "Application & Docs",
      description:
        "Complete support with applications, SOPs, and document preparation",
      icon: "FileText",
    },
    {
      id: "step-4",
      number: "04",
      title: "Offer Letter",
      description: "Receive admission offers from your chosen universities",
      icon: "CheckCircle",
    },
    {
      id: "step-5",
      number: "05",
      title: "Visa Processing",
      description:
        "Expert guidance through the entire visa application process",
      icon: "Plane",
    },
    {
      id: "step-6",
      number: "06",
      title: "Pre-Departure",
      description:
        "Final briefing, accommodation help, and airport pickup arrangement",
      icon: "GraduationCap",
    },
  ],
};

export const defaultOthersTemplate15Data: OthersTemplate15Data = {
  template: "others-15",
  badge: "Why Choose Us",
  heading: "Nepal's Most Trusted Education Consultancy",
  description:
    "For over 15 years, Nep Expert has been transforming dreams into reality. We combine expertise with personalized attention to ensure your success.",
  trustBadges: [
    { id: "trust-1", value: "2009", label: "Established" },
    { id: "trust-2", value: "A+", label: "Rating" },
    { id: "trust-3", value: "Licensed", label: "By Govt." },
  ],
  features: [
    {
      id: "f-1",
      icon: "Shield",
      title: "100% Genuine Guidance",
      description:
        "No fake promises. We provide honest counseling based on your profile and realistic chances.",
    },
    {
      id: "f-2",
      icon: "Users",
      title: "Experienced Counselors",
      description:
        "Our team has helped 10,000+ students achieve their study abroad dreams successfully.",
    },
    {
      id: "f-3",
      icon: "Clock",
      title: "Fast Processing",
      description:
        "Quick application processing with dedicated support throughout your journey.",
    },
    {
      id: "f-4",
      icon: "Award",
      title: "High Success Rate",
      description:
        "98% visa success rate and excellent track record with top universities worldwide.",
    },
    {
      id: "f-5",
      icon: "HeartHandshake",
      title: "End-to-End Support",
      description:
        "From first consultation to airport pickup abroad — we're with you every step.",
    },
    {
      id: "f-6",
      icon: "Globe",
      title: "500+ University Partners",
      description:
        "Direct partnerships with leading universities across USA, UK, Australia, Canada & NZ.",
    },
  ],
};

export const defaultOthersTemplate16Data: OthersTemplate16Data = {
  template: "others-16",
  badge: "Our Programs",
  heading:
    "Empowering global change through dedicated support and immediate action",
  programs: [
    {
      id: "p-1",
      title: "Education fosters lasting hope",
      description:
        "Providing access to education that empowers to a brighter future.",
      image: {
        url: "https://picsum.photos/seed/edu-1/600/400",
        alt: "Education fosters lasting hope",
      },
    },
    {
      id: "p-2",
      title: "Nutritious meals that restore hope",
      description:
        "Providing healthy, hearty food to those who need it most.",
      image: {
        url: "https://picsum.photos/seed/food-1/600/400",
        alt: "Nutritious meals that restore hope",
      },
    },
    {
      id: "p-3",
      title: "Empowering lives through skills",
      description:
        "Offering training programs that equip individuals with valuable skills.",
      image: {
        url: "https://picsum.photos/seed/skills-1/600/400",
        alt: "Empowering lives through skills",
      },
    },
  ],
  trustBadgeLabel: "Trust",
  trustBadgeText:
    "Join the 850+ partners funding our essential child safety initiatives",
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
  "others-9": defaultOthersTemplate9Data,
  "others-10": defaultOthersTemplate10Data,
  "others-11": defaultOthersTemplate11Data,
  "others-12": defaultOthersTemplate12Data,
  "others-13": defaultOthersTemplate13Data,
  "others-14": defaultOthersTemplate14Data,
  "others-15": defaultOthersTemplate15Data,
  "others-16": defaultOthersTemplate16Data,
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
export const isOthersTemplate9 = (
  data: OthersData
): data is OthersTemplate9Data => data.template === "others-9";
export const isOthersTemplate10 = (
  data: OthersData
): data is OthersTemplate10Data => data.template === "others-10";
export const isOthersTemplate11 = (
  data: OthersData
): data is OthersTemplate11Data => data.template === "others-11";
export const isOthersTemplate12 = (
  data: OthersData
): data is OthersTemplate12Data => data.template === "others-12";
export const isOthersTemplate13 = (
  data: OthersData
): data is OthersTemplate13Data => data.template === "others-13";
export const isOthersTemplate14 = (
  data: OthersData
): data is OthersTemplate14Data => data.template === "others-14";
export const isOthersTemplate15 = (
  data: OthersData
): data is OthersTemplate15Data => data.template === "others-15";
export const isOthersTemplate16 = (
  data: OthersData
): data is OthersTemplate16Data => data.template === "others-16";
