import CTASection from "@/components/marketing/cta-section/cta-section";

interface CityCTAProps {
  cityName: string;
  category: string;
}

export const CityCTA: React.FC<CityCTAProps> = ({ cityName, category }) => (
  <CTASection cityName={cityName} category={category} />
);
