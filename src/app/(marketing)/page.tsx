import HeroSection from "@/components/marketing/hero-section/hero-section";
import FeaturesSection from "@/components/marketing/features-section/features-section";
import ProcessSection from "@/components/marketing/process-section/process-section";
import PricingSection from "@/components/marketing/pricing-section/pricing-section";
import TestimonialsSection from "@/components/marketing/testimonials/testimonials";
import FAQSection from "@/components/marketing/faq-section/faq-section";
import ContactSection from "@/components/marketing/contact-us/contact-us";

import BuildYourWay from "@/components/marketing/build-your-way/build-your-way";
import StatsSection from "@/components/marketing/stats-section/stats-section";
import AISection from "@/components/marketing/ai-section/ai-section";
import TemplatesPage from "@/components/marketing/templates/templates-page";
export default function Marketing() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <PricingSection />
      <FeaturesSection />
      <ProcessSection />
      <BuildYourWay />
      <AISection />
      <TemplatesPage />
      <TestimonialsSection />
      <ContactSection />
      <FAQSection />
    </div>
  );
}
