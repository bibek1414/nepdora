"use client";
import React from "react";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const WebsiteBuilderHero = () => {
  return (
    <div className="bg-background mx-auto max-w-7xl">
      <div className="container mx-auto py-8 sm:py-12 lg:py-20">
        <div className="lgrid-cols-1 grid items-center lg:grid-cols-2">
          {/* Left side content */}
          <div className="space-y-6 text-center sm:space-y-8 lg:pr-4 lg:text-left xl:pr-8">
            {/* Discount badge */}
            <div className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm">
              Up to 75% off Website builder
            </div>

            {/* Main heading */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-foreground text-2xl leading-tight font-bold sm:text-2xl lg:text-2xl xl:text-3xl">
                <span className="text-primary">Create a website</span> with ease
              </h1>
            </div>

            {/* Features list */}
            <div className="mx-auto max-w-md space-y-3 sm:space-y-4 lg:mx-0">
              {[
                "Free domain name",
                "Build your site fast, with AI",
                "24/7 live customer support",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center space-x-3 lg:justify-start"
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                    <Check className="text-primary text-bold h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground text-sm font-medium sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="space-y-3 pt-2 sm:space-y-4">
              <Link href="/signup">
                <Button className="hover:bg-primary/90 text-primary-foreground mb-2 w-full transform rounded-xl bg-black px-6 py-3 text-xs font-semibold transition-all duration-200 hover:scale-105 sm:w-auto sm:px-8 sm:py-2 sm:text-xs">
                  Start now
                </Button>
              </Link>

              {/* Money back guarantee */}
              <div className="text-muted-foreground flex items-center justify-center space-x-2 text-xs sm:text-sm lg:justify-start">
                <Shield className="h-4 w-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="relative order-first lg:order-last">
            <div className="mx-auto w-full max-w-lg lg:max-w-none">
              <Image
                src="/images/marketing-hero.avif"
                alt="Website builder interface"
                width={800}
                height={800}
                className="h-auto w-full rounded-lg object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilderHero;
