"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSubscriptionStatus, usePricingPlans } from "@/hooks/use-subscription";
import { MarketingPricingCard, MarketingPlan } from "./marketing-pricing-card";

const formatPrice = (price: string) => {
  return parseFloat(price).toLocaleString("en-NP");
};

export function HomePricingSection() {
  const { data: plans, isLoading: isPlansLoading } = usePricingPlans();
  const { data: subscription } = useSubscriptionStatus();

  // Sorting plans by typical order: Free, Premium/Business, Pro
  const sortPlans = (plans: any[]) => {
    const order: Record<string, number> = { free: 1, premium: 2, business: 2, pro: 3 };
    return [...plans].sort((a, b) => {
      const orderA = order[a.plan_type.toLowerCase()] || 999;
      const orderB = order[b.plan_type.toLowerCase()] || 999;
      return orderA - orderB;
    });
  };

  const sortedPlans = plans ? sortPlans(plans) : [];

  const enterprisePlan: MarketingPlan = {
    name: "Enterprise",
    tagline: "Custom solutions for large organisations",
    price: "Custom",
    period: "",
    priceNote: "Talk to our team",
    featured: false,
    comingSoon: false,
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
  };

  if (isPlansLoading) {
    return (
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            How Much Does It Cost to Build a Website in Nepal?
          </h2>
          <p className="mx-auto text-sm leading-relaxed text-slate-600 sm:text-base">
            Transparent NPR pricing . Start free or go full-featured for NPR
            10,000/year.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sortedPlans.map(plan => {
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
              cta: plan.plan_type.toLowerCase() === "free" ? "Start for Free" : "Get Started",
              href: "/pricing",
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
          <MarketingPricingCard plan={enterprisePlan} />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          All paid plans include free SSL, hosting, and a 14-day trial. No
          credit card required.{" "}
          <Link
            href="/pricing"
            className="font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            View full pricing
          </Link>
        </p>
      </div>
    </section>
  );
}
