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

// Template-specific interfaces
export interface CTATemplate1Data {
  template: "cta-1";
  title: string;
  description?: string;
  buttons: CTAButton[];
  layout: "text-left" | "text-center" | "text-right";
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showOverlay?: boolean;
  overlayOpacity?: number;
}

export interface CTATemplate2Data {
  template: "cta-2";
  title: string;
  subtitle?: string;
  description?: string;
  buttons: CTAButton[];
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showBadge?: boolean;
  badgeText?: string;
}

export interface CTATemplate3Data {
  template: "cta-3";
  title: string;
  description?: string;
  buttons: CTAButton[];
  backgroundType: "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showFeatureIcons?: boolean;
  featureIcons?: string[];
}

export interface CTATemplate4Data {
  template: "cta-4";
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
export type CTAData =
  | CTATemplate1Data
  | CTATemplate2Data
  | CTATemplate3Data
  | CTATemplate4Data;

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

// Default data for each template
export const defaultCTATemplate1Data: CTATemplate1Data = {
  template: "cta-1",
  title: "Ready to Get Started?",
  description:
    "Join thousands of satisfied customers and experience the difference today.",
  buttons: [
    { id: "1", text: "Get Started", variant: "primary", href: "#" },
    { id: "2", text: "Learn More", variant: "outline", href: "#" },
  ],
  layout: "text-center",
  backgroundType: "color",
  backgroundColor: "#3B82F6",
  showOverlay: false,
};

export const defaultCTATemplate2Data: CTATemplate2Data = {
  template: "cta-2",
  title: "Limited Time Offer",
  subtitle: "Don't Miss Out",
  description:
    "Special discount available for a limited time. Upgrade your plan today!",
  buttons: [{ id: "1", text: "Claim Offer", variant: "primary", href: "#" }],
  backgroundType: "gradient",
  backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  showBadge: true,
  badgeText: "Sale",
};

export const defaultCTATemplate3Data: CTATemplate3Data = {
  template: "cta-3",
  title: "Start Your Free Trial",
  description:
    "No credit card required. Get full access to all features for 14 days.",
  buttons: [
    { id: "1", text: "Start Free Trial", variant: "primary", href: "#" },
    { id: "2", text: "Schedule Demo", variant: "secondary", href: "#" },
  ],
  backgroundType: "image",
  backgroundImageUrl:
    "/fallback/image-not-found.png",
  showFeatureIcons: true,
  featureIcons: ["✓", "✓", "✓"],
};

export const defaultCTATemplate4Data: CTATemplate4Data = {
  template: "cta-4",
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
  imageUrl: "/fallback/image-not-found.png",
  imageAlt: "Working together",
  backgroundColor: "#1D4ED8",
  showOverlay: true,
  overlayColor: "#0F172A",
  overlayOpacity: 0.2,
};

// Default data map for all CTA templates
export const DEFAULT_CTA_MAP: Record<CTAData["template"], CTAData> = {
  "cta-1": defaultCTATemplate1Data,
  "cta-2": defaultCTATemplate2Data,
  "cta-3": defaultCTATemplate3Data,
  "cta-4": defaultCTATemplate4Data,
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
