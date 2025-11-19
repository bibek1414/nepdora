"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface OnboardingStepOneProps {
  onContinue: (websiteType: string) => void;
}

const websiteExamples = [
  "Cleaning Service",
  "Automotive Services",
  "Car Detailing Service",
  "Handmade Jewelry",
  "Beauty Salon",
  "Pet Grooming",
  "E-commerce Store",
  "Online Fashion Store",
  "Restaurant",
  "Fitness Center",
  "Photography Studio",
  "Consulting Services",
];

export const OnboardingStepOne = ({ onContinue }: OnboardingStepOneProps) => {
  const [websiteType, setWebsiteType] = useState("");

  const handleContinue = () => {
    if (websiteType.trim()) {
      onContinue(websiteType.trim());
    }
  };

  const handleClear = () => {
    setWebsiteType("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && websiteType.trim()) {
      handleContinue();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6">
        <img src="/fulllogo.svg" />
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
          Skip
        </Button>
      </header>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="h-1 w-full bg-gray-200">
          <div className="h-full w-1/3 bg-blue-600 transition-all duration-300"></div>
        </div>
        <p className="mt-2 text-sm font-medium text-blue-600">Step 1</p>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">
            What type of website do you want to create?
          </h1>

          {/* Search Input */}
          <div className="mb-8 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Pet Supply Store"
                value={websiteType}
                onChange={e => setWebsiteType(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 pr-12 pl-12 text-base"
              />
              {websiteType && (
                <button
                  onClick={handleClear}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button
              onClick={handleContinue}
              disabled={!websiteType.trim()}
              className="h-14 bg-blue-600 px-8 text-base font-medium hover:bg-blue-700"
            >
              Continue
            </Button>
          </div>

          {/* Examples */}
          <div>
            <p className="mb-4 text-sm text-gray-600">Examples:</p>
            <div className="flex flex-wrap gap-3">
              {websiteExamples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setWebsiteType(example)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
