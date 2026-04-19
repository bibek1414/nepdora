"use client";

import { Button } from "@/components/ui/button";
import { Plus, Video } from "lucide-react";

interface VideoTestimonialHeaderProps {
  onAdd: () => void;
  count: number;
}

export function VideoTestimonialHeader({
  onAdd,
  count,
}: VideoTestimonialHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
          Video Testimonials
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage {count} video testimonial{count !== 1 ? "s" : ""} across the
          platform.
        </p>
      </div>

      <Button
        onClick={onAdd}
        className="h-10 rounded-lg bg-slate-900 px-4 font-semibold text-white hover:bg-slate-800"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Video testimonial
      </Button>
    </div>
  );
}
