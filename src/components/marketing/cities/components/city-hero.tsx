import Link from "next/link";
import { ChevronRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

interface CityHeroProps {
  cityName: string;
  category: string;
  title: string;
  description: string;
  customH1?: string;
  customIntro?: string;
  subHeadline?: string;
  ctaText?: string;
  breadcrumbItems?: { label: string; href: string }[];
}

export const CityHero: React.FC<CityHeroProps> = ({
  cityName,
  category,
  description,
  customH1,
  customIntro,
  subHeadline,
  ctaText,
  breadcrumbItems,
}) => {
  const industryLabel = category.replace(/-/g, " ");

  const heading =
    customH1 || `Grow your ${industryLabel} business in ${cityName}`;

  const intro =
    subHeadline ||
    customIntro ||
    description ||
    `Join local ${industryLabel} businesses in ${cityName} who build and grow online with Nepdora - Nepal's all-in-one website and e-commerce platform.`;

  return (
    <section className="border-b border-slate-100 bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left - text */}
          <div>
            {breadcrumbItems && (
              <div className="px-1">
                <Breadcrumbs items={breadcrumbItems} />
              </div>
            )}

            <h1 className="mb-5 text-4xl leading-tight font-bold tracking-tight text-black sm:text-5xl">
              {heading}
            </h1>

            <p className="mb-8 text-lg leading-relaxed">{intro}</p>

            <Link
              href="/admin/signup"
              className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition hover:-translate-y-1"
            >
              {ctaText || "Start Building Free"}
              <ChevronRight className="h-4 w-4" />
            </Link>

            <p className="mt-3 text-sm">
              <span className="text-red-500">*</span> No credit card required
            </p>
          </div>

          {/* Right - checklist card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <p className="mb-5 text-xs font-bold">What you get</p>
            <ul className="space-y-3.5">
              {[
                `Professional ${industryLabel} website`,
                "eSewa & Khalti payments built in",
                "Google-ready SEO from day one",
                "Mobile-first, fast on every device",
                "Real-time dashboard & analytics",
                "24/7 support in Nepali & English",
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-green-500"
                    strokeWidth={2}
                  />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-6 border-t border-slate-200 pt-6">
              {[
                { label: "100+", sub: "Templates" },
                { label: "5 min", sub: "Setup" },
                { label: "Free", sub: "SSL & domain" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-lg font-bold">{s.label}</p>
                  <p className="text-xs">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
