"use client";

import React from "react";
import { useTestimonials } from "../../../../../hooks/owner-site/admin/use-testimonials";
import { TestimonialCard15 } from "../testimonial-card/testimonial-card-15";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, MessageSquareQuote } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
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
    transition: { duration: 0.6, ease: "easeOut" as any }
  }
};

export const TestimonialStyle6: React.FC<TestimonialStyleProps> = ({
  data,
  isEditable = false,
  onUpdate,
  onTestimonialClick,
}) => {
  const { title = "Students Who Made It" } = data || {};
  const { data: testimonials = [], isLoading, error } = useTestimonials();

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl border border-border p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-3 w-32 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-md mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load testimonials.</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 text-center bg-background border-y border-border/50">
        <MessageSquareQuote className="text-muted-foreground/20 mx-auto mb-6 h-20 w-20" />
        <h3 className="text-foreground mb-4 text-2xl font-semibold">No Testimonials Yet</h3>
        <p className="text-muted-foreground mx-auto max-w-md text-lg">
          Add some success stories in your dashboard to show them off here.
        </p>
      </section>
    );
  }

  // Multiply for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background overflow-hidden relative">
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
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
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
            isEditable={isEditable}
            placeholder="Enter section title..."
          />
        </motion.div>
      </div>

      {/* Scrolling Testimonials Area */}
      <div className="relative h-[700px] overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-6 px-4 justify-center h-full">
          {/* Column 1 */}
          <div className="flex-1 space-y-6 scroll-up min-w-[300px] max-w-md">
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard15 
                key={`col1-${testimonial.id}-${index}`} 
                testimonial={testimonial} 
                onClick={() => isEditable ? null : onTestimonialClick?.(testimonial.id)}
              />
            ))}
          </div>
          
          {/* Column 2 */}
          <div className="hidden md:flex flex-1 flex-col space-y-6 scroll-up min-w-[300px] max-w-md" style={{ animationDelay: "-15s" }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard15 
                key={`col2-${testimonial.id}-${index}`} 
                testimonial={testimonial} 
                onClick={() => isEditable ? null : onTestimonialClick?.(testimonial.id)}
              />
            ))}
          </div>
          
          {/* Column 3 */}
          <div className="hidden lg:flex flex-1 flex-col space-y-6 scroll-up min-w-[300px] max-w-md" style={{ animationDelay: "-30s" }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard15 
                key={`col3-${testimonial.id}-${index}`} 
                testimonial={testimonial} 
                onClick={() => isEditable ? null : onTestimonialClick?.(testimonial.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
