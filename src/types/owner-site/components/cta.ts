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

// Union type for all CTA templates
export type CTAData = CTATemplate1Data;

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

// Default data map for all CTA templates
export const DEFAULT_CTA_MAP: Record<CTAData["template"], CTAData> = {
  "cta-1": defaultCTATemplate1Data,
};

// Type guards for each template
export const isCTATemplate1 = (data: CTAData): data is CTATemplate1Data =>
  data.template === "cta-1";
