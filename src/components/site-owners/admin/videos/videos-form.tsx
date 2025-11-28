"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Youtube } from "lucide-react";
import {
  useCreateVideo,
  useUpdateVideo,
} from "@/hooks/owner-site/admin/use-videos";
import { Video } from "@/types/owner-site/admin/videos";

import { extractVideoInfo, VideoPlatform } from "@/lib/video-utils";

const videoSchema = z.object({
  url: z
    .string()
    .min(1, "Video URL is required")
    .url("Please enter a valid URL")
    .refine(
      url => {
        const { platform } = extractVideoInfo(url);
        return platform !== "other";
      },
      {
        message:
          "Please enter a valid URL from YouTube, Facebook, Instagram, or TikTok",
      }
    ),
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

type VideoFormData = z.infer<typeof videoSchema>;

interface VideoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video?: Video;
  mode: "create" | "edit";
}

export function YouTubeForm({
  open,
  onOpenChange,
  video,
  mode,
}: VideoFormProps) {
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const [detectedPlatform, setDetectedPlatform] =
    useState<VideoPlatform>("other");

  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
    },
  });

  // Watch URL for platform detection
  const url = form.watch("url");
  useEffect(() => {
    if (url) {
      const { platform } = extractVideoInfo(url);
      setDetectedPlatform(platform);
    } else {
      setDetectedPlatform("other");
    }
  }, [url]);

  // Reset form when dialog opens/closes or video changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && video) {
        form.reset({
          url: video.url,
          title: video.title || "",
          description: video.description || "",
        });
        const { platform } = extractVideoInfo(video.url);
        setDetectedPlatform(platform);
      } else {
        form.reset({
          url: "",
          title: "",
          description: "",
        });
        setDetectedPlatform("other");
      }
    }
  }, [open, mode, video, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: VideoFormData) => {
    try {
      const { platform } = extractVideoInfo(data.url);
      const videoData = { ...data, platform };

      if (mode === "create") {
        await createVideo.mutateAsync(videoData);
      } else if (mode === "edit" && video) {
        await updateVideo.mutateAsync({ id: video.id, data: videoData });
      }
      handleClose();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isLoading = createVideo.isPending || updateVideo.isPending;

  const getPlatformIcon = () => {
    switch (detectedPlatform) {
      case "youtube":
        return (
          <Youtube className="absolute top-3 left-3 h-4 w-4 text-red-500" />
        );
      case "facebook":
        return (
          <div className="absolute top-3 left-3 flex h-4 w-4 items-center justify-center font-bold text-blue-600">
            f
          </div>
        );
      case "instagram":
        return (
          <div className="absolute top-3 left-3 flex h-4 w-4 items-center justify-center font-bold text-pink-600">
            IG
          </div>
        );
      case "tiktok":
        return (
          <div className="absolute top-3 left-3 flex h-4 w-4 items-center justify-center font-bold text-black">
            TT
          </div>
        );
      default:
        return (
          <Youtube className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Add Video
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Edit Video
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new video from YouTube, Facebook, Instagram, or TikTok."
              : "Update the selected video information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      {getPlatformIcon()}
                      <Input
                        placeholder="Paste video URL here..."
                        {...field}
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter video title..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter video description..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Add Video" : "Update Video"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// YouTube Form Trigger Component
interface YouTubeFormTriggerProps {
  video?: Video;
  mode: "create" | "edit";
  children?: React.ReactNode;
}

export function YouTubeFormTrigger({
  video,
  mode,
  children,
}: YouTubeFormTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <YouTubeForm
        open={open}
        onOpenChange={setOpen}
        video={video}
        mode={mode}
      />
    </>
  );
}
