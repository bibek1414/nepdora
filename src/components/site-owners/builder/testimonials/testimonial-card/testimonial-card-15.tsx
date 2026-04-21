"use client";

import React from "react";
import Image from "next/image";
import { Testimonial } from "@/types/owner-site/admin/testimonial";

interface TestimonialCard15Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard15: React.FC<TestimonialCard15Props> = ({
  testimonial,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-card border-border hover:shadow-primary/5 hover:border-primary/20 group h-auto cursor-pointer break-inside-avoid rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl"
  >
    {/* Image at top */}
    <div className="mb-5 flex justify-center">
      <div className="relative h-24 w-24 shrink-0">
        <div className="from-primary/40 via-primary/20 absolute inset-0 rounded-full bg-linear-to-br to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        <div className="bg-secondary ring-background relative h-24 w-24 overflow-hidden rounded-full ring-2">
          {testimonial.image ? (
            <Image unoptimized
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-secondary-foreground flex h-full w-full items-center justify-center text-2xl font-bold">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Testimonial text */}
    <p className="text-foreground/90 mb-6 text-center text-sm leading-relaxed italic">
      &quot;{testimonial.comment}&quot;
    </p>

    {/* Name and designation */}
    <div className="text-center">
      <p className="text-foreground text-base font-bold">{testimonial.name}</p>
      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
        {testimonial.designation}
      </p>
    </div>
  </div>
);
