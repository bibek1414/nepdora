import React from "react";
import { Button } from "@/components/ui/button";

const CTASection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[3rem] bg-gray-600 px-6 py-16 text-white shadow-2xl sm:px-12 sm:py-24">
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-3xl sm:text-5xl">
              Join 500+ Nepal businesses who skipped the developer queue
            </h2>
            <p className="text-primary-foreground/90 mt-6 text-xl">
              The fastest, easiest way to put your business on the map in Nepal.
            </p>
            <div className="mt-10 flex justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-10 text-lg font-bold"
                rounded={true}
              >
                Build Your Website Free
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
