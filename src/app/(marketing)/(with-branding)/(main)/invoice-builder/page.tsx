import { InvoiceBuilder } from "@/components/marketing/tools/invoice-builder";
import { Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { absoluteUrl, buildMarketingMetadata } from "@/lib/seo";
import { InvoiceVisualMock } from "@/components/marketing/tools/invoice-visual-mock";
import Link from "next/link";

export async function generateMetadata() {
  return buildMarketingMetadata({
    title:
      "Free Invoice Generator in Nepal | Create & Download Instant Invoices | Nepdora",
    description:
      "Generate professional invoices instantly for your business in Nepal. Free invoice builder for freelancers, agencies, and small businesses with downloadable, ready-to-use templates.",
    path: "/invoice-builder",
  });
}

export default function InvoiceBuilderPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Nepdora Invoice Builder",
    description: "Free and instant professional invoice builder for Nepal.",
    url: absoluteUrl("/invoice-builder"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="invoice-builder-schema" data={schema} />

      {/* Premium Split Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-28 md:pb-32">
        {/* Decorative Background */}
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 rounded-full blur-[120px]" />

        <div className="relative z-10 container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="border-primary/10 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold">
                Free for all Nepali Businesses
              </div>

              <h1 className="mb-6 text-4xl leading-[1.1] font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Professional <br />
                <span className="text-primary">invoice builder.</span>
              </h1>

              <p className="mb-8 text-lg leading-relaxed font-medium text-slate-500 sm:text-xl">
                Create and download professional invoices instantly. No
                registration required, 100% free, and secured for small
                businesses, freelancers, and agencies in Nepal.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/admin/signup"
                  className="bg-primary hover:bg-primary/90 shadow-primary/20 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Start Invoicing Now
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Quick Features */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                {[
                  "No Signup Required",
                  "GST/VAT Ready",
                  "Custom Branding",
                  "Instant PDF Download",
                ].map(feature => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-slate-600">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Mock */}
            <div className="relative">
              <InvoiceVisualMock />
            </div>
          </div>
        </div>
      </section>

      <div id="builder" className="scroll-mt-20 pb-10">
        <InvoiceBuilder />
        <div className="container mx-auto mt-12 max-w-6xl px-4 text-center">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400">
            This invoice was generated using Nepdora Invoice Builder, a fast and
            modern way to create professional invoices for businesses in Nepal.
          </p>
        </div>
      </div>

      <CTASection cityName="Nepal" category="billing" />
    </main>
  );
}
