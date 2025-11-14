"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Choose how to build",
      description:
        "Describe what you need in a few sentences and let AI build a unique website for you — or pick from 150+ designer-made templates.",
      image: "/images/image1.avif",
    },
    {
      id: 2,
      title: "Customize your website",
      description:
        "Keep what you like. Discard what you don't. Easily move elements and experiment with different color schemes and fonts. No coding or web design skills required.",
      image: "/images/image2.avif",
    },
    {
      id: 3,
      title: "Go live",
      description:
        "Select the perfect domain name for your business or project, and launch your brand-new website with performance and security you can rely on.",
      image: "/images/image3.png",
    },
  ];

  const activeStepData = steps.find(step => step.id === activeStep);

  return (
    <section className="bg-background px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
              Create a website in 3<br />
              easy steps
            </h2>

            <div className="space-y-6">
              {steps.map(step => (
                <div
                  key={step.id}
                  className="cursor-pointer"
                  onClick={() => setActiveStep(step.id)}
                >
                  <div
                    className={`mb-3 text-xl font-semibold transition-colors duration-200 ${
                      activeStep === step.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {step.id}. {step.title}
                  </div>

                  {activeStep === step.id && (
                    <div className="border-primary mb-4 border-l-4 pl-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href={"/admin/signup"}>
                <Button size="lg" className="rounded-lg px-8 py-3 font-medium">
                  Start building for free
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="rounded-lg px-8 py-3 font-medium"
              >
                <a
                  href="https://docs.nepdora.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read Docs
                </a>
              </Button>
            </div>
          </div>

          {/* Right Content - Interactive Image Display */}
          <div className="relative">
            <div className="from-primary via-primary/90 to-secondary relative overflow-hidden rounded-3xl bg-gradient-to-br p-8">
              {/* Background decorative elements */}
              <div className="bg-secondary absolute top-4 left-4 h-16 w-16 rotate-12 transform rounded-lg"></div>
              <div className="bg-primary absolute top-8 left-8 h-8 w-8 rounded"></div>
              <div className="bg-muted-foreground absolute top-12 left-12 h-6 w-6 rounded"></div>
              <div className="bg-secondary absolute right-4 bottom-4 h-20 w-20 -rotate-12 transform rounded-lg"></div>

              {/* Go Live Button Mockup */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-end">
                  <div className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center space-x-2 rounded-lg px-6 py-2 transition-colors">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <Link href="/admin/signup">
                      <span className="font-medium">Go live</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Domain Name Display */}
              <div className="relative z-10 mb-6">
                <div className="bg-card flex items-center space-x-3 rounded-lg border p-3">
                  <span className="text-card-foreground font-medium">
                    nepdora.com
                  </span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dynamic Image Display */}
              <div className="bg-card relative z-10 rounded-xl border p-4">
                <div className="bg-muted relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={activeStepData?.image || "/images/placeholder.jpg"}
                    alt={`Step ${activeStep}: ${activeStepData?.title}`}
                    fill
                    className="object-cover transition-all duration-500 ease-in-out"
                    priority={activeStep === 1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
