"use client";

import React from "react";
import Image from "next/image";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { motion } from "framer-motion";

interface TestimonialCard16Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard16: React.FC<TestimonialCard16Props> = ({
  testimonial,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="-sm transition- hover:-md cursor-pointer rounded-3xl border border-black/5 bg-white p-8"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
          {testimonial.image ? (
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm font-medium text-gray-500">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
          <p className="line-clamp-1 text-sm text-gray-500">
            {testimonial.designation}
          </p>
        </div>
      </div>
      <p className="text-lg leading-relaxed text-gray-700 italic">
        &quot;{testimonial.comment}&quot;
      </p>
    </motion.div>
  );
};
