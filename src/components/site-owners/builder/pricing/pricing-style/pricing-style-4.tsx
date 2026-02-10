"use client";
import React from "react";
import { usePricings } from "@/hooks/owner-site/admin/use-pricing";
import { PricingCard4 } from "../pricing-card/pricing-card-4";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, DollarSign } from "lucide-react";
import { PricingComponentData } from "@/types/owner-site/components/pricing";

interface PricingStyleProps {
  data: PricingComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<PricingComponentData["data"]>) => void;
  onPricingClick?: (pricingId: number) => void;
}

export const PricingStyle4: React.FC<PricingStyleProps> = ({
  isEditable = false,
  onPricingClick,
}) => {
  const { data: pricingsData, isLoading, error } = usePricings();
  const pricings = pricingsData?.results || [];

  return (
    <section className="bg-background mx-auto max-w-5xl py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-[450px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Pricing</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load pricing."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && pricings.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pricings.map(pricing => (
              <div
                key={pricing.id}
                className="relative transform transition-transform duration-200 hover:scale-105"
                onClick={() => !isEditable && onPricingClick?.(pricing.id)}
              >
                {isEditable && <div className="absolute inset-0 z-10" />}
                <PricingCard4 pricing={pricing} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && pricings.length === 0 && (
          <div className="py-16 text-center">
            <DollarSign className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Pricing Plans Available
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};
