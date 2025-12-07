import React from "react";
import { Button } from "@/components/ui/button";

const CTA: React.FC = () => {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
        Ready to build your dream?
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-500">
        Join 15,000+ founders who switched to Nepdora. No credit card required
        for the trial. If you can type, you can build.
      </p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button size="lg" className="w-full sm:w-auto">
          Start Building Now
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          Talk to Sales
        </Button>
      </div>
      <p className="mt-8 text-sm text-slate-400">
        Includes free domain connection, hosting, and SSL.
      </p>
    </section>
  );
};

export default CTA;
