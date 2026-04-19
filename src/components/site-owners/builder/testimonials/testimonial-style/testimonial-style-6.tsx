"use client";

import React from "react";
import { useTestimonials } from "../../../../../hooks/owner-site/admin/use-testimonials";
import { TestimonialCard15 } from "../testimonial-card/testimonial-card-15";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquareQuote } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { motion } from "framer-motion";

interface TestimonialStyleProps {
  data: TestimonialsComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<TestimonialsComponentData["data"]>) => void;
  onTestimonialClick?: (testimonialId: number) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as any },
  },
};

export const TestimonialStyle6: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
  onTestimonialClick,
}) => {
  const { title = "Students Who Made It" } = data || {};
  const {
    data: testimonials = [],
    isLoading,
    error,
    refetch,
  } = useTestimonials();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  if (isLoading) {
    return (
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-6xl px-4 text-center sm:px-6">
          <Skeleton className="mx-auto mb-4 h-10 w-64" />
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="border-border h-64 space-y-4 rounded-2xl border p-6"
            >
              <div className="mb-4 flex justify-center">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="space-y-2 text-center">
                <Skeleton className="mx-auto h-4 w-24" />
                <Skeleton className="mx-auto h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background py-16">
        <div className="mx-auto max-w-md px-4">
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
      <section className="bg-background border-border/50 border-y py-20 text-center">
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

  // Multiply for seamless loop
  const duplicatedTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section
      id="testimonials"
      className="bg-background relative mx-auto max-w-7xl overflow-hidden py-16 md:py-24"
    >
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(1); }
          100% { transform: translateY(-50%); }
        }
        .scroll-up {
          animation: scroll-up 5s linear infinite;
        }
        .scroll-up:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto mb-16 max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="text-center"
        >
          <EditableText
            value={title}
            onChange={handleTitleChange}
            as="h2"
            className="text-foreground text-3xl font-bold tracking-tight md:text-5xl"
            isEditable={isEditable}
            placeholder="Enter section title..."
          />
        </motion.div>
      </div>

      {/* Scrolling Testimonials Area */}
      <div className="relative h-[700px] overflow-hidden">
        {/* Gradient Overlays */}
        <div className="from-background via-background/80 pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-linear-to-b to-transparent" />
        <div className="from-background via-background/80 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t to-transparent" />

        <div className="flex h-full justify-center gap-6 px-4">
          {/* Column 1 */}
          <div className="scroll-up max-w-md min-w-[300px] flex-1 space-y-6">
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard15
                key={`col1-${testimonial.id}-${index}`}
                testimonial={testimonial}
                onClick={() =>
                  isEditable ? null : onTestimonialClick?.(testimonial.id)
                }
              />
            ))}
          </div>

          {/* Column 2 */}
          <div
            className="scroll-up hidden max-w-md min-w-[300px] flex-1 flex-col space-y-6 md:flex"
            style={{ animationDelay: "-15s" }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard15
                key={`col2-${testimonial.id}-${index}`}
                testimonial={testimonial}
                onClick={() =>
                  isEditable ? null : onTestimonialClick?.(testimonial.id)
                }
              />
            ))}
          </div>

          {/* Column 3 */}
          <div
            className="scroll-up hidden max-w-md min-w-[300px] flex-1 flex-col space-y-6 lg:flex"
            style={{ animationDelay: "-30s" }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard15
                key={`col3-${testimonial.id}-${index}`}
                testimonial={testimonial}
                onClick={() =>
                  isEditable ? null : onTestimonialClick?.(testimonial.id)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
