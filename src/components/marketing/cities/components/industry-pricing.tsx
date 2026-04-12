"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import {
  usePricingPlans,
  useSubscriptionStatus,
} from "@/hooks/use-subscription";
import {
  MarketingPricingCard,
  MarketingPlan,
} from "../../pricing-section/marketing-pricing-card";

interface IndustryPricingProps {
  category: string;
}

export const IndustryPricing: React.FC<IndustryPricingProps> = ({
  category,
}) => {
  const { data: pricing, isLoading } = usePricingPlans();
  const { data: subscription } = useSubscriptionStatus();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!pricing || pricing.length === 0) return null;

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString("en-NP");
  };

  const sortPlans = (plans: any[]) => {
    const order: Record<string, number> = { free: 1, premium: 2, pro: 3 };
    return [...plans].sort((a, b) => {
      const orderA = order[a.plan_type.toLowerCase()] || 999;
      const orderB = order[b.plan_type.toLowerCase()] || 999;
      return orderA - orderB;
    });
  };

  const sortedPlans = pricing ? sortPlans(pricing) : [];

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            No hidden costs. Pick a plan that fits where your business is today.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sortedPlans.map((item, index) => {
            const isCurrentPlan = !!(
              subscription?.active &&
              subscription?.plan?.toLowerCase() === item.name.toLowerCase()
            );

            const marketingPlan: MarketingPlan = {
              name: item.name,
              tagline:
                item.plan_type.toLowerCase() === "free"
                  ? "Get started with no commitment"
                  : item.plan_type.toLowerCase() === "premium"
                    ? "Everything your business needs to grow"
                    : "AI-powered tools for ambitious businesses",
              price: `NPR ${formatPrice(item.price)}`,
              period: "/month",
              featured: item.is_popular,
              cta:
                item.plan_type.toLowerCase() === "free"
                  ? "Start for Free"
                  : "Get Started",
              href: "/pricing",
              features: item.features.map((f: any) => f.feature),
              aiFeatures: item.plan_type.toLowerCase() === "pro",
            };

            return (
              <MarketingPricingCard
                key={item.id}
                plan={marketingPlan}
                isCurrentPlan={isCurrentPlan}
              />
            );
          })}

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
