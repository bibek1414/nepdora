"use client";

import { useState } from "react";
import { OnboardingStepOne } from "./on-boarding-step-one";
import { OnboardingStepTwo } from "./on-boarding-step-two";
import { OnboardingStepThree } from "./on-boarding-step-three";
import { OnboardingStepFour } from "./on-boarding-step-four";

type OnboardingStep = 1 | 2 | 3 | 4;

interface WebsiteData {
  type: string;
  categoryId?: number;
  subcategoryId?: number;
  selectedOption?: "template" | "ai" | "scratch";
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    type: "",
  });

  // Step 1: Method selection (template, ai, scratch)
  const handleStepOneSelect = (option: "template" | "ai" | "scratch") => {
    setWebsiteData(prev => ({ ...prev, selectedOption: option }));

    if (option === "scratch") {
      return;
    }
    setCurrentStep(2);
  };

  // Step 2: Categories selection
  const handleStepTwoContinue = (categoryId?: number) => {
    setWebsiteData(prev => ({ ...prev, categoryId }));
    setCurrentStep(3);
  };

  const handleStepTwoBack = () => {
    setCurrentStep(1);
  };

  // Step 3: Subcategories selection
  const handleStepThreeContinue = (subcategoryId?: number, type?: string) => {
    setWebsiteData(prev => ({
      ...prev,
      subcategoryId,
      type: type || prev.type,
    }));
    setCurrentStep(4);
  };

  const handleStepThreeBack = () => {
    setCurrentStep(2);
  };

  // Step 4: Templates selection
  const handleStepFourBack = () => {
    setCurrentStep(3);
  };

  return (
    <>
      {currentStep === 1 && (
        <OnboardingStepOne
          onSelectOption={handleStepOneSelect}
          currentStep={currentStep}
          totalSteps={4}
        />
      )}
      {currentStep === 2 && (
        <OnboardingStepTwo
          onContinue={handleStepTwoContinue}
          onBack={handleStepTwoBack}
          currentStep={currentStep}
          totalSteps={4}
        />
      )}
      {currentStep === 3 && (
        <OnboardingStepThree
          categoryId={websiteData.categoryId}
          onContinue={handleStepThreeContinue}
          onBack={handleStepThreeBack}
          currentStep={currentStep}
          totalSteps={4}
        />
      )}
      {currentStep === 4 && (
        <OnboardingStepFour
          websiteType={websiteData.type}
          categoryId={websiteData.categoryId}
          subcategoryId={websiteData.subcategoryId}
          onBack={handleStepFourBack}
          currentStep={currentStep}
          totalSteps={4}
        />
      )}
    </>
  );
}
