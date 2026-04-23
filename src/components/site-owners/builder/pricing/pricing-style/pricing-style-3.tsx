"use client";

import React from "react";
import { Check, ChevronRight, DollarSign, AlertCircle } from "lucide-react";
import { usePricings } from "@/hooks/owner-site/admin/use-pricing";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { EditableText } from "@/components/ui/editable-text";
import { PricingComponentData } from "@/types/owner-site/components/pricing";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditableLink } from "@/components/ui/editable-link";

interface PricingStyle3Props {
  data: PricingComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<PricingComponentData["data"]>) => void;
  onPricingClick?: (pricingId: number) => void;
}

export const PricingStyle3: React.FC<PricingStyle3Props> = ({
  data,
  isEditable = false,
  onUpdate,
  onPricingClick,
}) => {
  const router = useRouter();
  const {
    title = "Our Pricing Plans",
    subtitle = "Choose the perfect plan for your needs",
    ctaText = "Get Started",
    ctaHref = "#",
  } = data || {};

  const { data: pricingsData, isLoading, error, refetch } = usePricings();
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme;

  const pricings = React.useMemo(() => {
    return [...(pricingsData?.results || [])].sort(
      (a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price))
    );
  }, [pricingsData?.results]);

  const handleTextUpdate = (field: keyof typeof data) => (value: string) => {
    onUpdate?.({ [field]: value });
  };

  return (
    <section className="bg-white py-20 md:py-20">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 text-center">
          <EditableText
            value={title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
            style={{ fontFamily: theme?.fonts?.heading }}
            isEditable={isEditable}
          />
          <EditableText
            value={subtitle}
            onChange={handleTextUpdate("subtitle")}
            as="p"
            className="mt-4 text-lg text-gray-600"
            style={{ fontFamily: theme?.fonts?.body }}
            isEditable={isEditable}
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-[500px] w-full rounded-lg" />
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {pricings.map(plan => (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-lg border p-8 transition-all duration-200 md:p-10",
                  plan.is_popular
                    ? "border-primary ring-primary shadow-lg ring-1"
                    : "border-gray-200 bg-white"
                )}
                style={
                  plan.is_popular
                    ? {
                        backgroundColor: theme?.colors?.primary,
                        color: theme?.colors?.primaryForeground,
                        borderColor: theme?.colors?.primary,
                      }
                    : {}
                }
                onClick={() => !isEditable && onPricingClick?.(plan.id)}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={cn(
                      "text-2xl font-bold",
                      !plan.is_popular && "text-gray-900"
                    )}
                    style={{ fontFamily: theme?.fonts?.heading }}
                  >
                    {plan.name}
                  </h3>
                  {plan.is_popular && (
                    <span
                      className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
                      style={{ color: theme?.colors?.primaryForeground }}
                    >
                      Most common
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "mt-4 text-sm",
                    plan.is_popular ? "opacity-80" : "text-gray-500"
                  )}
                >
                  Monthly
                </p>

                <div className="mt-6 flex items-baseline">
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      !plan.is_popular && "text-gray-900"
                    )}
                  >
                    Rs. {Number(plan.price).toLocaleString("en-IN")}
                  </span>
                  <span
                    className={cn(
                      "ml-1 text-sm",
                      plan.is_popular ? "opacity-70" : "text-gray-500"
                    )}
                  >
                    /month
                  </span>
                </div>

                <p
                  className={cn(
                    "mt-4 text-sm leading-relaxed",
                    plan.is_popular ? "opacity-90" : "text-gray-600"
                  )}
                >
                  {plan.description}
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((f, idx) => (
                    <li
                      key={f.id || idx}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          plan.is_popular ? "text-white" : "text-primary"
                        )}
                        style={
                          !plan.is_popular
                            ? { color: theme?.colors?.primary }
                            : {}
                        }
                      />
                      <span
                        className={
                          plan.is_popular ? "text-white" : "text-gray-700"
                        }
                      >
                        {f.feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="relative z-30 mt-10">
                  <EditableLink
                    text={ctaText}
                    href={ctaHref}
                    onChange={(newText, newHref) =>
                      onUpdate?.({ ctaText: newText, ctaHref: newHref })
                    }
                    isEditable={isEditable}
                    fullWidth={true}
                    className={cn(
                      "w-full cursor-pointer items-center justify-center rounded-lg py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.02]",
                      plan.is_popular && "bg-white hover:bg-gray-100"
                    )}
                    style={
                      plan.is_popular
                        ? { color: theme?.colors?.primary }
                        : {
                            backgroundColor: theme?.colors?.primary,
                            color: theme?.colors?.primaryForeground,
                          }
                    }
                  >
                    {ctaText} <ChevronRight className="ml-2 h-4 w-4" />
                  </EditableLink>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={DollarSign}
            title="No Pricing Plans Found"
            description="Create your pricing tables and plans in the admin dashboard."
            actionLabel="Add New Pricing"
            actionLink="/admin/pricing"
            isEditable={isEditable}
            isEmpty={pricings.length === 0}
            onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
