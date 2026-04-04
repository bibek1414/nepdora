import React from "react";
import { ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroAnimations } from "./hero-animations";
import HeroFadeIn from "./hero-fade-in";

const Hero: React.FC = () => {
  return (
    <section className="overflow-hidden bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Left Content */}
          <HeroFadeIn className="max-w-xl flex-1 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <TrendingUp size={12} className="text-slate-600" />
              <span className="text-[11px] font-medium text-slate-600 sm:text-xs">
                For Nepali Business Owners - Build All Kind of Websites Build
              </span>
            </div>

            <h2 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Build your Website in 5 minutes.
            </h2>

            <p className="mb-8 max-w-md text-sm leading-relaxed font-normal text-slate-600 sm:text-base md:text-lg">
              Tell us about your business and your website will be live within 5
              Minutes, totally customized for your business. We handle the
              design, payments, and logistics so you can just sell your products
              and services.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button variant="default" rounded={true}>
                Start Building Free
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </HeroFadeIn>

          {/* Right Animation (Client Component) */}
          <HeroAnimations />
        </div>
      </div>
    </section>
  );
};

export default Hero;
