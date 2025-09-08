import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types/owner-site/testimonial";

interface TestimonialCard3Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard3: React.FC<TestimonialCard3Props> = ({
  testimonial,
  onClick,
}) => {
  const renderStars = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="mb-4 flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <CardContent className="p-8">
        <div className="relative">
          <Quote className="text-primary/20 absolute -top-2 -left-2 h-12 w-12" />

          <blockquote className="relative z-10 mb-6 leading-relaxed font-medium text-gray-800">
            &quot;{testimonial.comment}&quot;
          </blockquote>

          <div className="border-t pt-4">
            <div className="flex items-center">
              <div className="relative mr-4 h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={testimonial.image || "/images/default-avatar.png"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {testimonial.name}
                </h4>
                <p className="text-gray-600">{testimonial.designation}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
