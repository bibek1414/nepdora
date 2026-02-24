import React from "react";
import Image from "next/image";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { Star } from "lucide-react";

interface TestimonialCard12Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard12: React.FC<TestimonialCard12Props> = ({
  testimonial,
  onClick,
}) => {
  // Try to generate a title from the comment if it's long, or use a default
  // Some testimonials just have a comment, we can extract the first sentence.
  const getTitle = () => {
    if (!testimonial.comment) return `"I Love This Store"`;
    const sentences = testimonial.comment.split(/[.!?]/);
    const firstPhrase = sentences[0].trim();
    if (firstPhrase.length < 50 && firstPhrase.length > 5) {
      return `"${firstPhrase}"`;
    }
    return `"I Love This Store"`; // fallback title
  };

  return (
    <div
      className="group flex flex-col items-center gap-8 md:flex-row lg:gap-16"
      onClick={onClick}
    >
      {/* Left Column: Huge Image */}
      <div className="w-full flex-shrink-0 md:w-2/5 lg:w-[45%]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-100 md:aspect-[5/6]">
          <Image
            src={testimonial.image || "/images/default-avatar.png"}
            alt={testimonial.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="flex w-full flex-col py-6 md:w-3/5 md:py-10 lg:w-[55%]">
        {/* Star Rating */}
        <div className="mb-6 flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-7 w-7 ${
                i < 4
                  ? "fill-[#b2f068] text-[#b2f068]"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <h3 className="m-0 mb-6 text-left text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {getTitle()}
        </h3>

        {/* Comment quote */}
        <p className="mb-10 text-left text-lg leading-relaxed font-medium text-gray-500 md:text-xl">
          &quot;{testimonial.comment}&quot;
        </p>

        {/* Author info & Divider */}
        <div className="mt-auto pt-8 pb-4">
          <div className="mb-8 h-px w-full bg-gray-200" />

          <div className="flex w-full items-end justify-between">
            <div className="text-left">
              <h4 className="text-2xl font-bold text-gray-900">
                {testimonial.name}
              </h4>
              <p className="mt-1 text-base text-gray-500">
                {testimonial.designation || "Customer"}
              </p>
            </div>
            {/* The carousel arrows will overlay into the space on the right, handled by the parent style component */}
          </div>
        </div>
      </div>
    </div>
  );
};
