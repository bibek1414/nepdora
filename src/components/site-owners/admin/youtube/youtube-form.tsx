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
  useCreateYouTubeVideo,
  useUpdateYouTubeVideo,
} from "@/hooks/owner-site/admin/use-youtube";
import { YouTubeVideo } from "@/types/owner-site/admin/youtube";

const youtubeSchema = z.object({
  url: z
    .string()
    .min(1, "YouTube URL is required")
    .url("Please enter a valid URL")
    .refine(
      url => {
        return url.includes("youtube.com") || url.includes("youtu.be");
      },
      {
        message: "Please enter a valid YouTube URL",
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

type YouTubeFormData = z.infer<typeof youtubeSchema>;

interface YouTubeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video?: YouTubeVideo;
  mode: "create" | "edit";
}

export function YouTubeForm({
  open,
  onOpenChange,
  video,
  mode,
}: YouTubeFormProps) {
  const createVideo = useCreateYouTubeVideo();
  const updateVideo = useUpdateYouTubeVideo();

  const form = useForm<YouTubeFormData>({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
    },
  });

  // Reset form when dialog opens/closes or video changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && video) {
        form.reset({
          url: video.url,
          title: video.title || "",
          description: video.description || "",
        });
      } else {
        form.reset({
          url: "",
          title: "",
          description: "",
        });
      }
    }
  }, [open, mode, video, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: YouTubeFormData) => {
    try {
      if (mode === "create") {
        await createVideo.mutateAsync(data);
      } else if (mode === "edit" && video) {
        await updateVideo.mutateAsync({ id: video.id, data });
      }
      handleClose();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const isLoading = createVideo.isPending || updateVideo.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Add YouTube Video
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Edit YouTube Video
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new YouTube video to your collection."
              : "Update the selected YouTube video information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Youtube className="absolute top-3 left-3 h-4 w-4 text-red-500" />
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
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
  video?: YouTubeVideo;
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
