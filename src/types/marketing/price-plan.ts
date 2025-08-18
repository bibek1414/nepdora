export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  cta: string;
  popular: boolean;
  color: "primary" | "secondary" | "accent";
}