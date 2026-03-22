import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Best Online Booking & Appointment Website in Nepal | Nepdora",
  description:
    "Streamline your appointments with a built-in booking system. Perfect for consultants, salons, and service providers. Build your booking website in Nepal today.",
  keywords: [
    "booking website Nepal",
    "appointment system Nepal",
    "Nepdora booking",
    "scheduling software Nepal",
    "online appointments Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/booking-website",
  },
  openGraph: {
    title: "Best Online Booking & Appointment Website in Nepal | Nepdora",
    description:
      "Streamline your appointments with a built-in booking system. Perfect for consultants, salons, and service providers.",
    url: "https://www.nepdora.com/booking-website",
    siteName: "Nepdora",
    images: [
      {
        url: "/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora - Booking and Appointment System",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Online Booking & Appointment Website in Nepal | Nepdora",
    description:
      "Streamline your appointments with a built-in booking system. Build with Nepdora.",
    images: ["/nepdora-image.jpg"],
  },
};

const bookingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Booking Website Builder",
  description:
    "Online booking and appointment scheduling software integrated into professional websites for Nepali businesses.",
  provider: {
    "@type": "Organization",
    name: "Nepdora",
    url: "https://www.nepdora.com",
  },
  areaServed: "NP",
};

export default function Page() {
  return (
    <>
      <JsonLd id="booking-schema" data={bookingSchema} />
      <CitiesLandingPage category="booking" city="nepal" />
    </>
  );
}
