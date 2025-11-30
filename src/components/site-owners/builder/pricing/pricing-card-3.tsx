import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { Pricing } from "@/types/owner-site/admin/pricing";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PricingCard3Props {
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

export const PricingCard3: React.FC<PricingCard3Props> = ({
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
    <div className="group relative" style={{ fontFamily: theme.fonts.body }}>
      <div
        className={`rounded-3xl border p-8 transition-all duration-300 ${
          pricing.is_popular
            ? "shadow-2xl"
            : "border-border bg-card hover:shadow-lg"
        }`}
        style={{
          borderColor: pricing.is_popular ? theme.colors.primary : undefined,
          background: pricing.is_popular
            ? `linear-gradient(to bottom right, ${hexToRgba(
                theme.colors.primary,
                0.1
              )}, ${hexToRgba(theme.colors.primary, 0.05)})`
            : undefined,
        }}
      >
        {pricing.is_popular && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <Badge
              className="gap-1 px-4 py-1.5"
              style={{
                background: `linear-gradient(to right, ${
                  theme.colors.primary
                }, ${hexToRgba(theme.colors.primary, 0.8)})`,
                color: theme.colors.primaryForeground,
              }}
            >
              <Zap className="h-3 w-3" />
              Best Value
            </Badge>
          </div>
        )}

        <div className="mb-8 text-center">
          <h3
            className="mb-4 text-3xl font-bold"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {pricing.name}
          </h3>
          <div className="mb-4 flex items-baseline justify-center gap-1">
            <span className="text-muted-foreground text-2xl">Rs.</span>
            <span className="text-6xl font-bold">{pricing.price}</span>
            <span className="text-muted-foreground text-xl">/month</span>
          </div>
          <p className="text-muted-foreground">{pricing.description}</p>
        </div>

        <div className="mb-8 space-y-4">
          {pricing.features.map(feature => (
            <div key={feature.id} className="flex items-start gap-3">
              <div
                className="mt-0.5 rounded-full p-1"
                style={{
                  backgroundColor: pricing.is_popular
                    ? theme.colors.primary
                    : hexToRgba(theme.colors.primary, 0.1),
                  color: pricing.is_popular
                    ? theme.colors.primaryForeground
                    : theme.colors.primary,
                }}
              >
                <Check className="h-4 w-4" />
              </div>
              <span className="flex-1 text-sm leading-relaxed">
                {feature.feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
