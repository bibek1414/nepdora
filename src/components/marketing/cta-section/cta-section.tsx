import React from "react";
import { Button } from "@/components/ui/button";

const CTA: React.FC = () => {
  return (
    <section className="mx-auto max-w-4xl px-3 py-12 text-center sm:px-4 sm:py-16 md:py-20 lg:px-6 lg:py-24">
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
        Want to build your website?
      </h2>
      <p className="mx-auto mb-8 max-w-2xl text-sm text-slate-600 sm:mb-10 sm:text-base md:text-lg lg:text-xl">
        Build it yourself or get help from our support team to get your website
        live within few minutes. All functionalities, ecommerce, restaurant,
        service business anything can be built on Nepdora.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
        <Button
          size="lg"
          className="w-full rounded-full text-sm sm:w-auto sm:text-base"
        >
          Start Building Now
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-full text-sm sm:w-auto sm:text-base"
        >
          Talk to Sales
        </Button>
      </div>
      <p className="mt-6 text-xs text-slate-500 sm:mt-8 sm:text-sm">
        Includes free domain connection, hosting, and SSL.
      </p>
    </section>
  );
};

export default CTA;
