import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PRICING_COMPARISON_DATA } from "@/constants/pricing-comparison";

export default function PricingComparisonLinks() {
  const comparisons = Object.values(PRICING_COMPARISON_DATA);

  return (
    <section className="bg-slate-50 py-20 pb-32">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Compare Nepdora with Other Platforms
          </h2>
          <p className="mt-4 text-slate-600">
            See why localized features and NPR pricing make Nepdora the best
            choice for your business in Nepal.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map(item => (
            <Link
              key={item.slug}
              href={`/compare/${item.slug}-and-nepdora`}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
                  Nepdora vs {item.platformName}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Detailed cost & feature comparison
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white">
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
