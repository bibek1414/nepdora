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
} from "lucide-react";

const PricingSection = () => {
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

  const plans = [
    {
      name: "Starter Nepdora",
      subtitle: "Perfect for small businesses getting started",
      price: "Free",
      originalPrice: null,
      discount: "FREE FOREVER",
      period: "",
      freeMonths: "No credit card required",
      isPopular: false,
      icon: Zap,
      websites: "1 website",
      mailboxes: "1 mailbox - free for 1 year",
      features: [
        "Free domain for 1 year",
        "Basic Nepdora AI",
        "50 templates",
        "Basic analytics",
        "Mobile editing",
        "SSL Certificate",
        "Email support",
      ],
    },
    {
      name: "Premium Nepdora",
      subtitle: "Get the essentials to create a website",
      price: "2.99",
      originalPrice: "10.99",
      discount: "75% OFF",
      period: "/mo",
      freeMonths: "+3 months free",
      isPopular: true,
      icon: Star,
      websites: "25 websites",
      mailboxes: "2 mailboxes per website - free for 1 year",
      features: [
        "Free domain for 1 year",
        "AI Nepdora",
        "150 templates",
        "Email marketing",
        "Marketing integrations",
        "Built-in analytics",
        "Mobile editing",
        "Priority support",
      ],
    },
    {
      name: "Business Nepdora",
      subtitle: "Grow with AI tools and ecommerce features",
      price: "3.99",
      originalPrice: "13.99",
      discount: "71% OFF",
      period: "/mo",
      freeMonths: "+3 months free",
      isPopular: false,
      icon: Crown,
      websites: "50 websites",
      mailboxes: "5 mailboxes per website - free for 1 year",
      features: [
        "Sell products and services",
        "0% transaction fees",
        "100+ payment methods",
        "AI text editor",
        "AI image generator",
        "AI blog post generator",
        "AI product generator",
        "AI logo maker",
        "AI SEO assistant",
        "24/7 phone support",
      ],
    },
  ];

  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-6 text-3xl font-bold md:text-4xl">
            Find the perfect Nepdora plan for you
          </h2>

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
          {plans.map((plan, index) => (
            <Link
              key={index}
              href="/signup"
              className={`bg-background relative block rounded-lg border transition-all duration-300 hover:shadow-xl ${
                plan.isPopular
                  ? "border-primary scale-105 transform border-2 shadow-xl"
                  : "border-border hover:border-muted-foreground/50 border"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="to-primary text-primary-foreground rounded-full bg-gradient-to-r from-purple-500 px-4 py-1 text-sm font-medium">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Icon */}
                <div
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    plan.isPopular
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <plan.icon className="h-6 w-6" />
                </div>

                {/* Discount Badge */}
                <div className="mb-4 text-center">
                  <span
                    className={`rounded px-3 py-1 text-sm font-bold ${
                      index === 0
                        ? "text-primary dark:text-primary/80 dark:bg-green-900/20"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {plan.discount}
                  </span>
                </div>

                <h3 className="text-foreground mb-2 text-center text-xl font-bold">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mb-6 text-center text-sm">
                  {plan.subtitle}
                </p>

                {/* Pricing */}
                <div className="mb-6 text-center">
                  {index === 0 ? (
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-foreground text-4xl font-bold">
                        {plan.price}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-muted-foreground text-sm">US$</span>
                      <span className="text-foreground text-4xl font-bold">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {plan.period}
                      </span>
                    </div>
                  )}
                  <div className="text-primary mt-1 text-sm font-medium">
                    {plan.freeMonths}
                  </div>
                </div>

                {/* Choose Plan Button */}
                <div
                  className={`mb-4 w-full rounded-md py-3 text-center font-medium transition-colors ${
                    plan.isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : index === 0
                        ? "bg-primary hover:bg-primary text-white"
                        : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground border"
                  }`}
                >
                  {index === 0
                    ? "Get Started Free"
                    : index === 2
                      ? "Contact Sales"
                      : "Choose plan"}
                </div>

                {/* Pricing Details */}
                {plan.originalPrice && (
                  <div className="text-muted-foreground mb-4 text-center text-xs leading-relaxed">
                    Get 48 months for US${" "}
                    {(parseFloat(plan.price) * 48).toFixed(2)} (regular price
                    US$ {(parseFloat(plan.originalPrice) * 48).toFixed(2)}).
                    Renews at US$ {plan.originalPrice}/mo.
                  </div>
                )}

                {/* Website & Mailbox Info */}
                <div className="space-y-3 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                      <div className="bg-muted-foreground h-2 w-2 rounded-full"></div>
                    </div>
                    <span className="text-foreground text-sm font-medium">
                      {plan.websites}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                      <div className="bg-muted-foreground h-2 w-2 rounded-full"></div>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {plan.mailboxes}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="pt-6">
                  <h4 className="text-foreground mb-4 font-medium">
                    {index === 0
                      ? "Starter benefits:"
                      : index === 1
                        ? "Premium benefits:"
                        : "Everything in Premium, plus:"}
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-foreground flex items-center gap-2 text-sm">
                          {feature}
                          {feature === "Email marketing" && (
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              NEW
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-muted-foreground mt-8 text-center text-xs">
          All plans are paid upfront. The monthly rate reflects the total plan
          price divided by the number of months in your plan.
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
