import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { Quote } from "lucide-react";

interface TestimonialCard11Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard11: React.FC<TestimonialCard11Props> = ({
  testimonial,
  onClick,
}) => {
  return (
    <Card
      className="group h-full cursor-pointer overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-zinc-900/50"
      onClick={onClick}
    >
      <CardContent className="flex h-full flex-col justify-between p-6 sm:p-8">
        <div className="relative">
          <Quote className="text-primary/20 mb-4 h-10 w-10" />
          <blockquote className="text-foreground text-lg font-medium leading-relaxed">
            &quot;{testimonial.comment}&quot;
          </blockquote>
        </div>

        <div className="border-border/50 mt-6 flex items-center gap-4 border-t pt-6">
          <div className="bg-muted relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border">
            <Image
              src={
                testimonial.image ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
              }
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-foreground font-semibold leading-tight">
              {testimonial.name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {testimonial.designation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
