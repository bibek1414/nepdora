import React, { useState } from "react";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { SubCategoryCard1 } from "./sub-category-card-1";
import { SubCategoryCard2 } from "./sub-category-card-2";
import { SubCategoryCard3 } from "./sub-category-card-3";
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
import { AlertCircle, Trash2, FolderOpen, RefreshCw } from "lucide-react";
import { SubCategory } from "@/types/owner-site/admin/product";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import Pagination from "@/components/ui/site-owners/pagination";
import Link from "next/link";

interface SubCategoryComponentProps {
  component: SubCategoryComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: SubCategoryComponentData) => void;
  onSubCategoryClick?: (subcategoryId: number, order: number) => void;
  onReplace?: (componentId: string) => void;
}

export const SubCategoryComponent: React.FC<SubCategoryComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onSubCategoryClick,
  onReplace,
}) => {
  const { data: builderData, handleTextUpdate } = useBuilderLogic(
    component.data,
    updatedData => {
      if (onUpdate) {
        onUpdate(component.component_id, {
          ...component,
          data: {
            ...component.data,
            ...updatedData,
          },
        });
      }
    }
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    title = "Our SubCategories",
    subtitle,
    style = "grid-1",
  } = builderData || {};

  // Use unified mutation hooks
  const deleteSubCategoryComponent = useDeleteComponentMutation(
    pageSlug || "",
    "subcategory"
  );
  const updateSubCategoryComponent = useUpdateComponentMutation(
    pageSlug || "",
    "subcategory"
  );

  // Get subcategories with pagination
  const { data, isLoading, error } = useSubCategories();

  // Extract subcategories from the API response structure
  const subcategories = data?.results || [];
  const pagination = data?.pagination;

  const handleSubCategoryClick = (subcategory: SubCategory) => {
    if (onSubCategoryClick && component.order !== undefined) {
      onSubCategoryClick(subcategory.id, component.order);
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

    deleteSubCategoryComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    handleTextUpdate("title")(newTitle);

    if (pageSlug) {
      updateSubCategoryComponent.mutate({
        componentId: component.component_id,
        data: {
          ...component.data,
          title: newTitle,
        },
      });
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    handleTextUpdate("subtitle")(newSubtitle);

    if (pageSlug) {
      updateSubCategoryComponent.mutate({
        componentId: component.component_id,
        data: {
          ...component.data,
          subtitle: newSubtitle,
        },
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderSubCategoryCard = (subcategory: SubCategory, index: number) => {
    const cardProps = {
      subcategory,
      siteUser: isEditable ? undefined : siteUser,
      onClick: () => handleSubCategoryClick(subcategory),
    };

    switch (style) {
      case "subcategory-2":
        return <SubCategoryCard2 key={subcategory.id} {...cardProps} />;
      case "subcategory-3":
        return <SubCategoryCard3 key={subcategory.id} {...cardProps} />;
      case "subcategory-1":
        return <SubCategoryCard1 key={subcategory.id} {...cardProps} />;
      case "grid-1":
      default:
        return <SubCategoryCard1 key={subcategory.id} {...cardProps} />;
    }
  };

  const getGridClass = () => {
    switch (style) {
      case "subcategory-2":
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
      case "subcategory-3":
        return "grid-cols-1 lg:grid-cols-2 gap-8";
      case "subcategory-1":
        return "flex overflow-x-auto gap-6 pb-4";
      case "grid-1":
      default:
        return `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control with AlertDialog */}
        <div className="absolute -right-5 z-30 flex translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <div className="flex flex-col gap-2">
              <Link href="/admin/subcategories/" target="_blank" rel="noopener">
                <Button size="sm" variant="outline" className="text-sm">
                  Manage Subcategories
                </Button>
              </Link>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={handleDeleteClick}
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3 text-sm"
                  disabled={deleteSubCategoryComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteSubCategoryComponent.isPending
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReplace?.(component.component_id)}
                className="h-8 w-fit justify-start bg-white px-3"
              >
                <RefreshCw className="mr-1 h-4 w-4" />
                Replace
              </Button>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete SubCategory Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this subcategory component?
                  This action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteSubCategoryComponent.isPending}
                >
                  {deleteSubCategoryComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* SubCategories Preview */}
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
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[250px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading SubCategories</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load subcategories. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && subcategories.length > 0 && (
              <>
                <div
                  className={`${style === "subcategory-1" ? "flex gap-6 overflow-x-auto pb-4" : `grid ${getGridClass()} gap-6`}`}
                >
                  {subcategories.map((subcategory, index) => (
                    <div
                      key={subcategory.id}
                      className="relative transform cursor-default transition-transform duration-200 hover:scale-105"
                    >
                      {/* Overlay to prevent clicks in builder mode */}
                      <div className="absolute inset-0 z-10 bg-transparent" />
                      {renderSubCategoryCard(subcategory, index)}
                    </div>
                  ))}
                </div>

                {/* Pagination for builder mode */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}

            {!isLoading && !error && subcategories.length === 0 && (
              <div className="bg-muted/50 rounded-lg py-12 text-center">
                <FolderOpen className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No SubCategories Found
                </h3>
                <p className="text-muted-foreground">
                  Add some subcategories to your inventory to display them here.
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
          <div
            className={`${style === "subcategory-1" ? "flex gap-6 overflow-x-auto pb-4" : `grid ${getGridClass()} gap-8`}`}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <Skeleton className="h-[280px] w-full rounded-lg" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto max-w-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Unable to Load SubCategories</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading our subcategories. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && subcategories.length > 0 && (
          <>
            <div
              className={`${style === "subcategory-1" ? "flex gap-8 overflow-x-auto pb-4" : `grid ${getGridClass()} gap-8`}`}
            >
              {subcategories.map((subcategory, index) => (
                <div key={subcategory.id} className="flex-shrink-0">
                  {renderSubCategoryCard(subcategory, index)}
                </div>
              ))}
            </div>

            {/* Pagination for live site */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {!isLoading && !error && subcategories.length === 0 && (
          <div className="py-16 text-center">
            <FolderOpen className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No SubCategories Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              We&apos;re currently updating our subcategory structure. Please
              check back soon for new subcategories.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
