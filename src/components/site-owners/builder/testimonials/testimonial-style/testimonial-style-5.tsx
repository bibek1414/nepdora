"use client";
import React from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { TestimonialCard5 } from "../testimonial-card/testimonial-card-5";
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

export const TestimonialStyle5: React.FC<TestimonialStyleProps> = ({
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
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            <EditableText
              value={title}
              onChange={handleTitleChange}
              as="h2"
              className="text-foreground mb-4 text-4xl font-bold tracking-tight"
              isEditable={isEditable}
              placeholder="Enter title..."
            />
            <EditableText
              value={subtitle || ""}
              onChange={handleSubtitleChange}
              as="p"
              className="text-muted-foreground mx-auto max-w-3xl text-xl"
              isEditable={isEditable}
              placeholder="Enter subtitle..."
              multiline={true}
            />
          </div>
        )}

        {isLoading && (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-80 flex-shrink-0">
                <Skeleton className="h-[240px] w-full rounded-lg" />
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Testimonials</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load testimonials."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && testimonials.length > 0 && (
          <div className="relative">
            {isEditable && <div className="absolute inset-0 z-10" />}
            <TestimonialCard5
              testimonials={testimonials.slice(0, pageSize)}
              onClick={testimonial => onTestimonialClick?.(testimonial.id)}
            />
          </div>
        )}

        {!isLoading && !error && testimonials.length === 0 && (
          <div className="py-16 text-center">
            <MessageSquareQuote className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Testimonials Available
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md text-lg">
              Customer testimonials will be displayed here once available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
