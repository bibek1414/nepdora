"use client";
import React, { useState, useEffect } from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { TestimonialCard14 } from "../testimonial-card/testimonial-card-14";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Image from "next/image";
import { EditableLink } from "@/components/ui/editable-link";

interface TestimonialStyleProps {
  data: TestimonialsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TestimonialsComponentData["data"]>) => void;
  onTestimonialClick?: (testimonialId: number) => void;
}

export const TestimonialStyle14: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onTestimonialClick,
}) => {
  const {
    title = "What our clients say",
    subtitle = "Hear how we've helped businesses like yours achieve success.",
    buttonText = "Get a free consultation",
    buttonLink = "#",
  } = data || {};
  const { data: testimonials = [], isLoading, error } = useTestimonials();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleUpdate = (field: string) => (value: string) => {
    onUpdate?.({ [field]: value });
  };

  const currentTestimonial = testimonials[current - 1] || testimonials[0];

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <EditableText
            value={title}
            onChange={handleUpdate("title")}
            as="h2"
            className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            isEditable={isEditable}
          />
          <EditableText
            value={subtitle}
            onChange={handleUpdate("subtitle")}
            as="p"
            className="text-lg opacity-70 md:text-xl"
            isEditable={isEditable}
          />
        </div>
        <div className="shrink-0">
          <EditableLink
            text={buttonText}
            href={buttonLink}
            isEditable={isEditable}
            siteUser={siteUser}
            onChange={(text, href) =>
              onUpdate?.({ buttonText: text, buttonLink: href })
            }
            className="rounded-full px-8 py-3 text-sm font-bold transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.primaryForeground,
            }}
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-4/5 w-full rounded-3xl" />
          <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load testimonials.</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && testimonials.length > 0 && (
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left side: Animated Image */}
            <div className="relative aspect-4/5 h-145 w-full overflow-hidden rounded-3xl shadow-lg">
              {currentTestimonial?.image && (
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover transition-transform duration-700"
                />
              )}
            </div>

            {/* Right side: Carousel */}
            <div className="flex flex-col">
              <Carousel setApi={setApi} className="w-full flex-1">
                <CarouselContent>
                  {testimonials.map(testimonial => (
                    <CarouselItem key={testimonial.id}>
                      <TestimonialCard14
                        testimonial={testimonial}
                        onClick={() => onTestimonialClick?.(testimonial.id)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 py-4">
            <button
              onClick={() => api?.scrollPrev()}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 transition-all hover:bg-gray-50 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 transition-all active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && testimonials.length === 0 && (
        <div className="py-20 text-center opacity-50">
          <MessageSquareQuote className="mx-auto mb-4 h-12 w-12" />
          <p className="text-xl">No testimonials shared yet.</p>
        </div>
      )}
    </section>
  );
};
