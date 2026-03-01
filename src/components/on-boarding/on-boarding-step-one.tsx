"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Layout } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth/auth";
import { LoadingScreen } from "@/components/on-boarding/loading-screen/loading-screen";

interface OnboardingStepOneProps {
  onSelectOption: (option: "template" | "ai" | "scratch") => void;
  currentStep: number;
  totalSteps: number;
  user: User;
}

export const OnboardingStepOne = ({
  onSelectOption,
  currentStep,
  totalSteps,
  user,
}: OnboardingStepOneProps) => {
  const [showScratchConfirm, setShowScratchConfirm] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const router = useRouter();

  const handleOptionSelect = (option: "template" | "ai" | "scratch") => {
    if (option === "scratch") {
      setShowScratchConfirm(true);
    } else {
      onSelectOption(option);
    }
  };

  const handleConfirmScratch = () => {
    setShowScratchConfirm(false);
    setShowLoadingScreen(true);

    setTimeout(() => {
      router.push(`/builder/${user.sub_domain}`);
    }, 5000);
  };

  const handleSkip = () => {
    setShowLoadingScreen(true);

    setTimeout(() => {
      router.push(`/builder/${user.sub_domain}`);
    }, 5000);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <>
      <LoadingScreen isVisible={showLoadingScreen} />

      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4">
          <img src="/nepdora-logooo.svg" alt="Logo" className="h-8" />
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleSkip}
          >
            Skip
          </Button>
        </header>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="h-1 w-full bg-gray-200">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-primary mt-2 text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="w-full max-w-4xl">
            <h1 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-5xl">
              Let&apos;s start building your dream website
            </h1>
            <p className="mb-12 text-center text-lg text-gray-600">
              How do you want to proceed?
            </p>

            <div className="space-y-6">
              {/* AI Generation Option (Recommended) */}
              <Card className="group border-primary relative overflow-hidden border-2 bg-gradient-to-r from-gray-50 to-white py-0 shadow-lg transition-all hover:scale-[1.02]">
                <CardContent
                  className="p-6"
                  onClick={() => handleOptionSelect("ai")}
                >
                  <Button
                    variant="ghost"
                    className="relative h-auto w-full justify-start p-0 text-left shadow-none hover:bg-transparent"
                  >
                    <div className="absolute top-6 right-6">
                      <Sparkles className="text-primary h-8 w-8" />
                      <Sparkles className="text-primary/90 absolute -top-2 -right-2 h-5 w-5" />
                      <Sparkles className="text-primary/80 absolute -bottom-1 -left-2 h-4 w-4" />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        <Sparkles className="text-primary h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-primary text-xs font-semibold uppercase">
                            AI
                          </span>
                          <span className="bg-primary rounded-full px-2 py-0.5 text-xs font-medium text-white">
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
                          src="/fallback/image-not-found.png"
                          alt="AI Website Preview"
                          className="h-32 w-48 rounded-lg object-cover shadow-md"
                        />
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Template Option */}
              <Card className="group border-2 border-gray-200 transition-all hover:scale-[1.02]">
                <CardContent
                  className="p-6"
                  onClick={() => handleOptionSelect("template")}
                >
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start p-0 text-left hover:bg-transparent"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        <Layout className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h2 className="mb-1 text-xl font-bold text-gray-900">
                          Start with a template
                        </h2>
                        <p className="text-gray-600">
                          Use designer-made templates
                        </p>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Start from Scratch */}
              <div className="pt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => handleOptionSelect("scratch")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Know what you do?{" "}
                  <span className="font-semibold">Start from scratch</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Start from Scratch Confirmation Dialog */}
      <AlertDialog
        open={showScratchConfirm}
        onOpenChange={setShowScratchConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start from Scratch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start from scratch? This will take you
              directly to the website builder with a blank canvas. You can still
              choose a template later if you change your mind.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmScratch}>
              Yes, Start from Scratch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
