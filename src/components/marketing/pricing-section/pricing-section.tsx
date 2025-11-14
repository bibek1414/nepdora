"use client";

import React from "react";
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

const DynamicPricingSection = () => {
  const { data: plans, isLoading, error } = usePricingPlans();

  const topFeatures = [
    {
      icon: Headphones,
      text: "24/7 support",
    },
    {
      icon: Shield,
      text: "30-day money-back guarantee",
    },
    {
      icon: Clock,
      text: "Cancel anytime",
    },
  ];

  // Map plan types to icons
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

  // Map plan types to discount badges
  const getDiscountBadge = (planType: string) => {
    switch (planType.toLowerCase()) {
      case "free":
        return "FOR STARTERS";
      case "premium":
        return "FOR GROWING BUSINESS";
      case "pro":
        return "FOR BIG D2C BRANDS";
      default:
        return "SPECIAL OFFER";
    }
  };

  // Format price with commas
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num.toLocaleString("en-NP");
  };

  // Get period display
  const getPeriodDisplay = (unit: string) => {
    return unit === "year" ? "/yr" : "/mo";
  };

  // Sort plans by a custom order
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
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="text-foreground mb-6 text-3xl font-bold md:text-4xl">
            Find the perfect Nepdora plan for you
          </div>
          <p className="text-muted-foreground mb-8 text-lg">
            Nothing is free in this world - Choose quality that delivers results
          </p>

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
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {sortedPlans.map(plan => {
            const PlanIcon = getPlanIcon(plan.plan_type);
            const availableFeatures = plan.features
              .filter(f => f.is_available)
              .sort((a, b) => a.order - b.order);

            return (
              <Link
                key={plan.id}
                href="/admin/signup"
                className={`bg-background hover: relative block rounded-lg border transition-all duration-300 ${
                  plan.is_popular
                    ? "border-primary scale-105 transform border-2"
                    : "border-border hover:border-muted-foreground/50"
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-sm font-medium">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Icon */}
                  <div
                    className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                      plan.is_popular
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <PlanIcon className="h-6 w-6" />
                  </div>

                  {/* Discount Badge */}
                  <div className="mb-4 text-center">
                    <span className="bg-secondary text-secondary-foreground rounded px-3 py-1 text-xs font-bold tracking-wide uppercase">
                      {getDiscountBadge(plan.plan_type)}
                    </span>
                  </div>

                  <div className="text-foreground mb-2 text-center text-xl font-bold">
                    {plan.name}
                  </div>
                  <p className="text-muted-foreground mb-6 text-center text-sm">
                    {plan.tagline}
                  </p>

                  {/* Pricing */}
                  <div className="mb-6 text-center">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-muted-foreground text-sm">NPR</span>
                      <span className="text-foreground text-4xl font-bold">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {getPeriodDisplay(plan.unit)}
                      </span>
                    </div>
                    {plan.is_popular && (
                      <div className="text-primary mt-2 text-sm font-medium">
                        Best value
                      </div>
                    )}
                  </div>

                  {/* Choose Plan Button */}
                  <div
                    className={`mb-4 w-full rounded-md py-3 text-center font-medium transition-colors ${
                      plan.is_popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    Choose Plan
                  </div>

                  {/* Features */}
                  <div className="pt-6">
                    <div className="text-foreground mb-4 font-medium">
                      {plan.name} benefits:
                    </div>
                    <ul className="space-y-3">
                      {availableFeatures.map(feature => (
                        <li key={feature.id} className="flex items-start gap-3">
                          <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-foreground text-sm">
                              {feature.feature}
                            </span>
                            {feature.description && (
                              <p className="text-muted-foreground mt-1 text-xs">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-muted-foreground mt-8 text-center text-xs">
          All plans are billed annually. Pricing in Nepali Rupees (NPR). Monthly
          payment options available at checkout.
        </div>
      </div>
    </section>
  );
};

export default DynamicPricingSection;
