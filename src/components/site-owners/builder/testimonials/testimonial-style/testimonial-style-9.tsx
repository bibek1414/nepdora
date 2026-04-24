"use client";

import React from "react";
import { TestimonialsData } from "@/types/owner-site/components/testimonials";
import { useTestimonials } from "@/hooks/owner-site/admin/use-testimonials";
import { EditableText } from "@/components/ui/editable-text";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote, MessageSquare, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface TestimonialStyleProps {
  data: TestimonialsData;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<TestimonialsData>) => void;
}

export const TestimonialStyle9: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
}) => {
  const { title: eyebrow = "Kind words", subtitle: mainHeading } = data || {};
  const {
    data: testimonialsData,
    isLoading,
    error,
    refetch,
  } = useTestimonials();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;

  const testimonials = testimonialsData || [];

  return (
    <section className="bg-background py-12 md:py-24">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-8 md:mb-14">
          <EditableText
            value={eyebrow}
            onChange={(val: string) => onUpdate?.({ title: val })}
            isEditable={isEditable}
            as="title"
            className="text-[10px] md:text-xs"
            style={{ fontFamily: theme?.fonts?.body }}
          />
          {mainHeading && (
            <EditableText
              value={mainHeading}
              onChange={(val: string) => onUpdate?.({ subtitle: val })}
              isEditable={isEditable}
              as="p"
              className="mt-2 text-2xl md:text-4xl"
              style={{ fontFamily: theme?.fonts?.heading }}
            />
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border-border bg-card flex h-full flex-col justify-between rounded-xl border p-5 md:p-7"
              >
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="border-border mt-6 md:mt-8 flex items-center gap-3 border-t pt-5">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Testimonials</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load testimonials."}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div
              className={`grid gap-6 md:grid-cols-3 ${
                testimonials.length === 0 ? "hidden" : ""
              }`}
            >
              {testimonials.slice(0, 3).map((testimonial: Testimonial) => (
                <figure
                  key={testimonial.id}
                  className="border-border bg-card animate-in fade-in slide-in-from-bottom-8 flex h-full flex-col justify-between rounded-xl border p-5 md:p-7 transition-all duration-300"
                >
                  <blockquote
                    className="text-foreground font-serif text-base md:text-lg leading-relaxed"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    <span className="text-primary">"</span>
                    {testimonial.comment}
                    <span className="text-primary">"</span>
                  </blockquote>
                  <figcaption className="border-border mt-6 md:mt-8 flex items-center gap-3 border-t pt-5">
                    <img
                      src={testimonial.image || "/fallback/image-not-found.png"}
                      alt={testimonial.name}
                      loading="lazy"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
                    />
                    <div>
                      <p
                        className="text-foreground text-sm font-medium"
                        style={{ fontFamily: theme?.fonts?.heading }}
                      >
                        {testimonial.name}
                      </p>
                      <p
                        className="mt-0.5 text-[10px] md:text-xs"
                        style={{ fontFamily: theme?.fonts?.body }}
                      >
                        {testimonial.designation}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <BuilderEmptyState
              icon={MessageSquare}
              title="No Testimonials Found"
              description="You haven't received any testimonials yet. Start by adding reviews from your clients."
              actionLabel="Add New Testimonial"
              actionLink="/admin/testimonials"
              isEditable={isEditable}
              isEmpty={!isLoading && !error && testimonials.length === 0}
              onRefresh={refetch}
            />
          </>
        )}
      </div>
    </section>
  );
};
