import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pricing } from "@/types/owner-site/admin/pricing";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Separator } from "@/components/ui/separator";

interface PricingCard4Props {
  pricing: Pricing;
  onClick?: () => void;
}

export const PricingCard4: React.FC<PricingCard4Props> = ({
  pricing,
  onClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      background: "#FFFFFF",
      card: "#F8FAFC",
      border: "#E2E8F0",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border duration-300">
      {/* Header Section */}
      <div
        className="py-10 text-center"
        style={{
          backgroundColor: `${theme.colors.primary}15`,
        }}
      >
        <h3 className="text-3xl font-medium">{pricing.name}</h3>
      </div>
      {/* Body Section */}
      <div className="flex h-full flex-col p-8">
        {/* Price */}
        <div className="mb-8 text-center">
          <span
            className="text-4xl font-bold"
            style={{ color: theme.colors.primary }}
          >
            Rs.{pricing.price}
          </span>
          <span
            className="ml-1 text-xl font-medium"
            style={{ color: theme.colors.primary }}
          >
            /mo
          </span>
        </div>
        <Separator />

        {/* Divider */}
        <div className="mb-8 h-px w-full text-black" />

        {/* Features List */}
        <ul className="mb-10 flex-grow space-y-4 pl-2">
          {pricing.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <Check
                className="h-5 w-5"
                strokeWidth={3}
                style={{ color: theme.colors.primary }}
              />
              <span className="text-base font-light">{feature.feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
