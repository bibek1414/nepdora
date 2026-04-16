"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight, MessageSquareQuote, AlertCircle } from "lucide-react";
import { useTestimonials } from "../../../../../hooks/owner-site/admin/use-testimonials";
import { TestimonialCard16 } from "../testimonial-card/testimonial-card-16";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import {
  DEFAULT_TESTIMONIALS_MAP,
  TestimonialsComponentData,
} from "@/types/owner-site/components/testimonials";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

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
  onUpdate,
  onTestimonialClick,
}) => {
  const defaults = DEFAULT_TESTIMONIALS_MAP["testimonial-8"];
  const {
    title = defaults.title,
    subtitle = defaults.subtitle || "",
    buttonText = defaults.buttonText || "",
    buttonLink = defaults.buttonLink || "",
  } = data || {};

  const { data: testimonials = [], isLoading, error , refetch } = useTestimonials();
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#ff6b4a",
      primaryForeground: "#FFFFFF",
    },
    fonts: {
      body: "Inter, system-ui, sans-serif",
      heading: "Poppins, system-ui, sans-serif",
    },
  };
  const sectionRef = useRef(null);

  const handleUpdate = (field: string, value: string) => {
    onUpdate?.({ [field]: value });
  };

  if (isLoading) {
    return (
      <section className="overflow-hidden px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="h-[600px] overflow-hidden lg:col-span-7">
              <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  {[1, 2].map(i => (
                    <Skeleton
                      key={i}
                      className="h-[250px] w-full rounded-3xl"
                    />
                  ))}
                </div>
                <div className="hidden space-y-6 md:block">
                  {[1, 2].map(i => (
                    <Skeleton
                      key={i}
                      className="h-[250px] w-full rounded-3xl"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:pl-12">
              <Skeleton className="mb-8 h-12 w-3/4" />
              <Skeleton className="mb-4 h-6 w-full" />
              <Skeleton className="mb-10 h-6 w-5/6" />
              <Skeleton className="h-14 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-24">
        <div className="mx-auto max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load testimonials.</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!isLoading && !error && testimonials.length === 0) {
    return (
      <section className="border-y border-black/5 px-6 py-24 text-center">
        <BuilderEmptyState
          icon={MessageSquareQuote}
          title="No Testimonials Available"
          description="Share what your clients think about you. Add testimonials from the admin dashboard."
          actionLabel="Add New Testimonials"
          actionLink="/admin/testimonials"
          isEditable={isEditable}
            isEmpty={true}
        onRefresh={refetch}
          />
      </section>
    );
  }

  // Duplicate for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section ref={sectionRef} className="overflow-hidden px-6 py-24">
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }
        .animate-scroll-down {
          animation: scroll-down 30s linear infinite;
        }
        .scroll-container:hover .animate-scroll-up,
        .scroll-container:hover .animate-scroll-down {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left: Testimonials Grid Area */}
          <div className="scroll-container relative h-[600px] overflow-hidden lg:col-span-7">
            {/* Gradient Overlays for smooth entry/exit */}

            <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left column - moves UP */}
              <div className="animate-scroll-up space-y-6">
                {duplicatedTestimonials.map((t, index) => (
                  <TestimonialCard16
                    key={`up-${t.id}-${index}`}
                    testimonial={t}
                    onClick={() =>
                      isEditable ? null : onTestimonialClick?.(t.id)
                    }
                  />
                ))}
              </div>

              {/* Right column - moves DOWN */}
              <div className="animate-scroll-down hidden space-y-6 md:block">
                {duplicatedTestimonials.map((t, index) => (
                  <TestimonialCard16
                    key={`down-${t.id}-${index}`}
                    testimonial={t}
                    onClick={() =>
                      isEditable ? null : onTestimonialClick?.(t.id)
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="lg:col-span-5 lg:pl-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-md"
            >
              <EditableText
                as="h2"
                value={title}
                onChange={val => handleUpdate("title", val)}
                isEditable={isEditable}
                className="mb-8 text-5xl leading-tight font-medium tracking-tight text-gray-900 md:text-6xl"
                placeholder="Enter title..."
              />

              <EditableText
                as="p"
                value={subtitle}
                onChange={val => handleUpdate("subtitle", val)}
                isEditable={isEditable}
                className="mb-10 text-lg leading-relaxed text-gray-600"
                placeholder="Enter subtitle..."
              />

              <EditableLink
                text={buttonText}
                href={buttonLink}
                isEditable={isEditable}
                onChange={(newText: string, newHref: string) =>
                  onUpdate?.({ buttonText: newText, buttonLink: newHref })
                }
                className="group relative z-30 inline-flex cursor-pointer items-center gap-2 rounded-full px-10 py-5 text-lg font-medium transition-all hover:brightness-110"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                }}
              >
                {buttonText}
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </EditableLink>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
