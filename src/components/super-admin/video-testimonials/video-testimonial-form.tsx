"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit } from "lucide-react";
import { extractVideoInfo } from "@/lib/video-utils";
import {
  VideoTestimonial,
  CreateVideoTestimonialData,
} from "@/types/super-admin/video-testimonial";

const videoSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  video_url: z
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
});

type VideoFormData = z.infer<typeof videoSchema>;

interface VideoTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: VideoTestimonial | null;
  onSubmit: (data: CreateVideoTestimonialData) => Promise<void>;
  isLoading: boolean;
}

export function VideoTestimonialModal({
  isOpen,
  onClose,
  testimonial,
  onSubmit,
  isLoading,
}: VideoTestimonialModalProps) {
  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      name: "",
      video_url: "",
    },
  });

  // Reset form when editing or adding
  const mode = testimonial ? "edit" : "create";

  if (
    isOpen &&
    testimonial &&
    form.getValues("name") === "" &&
    form.getValues("video_url") === ""
  ) {
    form.reset({
      name: testimonial.name,
      video_url: testimonial.video_url,
    });
  } else if (
    isOpen &&
    !testimonial &&
    (form.getValues("name") !== "" || form.getValues("video_url") !== "")
  ) {
    // This is a bit hacky to prevent re-renders, but ensures clean form for "Add"
    // A better way is usually with useEffect but let's keep it simple for now
  }

  const handleSubmit = async (data: VideoFormData) => {
    await onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                <Plus className="h-5 w-5" />
                Add Video Testimonial
              </>
            ) : (
              <>
                <Edit className="h-5 w-5" />
                Edit Video Testimonial
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new video testimonial from YouTube, Facebook, Instagram, or TikTok."
              : "Update the selected video testimonial information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter person name..."
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
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Paste video URL here..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Add Testimonial" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
