import CountdownAnimation from "@/components/marketing/about-us/hero-section";
import AboutUs from "@/components/marketing/about-us/about-us";
import OurStrengths from "@/components/marketing/about-us/our-strengths";
import CustomerTestimonials from "@/components/marketing/testimonials/testimonials";
import Technology from "@/components/marketing/about-us/techonology-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Nepdora | Empowering Innovation and Creativity",
  description:
    "Learn more about Nepdora — our mission, technology, and commitment to empowering creators and businesses with innovative digital solutions.",
};

export default function AboutPage() {
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
