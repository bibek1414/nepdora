"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Sparkles,
  Layout,
  Store,
  Briefcase,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth/auth";
import { LoadingScreen } from "@/components/on-boarding/loading-screen/loading-screen";

interface OnboardingStepOneProps {
  onSelectType: (type: "ecoomerce" | "services") => void;
  currentStep: number;
  totalSteps: number;
  user: User;
}

export const OnboardingStepOne = ({
  onSelectType,
  currentStep,
  totalSteps,
  user,
}: OnboardingStepOneProps) => {
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "ecoomerce" | "services" | null
  >(null);
  const router = useRouter();

  const handleTypeSelect = (type: "ecoomerce" | "services") => {
    setSelectedType(type);
    onSelectType(type);
  };

  const handleSkip = () => {
    setShowLoadingScreen(true);
    setTimeout(() => {
      router.push("/admin");
    }, 2000);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <>
      <LoadingScreen isVisible={showLoadingScreen} />

      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <img
            src="/nepdora-logooo.svg"
            alt="Nepdora Logo"
            className="h-8 w-auto"
          />
          <Button
            variant="ghost"
            className="rounded-full px-5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
        </header>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-primary text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="text-xs text-slate-400">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-5xl">
            {/* Welcome Section */}
            <div className="mb-10 text-center">
              <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
                <span>
                  Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </span>
              </div>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                Let's start building your dream website
              </h1>
              <p className="mx-auto max-w-2xl text-base text-slate-500">
                Choose how you'd like to begin your journey with Nepdora. We'll
                guide you through the rest.
              </p>
            </div>

            {/* Options Grid */}
            <div className="flex items-center justify-center gap-6">
              {/* E-commerce Template Option */}
              {(!user.website_type || user.website_type === "ecommerce") && (
                <Card
                  className={cn(
                    "group focus-within:ring-primary/20 relative cursor-pointer border-2 bg-white transition-all focus-within:ring-2 hover:-translate-y-1",
                    selectedType === "ecoomerce"
                      ? "border-primary shadow-primary/5 shadow-lg"
                      : "hover:border-primary/30 border-slate-200"
                  )}
                  onClick={() => handleTypeSelect("ecoomerce")}
                >
                  {selectedType === "ecoomerce" && (
                    <div className="text-primary animate-in zoom-in absolute top-4 right-4 duration-300">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-all group-hover:scale-110">
                        <Store className="h-7 w-7" />
                      </div>
                      <h2 className="mb-2 text-xl font-bold text-slate-900">
                        Start with a template
                      </h2>
                      <p className="text-sm text-slate-500">
                        Choose from professionally designed templates for
                        selling products online. Perfect for e-commerce stores.
                      </p>
                      <div className="text-primary mt-5 flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                        Select template
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(!user.website_type || user.website_type === "service") && (
                <Card
                  className={cn(
                    "group focus-within:ring-primary/20 relative cursor-pointer border-2 bg-white transition-all focus-within:ring-2 hover:-translate-y-1",
                    selectedType === "services"
                      ? "border-primary shadow-primary/5 shadow-lg"
                      : "hover:border-primary/30 border-slate-200"
                  )}
                  onClick={() => handleTypeSelect("services")}
                >
                  {selectedType === "services" && (
                    <div className="text-primary animate-in zoom-in absolute top-4 right-4 duration-300">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-all group-hover:scale-110">
                        <Store className="h-7 w-7" />
                      </div>
                      <h2 className="mb-2 text-xl font-bold text-slate-900">
                        Start with a template
                      </h2>
                      <p className="text-sm text-slate-500">
                        Choose from professionally designed templates for
                        selling products online. Perfect for e-commerce stores.
                      </p>
                      <div className="text-primary mt-5 flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                        Select template
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Alternative Option */}
            <div className="mt-12 text-center">
              <button
                onClick={handleSkip}
                className="group inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-400 transition-colors"
              >
                Know exactly what you want?
                <span className="group-hover:border-primary border-b border-slate-300">
                  Start building directly
                </span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
