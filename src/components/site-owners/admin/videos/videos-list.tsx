"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Youtube,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useVideos, useDeleteVideo } from "@/hooks/owner-site/admin/use-videos";
import { YouTubeFormTrigger } from "./videos-form";
import { Video } from "@/types/owner-site/admin/videos";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  extractVideoInfo,
  getVideoThumbnail,
  VideoPlatform,
} from "@/lib/video-utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableWrapper,
  TableActionButtons,
  TableUserCell,
} from "@/components/ui/custom-table";

// Helper function to get platform icon
const PlatformIcon = ({ platform }: { platform: VideoPlatform }) => {
  switch (platform) {
    case "youtube":
      return <Youtube className="h-4 w-4 text-red-600" />;
    case "facebook":
      return (
        <div className="flex h-4 w-4 items-center justify-center text-[10px] font-bold text-blue-600">
          f
        </div>
      );
    case "instagram":
      return (
        <div className="flex h-4 w-4 items-center justify-center text-[10px] font-bold text-pink-600">
          IG
        </div>
      );
    case "tiktok":
      return (
        <div className="flex h-4 w-4 items-center justify-center text-[10px] font-bold text-black">
          TT
        </div>
      );
    default:
      return (
        <div className="flex h-4 w-4 items-center justify-center text-[10px] font-bold text-gray-400">
          ?
        </div>
      );
  }
};

export function YouTubeList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const { data, isLoading, error } = useVideos();
  const deleteVideo = useDeleteVideo();

  const handleDeleteClick = (video: Video, e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (videoToDelete) {
      try {
        await deleteVideo.mutateAsync(videoToDelete.id);
        setDeleteDialogOpen(false);
        setVideoToDelete(null);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (error) {
    return (
      <div className="animate-in fade-in min-h-screen bg-white duration-700">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <TableWrapper>
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Youtube className="mx-auto mb-4 h-12 w-12 text-red-400" />
                <p className="mb-2 text-lg font-medium text-red-600">
                  Error loading videos
                </p>
                <p className="text-sm text-slate-500">
                  Please try refreshing the page
                </p>
              </div>
            </div>
          </TableWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-700">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Videos
            </h1>
            <p className="text-sm text-slate-500">
              Manage your video collection.{" "}
              {data && (
                <>
                  <span className="font-semibold text-slate-700">
                    {data.length}
                  </span>{" "}
                  {data.length === 1 ? "video" : "videos"} available.
                </>
              )}
            </p>
          </div>

          <YouTubeFormTrigger mode="create">
            <Button className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </YouTubeFormTrigger>
        </div>

        {/* Videos Table */}
        <TableWrapper>
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
                <p className="animate-pulse text-sm text-slate-400">
                  Loading videos...
                </p>
              </div>
            ) : data && data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="px-6 py-4 font-semibold text-slate-700">
                      Video Info
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-slate-700">
                      URL
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-slate-700">
                      Added
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(video => {
                    const { platform, id } = extractVideoInfo(video.url);
                    const thumbnail = getVideoThumbnail(platform, id);

                    return (
                      <TableRow
                        key={video.id}
                        className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                      >
                        <TableCell className="px-6 py-4">
                          <TableUserCell
                            imageSrc={thumbnail || undefined}
                            fallback={
                              video.title
                                ? video.title.substring(0, 2).toUpperCase()
                                : "?"
                            }
                            title={video.title || "Untitled Video"}
                            subtitle={
                              platform.charAt(0).toUpperCase() +
                              platform.slice(1)
                            }
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={platform} />
                            <p className="max-w-[200px] truncate text-xs text-blue-600">
                              {video.url}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                          {formatDate(video.created_at)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={e => {
                                e.stopPropagation();
                                window.open(video.url, "_blank");
                              }}
                              className="h-8 w-8 rounded-full text-slate-400 hover:text-blue-600"
                              title="Open video"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <YouTubeFormTrigger mode="edit" video={video}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-slate-400 hover:text-blue-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </YouTubeFormTrigger>
                            <TableActionButtons
                              onDelete={() =>
                                handleDeleteClick(video, {
                                  stopPropagation: () => {},
                                } as any)
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Youtube className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">
                  No videos found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Get started by adding your first video.
                </p>
              </div>
            )}
          </div>
        </TableWrapper>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the video
              {videoToDelete?.title && ` "${videoToDelete.title}"`}. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleteVideo.isPending}
            >
              {deleteVideo.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Video
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
