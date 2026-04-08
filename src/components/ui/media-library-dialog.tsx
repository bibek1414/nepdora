"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  Search,
  Trash2,
  Check,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useS3Files, useUploadS3, useDeleteS3 } from "@/hooks/use-s3";
import { DEFAULT_MAX_IMAGE_SIZE, S3File } from "@/utils/s3";
import { compressImage } from "@/utils/image-compression";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

interface MediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number;
}

export function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  folder = "nepdora",
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxSize = DEFAULT_MAX_IMAGE_SIZE,
}: MediaLibraryDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const { data: files = [], isLoading } = useS3Files(open);
  const uploadMutation = useUploadS3();
  const deleteMutation = useDeleteS3();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type");
      return;
    }

    // Only block if it's NOT an image and still too large,
    // or if it's an image but ridiculously large (e.g. > 10MB) even for compression.
    const MAX_RAW_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_RAW_SIZE) {
      toast.error("File is too large (max 10MB)");
      return;
    }

    try {
      let fileToUpload = file;
      if (
        file.size > DEFAULT_MAX_IMAGE_SIZE &&
        file.type.startsWith("image/")
      ) {
        setIsCompressing(true);
        fileToUpload = await compressImage(file, {
          maxSizeMB: DEFAULT_MAX_IMAGE_SIZE / (1024 * 1024),
          useWebWorker: true,
        });
        setIsCompressing(false);
      }

      await uploadMutation.mutateAsync({ file: fileToUpload, folder });
      toast.success("Image uploaded successfully");
      // Don't close or auto-select, let user see the new image in the library
    } catch (error) {
      setIsCompressing(false);
      // Error handled in hook
    }
  };

  const handleDelete = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    setUrlToDelete(url);
  };

  const confirmDelete = async () => {
    if (!urlToDelete) return;

    try {
      await deleteMutation.mutateAsync([urlToDelete]);
      if (selectedUrl === urlToDelete) setSelectedUrl(null);
    } catch (error) {
      // Error handled in hook
    } finally {
      setUrlToDelete(null);
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-150 max-w-4xl! flex-col overflow-hidden rounded-2xl border border-[#E8E4DF] bg-[#FAFAF8] p-0 shadow-2xl shadow-black/10"
        style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      >
        {/* ── Header ── */}
        <DialogHeader className="px-8 pt-7 pb-0">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight text-[#1A1714]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EBE4] text-[#6B5C4E]">
              <ImageIcon className="h-4.5 w-4.5" strokeWidth={1.75} />
            </span>
            Media Library
          </DialogTitle>
        </DialogHeader>

        {/* ── Search Bar ── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* ── Scrollable Content Area ── */}
          <ScrollArea className="flex-1 overflow-y-auto px-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <Loader2
                  className="h-7 w-7 animate-spin text-[#B0A090]"
                  strokeWidth={1.5}
                />
                <p className="text-sm text-[#A09080]">Loading your media…</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pb-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {/* ── Upload Card ── */}
                {!searchQuery && (
                  <label
                    className={cn(
                      "group relative aspect-square cursor-pointer overflow-hidden rounded-2xl",
                      "border-2 border-dashed border-[#DDD8D0] bg-white",
                      "flex flex-col items-center justify-center gap-2 p-4 text-center",
                      "transition-all duration-200 hover:border-[#8C6A3C] hover:bg-[#FBF9F6]",
                      uploadMutation.isPending && "pointer-events-none"
                    )}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept={allowedTypes.join(",")}
                      disabled={uploadMutation.isPending}
                    />

                    {uploadMutation.isPending || isCompressing ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-[#8C6A3C]" />
                        <span className="text-[10px] font-medium text-[#8C6A3C]">
                          {isCompressing ? "Optimizing…" : "Uploading…"}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold text-[#1A1714]">
                            Click to upload
                          </p>
                          <p className="text-[9px] leading-tight text-gray-500">
                            PNG, JPG, WebP <br /> Auto-optimized
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                )}

                {filteredFiles.map(file => (
                  <div
                    key={file.url}
                    onClick={() => setSelectedUrl(file.url)}
                    title={file.name}
                    className={cn(
                      "group relative aspect-square cursor-pointer overflow-hidden rounded-2xl",
                      "border-2 shadow-sm transition-all duration-200 hover:shadow-md",
                      selectedUrl === file.url
                        ? "border-[#8C6A3C] ring-2 ring-[#8C6A3C]/10"
                        : "border-transparent hover:border-[#D4C5B0]"
                    )}
                  >
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    />

                    {/* Check Overlay */}
                    {selectedUrl === file.url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#8C6A3C]/30 text-white backdrop-blur-[1px] transition-all duration-300">
                        <div className="scale-110 rounded-full bg-[#8C6A3C] p-1.5 shadow-lg transition-transform">
                          <Check className="h-5 w-5" strokeWidth={3} />
                        </div>
                      </div>
                    )}

                    {/* Delete button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "absolute top-2 right-2 h-7 w-7 rounded-full",
                        "bg-white/90 text-[#6B5040] backdrop-blur-sm hover:bg-red-50 hover:text-red-600",
                        "opacity-0 shadow-sm transition-all group-hover:opacity-100",
                        deleteMutation.isPending &&
                          deleteMutation.variables?.includes(file.url) &&
                          "opacity-100"
                      )}
                      onClick={e => handleDelete(e, file.url)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables?.includes(file.url) ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      )}
                    </Button>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-[10px] font-medium text-white">
                        {file.name}
                      </p>
                    </div>
                  </div>
                ))}

                {filteredFiles.length === 0 && searchQuery && (
                  <div className="col-span-full flex flex-col items-center gap-4 py-20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EBE4]">
                      <Search className="h-6 w-6 text-[#A09080]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#1A1714]">
                        No results found
                      </p>
                      <p className="text-xs text-[#A09080]">
                        Try searching for something else
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* ── Footer (Always Visible) ── */}
        <DialogFooter className="border-t border-[#E8E4DF] bg-[#F7F5F2] px-8 py-5">
          <div className="flex w-full items-center justify-between gap-4">
            <p className="max-w-[50%] truncate text-xs text-[#A09080]">
              {selectedUrl
                ? `Selected: ${selectedUrl.split("/").pop()}`
                : "No image selected"}
            </p>
            <div className="flex gap-2.5">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 rounded-lg border-[#E0DBD4] bg-white px-5 text-sm text-[#5C4E42] hover:border-[#D0C5B8] hover:bg-[#F0EBE4]"
              >
                Cancel
              </Button>
              <Button
                disabled={!selectedUrl || isLoading}
                onClick={() => {
                  if (selectedUrl) {
                    onSelect(selectedUrl);
                    onOpenChange(false);
                  }
                }}
                className="h-9 rounded-lg bg-[#1A1714] px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#2E2924] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Use Selected
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>

      <AlertDialog
        open={!!urlToDelete}
        onOpenChange={open => !open && setUrlToDelete(null)}
      >
        <AlertDialogContent className="max-w-[400px] rounded-2xl border-[#E8E4DF] bg-[#FAFAF8] shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-[#1A1714]">
              Delete Image?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#A09080]">
              This will permanently remove the image from your library. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel
              className="h-10 flex-1 rounded-xl border-[#E0DBD4] bg-white text-sm font-medium text-[#5C4E42] transition-colors hover:bg-[#F0EBE4] hover:text-[#1A1714]"
              onClick={() => setUrlToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-10 flex-1 rounded-xl bg-red-600 text-sm font-medium text-white transition-colors hover:bg-red-700 active:scale-95"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
