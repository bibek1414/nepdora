"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  ExternalLink,
  Youtube,
  Loader2,
  Play,
} from "lucide-react";
import { VideoTestimonial } from "@/types/super-admin/video-testimonial";
import { extractVideoInfo, getVideoThumbnail } from "@/lib/video-utils";

interface VideoTestimonialTableProps {
  testimonials: VideoTestimonial[];
  onEdit: (testimonial: VideoTestimonial) => void;
  onDelete: (testimonial: VideoTestimonial) => void;
  isLoading: boolean;
}

export function VideoTestimonialTable({
  testimonials,
  onEdit,
  onDelete,
  isLoading,
}: VideoTestimonialTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        <p className="text-sm text-slate-500">Loading testimonials...</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
          <Play className="h-6 w-6 text-slate-200" />
        </div>
        <h3 className="text-sm font-medium text-slate-900">
          No video testimonials found
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Get started by adding your first video testimonial.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[300px]">Video Info</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Added Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map(testimonial => {
            const { platform, id } = extractVideoInfo(testimonial.video_url);
            const thumbnail = getVideoThumbnail(platform, id);

            return (
              <TableRow
                key={testimonial.id}
                className="group transition-colors hover:bg-slate-50/50"
              >
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition-colors group-hover:border-slate-300">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                          <Youtube className="h-6 w-6 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                        <Play className="h-5 w-5 fill-white text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="line-clamp-1 font-medium text-slate-900">
                        {testimonial.name}
                      </div>
                      <div className="mt-0.5 text-xs font-medium tracking-tight text-slate-500 uppercase">
                        {platform}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="group/link flex items-center gap-2">
                    <p className="max-w-[200px] truncate text-sm text-slate-600">
                      {testimonial.video_url}
                    </p>
                    <a
                      href={testimonial.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 transition-colors hover:text-red-600"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {formatDate(testimonial.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(testimonial)}
                      className="h-8 w-8 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(testimonial)}
                      className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
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
    </div>
  );
}
