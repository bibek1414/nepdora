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
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";
interface Props {
  params: Promise<{ slug: string }>;
}

function getCityFromSlug(slug: string) {
  const parts = slug.split("-");
  const potentialCity = parts[parts.length - 1].toLowerCase();

  // Find which list the potential city belongs to
  const city =
    MAJOR_CITIES.find(c => c === potentialCity) ||
    NEPAL_CITIES.find(c => c.toLowerCase() === potentialCity);

  if (city) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    const slugWithoutCity = parts.slice(0, -1).join("-").toLowerCase();

    // Find the item that matches the industry keyword
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

    // Fallback to first item if no industry match but city is valid
    if (!item) item = BEST_OF_DATA[0];

    return { item, cityName, isDynamic: true };
  }

  const item = BEST_OF_DATA.find(i => i.slug === slug);
  return { item, cityName: null, isDynamic: false };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  BEST_OF_DATA.forEach(item => {
    // Add the original slug
    params.push({ slug: item.slug });

    // Multi-industry support for cities (Pre-render major cities)
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

  // Remove duplicates
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
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tool.rating,
            reviewCount: "100",
          },
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="bestof-schema" data={bestOfSchema} />
      {/* ── Hero ── */}
      <section className="border-b border-slate-100 pt-28 pb-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-16 md:grid-cols-2">
            {/* left */}
            <div>
              <p className="mb-4 text-sm font-medium text-slate-400">
                Expert Picks · {cityName || "Nepal"}
              </p>
              <h1 className="mb-6 text-4xl leading-[1.1] font-semibold tracking-tight text-slate-900 md:text-5xl">
                {displayTitle}
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-slate-500">
                {displayDescription}
              </p>
            </div>

            {/* right: how we pick */}
            <div className="md:pt-12">
              <p className="mb-5 text-xs font-semibold tracking-widest text-slate-400">
                How we pick
              </p>
              <ul className="space-y-4">
                {[
                  "Hands-on testing with real Nepali business scenarios",
                  "Local payment support — eSewa, Khalti, and more",
                  "Rated on performance, ease of use, and value",
                  "Updated regularly as tools evolve",
                ].map(point => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Context strip ── */}
      <section className="border-b border-slate-100 py-14">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-400">
                The story
              </p>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">
                Why most tools fail Nepali businesses — and what we looked for
                instead.
              </h2>
              <p className="text-base leading-relaxed text-slate-500">
                Global tools are built for global markets. That means missing
                payment gateways, poor local support, and feature sets that
                don't match how businesses in Nepal actually operate. We tested
                with that in mind.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
              {[
                { label: "Tools tested", value: "40+" },
                { label: "Hours of research", value: "200+" },
                { label: "Businesses consulted", value: "30+" },
                { label: "Categories covered", value: "12" },
              ].map(stat => (
                <div key={stat.label} className="bg-white px-6 py-6">
                  <p className="mb-1 text-2xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Rankings ── */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <p className="mb-2 text-sm font-medium text-slate-400">
            The rankings
          </p>
          <h2 className="mb-10 text-2xl font-semibold text-slate-900">
            Our top picks, ranked
          </h2>

          <div className="space-y-5">
            {item.ranking.map((tool, idx) => (
              <article
                key={tool.name}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  tool.isNepdora
                    ? "border-slate-900 shadow-[0_2px_20px_rgba(0,0,0,0.07)]"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {/* Top bar */}
                <div
                  className={`flex items-center justify-between border-b px-7 py-4 ${
                    tool.isNepdora
                      ? "border-slate-900 bg-slate-900"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        tool.isNepdora ? "text-white/30" : "text-slate-300"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        tool.isNepdora ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {tool.name}
                    </span>
                    {tool.isNepdora && (
                      <span className="rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-semibold text-white/70">
                        Editor's choice
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(tool.rating)
                            ? "fill-amber-400 text-amber-400"
                            : tool.isNepdora
                              ? "text-white/15"
                              : "text-slate-200"
                        }`}
                      />
                    ))}
                    <span
                      className={`ml-1.5 text-xs font-semibold tabular-nums ${
                        tool.isNepdora ? "text-white/50" : "text-slate-400"
                      }`}
                    >
                      {tool.rating}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="bg-white px-7 py-6">
                  <p className="mb-7 max-w-2xl text-sm leading-relaxed text-slate-500">
                    {tool.description}
                  </p>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <p className="mb-3 text-[10px] font-semibold tracking-[0.15em] text-emerald-600">
                        Pros
                      </p>
                      <ul className="space-y-2.5">
                        {tool.pros.map(pro => (
                          <li
                            key={pro}
                            className="flex items-start gap-2.5 text-sm text-slate-600"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-3 text-[10px] font-semibold tracking-[0.15em] text-rose-500">
                        Cons
                      </p>
                      <ul className="space-y-2.5">
                        {tool.cons.map(con => (
                          <li
                            key={con}
                            className="flex items-start gap-2.5 text-sm text-slate-400"
                          >
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-slate-100 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-10 rounded-2xl border px-10 py-14 md:flex-row md:items-center md:px-14">
            <div>
              <p className="bg-primary/90 mb-3 w-fit rounded-full px-2 py-1 text-sm font-medium text-white">
                Built for {cityName || "Nepal"}
              </p>
              <h2 className="mb-3 max-w-sm text-2xl leading-tight font-semibold text-black md:text-3xl">
                Your success in {cityName || "Nepal"} starts here.
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-slate-600">
                We've tested these tools so you don't have to. Nepdora is
                locally optimized for {cityName || "Nepal"} businesses in ways
                global competitors simply cannot match.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-6">
              <div className="flex gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="text-center text-[10px] leading-tight font-medium text-slate-500">
                    Verified
                    <br />
                    payments
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                    <Zap className="h-5 w-5 text-sky-400" />
                  </div>
                  <span className="text-center text-[10px] leading-tight font-medium text-slate-500">
                    Lightning
                    <br />
                    speed
                  </span>
                </div>
              </div>
              <Link href="/admin/sign-up">
                <Button className="rounded-lg px-6 py-3 font-semibold transition-colors">
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
