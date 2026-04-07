import { StandardMarketingHero } from "@/components/marketing/shared/StandardMarketingHero";
import { StandardMarketingCTA } from "@/components/marketing/shared/StandardMarketingCTA";
import { Truck, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";

import { SITE_NAME, absoluteUrl, buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Delivery & Pathao Integration for E-commerce in Nepal",
  description:
    "Automate your shipping with Pathao and other local delivery partners in Nepal. Integrated logistics tracking for your online store.",
  path: "/solutions/local-delivery-integration-pathao",
});

const solutionSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Local Delivery Integration Nepal",
  description:
    "Automated logistics integration with Pathao and courier services for websites in Nepal.",
  provider: {
    "@type": "Organization",
    name: "Nepdora",
    url: absoluteUrl(),
  },
};

export default function DeliverySolution() {
  const steps = [
    "Order comes in on your website.",
    "Automatic booking with logistics partner.",
    "Customer gets tracking link via SMS.",
    "Status updates automatically in your dashboard.",
  ];

  return (
    <main className="min-h-screen bg-white">
      <JsonLd id="delivery-solution-schema" data={solutionSchema} />
      
      <StandardMarketingHero
        badgeText="Logistics automation"
        badgeIcon={Truck}
        title={
          <>
            Automated <span className="text-sky-600">Pathao</span> & logistics integration.
          </>
        }
        description="Manage your deliveries as easily as your sales. Nepdora integrates directly with Pathao and local courier services to automate your fulfillment."
        centered
      />

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-slate prose-lg mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              How it works
            </h2>
            <div className="mt-12 space-y-6">
              {steps.map((step, index) => (
                <div
                   key={index}
                   className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="font-bold text-slate-900">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StandardMarketingCTA
        title="Ready to automate your shipping?"
        description="Join thousands of Nepali businesses already growing with Nepdora. Deliver faster, grow bigger."
        buttonText="Get started for free"
        buttonHref="/pricing"
      />
    </main>
  );
}
