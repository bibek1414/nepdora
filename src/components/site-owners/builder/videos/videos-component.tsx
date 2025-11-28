import React, { useState } from "react";
import { VideosComponentData } from "@/types/owner-site/components/videos";
import { useVideos } from "@/hooks/owner-site/admin/use-videos";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { VideosCard1 } from "./videos-card-1";
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
import { AlertCircle, Trash2, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/ui/editable-text";
import { YouTubeFormTrigger } from "../../admin/videos/videos-form";

interface VideosComponentProps {
  component: VideosComponentData;
  isEditable?: boolean;
  siteUser?: string;
  pageSlug?: string;
  onUpdate?: (componentId: string, newData: VideosComponentData) => void;
}

export const VidoesComponent: React.FC<VideosComponentProps> = ({
  component,
  isEditable = false,
  siteUser,
  pageSlug,
  onUpdate,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    title = "Our Videos",
    subtitle,
    style = "videos-1",
  } = component.data || {};

  // Use unified mutation hooks
  const deleteVideosComponent = useDeleteComponentMutation(
    pageSlug || "",
    "videos"
  );
  const updateVideosComponent = useUpdateComponentMutation(
    pageSlug || "",
    "videos"
  );

  // Get video data
  const { data: videos = [], isLoading, error } = useVideos();

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

    deleteVideosComponent.mutate(component.component_id);
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!pageSlug) {
      console.error("pageSlug is required for updating component");
      return;
    }

    updateVideosComponent.mutate({
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

    updateVideosComponent.mutate({
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

  const renderYouTubeCard = () => {
    const cardProps = { videos };

    switch (style) {
      case "videos-1":
      default:
        return <VideosCard1 {...cardProps} />;
    }
  };

  // Builder mode preview
  if (isEditable) {
    return (
      <div className="group relative">
        {/* Delete Control */}
        <div className="absolute -right-5 z-30 flex translate-x-full opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <YouTubeFormTrigger mode="create">
              <Button className="bg-white text-gray-800 hover:bg-white hover:text-gray-900">
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </YouTubeFormTrigger>
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
                  disabled={deleteVideosComponent.isPending}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteVideosComponent.isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Trash2 className="text-destructive h-5 w-5" />
                    Delete YouTube Component
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this YouTube component? This
                    action cannot be undone and will permanently remove the
                    component from your page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleteVideosComponent.isPending}
                  >
                    {deleteVideosComponent.isPending
                      ? "Deleting..."
                      : "Delete Component"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {/* YouTube Preview */}
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

            <div className="mx-auto max-w-6xl">
              {isLoading && (
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading Videos</AlertTitle>
                  <AlertDescription>
                    {error instanceof Error
                      ? error.message
                      : "Failed to load YouTube videos. Please check your API connection."}
                  </AlertDescription>
                </Alert>
              )}

              {!isLoading && !error && videos.length > 0 && (
                <div className="relative">
                  <div className="absolute inset-0 z-10 bg-transparent" />
                  {renderYouTubeCard()}
                </div>
              )}

              {!isLoading && !error && videos.length === 0 && (
                <div className="bg-muted/50 rounded-lg py-12 text-center">
                  <Play className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    No Videos Found
                  </h3>
                  <p className="text-muted-foreground">
                    Add videos to display them here.
                  </p>
                </div>
              )}
            </div>
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

        <div className="mx-auto max-w-6xl">
          {isLoading && (
            <div className="space-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-56 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mx-auto max-w-2xl">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Unable to Load Videos</AlertTitle>
              <AlertDescription className="text-base">
                {error instanceof Error
                  ? error.message
                  : "We're having trouble loading our videos. Please try refreshing the page."}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && videos.length > 0 && renderYouTubeCard()}

          {!isLoading && !error && videos.length === 0 && (
            <div className="py-16 text-center">
              <Play className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
              <h3 className="text-foreground mb-4 text-2xl font-semibold">
                No Videos Available
              </h3>
              <p className="text-muted-foreground mx-auto max-w-md text-lg">
                Our video library is currently being updated. Please check back
                soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
