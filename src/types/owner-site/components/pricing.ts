export interface PricingData {
  component_id?: string;
  style: "pricing-1" | "pricing-2" | "pricing-3" | "pricing-4";
  title: string;
  subtitle?: string;
  order?: number;
}

export interface PricingComponentData {
  id: string | number;
  component_type: "pricing";
  component_id: string;
  data: PricingData;
  order?: number;
  page?: string;
}

export const defaultPricingData: PricingData = {
  style: "pricing-1",
  title: "Our Pricing Plans",
  subtitle: "Choose the perfect plan for your needs",
};
