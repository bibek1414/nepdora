import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

import { buildMarketingMetadata } from "@/lib/seo";
import { Zap } from "lucide-react";
import Link from "next/link";

export const metadata = buildMarketingMetadata({
  title: "Free Payment QR Code Generator for Nepal | eSewa, Khalti, FonePay",
  description:
    "Create a professional QR code for your business payments in Nepal. Support for eSewa, Khalti, and FonePay with custom branding.",
  path: "/tools/qr-code-generator-for-payments",
  noIndex: true,
  keywords: [
    "qr code generator nepal",
    "esewa qr generator",
    "khalti qr generator",
    "fonepay qr generator",
  ],
});

export default function QRGenerator() {
  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        id="tool-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Payment QR Code Generator Nepal",
        }}
      />
      <div className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Free Payment <span className="text-primary">QR Code</span>{" "}
              Generator
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-slate-600 mb-12">
              Download custom branded QR codes for your eSewa, Khalti, or
              FonePay merchant accounts. Make it easy for your customers to pay.
            </p>

            {/* Growth Banner */}
            <div className="mb-16 p-6 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group border border-slate-800">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.1),transparent)]" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <Zap className="w-7 h-7 text-white fill-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Automate Your Payments</h3>
                  <p className="text-slate-400 font-bold">Build a website with integrated payment gateways in 2 minutes.</p>
                </div>
              </div>
              <Link 
                href="/create-website"
                className="px-8 py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all relative z-10 shadow-xl"
              >
                Start Free
              </Link>
            </div>
          </div>

          <div className="mb-20 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl">
            <div className="mx-auto mb-8 flex h-48 w-48 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              QR Preview
            </div>
            <p className="mb-0 text-slate-500 italic">
              QR Generator Engine Loading...
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h2 className="mb-6 text-3xl font-bold">
              Why use a custom QR code for your business in Nepal?
            </h2>
            <p>
              Standard QR codes can be boring and easily ignored. A custom QR
              code from Nepdora includes your business logo and clear
              instructions, reducing payment errors and improving the customer
              experience at your checkout counter or website.
            </p>
          </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
