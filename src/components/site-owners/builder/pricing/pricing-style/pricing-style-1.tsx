"use client";
import React from "react";
import { usePricings } from "@/hooks/owner-site/admin/use-pricing";
import { PricingCard1 } from "../pricing-card/pricing-card-1";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, DollarSign } from "lucide-react";
import { PricingComponentData } from "@/types/owner-site/components/pricing";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface PricingStyleProps {
  data: PricingComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<PricingComponentData["data"]>) => void;
  onPricingClick?: (pricingId: number) => void;
}

export const PricingStyle1: React.FC<PricingStyleProps> = ({
  isEditable = false,
  onPricingClick,
}) => {
  const { data: pricingsData, isLoading, error } = usePricings();
  const pricings = React.useMemo(() => {
    return [...(pricingsData?.results || [])].sort(
      (a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price))
    );
  }, [pricingsData?.results]);

  return (
    <section className="bg-background mx-auto max-w-6xl py-12 md:py-16">
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
                <PricingCard1 pricing={pricing} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && pricings.length === 0 && (
          <BuilderEmptyState
            icon={DollarSign}
            title="No Pricing Plans Found"
            description="Create your pricing tables and plans in the admin dashboard."
            actionLabel="Manage Pricing"
            actionLink="/admin/pricing"
            isEditable={isEditable}
          />
        )}
      </div>
    </section>
  );
};
