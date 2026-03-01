import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Concierge: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <div className="flex-1">
            <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              Our team will help you built it
            </h2>
            <p className="mb-6 text-sm text-slate-600 sm:text-base md:text-lg">
              Too busy to build it yourself? Our team will set up your site,
              products, services, and payment gateways at no extra cost.
            </p>

            <ul className="mb-6 space-y-2 sm:mb-8 sm:space-y-2.5">
              {[
                "Professional setup by experts",
                "Payment gateway integration",
                "1-on-1 onboarding session",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-sm text-slate-700 sm:text-base"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 sm:h-5 sm:w-5">
                    <Check
                      size={10}
                      strokeWidth={3}
                      className="text-slate-700 sm:h-3 sm:w-3"
                    />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-sm sm:text-base"
            >
              Chat with an Expert
            </Button>
          </div>

          <div className="w-full flex-1">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop"
                alt="Team working"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Concierge;
