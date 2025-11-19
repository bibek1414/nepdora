"use client";

import { useState } from "react";
import { OnboardingStepOne } from "./on-boarding-step-one";
import { OnboardingStepTwo } from "./on-boarding-step-two";
import { OnboardingStepThree } from "./on-boarding-step-three";

type OnboardingStep = 1 | 2 | 3;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [websiteType, setWebsiteType] = useState("");

  const handleStepOneContinue = (type: string) => {
    setWebsiteType(type);
    setCurrentStep(2);
  };

  const handleStepTwoBack = () => {
    setCurrentStep(1);
  };

  const handleStepTwoSelect = (option: "template" | "ai" | "scratch") => {
    if (option === "template") {
      setCurrentStep(3);
    } else if (option === "ai") {
      // Handle AI generation flow
      console.log("AI generation selected");
      // You can add AI generation logic here
    } else if (option === "scratch") {
      // Navigate to admin without template
      window.location.href = "/admin";
    }
  };

  const handleStepThreeBack = () => {
    setCurrentStep(2);
  };

  return (
    <>
      {currentStep === 1 && (
        <OnboardingStepOne onContinue={handleStepOneContinue} />
      )}
      {currentStep === 2 && (
        <OnboardingStepTwo
          websiteType={websiteType}
          onBack={handleStepTwoBack}
          onSelectOption={handleStepTwoSelect}
        />
      )}
      {currentStep === 3 && (
        <OnboardingStepThree
          websiteType={websiteType}
          onBack={handleStepThreeBack}
        />
      )}
    </>
  );
}
