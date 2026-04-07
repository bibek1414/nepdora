import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BEST_OF_DATA } from "@/constants/best-of";
import { buildMarketingMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { ChevronRight, Star, Check, X, ShieldCheck, Zap } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BEST_OF_DATA.map(item => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = BEST_OF_DATA.find(i => i.slug === slug);

  if (!item) return notFound();

  return buildMarketingMetadata({
    title: `${item.title} | Best for Nepal`,
    description: `${item.description} Expert analysis of the top tools to build and grow your digital brand in Nepal.`,
    path: `/best/${slug}`,
    ogLabel: "Expert Recommendations",
  });
}

export default async function BestOfPage({ params }: Props) {
  const { slug } = await params;
  const item = BEST_OF_DATA.find(i => i.slug === slug);

  if (!item) return notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-slate-100 bg-slate-50 pt-24 pb-16">
        <div className="container mx-auto max-w-5xl px-4">
          <Breadcrumbs items={[{ label: item.title, href: `/best/${slug}` }]} />

          <div className="mt-8 max-w-4xl">
            <h1 className="mb-8 text-4xl leading-tight font-black tracking-tight text-slate-900 italic md:text-6xl">
              {item.title}
            </h1>
            <p className="max-w-3xl text-xl leading-relaxed text-slate-600 md:text-2xl">
              {item.description}
            </p>
          </div>
        </div>
      </section>

      {/* Comparison List */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="space-y-16">
            {item.ranking.map((tool, idx) => (
              <div
                key={tool.name}
                className={`relative rounded-[40px] border-2 p-8 transition-all md:p-12 ${
                  tool.isNepdora
                    ? "border-primary bg-primary/5 ring-primary/5 shadow-2xl ring-8"
                    : "border-slate-100 bg-white"
                }`}
              >
                {tool.isNepdora && (
                  <div className="bg-primary absolute -top-6 left-12 rounded-full px-6 py-2 text-xs font-black tracking-widest text-white uppercase shadow-xl">
                    Editor's Choice
                  </div>
                )}

                <div className="mb-10 flex flex-col items-center justify-between gap-8 md:flex-row">
                  <div className="flex items-center gap-6">
                    <div className="text-5xl font-black text-slate-200">
                      {idx + 1}.
                    </div>
                    <div>
                      <h2 className="mb-2 text-3xl font-black tracking-tighter text-slate-900 uppercase italic">
                        {tool.name}
                      </h2>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(tool.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-bold text-slate-500">
                          {tool.rating}/5.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mb-10 border-l-4 border-slate-200 pl-8 text-lg leading-relaxed text-slate-700 italic">
                  {tool.description}
                </p>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black tracking-widest text-green-600 uppercase">
                      The Pros
                    </h4>
                    <ul className="space-y-3">
                      {tool.pros.map(pro => (
                        <li
                          key={pro}
                          className="flex items-start gap-3 font-medium text-slate-600"
                        >
                          <Check className="h-5 w-5 shrink-0 text-green-500" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black tracking-widest text-rose-500 uppercase">
                      The Cons
                    </h4>
                    <ul className="space-y-3">
                      {tool.cons.map(con => (
                        <li
                          key={con}
                          className="flex items-start gap-3 font-medium text-slate-500 opacity-70"
                        >
                          <X className="h-5 w-5 shrink-0 text-rose-400" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-8 text-3xl leading-none font-black tracking-tighter uppercase italic md:text-5xl">
            Your success in Nepal starts here.
          </h2>
          <p className="mb-12 text-xl text-slate-400">
            We've tested these tools so you don't have to. With Nepdora, you get
            a locally-optimized digital hub that global competitors simply
            cannot provide.
          </p>
          <div className="flex justify-center gap-12 border-t border-white/10 pt-12">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="text-primary h-10 w-10" />
              <span className="text-center text-xs font-bold tracking-widest uppercase opacity-50">
                Verified for <br /> Payments
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Zap className="h-10 w-10 text-sky-400" />
              <span className="text-center text-xs font-bold tracking-widest uppercase opacity-50">
                Lightning <br /> Speed
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
