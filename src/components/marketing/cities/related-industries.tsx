import { SERVICE_CATEGORIES } from "@/constants/nepal-cities";
import Link from "next/link";
import { ArrowRight, Layout } from "lucide-react";
import { capitalizeWords } from "@/lib/string-utils";

interface RelatedIndustriesProps {
  currentCity: string;
  currentIndustry: string;
}

export default function RelatedIndustries({
  currentCity,
  currentIndustry,
}: RelatedIndustriesProps) {
  // Filter out the current industry and handle duplicates
  const seen = new Set();
  const otherIndustries = SERVICE_CATEGORIES.filter((industry) => {
    if (industry.slug === currentIndustry) return false;
    if (seen.has(industry.name)) return false;
    seen.add(industry.name);
    return true;
  }).slice(0, 6);

  if (otherIndustries.length === 0) return null;

  return (
    <section className="bg-white py-20 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900">
            Other Industries in {capitalizeWords(currentCity)}
          </h2>
          <p className="mt-4 text-slate-600">
            Specialized website solutions for every business type in your city.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherIndustries.map((industry) => (
            <Link
              key={industry.slug}
              href={`/${industry.slug}/${currentCity.toLowerCase()}`}
              className="group relative flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <Layout className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {industry.name} {capitalizeWords(currentCity)}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Built-in localized features and 100+ industry templates.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600">
                Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
