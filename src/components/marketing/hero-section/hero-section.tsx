import React from "react";
import { ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroAnimations } from "./hero-animations";
import { BusinessTypeSelector } from "./business-type-selector";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-0">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Left Content */}
          <div className="max-w-xl flex-1">
            <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Build your website in Nepal - From RS 833/Month
            </h1>

            <p className="mb-7 text-base leading-relaxed text-slate-500 sm:text-lg">
              Nepal&apos;s Simplest Way to Go Online. Build a professional
              website for your Nepali E-Commerce and Service business in
              minutes. eSewa &amp; Khalti payments, Nepali language, and hosting
              - all included.
            </p>

            {/* Business type links */}
            <div className="mb-8">
              <p className="mb-3 text-xs font-medium">
                Choose your business type
              </p>
              <BusinessTypeSelector />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default" rounded={true}>
                Start Building Free
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Link
                href="https://wa.me/9779866316114"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Chat on WhatsApp
              </Link>
            </div>
          </div>

          {/* Right Animation (Client Component) */}
          <HeroAnimations />
        </div>
      </div>
    </section>
  );
};

export default Hero;
