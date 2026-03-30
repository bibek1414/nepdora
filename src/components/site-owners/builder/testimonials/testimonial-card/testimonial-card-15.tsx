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
    className="bg-card border border-border p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 h-auto break-inside-avoid group cursor-pointer"
  >
    {/* Image at top */}
    <div className="flex justify-center mb-5">
      <div className="relative w-24 h-24 shrink-0">
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/40 via-primary/20 to-transparent blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative w-24 h-24 overflow-hidden rounded-full bg-secondary ring-2 ring-background">
          {testimonial.image ? (
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary-foreground font-bold text-2xl">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Testimonial text */}
    <p className="text-foreground/90 mb-6 leading-relaxed italic text-sm text-center">
      &quot;{testimonial.comment}&quot;
    </p>
    
    {/* Name and designation */}
    <div className="text-center">
      <p className="font-bold text-foreground text-base">{testimonial.name}</p>
      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
        {testimonial.designation}
      </p>
    </div>
  </div>
);
