import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BEST_OF_DATA } from "@/constants/best-of";
import { buildMarketingMetadata } from "@/lib/seo";
import { MAJOR_CITIES } from "@/lib/seo-data";
import { NEPAL_CITIES } from "@/constants/nepal-cities";
import {
  Star,
  Check,
  X,
  ShieldCheck,
  Zap,
  ChevronRight,
  Clock3,
  BarChart3,
  BadgeCheck,
  Slash,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const COMPARISON_ROWS = [
  { key: "bestFor", label: "Best for" },
  { key: "pricing", label: "Pricing" },
  { key: "localPayments", label: "Local payments" },
  { key: "easeOfUse", label: "Ease of use" },
  { key: "support", label: "Support" },
  { key: "idealFor", label: "Ideal if" },
] as const;

function getCityFromSlug(slug: string) {
  const parts = slug.split("-");
  const potentialCity = parts[parts.length - 1].toLowerCase();

  const city =
    MAJOR_CITIES.find(c => c === potentialCity) ||
    NEPAL_CITIES.find(c => c.toLowerCase() === potentialCity);

  if (city) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    const slugWithoutCity = parts.slice(0, -1).join("-").toLowerCase();

    let item = BEST_OF_DATA.find(i => {
      if (slugWithoutCity.includes("restaurant"))
        return i.slug.includes("restaurant");
      if (slugWithoutCity.includes("ecommerce"))
        return i.slug.includes("ecommerce");
      if (slugWithoutCity.includes("clothing"))
        return i.slug.includes("clothing");
      if (slugWithoutCity.includes("educational-consultancy"))
        return i.slug.includes("educational-consultancy");
      return i.slug === slugWithoutCity;
    });

    if (!item) item = BEST_OF_DATA[0];

    return { item, cityName, isDynamic: true };
  }

  const item = BEST_OF_DATA.find(i => i.slug === slug);
  return { item, cityName: null, isDynamic: false };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  BEST_OF_DATA.forEach(item => {
    params.push({ slug: item.slug });

    const industries = [
      { key: "restaurant", prefix: "website-builders-for-restaurants" },
      { key: "ecommerce", prefix: "website-builders-for-ecommerce" },
      { key: "clothing", prefix: "website-builders-for-clothing-store" },
      {
        key: "educational-consultancy",
        prefix: "website-builders-for-educational-consultancy",
      },
    ];

    const currentIndustry = industries.find(ind => item.slug.includes(ind.key));
    if (currentIndustry) {
      MAJOR_CITIES.forEach(city => {
        const citySlug = `${currentIndustry.prefix}-${city.toLowerCase()}`;
        params.push({ slug: citySlug });
      });
    }
  });

  return Array.from(new Set(params.map(p => p.slug))).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { item, cityName } = getCityFromSlug(slug);

  if (!item) return notFound();

  const displayTitle = cityName
    ? item.title.replace(/Kathmandu|Nepal/gi, cityName)
    : item.title;

  const displayDesc = cityName
    ? item.description.replace(/Kathmandu|Nepal/gi, cityName)
    : item.description;

  return buildMarketingMetadata({
    title: `${displayTitle} | Best for Nepal`,
    description: `${displayDesc} Expert analysis of the top tools to build and grow your digital brand in ${cityName || "Nepal"}.`,
    path: `/best/${slug}`,
    ogLabel: "Expert Recommendations",
  });
}

export default async function BestOfPage({ params }: Props) {
  const { slug } = await params;
  const { item, cityName } = getCityFromSlug(slug);

  if (!item) return notFound();

  const displayTitle = cityName
    ? item.title
        .replace(/Kathmandu|Nepal/gi, cityName)
        .replace("Best Website Builders", "Best Website Builder")
    : item.title;

  const displayDescription = cityName
    ? item.description.replace(/Kathmandu|Nepal/gi, cityName)
    : item.description;

  const bestOverall = item.ranking[0];
  const budgetPick =
    item.ranking.find(tool => tool.pricing.toLowerCase().includes("npr")) ||
    item.ranking[item.ranking.length - 1];
  const easiestPick =
    item.ranking.find(tool => tool.easeOfUse === "Easy") || item.ranking[0];
  const bestDesignPick =
    item.ranking.find(tool => tool.bestFor.toLowerCase().includes("design")) ||
    item.ranking[Math.min(1, item.ranking.length - 1)];

  const pageUrl = absoluteUrl(`/best/${slug}`);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Best of Nepal",
        item: absoluteUrl("/best"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: displayTitle,
        item: pageUrl,
      },
    ],
  };

  const bestOfSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: displayTitle,
    description: displayDescription,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(),
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Top Tools",
      itemListElement: item.ranking.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: tool.name,
          description: tool.description,
          applicationCategory: "BusinessApplication",
        },
      })),
    },
  };

  return (
    <div className="selection:bg-primary/10 selection:text-primary min-h-screen bg-white font-sans">
      <JsonLd id="bestof-schema" data={bestOfSchema} />
      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema} />

      {/* Breadcrumb */}
      <div className="bg-white pt-6 pb-4">
        <div className="container mx-auto max-w-6xl px-6">
          <Breadcrumbs
            items={[
              { label: "Best of Nepal", href: "/best" },
              { label: displayTitle, href: `/best/${slug}` },
            ]}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-[1.25fr_0.9fr]">
            <div>
              <div className="border-primary/10 bg-primary/5 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                Expert Picks · {cityName || "Nepal"}
              </div>
              <h1 className="mb-6 text-4xl leading-[1.1] font-bold tracking-tighter text-slate-900 md:text-5xl">
                {displayTitle}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed font-medium text-slate-500">
                {displayDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  Updated {item.lastUpdated}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500">
                  <BadgeCheck className="h-4 w-4 text-slate-400" />
                  Reviewed by Nepdora editorial team
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500">
                  <BarChart3 className="h-4 w-4 text-slate-400" />
                  Local-business weighted scoring
                </div>
              </div>
            </div>

            {/* Quick Decision Panel */}
            <div className="-sm rounded-3xl border border-slate-200 bg-white p-6">
              <p className="mb-4 text-xs font-medium text-slate-400">
                Quick decision
              </p>
              <div className="space-y-4">
                {[
                  {
                    label: "Best overall",
                    value: bestOverall.name,
                    note: bestOverall.bestFor,
                  },
                  {
                    label: "Best budget pick",
                    value: budgetPick.name,
                    note: budgetPick.pricing,
                  },
                  {
                    label: "Easiest to launch",
                    value: easiestPick.name,
                    note: easiestPick.easeOfUse,
                  },
                  {
                    label: "Best for branding",
                    value: bestDesignPick.name,
                    note: bestDesignPick.bestFor,
                  },
                ].map(summary => (
                  <div
                    key={summary.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <p className="text-xs font-medium text-slate-400">
                      {summary.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {summary.value}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed font-medium text-slate-500">
                      {summary.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="border-t border-slate-100 py-14">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-400">
                Methodology
              </p>
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                What we weighted before ranking these tools
              </h2>
              <p className="text-base leading-relaxed font-medium text-slate-500">
                We prioritized features that materially affect Nepali
                businesses: local payments, launch speed, support quality, and
                whether the tool fits how teams actually operate in{" "}
                {cityName || "Nepal"}.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                {[
                  { label: "Tools tested", value: item.toolsTested },
                  { label: "Hours reviewed", value: item.hoursResearched },
                  {
                    label: "Businesses consulted",
                    value: item.businessesConsulted,
                  },
                  { label: "Shortlisted", value: String(item.ranking.length) },
                ].map(stat => (
                  <div key={stat.label} className="bg-white px-6 py-6">
                    <p className="mb-1 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="mb-5 text-xs font-medium text-slate-400">
                Scoring framework
              </p>
              <div className="space-y-4">
                {item.scoring.map(metric => (
                  <div key={metric.label}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-slate-700">
                        {metric.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {metric.weight}
                      </span>
                    </div>
                    <div className="h-2 rounded-full border border-slate-100 bg-white">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: metric.weight }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <p className="mb-2 text-sm font-medium text-slate-400">
            Comparison matrix
          </p>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Best when you need to compare before you commit
          </h2>
          <p className="mb-10 max-w-3xl text-base leading-relaxed font-medium text-slate-500">
            Cards are good for nuance. Tables are better for decisions. This
            matrix surfaces the differences most teams ask about first.
          </p>

          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-white">
                      Criteria
                    </th>
                    {item.ranking.map(tool => (
                      <th
                        key={tool.name}
                        className="min-w-[210px] px-5 py-4 text-left text-sm font-semibold text-white"
                      >
                        <div className="flex items-center gap-2">
                          <span>{tool.name}</span>
                          {tool.isNepdora && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80">
                              Top pick
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {COMPARISON_ROWS.map(row => (
                    <tr key={row.key} className="align-top">
                      <th className="bg-slate-50 px-5 py-4 text-left text-sm font-semibold text-slate-700">
                        {row.label}
                      </th>
                      {item.ranking.map(tool => (
                        <td
                          key={`${tool.name}-${row.key}`}
                          className="px-5 py-4 text-sm leading-relaxed font-medium text-slate-600"
                        >
                          {tool[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Rankings Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <p className="mb-2 text-sm font-medium text-slate-400">
            The rankings
          </p>
          <h2 className="mb-10 text-2xl font-bold text-slate-900">
            Our top picks, ranked
          </h2>

          <div className="space-y-6">
            {item.ranking.map((tool, idx) => (
              <article
                key={tool.name}
                className={`overflow-hidden rounded-3xl border transition-all duration-200 ${
                  tool.isNepdora
                    ? "-md border-slate-900 bg-white"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300"
                }`}
              >
                <div
                  className={`border-b px-6 py-6 ${
                    tool.isNepdora
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            tool.isNepdora
                              ? "bg-white/10 text-white/80"
                              : "border border-slate-200 bg-white text-slate-600"
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            tool.isNepdora
                              ? "bg-white/10 text-white/80"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tool.bestFor}
                        </span>
                        {tool.isNepdora && (
                          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white/80">
                            Editor's choice
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-2xl font-bold ${
                          tool.isNepdora ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {tool.name}
                      </h3>
                      <p
                        className={`mt-3 text-base leading-relaxed font-medium ${
                          tool.isNepdora ? "text-white/70" : "text-slate-500"
                        }`}
                      >
                        {tool.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(tool.rating)
                                ? "fill-amber-400 text-amber-400"
                                : tool.isNepdora
                                  ? "text-white/20"
                                  : "text-slate-200"
                            }`}
                          />
                        ))}
                        <span
                          className={`ml-1.5 text-sm font-semibold ${
                            tool.isNepdora ? "text-white/60" : "text-slate-500"
                          }`}
                        >
                          {tool.rating}/5
                        </span>
                      </div>
                      <div className="grid gap-2 text-sm">
                        {[
                          { label: "Pricing", value: tool.pricing },
                          {
                            label: "Local payments",
                            value: tool.localPayments,
                          },
                          { label: "Ease", value: tool.easeOfUse },
                        ].map(detail => (
                          <div
                            key={detail.label}
                            className={`rounded-2xl px-4 py-3 ${
                              tool.isNepdora
                                ? "bg-white/5"
                                : "border border-slate-100 bg-white"
                            }`}
                          >
                            <p
                              className={`text-[11px] font-semibold ${
                                tool.isNepdora
                                  ? "text-white/50"
                                  : "text-slate-400"
                              }`}
                            >
                              {detail.label}
                            </p>
                            <p
                              className={`mt-1 font-medium ${
                                tool.isNepdora
                                  ? "text-white/85"
                                  : "text-slate-700"
                              }`}
                            >
                              {detail.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="mb-3 text-[10px] font-semibold text-slate-500">
                      Ideal if
                    </p>
                    <p className="text-sm leading-relaxed font-medium text-slate-600">
                      {tool.idealFor}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                      <p className="mb-3 text-[10px] font-semibold text-emerald-600">
                        Pros
                      </p>
                      <ul className="space-y-2.5">
                        {tool.pros.map(pro => (
                          <li
                            key={pro}
                            className="flex items-start gap-2.5 text-sm font-medium text-slate-600"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
                      <p className="mb-3 text-[10px] font-semibold text-rose-500">
                        Cons
                      </p>
                      <ul className="space-y-2.5">
                        {tool.cons.map(con => (
                          <li
                            key={con}
                            className="flex items-start gap-2.5 text-sm font-medium text-slate-400"
                          >
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tool.cta && tool.ctaUrl && (
                      <Link href={tool.ctaUrl}>
                        <Button className="w-full rounded-xl px-5 py-6 font-semibold">
                          {tool.cta}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="pb-32">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="-xl relative overflow-hidden rounded-[64px] border border-slate-100 bg-white px-8 py-24 text-center text-black">
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="mb-8 max-w-4xl text-5xl leading-[0.9] font-semibold tracking-tighter">
                Your success in {cityName || "Nepal"} starts here.
              </h2>
              <p className="mx-auto mb-12 max-w-xl text-xl font-medium text-slate-600">
                If you want the shortest path to a site that actually works for{" "}
                {cityName || "Nepal"}, start with the option that fits your
                payment flow, support expectations, and growth stage now.
              </p>
              <Link href="/admin/signup">
                <Button className="bg-primary -2xl rounded-full px-12 py-6 text-lg font-semibold transition-all hover:scale-105 active:scale-95">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
