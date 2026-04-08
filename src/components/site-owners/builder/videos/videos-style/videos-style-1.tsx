"use client";
import React from "react";
import { useVideos } from "@/hooks/owner-site/admin/use-videos";
import { VideosCard1 } from "../videos-card/videos-card-1";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Play } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { VideosComponentData } from "@/types/owner-site/components/videos";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface VideosStyleProps {
  data: VideosComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<VideosComponentData["data"]>) => void;
}

export const VideosStyle1: React.FC<VideosStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { title = "Our Videos", subtitle } = data || {};
  const { data: videos = [], isLoading, error } = useVideos();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8 text-center">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-2 text-3xl font-bold tracking-tight"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground mx-auto max-w-2xl text-lg"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        <div className="mx-auto max-w-6xl">
          {isLoading && (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-56 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
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
                  : "Failed to load videos."}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && videos.length > 0 && (
            <div className="relative">
              {isEditable && (
                <div className="absolute inset-0 z-10 bg-transparent" />
              )}
              <VideosCard1 videos={videos} />
            </div>
          )}

          {!isLoading && !error && videos.length === 0 && (
            <BuilderEmptyState
              icon={Play}
              title="No Videos Available"
              description="Share your story with videos. Add your first video from the admin dashboard."
              actionLabel="Manage Videos"
              actionLink="/admin/videos"
              isEditable={isEditable}
            />
          )}
        </div>
      </div>
    </section>
  );
};
