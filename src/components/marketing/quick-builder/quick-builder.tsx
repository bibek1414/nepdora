import React from "react";
import { QuickBuilderClient } from "./quick-builder-client";

const QuickBuilder: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 md:py-32">
      {/* Light Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-50 via-white to-white opacity-50"></div>

      <div className="relative z-10 mx-auto max-w-3xl px-3 text-center sm:px-4 lg:px-6">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Build Your Free Website Now
          </h2>
          <p className="text-sm font-normal text-slate-500 sm:text-base md:text-lg">
            Tell us about your business. We'll build the rest.
          </p>
        </div>

        <QuickBuilderClient />
      </div>
    </section>
  );
};

export default QuickBuilder;
