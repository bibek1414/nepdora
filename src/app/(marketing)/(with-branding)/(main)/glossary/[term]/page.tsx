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
  ShieldCheck,
  Globe,
  Lock,
  Smartphone,
  Server,
  ArrowRight,
} from "lucide-react";
import { MarketingPageHero } from "@/components/marketing/shared/MarketingPageHero";

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

const TermMockup = ({ slug }: { slug: string }) => {
  if (slug === "what-is-ssl-certificate") {
    return (
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl p-8 w-full max-w-[280px]">
           <div className="flex items-center gap-2 mb-6 text-green-600 font-bold text-xs uppercase tracking-widest">
              <Lock className="h-4 w-4" />
              Secure Connection
           </div>
           <div className="h-3 w-1/2 bg-slate-50 rounded mb-4" />
           <div className="space-y-2">
              <div className="h-10 w-full rounded-xl bg-slate-50 border border-slate-100 flex items-center px-4 gap-2">
                 <div className="h-2 w-2 rounded-full bg-green-500" />
                 <div className="h-2 w-2/3 bg-slate-200 rounded" />
              </div>
           </div>
        </div>
      </div>
    );
  }
  
  if (slug === "what-is-a-domain-name") {
    return (
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        <div className="bg-slate-900 rounded-[32px] shadow-2xl p-8 w-full max-w-[320px] text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Globe className="h-24 w-24" />
           </div>
           <div className="relative z-10">
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Domain Search</div>
              <div className="h-12 w-full rounded-2xl bg-white/10 border border-white/20 flex items-center px-4 mb-4">
                 <span className="text-sm font-bold opacity-80">my-brand.com.np</span>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full inline-block">
                 Available for Rs. 0
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (slug === "what-is-a-payment-gateway") {
    return (
      <div className="relative h-full flex flex-col items-center justify-center p-8">
         <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl p-6 w-full max-w-[280px]">
             <div className="h-4 border-b border-slate-100 mb-6 flex items-center gap-1">
                <div className="h-1 w-8 bg-slate-50" />
             </div>
             <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-primary bg-primary/5">
                   <div className="h-6 w-6 rounded-lg bg-green-600 flex items-center justify-center text-[10px] font-bold text-white">e</div>
                   <div className="h-1.5 w-16 bg-slate-200 rounded" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                   <div className="h-6 w-6 rounded-lg bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">k</div>
                   <div className="h-1.5 w-16 bg-slate-200 rounded" />
                </div>
             </div>
         </div>
      </div>
    );
  }

  // Default: Hosting/Tech feel
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8">
       <div className="bg-slate-50 rounded-[32px] border border-slate-200 shadow-xl p-8 w-full max-w-[300px]">
          <div className="flex items-center gap-3 mb-8">
             <Server className="h-6 w-6 text-primary" />
             <div className="h-2 w-24 bg-slate-200 rounded" />
          </div>
          <div className="space-y-4">
             <div className="h-2 w-full bg-slate-200 rounded" />
             <div className="h-2 w-5/6 bg-slate-200 rounded" />
             <div className="flex justify-between items-center mt-6">
                <div className="h-8 w-8 bg-primary/20 rounded-full" />
                <div className="h-2 w-16 bg-primary/20 rounded" />
             </div>
          </div>
       </div>
    </div>
  );
};

export default function GlossaryTermPage({ params }: Props) {
  return (
    <ResolvedGlossaryTermPage params={params} />
  );
}

// Separate component for resolved params to use hooks or keep it clean
async function ResolvedGlossaryTermPage({ params }: Props) {
  const { term } = await params;
  const item = GLOSSARY_TERMS.find(t => t.slug === term);

  if (!item) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <MarketingPageHero
        badgeText="Tech Glossary"
        badgeIcon={BookOpen}
        title={item.term}
        description={item.definition}
        breadcrumbs={[
           { label: "Glossary", href: "/glossary" },
           { label: item.term, href: `/glossary/${term}` },
        ]}
      />

      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Content Area */}
            <div className="prose prose-slate prose-lg max-w-none">
              <div className="mb-12">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
                       <HelpCircle className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 m-0">Detailed Explanation</h2>
                 </div>
                 <p className="text-xl leading-relaxed text-slate-500 font-medium italic mb-12">
                   "{item.detailedExplanation}"
                 </p>
              </div>

              <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-10 text-white shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <ShieldCheck className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-primary text-2xl font-bold mb-6">
                    Why it matters in Nepal
                  </h3>
                  <p className="text-slate-400 mb-8 max-w-md font-medium">
                    Understanding these terms is the first step toward building a
                    successful online presence. Whether you're in Kathmandu or
                    Pokhara, having a secure, fast-loading website is essential for growth.
                  </p>
                  <Link
                    href="/create-website"
                    className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-xl transition-all hover:scale-105"
                  >
                    Start building with Nepdora
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Visual Mockup Area */}
            <div className="relative min-h-[400px]">
               <div className="absolute inset-0 bg-primary/5 rounded-[56px] blur-3xl" />
               <TermMockup slug={term} />
            </div>
          </div>

          {/* Other Terms */}
          <div className="mt-32 pt-24 border-t border-slate-200">
            <h4 className="mb-12 text-sm font-bold tracking-widest text-slate-400 uppercase">
              Keep Exploring
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {GLOSSARY_TERMS.filter(t => t.slug !== term).map(t => (
                <Link
                  key={t.slug}
                  href={`/glossary/${t.slug}`}
                  className="group flex flex-col justify-between rounded-[32px] border border-slate-200 bg-white p-8 transition-all hover:border-primary hover:shadow-2xl hover:shadow-primary/5"
                >
                  <span className="mb-6 block text-xl font-bold tracking-tight text-slate-900 uppercase italic">
                    {t.term}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-all group-hover:text-primary group-hover:gap-3">
                     Learn More
                     <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

