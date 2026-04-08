import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import { WalletCards, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";

import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Accept eSewa & Khalti Payments Online in Nepal | One-Click Setup",
  description:
    "Integrate eSewa, Khalti, IME Pay, and ConnectIPS into your website instantly. No coding required with Nepdora's payment solution.",
  path: "/solutions/accept-esewa-payments-online",
});

const solutionSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Online Payment Integration Nepal",
  description:
    "Native integration for eSewa, Khalti, and major wallets for websites in Nepal.",
  provider: {
    "@type": "Organization",
    name: "Nepdora",
    url: absoluteUrl(),
  },
};

export default function AcceptPaymentsSolution() {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="payment-solution-schema" data={solutionSchema} />

      <StandardMarketingHero
        badgeText="Native integrations"
        badgeIcon={WalletCards}
        title={
          <>
            Accept <span className="text-[#60BB46]">eSewa</span> &{" "}
            <span className="text-[#5C2D91]">Khalti</span> hassle-free.
          </>
        }
        description="Selling products online in Nepal shouldn't be hard. Our platform comes with pre-integrated payment gateways so you can start making money from day one."
        centered
      />

      <section className="bg-slate-50 py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-slate prose-lg mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Supported payment methods
            </h2>
            <p className="font-medium text-slate-500">
              Nepdora provides the most comprehensive payment support for the
              Nepalese market, ensuring your customers can pay you using their
              preferred wallet or bank.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                "eSewa Mobile Wallet",
                "Khalti Payment Gateway",
                "IME Pay",
                "ConnectIPS (Bank Transfers)",
                "Fonepay QR",
                "Prabhu Pay",
              ].map(item => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2 className="h-5 w-5 text-sky-600" />
                  <span className="font-bold text-slate-900">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StandardMarketingCTA
        title="Ready to start accepting payments?"
        description="Join thousands of Nepali businesses already growing with Nepdora. One-click setup, zero coding."
        buttonText="Get started for free"
        buttonHref="/pricing"
      />
    </main>
  );
}
