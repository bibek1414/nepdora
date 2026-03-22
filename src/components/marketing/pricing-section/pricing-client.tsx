"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (val: boolean) => void;
}

export const PricingToggle: React.FC<PricingToggleProps> = ({
  isYearly,
  onToggle,
}) => {
  return (
    <div className="mb-6 flex items-center justify-center gap-3">
      <span
        className={`text-sm font-medium transition-colors ${!isYearly ? "text-gray-900" : "text-gray-500"}`}
      >
        Monthly
      </span>
      <button
        onClick={() => onToggle(!isYearly)}
        className={`relative h-7 w-14 rounded-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
          isYearly ? "bg-primary" : "bg-gray-300"
        }`}
        aria-label="Toggle billing period"
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
            isYearly ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${isYearly ? "text-gray-900" : "text-gray-500"}`}
      >
        Yearly
      </span>
      {isYearly && (
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
          SAVE 10%
        </span>
      )}
    </div>
  );
};

export const BillingDisplay: React.FC<{ isYearly: boolean }> = ({
  isYearly,
}) => {
  return (
    <p className="text-start text-xs text-gray-500">
      {isYearly ? "Billed annually" : "Billed monthly"}
    </p>
  );
};
