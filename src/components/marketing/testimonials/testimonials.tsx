import React from "react";
import { TestimonialsList } from "./testimonials-list";

const Reviews: React.FC = () => {
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

        <TestimonialsList />
      </div>
    </section>
  );
};

export default Reviews;
