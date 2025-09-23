import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types/owner-site/admin/testimonial";

interface TestimonialCard4Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard4: React.FC<TestimonialCard4Props> = ({
  testimonial,
  onClick,
}) => {
  return (
    <Card
      className="group cursor-pointer rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center sm:p-12">
        <div className="mb-6 flex justify-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-full">
            <Image
              src={testimonial.image || "/images/default-avatar.png"}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h3 className="mb-2 text-3xl font-bold text-gray-900">
          {testimonial.name}
        </h3>

        <p className="mb-4 text-lg text-gray-600">{testimonial.designation}</p>

        <div className="relative">
          <blockquote className="relative z-10 text-lg leading-relaxed font-medium text-gray-800">
            &quot;{testimonial.comment}&quot;
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
};
