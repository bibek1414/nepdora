import React from "react";
import { Button } from "@/components/ui/button";

export default function BuildGrowShowcase() {
  return (
    <div className="relative mx-auto h-[300px] max-w-7xl md:h-[400px] lg:h-[500px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/get-hired.webp')",
        }}
      >
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        {/* Main Heading */}
        <h1 className="mb-4 max-w-2xl text-center text-2xl font-bold text-gray-900 md:text-2xl lg:text-2xl">
          Build. Grow. Showcase.
        </h1>

        {/* Subheading */}
        <h2 className="mb-12 max-w-xl text-center text-xl font-medium text-gray-700 md:text-xl lg:text-xl">
          Create stunning websites and digital brands for creators, businesses &
          professionals in Nepal and beyond.
        </h2>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-full bg-gray-900 px-8 py-6 text-lg font-semibold text-white hover:bg-gray-800"
          >
            Start Building
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-2 border-gray-300 bg-white px-8 py-6 text-lg font-semibold text-gray-900 hover:bg-gray-50"
          >
            Explore Templates
          </Button>
        </div>
      </div>
    </div>
  );
}
