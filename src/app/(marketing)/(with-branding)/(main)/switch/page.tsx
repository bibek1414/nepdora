import { Metadata } from "next";
import Link from "next/link";
import { ALL_COMPETITORS } from "@/constants/competitors";
import { buildMarketingMetadata } from "@/lib/seo";
import { MoveRight, ArrowLeftRight, CreditCard, ShieldAlert, BadgePercent, Zap } from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Switch to Nepdora | Migrate Your Website Seamlessly | Nepal",
  description: "Tired of Shopify's high fees or Wix's payment issues in Nepal? Switch to Nepdora. Local payments, lower costs, and expert migration support.",
  path: "/switch",
  ogLabel: "Migration Hub",
});

export default function SwitchHubPage() {
  const topCompetitors = ["shopify", "wix", "wordpress", "squarespace"];
  const featuredCompetitors = ALL_COMPETITORS.filter(c => topCompetitors.includes(c.slug));

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold mb-6">
              <ArrowLeftRight className="w-4 h-4" />
              <span>Migration Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 italic">
              Stop overpaying. <br />
              <span className="text-primary not-italic tracking-tight">Start growing in Nepal.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Global builders aren't built for Nepal. We are. Experience local payment integrations, 24/7 Nepali support, and up to 80% lower costs when you migrate to Nepdora.
            </p>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <CreditCard className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-4">Local Payment Issues?</h3>
                <p className="text-slate-500">Struggling with international payment gateways? Nepdora comes with eSewa, Khalti, and Fonepay built-in.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <BadgePercent className="w-10 h-10 text-green-500 mb-6" />
                <h3 className="text-xl font-bold mb-4">High Subscription Fees?</h3>
                <p className="text-slate-500">Stop paying $30+/month for basic features. Our plans start at a fraction of that cost, tailored for the Nepali economy.</p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <ShieldAlert className="w-10 h-10 text-orange-500 mb-6" />
                <h3 className="text-xl font-bold mb-4">Complex to Use?</h3>
                <p className="text-slate-500">WordPress too technical? Shopify too rigid? Nepdora offers the perfect balance of power and simplicity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Paths */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-5xl font-black mb-16 text-center">Compare & Switch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCompetitors.map((c) => (
              <Link 
                key={c.slug}
                href={`/switch/from-${c.slug}-to-nepdora`}
                className="group p-8 rounded-3xl bg-slate-800 border border-slate-700 hover:border-primary hover:bg-slate-800/50 transition-all text-center"
              >
                <div className="text-slate-500 mb-4 font-bold text-xs uppercase tracking-widest">Migrate from</div>
                <h3 className="text-2xl font-black mb-8 group-hover:text-primary transition-colors">{c.name}</h3>
                <div className="flex items-center justify-center gap-2 text-primary font-bold">
                    View Comparison
                    <MoveRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h4 className="text-slate-500 font-bold mb-8">OTHER PLATFORMS WE SUPPORT MIGRATION FROM:</h4>
            <div className="flex flex-wrap justify-center gap-4 opacity-50">
                {ALL_COMPETITORS.filter(c => !topCompetitors.includes(c.slug)).slice(0, 8).map(c => (
                    <Link key={c.slug} href={`/switch/from-${c.slug}-to-nepdora`} className="px-4 py-2 rounded-lg bg-slate-800 hover:opacity-100 transition-opacity">
                        {c.name}
                    </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-white p-12 rounded-[40px] border border-slate-200 shadow-xl">
             <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="w-10 h-10 text-primary" />
             </div>
             <div>
                <h2 className="text-3xl font-bold mb-4">Want us to handle the migration?</h2>
                <p className="text-slate-600 text-lg mb-0">
                    Our expert team can help you move your existing products, customers, and design from any platform to Nepdora in less than 48 hours.
                </p>
             </div>
             <Link 
                href="/contact"
                className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold whitespace-nowrap hover:bg-slate-800 transition-all shrink-0"
             >
                Talk to Migration Expert
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
