"use client";

import React, { useState } from "react";
import { Check, Zap, Star, Crown, Sparkles, LucideIcon } from "lucide-react";
import ContactSection from "@/components/marketing/contact-us/contact-us";

interface Feature {
  text: string;
}

interface Plan {
  id: number;
  name: string;
  type: "free" | "premium" | "pro";
  description: string;
  icon: LucideIcon;
  isPopular: boolean;
  features: string[];
}

interface PlanColors {
  border: string;
  badge: string;
  button: string;
  iconBg: string;
  iconColor: string;
}

const AnimatedPricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(false);

  const plans: Plan[] = [
    {
      id: 1,
      name: "Free",
      type: "free",
      description: "Get organized and set up simple sales processes",
      icon: Zap,
      isPopular: false,
      features: [
        "Up to 3 team members",
        "Basic CRM features",
        "Email support",
        "5 GB storage",
        "Basic reporting",
        "Mobile app access",
      ],
    },
    {
      id: 2,
      name: "Premium",
      type: "premium",
      description: "Everything you need to boost performance and revenue",
      icon: Star,
      isPopular: true,
      features: [
        "Up to 25 team members",
        "Advanced CRM features",
        "Priority support",
        "100 GB storage",
        "Advanced analytics",
        "Custom integrations",
        "Automation workflows",
        "Team collaboration tools",
      ],
    },
    {
      id: 3,
      name: "Pro",
      type: "pro",
      description: "Customize without limits and access unrivaled support",
      icon: Crown,
      isPopular: false,
      features: [
        "Unlimited team members",
        "Enterprise CRM features",
        "24/7 dedicated support",
        "Unlimited storage",
        "Custom reporting & dashboards",
        "API access",
        "Advanced security features",
        "Custom training & onboarding",
        "SLA guarantee",
      ],
    },
  ];

  const getPlanColors = (
    type: Plan["type"],
    isPopular: boolean
  ): PlanColors => {
    if (isPopular) {
      return {
        border: "border-blue-500",
        badge: "bg-primary",
        button: "bg-primary hover:opacity-90",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      };
    }
    return {
      border: "border-gray-200",
      badge: "bg-gray-800",
      button: "bg-gray-900 hover:bg-gray-800",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    };
  };

  return (
    <>
      <section className="relative min-h-screen bg-linear-to-b from-gray-50 to-white px-4 py-16">
        {/* Decorative Blurs */}
        <div className="pointer-events-none absolute top-20 -left-20 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
        <div className="pointer-events-none absolute top-40 -right-20 h-64 w-64 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>

        <div className="relative mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pick a plan that's right for{" "}
              <span className="text-primary">you</span>
            </h1>

            <p className="mx-auto mb-6 max-w-xl text-sm text-gray-600">
              All of our plans are customized to fit the needs of small and
              large teams.
            </p>

            {/* Billing Toggle */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <span
                className={`text-sm font-medium transition-colors ${!isYearly ? "text-gray-900" : "text-gray-500"}`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative h-7 w-14 rounded-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  isYearly ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label="Toggle billing period"
              >
                <span
                  className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                    isYearly ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors ${isYearly ? "text-gray-900" : "text-gray-500"}`}
              >
                Yearly
              </span>
              {isYearly && (
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  SAVE 10%
                </span>
              )}
            </div>

            {/* Top Features */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-green-600" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-green-600" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan: Plan, index: number) => {
              const colors = getPlanColors(plan.type, plan.isPopular);
              const Icon = plan.icon;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-xl border-2 bg-white transition-all duration-300 ${
                    colors.border
                  } ${plan.isPopular ? "scale-105 lg:scale-105" : ""}`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute -top-4 right-0 left-0 mx-auto w-max">
                      <div
                        className={`rounded-full ${colors.badge} px-4 py-1.5 text-xs font-bold text-white shadow-lg`}
                      >
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Icon & Title */}
                    <div className="mb-5">
                      <div
                        className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${colors.iconBg}`}
                      >
                        <Icon className={`h-5 w-5 ${colors.iconColor}`} />
                      </div>
                      <h3 className="mb-1.5 text-xl font-bold text-gray-900">
                        {plan.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="mb-5 border-t border-b border-gray-200 py-5">
                      <div className="mb-1.5 flex items-baseline justify-start gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-start text-xs text-gray-500">
                        {isYearly ? "Billed annually" : "Billed monthly"}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`mb-5 w-full rounded-lg ${colors.button} px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105`}
                    >
                      {plan.type === "free"
                        ? "Get Started Free"
                        : "Start Free Trial"}
                    </button>

                    {/* Features */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-gray-900">
                        What's included:
                      </p>
                      {plan.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-xs text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-600">
              Need a custom plan?{" "}
              <a
                href="#contact"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Contact our sales team
              </a>
            </p>
          </div>
        </div>
      </section>
      <ContactSection />
      <div className="mb-40"></div>
    </>
  );
};

export default AnimatedPricingSection;
