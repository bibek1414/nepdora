"use client";

import React from "react";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TestimonialsData } from "@/types/owner-site/components/testimonials";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface TestimonialStyleProps {
  data: TestimonialsData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TestimonialsData>) => void;
}

export const TestimonialStyle10: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const {
    title = "Quietly proud of the company we keep.",
    subtitle = "In their words",
  } = data || {};
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const { data: testimonialsData, isLoading, refetch } = useTestimonials();
  const testimonials = testimonialsData || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header Section */}
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-2 text-xs font-medium opacity-70">
            <span className="inline-block h-px w-6 bg-current opacity-40" />
            <EditableText
              value={subtitle}
              onChange={(val: string) => onUpdate?.({ subtitle: val })}
              isEditable={isEditable}
              as="p"
              className="tracking-wider uppercase"
              style={{ fontFamily: theme?.fonts?.body }}
            />
          </div>
          <EditableText
            value={title}
            onChange={(val: string) => onUpdate?.({ title: val })}
            isEditable={isEditable}
            as="label"
            className="max-w-3xl text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl"
            style={{ fontFamily: theme?.fonts?.heading }}
            multiline
          />
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 p-8 md:p-10"
              >
                <Skeleton className="h-6 w-full bg-white/10" />
                <Skeleton className="mt-2 h-6 w-2/3 bg-white/10" />
                <div className="mt-8 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-white/10" />
                    <Skeleton className="h-3 w-16 bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {testimonials.slice(0, 4).map((t, index) => (
              <figure
                key={t.id || index}
                className="group relative flex flex-col rounded-xl border border-black/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 md:p-10"
              >
                <blockquote
                  className="text-xl leading-snug font-medium text-balance md:text-2xl"
                  style={{ fontFamily: theme?.fonts?.heading }}
                >
                  “{t.comment}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  {t.image ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
                      {getInitials(t.name)}
                    </span>
                  )}
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ fontFamily: theme?.fonts?.heading }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-xs opacity-70"
                      style={{ fontFamily: theme?.fonts?.body }}
                    >
                      {t.designation}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-12">
          <BuilderEmptyState
            icon={Quote}
            title="No testimonials found"
            description="Your client kind words will appear here once you add them in the admin dashboard."
            actionLabel="Add new testimonial"
            actionLink="/admin/testimonials"
            isEditable={isEditable}
            isEmpty={!isLoading && testimonials.length === 0}
            onRefresh={refetch}
          />
        </div>
      </div>
    </section>
  );
};
