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
        <div className="grid items-center lg:grid-cols-2">
          {/* Left side content */}
          <div className="text-center lg:pr-4 lg:text-left xl:pr-8">
            {/* Discount badge */}
            {/* <div className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-2 text-xs sm:px-4 sm:text-xs">
              Website + Social Media In a Single Place
            </div> */}

            {/* Main heading */}
            <h1 className="text-foreground mb-3 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              Build Any Website With Nepdora
            </h1>

            {/* Features list */}
            <div className="mx-auto max-w-md space-y-3 sm:space-y-4 lg:mx-0">
              {[
                "E-comerce Website",
                "Business Website",
                "Agency Website",
                " 100+ websites for any types of Business",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center space-x-3 lg:justify-start"
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                    <Check className="text-primary h-5 w-5 font-bold" />
                  </div>
                  <span className="text-muted-foreground text-sm font-medium sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-10 space-y-3 pt-2 sm:space-y-4">
              <Link href="/admin/signup">
                <Button className="bg-primary hover:bg-primary mb-2 h-16 w-full transform rounded-full px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-105 sm:w-auto sm:px-8 sm:text-lg">
                  Create your website for free
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side image - FIXED ASPECT RATIO */}
          <div className="relative order-first lg:order-last">
            <div className="ml-auto w-full max-w-lg lg:max-w-none">
              <Image
                src="/nepdora.jpg"
                alt="Website builder interface showing drag and drop functionality"
                width={500}
                height={100}
                className="ml-auto h-auto w-[70%] rounded-lg"
                style={{ objectFit: "contain" }}
                priority
                quality={85}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteBuilderHero;
