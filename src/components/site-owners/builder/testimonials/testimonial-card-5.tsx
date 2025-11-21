import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from "lucide-react";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface TestimonialCard5Props {
  testimonials: Testimonial[];
  onClick?: (testimonial: Testimonial) => void;
}

// Updated types for testimonials to include carousel style
export interface TestimonialsData {
  component_id?: string;
  component_type: "testimonials";
  style:
    | "testimonial-1"
    | "testimonial-2"
    | "testimonial-3"
    | "testimonial-4"
    | "testimonial-5";
  title: string;
  subtitle?: string;
  page_size: number;
  order?: number;
}

export const TestimonialCard5: React.FC<TestimonialCard5Props> = ({
  testimonials,
  onClick,
}) => {
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

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map(testimonial => (
            <CarouselItem
              key={testimonial.id}
              className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
            >
              <div
                className="flex h-full cursor-pointer flex-col items-center rounded-xl border bg-white p-6 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800"
                onClick={() => onClick?.(testimonial)}
              >
                {/* Profile Image */}
                <div className="relative mb-4 h-24 w-24">
                  <Image
                    src={testimonial.image || "/images/default-avatar.png"}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote
                    className="mx-auto h-8 w-8"
                    style={{
                      color: theme.colors.primary,
                    }}
                  />
                </div>

                {/* Testimonial Text */}
                <blockquote className="mb-6 flex-1">
                  <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    &quot;{testimonial.comment}&quot;
                  </p>
                </blockquote>

                {/* Customer Info */}
                <div className="mt-auto">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.designation}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute top-1/2 left-0 h-12 w-12 -translate-x-12 -translate-y-1/2 border-2 border-gray-200 bg-white shadow-lg hover:bg-gray-50" />
        <CarouselNext className="absolute top-1/2 right-0 h-12 w-12 translate-x-12 -translate-y-1/2 border-2 border-gray-200 bg-white shadow-lg hover:bg-gray-50" />
      </Carousel>
    </div>
  );
};
