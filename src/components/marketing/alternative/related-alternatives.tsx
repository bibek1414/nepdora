import { ALL_COMPETITORS, Competitor } from "@/constants/competitors";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface RelatedAlternativesProps {
  currentSlug: string;
}

export default function RelatedAlternatives({
  currentSlug,
}: RelatedAlternativesProps) {
  // Filter out the current competitor and shuffle/pick a few
  const otherCompetitors = ALL_COMPETITORS.filter(
    c => `${c.slug}-nepal` !== currentSlug
  ).slice(0, 6);

  if (otherCompetitors.length === 0) return null;

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Explore More Alternatives
          </h2>
          <p className="mt-4 text-slate-600">
            See how Nepdora compares against other global website builders.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherCompetitors.map(competitor => (
            <Link
              key={competitor.slug}
              href={`/alternative/${competitor.slug}-nepal`}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
                  {competitor.name} in Nepal
                </h3>
                <p className="text-sm text-slate-500">
                  The best local alternative
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white">
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700"
          >
            Compare All Plans <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
