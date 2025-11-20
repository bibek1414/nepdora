"use client";

import React, { useState } from "react";
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
  const [isYearly, setIsYearly] = useState(false);

  const topFeatures = [
    { icon: Headphones, text: "24/7 support" },
    { icon: Clock, text: "Cancel anytime" },
  ];

  const getPlanColors = (planType: string, isPopular: boolean) => {
    switch (planType.toLowerCase()) {
      default:
        return {
          background: "bg-white border border-gray-200 ",
          headerBg: "bg-primary",
          textColor: "text-gray-900",
          headerText: "text-black",
          priceColor: "primary",
          buttonBg: "bg-primary hover:bg-primary/80 text-white",
        };
    }
  };
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
  ("use client");
  const calculatePrice = (monthlyPrice: string) => {
    const price = parseFloat(monthlyPrice);

    if (isYearly) {
      // Calculate yearly price with 10% discount for ALL plans
      const yearlyPrice = price * 12 * 0.9; // 10% discount
      return yearlyPrice.toFixed(0);
    }
    return price.toFixed(0);
  };

  const calculateSavings = (monthlyPrice: string) => {
    const price = parseFloat(monthlyPrice);
    // Calculate savings for ALL plans (even if price is 0 now, it might change later)
    return (price * 12 * 0.1).toFixed(0); // 10% of yearly cost
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num.toLocaleString("en-NP");
  };

  const getPeriodDisplay = () => {
    return isYearly ? "/year" : "/month";
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
      <section className="min-h-screen bg-gray-50 px-4 py-16 transition-colors">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 px-4 py-16 transition-colors">
        <div className="mx-auto max-w-7xl">
          <div className="py-20 text-center">
            <p className="text-red-600">
              Failed to load pricing plans. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const sortedPlans = plans ? sortPlans(plans) : [];

  return (
    <section className="min-h-screen bg-white px-4 py-16 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-foreground mb-4 text-2xl font-extrabold tracking-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
          >
            Pick a plan that&apos;s right for you
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-gray-600"
          >
            All of our plans are customized to fit the needs of small and large
            teams.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 flex items-center justify-center gap-4"
          >
            <span
              className={`font-medium transition-colors duration-200 ${!isYearly ? "text-gray-900" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`focus:ring-primary relative h-7 w-14 rounded-full transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                isYearly ? "bg-primary" : "bg-gray-300"
              }`}
              aria-label="Toggle billing period"
            >
              <motion.span
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md"
              />
            </button>
            <span
              className={`font-medium transition-colors duration-200 ${isYearly ? "text-gray-900" : "text-gray-500"}`}
            >
              Yearly
            </span>
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isYearly ? 1 : 0,
                opacity: isYearly ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
            >
              SAVE 10%
            </motion.span>
          </motion.div>

          {/* Top Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 text-sm text-gray-600"
          >
            {topFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <feature.icon className="h-4 w-4 text-blue-600" />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {sortedPlans.map((plan, index) => {
            const colors = getPlanColors(plan.plan_type, plan.is_popular);

            // Show all features without filtering, just sort by order
            const availableFeatures = plan.features.sort(
              (a, b) => a.order - b.order
            );

            const isCenterCard = plan.plan_type.toLowerCase() === "premium";
            const displayPrice = calculatePrice(plan.price);
            const savings = calculateSavings(plan.price);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`relative flex h-full flex-col rounded-2xl ${colors.background} overflow-hidden ${
                  isCenterCard ? "scale-105" : "mt-15 scale-100"
                } duration-300`}
              >
                {/* Popular Badge */}
                {plan.is_popular && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute top-0 left-0 z-10 w-full -translate-y-1/2"
                  >
                    <div className="bg-primary mt-10 w-full px-6 py-2 text-center text-sm font-bold text-white shadow-lg">
                      RECOMMENDED
                    </div>
                  </motion.div>
                )}
                {!plan.is_popular && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute top-0 left-0 z-10 w-full -translate-y-1/2"
                  >
                    <div className="bg-primary mt-5 w-full px-6 py-2 text-center text-sm font-bold text-white shadow-lg"></div>
                  </motion.div>
                )}

                {/* Card Header */}
                <div
                  className={` ${colors.headerText} mt-6 p-6 text-center ${
                    isCenterCard ? "pb-8" : "pb-6"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <h3
                      className={`font-bold ${isCenterCard ? "text-2xl" : "text-xl"}`}
                    >
                      {plan.name}
                    </h3>
                  </div>
                  <p className="text-sm text-black/90">
                    {plan.plan_type.toLowerCase() === "free"
                      ? "Get organized and set up simple sales processes"
                      : plan.plan_type.toLowerCase() === "premium"
                        ? "Everything you need to boost performance and revenue"
                        : "Customize without limits and access unrivaled support"}
                  </p>
                </div>

                {/* Price Section */}
                <div
                  className={`border-b border-gray-200 p-2 text-center ${
                    isCenterCard ? "pb-8" : "pb-6"
                  }`}
                >
                  <div className="mb-4 flex items-baseline justify-center gap-1">
                    <span className="font-medium text-gray-600">Rs.</span>
                    <motion.span
                      key={`${plan.id}-${isYearly}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`text-primary font-mono font-bold ${
                        isCenterCard ? "text-4xl" : "text-4xl"
                      }`}
                    >
                      {formatPrice(displayPrice)}
                    </motion.span>
                    <span className="font-medium text-gray-600">
                      {getPeriodDisplay()}
                    </span>
                  </div>

                  {/* Show savings for ALL plans when yearly billing is selected and savings > 0 */}
                  {isYearly && parseFloat(savings) > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3 text-xs font-medium text-green-600"
                    >
                      Save Rs. {formatPrice(savings)} per year!
                    </motion.p>
                  )}

                  <Link href="/admin/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-full px-20 font-semibold transition-all duration-200 ${
                        colors.buttonBg
                      } ${isCenterCard ? "py-3 text-lg" : "py-3 text-base"}`}
                    >
                      {plan.plan_type.toLowerCase() === "free"
                        ? "Get Started Free"
                        : "Try for Free"}
                    </motion.button>
                  </Link>
                </div>

                {/* Features List */}
                <div className={`flex-1 p-6 ${isCenterCard ? "pb-8" : "pb-6"}`}>
                  <div className="space-y-4">
                    {availableFeatures.map((feature, idx) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={`bg-primary relative z-10 flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110`}
                        >
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">
                          {feature.feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnimatedPricingSection;
