"use client";
import React from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { TestimonialCard10 } from "../testimonial-card/testimonial-card-10";
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

export const TestimonialStyle10: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onTestimonialClick,
}) => {
  const { backgroundImage } = data || {};
  const { data: testimonials = [], isLoading, error } = useTestimonials();
  const pageSize = 6;

  const handleBackgroundImageChange = (imageUrl: string) => {
    onUpdate?.({ backgroundImage: imageUrl });
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {isLoading && (
          <div className="mx-auto max-w-7xl">
            <Skeleton className="h-[540px] w-full rounded-[40px]" />
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
            <TestimonialCard10
              testimonials={testimonials.slice(0, pageSize)}
              onClick={testimonial => onTestimonialClick?.(testimonial.id)}
              backgroundImage={backgroundImage}
              isEditable={isEditable}
              onBackgroundChange={handleBackgroundImageChange}
            />
          </div>
        )}

        {!isLoading && !error && testimonials.length === 0 && (
          <div className="py-16 text-center">
            <MessageSquareQuote className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            <h3 className="text-foreground mb-4 text-2xl font-semibold">
              No Testimonials Available
            </h3>
          </div>
        )}
      </div>
    </section>
  );
};
