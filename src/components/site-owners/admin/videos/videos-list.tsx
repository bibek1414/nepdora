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
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useVideos, useDeleteVideo } from "@/hooks/owner-site/admin/use-videos";
import { YouTubeFormTrigger } from "./videos-form";
import { Video } from "@/types/owner-site/admin/videos";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { SimplePagination } from "@/components/ui/simple-pagination";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data, isLoading, error } = useVideos();
  const deleteVideo = useDeleteVideo();

  // Simple search filter for local data
  const filteredData = (data || []).filter(
    video =>
      video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

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
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="flex h-64 items-center justify-center rounded-lg border border-black/5 bg-white">
            <div className="text-center">
              <Youtube className="mx-auto mb-4 h-12 w-12 text-black/20" />
              <p className="mb-2 text-sm font-medium text-red-600">
                Error loading videos
              </p>
              <p className="text-xs text-black/40">
                Please try refreshing the page
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">Videos</h1>
        </div>

        {/* Search and Add Buttons */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <YouTubeFormTrigger mode="create">
            <Button className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </YouTubeFormTrigger>
        </div>

        {/* Videos Table */}
        <div className="rounded-lg bg-white">
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-black/20" />
                <p className="text-xs text-black/40">Loading videos...</p>
              </div>
            ) : filteredData.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-black/5">
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Video Info
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        URL
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Added
                      </TableHead>
                      <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map(video => {
                      const { platform, id } = extractVideoInfo(video.url);
                      const thumbnail = getVideoThumbnail(platform, id);

                      return (
                        <TableRow
                          key={video.id}
                          className="group border-b border-black/5 transition-colors hover:bg-black/2"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {thumbnail ? (
                                <div className="h-9 w-12 overflow-hidden rounded bg-black/5">
                                  <img
                                    src={thumbnail}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded bg-black/5 text-xs font-medium text-black/60">
                                  {video.title?.substring(0, 2).toUpperCase() ||
                                    "?"}
                                </div>
                              )}
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-normal text-black">
                                  {video.title || "Untitled Video"}
                                </span>
                                <span className="text-xs text-black/50">
                                  {platform.charAt(0).toUpperCase() +
                                    platform.slice(1)}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <PlatformIcon platform={platform} />
                              <p className="max-w-[200px] truncate text-xs text-black/40">
                                {video.url}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-black/40">
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
                                className="h-8 w-8 rounded-full text-black/40 hover:text-black/60"
                                title="Open video"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <YouTubeFormTrigger mode="edit" video={video}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full text-black/40 hover:text-black/60"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </YouTubeFormTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={e => handleDeleteClick(video, e)}
                                className="h-8 w-8 rounded-full text-black/40 hover:text-black/60"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <SimplePagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
                  <Youtube className="h-6 w-6 text-black/20" />
                </div>
                <h3 className="text-sm font-medium text-black">
                  No videos found
                </h3>
              </div>
            )}
          </div>
        </div>
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
