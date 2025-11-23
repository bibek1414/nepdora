"use client";

import { useState } from "react";
import { OnboardingStepOne } from "./on-boarding-step-one";
import { OnboardingStepTwo } from "./on-boarding-step-two";
import { OnboardingStepThree } from "./on-boarding-step-three";

type OnboardingStep = 1 | 2 | 3;

interface WebsiteData {
  type: string;
  categoryId?: number;
  subcategoryId?: number;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    type: "",
  });

  // Step 1 is now the method selection
  const handleStepOneSelect = (option: "template" | "ai" | "scratch") => {
    if (option === "template") {
      setCurrentStep(2); // Go to template selection (formerly step 3)
    } else if (option === "ai") {
      // Handle AI generation flow
      console.log("AI generation selected");
      // You can add AI generation logic here
    } else if (option === "scratch") {
      // This will be handled in StepTwo component with confirmation dialog
      setCurrentStep(2); // Go to website type selection for scratch
    }
  };

  // Step 2 is now the website type selection (formerly step 1)
  const handleStepTwoContinue = (
    type: string,
    categoryId?: number,
    subcategoryId?: number
  ) => {
    setWebsiteData({ type, categoryId, subcategoryId });
    setCurrentStep(3); // Go to template selection
  };

  const handleStepTwoBack = () => {
    setCurrentStep(1);
  };

  const handleStepThreeBack = () => {
    setCurrentStep(2);
  };

  return (
    <>
      {currentStep === 1 && (
        <OnboardingStepOne onSelectOption={handleStepOneSelect} />
      )}
      {currentStep === 2 && (
        <OnboardingStepTwo
          onContinue={handleStepTwoContinue}
          onBack={handleStepTwoBack}
          isScratchMode={true}
        />
      )}
      {currentStep === 3 && (
        <OnboardingStepThree
          websiteType={websiteData.type}
          categoryId={websiteData.categoryId}
          subcategoryId={websiteData.subcategoryId}
          onBack={handleStepThreeBack}
        />
      )}
    </>
  );
}
