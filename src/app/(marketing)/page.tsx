import HeroSection from "@/components/marketing/hero-section/hero-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import ProcessSection from "@/components/marketing/process-section/process-section";
import PricingSection from "@/components/marketing/pricing-section/pricing-section";
import TestimonialsSection from "@/components/marketing/testimonials/testimonials";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import StatsSection from "@/components/marketing/stats-section/stats-section";
export default function Marketing() {
  return (
    <div>
      <HeroSection
        title="Website, CRM, Marketing, and Logistics"
        subtitle={{
          regular: "Build Your Website",
          gradient: "In 5 Minutes",
        }}
        description="Ecommerce or Service Website, you can build it in 5 minutes with our AI-powered platform."
        ctaText="Build Your Website Now"
        ctaHref="/signup"
        bottomImage={{
          light: "https://www.launchuicomponents.com/app-light.png",
          dark: "https://www.launchuicomponents.com/app-dark.png",
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
        }}
      />
      <StatsSection />
      <FeaturesSection />
      <ProcessSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}
