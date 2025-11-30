import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Pricing } from "@/types/owner-site/admin/pricing";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PricingCard2Props {
  pricing: Pricing;
  onClick?: () => void;
}

const hexToRgba = (hex: string, alpha = 1) => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1]);
    g = parseInt("0x" + hex[2] + hex[2]);
    b = parseInt("0x" + hex[3] + hex[3]);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2]);
    g = parseInt("0x" + hex[3] + hex[4]);
    b = parseInt("0x" + hex[5] + hex[6]);
  }
  return `rgba(${r},${g},${b},${alpha})`;
};

export const PricingCard2: React.FC<PricingCard2Props> = ({
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
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  return (
    <div
      className={`relative rounded-2xl border-2 p-8 ${
        pricing.is_popular ? "shadow-xl" : "border-border bg-background"
      }`}
      style={{
        borderColor: pricing.is_popular ? theme.colors.primary : undefined,
        backgroundColor: pricing.is_popular
          ? hexToRgba(theme.colors.primary, 0.05)
          : undefined,
        fontFamily: theme.fonts.body,
      }}
    >
      {pricing.is_popular && (
        <Badge
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.primaryForeground,
          }}
        >
          Most Popular
        </Badge>
      )}

      <div className="text-center">
        <h3
          className="mb-3 text-2xl font-bold"
          style={{ fontFamily: theme.fonts.heading }}
        >
          {pricing.name}
        </h3>
        <div className="mb-4">
          <span className="text-5xl font-bold">Rs.{pricing.price}</span>
          <span className="text-muted-foreground text-lg">/mo</span>
        </div>
        <p className="text-muted-foreground mb-8">{pricing.description}</p>
      </div>

      <ul className="mb-8 space-y-4">
        {pricing.features.map(feature => (
          <li key={feature.id} className="flex items-center gap-3">
            <div
              className="rounded-full p-1"
              style={{
                backgroundColor: hexToRgba(theme.colors.primary, 0.1),
              }}
            >
              <Check
                className="h-4 w-4"
                style={{ color: theme.colors.primary }}
              />
            </div>
            <span className="text-sm">{feature.feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
