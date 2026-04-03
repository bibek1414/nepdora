import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Payment QR Code Generator for Nepal | eSewa, Khalti, FonePay",
  description:
    "Create a professional QR code for your business payments in Nepal. Support for eSewa, Khalti, and FonePay with custom branding.",
  alternates: {
    canonical: absoluteUrl("/tools/qr-code-generator-for-payments"),
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Free Payment QR Code Generator for Nepal | eSewa, Khalti, FonePay",
    description:
      "Create a professional QR code for your business payments in Nepal. Support for eSewa, Khalti, and FonePay with custom branding.",
    url: absoluteUrl("/tools/qr-code-generator-for-payments"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora Payment QR Code Generator",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Payment QR Code Generator for Nepal | eSewa, Khalti, FonePay",
    description:
      "Create a professional QR code for your business payments in Nepal. Support for eSewa, Khalti, and FonePay with custom branding.",
    images: [DEFAULT_OG_IMAGE],
  },
};

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
            <p className="mx-auto max-w-2xl text-xl text-slate-600">
              Download custom branded QR codes for your eSewa, Khalti, or
              FonePay merchant accounts. Make it easy for your customers to pay.
            </p>
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
