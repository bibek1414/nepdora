import CapabilitiesSection from "@/components/marketing/features/capabilities-section";
import UseCases from "@/components/marketing/use-cases/use-cases";
import CTA from "@/components/marketing/cta-section/cta-section";
import { capitalizeWords } from "@/lib/string-utils";
import { INDUSTRY_CONTENT } from "@/constants/marketing-content";

interface CitiesLandingPageProps {
  category: string;
  city: string;
}

export const CitiesLandingPage: React.FC<CitiesLandingPageProps> = ({
  category,
  city,
}) => {
  const cityName = capitalizeWords(city);
  const content = INDUSTRY_CONTENT[category] || {
    title: `Best ${capitalizeWords(category.replace("-", " "))} in ${cityName}`,
    description: `Launch your professional ${category.toLowerCase()} in ${cityName} with Nepdora. The fastest, AI-powered way to grow your business online in Nepal.`,
    benefits: [
      `Localized SEO for ${cityName} searches`,
      "Mobile-first design for high performance",
      "Integrated Nepalese payment systems",
      "24/7 Local support and onboarding",
    ],
    features: [
      "AI-Powered Templates",
      "Drag-and-Drop Editor",
      "Local Hosting in Nepal",
      "Integrated CRM System",
    ],
    whyUs: `At Nepdora, we understand the unique business landscape of ${cityName}. Our platform provides the specific tools you need to succeed in the local ${cityName} market.`,
    heroImageAlt: `Empowering ${cityName} Businesses`,
  };

  return (
    <div className="flex flex-col">
      {/* Custom SEO Hero */}
      <section className="mx-auto max-w-7xl py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-slate-900 md:text-6xl lg:text-5xl">
            {content.title} <span className="text-primary">in {cityName}</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 md:text-xl lg:text-2xl">
            {content.description}
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">
                Why choose Nepdora for your{" "}
                {capitalizeWords(category.replace("-", " "))}?
              </h2>
              <div className="space-y-6 text-lg text-slate-600">
                <p>{content.whyUs}</p>
                <p>
                  We ensure your {category.replace("-", " ")} is fully optimized
                  for the Nepalese audience, with local payment gateways like
                  eSewa and Khalti built-in.
                </p>
                <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
                  {content.benefits.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="group hover:shadow-primary/5 relative aspect-4/3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-8 text-center transition-transform group-hover:scale-105">
                <div className="bg-primary/10 text-primary mb-4 h-20 w-20 rounded-2xl p-4">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold text-slate-900">
                  Built for Nepal
                </span>
                <p className="mt-2 text-slate-500">{content.heroImageAlt}</p>
              </div>
              <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-tr to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold text-slate-900 md:text-4xl">
            Key Features Included
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.features.map((feature, i) => (
              <div
                key={i}
                className="hover:border-primary/20 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-primary/5 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CapabilitiesSection />

      <UseCases />
      <CTA />
    </div>
  );
};
