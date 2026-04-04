import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GLOSSARY_TERMS } from "@/constants/glossary";
import { buildMarketingMetadata } from "@/lib/seo";
import { BookOpen, MoveRight, HelpCircle, Info, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({
    term: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  const item = GLOSSARY_TERMS.find((t) => t.slug === term);

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
  const item = GLOSSARY_TERMS.find((t) => t.slug === term);

  if (!item) return notFound();

  return (
    <div className="bg-white min-h-screen">
      <section className="py-24 border-b border-slate-100 bg-slate-50">
        <div className="container mx-auto max-w-4xl px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 mb-10 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Glossary of Terms</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
            {item.term}
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed font-medium">
            {item.definition}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="prose prose-slate prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <HelpCircle className="w-8 h-8 text-primary" />
                Detailed Explanation
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed mb-12">
                {item.detailedExplanation}
            </p>

            <div className="p-8 rounded-[32px] bg-slate-900 text-white space-y-6">
                <h3 className="text-2xl font-bold text-primary">Why it matters for your business in Nepal</h3>
                <p className="text-slate-400">
                    Understanding these terms is the first step toward building a successful online presence. Whether you're in Kathmandu or Pokhara, having a secure, fast-loading website with a clear domain name and local payment integration is essential for growth.
                </p>
                <Link 
                    href="/create-website"
                    className="inline-flex items-center gap-3 text-white font-bold border-b-2 border-primary pb-1 hover:gap-5 transition-all"
                >
                    Start building with Nepdora
                    <MoveRight className="w-5 h-5 text-primary" />
                </Link>
            </div>
          </div>

          {/* Other Terms */}
          <div className="mt-24 border-t border-slate-100 pt-16">
            <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-8">Related Terms</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GLOSSARY_TERMS.filter(t => t.slug !== term).map(t => (
                    <Link key={t.slug} href={`/glossary/${t.slug}`} className="p-6 rounded-2xl border border-slate-200 hover:border-primary hover:bg-slate-50 transition-all flex items-center justify-between group">
                        <span className="font-bold text-slate-900 uppercase italic tracking-tighter">{t.term}</span>
                        <MoveRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
