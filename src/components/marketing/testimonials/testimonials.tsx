"use client";
import React from "react";
import { Star } from "lucide-react";
import { useTestimonials } from "@/hooks/super-admin/use-testimonials";
import { Testimonial } from "@/types/owner-site/admin/testimonial";

const Reviews: React.FC = () => {
  const { data: testimonials, isLoading } = useTestimonials();

  if (isLoading) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center sm:mb-12 md:mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Loved by Nepali Businesses Owners.
          </h2>
          <p className="text-sm text-slate-600 sm:text-base md:text-lg">
            Join 15,000+ Nepali businesses growing online with Nepdora.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {testimonials.map((review: Testimonial) => (
            <div
              key={review.id}
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-6 sm:rounded-2xl sm:p-8"
            >
              <div className="mb-4 flex gap-0.5 text-yellow-400 sm:mb-6 sm:gap-1">
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
              </div>
              <p className="mb-4 flex-1 text-sm leading-relaxed font-normal text-slate-700 sm:mb-6 sm:text-base">
                "{review.comment}"
              </p>
              <div className="mt-auto flex items-center gap-3 sm:gap-4">
                {review.image ? (
                  <img
                    src={review.image}
                    alt={review.name}
                    className="h-9 w-9 rounded-full border border-slate-200 object-cover sm:h-10 sm:w-10"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-200 text-xs font-bold text-slate-500 sm:h-10 sm:w-10 sm:text-sm">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-900 sm:text-sm">
                    {review.name}
                  </div>
                  <div className="text-[10px] text-slate-500 sm:text-xs">
                    {review.designation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
