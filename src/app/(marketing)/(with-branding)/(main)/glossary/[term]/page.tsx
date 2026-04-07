import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GLOSSARY_TERMS } from "@/constants/glossary";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  BookOpen,
  ChevronRight,
  HelpCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";

interface Props {
  params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map(t => ({
    term: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  const item = GLOSSARY_TERMS.find(t => t.slug === term);

  if (!item) return notFound();

  return buildMarketingMetadata({
    title: `${item.term} | Definition and Explanation | Nepdora Glossary`,
    description: `What is ${item.term}? ${item.definition} Learn more about web terms in Nepal with our complete glossary.`,
    path: `/glossary/${term}`,
    ogLabel: "Tech Glossary",
  });
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params;
  const item = GLOSSARY_TERMS.find(t => t.slug === term);

  if (!item) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <Breadcrumbs
            items={[
              { label: "Glossary", href: "/glossary" },
              { label: item.term, href: `/glossary/${term}` },
            ]}
          />

          <div className="bg-primary/10 border-primary/20 text-primary mt-12 mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
            <BookOpen className="h-4 w-4" />
            <span>Glossary of Terms</span>
          </div>
          <h1 className="mb-8 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            {item.term}
          </h1>
          <p className="text-2xl leading-relaxed font-medium text-slate-600">
            {item.definition}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="prose prose-slate prose-lg max-w-none">
            <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold">
              <HelpCircle className="text-primary h-8 w-8" />
              Detailed Explanation
            </h2>
            <p className="mb-12 text-xl leading-relaxed text-slate-700">
              {item.detailedExplanation}
            </p>

            <div className="space-y-6 rounded-[32px] bg-slate-900 p-8 text-white">
              <h3 className="text-primary text-2xl font-bold">
                Why it matters for your business in Nepal
              </h3>
              <p className="text-slate-400">
                Understanding these terms is the first step toward building a
                successful online presence. Whether you're in Kathmandu or
                Pokhara, having a secure, fast-loading website with a clear
                domain name and local payment integration is essential for
                growth.
              </p>
              <Link
                href="/create-website"
                className="border-primary inline-flex items-center gap-3 border-b-2 pb-1 font-bold text-white transition-all hover:gap-5"
              >
                Start building with Nepdora
                <ChevronRight className="text-primary h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Other Terms */}
          <div className="mt-24 border-t border-slate-100 pt-16">
            <h4 className="mb-8 text-lg font-bold tracking-widest text-slate-400 uppercase">
              Related Terms
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {GLOSSARY_TERMS.filter(t => t.slug !== term).map(t => (
                <Link
                  key={t.slug}
                  href={`/glossary/${t.slug}`}
                  className="hover:border-primary group flex items-center justify-between rounded-2xl border border-slate-200 p-6 transition-all hover:bg-slate-50"
                >
                  <span className="font-bold tracking-tighter text-slate-900 uppercase italic">
                    {t.term}
                  </span>
                  <ChevronRight className="group-hover:text-primary h-5 w-5 text-slate-300 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
