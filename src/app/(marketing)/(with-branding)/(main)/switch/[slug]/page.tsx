import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { buildMarketingMetadata } from "@/lib/seo";
import { CheckCircle2, XCircle, MoveRight, Receipt, Zap, ShieldCheck, CreditCard } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_COMPETITORS.map((c) => ({
    slug: `from-${c.slug}-to-nepdora`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const competitorSlug = slug.replace("from-", "").replace("-to-nepdora", "");
  const competitor = ALL_COMPETITORS.find((c) => c.slug === competitorSlug);

  if (!competitor) return notFound();

  return buildMarketingMetadata({
    title: `Switch from ${competitor.name} to Nepdora | Better for Nepal`,
    description: `Compare ${competitor.name} vs Nepdora. Save on fees, enjoy local payments, and get 24/7 Nepali support. Migration guide included.`,
    path: `/switch/${slug}`,
    ogLabel: "Competitor Comparison",
  });
}

export default async function SwitchComparisonPage({ params }: Props) {
  const { slug } = await params;
  const competitorSlug = slug.replace("from-", "").replace("-to-nepdora", "");
  const competitor = ALL_COMPETITORS.find((c) => c.slug === competitorSlug);

  if (!competitor) return notFound();

  const comparisonData = {
    shopify: {
        fees: "$29 - $299 / month + 2% transaction fee",
        payments: "Limited (Mostly International)",
        support: "Email/Chat in English",
        speed: "Global, but slow in Nepal",
    },
    wix: {
        fees: "$17 - $59 / month",
        payments: "Complex Integration for Nepal",
        support: "Knowledge Base / Tickets",
        speed: "Average",
    },
    wordpress: {
        fees: "Free software, but Hosting $10 - $50 / month",
        payments: "Requires Plugins & Technical Know-how",
        support: "Community Forums",
        speed: "Slow without optimization",
    }
  } as any;

  const comp = comparisonData[competitorSlug] || {
    fees: "Varies (High for Nepal)",
    payments: "Unreliable in Nepal",
    support: "None in Local Context",
    speed: "Average",
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Header */}
      <section className="pt-32 pb-24 border-b border-slate-100 bg-slate-50/50">
        <div className="container mx-auto max-w-7xl px-4">
          <Link href="/switch" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 mb-8 hover:text-primary transition-colors uppercase tracking-widest">
            <MoveRight className="w-4 h-4 rotate-180" />
            Back to Migration Center
          </Link>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 text-center md:text-left">
             <div className="flex-1 space-y-4">
                <h2 className="text-4xl text-slate-400 font-black italic">{competitor.name}</h2>
                <div className="w-full h-1 bg-slate-200 rounded-full" />
             </div>
             <div className="flex-none p-4 rounded-full bg-slate-900 border-4 border-white shadow-xl shadow-slate-200">
                <ArrowSmallRight className="w-10 h-10 text-white" />
             </div>
             <div className="flex-1 space-y-4">
                <h2 className="text-4xl text-primary font-black italic">Nepdora</h2>
                <div className="w-full h-1 bg-primary rounded-full" />
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-center mt-16 tracking-tight text-slate-900">
             The better choice for <span className="text-primary">Nepal.</span>
          </h1>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4">
           <div className="rounded-[40px] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-100">
              <div className="grid grid-cols-3 bg-slate-900 p-8 text-white font-bold text-lg uppercase tracking-widest text-center">
                 <div>Feature</div>
                 <div className="opacity-50">{competitor.name}</div>
                 <div className="text-primary">Nepdora</div>
              </div>

              {[
                { label: "Local Payments", comp: <XCircle className="w-6 h-6 text-rose-500 mx-auto" />, nepdora: <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" /> },
                { label: "Nepali Support", comp: <XCircle className="w-6 h-6 text-rose-500 mx-auto" />, nepdora: <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" /> },
                { label: "Price (NPR)", comp: <Receipt className="w-6 h-6 text-slate-400 mx-auto" />, nepdora: <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" /> },
                { label: "Local Logistics", comp: <XCircle className="w-6 h-6 text-rose-500 mx-auto" />, nepdora: <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" /> },
                { label: "Speed in Nepal", comp: "Average", nepdora: "Optimized" },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-3 p-8 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors text-center font-semibold text-slate-800">
                   <div className="text-left font-bold text-slate-400">{row.label}</div>
                   <div>{row.comp}</div>
                   <div className="text-primary font-black">{row.nepdora}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Detailed Values */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="p-12 rounded-[48px] bg-white shadow-sm border border-slate-200 space-y-8">
                 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-primary" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Seamless Payments</h3>
                 <p className="text-xl text-slate-600 leading-relaxed">
                   While {competitor.name} requires international gateways or complex plugins, Nepdora has native eSewa, Khalti, and Fonepay integrations. Your customers pay with what they use every day.
                 </p>
              </div>
              <div className="p-12 rounded-[48px] bg-white shadow-sm border border-slate-200 space-y-8">
                 <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-sky-500" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic uppercase">80% Cheaper</h3>
                 <p className="text-xl text-slate-600 leading-relaxed">
                   Stop losing money on $30+ international subscriptions and transaction fees. Nepdora is priced for Nepal, with plans starting at zero NPR.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
         <div className="container mx-auto max-w-5xl px-4 text-center">
            <div className="p-8 md:p-24 rounded-[72px] bg-slate-950 text-white relative overflow-hidden ring-4 ring-primary/20">
               <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5 rotate-12" />
               <div className="relative z-10">
                  <h2 className="text-4xl md:text-7xl font-black mb-8 leading-none italic">Make the jump today.</h2>
                  <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto">
                    Take the first step towards a truly local digital presence. Join thousands of Nepali businesses on Nepdora.
                  </p>
                  <Link 
                    href="/create-website"
                    className="font-black italic uppercase px-12 py-6 bg-primary text-white rounded-full hover:scale-110 active:scale-95 transition-all text-xl shadow-2xl shadow-primary/30"
                  >
                    Start Free Integration
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

function ArrowSmallRight(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m12 5 7 7-7 7" />
        <path d="M19 12H5" />
      </svg>
    )
}
