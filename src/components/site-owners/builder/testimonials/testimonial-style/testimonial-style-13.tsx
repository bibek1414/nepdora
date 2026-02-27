"use client";
import React from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquareQuote } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { TestimonialCard13 } from "../testimonial-card/testimonial-card-13";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface TestimonialStyleProps {
  data: TestimonialsComponentData["data"];
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<TestimonialsComponentData["data"]>) => void;
  onTestimonialClick?: (testimonialId: number) => void;
}

export const TestimonialStyle13: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
  onTestimonialClick,
}) => {
  const { title = "Voices of Satisfaction", subtitle = "TESTIMONIALS" } =
    data || {};
  const { data: testimonials = [], isLoading, error } = useTestimonials();

  // Primary brand color (usually pulled from a theme hook, hardcoded here as per your logic)
  const secondaryColor = "#b2f068";
  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };
  const handleUpdate = (field: string) => (value: string) => {
    onUpdate?.({ [field]: value });
  };

  return (
    <div
      style={{
        background: theme.colors.primary,
      }}
    >
      <section className="relative mx-auto max-w-7xl overflow-hidden py-24 text-white">
        {/* Decorative Background Glows */}

        <div className="relative z-10 container mx-auto px-4">
          {/* Header */}
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <EditableText
              value={title}
              onChange={handleUpdate("title")}
              as="h2"
              className="text-4xl font-extrabold tracking-tight md:text-6xl"
              isEditable={isEditable}
            />
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-80 w-full rounded-[2rem] bg-white/5"
                />
              ))}
            </div>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="border-red-900/50 bg-red-900/20 text-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to load testimonials.</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && testimonials.length > 0 && (
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {testimonials.map(testimonial => (
                    <CarouselItem
                      key={testimonial.id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3"
                    >
                      <TestimonialCard13
                        testimonial={testimonial}
                        secondaryColor={secondaryColor}
                        onClick={() => onTestimonialClick?.(testimonial.id)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Controls */}
                <div className="mt-12 flex justify-center gap-4">
                  <CarouselPrevious className="static h-12 w-12 translate-y-0 border-white/10 bg-white/5 text-white hover:bg-white/20 hover:text-white" />
                  <CarouselNext className="static h-12 w-12 translate-y-0 border-white/10 bg-white/5 text-white hover:bg-white/20 hover:text-white" />
                </div>
              </Carousel>
            </div>
          )}

          {!isLoading && !error && testimonials.length === 0 && (
            <div className="py-20 text-center opacity-50">
              <MessageSquareQuote className="mx-auto mb-4 h-12 w-12" />
              <p className="text-xl">No testimonials shared yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
