import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface AlternativeHeroProps {
  platformName: string;
  title?: React.ReactNode;
  description: string;
}

export const AlternativeHero: React.FC<AlternativeHeroProps> = ({
  platformName,
  title,
  description,
}) => {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        <p className="text-primary mb-4 text-sm font-semibold tracking-wide uppercase">
          {platformName} Alternative - Nepal 2026
        </p>
        <h1 className="mb-6 text-4xl leading-tight font-extrabold text-slate-900 md:text-6xl">
          {title || (
            <>
              {platformName} vs <span className="text-primary">Nepdora</span>:{" "}
              Which platform wins for Nepal businesses?
            </>
          )}
        </h1>
        <p className="mx-auto max-w-3xl text-xl leading-relaxed text-slate-600">
          {description}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/pricing"
            className="bg-primary hover:bg-primary/90 rounded-full px-8 py-4 font-bold text-white transition-all"
          >
            Compare Pricing
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 font-bold text-slate-900 transition-colors hover:bg-slate-100"
          >
            Talk to Nepdora
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
