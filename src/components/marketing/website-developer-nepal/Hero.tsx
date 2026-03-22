import React from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroFadeIn from "@/components/marketing/hero-section/hero-fade-in";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HeroFadeIn>
          <div className="text-center">
            <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold text-slate-900 sm:text-5xl lg:text-4xl">
              Nepal&apos;s Smartest Alternative to Hiring a Website Developer
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Stop waiting on developers. Build your Nepal business website
              today.
              <span className="mt-4 block font-medium text-slate-900">
                The average website developer in Nepal takes 4–12 weeks and
                charges Rs. 30,000 to Rs. 2,00,000+. Nepdora gets you online in
                30 minutes — for a fraction of the cost.
              </span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/admin/signup">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold"
                  rounded={true}
                >
                  Start Building Free <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </HeroFadeIn>
      </div>
    </section>
  );
};

export default Hero;
