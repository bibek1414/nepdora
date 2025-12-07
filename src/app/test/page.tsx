import React from "react";
import { Button } from "@/components/ui/button"; // Adjust path to your Shadcn Button
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Standard Shadcn utility

interface PricingPlan {
  name: string;
  price: number;
  isPopular?: boolean; // Used to determine the green filled button
}

const plans: PricingPlan[] = [
  { name: "Stater Plan", price: 19 },
  { name: "Basic Plan", price: 29, isPopular: true },
  { name: "Premium Plan", price: 89 },
  { name: "Popular Plan", price: 49 },
  { name: "Master Plan", price: 57 },
  { name: "Gold Plan", price: 99 },
];

const features = [
  "Mistakes To Avoid",
  "Your Startup",
  "Knew About Fonts",
  "Knew About Fonts",
];

export default function PricingSection() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-[2rem] border border-gray-200 transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Header Section */}
              <div className="bg-[#f2f7f1] py-10 text-center">
                <h3 className="text-3xl font-medium text-[#0f2824]">
                  {plan.name}
                </h3>
              </div>

              {/* Body Section */}
              <div className="flex h-full flex-col bg-white p-8">
                {/* Price */}
                <div className="mb-8 text-center">
                  <span className="text-6xl font-bold text-[#0f2824]">
                    ${plan.price}
                  </span>
                  <span className="ml-1 text-xl font-medium text-[#0f2824]">
                    /mo
                  </span>
                </div>

                {/* Divider */}
                <div className="mb-8 h-px w-full bg-gray-200" />

                {/* Features List */}
                <ul className="mb-10 flex-grow space-y-4 pl-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check
                        className="h-5 w-5 text-[#84cc16]"
                        strokeWidth={3}
                      />
                      <span className="text-base font-light text-[#0f2824]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <div className="mt-auto flex justify-center pb-4">
                  <Button
                    className={cn(
                      "group rounded-full px-8 py-6 text-base transition-all duration-300",
                      plan.isPopular
                        ? "border-none bg-[#84cc16] text-white shadow-none hover:bg-[#65a30d]"
                        : "border border-[#84cc16] bg-transparent text-[#0f2824] hover:bg-[#f2f7f1]"
                    )}
                  >
                    Buy Plan
                    <ChevronRight
                      className={cn(
                        "ml-2 h-4 w-4 transition-transform group-hover:translate-x-1",
                        plan.isPopular ? "text-white" : "text-[#0f2824]"
                      )}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
