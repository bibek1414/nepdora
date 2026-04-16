"use client";
import React, { useRef } from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquareQuote } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { TestimonialCard12 } from "../testimonial-card/testimonial-card-12";
import { Badge } from "@/components/ui/badge";
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
  const { title = "What People Are Saying", subtitle = "Testimonials" } =
    data || {};
  const { data: testimonials = [], isLoading, error , refetch } = useTestimonials();

  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
      accent: "#3B82F6",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const colors = theme.colors as any;

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    onUpdate?.({ subtitle: newSubtitle });
  };

  return (
    <section className="bg-background-light dark:bg-background-dark py-12 md:py-20">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-12 flex flex-col items-center justify-center text-center md:mb-20">
          <Badge
            className="mb-6 rounded-full px-6 py-2 text-sm font-semibold tracking-wide text-black hover:brightness-90"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <EditableText
              value={subtitle}
              onChange={handleSubtitleChange}
              as="span"
              isEditable={isEditable}
              className="text-black"
              placeholder="Testimonials"
            />
          </Badge>
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground text-4xl font-extrabold tracking-tight md:text-5xl lg:text-5xl"
            isEditable={isEditable}
            placeholder="Enter title..."
          />
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Skeleton className="aspect-4/5 w-full rounded-3xl md:aspect-5/6" />
            <div className="flex flex-col space-y-4 py-10">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="mt-8 h-32 w-full" />
              <div className="mt-auto pt-8">
                <Skeleton className="mb-8 h-px w-full" />
                <div className="flex justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
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
          <div className="relative mx-auto w-full">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map(testimonial => (
                  <CarouselItem key={testimonial.id}>
                    {isEditable && <div className="absolute inset-0 z-10" />}
                    <TestimonialCard12
                      testimonial={testimonial}
                      onClick={() => onTestimonialClick?.(testimonial.id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Carousel Controls positioned manually */}
              <div className="absolute right-0 bottom-6 flex gap-4 pr-4 md:bottom-10 lg:pr-8">
                <CarouselPrevious className="static h-14 w-14 translate-x-0 translate-y-0 border-2 border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50 [&>svg]:h-6 [&>svg]:w-6" />
                <CarouselNext className="static h-14 w-14 translate-x-0 translate-y-0 border-2 border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50 [&>svg]:h-6 [&>svg]:w-6" />
              </div>
            </Carousel>
          </div>
        )}

        {!isLoading && !error && (
          <BuilderEmptyState
            icon={MessageSquareQuote}
            title="No Testimonials Available"
            description="Share what your clients think about you. Add testimonials from the admin dashboard."
            actionLabel="Add New Testimonials"
            actionLink="/admin/testimonials"
            isEditable={isEditable}
          isEmpty={testimonials.length === 0}
          onRefresh={refetch}
          />
        )}
      </div>
    </section>
  );
};
