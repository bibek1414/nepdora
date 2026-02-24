"use client";
import React from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { TestimonialCard7 } from "../testimonial-card/testimonial-card-7";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquareQuote } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";

interface TestimonialStyleProps {
  data: TestimonialsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TestimonialsComponentData["data"]>) => void;
  onTestimonialClick?: (testimonialId: number) => void;
}

export const TestimonialStyle7: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onTestimonialClick,
}) => {
  const { title = "What Our Clients Say", subtitle } = data || {};
  const { data: testimonials = [], isLoading, error } = useTestimonials();
  const pageSize = 6;

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="mx-auto flex max-w-7xl flex-col items-start px-4 py-16 md:px-8 md:py-24 lg:px-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
      `}</style>
      <div className="mb-12 w-full">
        <EditableText
          value={title}
          onChange={handleTitleChange}
          as="h1"
          className="mt-4 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-4xl font-semibold tracking-tight text-transparent"
          isEditable={isEditable}
          placeholder="Enter title..."
        />
        {subtitle && (
          <EditableText
            value={subtitle}
            onChange={handleSubtitleChange}
            as="p"
            className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        )}
      </div>

      {isLoading && (
        <div className="mt-10 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              <Skeleton className="h-[200px] w-full rounded-2xl" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-10 w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Testimonials</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load testimonials."}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!isLoading && !error && testimonials.length > 0 && (
        <div className="mt-10 grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, pageSize).map(testimonial => (
            <div
              key={testimonial.id}
              className="relative transform transition-transform duration-200 hover:-translate-y-1"
            >
              {isEditable && <div className="absolute inset-0 z-10" />}
              <TestimonialCard7
                testimonial={testimonial}
                onClick={() => onTestimonialClick?.(testimonial.id)}
              />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && testimonials.length === 0 && (
        <div className="bg-muted/30 mt-10 w-full rounded-2xl border border-dashed py-20 text-center">
          <MessageSquareQuote className="text-muted-foreground mx-auto mb-6 h-16 w-16 opacity-50" />
          <h3 className="text-foreground mb-4 text-2xl font-semibold">
            No Testimonials Available
          </h3>
          <p className="text-muted-foreground mx-auto max-w-md text-lg">
            Customer testimonials will be displayed here once available.
          </p>
        </div>
      )}
    </section>
  );
};
