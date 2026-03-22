import { Metadata } from "next";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Free Payment QR Code Generator for Nepal | eSewa, Khalti, FonePay",
  description: "Create a professional QR code for your business payments in Nepal. Support for eSewa, Khalti, and FonePay with custom branding.",
};

export default function QRGenerator() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <JsonLd id="tool-schema" data={{ "@context": "https://schema.org", "@type": "WebApplication", "name": "Payment QR Code Generator Nepal" }} />
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Free Payment <span className="text-primary">QR Code</span> Generator
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Download custom branded QR codes for your eSewa, Khalti, or FonePay merchant accounts. 
                    Make it easy for your customers to pay.
                </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 mb-20 text-center">
                <div className="w-48 h-48 bg-slate-100 mx-auto mb-8 rounded-2xl flex items-center justify-center text-slate-400">
                    QR Preview
                </div>
                <p className="text-slate-500 mb-0 italic">QR Generator Engine Loading...</p>
            </div>

            <div className="prose prose-slate max-w-none">
                 <h2 className="text-3xl font-bold mb-6">Why use a custom QR code for your business in Nepal?</h2>
                 <p>
                     Standard QR codes can be boring and easily ignored. A custom QR code from Nepdora 
                     includes your business logo and clear instructions, reducing payment errors 
                     and improving the customer experience at your checkout counter or website.
                 </p>
            </div>
        </div>
      </div>

      <FAQSection />
      <CTASection />
    </main>
  );
}
