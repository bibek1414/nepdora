import CountdownAnimation from "@/components/marketing/about-us/hero-section";
import AboutUs from "@/components/marketing/about-us/about-us";
import OurStrengths from "@/components/marketing/about-us/our-strengths";
import CustomerTestimonials from "@/components/marketing/testimonials/testimonials";
import Technology from "@/components/marketing/about-us/techonology-section";

export default function page() {
  return (
    <>
      <CountdownAnimation />
      <AboutUs />
      <OurStrengths />
      <CustomerTestimonials />
      <Technology />
    </>
  );
}
