"use client";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function AboutUs() {
  return (
    <div className="from-primary via-primary/90 to-secondary/90 bg-gradient-to-br">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h1 className="mb-8 text-4xl font-bold text-white md:text-6xl">
                About us
              </h1>
            </div>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                    Find your online success with{" "}
                    <span className="text-secondary">Nepdora</span>
                  </h2>
                  <p className="text-lg leading-relaxed text-white/90">
                    Nepdora is on a mission to make online presence accessible
                    to everyone worldwide – from developers to aspiring bloggers
                    and business owners. With our fast hosting technology,
                    AI-powered Website Builder, and easy-to-operate tools you
                    can succeed online faster and easier.
                  </p>
                </div>
              </div>
              {/* Right Visual */}
              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/images/about2.avif"
                    alt="Online success illustration"
                    width={600}
                    height={400}
                    className="h-auto w-full rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left Visual */}
              <div className="relative order-2 lg:order-1">
                <div className="relative z-10">
                  <Image
                    src="/images/about3.avif"
                    alt="Global recognition illustration"
                    width={600}
                    height={400}
                    className="h-auto w-full rounded-2xl"
                  />
                </div>
              </div>
              {/* Right Content */}
              <div className="order-1 space-y-8 lg:order-2">
                <div>
                  <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                    Empowering the world online
                  </h2>
                  <div className="space-y-6 text-lg text-white/90">
                    <p>
                      Nepdora is on a mission to make online presence accessible
                      to everyone — from creators and entrepreneurs to growing
                      businesses. With reliable hosting, an AI-powered Website
                      Builder, and powerful tools, we help millions bring their
                      ideas to life.
                    </p>
                    <p>
                      Trusted globally, we continue to innovate and expand,
                      ensuring that anyone can succeed online — faster, easier,
                      and with full creative freedom.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Badge
                      variant="outline"
                      className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                    >
                      Trusted by millions worldwide
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
