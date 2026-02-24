"use client";
import React from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { TestimonialCard8 } from "../testimonial-card/testimonial-card-8";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquareQuote } from "lucide-react";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";

interface TestimonialStyleProps {
  data: TestimonialsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TestimonialsComponentData["data"]>) => void;
  onTestimonialClick?: (testimonialId: number) => void;
}

export const TestimonialStyle8: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onTestimonialClick,
}) => {
  const {
    title = "What Our Clients Say",
    subtitle,
    backgroundImage,
  } = data || {};
  const { data: testimonials = [], isLoading, error } = useTestimonials();
  const pageSize = 6;

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  const handleBackgroundImageChange = (imageUrl: string) => {
    onUpdate?.({ backgroundImage: imageUrl });
  };

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-[500px] w-full rounded-3xl" />
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
            {isEditable && (
              <div className="pointer-events-none absolute inset-0 z-10" />
            )}
            <TestimonialCard8
              testimonials={testimonials.slice(0, pageSize)}
              title={title}
              subtitle={subtitle}
              backgroundImage={backgroundImage}
              isEditable={isEditable}
              onTitleChange={handleTitleChange}
              onSubtitleChange={handleSubtitleChange}
              onBackgroundChange={handleBackgroundImageChange}
              onTestimonialClick={testimonial =>
                onTestimonialClick?.(testimonial.id)
              }
            />
          </div>
        )}

        {!isLoading && !error && testimonials.length === 0 && (
          <div className="bg-muted/30 mt-10 w-full rounded-2xl border border-dashed py-20 text-center">
            <MessageSquareQuote className="text-muted-foreground mx-auto mb-6 h-16 w-16 opacity-50" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Testimonials Available
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};
