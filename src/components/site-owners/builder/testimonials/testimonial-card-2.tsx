import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Testimonial } from "@/types/owner-site/admin/testimonial";

interface TestimonialCard2Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard2: React.FC<TestimonialCard2Props> = ({
  testimonial,
  onClick,
}) => {
  const renderStars = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="mb-3 flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
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
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={testimonial.image || "/images/default-avatar.png"}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="mb-2">
              <h4 className="text-lg font-semibold text-gray-900">
                {testimonial.name}
              </h4>
              <p className="text-sm text-gray-600">{testimonial.designation}</p>
            </div>

            <blockquote className="leading-relaxed text-gray-700 italic">
              &quot;{testimonial.comment}&quot;
            </blockquote>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
