import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Briefcase } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  PortfolioData,
  PortfolioComponentData,
} from "@/types/owner-site/components/portfolio";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { PortfolioCard1 } from "./portfolio-card-1";
import { PortfolioCard2 } from "./portfolio-card-2";
import { PortfolioCard3 } from "./portfolio-card-3";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/unified";
import { usePortfolios } from "@/hooks/owner-site/admin/use-portfolio";

interface PortfolioComponentProps {
  component: PortfolioComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
  onUpdate?: (componentId: string, newData: PortfolioComponentData) => void;
  onPortfolioClick?: (portfolioSlug: string, order: number) => void;
}

export const PortfolioComponent: React.FC<PortfolioComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
  onPortfolioClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deletePortfolioMutation = useDeleteComponentMutation(
    pageSlug,
    "portfolio"
  );
  const updatePortfolioMutation = useUpdateComponentMutation(
    pageSlug,
    "portfolio"
  );

  const {
    itemsToShow = 6,
    title = "Our Portfolio",
    subtitle,
    style = "portfolio-1",
    columns = 3,
    showCategories = true,
    showTechnologies = true,
    showFilters = true,
    showPagination = false,
  } = component.data || {};

  // Fetch portfolios from API
  const pageSize = Math.min(itemsToShow, 50);
  const { data, isLoading, error } = usePortfolios({
    page: 1,
    page_size: pageSize,
  });

  // Extract portfolios from the API response structure
  const portfolios = data?.results || [];
  const totalPortfolios = data?.count || 0;
  const totalPages = Math.ceil(totalPortfolios / pageSize);

  const handleUpdate = (updatedData: Partial<PortfolioData>) => {
    const componentId = component.component_id || component.id.toString();

    updatePortfolioMutation.mutate(
      {
        componentId,
        data: updatedData,
      },
      {
        onError: error => {
          toast.error("Failed to update portfolio section", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();
    const loadingToast = toast.loading("Deleting portfolio section...");

    deletePortfolioMutation.mutate(componentId, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        toast.success("Portfolio section deleted successfully");
        setIsDeleteDialogOpen(false);
      },
      onError: error => {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete portfolio section", {
          description:
            error instanceof Error ? error.message : "Please try again",
        });
      },
    });
  };

  const handlePortfolioClick = (portfolio: Portfolio) => {
    if (onPortfolioClick && component.order !== undefined) {
      onPortfolioClick(portfolio.slug, component.order);
    }
  };

  const renderPortfolioCard = (portfolio: Portfolio) => {
    const cardProps = {
      portfolio,
      isEditable: false,
      siteUser: isEditable ? undefined : siteUser,
      onUpdate: handleUpdate,
      onClick: () => handlePortfolioClick(portfolio),
    };

    switch (style) {
      case "portfolio-1":
        return <PortfolioCard1 {...cardProps} />;
      case "portfolio-2":
        return <PortfolioCard2 {...cardProps} />;
      case "portfolio-3":
        return <PortfolioCard3 {...cardProps} />;
      default:
        return <PortfolioCard1 {...cardProps} />;
    }
  };

  const getGridClass = () => {
    if (style === "portfolio-3") {
      return "grid-cols-1 gap-6";
    }
    return `grid-cols-1 sm:grid-cols-${columns} gap-6`;
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control with AlertDialog */}
        <div className="absolute top-4 right-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <div className="flex items-center gap-2">
              <Link href="/admin/portfolio/" target="_blank" rel="noopener">
                <Button size="sm" variant="outline">
                  Manage Portfolio
                </Button>
              </Link>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3"
                  disabled={deletePortfolioMutation.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deletePortfolioMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Portfolio Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this portfolio component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deletePortfolioMutation.isPending}
                >
                  {deletePortfolioMutation.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Portfolio Preview */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-foreground mb-2 text-3xl font-bold tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                  {subtitle}
                </p>
              )}
            </div>

            {isLoading && (
              <div className={`grid ${getGridClass()}`}>
                {Array.from({ length: Math.min(itemsToShow, 3) }).map(
                  (_, index) => (
                    <div key={index} className="flex flex-col space-y-3">
                      <Skeleton className="h-[200px] w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Portfolio Items</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load portfolio items. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && portfolios.length > 0 && (
              <div className={`grid ${getGridClass()}`}>
                {portfolios
                  .slice(0, Math.min(itemsToShow, 6))
                  .map(portfolio => (
                    <div
                      key={portfolio.id}
                      className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                    >
                      {/* Overlay to prevent clicks in builder mode */}
                      <div className="absolute inset-0 z-10 bg-transparent" />
                      {renderPortfolioCard(portfolio)}
                    </div>
                  ))}
              </div>
            )}

            {!isLoading && !error && portfolios.length === 0 && (
              <div className="bg-muted/50 rounded-lg py-12 text-center">
                <Briefcase className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Portfolio Items Found
                </h3>
                <p className="text-muted-foreground">
                  Add some portfolio items to your site to display them here.
                </p>
              </div>
            )}

            {!isLoading && !error && portfolios.length > 6 && (
              <div className="bg-muted/50 mt-6 rounded-md p-3 text-center">
                <p className="text-muted-foreground text-sm">
                  Showing 6 of {portfolios.length} portfolio items in builder
                  preview
                  {totalPortfolios > 0 &&
                    ` (${totalPortfolios} total available)`}
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
          <h2 className="text-foreground mb-4 text-4xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              {subtitle}
            </p>
          )}
        </div>

        {isLoading && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {Array.from({ length: itemsToShow }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-[280px] w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Unable to Load Portfolio Items</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading our portfolio items. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && portfolios.length > 0 && (
          <div className={`grid ${getGridClass()} gap-8`}>
            {portfolios.slice(0, itemsToShow).map(portfolio => (
              <div key={portfolio.id} className="flex-shrink-0">
                {renderPortfolioCard(portfolio)}
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && portfolios.length === 0 && (
          <div className="py-16 text-center">
            <Briefcase className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Portfolio Items Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              We&apos;re currently working on new projects. Please check back
              soon for new portfolio items.
            </p>
          </div>
        )}

        {/* Pagination info */}
        {!isLoading && !error && totalPortfolios > itemsToShow && (
          <div className="bg-muted/30 mt-12 rounded-lg p-4 text-center">
            <p className="text-muted-foreground">
              Showing {Math.min(itemsToShow, portfolios.length)} of{" "}
              {totalPortfolios} portfolio items
              {totalPages > 1 && ` (Page 1 of ${totalPages})`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
