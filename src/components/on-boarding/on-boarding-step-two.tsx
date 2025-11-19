"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Layout, Code } from "lucide-react";

interface OnboardingStepTwoProps {
  websiteType: string;
  onBack: () => void;
  onSelectOption: (option: "template" | "ai" | "scratch") => void;
}

export const OnboardingStepTwo = ({
  websiteType,
  onBack,
  onSelectOption,
}: OnboardingStepTwoProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        <img src="/fulllogo.svg" />

        <div className="w-20"></div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="h-1 w-full bg-gray-200">
          <div className="h-full w-2/3 bg-blue-600 transition-all duration-300"></div>
        </div>
        <p className="mt-2 text-sm font-medium text-blue-600">Step 2</p>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          <h1 className="mb-4 text-center text-4xl font-bold text-gray-900 md:text-5xl">
            Let&apos;s start building your dream website
          </h1>
          <p className="mb-12 text-center text-lg text-gray-600">
            How do you want to proceed?
          </p>

          <div className="space-y-6">
            {/* AI Generation Option (Recommended) */}
            <button
              onClick={() => onSelectOption("ai")}
              className="group relative w-full text-left transition-all hover:scale-[1.02]"
            >
              <Card className="relative overflow-hidden border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-white p-6 shadow-lg">
                <div className="absolute top-6 right-6">
                  <Sparkles className="h-8 w-8 text-blue-500" />
                  <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-blue-400" />
                  <Sparkles className="absolute -bottom-1 -left-2 h-4 w-4 text-blue-300" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-600 uppercase">
                        AI
                      </span>
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                        RECOMMENDED
                      </span>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">
                      Generate your website in seconds
                    </h2>
                    <p className="text-gray-600">
                      Let AI create a website for you
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <img
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
                      alt="AI Website Preview"
                      className="h-32 w-48 rounded-lg object-cover shadow-md"
                    />
                  </div>
                </div>
              </Card>
            </button>

            {/* Template Option */}
            <button
              onClick={() => onSelectOption("template")}
              className="group w-full text-left transition-all hover:scale-[1.02]"
            >
              <Card className="border-2 border-gray-200 p-6 transition-colors hover:border-gray-300 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    <Layout className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="mb-1 text-xl font-bold text-gray-900">
                      Start with a template
                    </h2>
                    <p className="text-gray-600">Use designer-made templates</p>
                  </div>
                </div>
              </Card>
            </button>

            {/* Start from Scratch */}
            <div className="pt-4 text-center">
              <button
                onClick={() => onSelectOption("scratch")}
                className="text-gray-600 underline hover:text-gray-900"
              >
                Know what you do?{" "}
                <span className="font-semibold">Start from scratch</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
