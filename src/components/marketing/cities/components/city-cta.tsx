import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CityCTAProps {
  cityName: string;
  category: string;
}

export const CityCTA: React.FC<CityCTAProps> = ({ cityName, category }) => {
  const industryLabel = category.replace(/-/g, " ");

  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Ready to launch your {industryLabel} business in {cityName}?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-slate-500">
          Join hundreds of {cityName} businesses who trust Nepdora to build and
          grow their presence online. Start free today.
        </p>

        <Link
          href="/admin/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-base font-medium text-white transition hover:bg-slate-800"
        >
          Get Started for Free
          <ChevronRight className="h-4 w-4" />
        </Link>

        <p className="mt-3 text-sm text-slate-400">
          No credit card required · Launch in minutes
        </p>
      </div>
    </section>
  );
};
