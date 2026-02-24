import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@/types/owner-site/admin/testimonial";

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
      className="group cursor-pointer rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative h-100 w-100 overflow-hidden rounded-xl">
            <Image
              src={testimonial.image || "/images/default-avatar.png"}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900">
          {testimonial.name}
        </h3>

        <p className="mb-4 text-base text-gray-600">
          {testimonial.designation}
        </p>

        <div className="relative">
          <blockquote className="relative z-10 text-base leading-relaxed font-medium text-gray-800">
            &quot;{testimonial.comment}&quot;
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
};
