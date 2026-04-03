"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
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

  return (
    <section className="bg-slate-50 py-24 pb-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-5xl">
            Transparent Pricing for {category.replace("-", " ")}s
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            No hidden costs. Choose a plan that fits your current business needs.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {pricing.map((item) => (
            <div
              key={item.id}
              className={`relative flex flex-col items-center overflow-hidden rounded-3xl bg-white p-10 shadow-lg transition-transform hover:-translate-y-2 hover:shadow-xl ${item.is_popular ? "border-2 border-blue-500 shadow-blue-100" : ""}`}
            >
              {item.is_popular && (
                <div className="absolute top-6 right-[-45px] rotate-45 bg-blue-500 px-12 py-1 text-xs font-bold uppercase text-white">
                  Most Popular
                </div>
              )}
              <h3 className="mb-6 text-2xl font-bold text-slate-900 uppercase">
                {item.name}
              </h3>
              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                  {item.price === "0" || item.price === "Free" ? "Free" : `Rs. ${item.price}`}
                </span>
                {item.price !== "0" && item.price !== "Free" && (
                  <span className="ml-1 text-xl font-medium text-slate-500">
                    /{item.unit === "year" ? "yr" : "mo"}
                  </span>
                )}
              </div>
              <ul className="mb-12 w-full space-y-5">
                {item.features.map((feature, fIndex) => (
                  <li
                    key={feature.id || fIndex}
                    className="flex items-center gap-4 text-lg text-slate-600"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 p-1">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    {feature.feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full py-7 text-lg font-bold ${item.is_popular ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900 hover:bg-slate-800"}`}
                asChild
              >
                <a href="#analyze-now">Get Started Now</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
