"use client";

import { useState } from "react";
import { OnboardingStepOne } from "./on-boarding-step-one";
import { OnboardingStepTwo } from "./on-boarding-step-two";
import { User } from "@/types/auth/auth";

type OnboardingStep = 1 | 2;

interface WebsiteData {
  type: "ecoomerce" | "services" | "";
  selectedOption?: "template" | "ai" | "scratch";
}

interface OnboardingPageProps {
  user: User;
}

export default function OnboardingPage({ user }: OnboardingPageProps) {
  // Initialize based on user's existing website_type if available
  // The API uses "ecommerce" and "service", but internal slugs are "ecoomerce" and "services"
  const initialType =
    user.website_type === "ecommerce"
      ? ("ecoomerce" as const)
      : user.website_type === "service"
        ? ("services" as const)
        : "";

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    type: initialType,
  });

  // Step 1: Website type selection
  const handleStepOneSelect = (type: "ecoomerce" | "services") => {
    setWebsiteData(prev => ({ ...prev, type }));
    setCurrentStep(2);
  };

  // Step 2: Templates selection
  const handleStepTwoBack = () => {
    setCurrentStep(1);
  };

  return (
    <>
      {currentStep === 1 && (
        <OnboardingStepOne
          onSelectType={handleStepOneSelect}
          currentStep={currentStep}
          totalSteps={2}
          user={user}
        />
      )}
      {currentStep === 2 && (
        <OnboardingStepTwo
          websiteType={websiteData.type}
          onBack={handleStepTwoBack}
          currentStep={currentStep}
          totalSteps={2}
          user={user}
        />
      )}
    </>
  );
}
