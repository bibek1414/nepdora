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

      <CapabilitiesSection />

      <UseCases />
      <CTA />
    </div>
  );
};
