import CapabilitiesSection from "@/components/marketing/features/capabilities-section";
import UseCases from "@/components/marketing/use-cases/use-cases";
import CTA from "@/components/marketing/cta-section/cta-section";
import { capitalizeWords } from "@/lib/string-utils";

interface CitiesLandingPageProps {
  category: string;
  city: string;
}

export const CitiesLandingPage: React.FC<CitiesLandingPageProps> = ({
  category,
  city,
}) => {
  const cityName = capitalizeWords(city);
  const categoryName = capitalizeWords(category.replace("-", " "));

  return (
    <div className="flex flex-col">
      {/* Custom SEO Hero */}
      <section className="mx-auto max-w-7xl py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Best {categoryName} in {cityName}
          </div>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl">
            Launch your professional {categoryName.toLowerCase()} in {cityName}{" "}
            with Nepdora. The fastest, AI-powered way to grow your business
            online in Nepal.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-slate-900">
                Why build your {categoryName.toLowerCase()} in {cityName} with Nepdora?
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  At Nepdora, we understand the unique business landscape of {cityName}. 
                  Whether you are a startup or an established enterprise, our platform 
                  provides the specific tools you need to succeed in the local {cityName} market.
                </p>
                <p>
                  From integrated local payment gateways like eSewa and Khalti to 
                  partnership with local logistics providers, we ensure your {categoryName.toLowerCase()} 
                  is fully optimized for the Nepalese audience.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    `Localized SEO for ${cityName} searches`,
                    "Mobile-first design for high performance",
                    "Integrated Nepalese payment systems",
                    "24/7 Local support and onboarding",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
               <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                 <span className="text-slate-400 font-medium italic">Empowering {cityName} Businesses</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <CapabilitiesSection />

      <UseCases />
      <CTA />
    </div>
  );
};
