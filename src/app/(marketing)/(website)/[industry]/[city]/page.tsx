import { Metadata } from "next";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import Link from "next/link";
import { TemplateSection } from "@/components/marketing/templates/template-section";

interface Props {
  params: Promise<{ industry: string; city: string }>;
}

export async function generateStaticParams() {
  // Return empty and use Incremental Static Regeneration (ISR) or on-demand
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, city } = await params;
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  return {
    title: `Best ${industryLabel} Website in ${cityName} | #1 Choice in Nepal`,
    description: `Need a website for your ${industryLabel.toLowerCase()} in ${cityName}? Nepdora provides localized templates, eSewa/Khalti integration, and local SEO to help you rank #1.`,
  };
}

export default async function ProgrammaticIndustryCityPage({ params }: Props) {
  const { industry, city } = await params;
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  // LOCAL CONTENT MAPPING (In real app, this would be a CMS query)
  const cityFeatures: Record<string, string[]> = {
    kathmandu: [
      "KTM Express Delivery Integration",
      "Local Pickup Points in Valley",
    ],
    pokhara: ["Lakeside Booking Engine", "Tourism Specific SEO"],
    default: ["Integrated local payments", "Mobile optimized design"],
  };

  const industryFeatures: Record<
    string,
    { title: string; desc: string; icon: string }[]
  > = {
    restaurant: [
      {
        title: "QR Digital Menu",
        desc: "No more paper menus for your restaurant.",
        icon: "🍴",
      },
      {
        title: "Table Booking",
        desc: "Let customers in " + cityName + " book tables online.",
        icon: "📅",
      },
    ],
    clinic: [
      {
        title: "Doctor Scheduling",
        desc: "Patient appointment portal for " + cityName + " practices.",
        icon: "🩺",
      },
      {
        title: "Medical Blog",
        desc: "Share health tips with your " + cityName + " patients.",
        icon: "📝",
      },
    ],
    default: [
      {
        title: "AI Site Wizard",
        desc: "Get online in " + cityName + " in under 10 minutes.",
        icon: "⚡",
      },
      {
        title: "E-payment Ready",
        desc: "Accept eSewa & Khalti in " + cityName + ".",
        icon: "💳",
      },
    ],
  };

  const localFeatures =
    cityFeatures[city.toLowerCase()] || cityFeatures.default;
  const currentIndustryFeatures =
    industryFeatures[industry] || industryFeatures.default;

  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        id="pseo-industry-city"
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${industryLabel} in ${cityName}`,
        }}
      />

      {/* Dynamic Hero with Specific industry + city markers */}
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <span className="bg-primary/20 text-primary border-primary/30 mb-8 inline-block animate-pulse rounded-full border px-6 py-2 text-sm font-bold">
              #1 {industryLabel} Solution for {cityName} Businesses
            </span>
            <h1 className="mb-8 text-5xl leading-[1.1] font-black tracking-tighter md:text-8xl">
              Empowering{" "}
              <span className="decoration-primary underline decoration-8 underline-offset-8">
                {industryLabel}s
              </span>{" "}
              in <span className="text-primary italic">{cityName}</span>
            </h1>
            <p className="mx-auto mb-12 max-w-3xl text-xl font-light text-slate-400 md:text-2xl">
              The fastest way to grow your {industryLabel.toLowerCase()}{" "}
              business in {cityName}. Localized for the Nepalese market with
              built-in {localFeatures[0]}.
            </p>
            <div className="flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href="/register"
                className="bg-primary hover:bg-primary/90 shadow-primary/20 rounded-full px-10 py-5 text-lg font-black text-white shadow-xl transition-all"
              >
                Start Your {cityName} Website
              </Link>
              <Link
                href="/templates"
                className="rounded-full border border-white/10 bg-white/5 px-10 py-5 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                View {industryLabel} Demo
              </Link>
            </div>
          </div>
        </div>
        <div className="from-primary/20 pointer-events-none absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] via-transparent to-transparent opacity-50" />
      </section>

      {/* Localized "Why Now" Section (Anti-Duplicate) */}
      <section className="border-b border-slate-100 bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-20 lg:grid-cols-2">
              <div>
                <h2 className="mb-8 text-4xl font-bold text-slate-900">
                  Why {industryLabel}s in {cityName} are switching to Nepdora
                </h2>
                <p className="mb-10 text-lg leading-relaxed text-slate-600">
                  Traditional agencies in {cityName} charge too much and take
                  too long. Nepdora gives you a professional{" "}
                  {industryLabel.toLowerCase()} website with market-leading
                  features specifically designed for local {cityName} users.
                </p>
                <div className="grid gap-6">
                  {currentIndustryFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="flex gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-6"
                    >
                      <div className="text-3xl">{f.icon}</div>
                      <div>
                        <h4 className="font-bold text-slate-900">{f.title}</h4>
                        <p className="text-slate-600">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex aspect-square flex-col justify-end rounded-3xl bg-slate-100 p-8">
                    <div className="text-primary mb-2 text-4xl font-black">
                      99%
                    </div>
                    <div className="text-sm leading-tight font-bold tracking-widest text-slate-900 uppercase">
                      Uptime for {cityName} Sites
                    </div>
                  </div>
                  <div className="aspect-3/4 rounded-3xl bg-slate-900 p-8 text-white">
                    <div className="mb-4 text-4xl font-black">SEO</div>
                    <p className="text-slate-400">
                      Optimized for "{industryLabel} in {cityName}" searches.
                    </p>
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="bg-primary aspect-3/4 rounded-3xl p-8 text-white">
                    <div className="mb-4 text-4xl font-black">Rs 0</div>
                    <p className="text-primary-foreground/80">
                      Hosting cost for your {cityName} startup.
                    </p>
                  </div>
                  <div className="flex aspect-square flex-col justify-end rounded-3xl bg-slate-100 p-8">
                    <div className="mb-2 text-4xl font-black text-slate-900">
                      eSewa
                    </div>
                    <div className="text-sm leading-tight font-bold tracking-widest text-slate-500 uppercase">
                      Built-in Payment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Social Proof Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto mb-16 px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900">
            Empowering {cityName}'s Small Businesses
          </h2>
          <p className="text-xl text-slate-600">
            Join thousands of entrepreneurs in {cityName} who chose Nepdora.
          </p>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Localized Testimonial Generator */}
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="rounded-4xl border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-xl"
              >
                <div className="mb-6 flex gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s}>★</span>
                  ))}
                </div>
                <p className="mb-8 text-lg leading-relaxed text-slate-600 italic">
                  "{" "}
                  {i === 1
                    ? `Best decision for our ${industryLabel.toLowerCase()} in ${cityName}.`
                    : i === 2
                      ? `Everything from eSewa to Pathao works perfectly in ${cityName}.`
                      : `Support was amazing and they know the ${cityName} market.`}{" "}
                  "
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-primary flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-bold">
                    {cityName[i % cityName.length]}
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-slate-900 italic">
                      Verified Business
                    </h4>
                    <p className="text-xs text-slate-500">
                      {industryLabel} in {cityName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Specific Templates */}
      <div className="py-12">
        <TemplateSection
          title={`Pick the Perfect ${industryLabel} Template for ${cityName}`}
          category={industry}
        />
      </div>

      <CTASection />
    </main>
  );
}
