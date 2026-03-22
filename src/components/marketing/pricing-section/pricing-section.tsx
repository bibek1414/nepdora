import React from "react";
import { Check, Zap, Star, Crown, LucideIcon } from "lucide-react";
import ContactSection from "@/components/marketing/contact-us/contact-us";
import { PricingToggle, BillingDisplay } from "./pricing-client";

interface Plan {
  id: number;
  name: string;
  type: "free" | "premium" | "pro";
  description: string;
  icon: LucideIcon;
  isPopular: boolean;
  features: string[];
}

interface PlanColors {
  border: string;
  badge: string;
  button: string;
  iconBg: string;
  iconColor: string;
}

const plans: Plan[] = [
  {
    id: 1,
    name: "Free",
    type: "free",
    description: "Get organized and set up simple sales processes",
    icon: Zap,
    isPopular: false,
    features: [
      "Up to 3 team members",
      "Basic CRM features",
      "Email support",
      "5 GB storage",
      "Basic reporting",
      "Mobile app access",
    ],
  },
  {
    id: 2,
    name: "Premium",
    type: "premium",
    description: "Everything you need to boost performance and revenue",
    icon: Star,
    isPopular: true,
    features: [
      "Up to 25 team members",
      "Advanced CRM features",
      "Priority support",
      "100 GB storage",
      "Advanced analytics",
      "Custom integrations",
      "Automation workflows",
      "Team collaboration tools",
    ],
  },
  {
    id: 3,
    name: "Pro",
    type: "pro",
    description: "Customize without limits and access unrivaled support",
    icon: Crown,
    isPopular: false,
    features: [
      "Unlimited team members",
      "Enterprise CRM features",
      "24/7 dedicated support",
      "Unlimited storage",
      "Custom reporting & dashboards",
      "API access",
      "Advanced security features",
      "Custom training & onboarding",
      "SLA guarantee",
    ],
  },
];

const getPlanColors = (type: Plan["type"], isPopular: boolean): PlanColors => {
  if (isPopular) {
    return {
      border: "border-blue-500",
      badge: "bg-primary",
      button: "bg-primary hover:opacity-90",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    };
  }
  return {
    border: "border-gray-200",
    badge: "bg-gray-800",
    button: "bg-gray-900 hover:bg-gray-800",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
  };
};

const PricingSection: React.FC = () => {
  // We'll use a local state for the toggle by creating a client wrapper if needed,
  // but for this "Coming Soon" version, let's just make the section a Client Component
  // inside the Server Page, OR split it.
  // Let's stick to the split: the outer section remains server-rendered.

  return <PricingContent />;
};

// Moving the interactive part to a client component
import PricingContent from "./pricing-content";

export default PricingSection;
