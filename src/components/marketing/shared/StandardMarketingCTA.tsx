import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface StandardMarketingCTAProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export const StandardMarketingCTA: React.FC<StandardMarketingCTAProps> = ({
  title,
  description,
  buttonText,
  buttonHref,
}) => {
  return (
    <section className="border-t border-slate-100 bg-white py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 px-8 py-16 text-center md:px-16 md:py-24">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-100/50 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-50/30 blur-[100px]" />

          <h2 className="relative z-10 mb-6 text-3xl font-semibold text-slate-900 md:text-5xl">
            {title}
          </h2>
          <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg leading-relaxed font-medium text-slate-500">
            {description}
          </p>
          <Link
            href={buttonHref}
            className="relative z-10 inline-flex items-center gap-3 rounded-full bg-slate-900 px-10 py-5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-xl"
          >
            {buttonText}
            <ChevronRight className="h-5 w-5 text-sky-400" />
          </Link>
        </div>
      </div>
    </section>
  );
};
