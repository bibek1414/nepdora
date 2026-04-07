import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { buildMarketingMetadata } from "@/lib/seo";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Receipt,
  Zap,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_COMPETITORS.map(c => ({
    slug: `from-${c.slug}-to-nepdora`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const competitorSlug = slug.replace("from-", "").replace("-to-nepdora", "");
  const competitor = ALL_COMPETITORS.find(c => c.slug === competitorSlug);

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
  const competitor = ALL_COMPETITORS.find(c => c.slug === competitorSlug);

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
    },
  } as any;

  const comp = comparisonData[competitorSlug] || {
    fees: "Varies (High for Nepal)",
    payments: "Unreliable in Nepal",
    support: "None in Local Context",
    speed: "Average",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <section className="border-b border-slate-100 bg-slate-50/50 pt-32 pb-24">
        <div className="container mx-auto max-w-7xl px-4">
          <Link
            href="/switch"
            className="hover:text-primary mb-8 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-slate-500 uppercase transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Migration Center
          </Link>

          <div className="flex flex-col items-center justify-center gap-12 text-center md:flex-row md:gap-24 md:text-left">
            <div className="flex-1 space-y-4">
              <h2 className="text-4xl font-black text-slate-400 italic">
                {competitor.name}
              </h2>
              <div className="h-1 w-full rounded-full bg-slate-200" />
            </div>
            <div className="flex-none rounded-full border-4 border-white bg-slate-900 p-4 shadow-xl shadow-slate-200">
              <ArrowSmallRight className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-primary text-4xl font-black italic">
                Nepdora
              </h2>
              <div className="bg-primary h-1 w-full rounded-full" />
            </div>
          </div>
          <h1 className="mt-16 text-center text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            The better choice for <span className="text-primary">Nepal.</span>
          </h1>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="overflow-hidden rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-100">
            <div className="grid grid-cols-3 bg-slate-900 p-8 text-center text-lg font-bold tracking-widest text-white uppercase">
              <div>Feature</div>
              <div className="opacity-50">{competitor.name}</div>
              <div className="text-primary">Nepdora</div>
            </div>

            {[
              {
                label: "Local Payments",
                comp: <XCircle className="mx-auto h-6 w-6 text-rose-500" />,
                nepdora: (
                  <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
                ),
              },
              {
                label: "Nepali Support",
                comp: <XCircle className="mx-auto h-6 w-6 text-rose-500" />,
                nepdora: (
                  <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
                ),
              },
              {
                label: "Price (NPR)",
                comp: <Receipt className="mx-auto h-6 w-6 text-slate-400" />,
                nepdora: (
                  <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
                ),
              },
              {
                label: "Local Logistics",
                comp: <XCircle className="mx-auto h-6 w-6 text-rose-500" />,
                nepdora: (
                  <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
                ),
              },
              {
                label: "Speed in Nepal",
                comp: "Average",
                nepdora: "Optimized",
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 border-b border-slate-100 p-8 text-center font-semibold text-slate-800 transition-colors last:border-0 hover:bg-slate-50"
              >
                <div className="text-left font-bold text-slate-400">
                  {row.label}
                </div>
                <div>{row.comp}</div>
                <div className="text-primary font-black">{row.nepdora}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Values */}
      <section className="border-y border-slate-100 bg-slate-50 py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="space-y-8 rounded-[48px] border border-slate-200 bg-white p-12 shadow-sm">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-2xl">
                <CreditCard className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-3xl leading-none font-black tracking-tight text-slate-900 uppercase italic">
                Seamless Payments
              </h3>
              <p className="text-xl leading-relaxed text-slate-600">
                While {competitor.name} requires international gateways or
                complex plugins, Nepdora has native eSewa, Khalti, and Fonepay
                integrations. Your customers pay with what they use every day.
              </p>
            </div>
            <div className="space-y-8 rounded-[48px] border border-slate-200 bg-white p-12 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10">
                <Zap className="h-8 w-8 text-sky-500" />
              </div>
              <h3 className="text-3xl leading-none font-black tracking-tight text-slate-900 uppercase italic">
                80% Cheaper
              </h3>
              <p className="text-xl leading-relaxed text-slate-600">
                Stop losing money on $30+ international subscriptions and
                transaction fees. Nepdora is priced for Nepal, with plans
                starting at zero NPR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="ring-primary/20 relative overflow-hidden rounded-[72px] bg-slate-950 p-8 text-white ring-4 md:p-24">
            <ShieldCheck className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rotate-12 opacity-5" />
            <div className="relative z-10">
              <h2 className="mb-8 text-4xl leading-none font-black italic md:text-7xl">
                Make the jump today.
              </h2>
              <p className="mx-auto mb-12 max-w-xl text-xl text-slate-400">
                Take the first step towards a truly local digital presence. Join
                thousands of Nepali businesses on Nepdora.
              </p>
              <Link
                href="/create-website"
                className="bg-primary shadow-primary/30 rounded-full px-12 py-6 text-xl font-black text-white uppercase italic shadow-2xl transition-all hover:scale-110 active:scale-95"
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
  );
}
