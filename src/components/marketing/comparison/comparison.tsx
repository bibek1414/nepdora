import { Check, Calculator, ChevronRight } from "lucide-react";
import { CountUpAnimation, FadeInAnimation } from "./comparison-animations";
import Link from "next/link";

interface ComparisonProps {
  platformName?: string;
  city?: string;
}

const Comparison: React.FC<ComparisonProps> = ({
  platformName = "Agency",
  city,
}) => {
  const cityName = city ? city.charAt(0).toUpperCase() + city.slice(1) : "";

  const rows = [
    { feature: "Time to Launch", trad: "3-6 Months", nep: "3 Minutes" },
    { feature: "Initial Cost", trad: "NPR 1,50,000+", nep: "NPR 0 Setup" },
    { feature: "Maintenance", trad: "NPR 5,000+/mo", nep: "NPR 1,500/mo" },
    {
      feature: "SEO Strategy",
      trad: `Hire ${platformName}`,
      nep: "Automated AI",
    },
    { feature: "Updates", trad: "Billable Hours", nep: "Instant Prompt" },
  ];

  return (
    <section
      id="comparison"
      className="overflow-hidden bg-white py-12 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-12 lg:gap-16">
          <div className="flex-1">
            <FadeInAnimation direction="x">
              <h2 className="mb-4 text-2xl leading-tight font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
                Stop Paying More
              </h2>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
                Traditional development is slow, expensive, and fragile. Nepdora
                replaces {platformName.toLowerCase()} in {cityName || "Nepal"}{" "}
                with intelligent automation. Get a website in minutes, not
                months.
              </p>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:rounded-2xl sm:p-8">
                <div className="mb-4 flex items-center gap-2.5 sm:gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-900 shadow-sm sm:p-2">
                    <Calculator size={16} className="sm:h-[18px] sm:w-[18px]" />
                  </div>
                  <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase sm:text-xs sm:tracking-widest">
                    You will save
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                    NPR
                  </span>

                  <span className="ml-2 text-3xl font-bold tracking-tight text-slate-700 sm:text-4xl md:text-5xl">
                    <CountUpAnimation end={245000} duration={2} />
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/website-developer-nepal"
                  className="group hover:text-primary inline-flex items-center gap-2 text-sm text-slate-900 transition-colors"
                >
                  Detailed Comparison: Nepdora vs Hiring a Developer
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </FadeInAnimation>
          </div>

          <div className="w-full flex-1">
            <FadeInAnimation delay={0.2}>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
                <div className="grid grid-cols-3 gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
                  <div className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase sm:text-xs sm:tracking-widest">
                    Metric
                  </div>
                  <div className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase sm:text-xs sm:tracking-widest">
                    {platformName}
                  </div>
                  <div className="text-[10px] font-semibold tracking-wide text-slate-700 uppercase sm:text-xs sm:tracking-widest">
                    Nepdora
                  </div>
                </div>

                <div className="px-4 py-2 sm:px-6">
                  {rows.map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 items-center gap-3 border-b border-slate-100 py-4 last:border-0 sm:gap-4 sm:py-5"
                    >
                      <div className="text-xs font-medium text-slate-700 sm:text-sm">
                        {row.feature}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                        <span className="line-through decoration-slate-300">
                          {row.trad}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 sm:text-sm">
                        <Check
                          size={12}
                          className="text-slate-700 sm:h-3.5 sm:w-3.5"
                        />{" "}
                        {row.nep}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
