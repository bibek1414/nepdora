"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Headphones, Clock, Zap, Star, Crown } from "lucide-react";
import {
  usePricingPlans,
  useSubscriptionStatus,
} from "@/hooks/use-subscription";
import { Plan } from "@/types/subscription";
import { MarketingPricingCard, MarketingPlan } from "./marketing-pricing-card";
import {
  PricingHeaderAnimation,
  PricingToggleAnimation,
  SavingsBadgeAnimation,
} from "./pricing-hero-animations";

interface PricingHeroContentProps {
  initialPlans?: Plan[];
}

const PricingHeroContent: React.FC<PricingHeroContentProps> = ({
  initialPlans,
}) => {
  const { data: plans } = usePricingPlans({ initialData: initialPlans });
  const { data: subscription } = useSubscriptionStatus();

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString("en-NP");
  };

  const sortPlans = (plans: Plan[]) => {
    const order = { free: 1, premium: 2, pro: 3 };
    return [...plans].sort((a, b) => {
      const orderA =
        order[a.plan_type.toLowerCase() as keyof typeof order] || 999;
      const orderB =
        order[b.plan_type.toLowerCase() as keyof typeof order] || 999;
      return orderA - orderB;
    });
  };

  const sortedPlans = plans ? sortPlans(plans) : [];

  return (
    <section className="min-h-screen bg-white px-4 py-16 font-sans transition-colors">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <PricingHeaderAnimation>
            <h1 className="text-foreground mb-4 text-2xl font-extrabold tracking-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Pick a plan that&apos;s right for you
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              All of our plans are customized to fit the needs of small and
              large teams.
            </p>
          </PricingHeaderAnimation>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sortedPlans.map((plan, index) => {
            const isCurrentPlan = !!(
              subscription?.active &&
              subscription?.plan?.toLowerCase() === plan.name.toLowerCase()
            );

            const marketingPlan: MarketingPlan = {
              name: plan.name,
              tagline: plan.tagline,
              price: `NPR ${formatPrice(plan.price)}`,
              period: `/${plan.unit}`,
              featured: plan.is_popular,
              cta:
                plan.plan_type.toLowerCase() === "free"
                  ? "Get Started Free"
                  : "Try for Free",
              href: "/admin/signup",
              features: plan.features.map(f => f.feature),
              aiFeatures: plan.plan_type.toLowerCase() === "pro",
            };

            return (
              <MarketingPricingCard
                key={plan.id}
                plan={marketingPlan}
                isCurrentPlan={isCurrentPlan}
              />
            );
          })}

          {/* Static Enterprise Plan */}
          <MarketingPricingCard
            plan={{
              name: "Enterprise",
              tagline: "Custom solutions for large organisations",
              price: "Custom",
              period: "",
              featured: false,
              cta: "Contact Sales",
              href: "https://wa.me/9779866316114",
              features: [
                "Everything in Pro",
                "Unlimited Websites",
                "SLA Guarantee",
                "White-label Option",
                "On-premise Hosting",
                "Dedicated Account Manager",
              ],
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingHeroContent;
