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

// Union type for all CTA templates
export type CTAData = CTATemplate1Data | CTATemplate2Data;

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

// Default data map for all CTA templates
export const DEFAULT_CTA_MAP: Record<CTAData["template"], CTAData> = {
  "cta-1": defaultCTATemplate1Data,
  "cta-2": defaultCTATemplate2Data,
};

// Type guards for each template
export const isCTATemplate1 = (data: CTAData): data is CTATemplate1Data =>
  data.template === "cta-1";

export const isCTATemplate2 = (data: CTAData): data is CTATemplate2Data =>
  data.template === "cta-2";
