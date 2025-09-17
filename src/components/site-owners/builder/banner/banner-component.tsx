import React, { useState } from "react";
import { BannerComponentData } from "@/types/owner-site/components/banner";
import { useBanners } from "@/hooks/owner-site/use-banner";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/unified";
import { BannerTemplate1 } from "./banner-template-1";
import { BannerTemplate2 } from "./banner-template-2";
import { BannerTemplate3 } from "./banner-template-3";
import { BannerTemplate4 } from "./banner-template-4";
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
import { AlertCircle, Trash2, Image as ImageIcon } from "lucide-react";
import { Banner } from "@/types/owner-site/banner";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";

interface BannerComponentProps {
  component: BannerComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: BannerComponentData) => void;
  onBannerClick?: (bannerId: number, imageId: number) => void;
}

export const BannerComponent: React.FC<BannerComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
  onBannerClick,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    title = "Featured Content",
    subtitle,
    template = "banner-1",
    bannerType = "Banner", // This should match the backend Banner type
  } = component.data || {};

  // Use unified mutation hooks
  const deleteBannerComponent = useDeleteComponentMutation(
    pageSlug || "",
    "banner"
  );
  const updateBannerComponent = useUpdateComponentMutation(
    pageSlug || "",
    "banner"
  );

  // Get banners from API
  const { data: banners = [], isLoading, error } = useBanners();

  // Map template to correct banner type
  const getExpectedBannerType = (
    template: string
  ): "Banner" | "Slider" | "Sidebar" => {
    switch (template) {
      case "banner-1":
        return "Banner";
      case "banner-2":
        return "Slider";
      case "banner-3":
        return "Sidebar";
      case "banner-4":
        return "Banner"; // Advanced banner is still a Banner type
      default:
        return "Banner";
    }
  };

  // Get the expected banner type based on template
  const expectedBannerType = getExpectedBannerType(template);

  // Filter banners by the expected banner type for the template
  const relevantBanner = banners.find(
    banner => banner.banner_type === expectedBannerType && banner.is_active
  );

  const handleBannerClick = (banner: Banner, imageId: number) => {
    if (onBannerClick && component.order !== undefined) {
      onBannerClick(banner.id, imageId);
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

    if (!component.component_id) {
      console.error("component_id is required for deletion");
      return;
    }

    deleteBannerComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    if (!component.component_id) {
      console.error("component_id is required for updating component");
      return;
    }

    updateBannerComponent.mutate({
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

    if (!component.component_id) {
      console.error("component_id is required for updating component");
      return;
    }

    updateBannerComponent.mutate({
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

  const handleUpdate = (updatedData: Partial<typeof component.data>) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    if (!component.component_id) {
      console.error("component_id is required for updating component");
      return;
    }

    updateBannerComponent.mutate({
      componentId: component.component_id,
      data: {
        ...component.data,
        ...updatedData,
      },
    });

    if (onUpdate) {
      onUpdate(component.component_id, {
        ...component,
        data: {
          ...component.data,
          ...updatedData,
        },
      });
    }
  };

  const renderBannerTemplate = () => {
    if (!relevantBanner) return null;

    // Convert API banner data to component data format
    const bannerData = {
      ...component.data,
      images: relevantBanner.images.filter(img => img.is_active),
    };

    const props = {
      bannerData,
      isEditable,
      siteUser,
      onUpdate: handleUpdate,
    };

    switch (template) {
      case "banner-1":
        return <BannerTemplate1 {...props} />;
      case "banner-2":
        return <BannerTemplate2 {...props} />;
      case "banner-3":
        return <BannerTemplate3 {...props} />;
      case "banner-4":
        return <BannerTemplate4 {...props} />;
      default:
        return <BannerTemplate1 {...props} />;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control */}
        <div className="absolute top-4 right-4 z-20 opacity-0 transition-opacity group-hover:opacity-100">
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                onClick={handleDeleteClick}
                variant="destructive"
                size="sm"
                className="h-8 px-3"
                disabled={deleteBannerComponent.isPending}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {deleteBannerComponent.isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="text-destructive h-5 w-5" />
                  Delete Banner Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this banner component? This
                  action cannot be undone and will permanently remove the
                  component from your page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteBannerComponent.isPending}
                >
                  {deleteBannerComponent.isPending
                    ? "Deleting..."
                    : "Delete Component"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Banner Preview */}
        <div className="py-4">
          <div className="container mx-auto px-4">
            {/* Editable Title and Subtitle */}
            {(title || subtitle) && (
              <div className="mb-6 text-center">
                {title && (
                  <EditableText
                    value={title}
                    onChange={handleTitleChange}
                    as="h2"
                    className="text-foreground mb-2 text-2xl font-bold tracking-tight"
                    isEditable={true}
                    placeholder="Enter banner title..."
                  />
                )}
                {subtitle && (
                  <EditableText
                    value={subtitle}
                    onChange={handleSubtitleChange}
                    as="p"
                    className="text-muted-foreground mx-auto max-w-2xl text-base"
                    isEditable={true}
                    placeholder="Enter banner subtitle..."
                    multiline={true}
                  />
                )}
              </div>
            )}

            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-xl md:h-[300px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-16 w-24 rounded" />
                  <Skeleton className="h-16 w-24 rounded" />
                  <Skeleton className="h-16 w-24 rounded" />
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Banner</AlertTitle>
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load banner content. Please check your API connection."}
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && relevantBanner && (
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 z-10 bg-transparent" />
                {renderBannerTemplate()}
              </div>
            )}

            {!isLoading && !error && !relevantBanner && (
              <div className="bg-muted/50 rounded-lg py-12 text-center">
                <ImageIcon className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Banner Content Found
                </h3>
                <p className="text-muted-foreground">
                  Add {expectedBannerType.toLowerCase()} content to display
                  here.
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Template: {template} • Expected Type: {expectedBannerType}
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
    <section className="bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Optional Title and Subtitle for live site */}
        {(title || subtitle) && (
          <div className="mb-8 py-8 text-center">
            {title && (
              <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {isLoading && (
          <div className="space-y-6 p-4">
            <Skeleton className="h-[250px] w-full rounded-lg md:h-[400px]" />
            {template === "banner-2" || template === "banner-4" ? (
              <div className="flex justify-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-2 w-2 rounded-full" />
              </div>
            ) : null}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mx-auto my-8 max-w-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Unable to Load Banner</AlertTitle>
            <AlertDescription className="text-base">
              {error instanceof Error
                ? error.message
                : "We're having trouble loading the banner. Please try refreshing the page."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && relevantBanner && renderBannerTemplate()}

        {!isLoading && !error && !relevantBanner && (
          <div className="py-16 text-center">
            <ImageIcon className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Banner Content
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              {expectedBannerType} content is currently being updated. Please
              check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
