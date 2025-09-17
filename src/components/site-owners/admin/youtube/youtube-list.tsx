"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit,
  Trash2,
  Youtube,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  useYouTubeVideos,
  useDeleteYouTubeVideo,
} from "@/hooks/owner-site/admin/use-youtube";
import { YouTubeFormTrigger } from "./youtube-form";
import { YouTubeVideo } from "@/types/owner-site/admin/youtube";
import { toast } from "sonner";

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : "/placeholder-video.jpg";
};

export function YouTubeList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<YouTubeVideo | null>(null);

  const { data, isLoading, error } = useYouTubeVideos();
  const deleteVideo = useDeleteYouTubeVideo();

  const handleDeleteClick = (video: YouTubeVideo, e: React.MouseEvent) => {
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

  const handleRowClick = (video: YouTubeVideo, e: React.MouseEvent) => {
    // Don't open edit dialog if clicking on action buttons
    const target = e.target as HTMLElement;
    if (target.closest("[data-action-button]")) {
      return;
    }

    // Find and click the edit trigger
    const editTrigger = e.currentTarget.querySelector("[data-edit-trigger]");
    if (editTrigger) {
      (editTrigger as HTMLElement).click();
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Youtube className="mx-auto mb-4 h-12 w-12 text-red-400" />
            <p className="text-destructive mb-2 text-lg font-medium">
              Error loading YouTube videos
            </p>
            <p className="text-muted-foreground text-sm">
              Please try refreshing the page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 px-4 py-5 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Youtube className="h-7 w-7 text-red-600" />
            YouTube Videos
          </h1>
          <p className="mt-1 text-gray-600">
            Manage your YouTube video collection
          </p>
        </div>
        <YouTubeFormTrigger mode="create">
          <Button className="bg-red-600 text-white hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Add YouTube Video
          </Button>
        </YouTubeFormTrigger>
      </div>

      {/* Videos Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Thumbnail</TableHead>
              <TableHead>Title/URL</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-20 w-28 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : data && data.length > 0 ? (
              data.map(video => (
                <TableRow
                  key={video.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={e => handleRowClick(video, e)}
                >
                  <TableCell>
                    <img
                      src={getYouTubeThumbnail(video.url)}
                      alt="Video thumbnail"
                      className="h-20 w-28 rounded-md border object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {video.title && (
                        <p className="line-clamp-2 text-sm font-medium text-gray-900">
                          {video.title}
                        </p>
                      )}
                      <p className="text-xs break-all text-blue-600">
                        {video.url}
                      </p>
                      <p className="text-xs text-gray-500">
                        Added {new Date(video.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2" data-action-button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          window.open(video.url, "_blank");
                        }}
                        className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        title="Open video"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <YouTubeFormTrigger mode="edit" video={video}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          title="Edit video"
                          data-edit-trigger
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </YouTubeFormTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => handleDeleteClick(video, e)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Delete video"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="py-12 text-center">
                    <Youtube className="mx-auto mb-4 h-12 w-12 text-red-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      No YouTube videos yet
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Get started by adding your first YouTube video
                    </p>
                    <YouTubeFormTrigger mode="create">
                      <Button className="bg-red-600 text-white hover:bg-red-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add your first video
                      </Button>
                    </YouTubeFormTrigger>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the YouTube video
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
