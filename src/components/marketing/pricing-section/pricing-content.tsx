"use client";

import { Check, Zap, Star, Crown, LucideIcon, Headphones, Clock, Loader2 } from "lucide-react";
import ContactSection from "@/components/marketing/contact-us/contact-us";
import { PricingToggle, BillingDisplay } from "./pricing-client";
import { useSubscriptionStatus, usePricingPlans } from "@/hooks/use-subscription";
import { MarketingPricingCard, MarketingPlan } from "./marketing-pricing-card";


const PricingContent: React.FC = () => {
  const { data: plans, isLoading } = usePricingPlans();
  const { data: subscription } = useSubscriptionStatus();

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

  const sortedPlans = plans ? sortPlans(plans) : [];

  return (
    <>
      <section className="relative min-h-screen bg-linear-to-b from-gray-50 to-white px-4 py-16 font-sans">
        <div className="pointer-events-none absolute top-20 -left-20 h-64 w-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
        <div className="pointer-events-none absolute top-40 -right-20 h-64 w-64 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>

        <div className="relative mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pick a plan that's right for{" "}
              <span className="text-primary">you</span>
            </h1>
            <p className="mx-auto mb-6 max-w-xl text-sm text-gray-600">
              All of our plans are customized to fit the needs of small and
              large teams.
            </p>

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

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {sortedPlans.map((plan: any) => {
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
                  cta: plan.plan_type.toLowerCase() === "free" ? "Get Started Free" : "Start Free Trial",
                  href: "/admin/signup",
                  features: plan.features.map((f: any) => f.feature),
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
          )}

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

export default PricingContent;
