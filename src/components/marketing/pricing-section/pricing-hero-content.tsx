"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Headphones, Clock, Zap, Star, Crown } from "lucide-react";
import { usePricingPlans } from "@/hooks/use-subscription";
import { Plan } from "@/types/subscription";
import {
  PricingHeaderAnimation,
  PricingToggleAnimation,
  SavingsBadgeAnimation,
  PricingCardAnimation,
} from "./pricing-hero-animations";

interface PricingHeroContentProps {
  initialPlans?: Plan[];
}

const PricingHeroContent: React.FC<PricingHeroContentProps> = ({ initialPlans }) => {
  const { data: plans } = usePricingPlans({ initialData: initialPlans });
  const [isYearly, setIsYearly] = useState(false);

  const topFeatures = [
    { icon: Headphones, text: "24/7 support" },
    { icon: Clock, text: "Cancel anytime" },
  ];

  const getPlanColors = (planType: string) => {
    return {
      background: "bg-white border border-gray-200 ",
      buttonBg: "bg-primary hover:bg-primary/80 text-white",
    };
  };

  const calculatePrice = (monthlyPrice: string) => {
    const price = parseFloat(monthlyPrice);
    if (isYearly) {
      return (price * 12 * 0.9).toFixed(0);
    }
    return price.toFixed(0);
  };

  const calculateSavings = (monthlyPrice: string) => {
    const price = parseFloat(monthlyPrice);
    return (price * 12 * 0.1).toFixed(0);
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString("en-NP");
  };

  const sortPlans = (plans: Plan[]) => {
    const order = { free: 1, premium: 2, pro: 3 };
    return [...plans].sort((a, b) => {
      const orderA = order[a.plan_type.toLowerCase() as keyof typeof order] || 999;
      const orderB = order[b.plan_type.toLowerCase() as keyof typeof order] || 999;
      return orderA - orderB;
    });
  };

  const sortedPlans = plans ? sortPlans(plans) : [];

  return (
    <section className="min-h-screen bg-white px-4 py-16 transition-colors">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <PricingHeaderAnimation>
            <h1 className="text-foreground mb-4 text-2xl font-extrabold tracking-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Pick a plan that&apos;s right for you
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              All of our plans are customized to fit the needs of small and large teams.
            </p>
          </PricingHeaderAnimation>

          <PricingToggleAnimation isYearly={isYearly}>
            <span className={`font-medium transition-colors duration-200 ${!isYearly ? "text-gray-900" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`focus:ring-primary relative h-7 w-14 rounded-full transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                isYearly ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <motion.span
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md"
              />
            </button>
            <span className={`font-medium transition-colors duration-200 ${isYearly ? "text-gray-900" : "text-gray-500"}`}>
              Yearly
            </span>
            <SavingsBadgeAnimation isYearly={isYearly}>
              SAVE 10%
            </SavingsBadgeAnimation>
          </PricingToggleAnimation>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            {topFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <feature.icon className="h-4 w-4 text-blue-600" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {sortedPlans.map((plan, index) => {
            const colors = getPlanColors(plan.plan_type);
            const availableFeatures = [...plan.features].sort((a, b) => a.order - b.order);
            const isCenterCard = plan.plan_type.toLowerCase() === "premium";
            const displayPrice = calculatePrice(plan.price);
            const savings = calculateSavings(plan.price);

            return (
              <PricingCardAnimation key={plan.id} index={index} isCenter={isCenterCard}>
                <div className={`relative flex h-full flex-col ${colors.background}`}>
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
                    <p className="text-sm text-black/90 mt-2">
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
                      <button className={`rounded-full px-10 font-semibold transition-all duration-200 ${colors.buttonBg} py-3`}>
                        {plan.plan_type.toLowerCase() === "free" ? "Get Started Free" : "Try for Free"}
                      </button>
                    </Link>
                  </div>

                  <div className={`flex-1 p-6 ${isCenterCard ? "pb-8" : "pb-6"}`}>
                    <div className="space-y-4">
                      {availableFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm text-gray-700">{feature.feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PricingCardAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingHeroContent;
