import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Pricing } from "@/types/owner-site/admin/pricing";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PricingCard1Props {
  pricing: Pricing;
  onClick?: () => void;
}

export const PricingCard1: React.FC<PricingCard1Props> = ({
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
    <Card
      className="relative overflow-hidden transition-all hover:shadow-lg"
      style={{ fontFamily: theme.fonts.body }}
    >
      {pricing.is_popular && (
        <Badge
          className="absolute top-4 right-4"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.primaryForeground,
          }}
        >
          Popular
        </Badge>
      )}
      <CardContent className="p-6">
        <h3
          className="mb-2 text-2xl font-bold"
          style={{ fontFamily: theme.fonts.heading }}
        >
          {pricing.name}
        </h3>
        <div className="mb-4">
          <span className="text-4xl font-bold">Rs.{pricing.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <p className="text-muted-foreground mb-6">{pricing.description}</p>

        <ul className="mb-6 space-y-3">
          {pricing.features.map(feature => (
            <li key={feature.id} className="flex items-start gap-2">
              <Check
                className="mt-0.5 h-5 w-5 flex-shrink-0"
                style={{ color: theme.colors.primary }}
              />
              <span>{feature.feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
