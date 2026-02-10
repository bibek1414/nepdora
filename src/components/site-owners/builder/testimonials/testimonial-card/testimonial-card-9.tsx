"use client";
import React, { useCallback, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Quote } from "lucide-react";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import Image from "next/image";

interface TestimonialCard9Props {
  testimonials: Testimonial[];
  onClick?: (testimonial: Testimonial) => void;
}

export const TestimonialCard9: React.FC<TestimonialCard9Props> = ({
  testimonials,
  onClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#84cc16",
      primaryForeground: "#FFFFFF",
      secondary: "#013D2F",
      secondaryForeground: "#FFFFFF",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex, testimonials]
  );

  const handlePrev = useCallback(() => {
    setActiveIndex(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  if (!activeTestimonial) return null;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-8 px-4 py-12 lg:grid-cols-12 lg:px-8">
      <div className="h-[400px] overflow-hidden rounded-[40px] bg-gray-200 lg:col-span-4 lg:h-auto">
        <div className="relative h-full w-full">
          <Image
            src={
              activeTestimonial.image ||
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2942&auto=format&fit=crop"
            }
            alt={activeTestimonial.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div
        className="relative flex flex-col justify-between overflow-hidden rounded-[40px] p-8 md:p-16 lg:col-span-8"
        style={{
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryForeground,
        }}
        onClick={() => onClick?.(activeTestimonial)}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10"></div>

        <div className="relative z-10">
          <Quote className="mb-6 fill-current" size={48} />
          <p
            className="mb-12 text-xl leading-relaxed font-medium md:text-2xl lg:text-3xl"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {activeTestimonial.comment}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white">
              <Image
                src={activeTestimonial.image || "/images/default-avatar.png"}
                alt={activeTestimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-lg font-bold">{activeTestimonial.name}</div>
              <div className="text-sm opacity-80">
                {activeTestimonial.designation}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              aria-label="Previous testimonial"
              onClick={e => {
                e.stopPropagation();
                handlePrev();
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-colors hover:opacity-90"
              style={{ color: theme.colors.secondary }}
            >
              <ArrowLeft size={20} />
            </button>
            <button
              aria-label="Next testimonial"
              onClick={e => {
                e.stopPropagation();
                handleNext();
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-colors hover:opacity-90"
              style={{ color: theme.colors.secondary }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
