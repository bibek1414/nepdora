// components/site-owners/pricing/pricing-component.tsx

import React, { useState } from "react";
import { PricingComponentData } from "@/types/owner-site/components/pricing";
import { usePricings } from "@/hooks/owner-site/admin/use-pricing";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { PricingCard1 } from "./pricing-card-1";
import { PricingCard2 } from "./pricing-card-2";
import { PricingCard3 } from "./pricing-card-3";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2, DollarSign } from "lucide-react";
import { Pricing } from "@/types/owner-site/admin/pricing";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import Link from "next/link";

interface PricingComponentProps {
  component: PricingComponentData;
  isEditable?: boolean;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: PricingComponentData) => void;
  onPricingClick?: (pricingId: number, order: number) => void;
}

export const PricingComponent: React.FC<PricingComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  onUpdate,
  onPricingClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    title = "Our Pricing Plans",
    subtitle,
    style = "pricing-1",
  } = component.data || {};

  const deletePricingComponent = useDeleteComponentMutation(
    pageSlug || "",
    "pricing"
  );
  const updatePricingComponent = useUpdateComponentMutation(
    pageSlug || "",
    "pricing"
  );

  const { data, isLoading, error } = usePricings();

  const pricings = data?.results || [];

  const handlePricingClick = (pricing: Pricing) => {
    if (onPricingClick && component.order !== undefined) {
      onPricingClick(pricing.id, component.order);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pageSlug) {
      console.error("pageSlug is required for deletion");
      return;
    }

    deletePricingComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updatePricingComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        title: newTitle,
      },
    });

    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updatePricingComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        subtitle: newSubtitle,
      },
    });

    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const renderPricingCard = (pricing: Pricing) => {
    const cardProps = {
      pricing,
      onClick: () => handlePricingClick(pricing),
    };

    switch (style) {
      case "pricing-2":
        return <PricingCard2 key={pricing.id} {...cardProps} />;
      case "pricing-3":
        return <PricingCard3 key={pricing.id} {...cardProps} />;
      case "pricing-1":
      default:
        return <PricingCard1 key={pricing.id} {...cardProps} />;
    }
  };

  const getGridClass = () => {
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        <div className="absolute -right-1 z-30 flex translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <div className="flex items-center gap-2">
              <Link href="/admin/pricing/" target="_blank" rel="noopener">
                <Button size="sm" variant="outline" className="text-sm">
                  Manage Pricing
                </Button>
              </Link>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3 text-sm"
                  disabled={deletePricingComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deletePricingComponent.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Pricing Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this pricing component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deletePricingComponent.isPending}
                >
                  {deletePricingComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <EditableText
                value={title}
                onChange={handleTitleChange}
                as="h2"
                className="text-foreground mb-2 text-3xl font-bold tracking-tight"
                isEditable={true}
                placeholder="Enter title..."
              />
              <EditableText
                value={subtitle || ""}
                onChange={handleSubtitleChange}
                as="p"
                className="text-muted-foreground mx-auto max-w-2xl text-lg"
                isEditable={true}
                placeholder="Enter subtitle..."
                multiline={true}
              />
            </div>

            {isLoading && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
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
                    : "Failed to load pricing plans. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && pricings.length > 0 && (
              <div className={`grid ${getGridClass()} gap-6`}>
                {pricings.map(pricing => (
                  <div
                    key={pricing.id}
                    className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                  >
                    <div className="absolute inset-0 z-10 bg-transparent" />
                    {renderPricingCard(pricing)}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && pricings.length === 0 && (
              <div className="bg-muted/50 rounded-lg py-12 text-center">
                <DollarSign className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Pricing Plans Found
                </h3>
                <p className="text-muted-foreground">
                  Add some pricing plans to display them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Live site rendering
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2
            className="text-foreground mb-4 text-4xl font-bold tracking-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          ></h2>
          {subtitle && (
            <p
              className="text-muted-foreground mx-auto max-w-3xl text-xl"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            ></p>
          )}
        </div>

        {isLoading && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-[450px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Unable to Load Pricing</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading our pricing plans. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && pricings.length > 0 && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {pricings.map(pricing => (
              <div key={pricing.id}>{renderPricingCard(pricing)}</div>
            ))}
          </div>
        )}

        {!isLoading && !error && pricings.length === 0 && (
          <div className="py-16 text-center">
            <DollarSign className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Pricing Plans Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              We&apos;re currently updating our pricing structure. Please check
              back soon for new plans.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
