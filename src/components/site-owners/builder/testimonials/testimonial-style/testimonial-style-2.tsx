"use client";
import React from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { TestimonialCard2 } from "../testimonial-card/testimonial-card-2";
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

export const TestimonialStyle2: React.FC<TestimonialStyleProps> = ({
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
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16">
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
          <EditableText
            value={subtitle || ""}
            onChange={handleSubtitleChange}
            as="p"
            className="text-muted-foreground max-w-3xl text-xl leading-relaxed"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
            multiline={true}
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-4">
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {testimonials.slice(0, pageSize).map(testimonial => (
              <div
                key={testimonial.id}
                className="relative h-full transform transition-transform duration-300 hover:-translate-y-1"
              >
                {isEditable && <div className="absolute inset-0 z-10" />}
                <TestimonialCard2
                  testimonial={testimonial}
                  onClick={() => onTestimonialClick?.(testimonial.id)}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && testimonials.length === 0 && (
          <div className="bg-muted/30 rounded-2xl border border-dashed py-20 text-center">
            <MessageSquareQuote className="text-muted-foreground mx-auto mb-6 h-16 w-16 opacity-50" />
            <h3 className="text-foreground mb-3 text-2xl font-semibold">
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
