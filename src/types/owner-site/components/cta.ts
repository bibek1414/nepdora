export interface CTAButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
}

export interface CTATemplate4Feature {
  id: string;
  text: string;
}

export interface CTATemplate1Data {
  template: "cta-1";
  eyebrow: string;
  title: string;
  button: CTAButton;
  features: CTATemplate4Feature[];
  imageUrl: string;
  imageAlt?: string;
  backgroundColor?: string;
  showOverlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

export interface CTATemplate2Data {
  template: "cta-2";
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  image1: string;
  image2: string;
  image3: string;
  backgroundColor?: string;
}

export interface CTATemplate3Stat {
  id: string;
  value: string;
  label: string;
}

export interface CTATemplate3Data {
  template: "cta-3";
  badge: string;
  title: string;
  description: string;
  button1Text: string;
  button1Href?: string;
  button2Text: string;
  button2Href?: string;
  stats: CTATemplate3Stat[];
  imageUrl: string;
  imageAlt?: string;
}

export interface CTATemplate4Data {
  template: "cta-4";
  title: string;
  buttonText: string;
  buttonHref?: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface CTATemplate5Data {
  template: "cta-5";
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface CTATemplate6Data {
  template: "cta-6";
  eyebrow: string;
  title: string;
  buttons: CTAButton[];
}

export interface CTATemplate7Data {
  template: "cta-7";
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export interface CTATemplate8Data {
  template: "cta-8";
  title: string;
  description: string;
  button1Text: string;
  button1Href: string;
  button2Text: string;
  button2Href: string;
}

// Union type for all CTA templates
export type CTAData =
  | CTATemplate1Data
  | CTATemplate2Data
  | CTATemplate3Data
  | CTATemplate4Data
  | CTATemplate5Data
  | CTATemplate6Data
  | CTATemplate7Data
  | CTATemplate8Data;

// Component and API interfaces
export interface CTAComponentData {
  id: string | number;
  component_id: string;
  component_type?: "cta";
  data: CTAData;
  type?: "cta";
  order: number;
  page?: number;
}

export const defaultCTATemplate1Data: CTATemplate1Data = {
  template: "cta-1",
  eyebrow: "[CTA]",
  title: "Work with Experts to Grow Faster & Run Smarter",
  button: {
    id: "cta-4-btn-1",
    text: "Get Started",
    variant: "primary",
    href: "#",
  },
  features: [
    { id: "cta-4-feature-1", text: "Schedule a Free Consultation" },
    { id: "cta-4-feature-2", text: "Discover Custom Solutions" },
    {
      id: "cta-4-feature-3",
      text: "Start Building Your Competitive Advantage",
    },
  ],
  imageUrl: "https://picsum.photos/id/1011/800/800",
  imageAlt: "Working together",
  backgroundColor: "#1D4ED8",
  showOverlay: true,
  overlayColor: "#0F172A",
  overlayOpacity: 0.2,
};

export const defaultCTATemplate2Data: CTATemplate2Data = {
  template: "cta-2",
  title:
    "<em class='italic font-normal'>Ready To Embark</em> On Your Next Adventure?",
  description:
    "Are you prepared to embark on your next thrilling escapade? Whether you're yearning for a tranquil retreat amidst nature's embrace or seeking adrenaline-pumping adventures in far-off lands, now is the perfect moment to seize the opportunity.",
  buttonText: "BOOK NOW",
  buttonHref: "#",
  image1: "https://images.pexels.com/photos/4004058/pexels-photo-4004058.jpeg",
  image2: "https://images.pexels.com/photos/4645982/pexels-photo-4645982.jpeg",
  image3: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg",
  backgroundColor: "#F5F3EF",
};

export const defaultCTATemplate3Data: CTATemplate3Data = {
  template: "cta-3",
  badge: "Free Consultation",
  title: "Ready to Start Your Study Abroad Journey?",
  description:
    "Get personalized guidance from our expert counselors. We've helped 2,000+ students achieve their dreams.",
  button1Text: "Book Free Consultation",
  button1Href: "#",
  button2Text: "Call Now",
  button2Href: "tel:+9771234567890",
  imageUrl:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop",
  imageAlt: "Students celebrating graduation",
  stats: [
    { id: "cta-3-stat-1", value: "2,000+", label: "Students Placed" },
    { id: "cta-3-stat-2", value: "98%", label: "Visa Success" },
    { id: "cta-3-stat-3", value: "5", label: "Countries" },
  ],
};

export const defaultCTATemplate4Data: CTATemplate4Data = {
  template: "cta-4",
  title: "Ready for Your Best <br class='hidden md:block' /> Skin Yet?",
  buttonText: "Book a Consultation",
  buttonHref: "#",
  imageUrl:
    "https://cdn.prod.website-files.com/6918bd445678e83950693c7b/692ae1f85a3938e08bd09b53_CTA%2001%20(1).avif",
  imageAlt: "Skincare texture background",
};

export const defaultCTATemplate5Data: CTATemplate5Data = {
  template: "cta-5",
  title: "Let’s Design Your Space",
  description:
    "Partner with Nepdora to create spaces that reflect your vision, enhance functionality, and stand the test of time.",
  buttonText: "Start Your Project",
  buttonHref: "#",
  imageUrl:
    "https://cdn.prod.website-files.com/6883a66d1ebb4685edc545ce/688a5b011779274c81245d83_inside-firm-archipro-webflow-template.jpg",
  imageAlt: "Modern architectural workspace",
};

export const defaultCTATemplate6Data: CTATemplate6Data = {
  template: "cta-6",
  eyebrow: "Let's talk",
  title: "Have a project in mind? I'd love to hear about it.",
  buttons: [
    { id: "1", text: "Send a note", variant: "primary", href: "#" },
    { id: "2", text: "View resume", variant: "outline", href: "#" },
  ],
};

export const defaultCTATemplate7Data: CTATemplate7Data = {
  template: "cta-7",
  title: "Not sure where to start? Begin with a discovery sprint.",
  description:
    "A two-week engagement to map the opportunity, audit what exists and recommend the right path forward — with no obligation to continue.",
  buttonText: "Talk to us",
  buttonHref: "#",
};

export const defaultCTATemplate8Data: CTATemplate8Data = {
  template: "cta-8",
  title: "Ready to build your dream?",
  description:
    "Let us bring your architectural vision to life. Schedule a free consultation with our design team today.",
  button1Text: "Schedule consultation",
  button1Href: "#",
  button2Text: "Get price estimate",
  button2Href: "#",
};

// Default data map for all CTA templates
export const DEFAULT_CTA_MAP: Record<CTAData["template"], CTAData> = {
  "cta-1": defaultCTATemplate1Data,
  "cta-2": defaultCTATemplate2Data,
  "cta-3": defaultCTATemplate3Data,
  "cta-4": defaultCTATemplate4Data,
  "cta-5": defaultCTATemplate5Data,
  "cta-6": defaultCTATemplate6Data,
  "cta-7": defaultCTATemplate7Data,
  "cta-8": defaultCTATemplate8Data,
};

// Type guards for each template
export const isCTATemplate1 = (data: CTAData): data is CTATemplate1Data =>
  data.template === "cta-1";

export const isCTATemplate2 = (data: CTAData): data is CTATemplate2Data =>
  data.template === "cta-2";

export const isCTATemplate3 = (data: CTAData): data is CTATemplate3Data =>
  data.template === "cta-3";

export const isCTATemplate4 = (data: CTAData): data is CTATemplate4Data =>
  data.template === "cta-4";

export const isCTATemplate5 = (data: CTAData): data is CTATemplate5Data =>
  data.template === "cta-5";

export const isCTATemplate6 = (data: CTAData): data is CTATemplate6Data =>
  data.template === "cta-6";

export const isCTATemplate7 = (data: CTAData): data is CTATemplate7Data =>
  data.template === "cta-7";

export const isCTATemplate8 = (data: CTAData): data is CTATemplate8Data =>
  data.template === "cta-8";
