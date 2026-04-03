"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Plan } from "@/types/subscription";
import { PricingCardAnimation } from "./pricing-hero-animations";

interface PricingCardProps {
  plan: Plan;
  index: number;
  isYearly: boolean;
  displayPrice: string;
  savings: string;
  formatPrice: (price: string) => string;
}

const getPlanColors = (planType: string) => {
  return {
    background: "bg-white border border-gray-200 ",
    buttonBg: "bg-primary hover:bg-primary/80 text-white",
  };
};

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  index,
  isYearly,
  displayPrice,
  savings,
  formatPrice,
}) => {
  const colors = getPlanColors(plan.plan_type);
  const availableFeatures = [...plan.features].sort((a, b) => a.order - b.order);
  const isCenterCard = plan.plan_type.toLowerCase() === "premium";

  return (
    <PricingCardAnimation key={plan.id} index={index} isCenter={isCenterCard}>
      <div className={`relative flex h-full flex-col ${colors.background} rounded-3xl shadow-sm hover:shadow-md transition-shadow`}>
        {plan.is_popular && (
          <div className="absolute top-0 left-0 z-10 w-full -translate-y-1/2">
            <div className="bg-primary mt-10 w-full px-6 py-2 text-center text-sm font-bold text-white shadow-lg">
              RECOMMENDED
            </div>
          </div>
        )}

        <div className={`mt-6 p-6 text-center ${isCenterCard ? "pb-8" : "pb-6"}`}>
          <h3 className={`font-bold ${isCenterCard ? "text-2xl" : "text-xl"}`}>
            {plan.name}
          </h3>
          <p className="mt-2 text-sm text-black/90">
            {plan.plan_type.toLowerCase() === "free"
              ? "Get organized and set up simple sales processes"
              : plan.plan_type.toLowerCase() === "premium"
                ? "Everything you need to boost performance and revenue"
                : "Customize without limits and access unrivaled support"}
          </p>
        </div>

        <div className={`border-b border-gray-200 p-2 text-center ${isCenterCard ? "pb-8" : "pb-6"}`}>
          <div className="mb-4 flex items-baseline justify-center gap-1">
            <span className="font-medium text-gray-600">Rs.</span>
            <span className={`text-primary font-mono font-bold ${isCenterCard ? "text-4xl" : "text-4xl"}`}>
              {formatPrice(displayPrice)}
            </span>
            <span className="font-medium text-gray-600">
              {isYearly ? "/year" : "/month"}
            </span>
          </div>

          {isYearly && parseFloat(savings) > 0 && (
            <p className="mb-3 text-xs font-medium text-green-600">
              Save Rs. {formatPrice(savings)} per year!
            </p>
          )}

          <Link href="/admin/signup">
            <button className={`rounded-full px-10 font-semibold transition-all duration-200 ${colors.buttonBg} py-3 w-4/5 mx-auto`}>
              {plan.plan_type.toLowerCase() === "free" ? "Get Started Free" : "Try for Free"}
            </button>
          </Link>
        </div>

        <div className={`flex-1 p-6 ${isCenterCard ? "pb-8" : "pb-6"}`}>
          <div className="space-y-4">
            {availableFeatures.map(feature => (
              <div key={feature.id} className="flex items-start gap-3 text-left">
                <Check className="text-primary h-5 w-5 shrink-0" />
                <span className="text-sm text-gray-700">{feature.feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PricingCardAnimation>
  );
};
