import React from "react";
import PricingHeroContent from "./pricing-hero-content";
import { Plan } from "@/types/subscription";

interface PricingSectionHeroProps {
  initialPlans?: Plan[];
}

const PricingSectionHero: React.FC<PricingSectionHeroProps> = ({
  initialPlans,
}) => {
  return <PricingHeroContent initialPlans={initialPlans} />;
};

export default PricingSectionHero;
