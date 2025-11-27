export interface CTAButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
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
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  showFeatureIcons?: boolean;
  featureIcons?: string[];
}

// Union type for all CTA templates
export type CTAData = CTATemplate1Data | CTATemplate2Data | CTATemplate3Data;

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

export interface ApiCTAComponentResponse {
  id: number;
  component_id: string;
  component_type: "cta";
  data: CTAData;
  order: number;
  page: number;
}

export interface CreateCTARequest {
  component_id?: string;
  component_type: "cta";
  data: CTAData;
  order?: number;
}

export interface UpdateCTARequest {
  component_id?: string;
  component_type?: "cta";
  data: Partial<CTAData>;
  order?: number;
}

export interface CreateCTAResponse {
  success: boolean;
  message: string;
  data: CTAComponentData;
}

export interface UpdateCTAResponse {
  success: boolean;
  message: string;
  data: CTAComponentData;
}

export interface DeleteCTAResponse {
  success: boolean;
  message: string;
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
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1374&auto=format&fit=crop",
  showFeatureIcons: true,
  featureIcons: ["✓", "✓", "✓"],
};

// Helper functions
export const getDefaultCTAData = (template: CTAData["template"]): CTAData => {
  switch (template) {
    case "cta-1":
      return defaultCTATemplate1Data;
    case "cta-2":
      return defaultCTATemplate2Data;
    case "cta-3":
      return defaultCTATemplate3Data;
    default:
      return defaultCTATemplate1Data;
  }
};

// Type guards for each template
export const isCTATemplate1 = (data: CTAData): data is CTATemplate1Data =>
  data.template === "cta-1";

export const isCTATemplate2 = (data: CTAData): data is CTATemplate2Data =>
  data.template === "cta-2";

export const isCTATemplate3 = (data: CTAData): data is CTATemplate3Data =>
  data.template === "cta-3";
