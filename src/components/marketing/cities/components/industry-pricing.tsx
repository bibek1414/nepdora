"use client";

import React from "react";
import { PricingCard } from "../../pricing-section/pricing-card";
import { Loader2 } from "lucide-react";
import { usePricingPlans } from "@/hooks/use-subscription";

interface IndustryPricingProps {
  category: string;
}

export const IndustryPricing: React.FC<IndustryPricingProps> = ({
  category,
}) => {
  const { data: pricing, isLoading } = usePricingPlans();

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
    <section className="bg-slate-50 py-24 pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl">
            Transparent Pricing for {category.replace("-", " ")}s
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            No hidden costs. Choose a plan that fits your current business needs.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {sortedPlans.map((item, index) => (
            <PricingCard
              key={item.id}
              plan={item}
              index={index}
              isYearly={false}
              displayPrice={item.price}
              savings="0"
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
