"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Check,
  Headphones,
  Shield,
  Clock,
  Zap,
  Star,
  Crown,
  Loader2,
} from "lucide-react";
import { usePricingPlans } from "@/hooks/use-subscription";
import { Plan } from "@/types/subscription";

const AnimatedPricingSection = () => {
  const { data: plans, isLoading, error } = usePricingPlans();

  const topFeatures = [
    { icon: Headphones, text: "24/7 support" },
    { icon: Clock, text: "Cancel anytime" },
  ];

  const getPlanIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case "free":
        return Zap;
      case "premium":
        return Star;
      case "pro":
        return Crown;
      default:
        return Zap;
    }
  };

  const getPlanColors = (planType: string, isPopular: boolean) => {
    if (isPopular) {
      return {
        background: "bg-gradient-to-br from-purple-500 to-purple-600",
        textColor: "text-white",
      };
    }
    switch (planType.toLowerCase()) {
      case "free":
        return {
          background: "bg-gradient-to-br from-indigo-500 to-indigo-600",
          textColor: "text-white",
        };
      case "premium":
        return {
          background: "bg-gradient-to-br from-purple-500 to-purple-600",
          textColor: "text-white",
        };
      case "pro":
        return {
          background: "bg-gradient-to-br from-pink-500 to-pink-600",
          textColor: "text-white",
        };
      default:
        return {
          background: "bg-gradient-to-br from-indigo-500 to-indigo-600",
          textColor: "text-white",
        };
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num.toLocaleString("en-NP");
  };

  const getPeriodDisplay = (unit: string) => {
    return unit === "year" ? "/yr" : "/mo";
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

  if (isLoading) {
    return (
      <section className="bg-background min-h-screen px-4 py-16 transition-colors">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background min-h-screen px-4 py-16 transition-colors">
        <div className="mx-auto max-w-7xl">
          <div className="py-20 text-center">
            <p className="text-destructive">
              Failed to load pricing plans. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const sortedPlans = plans ? sortPlans(plans) : [];

  return (
    <section className="bg-background mt-40 min-h-screen px-4 py-16 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-2 text-center text-3xl font-extrabold text-black md:text-5xl">
            Find the Perfect Nepdora Plan
          </div>
          {/* Top Features */}
          <div className="text-muted-foreground flex flex-wrap justify-center gap-8 text-sm">
            {topFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <feature.icon className="h-4 w-4" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto flex w-fit flex-wrap justify-center gap-6">
          {sortedPlans.map(plan => {
            const PlanIcon = getPlanIcon(plan.plan_type);
            const colors = getPlanColors(plan.plan_type, plan.is_popular);
            const availableFeatures = plan.features
              .filter(f => f.is_available)
              .sort((a, b) => a.order - b.order)
              .slice(0, 5);

            return (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`relative h-[470px] w-80 shrink-0 overflow-hidden rounded-xl p-8 ${colors.background} shadow-lg transition-shadow hover:shadow-2xl`}
              >
                <div className="relative z-10 text-white">
                  {/* Icon & Badge */}

                  {/* Plan Name */}
                  <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>

                  {/* Price */}
                  <div className="my-4 block">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium">NPR</span>
                      <span className="font-mono text-5xl font-black">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-lg font-medium">
                        {getPeriodDisplay(plan.unit)}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-16 space-y-2">
                    {availableFeatures.map(feature => (
                      <div key={feature.id} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span className="text-sm text-white/90">
                          {feature.feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link href="/admin/signup">
                  <button className="absolute right-4 bottom-4 left-4 z-20 rounded-lg border-2 border-white bg-white py-3 text-center font-mono font-black text-neutral-800 uppercase backdrop-blur-sm transition-all duration-200 hover:border-white/80 hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none">
                    Choose Plan
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnimatedPricingSection;
